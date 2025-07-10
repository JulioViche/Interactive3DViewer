import React, { useEffect, useRef, useState } from 'react'
import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { useSceneStore } from '../store'
import { useAnimations } from '../hooks/useAnimations'
import { useSmoothCameraTransition } from '../hooks/useSmoothCameraTransition'
import * as THREE from 'three'
import { TextureLoader } from 'three'

export default function Scene() {
  // Cargar textura de madera si existe
  let woodTexture = null
  try {
    woodTexture = useLoader(TextureLoader, '/textures/wood.jpg')
  } catch (e) {
    woodTexture = null
  }
  const { camera, scene } = useThree()
  const [gridPosition, setGridPosition] = useState([0, 0, 0])
  const {
    rotateSpeed, zoomSpeed, panSpeed,
    objects, showGrid,
    originalCameraPosition, originalCameraLookAt,
    mouseControlsEnabled, currentAnimation,
    selectedObjectId, setSelectedObjectId,
    transformMode,
    updateObject
  } = useSceneStore()
  const orbitControlsRef = useRef()
  
  // Hook de animaciones
  const { resetAnimation } = useAnimations(camera, orbitControlsRef.current)
  
  // Hook de transiciones suaves
  const { startTransition } = useSmoothCameraTransition(camera, orbitControlsRef.current)

  // Actualizar posición del grid de forma suave usando useFrame
  useFrame(() => {
    // Solo actualizar el grid si los controles del mouse están habilitados y no hay animación
    if (mouseControlsEnabled && currentAnimation === 'none') {
      // Intervalo cada 10 unidades para movimiento menos frecuente
      const currentX = Math.round(camera.position.x / 10) * 10
      const currentZ = Math.round(camera.position.z / 10) * 10
      
      setGridPosition(prev => {
        if (prev[0] !== currentX || prev[2] !== currentZ) {
          return [currentX, 0, currentZ]
        }
        return prev
      })
    }
  })

  scene.background = new THREE.Color('#070707')

  // Manejar eventos globales
  useEffect(() => {
    const handleResetCamera = () => {
      if (orbitControlsRef.current) {
        resetAnimation()
        startTransition(originalCameraPosition, originalCameraLookAt)
      }
    }

    window.addEventListener('resetCamera', handleResetCamera)
    
    return () => {
      window.removeEventListener('resetCamera', handleResetCamera)
    }
  }, [originalCameraPosition, originalCameraLookAt, resetAnimation, startTransition])

  // Manejar cambios en currentAnimation
  useEffect(() => {
    if (currentAnimation === 'none' && orbitControlsRef.current) {
      resetAnimation()
      requestAnimationFrame(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.object.position.copy(camera.position)
          // No resetear el target, mantener el actual
          orbitControlsRef.current.update()
        }
      })
    }
  }, [currentAnimation, resetAnimation, camera])

  // Actualizar sensibilidad sin resetear la cámara
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.rotateSpeed = rotateSpeed
      orbitControlsRef.current.zoomSpeed = zoomSpeed
      orbitControlsRef.current.panSpeed = panSpeed
    }
  }, [rotateSpeed, zoomSpeed, panSpeed])

  const getMaterial = (materialType) => {
    switch (materialType) {
      case 'metal':
        return { color: '#CCCCCC', metalness: 0.9, roughness: 0.1 }
      case 'crystal':
        return { color: '#E0F6FF', metalness: 0.5, roughness: 0.0, transparent: true, opacity: 0.25 }
      case 'plastic':
        return { color: '#FF6B6B', metalness: 0.0, roughness: 0.6 }
      case 'gold':
        return { color: '#FFD700', metalness: 0.95, roughness: 0.2 }
      case 'wood':
        if (woodTexture) {
          return { map: woodTexture, color: '#b97a56', metalness: 0.1, roughness: 0.8 }
        } else {
          return { color: '#b97a56', metalness: 0.1, roughness: 0.8 }
        }
      default:
        return { color: '#FF00FF', metalness: 0, roughness: 1 }
    }
  }

  // Seleccionar objeto
  const handleObjectClick = (e, obj) => {
    e.stopPropagation()
    setSelectedObjectId(obj.id)
  }

  // Guardar referencias a los meshes
  const meshRefs = useRef({})
  const saveTimeoutRef = useRef(null)

  // Función de guardado con throttling
  const saveWithThrottle = (objId, meshRef) => {
    // Cancelar el timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // Crear un nuevo timeout para guardar después de 100ms de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      if (meshRef.current) {
        const newPosition = [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z]
        const newRotation = [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z]
        const newScale = [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z]
        
        updateObject(objId, {
          position: newPosition,
          rotation: newRotation,
          scale: newScale
        })
        console.log('Objeto guardado:', { position: newPosition, rotation: newRotation, scale: newScale })
      }
    }, 100)
  }

  // Componente simple con TransformControls
  function SelectableMesh({ obj, isSelected }) {
    const material = getMaterial(obj.material)
    
    if (!meshRefs.current[obj.id]) {
      meshRefs.current[obj.id] = React.createRef()
    }
    const meshRef = meshRefs.current[obj.id]

    const mesh = (
      <mesh 
        ref={meshRef}
        position={obj.position || [0,0,0]}
        rotation={obj.rotation || [0,0,0]}
        scale={obj.scale || [1,1,1]}
        onClick={(e) => handleObjectClick(e, obj)}
      >
        {obj.type === 'cube' && <boxGeometry args={[obj.size, obj.size, obj.size]} />}
        {obj.type === 'sphere' && <sphereGeometry args={[obj.radius, 64, 64]} />}
        {obj.type === 'cone' && <coneGeometry args={[obj.baseRadius, obj.height, 256]} />}
        {obj.type === 'cylinder' && <cylinderGeometry args={[obj.radius, obj.radius, obj.height, 128]} />}
        {obj.type === 'pyramid' && (
          // Pirámide: base cuadrada, 4 lados
          <coneGeometry args={[obj.base, obj.height, 4]} />
        )}
        <meshStandardMaterial {...material} color={isSelected ? '#00ff00' : material.color} map={material.map} />
      </mesh>
    )

    if (isSelected) {
      return (
        <TransformControls
          object={meshRef}
          mode={transformMode}
          onObjectChange={() => {
            // Usar throttling para evitar guardadas excesivas
            saveWithThrottle(obj.id, meshRef)
          }}
        >
          {mesh}
        </TransformControls>
      )
    }

    return mesh
  }

  // Atajos de teclado para modo de transformación
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Solo actuar si hay un objeto seleccionado
      if (!selectedObjectId) return
      // Evitar que los atajos interfieran con inputs/textareas
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return
      const { setTransformMode, removeObject } = useSceneStore.getState()
      switch (event.key.toLowerCase()) {
        case 'g':
          event.preventDefault()
          setTransformMode('translate')
          break
        case 'r':
          event.preventDefault()
          setTransformMode('rotate')
          break
        case 's':
          event.preventDefault()
          setTransformMode('scale')
          break
        case 'escape':
          event.preventDefault()
          setSelectedObjectId(null)
          break
        case 'delete':
        case 'backspace':
        case 'enter':
        case 'return':
          event.preventDefault()
          removeObject(selectedObjectId)
          setSelectedObjectId(null)
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedObjectId, setSelectedObjectId])

  // Renderizado principal sin mesh invisible. Deselección se debe manejar en el Canvas (App.jsx)
  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enabled={mouseControlsEnabled && currentAnimation === 'none' && !selectedObjectId}
        enablePan={mouseControlsEnabled && !selectedObjectId}
        enableZoom={mouseControlsEnabled && !selectedObjectId}
        enableRotate={mouseControlsEnabled && !selectedObjectId}
        minDistance={2}
        maxDistance={50}
      />

      {/* Grid que sigue dinámicamente a la cámara */}
      {showGrid && (
        <Grid
          infiniteGrid={true}
          cellSize={1}
          cellColor="#333333"
          sectionSize={10}
          sectionColor="#777777"
          fadeDistance={1000}
          fadeStrength={10}
          position={gridPosition}
        />
      )}

      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, -10]} intensity={1.5} color="#ffffff"/>
      <directionalLight position={[-10, 7, -10]} intensity={0.5} color="#ffffff"/>
      <pointLight position={[-10, 12, -10]} intensity={0.6} color="#ffffff" />
      
      {/* Renderizar objetos dinámicos y controles de transformación */}
      {objects.map(obj => (
        <SelectableMesh key={obj.id} obj={obj} isSelected={obj.id === selectedObjectId} />
      ))}
    </>
  )

}
