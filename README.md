# IFS Visualization Suite

A feature-rich Electron application for visualizing the Internal Family Systems (IFS) therapeutic model in an immersive 3D environment.

## Features

- **3D Visualization**
  - Interactive particle system for parts representation
  - Dynamic Self nucleus visualization with energy level feedback
  - Real-time part interaction and movement
  - Orbital camera controls for immersive exploration
  - Custom image textures for parts
  - Enhanced relationship lines with health indicators and color coding
  - Sparkle effects for Self energy visualization
  - Smooth animations and transitions
  - Improved line rendering and positioning

- **Professional Control Panel**
  - Dual panel system (Clinical and Visual controls)
  - Real-time visualization settings adjustment
  - Enhanced part management and positioning
  - Dynamic emotional load control
  - Visual effects customization
  - Camera and environment controls
  - Custom image upload support
  - Collapsible panels with smooth transitions
  - Improved tab navigation and spacing

- **Clinical Controls**
  - Session tracking and management
  - Client information management
  - Part creation and customization
  - Enhanced relationship mapping with health indicators
  - Color-coded relationship visualization
  - Clinical annotations with categories
  - Progress tracking
  - Self energy level monitoring
  - System harmony tracking

- **Therapeutic Tools**
  - Part type differentiation (managers, firefighters, exiles)
  - Emotional load visualization
  - Interactive part relationships
  - Session state management
  - Custom part imagery support
  - Clinical note-taking
  - Enhanced relationship strength indicators
  - Health status tracking
  - Improved relationship type management

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript 5
  - Three.js
  - React Three Fiber
  - React Spring
  - Modern UI/UX design principles

- **Desktop**
  - Electron
  - Vite
  - Secure CSP implementation

- **State Management**
  - Zustand
  - React hooks

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
- Create and manage relationships with health indicators
- Add clinical annotations with categories
- Monitor Self energy levels
- Track system harmony

The clinical panel can be toggled using the arrow button on the left side.

### Visualization Controls

- **Mouse Controls**
  - Left Click: Select parts
  - Right Click + Drag: Rotate camera
  - Scroll: Zoom in/out
  - Mouse Over: View part details

- **Part Interaction**
  - Hover: View part details
  - Click: Select part for editing
  - Custom Images: Add personalized imagery to parts
  - Emotional Load: Adjust part intensity
  - Position: Fine-tune 3D positioning

### Part Management

- Create new parts with custom names and types
- Assign emotional load values
- Add custom images or use default colors
- Define relationships between parts
- Track therapeutic progress
- Set visibility preferences
- Adjust positioning in 3D space

## Development

The project uses:
- TypeScript for type safety
- React for UI components
- Three.js for 3D visualization
- Electron for desktop application functionality
- Vite for fast development and building
- Modern security practices including CSP

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
  ├── types/
  │   └── IFSModel.ts                 # TypeScript definitions
  ├── App.tsx                         # Main application
  └── main.tsx                        # Entry point
```

## License

[MIT License](LICENSE) 