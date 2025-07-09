import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const useSmoothCameraTransition = (camera, controls) => {
  const transitionRef = useRef({
    isTransitioning: false,
    startPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    duration: 1.0 // 1 segundo de transición
  })

  const startTransition = (targetPosition, targetLookAt) => {
    if (!camera || !controls) return

    const transition = transitionRef.current
    
    // Configurar transición
    transition.startPosition.copy(camera.position)
    transition.endPosition.set(...targetPosition)
    transition.startTarget.copy(controls.target)
    transition.endTarget.set(...targetLookAt)
    transition.progress = 0
    transition.isTransitioning = true
  }

  // Función de interpolación suave (easing)
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  useFrame((state, delta) => {
    if (!camera || !controls) return

    const transition = transitionRef.current
    
    if (transition.isTransitioning) {
      transition.progress += delta / transition.duration
      
      if (transition.progress >= 1) {
        // Finalizar transición
        transition.progress = 1
        transition.isTransitioning = false
      }
      
      // Aplicar interpolación suave
      const easedProgress = easeInOutCubic(transition.progress)
      
      // Interpolar posición de la cámara
      camera.position.lerpVectors(
        transition.startPosition,
        transition.endPosition,
        easedProgress
      )
      
      // Interpolar target de los controles
      controls.target.lerpVectors(
        transition.startTarget,
        transition.endTarget,
        easedProgress
      )
      
      controls.update()
    }
  })

  return { startTransition, isTransitioning: transitionRef.current.isTransitioning }
}
