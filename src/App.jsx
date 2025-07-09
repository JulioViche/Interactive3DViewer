import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { useMouseControlActivation } from './hooks/useMouseControlActivation'
import UI from './components/UI'
import Scene from './components/Scene'

export default function App() {
  const { activateMouseControlsIfNeeded } = useMouseControlActivation()

  // Deshabilitar menú contextual del navegador (click derecho)
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  // Desbloquear mouse controls cuando se hace click fuera de la UI o se usa la rueda
  useEffect(() => {
    const handleClickOutsideUI = (e) => {
      // Verificar si el click fue fuera de todos los elementos de UI
      const isClickOnUI = e.target.closest('.card, .action-buttons, .btn, .form-control, .form-select, .form-range, .dropdown-menu, .modal, .alert, input, select, textarea, label')
      
      if (!isClickOnUI) {
        // Activar controles del mouse solo si es necesario
        activateMouseControlsIfNeeded()
      }
    }

    const handleWheel = (e) => {
      // Verificar si el scroll fue fuera de los elementos de UI
      const isScrollOnUI = e.target.closest('.card, .action-buttons, .btn, .form-control, .form-select, .form-range, .dropdown-menu, .modal, .alert, input, select, textarea')
      
      if (!isScrollOnUI) {
        // Activar controles del mouse solo si es necesario
        activateMouseControlsIfNeeded()
      }
    }

    const handleKeyDown = (e) => {
      // Activar controles del mouse con la tecla Escape
      if (e.key === 'Escape') {
        activateMouseControlsIfNeeded()
      }
    }

    // Agregar listeners con un pequeño delay para evitar conflictos
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutsideUI)
      document.addEventListener('wheel', handleWheel, { passive: true })
      document.addEventListener('keydown', handleKeyDown)
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutsideUI)
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activateMouseControlsIfNeeded])

  return (
    <>
      <UI />
      <Canvas 
        style={{ width: '100vw', height: '100vh' }}
        camera={{ 
          position: [8, 8, 8], 
          fov: 75 
        }}
      >
        <Scene />
      </Canvas>
    </>
  )
}
