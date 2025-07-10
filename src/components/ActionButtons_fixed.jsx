
import { useSceneStore } from '../store'

export default function ActionButtonsFixed() {
  const { transformMode, setTransformMode, selectedObjectId } = useSceneStore()

  if (!selectedObjectId) return null

  const buttons = [
    { mode: 'translate', label: 'Mover', icon: 'bi-arrows-move', key: 'G' },
    { mode: 'rotate', label: 'Rotar', icon: 'bi-arrow-clockwise', key: 'R' },
    { mode: 'scale', label: 'Escalar', icon: 'bi-arrows-angle-expand', key: 'S' }
  ]

  return (
    <div 
      className="position-fixed bg-dark border border-secondary rounded shadow"
      style={{ 
        top: '20px', 
        right: '20px', 
        zIndex: 1000, 
        padding: '8px',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(33, 37, 41, 0.9)'
      }}
    >
      <div className="d-flex gap-1">
        {buttons.map(({ mode, label, icon, key }) => (
          <button
            key={mode}
            className={`btn btn-sm ${
              transformMode === mode 
                ? 'btn-primary' 
                : 'btn-outline-secondary'
            }`}
            onClick={() => setTransformMode(mode)}
            title={`${label} (${key})`}
          >
            <i className={`${icon} me-1`}></i>
            {label}
            <small className="ms-1 opacity-75">({key})</small>
          </button>
        ))}
      </div>
      <div className="text-center mt-1">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Objeto seleccionado
        </small>
      </div>
    </div>
  )
}
