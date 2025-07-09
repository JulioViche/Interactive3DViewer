import { useCallback } from 'react'
import { useSceneStore } from '../store'

/**
 * Hook para gestionar la activación inteligente de controles del mouse
 * Solo activa los controles cuando realmente es necesario para evitar
 * reposicionamientos innecesarios de paneles
 */
export const useMouseControlActivation = () => {
  const { 
    currentAnimation, 
    mouseControlsEnabled, 
    enableMouseControlsFromInteraction 
  } = useSceneStore()

  const activateMouseControlsIfNeeded = useCallback(() => {
    // Solo activar si hay una animación activa O si los controles están deshabilitados
    const needsActivation = currentAnimation !== 'none' || !mouseControlsEnabled
    
    if (needsActivation) {
      enableMouseControlsFromInteraction()
      return true // Indica que se activó
    }
    
    return false // Indica que no se necesitó activar
  }, [currentAnimation, mouseControlsEnabled, enableMouseControlsFromInteraction])

  const checkIfNeedsActivation = useCallback(() => {
    return currentAnimation !== 'none' || !mouseControlsEnabled
  }, [currentAnimation, mouseControlsEnabled])

  return {
    activateMouseControlsIfNeeded,
    checkIfNeedsActivation,
    isMouseControlsActive: mouseControlsEnabled && currentAnimation === 'none'
  }
}
