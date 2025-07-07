import { renderer } from './main.js';
import { CAMERA_ANIMATIONS, createCustomAnimation } from './CameraAnimations.js';

// Configurar cámara (opcional)
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
        roughness: 0.15,
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

// Aplicar una animación predefinida
// renderer.setAnimation({
//     enabled: true,
//     speed: 0.05,
//     ...CAMERA_ANIMATIONS.figure8
// });

// Crear animación personalizada
// const customWave = createCustomAnimation(CAMERA_ANIMATIONS.wave, {
//     radiusMultiplier: 1.5,
//     heightOffset: 3,
//     speedMultiplier: 2
// });

// renderer.setAnimation({
//     enabled: true,
//     speed: 0.01,
//     ...customWave
// });