import { useSceneStore } from '../store'
import Slider from './Slider'
import DraggablePanel from './DraggablePanel'

export default function CameraControlsUI({ onClose }) {
  const { 
    rotateSpeed, setRotateSpeed,
    zoomSpeed, setZoomSpeed,
    panSpeed, setPanSpeed 
  } = useSceneStore()

  // Valores iniciales del store (deben coincidir con el store.js)
  const INITIAL_ROTATE = 0.5;
  const INITIAL_ZOOM = 2;
  const INITIAL_PAN = 1;

  const resetSensitivity = () => {
    setRotateSpeed(INITIAL_ROTATE);
    setZoomSpeed(INITIAL_ZOOM);
    setPanSpeed(INITIAL_PAN);
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
        max={4.0}
      />

      <Slider
        icon="bi-arrow-repeat"
        label="Rotación"
        value={rotateSpeed}
        onChange={(e) => setRotateSpeed(+e.target.value)}
        min={0.1}
        max={1.0}
      />
      
      <Slider
        icon="bi-arrows-move"
        label="Traslación"
        value={panSpeed}
        onChange={(e) => setPanSpeed(+e.target.value)}
        min={0.1}
        max={2.0}
      />
    </DraggablePanel>
  )
}
