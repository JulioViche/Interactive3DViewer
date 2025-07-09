

# Interactive 3D Viewer

A modern 3D viewer application built with React Three Fiber, featuring draggable UI panels, camera animations, and dynamic object management.

## Features

### 🎮 Interactive Controls
- **Drag-and-Drop UI Panels**: All control panels can be dragged around the screen
- **Collapsible Panels**: Click to expand/collapse any panel
- **Mouse Controls**: Enable/disable mouse interaction with the 3D scene
- **Camera Animations**: Multiple preset animations (Orbit, Swing, Zoom, Spiral, Figure-8)
- **Speed Control**: Adjustable animation speed from 0.1x to 3.0x

### 🎯 Camera Management
- **Sensitivity Controls**: Adjust rotate, zoom, and pan speeds
- **Reset Camera**: Return to original position and orientation
- **Animation Integration**: Smooth transitions between manual and automated camera control

### 🎨 Scene Management
- **Dynamic Object Creation**: Add cubes, spheres, and cones to the scene
- **Material Options**: Choose from Metal, Crystal, and Plastic materials
- **Grid Toggle**: Show/hide the reference grid
- **Real-time Updates**: All changes are reflected immediately in the 3D scene

### 🖥️ User Interface
- **Bootstrap Styling**: Modern, dark theme with consistent styling
- **Responsive Design**: Adapts to different screen sizes
- **Keyboard Shortcuts**: Intuitive keyboard navigation
- **Visual Feedback**: Clear visual indicators for active states

## Technology Stack

- **React 19**: Modern React with hooks and context
- **Three.js**: 3D graphics rendering
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and abstractions
- **Bootstrap 5**: UI styling and components
- **Zustand**: State management
- **Vite**: Build tool and development server

## Project Structure

```
src/
├── components/
│   ├── UI.jsx                 # Main UI controller
│   ├── DraggablePanel.jsx     # Reusable draggable panel wrapper
│   ├── CameraControlsUI.jsx   # Camera sensitivity controls
│   ├── AddObjectForm.jsx      # Object creation form
│   ├── ActionButtons.jsx      # Fixed action buttons
│   ├── Scene.jsx              # Main 3D scene component
│   ├── Slider.jsx             # Custom slider component
│   └── FormField.jsx          # Reusable form field
├── hooks/
│   ├── useDraggablePanel.js   # Drag and drop logic
│   └── useAnimations.js       # Camera animation system
├── store.js                   # Global state management
├── main.jsx                   # Application entry point
└── App.jsx                    # Main application component
```

## Usage

### Starting the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:5173`

### Using the Interface

#### Animation Controls Panel
- **Animation Type**: Select from None, Orbit, Swing, Zoom, Spiral, or Figure-8
- **Speed Slider**: Adjust animation speed in real-time
- **Mouse Toggle**: Enable/disable mouse controls
- **Reset Camera**: Return to default position
- **Grid Toggle**: Show/hide reference grid

#### Camera Controls Panel
- **Rotate Speed**: Adjust mouse rotation sensitivity
- **Zoom Speed**: Adjust mouse wheel zoom sensitivity
- **Pan Speed**: Adjust right-click pan sensitivity
- **Reset Button**: Return all values to defaults

#### Add Object Panel
- **Object Type**: Choose Cube, Sphere, or Cone
- **Material**: Select Metal, Crystal, or Plastic
- **Position**: Set X, Y, Z coordinates
- **Dimensions**: Adjust size/radius/height based on object type

### Panel Interactions

- **Drag**: Click and drag the header to move panels
- **Collapse**: Click the chevron button to expand/collapse
- **Close**: Click the X button to close secondary panels

## Development

### Key Components

1. **UI.jsx**: Main controller that manages panel visibility and global actions
2. **DraggablePanel.jsx**: Reusable wrapper providing drag-and-drop functionality
3. **Scene.jsx**: 3D scene setup with lighting, objects, and camera controls
4. **useAnimations.js**: Hook managing camera animation logic
5. **store.js**: Zustand store for global state management

### Adding New Features

#### New Animation
1. Add animation logic to `useAnimations.js`
2. Add animation option to the animations array in `UI.jsx`
3. Update the animation speed control if needed

#### New Object Type
1. Add geometry logic to `Scene.jsx` renderObject function
2. Add object type to the objectTypes array in `AddObjectForm.jsx`
3. Add specific property fields in renderSpecificFields function

#### New UI Panel
1. Create component using `DraggablePanel` wrapper
2. Add panel state management to `UI.jsx`
3. Add toggle button to appropriate control panel

## Performance Considerations

- Animations use `useFrame` for smooth 60fps updates
- Object creation is optimized with proper key props
- Panel drag operations are throttled for smooth performance
- State updates are batched to prevent unnecessary re-renders

## Browser Compatibility

- Modern browsers with WebGL support
- Recommended: Chrome 80+, Firefox 75+, Safari 13+
- Mobile browsers supported with touch controls

## Contributing

When adding new features:
1. Follow the existing component structure
2. Use the DraggablePanel wrapper for new UI panels
3. Add new state to the Zustand store
4. Maintain Bootstrap styling consistency
5. Test drag-and-drop functionality on all panels

## License

This project is for educational purposes as part of the GRÁFICA course.