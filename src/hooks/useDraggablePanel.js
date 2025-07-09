import { useState, useEffect } from 'react'
import { useSceneStore } from '../store'

export const useDraggablePanel = (initialPosition = { x: 16, y: 16 }, panelRef = null) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState(initialPosition)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const { actionButtonsRect } = useSceneStore()

  // Helper function to check if panel overlaps with ActionButtons
  const doesPanelOverlapWithActionButtons = (panelRect, actionButtonsRect) => {
    if (!actionButtonsRect) return false
    
    // Add some padding to prevent close proximity
    const padding = 10
    
    return !(
      panelRect.right + padding < actionButtonsRect.left ||
      panelRect.left - padding > actionButtonsRect.right ||
      panelRect.bottom + padding < actionButtonsRect.top ||
      panelRect.top - padding > actionButtonsRect.bottom
    )
  }

  // Helper function to get safe position avoiding ActionButtons
  const getSafePosition = (newX, newY, panelWidth, panelHeight) => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const margin = 10
    
    // Basic viewport constraints
    newX = Math.max(margin, Math.min(newX, viewportWidth - panelWidth - margin))
    newY = Math.max(margin, Math.min(newY, viewportHeight - panelHeight - margin))
    
    // Check overlap with ActionButtons
    if (actionButtonsRect) {
      const panelRect = {
        left: newX,
        top: newY,
        right: newX + panelWidth,
        bottom: newY + panelHeight
      }
      
      if (doesPanelOverlapWithActionButtons(panelRect, actionButtonsRect)) {
        // Try to position to the left of ActionButtons
        const leftOfButtons = actionButtonsRect.left - panelWidth - margin
        if (leftOfButtons >= margin) {
          newX = leftOfButtons
        } else {
          // Try to position below ActionButtons
          const belowButtons = actionButtonsRect.bottom + margin
          if (belowButtons + panelHeight <= viewportHeight - margin) {
            newY = belowButtons
          } else {
            // Try to position above ActionButtons
            const aboveButtons = actionButtonsRect.top - panelHeight - margin
            if (aboveButtons >= margin) {
              newY = aboveButtons
            }
          }
        }
      }
    }
    
    return { x: newX, y: newY }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Ensure panel stays within viewport when collapsed/expanded
  useEffect(() => {
    if (panelRef && panelRef.current) {
      const checkAndAdjustPosition = () => {
        const rect = panelRef.current.getBoundingClientRect()
        const safePosition = getSafePosition(position.x, position.y, rect.width, rect.height)
        
        if (safePosition.x !== position.x || safePosition.y !== position.y) {
          setPosition(safePosition)
        }
      }

      // Use setTimeout to ensure DOM has updated after collapse/expand
      setTimeout(checkAndAdjustPosition, 0)
    }
  }, [isCollapsed, position, panelRef, actionButtonsRect])

  // Ensure panel stays within viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      if (panelRef && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect()
        const safePosition = getSafePosition(position.x, position.y, rect.width, rect.height)
        
        if (safePosition.x !== position.x || safePosition.y !== position.y) {
          setPosition(safePosition)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [position, panelRef, actionButtonsRect])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Calcular nueva posición
        let newX = e.clientX - dragOffset.x
        let newY = e.clientY - dragOffset.y
        
        // Obtener dimensiones reales del panel si está disponible
        let panelWidth = 320  // default
        let panelHeight = 200 // default
        
        if (panelRef && panelRef.current) {
          const rect = panelRef.current.getBoundingClientRect()
          panelWidth = rect.width
          panelHeight = rect.height
        }
        
        // Obtener posición segura que evite ActionButtons
        const safePosition = getSafePosition(newX, newY, panelWidth, panelHeight)
        
        setPosition(safePosition)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Reposition panel when ActionButtons rect changes
  useEffect(() => {
    if (panelRef && panelRef.current && actionButtonsRect) {
      const rect = panelRef.current.getBoundingClientRect()
      const safePosition = getSafePosition(position.x, position.y, rect.width, rect.height)
      
      if (safePosition.x !== position.x || safePosition.y !== position.y) {
        setPosition(safePosition)
      }
    }
  }, [actionButtonsRect])

  return {
    isDragging,
    position,
    isCollapsed,
    handleMouseDown,
    toggleCollapse
  }
}
