# EngiViz - Engineering Concepts Visualizer

## Current State
The app has 4 concept cards (Mechanics, Thermodynamics, Electrical Circuits, Fluid Dynamics) with static colored headers showing an icon. Each card has a title, description, and "Explore Now" button.

## Requested Changes (Diff)

### Add
- Interactive simulation embedded in each concept card, replacing the static colored header area
  - **Mechanics**: Interactive free-body diagram — draggable force vectors with a mass block; user adjusts angle/magnitude via sliders and sees net force arrow update in real time
  - **Thermodynamics**: Heat flow animation — two containers at different temperatures with animated particles moving faster/slower; temperature slider adjusts the gradient and particle speed
  - **Electrical Circuits**: Animated circuit — a simple loop with a battery, resistor, and switch; clicking the switch opens/closes the circuit and animated current dots flow through the wire; voltage/resistance sliders update the current readout
  - **Fluid Dynamics**: Particle flow simulation — animated dots flowing through a pipe; a pipe-width slider demonstrates Bernoulli's principle (narrow = faster particles)

### Modify
- ConceptCard component: replace static `h-32 gradient` header div with an embedded simulation canvas/SVG component
- Each simulation is self-contained and interactive (mouse/touch + sliders)

### Remove
- Static gradient header divs in concept cards

## Implementation Plan
1. Create `MechanicsSimulation`, `ThermoSimulation`, `CircuitSimulation`, `FluidSimulation` components using Canvas API with `useRef` + `requestAnimationFrame`
2. Each simulation fits in a 300x160px area (the former card header)
3. Include minimal controls (sliders or clickable buttons) directly inside or below the canvas
4. Update `ConceptCard` to accept a simulation component and render it at the top
5. Keep the rest of each card (title, badge, description, button) unchanged
