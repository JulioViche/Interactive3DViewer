# Interactive 3D Viewer - Documentación Técnica para Colaboradores

## Descripción del Proyecto

Interactive 3D Viewer es una librería de visualización 3D construida sobre Three.js que proporciona una abstracción simplificada para crear escenas interactivas. El proyecto está diseñado con una arquitectura modular que separa responsabilidades entre cámara, renderizado, animaciones y geometrías.

## Arquitectura del Sistema

### Módulos Principales

```
Interactive3DViewer/
├── src/js/
│   ├── main.js              # Entry point - instancia principal del renderer
│   ├── Renderer.js          # Core class - gestión de escena, luces y geometrías
│   ├── Camera.js            # Camera management - configuración estática de cámara
│   ├── CameraAnimations.js  # Animation presets - funciones paramétricas predefinidas
│   └── tests.js            # Development examples - casos de prueba y ejemplos
├── doc/
│   └── README.md           # Technical documentation
└── index.html              # HTML entry point
```

### Responsabilidades por Módulo

#### Renderer.js
- **Core Engine**: Gestión principal de Three.js
- **Scene Management**: Inicialización de escena, luces y objetos
- **Mesh Factory**: Método `createMesh()` para unificar creación de geometrías
- **Light Factory**: Método `createLight()` para gestión de iluminación
- **Animation Loop**: Ciclo principal de animación con funciones paramétricas

#### Camera.js
- **Camera Configuration**: Gestión estática de parámetros de cámara
- **Fluent API**: Métodos encadenables para configuración
- **Viewport Management**: Manejo de redimensionamiento automático

#### CameraAnimations.js
- **Parametric Functions**: Biblioteca de funciones matemáticas para animación
- **Preset Library**: Colección de 15+ animaciones predefinidas
- **Customization Utilities**: Funciones helper para modificar presets existentes

## Patrones de Diseño Implementados

### Factory Pattern
- `createMesh()`: Unifica creación de geometrías con configuración estándar
- `createLight()`: Centraliza creación de diferentes tipos de luces

### Fluent Interface
- Métodos de Camera retornan `this` para encadenamiento
- API intuitiva: `renderer.camera().setPosition(x,y,z).setFov(90)`

### Strategy Pattern
- Sistema de animación basado en funciones intercambiables
- Presets como estrategias predefinidas

## Convenciones de Código

### Naming Conventions
- **Clases**: PascalCase (`Camera`, `Renderer`)
- **Métodos**: camelCase (`setPosition`, `createMesh`)
- **Constantes**: UPPER_SNAKE_CASE (`CAMERA_ANIMATIONS`)
- **Archivos**: camelCase con extensión explícita

### Estructura de Métodos
```javascript
// Configuración estándar para geometrías
render[GeometryType]({ position, [geometry-specific], material }) {
    const geometry = new THREE.[GeometryType]Geometry(...);
    return this.createMesh(geometry, material, position);
}
```

### Parámetros Estándar
- **position**: `{ x: number, y: number, z: number }`
- **material**: Objeto con propiedades Three.js + extensiones
- **color**: Formato hexadecimal (0xff0000)

## Sistema de Animación Técnico

### Arquitectura de Funciones Paramétricas

```javascript
animationConfig = {
    enabled: boolean,
    time: number,        // Contador interno
    speed: number,       // Incremento por frame
    position: {
        x: (t) => function,
        y: (t) => function, 
        z: (t) => function
    },
    lookAt: {
        x: (t) => function,
        y: (t) => function,
        z: (t) => function
    }
}
```

### Ciclo de Animación
1. `requestAnimationFrame` inicia nuevo frame
2. `time += speed` incrementa parámetro temporal
3. Evalúa funciones `position[x,y,z](time)`
4. Evalúa funciones `lookAt[x,y,z](time)`
5. Actualiza posición de cámara
6. Renderiza escena
7. Repite ciclo

## Implementación de Nuevas Funcionalidades

### Añadir Nueva Geometría

1. **Crear método en Renderer.js:**
```javascript
render[NewGeometry]({ position, [specific-params], material }) {
    const geometry = new THREE.[NewGeometry]Geometry([params]);
    return this.createMesh(geometry, material, position);
}
```

2. **Seguir convenciones:**
   - Usar `createMesh()` para consistencia
   - Retornar mesh para manipulación posterior
   - Documentar parámetros específicos

### Añadir Nuevo Tipo de Luz

1. **Extender `createLight()` en Renderer.js:**
```javascript
case 'newLightType':
    light = new THREE.NewLight(config.param1, config.param2);
    // Configuración específica
    break;
```

2. **Crear método wrapper:**
```javascript
addNewLight(config) {
    return this.createLight('newLightType', config);
}
```

### Crear Nuevo Preset de Animación

1. **Añadir a CameraAnimations.js:**
```javascript
export const CAMERA_ANIMATIONS = {
    // ...existing presets
    newPreset: {
        position: {
            x: (t) => mathematical_function,
            y: (t) => mathematical_function,
            z: (t) => mathematical_function
        },
        lookAt: {
            x: (t) => mathematical_function,
            y: (t) => mathematical_function,
            z: (t) => mathematical_function
        }
    }
};
```

2. **Testear con diferentes velocidades:**
   - `speed: 0.01` para movimiento lento
   - `speed: 0.05` para movimiento rápido

## Optimización y Performance

### Estrategias Implementadas

1. **Renderizado Bajo Demanda**
   - Solo renderiza cuando hay cambios
   - Evita ciclos innecesarios

2. **Reutilización de Geometrías**
   - `createMesh()` centraliza configuración
   - Menos duplicación de código

3. **Gestión de Memoria**
   - Dispose automático en `removeObject()`
   - Cleanup de geometrías y materiales

### Métricas de Performance

- **Geometrías por defecto**: 64 segmentos (balance calidad/performance)
- **Frecuencia de animación**: 60 FPS target
- **Renderizado**: Solo cuando `render()` es llamado explícitamente

## Testing y Debugging

### Tests.js como Entorno de Desarrollo

El archivo `tests.js` sirve como:
- **Playground** para nuevas funcionalidades
- **Casos de prueba** para validar cambios
- **Ejemplos** de uso correcto de la API

### Debug de Animaciones

```javascript
// Añadir logging temporal
console.log('Animation state:', {
    time: this.animationConfig.time,
    position: {
        x: pos.x(t), y: pos.y(t), z: pos.z(t)
    }
});
```

### Problemas Comunes

1. **Objetos no visibles**:
   - Verificar iluminación (luz ambiental + puntual)
   - Comprobar colores (evitar negro sobre negro)
   - Validar posición de cámara

2. **Animaciones no funcionan**:
   - Confirmar `enabled: true`
   - Verificar que funciones retornan números válidos
   - Comprobar velocidad (`speed` muy baja puede parecer estático)

## Guidelines para Colaboradores

### Pull Requests

1. **Mantener compatibilidad** con API existente
2. **Añadir tests** en `tests.js` para nuevas funcionalidades
3. **Documentar** nuevos métodos en esta documentación
4. **Seguir convenciones** de naming y estructura

### Code Review Checklist

- [ ] ¿Usa `createMesh()` para geometrías?
- [ ] ¿Usa `createLight()` para luces?
- [ ] ¿Retorna valores apropiados para encadenamiento?
- [ ] ¿Incluye manejo de errores básico?
- [ ] ¿Sigue convenciones de naming?

### Estructura de Commits

```
type(scope): description

feat(renderer): add cylinder geometry support
fix(camera): resolve fov update issue  
docs(animation): update preset documentation
refactor(lights): consolidate light creation logic
```

## Sistema de Animación

### Configuración de Animaciones

El renderer incluye un sistema de animación basado en funciones paramétricas que permite crear movimientos complejos de cámara.

#### `setAnimation(config)`

```javascript
renderer.setAnimation({
    enabled: true,          // Activar/desactivar animación
    speed: 0.02,           // Velocidad de animación
    position: {            // Funciones paramétricas para posición
        x: (t) => 8 * Math.sin(t),
        y: (t) => 5,
        z: (t) => 8 * Math.cos(t)
    },
    lookAt: {              // Funciones paramétricas para punto de enfoque
        x: (t) => 0,
        y: (t) => 0,
        z: (t) => 0
    }
});
```

#### Parámetros

- **enabled**: `boolean` - Activa o desactiva la animación
- **speed**: `number` - Velocidad de incremento del parámetro tiempo
- **position**: `object` - Funciones para X, Y, Z de la posición de cámara
- **lookAt**: `object` - Funciones para X, Y, Z del punto de enfoque

#### Parámetro Tiempo (t)

El parámetro `t` es un valor que se incrementa continuamente según la velocidad configurada:
- `t = 0` al inicio
- `t` aumenta en cada frame según el valor de `speed`
- Se usa como entrada para las funciones paramétricas

### Presets de Animación

#### Importar Presets

```javascript
import { CAMERA_ANIMATIONS, createCustomAnimation } from './CameraAnimations.js';
```

#### Presets Disponibles

| Preset | Descripción |
|--------|-------------|
| `circular` | Movimiento circular básico |
| `elliptical` | Movimiento elíptico |
| `spiral` | Espiral ascendente |
| `figure8` | Movimiento en forma de 8 |
| `wave` | Movimiento ondulante |
| `pendulum` | Movimiento pendular |
| `eccentric` | Órbita excéntrica |
| `snake` | Serpenteante vertical |
| `precession` | Orbital con precesión |
| `clover` | Trébol de tres pétalos |
| `tornado` | Espiral descendente |
| `chaos` | Movimiento caótico |
| `lunar` | Órbita lunar |
| `rollercoaster` | Montaña rusa |
| `dna` | Doble hélice |

#### Usar Presets

```javascript
// Aplicar preset directo
renderer.setAnimation({
    enabled: true,
    speed: 0.02,
    ...CAMERA_ANIMATIONS.spiral
});
```

#### Personalizar Presets

```javascript
const customAnimation = createCustomAnimation(CAMERA_ANIMATIONS.wave, {
    radiusMultiplier: 1.5,  // Escalar radio
    heightOffset: 3,        // Offset en altura
    speedMultiplier: 2,     // Multiplicador de velocidad
    lookAtOffset: { x: 1, y: 0, z: 0 } // Offset del punto de enfoque
});

renderer.setAnimation({
    enabled: true,
    speed: 0.01,
    ...customAnimation
});
```

## Sistema de Iluminación

### Luz Ambiental

Proporciona iluminación uniforme a toda la escena.

```javascript
renderer.addAmbientLight({
    color: 0x404040,    // Color de la luz (hexadecimal)
    intensity: 0.3      // Intensidad (0.0 - 1.0)
});
```

### Luz Puntual

Luz que emana desde un punto específico en todas las direcciones.

```javascript
renderer.addPointLight({
    position: { x: 10, y: 10, z: 10 }, // Posición de la luz
    color: 0xffffff,                   // Color de la luz
    intensity: 1,                      // Intensidad
    distance: 100,                     // Distancia máxima
    decay: 0.1                         // Decaimiento de la luz
});
```

#### Parámetros de Luz Puntual

- **position**: Coordenadas 3D donde se ubica la luz
- **color**: Color en formato hexadecimal
- **intensity**: Intensidad de la luz
- **distance**: Distancia máxima de alcance (0 = infinito)
- **decay**: Tasa de decaimiento con la distancia

## Renderizado de Geometrías

### Método Base: `createMesh()`

Método interno que maneja la creación de meshes con funcionalidades comunes:
- Posicionamiento automático
- Configuración de materiales
- Gestión de transparencias
- Renderizado automático

### Esfera

```javascript
renderer.renderSphere({
    position: { x: 0, y: 0, z: 0 },    // Posición
    radius: 1,                         // Radio
    material: {                        // Configuración de material
        color: 0xff0000,               // Color
        roughness: 0.5,                // Rugosidad (0.0 - 1.0)
        metalness: 0.5,                // Metalicidad (0.0 - 1.0)
        opacity: 1,                    // Opacidad (0.0 - 1.0)
        transparent: false             // Habilitar transparencia
    }
});
```

### Cubo

```javascript
renderer.renderCube({
    position: { x: 0, y: 0, z: 0 },
    size: 2,                          // Tamaño del cubo
    material: {
        color: 0x00ff00,
        roughness: 0.3,
        metalness: 0.7
    }
});
```

### Cono

```javascript
renderer.renderCone({
    position: { x: 0, y: 0, z: 0 },
    radius: 1,                        // Radio de la base
    height: 2,                        // Altura del cono
    material: {
        color: 0x0000ff,
        roughness: 0.4,
        metalness: 0.6
    }
});
```

## Propiedades de Materiales

### Colores

Los colores se especifican en formato hexadecimal:

```javascript
color: 0xff0000    // Rojo
color: 0x00ff00    // Verde
color: 0x0000ff    // Azul
color: 0xffffff    // Blanco
color: 0x000000    // Negro
color: 0x808080    // Gris
```

### Propiedades Físicas

#### Roughness (Rugosidad)
- **Rango**: 0.0 - 1.0
- **0.0**: Superficie perfectamente lisa (muy reflectante)
- **1.0**: Superficie muy rugosa (reflexiones difusas)

#### Metalness (Metalicidad)
- **Rango**: 0.0 - 1.0
- **0.0**: Material no metálico (dieléctrico)
- **1.0**: Material completamente metálico

#### Opacity (Opacidad)
- **Rango**: 0.0 - 1.0
- **0.0**: Completamente transparente
- **1.0**: Completamente opaco
- **Nota**: Requiere `transparent: true` para valores < 1.0

#### Transparent (Transparencia)
- **true**: Habilita el renderizado de transparencia
- **false**: Material opaco (por defecto)

## Ejemplos de Desarrollo

### Configuración de Entorno de Desarrollo

```javascript
// main.js - Configuración básica para desarrollo
import { Renderer } from './Renderer.js';

export const renderer = new Renderer(document.body, {
    fov: 110,
    position: { x: 0, y: 5, z: 10 },
    lookAt: { x: 0, y: 0, z: 0 }
});

// Hacer disponible globalmente para debugging
window.renderer = renderer;
```

### Test de Nueva Funcionalidad

```javascript
// tests.js - Template para testing
import { renderer } from './main.js';
import { CAMERA_ANIMATIONS } from './CameraAnimations.js';

// Setup básico de iluminación
renderer.addAmbientLight({ color: 0x404040, intensity: 0.3 });
renderer.addPointLight({
    position: { x: 10, y: 10, z: 10 },
    color: 0xffffff,
    intensity: 1,
    distance: 100,
    decay: 0.1
});

// Test de geometrías
const testObjects = [
    renderer.renderCube({ 
        position: { x: 0, y: 0, z: 0 }, 
        size: 2, 
        material: { color: 0xff0000, roughness: 0.5, metalness: 0.5 }
    }),
    renderer.renderSphere({ 
        position: { x: -4, y: 0, z: 0 }, 
        radius: 1, 
        material: { color: 0x00ff00, roughness: 0.3, metalness: 0.7 }
    })
];

// Test de animación
renderer.setAnimation({
    enabled: true,
    speed: 0.02,
    ...CAMERA_ANIMATIONS.circular
});

// Debug logging
console.log('Test setup complete:', {
    objects: testObjects.length,
    scene: renderer.scene.children.length
});
```

## Troubleshooting

### Problemas de Renderizado

**Síntoma**: Pantalla negra o objetos no visibles
```javascript
// Debugging checklist
console.log('Camera position:', renderer.camera().camera.position);
console.log('Scene children:', renderer.scene.children.length);
console.log('Lights in scene:', renderer.scene.children.filter(child => child.isLight));

// Test de visibilidad con objeto simple
renderer.renderSphere({
    position: { x: 0, y: 0, z: 0 },
    radius: 2,
    material: { color: 0xff0000, roughness: 0.5, metalness: 0.5 }
});
```

**Síntoma**: Animación no funciona
```javascript
// Debug de animación
renderer.setAnimation({
    enabled: true,
    speed: 0.1, // Velocidad alta para test
    position: {
        x: (t) => { console.log('t:', t); return 5 * Math.sin(t); },
        y: (t) => 5,
        z: (t) => 5 * Math.cos(t)
    },
    lookAt: { x: (t) => 0, y: (t) => 0, z: (t) => 0 }
});
```

### Performance Issues

**Síntoma**: Lag o stuttering
```javascript
// Verificar frecuencia de renderizado
let frameCount = 0;
const originalRender = renderer.render.bind(renderer);
renderer.render = function() {
    frameCount++;
    if (frameCount % 60 === 0) {
        console.log('FPS check - 60 frames rendered');
    }
    return originalRender();
};
```

## Roadmap y Funcionalidades Futuras

### Short Term (Next Version)
- [ ] Soporte para más geometrías (cylinder, torus, plane)
- [ ] Sistema de materiales extendido
- [ ] Controles de cámara interactivos (OrbitControls)
- [ ] Sistema de luces direccionales y spots

### Medium Term
- [ ] Loader para modelos 3D externos
- [ ] Sistema de partículas básico
- [ ] Post-processing effects
- [ ] Animaciones de objetos (no solo cámara)

### Long Term
- [ ] Editor visual de escenas
- [ ] Sistema de físicas básico
- [ ] VR/AR support
- [ ] Plugin architecture

## Contribución al Proyecto

### Setup de Desarrollo

1. **Clone y estructura**:
   ```bash
   git clone [repository]
   cd Interactive3DViewer
   # No hay build process - desarrollo directo en archivos
   ```

2. **Live Server**: Usar extensión Live Server de VS Code o similar

3. **Testing**: Abrir `index.html` y usar console del navegador

### Workflow Recomendado

1. **Feature branch**: `git checkout -b feature/nueva-funcionalidad`
2. **Desarrollo en tests.js**: Probar nueva funcionalidad
3. **Implementar en módulo correspondiente**: Renderer.js, Camera.js, etc.
4. **Actualizar documentación**: Añadir a esta documentación
5. **Pull request**: Con descripción detallada

---

*Documentación técnica para colaboradores - Interactive 3D Viewer v1.0*
