import { Renderer } from './Renderer.js';

const container = document.body;
const renderer = new Renderer(container);

renderer.addPointLight({
    position: { x: 10, y: 10, z: 10 },
    color: 0xffffff,
    intensity: 5,
    distance: 100,
    decay: 0.01
});

renderer.addAmbientLight({
    color: 0xffffff,
    intensity: 0.25
});

renderer.renderCube({
    position: { x: 0, y: 0, z: 0 },
    size: 1.5,
    material: {
        color: 0x777777,
        roughness: 0.1,
        metalness: 0.5
    }
});

renderer.renderSphere({
    position: { x: 0, y: 0, z: 0 },
    radius: 3,
    material: {
        color: 0xff0000,
        roughness: 0,
        metalness: 0.75,
        opacity: 0.5,
        transparent: true
    }
});

// Usar un preset
renderer.setCameraPreset('wave');

// Configurar parámetros
renderer.setCameraConfig({
    radius: 10,
    height: 5,
    speed: 0.01
});

// Funciones de movimiento personalizadas (anula el preset)
renderer.setCameraConfig({
    functions: {
        x: (t, config) => config.radius * Math.sin(t) * Math.cos(t * 0.3),
        y: (t, config) => config.height + 3 * Math.sin(t * 1.5),
        z: (t, config) => config.radius * Math.cos(t) * Math.sin(t * 0.3)
    }
});