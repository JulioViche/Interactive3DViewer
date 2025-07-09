import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSceneStore } from '../store'

export const useAnimations = (camera, controls) => {
  const { 
    currentAnimation, 
    animationSpeed, 
    setCurrentCameraPosition, 
    setCurrentCameraLookAt 
  } = useSceneStore()
  const clockRef = useRef(0)
  const originalPosition = useRef([8, 8, 8])
  const originalTarget = useRef([0, 0, 0])

  // Guardar posición original cuando se monta el componente
  useEffect(() => {
    if (camera && controls) {
      originalPosition.current = [...camera.position.toArray()]
      originalTarget.current = [...controls.target.toArray()]
    }
  }, [camera, controls])

  // Función para aplicar animaciones en cada frame
  useFrame((state, delta) => {
    if (!camera || !controls || currentAnimation === 'none') return

    clockRef.current += delta * animationSpeed

    switch (currentAnimation) {
      case 'orbit':
        const orbitRadius = 10
        const orbitSpeed = clockRef.current * 0.5
        camera.position.x = Math.cos(orbitSpeed) * orbitRadius
        camera.position.z = Math.sin(orbitSpeed) * orbitRadius
        camera.position.y = 8
        controls.target.set(0, 0, 0)
        break

      case 'swing':
        const swingAngle = Math.sin(clockRef.current) * 0.3
        camera.position.x = originalPosition.current[0] + Math.sin(swingAngle) * 5
        camera.position.z = originalPosition.current[2] + Math.cos(swingAngle) * 5
        camera.position.y = originalPosition.current[1]
        controls.target.set(0, 0, 0)
        break

      case 'zoom':
        const zoomFactor = 5 + Math.sin(clockRef.current) * 3
        const direction = camera.position.clone().normalize()
        camera.position.copy(direction.multiplyScalar(zoomFactor))
        controls.target.set(0, 0, 0)
        break

      case 'spiral':
        const spiralRadius = 8 + Math.sin(clockRef.current * 0.2) * 3
        const spiralSpeed = clockRef.current * 0.7
        const spiralHeight = 5 + Math.sin(clockRef.current * 0.3) * 3
        camera.position.x = Math.cos(spiralSpeed) * spiralRadius
        camera.position.z = Math.sin(spiralSpeed) * spiralRadius
        camera.position.y = spiralHeight
        controls.target.set(0, 0, 0)
        break

      case 'figure8':
        const figure8Scale = 8
        const figure8Speed = clockRef.current * 0.5
        camera.position.x = Math.sin(figure8Speed) * figure8Scale
        camera.position.z = Math.sin(figure8Speed * 2) * figure8Scale * 0.5
        camera.position.y = 8 + Math.cos(figure8Speed * 0.5) * 2
        controls.target.set(0, 0, 0)
        break

      default:
        break
    }

    // Actualizar controles para que las animaciones funcionen correctamente
    controls.update()
    
    // Guardar posición actual en el store para transiciones suaves
    setCurrentCameraPosition(camera.position.toArray())
    setCurrentCameraLookAt(controls.target.toArray())
  })

  // Función para resetear animación
  const resetAnimation = () => {
    clockRef.current = 0
    // No modificar la posición de la cámara aquí, dejar que Scene.jsx maneje las transiciones
  }

  return { resetAnimation }
}
