// Renderer.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

export class Renderer {
	// constructor(container, ambientLight, light) {
	constructor(container) {
		// Camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		// Default camera position
		this.camera.position.z = -5;
		this.camera.position.y = 5;
		this.camera.position.x = -5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		// Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(this.renderer.domElement);
		
		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x111111);

		// Configuración por defecto de la cámara
		this.cameraConfig = {
			radius: 5,
			height: 5,
			speed: 0.01,
			functions: {
				x: (t, config) => config.radius * Math.sin(t),
				y: (t, config) => config.height,
				z: (t, config) => config.radius * Math.cos(t)
			}
		};

		// Resize
		window.addEventListener('resize', () => this.onWindowResize());
		
		// Animation
		this.animateLight();
	}

	addAmbientLight({ color, intensity }) {
		const ambientLight = new THREE.AmbientLight(color, intensity);
		this.scene.add(ambientLight);
	}

	addPointLight({ position, color, intensity, distance, decay }) {
		const pointLight = new THREE.PointLight(color, intensity, distance, decay);
		pointLight.position.set(position.x, position.y, position.z);
		this.scene.add(pointLight);
	}

	renderSphere({ position, radius, material }) {
		const geometry = new THREE.SphereGeometry(radius, 64, 64);
		const standardMaterial = new THREE.MeshStandardMaterial(material);
		const mesh = new THREE.Mesh(geometry, standardMaterial);

		mesh.position.set(position.x, position.y, position.z);
		this.scene.add(mesh);
	}

	renderCube({ position, size, material }) {
		const geometry = new THREE.BoxGeometry(size, size, size, 32, 32, 32);
		const standardMaterial = new THREE.MeshStandardMaterial(material);
		const mesh = new THREE.Mesh(geometry, standardMaterial);

		mesh.position.set(position.x, position.y, position.z);
		this.scene.add(mesh);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Método para actualizar la configuración de la cámara
	setCameraConfig(newConfig) {
		this.cameraConfig = { ...this.cameraConfig, ...newConfig };
		if (newConfig.functions) {
			this.cameraConfig.functions = { ...this.cameraConfig.functions, ...newConfig.functions };
		}
	}

	// Método para establecer funciones de movimiento predefinidas
	setCameraPreset(preset) {
		const presets = {
			circular: {
				functions: {
					x: (t, config) => config.radius * Math.sin(t),
					y: (t, config) => config.height,
					z: (t, config) => config.radius * Math.cos(t)
				}
			},
			elliptical: {
				functions: {
					x: (t, config) => config.radius * Math.sin(t),
					y: (t, config) => config.height,
					z: (t, config) => config.radius * 1.5 * Math.cos(t)
				}
			},
			wave: {
				functions: {
					x: (t, config) => config.radius * Math.sin(t),
					y: (t, config) => config.height + 2 * Math.sin(t * 2),
					z: (t, config) => config.radius * Math.cos(t)
				}
			},
			spiral: {
				functions: {
					x: (t, config) => (config.radius + t * 0.1) * Math.sin(t),
					y: (t, config) => config.height + t * 0.1,
					z: (t, config) => (config.radius + t * 0.1) * Math.cos(t)
				}
			}
		};
		
		if (presets[preset]) {
			this.setCameraConfig(presets[preset]);
		}
	}

	animateLight(event) {
		requestAnimationFrame(() => this.animateLight(event));
		if (!event) event = { count: 0 };
		event.count = event.count > 2 * Math.PI ? 0 : event.count + this.cameraConfig.speed;
		
		// Aplicar las funciones de movimiento
		this.camera.position.x = this.cameraConfig.functions.x(event.count, this.cameraConfig);
		this.camera.position.y = this.cameraConfig.functions.y(event.count, this.cameraConfig);
		this.camera.position.z = this.cameraConfig.functions.z(event.count, this.cameraConfig);
		
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.renderer.render(this.scene, this.camera);
	}
}