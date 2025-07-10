import { useEffect, useRef } from 'react'
import { useSceneStore } from '../store'

export default function ActionButtons() {
  const buttonsPanelRef = useRef(null)
  const { 
    showGrid, toggleGrid, 
    showAxes, toggleAxes,
    mouseControlsEnabled, setMouseControlsEnabled,
    currentAnimation, setCurrentAnimation,
    originalCameraPosition, originalCameraLookAt,
    setActionButtonsRect,
    transformMode, setTransformMode,
    selectedObjectId, objects
  } = useSceneStore()

  // Obtener el objeto seleccionado real
  const selectedObject = objects.find(obj => obj.id === selectedObjectId)

  // Update action buttons rect in store when component mounts or resizes
  const updateActionButtonsRect = () => {
    if (buttonsPanelRef.current) {
      const rect = buttonsPanelRef.current.getBoundingClientRect()
      setActionButtonsRect(rect)
    }
  }

  // Ensure the action buttons stay within viewport on resize
  useEffect(() => {
    const handleResize = () => {
      if (buttonsPanelRef.current) {
        const panel = buttonsPanelRef.current
        const rect = panel.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        // Check if panel is outside viewport and adjust if needed
        if (rect.right > viewportWidth || rect.bottom > viewportHeight) {
          // Reposition to ensure it stays within viewport
          const margin = 12 // m-3 Bootstrap margin
          panel.style.right = `${margin}px`
          panel.style.top = `${margin}px`
        }
        
        // Update rect in store after any position changes
        setTimeout(updateActionButtonsRect, 0)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Check on mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Update rect when component mounts
  useEffect(() => {
    updateActionButtonsRect()
  }, [])
  
  const resetCameraToOriginal = () => {
    // Detener cualquier animación activa
    if (currentAnimation !== 'none') {
      setCurrentAnimation('none')
    }
    
    // Habilitar controles del mouse
    setMouseControlsEnabled(true)
    
    // Resetear cámara a posición original
    window.dispatchEvent(new CustomEvent('resetCamera'))
    
    // Asegurar que la animación se detenga
    window.dispatchEvent(new CustomEvent('animationChanged', { 
      detail: { animation: 'none', keepCurrentPosition: false } 
    }))
    
    // Disparar evento para habilitar controles del mouse
    window.dispatchEvent(new CustomEvent('mouseControlsToggled', { 
      detail: { enabled: true } 
    }))
  }

  const toggleMouseControls = () => {
    // Si hay una animación activa, la detiene y habilita mouse controls
    if (currentAnimation !== 'none') {
      setCurrentAnimation('none')
      setMouseControlsEnabled(true)
      // Mantener posición actual cuando se activa manualmente desde ActionButtons
      window.dispatchEvent(new CustomEvent('animationChanged', { 
        detail: { animation: 'none', keepCurrentPosition: true } 
      }))
      window.dispatchEvent(new CustomEvent('mouseControlsToggled', { 
        detail: { enabled: true } 
      }))
    } else {
      // Si no hay animación, toggle normal de mouse controls
      const newState = !mouseControlsEnabled
      setMouseControlsEnabled(newState)
      // Solo disparar evento si estamos activando, no desactivando
      if (newState) {
        window.dispatchEvent(new CustomEvent('mouseControlsToggled', { 
          detail: { enabled: true } 
        }))
      }
    }
  }

  return (
    <div 
      ref={buttonsPanelRef}
      className="action-buttons position-fixed top-0 end-0 m-3 d-flex flex-column gap-2"
      style={{ zIndex: 1000 }}
    >

      {/* Botón Reset Camera */}
      <button 
        className={`btn ${currentAnimation !== 'none' ? 'btn-transparent' : 'btn-dark'} border-secondary text-light shadow-sm`}
        onClick={resetCameraToOriginal}
        title={currentAnimation !== 'none' ? "Stop Animation & Reset Camera" : "Reset Camera Position"}
      >
        <i className="bi bi-house"></i>
      </button>


      {/* Botón Toggle Grid */}
      <button 
        className={`btn ${showGrid ? 'btn-dark' : 'btn-transparent'} border-secondary text-light shadow-sm`}
        onClick={toggleGrid}
        title={showGrid ? "Ocultar grilla" : "Mostrar grilla"}
      >
        <i className="bi bi-grid-3x3"></i>
      </button>

      {/* Botón Toggle Axes */}
      <button 
        className={`btn ${showAxes ? 'btn-dark' : 'btn-transparent'} border-secondary text-light shadow-sm`}
        onClick={toggleAxes}
        title={showAxes ? "Ocultar ejes" : "Mostrar ejes"}
      >
        <i className="bi bi-crosshair2"></i>
      </button>

      {/* Botón Mouse Controls */}
      <button 
        className={`btn ${mouseControlsEnabled && currentAnimation === 'none' ? 'btn-dark' : 'btn-transparent'} border-secondary text-light shadow-sm`}
        onClick={toggleMouseControls}
        title={
          currentAnimation !== 'none' 
          ? "Stop Animation & Enable Mouse Controls" 
          : (mouseControlsEnabled ? "Disable Mouse Controls" : "Enable Mouse Controls")
        }
        >
        <i className="bi bi-mouse2"></i>
      </button>

      {/* Botones de Transformación (solo si hay objeto seleccionado) */}
      {selectedObject && (
        <div className="d-flex flex-column gap-2">
          <button 
            className={`btn btn-dark border-secondary text-light shadow-sm ${transformMode === 'translate' ? 'active' : ''}`}
            onClick={() => setTransformMode('translate')}
            title="Mover (G)"
          >
            <i className="bi bi-arrows-move"></i>
          </button>
          <button 
            className={`btn btn-dark border-secondary text-light shadow-sm ${transformMode === 'rotate' ? 'active' : ''}`}
            onClick={() => setTransformMode('rotate')}
            title="Rotar (R)"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
          <button 
            className={`btn btn-dark border-secondary text-light shadow-sm ${transformMode === 'scale' ? 'active' : ''}`}
            onClick={() => setTransformMode('scale')}
            title="Escalar (S)"
          >
            <i className="bi bi-arrows-angle-expand"></i>
          </button>
        </div>
      )}
    </div>
  )
}