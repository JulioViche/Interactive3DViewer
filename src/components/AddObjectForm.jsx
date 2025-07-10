import { useState } from 'react'
import { useSceneStore } from '../store'
import FormField from './FormField'
import DraggablePanel from './DraggablePanel'

export default function AddObjectForm({ onClose }) {
  const { addObject } = useSceneStore()
  
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
  // Cilindro
  const [cylinderRadius, setCylinderRadius] = useState(1)
  const [cylinderHeight, setCylinderHeight] = useState(2)
  // Pirámide
  const [pyramidBase, setPyramidBase] = useState(1)
  const [pyramidHeight, setPyramidHeight] = useState(2)

  const handleAddObject = () => {
    const baseObject = {
      id: Date.now(),
      type: objectType,
      material: material,
      position: [posX, posY, posZ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
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
      case 'cylinder':
        objectData.radius = cylinderRadius
        objectData.height = cylinderHeight
        break
      case 'pyramid':
        objectData.base = pyramidBase
        objectData.height = pyramidHeight
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
    setCylinderRadius(1)
    setCylinderHeight(2)
    setPyramidBase(1)
    setPyramidHeight(2)
    
    // Close form after adding object
    if (onClose) {
      setTimeout(() => onClose(), 500) // Small delay to show success feedback
    }
  }

  const headerButtons = [
    {
      onClick: handleAddObject,
      icon: 'bi bi-check-lg',
      title: 'Add Object to Scene',
      className: 'btn-outline-success'
    }
  ]

  const objectTypes = [
    { value: 'cube', label: 'Cubo' },
    { value: 'sphere', label: 'Esfera' },
    { value: 'cone', label: 'Cono' },
    { value: 'cylinder', label: 'Cilindro' },
    { value: 'pyramid', label: 'Pirámide' }
  ]

  const materials = [
    { value: 'metal', label: 'Metal' },
    { value: 'crystal', label: 'Cristal' },
    { value: 'plastic', label: 'Plástico' },
    { value: 'gold', label: 'Oro' },
    { value: 'wood', label: 'Madera' },
    { value: 'marble', label: 'Mármol' }
  ]

  const renderSpecificFields = () => {
    switch (objectType) {
      case 'cube':
        return (
          <FormField
            label="Tamaño"
            icon=""
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
            label="Radio"
            icon=""
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
              label="Radio de la base"
              icon=""
              value={coneBaseRadius}
              onChange={(e) => setConeBaseRadius(+e.target.value)}
              min={0.1}
              max={3}
              step={0.1}
            />
            <FormField
              label="Altura"
              icon=""
              value={coneHeight}
              onChange={(e) => setConeHeight(+e.target.value)}
              min={0.1}
              max={5}
              step={0.1}
            />
          </>
        )
      case 'cylinder':
        return (
          <>
            <FormField
              label="Radio"
              icon=""
              value={cylinderRadius}
              onChange={(e) => setCylinderRadius(+e.target.value)}
              min={0.1}
              max={3}
              step={0.1}
            />
            <FormField
              label="Altura"
              icon=""
              value={cylinderHeight}
              onChange={(e) => setCylinderHeight(+e.target.value)}
              min={0.1}
              max={5}
              step={0.1}
            />
          </>
        )
      case 'pyramid':
        return (
          <>
            <FormField
              label="Base"
              icon=""
              value={pyramidBase}
              onChange={(e) => setPyramidBase(+e.target.value)}
              min={0.1}
              max={5}
              step={0.1}
            />
            <FormField
              label="Altura"
              icon=""
              value={pyramidHeight}
              onChange={(e) => setPyramidHeight(+e.target.value)}
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
    <DraggablePanel
      title="Añadir Elementos"
      icon="bi-plus-circle"
      onClose={onClose}
      initialPosition={{ x: 680, y: 16 }}
      headerButtons={headerButtons}
    >
      <FormField
        label="Elemento"
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
        Posición
      </h6>

      <div className="row">
        <div className="col-4">
          <FormField
            label="Z"
            icon="bi-arrow-down-left"
            value={posZ}
            onChange={(e) => setPosZ(+e.target.value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>
        <div className="col-4">
          <FormField
            label="Y"
            icon="bi-arrow-up"
            value={posY}
            onChange={(e) => setPosY(+e.target.value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>
        <div className="col-4">
          <FormField
            label="X"
            icon="bi-arrow-down-right"
            value={posX}
            onChange={(e) => setPosX(+e.target.value)}
            min={-10}
            max={10}
            step={0.1}
          />
        </div>
      </div>

      <hr className="border-secondary" />

      <h6 className="text-light mb-3">
        <i className="bi bi-rulers me-1"></i>
        Dimensiones
      </h6>

      {renderSpecificFields()}
    </DraggablePanel>
  )
}