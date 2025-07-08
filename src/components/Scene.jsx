import { useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useSceneStore } from '../store'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'

export default function Scene() {
  const { scene } = useThree()
  const { rotateSpeed, zoomSpeed, panSpeed, objects, showGrid, originalCameraPosition, originalCameraLookAt } = useSceneStore()
  const orbitControlsRef = useRef()

  scene.background = new THREE.Color('#070707')

  // Manejar reset de cámara
  useEffect(() => {
    const handleResetCamera = () => {
      if (orbitControlsRef.current) {
        // Reset position
        orbitControlsRef.current.object.position.set(...originalCameraPosition)
        
        // Reset target (lookAt)
        orbitControlsRef.current.target.set(...originalCameraLookAt)
        
        // Update controls
        orbitControlsRef.current.update()
      }
    }

    window.addEventListener('resetCamera', handleResetCamera)
    
    return () => {
      window.removeEventListener('resetCamera', handleResetCamera)
    }
  }, [originalCameraPosition, originalCameraLookAt])

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
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
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

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Renderizar objetos dinámicos */}
      {objects.map(renderObject)}
    </>
  )
}
