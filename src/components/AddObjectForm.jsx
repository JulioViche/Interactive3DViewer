import { useState, useEffect } from 'react'
import { useSceneStore } from '../store'
import FormField from './FormField'

export default function AddObjectForm() {
  const { addObject } = useSceneStore()
  
  // Estados para drag and drop
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 350, y: 16 })
  
  // Estados del formulario
  const [objectType, setObjectType] = useState('cube')
  const [material, setMaterial] = useState('metal')
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [posZ, setPosZ] = useState(0)
  
  // Propiedades específicas por tipo
  const [cubeSize, setCubeSize] = useState(1)
  const [sphereRadius, setSphereRadius] = useState(1)
  const [coneBaseRadius, setConeBaseRadius] = useState(1)
  const [coneHeight, setConeHeight] = useState(2)

  // Funciones para drag and drop
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleAddObject = () => {
    const baseObject = {
      id: Date.now(),
      type: objectType,
      material: material,
      position: [posX, posY, posZ]
    }

    let objectData = { ...baseObject }

    switch (objectType) {
      case 'cube':
        objectData.size = cubeSize
        break
      case 'sphere':
        objectData.radius = sphereRadius
        break
      case 'cone':
        objectData.baseRadius = coneBaseRadius
        objectData.height = coneHeight
        break
    }

    addObject(objectData)
    
    // Reset form
    setPosX(0)
    setPosY(0)
    setPosZ(0)
    setCubeSize(1)
    setSphereRadius(1)
    setConeBaseRadius(1)
    setConeHeight(2)
  }

  const objectTypes = [
    { value: 'cube', label: 'Cube' },
    { value: 'sphere', label: 'Sphere' },
    { value: 'cone', label: 'Cone' }
  ]

  const materials = [
    { value: 'metal', label: 'Metal' },
    { value: 'crystal', label: 'Crystal' },
    { value: 'plastic', label: 'Plastic' }
  ]

  const renderSpecificFields = () => {
    switch (objectType) {
      case 'cube':
        return (
          <FormField
            label="Size"
            icon="bi-square"
            value={cubeSize}
            onChange={(e) => setCubeSize(+e.target.value)}
            min={0.1}
            max={5}
            step={0.1}
          />
        )
      case 'sphere':
        return (
          <FormField
            label="Radius"
            icon="bi-circle"
            value={sphereRadius}
            onChange={(e) => setSphereRadius(+e.target.value)}
            min={0.1}
            max={3}
            step={0.1}
          />
        )
      case 'cone':
        return (
          <>
            <FormField
              label="Base Radius"
              icon="bi-triangle"
              value={coneBaseRadius}
              onChange={(e) => setConeBaseRadius(+e.target.value)}
              min={0.1}
              max={3}
              step={0.1}
            />
            <FormField
              label="Height"
              icon="bi-arrows-vertical"
              value={coneHeight}
              onChange={(e) => setConeHeight(+e.target.value)}
              min={0.1}
              max={5}
              step={0.1}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div 
      className="card position-fixed bg-dark text-light border-secondary shadow-lg"
      style={{ 
        zIndex: 1000, 
        minWidth: '320px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div 
        className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
        <h6 className="card-title mb-0 text-light fw-bold">
          <i className="bi bi-plus-circle me-2"></i>
          Add Object
        </h6>
        <button 
          className="btn btn-sm btn-outline-light"
          onClick={handleAddObject}
        >
          <i className="bi bi-check-lg me-1"></i>
          Add
        </button>
      </div>
      
      <div className="card-body bg-dark p-3">
        <FormField
          label="Object Type"
          icon="bi-shapes"
          type="select"
          value={objectType}
          onChange={(e) => setObjectType(e.target.value)}
          options={objectTypes}
        />

        <FormField
          label="Material"
          icon="bi-palette"
          type="select"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          options={materials}
        />

        <hr className="border-secondary" />

        <h6 className="text-light mb-3">
          <i className="bi bi-geo-alt me-1"></i>
          Position
        </h6>

        <div className="row">
          <div className="col-4">
            <FormField
              label="X"
              icon="bi-arrow-left-right"
              value={posX}
              onChange={(e) => setPosX(+e.target.value)}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>
          <div className="col-4">
            <FormField
              label="Y"
              icon="bi-arrow-up-down"
              value={posY}
              onChange={(e) => setPosY(+e.target.value)}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>
          <div className="col-4">
            <FormField
              label="Z"
              icon="bi-arrow-bar-up"
              value={posZ}
              onChange={(e) => setPosZ(+e.target.value)}
              min={-10}
              max={10}
              step={0.1}
            />
          </div>
        </div>

        <hr className="border-secondary" />

        <h6 className="text-light mb-3">
          <i className="bi bi-rulers me-1"></i>
          Dimensions
        </h6>

        {renderSpecificFields()}
      </div>
    </div>
  )
}