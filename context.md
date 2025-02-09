# IFS Visualization Tool - Project Context

## Overview

This project aims to develop a feature-rich Electron application for visualizing the Internal Family Systems (IFS) therapeutic model. The application will be optimized for clinical use, providing a 3D interactive environment for therapists and clients to explore and understand the client's internal system.

## Core Features

1.  **IFS-Centric Visualization Engine:**
    *   Procedurally generated 3D systems using WebGL/Three.js.
    *   Dynamic representation of "Self" as a radiant nucleus.
    *   Interactive particle systems for protector parts (managers/firefighters) and exiled parts.
    *   Visualization of part relationships, conflicts, and emotional load through:
        *   Depth-aware node hierarchies.
        *   Real-time particle density and color gradients.
        *   Tension lines and force fields for polarization.
        *   Animations for healing progress (harmonization, luminosity).

2.  **Clinical Interaction Suite:**
    *   Role-based interfaces (therapist and client views).
    *   Multi-layered annotation system:
        *   Session timeline tagging.
        *   Emotional valence heatmaps.
        *   Alliance strength indicators.
    *   Guided IFS protocol integration (direct access vs. witness mode).

3.  **Dynamic Symbolism Toolkit:** (Further details needed)
    * Context-aware

## Technologies

*   **Electron:** For building the desktop application.
*   **WebGL/Three.js:** For 3D graphics and rendering.
*   **React:** (Likely, given the existing project structure) For UI development.
*   **Other Libraries:** (To be determined based on specific needs, e.g., state management, animation).

## Current Status
* Initial project setup with basic Electron and React structure.
* Task description received.
* Context and log files created.

## Next Steps
*   Analyze existing files (package.json, main.js, preload.js, src/App.jsx, src/components/IFSVisualization.jsx, etc.) to understand the current project state.
*   Plan the implementation of the core features, starting with the visualization engine.
*   Determine the best approach for procedural generation of IFS systems.
*   Research relevant Three.js concepts and techniques.