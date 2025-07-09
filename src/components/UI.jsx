import { useState } from 'react'
import { useSceneStore } from '../store'
import CameraControlsUI from './CameraControlsUI'
import AddObjectForm from './AddObjectForm'
import ActionButtons from './ActionButtons'
import DraggablePanel from './DraggablePanel'
import MouseControlFeedback from './MouseControlFeedback'
import Slider from './Slider'

export default function UI() {
  const { 
    animationSpeed, setAnimationSpeed,
    currentAnimation, setCurrentAnimation,
    setMouseControlsEnabled
  } = useSceneStore()

  // Estados para mostrar/ocultar paneles adicionales
  const [showCameraControls, setShowCameraControls] = useState(false)
  const [showAddObjectForm, setShowAddObjectForm] = useState(false)

  // Animaciones disponibles
  const animations = [
    { id: 'none', name: 'None', icon: 'bi-pause-circle' },
    { id: 'orbit', name: 'Orbit', icon: 'bi-arrow-repeat' },
    { id: 'swing', name: 'Swing', icon: 'bi-arrow-left-right' },
    { id: 'zoom', name: 'Zoom', icon: 'bi-zoom-in' },
    { id: 'spiral', name: 'Spiral', icon: 'bi-arrow-clockwise' },
    { id: 'figure8', name: 'Figure 8', icon: 'bi-infinity' }
  ]

  // Funciones de control
  const handleAnimationChange = (animationId) => {
    setCurrentAnimation(animationId)
    
    // Si se activa una animación (no 'none'), deshabilitar mouse controls
    if (animationId !== 'none') {
      setMouseControlsEnabled(false)
      // Cambio manual desde UI - iniciar animación
      window.dispatchEvent(new CustomEvent('animationChanged', { 
        detail: { animation: animationId, keepCurrentPosition: false } 
      }))
    } else {
      // Si se desactiva la animación manualmente, habilitar mouse controls y resetear posición
      setMouseControlsEnabled(true)
      // Cambio manual a "none" - resetear posición (no mantener posición actual)
      window.dispatchEvent(new CustomEvent('animationChanged', { 
        detail: { animation: 'none', keepCurrentPosition: false } 
      }))
    }
  }

  const handleSpeedChange = (speed) => {
    setAnimationSpeed(speed)
    window.dispatchEvent(new CustomEvent('speedChanged', { 
      detail: { speed } 
    }))
  }

  return (
    <>
      {/* Panel Principal de Animaciones */}
      <DraggablePanel
        title="Escena"
        icon="bi-fullscreen"
        initialPosition={{ x: 16, y: 90 }}
        minWidth="320px"
      >
        <label className="form-label text-light fw-bold">
            <i className="bi bi-camera-video me-1"></i>
            Cámara
        </label>
        <div className="alert border-secondary py-2 mb-3">

        <small className="text-light">
            <strong>
            <i className="bi bi-mouse me-1"></i>Rueda:
            </strong> Acercar y alejar
            <br/>
            <strong>
            <i className="bi bi-mouse2 me-1"></i>Click Izquierdo:
            </strong> Arrastra para rotar
            <br/>
            <strong>
            <i className="bi bi-mouse2 me-1"></i>Click Derecho:
            </strong> Arrastra para trasladar
        </small>
        </div>
        {/* Selector de Animación */}
        <div className="mb-3">
          <label className="form-label text-light fw-bold">
            <i className="bi bi-play-circle me-1"></i>
            Animación
          </label>
          <select 
            className="form-select bg-dark text-light border-secondary" 
            value={currentAnimation} 
            onChange={(e) => handleAnimationChange(e.target.value)}
          >
            {animations.map(anim => (
              <option key={anim.id} value={anim.id}>
                {anim.name}
              </option>
            ))}
          </select>
        </div>

        {/* Control de Velocidad */}
        <Slider
            icon="bi-speedometer2"
            label="Velocidad"
            value={animationSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            min={0.1}
            max={3.0}
        />

        {/* Botones para Paneles Adicionales */}
        <div className="mt-3 pt-2 border-top border-secondary">
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className={`btn btn-sm ${showCameraControls ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setShowCameraControls(!showCameraControls)}
            >
              <i className="bi bi-arrows-move me-1"></i>
              Sensibilidad
            </button>
            
            <button 
              className={`btn btn-sm ${showAddObjectForm ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setShowAddObjectForm(!showAddObjectForm)}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Añadir elementos
            </button>
          </div>
        </div>
      </DraggablePanel>

      {/* Paneles Adicionales */}
      {showCameraControls && (
        <CameraControlsUI onClose={() => setShowCameraControls(false)} />
      )}
      
      {showAddObjectForm && (
        <AddObjectForm onClose={() => setShowAddObjectForm(false)} />
      )}

      {/* Botones de Acción Fijos */}
      <ActionButtons />
      
      {/* Feedback de controles del mouse */}
      <MouseControlFeedback />
    </>
  )
}
