import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { Camera } from './Camera.js';

export class Renderer {
    // Inicializa la cámara, renderer y escena
    constructor(container, cameraConfig = {}) {
        // Camera
        this.cameraInstance = new Camera(cameraConfig);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        // Events
        window.addEventListener('resize', () => this.onWindowResize());

        // Configuración de animación
        this.animationConfig = {
            enabled: false,
            time: 0,
            speed: 0.01,
            position: {
                x: (t) => 5 * Math.sin(t),
                y: (t) => 5,
                z: (t) => 5 * Math.cos(t)
            },
            lookAt: {
                x: (t) => 0,
                y: (t) => 0,
                z: (t) => 0
            }
        };
        
        // Render inicial
        this.render();
        this.animate();
    }

    setAnimation({ enabled = true, speed = 0.01, position, lookAt }) {
        this.animationConfig.enabled = enabled;
        this.animationConfig.speed = speed;
        if (position) this.animationConfig.position = { ...this.animationConfig.position, ...position };
        if (lookAt) this.animationConfig.lookAt = { ...this.animationConfig.lookAt, ...lookAt };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.animationConfig.enabled) {
            this.animationConfig.time += this.animationConfig.speed;
            
            const pos = this.animationConfig.position;
            const look = this.animationConfig.lookAt;
            const t = this.animationConfig.time;
            
            this.cameraInstance.camera.position.set(
                pos.x(t),
                pos.y(t),
                pos.z(t)
            );
            
            this.cameraInstance.camera.lookAt(
                look.x(t),
                look.y(t),
                look.z(t)
            );
        }
        
        this.render();
    }

    // Crea un mesh con geometría y material, y lo añade a la escena
    createMesh(geometry, material, position) {
        const standardMaterial = new THREE.MeshStandardMaterial(material);
        const mesh = new THREE.Mesh(geometry, standardMaterial);
        mesh.position.set(position.x, position.y, position.z);
        mesh.material.side = material.transparent ? THREE.DoubleSide : THREE.FrontSide;
        this.scene.add(mesh);
        this.render();
        return mesh;
    }

    // Crea una luz y la añade a la escena según el tipo y configuración
    createLight(lightType, config) {
        let light;
        switch(lightType) {
            case 'ambient':
                light = new THREE.AmbientLight(config.color, config.intensity);
                break;
            case 'point':
                light = new THREE.PointLight(config.color, config.intensity, config.distance, config.decay);
                if (config.position) {
                    light.position.set(config.position.x, config.position.y, config.position.z);
                }
                break;
        }
        this.scene.add(light);
        this.render();
        return light;
    }

    // API para acceder a la cámara
    camera() {
        return this.cameraInstance;
    }

    // Añade luz ambiental uniforme a la escena
    addAmbientLight({ color, intensity }) {
        return this.createLight('ambient', { color, intensity });
    }

    // Añade luz puntual con posición y configuración específica
    addPointLight({ position, color, intensity, distance, decay }) {
        return this.createLight('point', { position, color, intensity, distance, decay });
    }

    // Renderiza una esfera con posición, radio y material dados
    renderSphere({ position, radius, material }) {
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        return this.createMesh(geometry, material, position);
    }

    // Renderiza un cubo con posición, tamaño y material dados
    renderCube({ position, size, material }) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        return this.createMesh(geometry, material, position);
    }

    // Renderiza un cono con posición, radio, altura y material dados
    renderCone({ position, radius, height, material }) {
        const geometry = new THREE.ConeGeometry(radius, height, 64);
        return this.createMesh(geometry, material, position);
    }

    // Renderiza la escena una sola vez
    render() {
        this.renderer.render(this.scene, this.cameraInstance.camera);
    }

    // Ajusta la cámara y renderer al redimensionar la ventana
    onWindowResize() {
        this.cameraInstance.onResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}