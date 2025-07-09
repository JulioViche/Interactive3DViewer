import { create } from 'zustand'

export const useSceneStore = create((set) => ({
  // Configuración de sensibilidad
  rotateSpeed: 0.4,
  zoomSpeed: 0.6,
  panSpeed: 0.8,
  
  // Configuración de animaciones
  animationSpeed: 0.2,
  currentAnimation: 'orbit',
  mouseControlsEnabled: false, // Inicialmente deshabilitado porque hay animación
  
  // Objetos en la escena
  objects: [],
  
  // Configuración de grid
  showGrid: true,
  
  // Posición original
  originalCameraPosition: [8, 8, 8],
  originalCameraLookAt: [0, 0, 0],
  
  // Posición actual de la cámara (para transiciones suaves)
  currentCameraPosition: [8, 8, 8],
  currentCameraLookAt: [0, 0, 0],
  setCurrentCameraPosition: (position) => set({ currentCameraPosition: position }),
  setCurrentCameraLookAt: (lookAt) => set({ currentCameraLookAt: lookAt }),
  
  // Información sobre ActionButtons para evitar superposición
  actionButtonsRect: null,
  setActionButtonsRect: (rect) => set({ actionButtonsRect: rect }),

  // Estado para mostrar feedback visual
  showMouseControlFeedback: false,
  setShowMouseControlFeedback: (show) => set({ showMouseControlFeedback: show }),
  
  // Funciones para actualizar sensibilidad
  setRotateSpeed: (speed) => set({ rotateSpeed: speed }),
  setZoomSpeed: (speed) => set({ zoomSpeed: speed }),
  setPanSpeed: (speed) => set({ panSpeed: speed }),
  
  // Funciones para animaciones
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setCurrentAnimation: (animation) => set({ currentAnimation: animation }),
  setMouseControlsEnabled: (enabled) => set({ mouseControlsEnabled: enabled }),
  
  // Funciones para manejar objetos
  addObject: (object) => set((state) => ({
    objects: [...state.objects, object]
  })),
  
  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(obj => obj.id !== id)
  })),
  
  clearObjects: () => set({ objects: [] }),
  
  // Funciones para grid
  toggleGrid: () => set((state) => ({
    showGrid: !state.showGrid
  })),
  
  // Función para reset de cámara (será usado por el botón)
  resetCamera: () => set({ resetCameraFlag: Date.now() }),

  // Función para activar mouse controls desde interacciones externas
  enableMouseControlsFromInteraction: () => set((state) => {
    // Solo activar si hay una animación activa O si los controles del mouse están deshabilitados
    const needsActivation = state.currentAnimation !== 'none' || !state.mouseControlsEnabled
    
    if (needsActivation) {
      return {
        currentAnimation: 'none',
        mouseControlsEnabled: true,
        showMouseControlFeedback: true
      }
    }
    
    // Si ya están activos, no hacer nada y no mostrar feedback
    return state
  }),

  // Función para ocultar el feedback después de un tiempo
  hideMouseControlFeedback: () => set({ showMouseControlFeedback: false })
}))