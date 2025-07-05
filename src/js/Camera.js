// Camera.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export class Camera {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
            position: { x: 5, y: 5, z: 5 },
            lookAt: { x: 0, y: 0, z: 0 },
            ...config
        };

        this.camera = new THREE.PerspectiveCamera(
            this.config.fov,
            this.config.aspect,
            this.config.near,
            this.config.far
        );

        this.updatePosition();
        this.updateLookAt();
    }

    // API fluida para configuración
    setFov(fov) {
        this.config.fov = fov;
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
        return this;
    }

    setAspect(aspect) {
        this.config.aspect = aspect;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        return this;
    }

    setPosition(x, y, z) {
        this.config.position = { x, y, z };
        this.updatePosition();
        return this;
    }

    setLookAt(x, y, z) {
        this.config.lookAt = { x, y, z };
        this.updateLookAt();
        return this;
    }

    // Métodos internos
    updatePosition() {
        this.camera.position.set(
            this.config.position.x,
            this.config.position.y,
            this.config.position.z
        );
    }

    updateLookAt() {
        this.camera.lookAt(
            this.config.lookAt.x,
            this.config.lookAt.y,
            this.config.lookAt.z
        );
    }

    onResize() {
        this.setAspect(window.innerWidth / window.innerHeight);
    }
}