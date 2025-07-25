import { create } from 'zustand'

export const useSceneStore = create((set) => ({
  // Selección y manipulación de objetos
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  transformMode: 'translate', // 'translate' | 'rotate' | 'scale'
  setTransformMode: (mode) => set({ transformMode: mode }),
  isTransforming: false,
  setIsTransforming: (val) => set({ isTransforming: val }),

  // Configuración de sensibilidad
  rotateSpeed: 0.5,
  zoomSpeed: 2,
  panSpeed: 1,
  
  // Configuración de animaciones
  animationSpeed: 0.5,
  currentAnimation: 'spiral',
  mouseControlsEnabled: false, // Inicialmente deshabilitado porque hay animación
  
  // Objetos en la escena
  objects: [
    {
      id: 1,
      type: 'cube',
      size: 2,
      material: 'gold',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  ],
  
  // Configuración de grid y ejes
  showGrid: true,
  showAxes: true,
  
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

  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === id
        ? { ...obj, ...updates }
        : obj
    )
  })),
  
  clearObjects: () => set({ objects: [] }),
  
  // Funciones para grid y ejes
  toggleGrid: () => set((state) => ({
    showGrid: !state.showGrid
  })),
  toggleAxes: () => set((state) => ({
    showAxes: !state.showAxes
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