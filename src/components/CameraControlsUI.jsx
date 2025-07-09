import { useSceneStore } from '../store'
import Slider from './Slider'
import DraggablePanel from './DraggablePanel'

export default function CameraControlsUI({ onClose }) {
  const { 
    rotateSpeed, setRotateSpeed,
    zoomSpeed, setZoomSpeed,
    panSpeed, setPanSpeed 
  } = useSceneStore()

  const resetSensitivity = () => {
    setRotateSpeed(0.4)
    setZoomSpeed(0.6)
    setPanSpeed(0.8)
  }

  const headerButtons = [
    {
      onClick: resetSensitivity,
      icon: 'bi bi-arrow-clockwise',
      title: 'Reset to Default Values',
      className: 'btn-outline-light'
    }
  ]

  return (
    <DraggablePanel
      title="Sensibilidad"
      icon="bi-arrows-move"
      onClose={onClose}
      initialPosition={{ x: 350, y: 16 }}
      headerButtons={headerButtons}
    >
      <Slider
        icon="bi-zoom-in"
        label="Zoom"
        value={zoomSpeed}
        onChange={(e) => setZoomSpeed(+e.target.value)}
        min={0.1}
        max={3.0}
      />

      <Slider
        icon="bi-arrow-repeat"
        label="Rotación"
        value={rotateSpeed}
        onChange={(e) => setRotateSpeed(+e.target.value)}
        min={0.1}
        max={2.0}
      />
      
      <Slider
        icon="bi-arrows-move"
        label="Traslación"
        value={panSpeed}
        onChange={(e) => setPanSpeed(+e.target.value)}
        min={0.1}
        max={2.5}
      />
    </DraggablePanel>
  )
}
