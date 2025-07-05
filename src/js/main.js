import { Renderer } from './Renderer.js';

export const renderer = new Renderer(document.body, {
    fov: 75,
    position: { x: 0, y: 5, z: 10 },
    lookAt: { x: 0, y: 0, z: 0 }
});