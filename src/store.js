import { create } from 'zustand'

export const useSceneStore = create((set) => ({
  // Configuración de sensibilidad
  rotateSpeed: 0.4,
  zoomSpeed: 0.6,
  panSpeed: 0.8,
  
  // Objetos en la escena
  objects: [],
  
  // Configuración de grid
  showGrid: true,
  
  // Posición original
  originalCameraPosition: [8, 8, 8],
  originalCameraLookAt: [0, 0, 0],
  
  // Funciones para actualizar sensibilidad
  setRotateSpeed: (speed) => set({ rotateSpeed: speed }),
  setZoomSpeed: (speed) => set({ zoomSpeed: speed }),
  setPanSpeed: (speed) => set({ panSpeed: speed }),
  
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
  resetCamera: () => set({ resetCameraFlag: Date.now() })
}))