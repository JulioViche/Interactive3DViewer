import { useRef } from 'react'
import { useDraggablePanel } from '../hooks/useDraggablePanel'

export default function DraggablePanel({ 
  title, 
  icon, 
  children, 
  onClose, 
  initialPosition = { x: 16, y: 16 },
  headerButtons = [],
  minWidth = '320px'
}) {
  const panelRef = useRef(null)
  const { 
    isDragging, 
    position, 
    isCollapsed, 
    handleMouseDown, 
    toggleCollapse 
  } = useDraggablePanel(initialPosition, panelRef)

  return (
    <div 
      ref={panelRef}
      className="card position-fixed bg-dark text-light border-secondary shadow-lg"
      style={{ 
        zIndex: 999, 
        minWidth,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        transition: isDragging ? 'none' : 'left 0.2s ease, top 0.2s ease'
      }}
    >
      <div 
        className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
        <h6 className="card-title mb-0 text-light fw-bold">
          {icon && <i className={`${icon} me-2`}></i>}
          {title}
        </h6>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
          </button>
          
          {headerButtons.map((button, index) => (
            <button 
              key={index}
              className={`btn btn-sm ${button.className || 'btn-outline-light'}`}
              onClick={button.onClick}
              title={button.title}
            >
              {button.icon && <i className={button.icon}></i>}
              {button.text && <span>{button.text}</span>}
            </button>
          ))}
          
          {onClose && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={onClose}
              title="Close Panel"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="card-body bg-dark p-3">
          {children}
        </div>
      )}
    </div>
  )
}
