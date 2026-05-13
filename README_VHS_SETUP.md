# EXTREME VHS POSTPROCESS - SETUP GUIDE

## "Corrupted 1990-1995 Anime OVA Playback System"

This is not a filter. This is a full perceptual degradation layer simulating unstable analog tape playback of a neon city memory.

---

## QUICK START

### Step 1: Import Scripts

1. Go to your PlayCanvas project
2. In the **Scripts** folder, upload these three files:
   - `extremeVHSPostProcess.js` (MAIN - 745 lines)
   - `sceneSetup.js` (UPDATED - 252 lines)
   - `cameraController.js` (existing - keep as is)

### Step 2: Create Scene Manager Entity

1. Create empty entity named `SceneManager`
2. Add script: **sceneSetup**
3. Configure fog settings (recommended for extreme VHS):
   ```
   Fog Color R: 0.15
   Fog Color G: 0.08
   Fog Color B: 0.35
   Fog Start: 5.0    ← AGGRESSIVE (close = more erosion)
   Fog End: 60.0     ← AGGRESSIVE (close = less readability)
   Ambient Intensity: 0.3
   ```

### Step 3: Configure Camera

1. Select your **Camera** entity
2. In **Camera Component**:
   - ✅ Enable **Post Process** checkbox (CRITICAL!)
   - Set **Post Effect Quality** to High
   
3. Add script: **extremeVHSPostProcess**
4. Add script: **cameraController** (for WASD movement)

### Step 4: Tune VHS Parameters

With camera selected, adjust `extremeVHSPostProcess` settings:

#### RECOMMENDED "EXTREME" PRESET:

```javascript
// Overall
Intensity: 1.2          // Slightly overdriven

// Layer 1: Color Degradation
Black Level: 0.12       // Lifted blacks (never true black)
Highlight Roll-off: 0.75 // Crushed highlights
WB Drift: 0.2           // Unstable white balance
Midtone Compression: 1.6 // Aggressive compression

// Layer 2: Chromatic Failure
RGB Separation: 6.0     // STRONG channel misalignment
Non-Uniform Offset: 0.8 // Per-scanline variation
Time-Varying: 0.5       // RGB drift over time
Edge-Dependent: 1.2     // Stronger at high contrast edges

// Layer 3: Tape Warp
Horizontal Wave: 0.025  // Visible wave distortion
Vertical Jitter: 0.008  // Random bursts
Tracking Loss: 0.01     // Continuous instability
Scan Tearing: 0.6       // Frequent glitches

// Layer 4: CRT Structure
Scanline Strength: 0.6  // Variable intensity
Phosphor Glow: 0.5      // Soft halo on bright pixels
Subpixel Shimmer: 0.4   // Instability

// Layer 5: Analog Noise
Grain Intensity: 0.25   // Multi-frequency noise
Macro Blotches: 0.12    // Large clusters
Temporal Drift: 0.9     // Fast noise animation
Noise Color Bias: [0.3, 0.2, 0.7] // Blue/purple dominant

// Layer 6: Motion Ghosting
Ghosting Enabled: true
Ghosting Strength: 0.35
Ghosting Decay: 3.0     // 3-frame trails

// Layer 7: Signal Instability
Instability Chance: 0.02 // 2% per frame = frequent glitches
Sync Shift Amount: 0.05

// Integration
Camera Motion Influence: 2.0
Fog Bleed: 0.6          // Strong fog+VHS merge
Distance Erosion: 0.8   // Heavy edge loss at distance
```

---

## SUCCESS VERIFICATION

Your scene is correctly configured when:

✅ **Image appears "broken" at all times**
- Never stable, always drifting
- Edges move independently of geometry
- Colors separate during motion

✅ **Motion creates tape instability**
- Fast camera movement = severe degradation
- Slow movement = subtle instability
- Direction affects ghosting smear

✅ **Fog and VHS merge into one layer**
- Distance reduces readability aggressively
- Colors bleed into fog
- Silhouettes erode at distance

✅ **Feels like corrupted footage**
- Not decorative retro filter
- Not clean CRT shader
- Feels unstable and analog-corrupted

---

## PERFORMANCE TIPS

If framerate drops:

1. **Reduce Quality Multiplier** to 0.5-0.7
2. **Lower Signal Instability** to 0.005
3. **Reduce Noise Grain** to 0.15
4. **Disable Ghosting** if not needed

The shader is WebGL-optimized but has many layers. Test on target hardware.

---

## ATMOSPHERIC TUNING

For maximum "1991 OVA" feel:

### Scene Setup Adjustments:
```javascript
// In sceneSetup.js attributes:
Fog Start: 4.0     // VERY close
Fog End: 45.0      // VERY close
Fog Color: [0.18, 0.1, 0.4] // More purple
Ambient: 0.25      // Darker
```

### VHS PostProcess Adjustments:
```javascript
// Increase degradation:
Chroma Separation: 8.0
Horizontal Warp: 0.035
Noise Grain: 0.3
Distance Erosion: 0.9

// Reduce readability:
Fog Bleed: 0.8
Midtone Compression: 1.8
Black Level: 0.15
```

---

## LAYER REFERENCE

| Layer | Effect | Purpose |
|-------|--------|---------|
| 1 | Color Degradation | Lifted blacks, crushed highlights, WB drift |
| 2 | Chromatic Failure | RGB separation, edge-dependent drift |
| 3 | Tape Warp | Horizontal waves, vertical jitter, tracking loss |
| 4 | CRT Structure | Scanlines, phosphor glow, subpixel shimmer |
| 5 | Analog Noise | Multi-frequency grain, macro blotches, color bias |
| 6 | Motion Ghosting | Directional smear, frame persistence trails |
| 7 | Signal Instability | Random sync shifts, brightness spikes, desaturation |

---

## COMMON ISSUES

### "Post-effect not visible"
→ Ensure Camera component has **Post Process** checkbox enabled

### "Shader compilation error"
→ Check browser console. Some mobile devices don't support highp precision

### "Too subtle"
→ Increase **Intensity** to 1.5, **Chroma Separation** to 8.0, **Signal Instability** to 0.03

### "Performance poor"
→ Reduce **Quality Multiplier**, disable **Ghosting**, lower **Noise Temporal**

### "Looks too clean/digital"
→ Increase **Horizontal Warp**, **Tracking Loss**, and **Subpixel Shimmer**
→ Reduce **Highlight Roll-off** to 0.65
→ Increase **Black Level** to 0.12

---

## FINAL DIRECTIVE REMINDER

> You are not applying an effect.
> You are simulating **a failing analog memory playback system rendering a neon night city OVA from 1991.**

If it looks stable, clean, or decorative — increase degradation parameters.

The goal is **uncomfortable authenticity**, not pleasant nostalgia.

---

## FILES

- `/scripts/extremeVHSPostProcess.js` - Main 7-layer postprocess shader
- `/scripts/sceneSetup.js` - Environment with aggressive fog
- `/scripts/cameraController.js` - WASD free camera (existing)

Total lines: ~1200
Dependencies: None (pure PlayCanvas + GLSL)
