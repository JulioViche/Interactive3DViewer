import { useSceneStore } from '../store'

export default function ActionButtons() {
  const { showGrid, toggleGrid, originalCameraPosition, originalCameraLookAt } = useSceneStore()
  
  const resetCameraToOriginal = () => {
    window.dispatchEvent(new CustomEvent('resetCamera'))
  }

  return (
    <div 
      className="position-fixed top-0 end-0 m-3 d-flex flex-column gap-2"
      style={{ zIndex: 1000 }}
    >
      {/* Botón Reset Camera */}
      <button 
        className="btn btn-transparent border-secondary text-light shadow-sm"
        onClick={resetCameraToOriginal}
        title="Reset Camera Position"
      >
        <i className="bi bi-house"></i>
      </button>

      {/* Botón Toggle Grid */}
      <button 
        className={`btn ${showGrid ? 'btn-dark' : 'btn-transparent'} border-secondary text-light shadow-sm`}
        onClick={toggleGrid}
        title={showGrid ? "Hide Grid" : "Show Grid"}
      >
        <i className="bi bi-grid-3x3"></i>
      </button>
    </div>
  )
}