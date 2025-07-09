import { useEffect } from 'react'
import { useSceneStore } from '../store'

export default function MouseControlFeedback() {
  const { 
    showMouseControlFeedback, 
    hideMouseControlFeedback,
    mouseControlsEnabled,
    currentAnimation
  } = useSceneStore()

  useEffect(() => {
    if (showMouseControlFeedback) {
      const timer = setTimeout(() => {
        hideMouseControlFeedback()
      }, 2500) // Mostrar por 2.5 segundos
      
      return () => clearTimeout(timer)
    }
  }, [showMouseControlFeedback, hideMouseControlFeedback])

  // Solo mostrar si realmente se activaron los controles
  if (!showMouseControlFeedback) {
    return null
  }

  return (
    <div 
      className="position-fixed bottom-0 start-50 translate-middle-x mb-3 alert alert-success border-success shadow-lg"
      style={{ 
        zIndex: 1001,
        animation: 'fadeInUp 0.3s ease-out',
        minWidth: '320px'
      }}
    >
      <div className="d-flex align-items-center">
        <i className="bi bi-mouse2 me-2"></i>
        <span className="fw-bold">Controles del mouse activados</span>
      </div>
      <small className="text-muted d-block mt-1">
        <i className="bi bi-info-circle me-1"></i>
        La cámara continúa desde la posición actual
      </small>
      <small className="text-muted d-block">
        Tip: Click fuera de la UI, rueda del mouse o <kbd>Esc</kbd> para activar
      </small>
    </div>
  )
}
