import { Renderer } from './Renderer.js';
import { CAMERA_ANIMATIONS } from './CameraAnimations.js';

export const renderer = new Renderer(
    document.getElementById('renderer'),
    {
        fov: 75,
        position: { x: 0, y: 5, z: 10 },
        lookAt: { x: 0, y: 0, z: 0 }
    }
);

// Variable para almacenar la velocidad actual
let currentSpeed = 0.05;

// Función para cambiar animación
export function changeAnimation(animationType) {
    console.log(`Cambiando animación a: ${animationType}`);
    
    if (animationType === 'manual') {
        // Cambiar a modo manual
        renderer.setAnimation({ enabled: false });
    } else if (CAMERA_ANIMATIONS[animationType]) {
        // Si viene del modo manual, preservar la posición actual como punto de inicio
        if (!renderer.animationConfig.enabled) {
            renderer.animationConfig.time = 0;
        }
        renderer.setAnimation({
            enabled: true,
            speed: currentSpeed,
            ...CAMERA_ANIMATIONS[animationType]
        });
    } else {
        console.warn(`Animación "${animationType}" no encontrada`);
    }
}

// Función para cambiar velocidad
export function changeAnimationSpeed(speed) {
    currentSpeed = speed;
    renderer.setAnimationSpeed(speed);
}

renderer.camera().setPosition(10, 10, 10);
renderer.camera().setLookAt(0, 0, 0);

renderer.addPointLight({
    position: { x: 100, y: 0, z: 0 },
    color: 0xff7777,
    intensity: 10,
    distance: 1000,
    decay: 0.01
});

renderer.addPointLight({
    position: { x: 0, y: 100, z: 0 },
    color: 0x77ff77,
    intensity: 10,
    distance: 1000,
    decay: 0.01
});

renderer.addPointLight({
    position: { x: 0, y: 0, z: 100 },
    color: 0x7777ff,
    intensity: 10,
    distance: 1000,
    decay: 0.01
});

renderer.addPointLight({
    position: { x: -100, y: -100, z: -100 },
    color: 0xffffff,
    intensity: 10,
    distance: 1000,
    decay: 0.01
});

renderer.addAmbientLight({
    color: 0xffffff,
    intensity: 0.5
});

renderer.renderCube({
    position: { x: -3, y: 0, z: 0 },
    size: Math.PI / 2,
    material: {
        color: 0xffffff,
        roughness: 0,
        metalness: 0.99,
        opacity: 0.25,
        transparent: true
    }
});

renderer.renderSphere({
    position: { x: 0, y: 0, z: 0 },
    radius: 1,
    material: {
        color: 0x000000,
        roughness: 0.5,
        metalness: 0.75,
    }
});

renderer.renderCone({
    position: { x: 3, y: 0, z: 0 },
    radius: 1,
    height: Math.PI / 2,
    material: {
        color: 0xffffff,
        roughness: 0,
        metalness: 1
    }
});

// Configuración inicial de animación
renderer.setAnimation({
    enabled: true,
    speed: currentSpeed,
    ...CAMERA_ANIMATIONS.circular
});

// Exponer globalmente para fácil acceso
window.rendererControls = {
    changeAnimation,
    changeAnimationSpeed,
    renderer
};