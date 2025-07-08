import { Canvas } from '@react-three/fiber'
import CameraControlsUI from './components/CameraControlsUI'
import AddObjectForm from './components/AddObjectForm'
import ActionButtons from './components/ActionButtons'
import Scene from './components/Scene'

function App() {
  return (
    <>
      <CameraControlsUI />
      <AddObjectForm />
      <ActionButtons />
      <Canvas 
        style={{ width: '100vw', height: '100vh' }}
        camera={{ 
          position: [8, 8, 8], 
          fov: 75 
        }}
      >
        <Scene />
      </Canvas>
    </>
  )
}

export default App
