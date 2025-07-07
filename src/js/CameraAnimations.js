export const CAMERA_ANIMATIONS = {
    // Movimiento circular básico
    circular: {
        position: {
            x: (t) => 8 * Math.sin(t),
            y: (t) => 5,
            z: (t) => 8 * Math.cos(t)
        },
        lookAt: {
            x: (t) => 0,
            y: (t) => 0,
            z: (t) => 0
        }
    },

    // Movimiento en espiral ascendente
    spiral: {
        position: {
            x: (t) => (5 + t * 0.2) * Math.sin(t),
            y: (t) => 3 + t * 0.3,
            z: (t) => (5 + t * 0.2) * Math.cos(t)
        },
        lookAt: {
            x: (t) => 0,
            y: (t) => t * 0.1,
            z: (t) => 0
        }
    },

    // Movimiento pendular
    pendulum: {
        position: {
            x: (t) => 8 * Math.sin(Math.sin(t * 1.5) * 0.8),
            y: (t) => 7,
            z: (t) => 8
        },
        lookAt: {
            x: (t) => 0,
            y: (t) => 0,
            z: (t) => 0
        }
    },

    // Movimiento en órbita excéntrica
    eccentric: {
        position: {
            x: (t) => (6 + 3 * Math.sin(t * 2)) * Math.sin(t),
            y: (t) => 4 + 2 * Math.cos(t * 3),
            z: (t) => (6 + 3 * Math.sin(t * 2)) * Math.cos(t)
        },
        lookAt: {
            x: (t) => Math.sin(t * 0.5),
            y: (t) => 0,
            z: (t) => Math.cos(t * 0.5)
        }
    },

    // Movimiento en espiral descendente
    tornado: {
        position: {
            x: (t) => (12 - t * 0.15) * Math.sin(t * 3),
            y: (t) => 10 - t * 0.1,
            z: (t) => (12 - t * 0.15) * Math.cos(t * 3)
        },
        lookAt: {
            x: (t) => 0,
            y: (t) => 5 - t * 0.05,
            z: (t) => 0
        }
    },

    // Movimiento en órbita lunar
    lunar: {
        position: {
            x: (t) => 8 * Math.sin(t) + 2 * Math.sin(t * 12),
            y: (t) => 5 + Math.sin(t * 12),
            z: (t) => 8 * Math.cos(t) + 2 * Math.cos(t * 12)
        },
        lookAt: {
            x: (t) => 0,
            y: (t) => 0,
            z: (t) => 0
        }
    },

    // Movimiento en espiral con vibración
    vibration: {
        position: {
            x: (t) => 8 * Math.sin(t * 0.1) + 0.5 * Math.sin(t * 20),
            y: (t) => 5 + 1 * Math.sin(t * 20),                
            z: (t) => 8 * Math.cos(t * 0.1) + 0.5 * Math.cos(t * 20)
        },
        lookAt: {
            x: (t) => 0.1 * Math.sin(t * 10),
            y: (t) => 0.1 * Math.cos(t * 15),
            z: (t) => 0.1 * Math.sin(t * 10)
        }
    }

};

// Función helper para aplicar una animación con configuración personalizada
export function createCustomAnimation(baseAnimation, config = {}) {
    const {
        radiusMultiplier = 1,
        heightOffset = 0,
        speedMultiplier = 1,
        lookAtOffset = { x: 0, y: 0, z: 0 }
    } = config;

    return {
        position: {
            x: (t) => baseAnimation.position.x(t * speedMultiplier) * radiusMultiplier,
            y: (t) => baseAnimation.position.y(t * speedMultiplier) + heightOffset,
            z: (t) => baseAnimation.position.z(t * speedMultiplier) * radiusMultiplier
        },
        lookAt: {
            x: (t) => baseAnimation.lookAt.x(t * speedMultiplier) + lookAtOffset.x,
            y: (t) => baseAnimation.lookAt.y(t * speedMultiplier) + lookAtOffset.y,
            z: (t) => baseAnimation.lookAt.z(t * speedMultiplier) + lookAtOffset.z
        }
    };
}