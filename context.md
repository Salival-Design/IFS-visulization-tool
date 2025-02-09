# IFS Visualization Tool - Project Context

## Overview

This project aims to develop a feature-rich Electron application for visualizing the Internal Family Systems (IFS) therapeutic model. The application will be optimized for clinical use, providing a 3D interactive environment for therapists and clients to explore and understand the client's internal system.

## Core Features

1.  **IFS-Centric Visualization Engine:**
    *   Procedurally generated 3D systems using WebGL/Three.js.
    *   Dynamic representation of "Self" as a radiant nucleus.
    *   Interactive particle systems for protector parts (managers/firefighters) and exiled parts.
    *   Custom image textures for personalized part representation.
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
    *   Professional Clinical Control Panel:
        *   Session management and tracking.
        *   Part creation and customization.
        *   Custom image upload support.
        *   Relationship mapping.
        *   Clinical annotations.
        *   Progress tracking.

3.  **Dynamic Symbolism Toolkit:**
    *   Customizable visual representations:
        *   Part size and appearance.
        *   Custom image textures.
        *   Emotional load visualization.
        *   Relationship indicators.
        *   Environmental effects.
    *   Interactive feedback system:
        *   Real-time part state updates.
        *   Visual response to therapeutic interventions.
        *   Session progress tracking.

## Technologies

*   **Electron:** For building the desktop application.
*   **React:** For UI development and component management.
*   **TypeScript:** For type safety and better development experience.
*   **Three.js/React Three Fiber:** For 3D graphics and rendering.
*   **React Spring:** For smooth animations and transitions.
*   **Zustand:** For state management.

## Current Status

### Completed Features
* Initial project setup complete
* Basic 3D visualization implemented
* Core IFS model structure defined
* Professional clinical panel implemented
* Part management system with custom images
* Real-time visualization settings management
* Session tracking and management
* Relationship visualization between parts
* Clinical annotation system

### In Progress
* Enhanced relationship visualization
* Session recording and playback
* Guided protocol integration
* Data persistence and session management

### Planned Features
* Client profile management
* Session history tracking
* Export and reporting tools
* Advanced visualization effects
* Collaborative session support