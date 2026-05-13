# PlayCanvas VHS Night Street - Vertical Slice

A minimal WebGL vertical slice prototype featuring a neon-lit night street environment with VHS-style post-processing.

## Files

### Scripts (`/scripts/`)

1. **sceneSetup.js** - Creates the environment:
   - Ground plane (asphalt)
   - 10 building/structure objects with emissive neon materials
   - 5 light sources (moonlight + street lights + accent lights)
   - Fog and atmospheric settings

2. **cameraController.js** - Free camera control:
   - WASD movement
   - Mouse look (pointer lock)
   - Cinematic speed
   - Q/E for up/down movement

3. **vhsPostProcess.js** - VHS screen effects:
   - Chromatic aberration (RGB channel separation)
   - Scanlines
   - Film grain/noise
   - Warm color shift
   - Vignette

### Scene (`/scenes/`)

- **main.scene.json** - Scene configuration reference

## Setup Instructions (PlayCanvas Editor)

### 1. Import Scripts
1. Open your PlayCanvas project
2. Go to the **Scripts** panel
3. Create new scripts and paste the contents:
   - `sceneSetup.js` → Script name: `sceneSetup`
   - `cameraController.js` → Script name: `cameraController`
   - `vhsPostProcess.js` → Script name: `vhsPostProcess`

### 2. Set Up Scene

#### Option A: Manual Setup

**Create SceneManager:**
1. Create an empty entity called "SceneManager"
2. Add the `sceneSetup` script component
3. Enable the script

**Configure Camera:**
1. Select your main Camera entity
2. Set position to `[0, 3, 15]`
3. Set rotation to `[0, -90, 0]`
4. Enable post-processing on the camera component
5. Add script component with two scripts:
   - `cameraController` (first)
   - `vhsPostProcess` (second)

**Set Scene Settings:**
1. In the **Settings** panel → **Render**:
   - Fog: Linear
   - Fog Start: 5
   - Fog End: 80
   - Fog Color: `#140D26` (RGB: 0.08, 0.05, 0.15)
   - Background Color: `#0D051A` (RGB: 0.05, 0.02, 0.1)
   - Ambient Light: `#261A40` (RGB: 0.15, 0.1, 0.25)

#### Option B: Import Scene JSON
1. Use the provided `main.scene.json` as a reference
2. Note: PlayCanvas uses its own export format; use this as a structural guide

### 3. Run the Scene
1. Press **Launch** in the PlayCanvas editor
2. Click on the scene to enable pointer lock
3. Controls:
   - **WASD** - Move forward/left/back/right
   - **Mouse** - Look around
   - **Q/Space** - Move up
   - **E/Ctrl** - Move down

## Visual Style

- **Palette**: Dark neon (blue/purple/orange)
- **Atmosphere**: Heavy fog, low ambient light
- **Lighting**: Moonlight + orange street lamps + colored accent lights
- **Post-process**: VHS degradation effects

## Customization

### Camera Controller Attributes
- `moveSpeed`: Movement speed (default: 8)
- `lookSensitivity`: Mouse sensitivity (default: 0.15)
- `pitchLimit`: Max vertical look angle (default: 80)

### VHS Effect Attributes
- `intensity`: Overall effect strength (default: 1.0)
- `chromaticAberration`: RGB separation (default: 2.0)
- `scanlineIntensity`: Horizontal lines (default: 0.15)
- `noiseIntensity`: Film grain (default: 0.08)
- `warmth`: Orange tint (default: 0.1)
- `vignette`: Edge darkening (default: 0.3)

## Requirements

- PlayCanvas account and project
- Modern web browser with WebGL support

## Notes

- No physics required
- No external dependencies
- Uses only PlayCanvas built-in components and primitives
- All geometry uses basic shapes (boxes, planes, spheres)
