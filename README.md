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

## Development Setup for macOS

### Prerequisites

- Install GitHub for PC to Clone
- Install relevant dependencies

### Project Setup

1. Clone the repository:
```bash
git clone https://github.com/Salival-Design/IFS-visulization-tool.git
cd ifs-visualization-suite
```

2. Install dependencies:
```bash
npm install
```

### Development

- Run in development mode:
```bash
npm run electron:dev
```

- Build for production:
```bash
npm run electron:build
```

### Building for macOS Distribution

1. Set up your Apple Developer credentials as environment variables:
```bash
export APPLE_ID="your.apple.id@example.com"
export APPLE_ID_PASSWORD="your-app-specific-password"
export APPLE_TEAM_ID="your-team-id"
```

2. Build the macOS app:
```bash
npm run electron:build:mac
```

The packaged application will be available in the `release` directory.

### Notes for macOS Distribution

- Ensure you have an Apple Developer account
- Create an app-specific password for your Apple ID
- The app will be automatically notarized if credentials are provided
- The resulting .dmg file will be signed and ready for distribution

## License

© 2025 The Mood & Mind Centre. All rights reserved.

## Contact

For any inquiries, please contact The Mood & Mind Centre. 
