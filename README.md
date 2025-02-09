# IFS Visualization Suite

A feature-rich Electron application for visualizing the Internal Family Systems (IFS) therapeutic model in an immersive 3D environment.

## Features

- **3D Visualization**
  - Interactive particle system for parts representation
  - Dynamic Self nucleus visualization
  - Real-time part interaction and movement
  - Orbital camera controls for immersive exploration
  - Custom image textures for parts
  - Dynamic relationship lines between parts

- **Professional Control Panel**
  - Real-time visualization settings adjustment
  - Part management and positioning
  - Dynamic emotional load control
  - Visual effects customization
  - Camera and environment controls
  - Custom image upload support

- **Clinical Controls**
  - Session tracking and management
  - Client information management
  - Part creation and customization
  - Relationship mapping
  - Clinical annotations
  - Progress tracking

- **Therapeutic Tools**
  - Part type differentiation (managers, firefighters, exiles)
  - Emotional load visualization
  - Interactive part relationships
  - Session state management
  - Custom part imagery support
  - Clinical note-taking

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

### Clinical Controls Panel

The application features a professional clinical control panel that allows therapists to:

- Manage session information
- Create and customize parts
- Add custom images to parts
- Track therapeutic progress
- Create and manage relationships
- Add clinical annotations

The clinical panel can be toggled using the arrow button on the left side.

### Visualization Controls

- **Mouse Controls**
  - Left Click: Select parts
  - Right Click + Drag: Rotate camera
  - Scroll: Zoom in/out

- **Part Interaction**
  - Hover: View part details
  - Click: Select part for editing
  - Custom Images: Add personalized imagery to parts

### Part Management

- Create new parts with custom names and types
- Assign emotional load values
- Add custom images to parts
- Define relationships between parts
- Track therapeutic progress

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
  │   ├── CliniciansControlPanel.tsx  # Clinical controls and part management
  │   ├── ControlPanel.tsx            # Visualization settings
  │   ├── IFSVisualization.tsx        # Main 3D visualization
  │   └── ErrorBoundary.tsx           # Error handling
  ├── lib/
  │   └── ifs-model.ts                # IFS data models
  ├── App.tsx                         # Main application
  └── main.tsx                        # Entry point
```

## License

[MIT License](LICENSE) 