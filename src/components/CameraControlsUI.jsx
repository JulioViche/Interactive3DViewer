import { useSceneStore } from '../store'
import { useState, useEffect } from 'react'
import Slider from './Slider'

export default function CameraControlsUI() {
  const { 
    rotateSpeed, setRotateSpeed,
    zoomSpeed, setZoomSpeed,
    panSpeed, setPanSpeed 
  } = useSceneStore()

  // Estados para drag and drop
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 16, y: 16 })

  const resetSensitivity = () => {
    setRotateSpeed(0.4)
    setZoomSpeed(0.6)
    setPanSpeed(0.8)
  }

  // Funciones para drag and drop
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  // useEffect para event listeners
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

  return (
    <div 
      className="card position-fixed bg-dark text-light border-secondary shadow-lg"
      style={{ 
        zIndex: 1000, 
        minWidth: '300px',
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
          <i className="bi bi-arrows-move me-2"></i>
          Control Sensitivity
        </h6>
        <button 
          className="btn btn-sm btn-outline-light" 
          onClick={resetSensitivity}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Reset
        </button>
      </div>
      
      <div className="card-body bg-dark p-3">
        <div className="alert alert-dark border-secondary py-2 mb-3">
          <small className="text-light">
            <strong className="text-info">
              <i className="bi bi-mouse2 me-1"></i>Mouse:
            </strong> Drag to rotate<br/>
            <strong className="text-success">
              <i className="bi bi-mouse me-1"></i>Wheel:
            </strong> Zoom in/out<br/>
            <strong className="text-warning">
              <i className="bi bi-mouse2-fill me-1"></i>Right-click:
            </strong> Pan view
          </small>
        </div>

        <Slider
          icon="bi-arrow-repeat"
          label="Rotate Speed"
          value={rotateSpeed}
          onChange={(e) => setRotateSpeed(+e.target.value)}
          min={0.1}
          max={2.0}
          badgeColor="bg-primary"
        />
        
        <Slider
          icon="bi-zoom-in"
          label="Zoom Speed"
          value={zoomSpeed}
          onChange={(e) => setZoomSpeed(+e.target.value)}
          min={0.1}
          max={3.0}
          badgeColor="bg-success"
        />
        
        <Slider
          icon="bi-arrows-move"
          label="Pan Speed"
          value={panSpeed}
          onChange={(e) => setPanSpeed(+e.target.value)}
          min={0.1}
          max={2.5}
          badgeColor="bg-warning"
        />
      </div>
    </div>
  )
}
