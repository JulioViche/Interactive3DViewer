import { useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useSceneStore } from '../store'
import { useAnimations } from '../hooks/useAnimations'
import { useSmoothCameraTransition } from '../hooks/useSmoothCameraTransition'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'

export default function Scene() {
  const { camera, scene } = useThree()
  const { 
    rotateSpeed, zoomSpeed, panSpeed, 
    objects, showGrid, 
    originalCameraPosition, originalCameraLookAt,
    currentCameraPosition, currentCameraLookAt,
    mouseControlsEnabled, currentAnimation
  } = useSceneStore()
  const orbitControlsRef = useRef()
  
  // Hook de animaciones
  const { resetAnimation } = useAnimations(camera, orbitControlsRef.current)
  
  // Hook de transiciones suaves
  const { startTransition } = useSmoothCameraTransition(camera, orbitControlsRef.current)

  scene.background = new THREE.Color('#070707')

  // Manejar eventos globales
  useEffect(() => {
    const handleResetCamera = () => {
      if (orbitControlsRef.current) {
        // Resetear el timing interno de la animación
        resetAnimation()
        // Usar transición suave para volver a la posición original
        startTransition(originalCameraPosition, originalCameraLookAt)
      }
    }

    window.addEventListener('resetCamera', handleResetCamera)
    
    return () => {
      window.removeEventListener('resetCamera', handleResetCamera)
    }
  }, [originalCameraPosition, originalCameraLookAt, resetAnimation])

  // Manejar cambios en currentAnimation
  useEffect(() => {
    if (currentAnimation === 'none' && orbitControlsRef.current) {
      // Resetear el timing interno de la animación
      resetAnimation()
      
      // Cuando se detiene una animación, sincronizar los controles con la posición actual
      // Esto es necesario para que los controles del mouse funcionen desde la posición actual
      requestAnimationFrame(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.object.position.copy(camera.position)
          orbitControlsRef.current.target.set(0, 0, 0)
          orbitControlsRef.current.update()
        }
      })
    }
  }, [currentAnimation, resetAnimation, camera])

  const getMaterial = (materialType) => {
    switch (materialType) {
      case 'metal':
        return { color: '#C0C0C0', metalness: 0.9, roughness: 0.1 }
      case 'crystal':
        return { color: '#E0F6FF', metalness: 0.0, roughness: 0.0, transparent: true, opacity: 0.8 }
      case 'plastic':
        return { color: '#FF6B6B', metalness: 0.0, roughness: 0.7 }
      default:
        return { color: 'orange', metalness: 0.5, roughness: 0.3 }
    }
  }

  const renderObject = (obj) => {
    const material = getMaterial(obj.material)
    
    switch (obj.type) {
      case 'cube':
        return (
          <mesh key={obj.id} position={obj.position}>
            <boxGeometry args={[obj.size, obj.size, obj.size]} />
            <meshStandardMaterial {...material} />
          </mesh>
        )
      case 'sphere':
        return (
          <mesh key={obj.id} position={obj.position}>
            <sphereGeometry args={[obj.radius, 16, 16]} />
            <meshStandardMaterial {...material} />
          </mesh>
        )
      case 'cone':
        return (
          <mesh key={obj.id} position={obj.position}>
            <coneGeometry args={[obj.baseRadius, obj.height, 8]} />
            <meshStandardMaterial {...material} />
          </mesh>
        )
      default:
        return null
    }
  }

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enabled={mouseControlsEnabled && currentAnimation === 'none'}
        enablePan={mouseControlsEnabled}
        enableZoom={mouseControlsEnabled}
        enableRotate={mouseControlsEnabled}
        zoomSpeed={zoomSpeed}
        panSpeed={panSpeed}
        rotateSpeed={rotateSpeed}
        minDistance={2}
        maxDistance={50}
      />

      {/* Grid condicional */}
      {showGrid && (
        <Grid
          infiniteGrid={true}
          cellSize={1}
          cellColor="#333333"
          sectionSize={10}
          sectionColor="#777777"
          fadeDistance={200}
          fadeStrength={5}
          position={[0, 0, 0]}
        />
      )}

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#ffffff" />
      
      {/* Renderizar objetos dinámicos */}
      {objects.map(renderObject)}
    </>
  )
}
