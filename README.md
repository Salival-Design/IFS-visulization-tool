# IFS Visualization Suite

A feature-rich Electron application for visualizing the Internal Family Systems (IFS) therapeutic model in an immersive 3D environment.

## Features

- **3D Visualization**
  - Interactive particle system for parts representation
  - Dynamic Self nucleus visualization
  - Real-time part interaction and movement
  - Orbital camera controls for immersive exploration

- **Professional Control Panel**
  - Real-time visualization settings adjustment
  - Part management and positioning
  - Dynamic emotional load control
  - Visual effects customization
  - Camera and environment controls

- **Therapeutic Tools**
  - Part type differentiation (managers, firefighters, exiles)
  - Emotional load visualization
  - Interactive part relationships
  - Session state management

## Tech Stack

- **Frontend**
  - React
  - TypeScript
  - Three.js
  - React Three Fiber
  - React Spring

- **Desktop**
  - Electron
  - Vite

- **State Management**
  - Zustand

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ifs-visualization-suite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Building

To create a production build:
```bash
npm run build
```

To package the application:
```bash
npm run package
```

## Usage

### Control Panel

The application features a professional control panel that allows therapists to:

- Adjust visualization settings in real-time
- Manage and position parts
- Control emotional load values
- Customize visual effects
- Adjust camera and environment settings

The control panel can be toggled using the arrow button on the left side.

### Visualization Controls

- **Mouse Controls**
  - Left Click: Select parts
  - Right Click + Drag: Rotate camera
  - Scroll: Zoom in/out

- **Part Interaction**
  - Hover: View part details
  - Click: Select part for editing
  - Drag: Reposition part (coming soon)

## Development

The project uses:
- TypeScript for type safety
- React for UI components
- Three.js for 3D visualization
- Electron for desktop application functionality
- Vite for fast development and building

### Project Structure

```
src/
  ├── components/
  │   ├── ControlPanel.tsx    # Professional control panel
  │   ├── IFSVisualization.tsx # Main 3D visualization
  │   └── ErrorBoundary.tsx   # Error handling
  ├── lib/
  │   └── ifs-model.ts        # IFS data models
  ├── App.tsx                 # Main application
  └── main.tsx               # Entry point
```

## License

[MIT License](LICENSE) 