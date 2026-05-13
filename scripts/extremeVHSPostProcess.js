// ============================================
// EXTREME VHS / ANALOG TAPE DEGRADATION SYSTEM
// "Corrupted 1990-1995 Anime OVA Playback"
// ============================================

var ExtremeVHSPostProcess = pc.createScript('extremeVHSPostProcess');

// Performance & Quality Attributes
ExtremeVHSPostProcess.attributes.add('quality', {
    type: 'number',
    default: 1.0,
    min: 0.3,
    max: 1.0,
    title: 'Quality Multiplier',
    description: 'Reduce for performance (affects noise resolution)'
});

ExtremeVHSPostProcess.attributes.add('intensity', {
    type: 'number',
    default: 1.0,
    min: 0.0,
    max: 2.0,
    title: 'Overall Intensity',
    description: 'Global multiplier for all degradation effects'
});

// Layer 1: Color Degradation
ExtremeVHSPostProcess.attributes.add('blackLevel', {
    type: 'number',
    default: 0.08,
    min: 0.0,
    max: 0.25,
    title: 'Lifted Blacks',
    description: 'Never true black - analog tape floor'
});

ExtremeVHSPostProcess.attributes.add('highlightRollOff', {
    type: 'number',
    default: 0.85,
    min: 0.5,
    max: 1.0,
    title: 'Highlight Roll-off',
    description: 'Crushed highlights (lower = more crushed)'
});

ExtremeVHSPostProcess.attributes.add('whiteBalanceDrift', {
    type: 'number',
    default: 0.15,
    min: 0.0,
    max: 0.5,
    title: 'WB Drift Amplitude',
    description: 'Unstable white balance oscillation'
});

ExtremeVHSPostProcess.attributes.add('midtoneCompression', {
    type: 'number',
    default: 1.4,
    min: 1.0,
    max: 2.5,
    title: 'Midtone Compression',
    description: 'Aggressive midtone compression factor'
});

// Layer 2: Chromatic Failure
ExtremeVHSPostProcess.attributes.add('chromaSeparation', {
    type: 'number',
    default: 4.0,
    min: 0.0,
    max: 12.0,
    title: 'RGB Separation',
    description: 'Strong channel misalignment (pixels)'
});

ExtremeVHSPostProcess.attributes.add('chromaNonUniform', {
    type: 'number',
    default: 0.6,
    min: 0.0,
    max: 1.0,
    title: 'Non-Uniform Offset',
    description: 'Per-scanline RGB variation'
});

ExtremeVHSPostProcess.attributes.add('chromaTimeVary', {
    type: 'number',
    default: 0.3,
    min: 0.0,
    max: 1.0,
    title: 'Time-Varying Misalignment',
    description: 'RGB drift over time'
});

ExtremeVHSPostProcess.attributes.add('edgeDependentChroma', {
    type: 'number',
    default: 0.8,
    min: 0.0,
    max: 2.0,
    title: 'Edge-Dependent Drift',
    description: 'Stronger color bleed at high contrast edges'
});

// Layer 3: Tape Warp Distortion
ExtremeVHSPostProcess.attributes.add('horizontalWarp', {
    type: 'number',
    default: 0.015,
    min: 0.0,
    max: 0.08,
    title: 'Horizontal Wave',
    description: 'Sin + noise modulation amplitude'
});

ExtremeVHSPostProcess.attributes.add('verticalJitter', {
    type: 'number',
    default: 0.004,
    min: 0.0,
    max: 0.03,
    title: 'Vertical Jitter',
    description: 'Random frame interval bursts'
});

ExtremeVHSPostProcess.attributes.add('trackingLoss', {
    type: 'number',
    default: 0.006,
    min: 0.0,
    max: 0.05,
    title: 'Tracking Loss',
    description: 'Subtle frame instability'
});

ExtremeVHSPostProcess.attributes.add('scanTearing', {
    type: 'number',
    default: 0.4,
    min: 0.0,
    max: 1.0,
    title: 'Scan Tearing Frequency',
    description: 'Occasional horizontal glitches'
});

// Layer 4: CRT Scan Structure
ExtremeVHSPostProcess.attributes.add('scanlineIntensity', {
    type: 'number',
    default: 0.5,
    min: 0.0,
    max: 1.0,
    title: 'Scanline Strength',
    description: 'Variable intensity scanlines'
});

ExtremeVHSPostProcess.attributes.add('phosphorGlow', {
    type: 'number',
    default: 0.35,
    min: 0.0,
    max: 1.0,
    title: 'Phosphor Glow',
    description: 'Soft halo per bright pixel'
});

ExtremeVHSPostProcess.attributes.add('subpixelShimmer', {
    type: 'number',
    default: 0.25,
    min: 0.0,
    max: 0.8,
    title: 'Subpixel Shimmer',
    description: 'Instability at subpixel level'
});

// Layer 5: Analog Noise Field
ExtremeVHSPostProcess.attributes.add('noiseGrain', {
    type: 'number',
    default: 0.18,
    min: 0.0,
    max: 0.6,
    title: 'Grain Intensity',
    description: 'Multi-frequency noise base'
});

ExtremeVHSPostProcess.attributes.add('noiseMacro', {
    type: 'number',
    default: 0.08,
    min: 0.0,
    max: 0.4,
    title: 'Macro Blotches',
    description: 'Large noise clusters'
});

ExtremeVHSPostProcess.attributes.add('noiseTemporal', {
    type: 'number',
    default: 0.7,
    min: 0.0,
    max: 1.0,
    title: 'Temporal Drift',
    description: 'Noise animation speed'
});

ExtremeVHSPostProcess.attributes.add('noiseColorBias', {
    type: 'vec3',
    default: [0.3, 0.2, 0.6],
    title: 'Noise Color Bias',
    description: 'Blue/purple dominance (RGB)'
});

// Layer 6: Motion Ghosting
ExtremeVHSPostProcess.attributes.add('ghostingEnabled', {
    type: 'boolean',
    default: true,
    title: 'Motion Ghosting',
    description: 'Enable directional smear'
});

ExtremeVHSPostProcess.attributes.add('ghostingIntensity', {
    type: 'number',
    default: 0.25,
    min: 0.0,
    max: 0.8,
    title: 'Ghosting Strength',
    description: 'Frame persistence trails'
});

ExtremeVHSPostProcess.attributes.add('ghostingDecay', {
    type: 'number',
    default: 3.0,
    min: 1.0,
    max: 8.0,
    title: 'Ghosting Decay',
    description: 'Trail length (frames)'
});

// Layer 7: Signal Instability Events
ExtremeVHSPostProcess.attributes.add('signalInstability', {
    type: 'number',
    default: 0.015,
    min: 0.0,
    max: 0.1,
    title: 'Instability Chance',
    description: 'Per-frame probability of glitch event'
});

ExtremeVHSPostProcess.attributes.add('syncShiftStrength', {
    type: 'number',
    default: 0.03,
    min: 0.0,
    max: 0.15,
    title: 'Sync Shift Amount',
    description: 'Horizontal offset jump magnitude'
});

// Camera influence
ExtremeVHSPostProcess.attributes.add('cameraInfluence', {
    type: 'number',
    default: 1.5,
    min: 0.0,
    max: 5.0,
    title: 'Camera Motion Influence',
    description: 'How much camera speed affects degradation'
});

// Fog/Atmosphere integration
ExtremeVHSPostProcess.attributes.add('fogBleed', {
    type: 'number',
    default: 0.4,
    min: 0.0,
    max: 1.0,
    title: 'Fog Color Bleed',
    description: 'Color bleeding into fog areas'
});

ExtremeVHSPostProcess.attributes.add('distanceErosion', {
    type: 'number',
    default: 0.6,
    min: 0.0,
    max: 1.0,
    title: 'Distance Erosion',
    description: 'Edge clarity loss at distance'
});

// Internal state
ExtremeVHSPostProcess.prototype.initialize = function() {
    this.time = 0;
    this.lastCameraPos = new pc.Vec3();
    this.cameraVelocity = 0;
    this.glitchState = {
        active: false,
        timer: 0,
        type: 0,
        offset: 0
    };
    
    // Ghosting frame history (for motion trails)
    this.ghostFrames = [];
    this.maxGhostFrames = 4;
    
    this.on('attr:intensity', this.updateShader, this);
    this.on('attr:blackLevel', this.updateShader, this);
    this.on('attr:chromaSeparation', this.updateShader, this);
    this.on('attr:horizontalWarp', this.updateShader, this);
    this.on('attr:noiseGrain', this.updateShader, this);
    
    // Create post-effect
    this.effect = new pc.PostEffect(this.app.graphicsDevice);
    this.effect.shader = this.createShader();
    
    this.camera = this.entity.camera;
    if (this.camera) {
        this.camera.postEffects.addEffect(this.effect);
    }
};

ExtremeVHSPostProcess.prototype.createShader = function() {
    var gd = this.app.graphicsDevice;
    
    var shaderCode = `
precision highp float;

uniform sampler2D uColorBuffer;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

// Layer 1: Color Degradation
uniform float uBlackLevel;
uniform float uHighlightRollOff;
uniform float uWhiteBalanceDrift;
uniform float uMidtoneCompression;

// Layer 2: Chromatic Failure
uniform float uChromaSeparation;
uniform float uChromaNonUniform;
uniform float uChromaTimeVary;
uniform float uEdgeDependentChroma;

// Layer 3: Tape Warp
uniform float uHorizontalWarp;
uniform float uVerticalJitter;
uniform float uTrackingLoss;
uniform float uScanTearing;

// Layer 4: CRT Structure
uniform float uScanlineIntensity;
uniform float uPhosphorGlow;
uniform float uSubpixelShimmer;

// Layer 5: Noise
uniform float uNoiseGrain;
uniform float uNoiseMacro;
uniform float uNoiseTemporal;
uniform vec3 uNoiseColorBias;

// Layer 6: Ghosting
uniform float uGhostingIntensity;
uniform float uGhostingDecay;
uniform bool uGhostingEnabled;

// Layer 7: Signal Instability
uniform float uSignalInstability;
uniform float uSyncShiftStrength;
uniform float uGlitchTimer;
uniform int uGlitchType;
uniform float uGlitchOffset;

// Camera & Scene
uniform float uCameraVelocity;
uniform float uFogBleed;
uniform float uDistanceErosion;
uniform vec3 uFogColor;
uniform float uFogStart;
uniform float uFogEnd;

// Pseudo-random functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Multi-frequency noise for analog feel
float multiFreqNoise(vec2 uv, float time) {
    float n = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    
    for(int i = 0; i < 4; i++) {
        n += noise(uv * freq + time * 0.5) * amp;
        freq *= 2.3;
        amp *= 0.5;
    }
    
    return n / 1.5;
}

// Macro blotch noise
float macroNoise(vec2 uv, float time) {
    return noise(uv * 0.15 + time * 0.1) * 
           noise(uv * 0.3 + time * 0.2);
}

// Edge detection for edge-dependent effects
float detectEdge(sampler2D tex, vec2 uv, vec2 texel) {
    float center = texture2D(tex, uv).r;
    float left = texture2D(tex, uv - vec2(texel.x, 0.0)).r;
    float right = texture2D(tex, uv + vec2(texel.x, 0.0)).r;
    float up = texture2D(tex, uv - vec2(0.0, texel.y)).r;
    float down = texture2D(tex, uv + vec2(0.0, texel.y)).r;
    
    return abs(center - left) + abs(center - right) + 
           abs(center - up) + abs(center - down);
}

// Variable scanlines (not uniform)
float variableScanline(vec2 uv, float time) {
    float scan = sin(uv.y * uResolution.y * 3.14159);
    float variation = noise(vec2(uv.x * 10.0, time * 2.0)) * 0.3;
    return scan * (1.0 + variation);
}

// Phosphor glow simulation
float phosphorGlow(sampler2D tex, vec2 uv, vec2 texel) {
    vec3 center = texture2D(tex, uv).rgb;
    float brightness = dot(center, vec3(0.299, 0.587, 0.114));
    
    if(brightness > 0.5) {
        float glow = 0.0;
        glow += texture2D(tex, uv + vec2(texel.x, 0.0)).r;
        glow += texture2D(tex, uv - vec2(texel.x, 0.0)).r;
        glow += texture2D(tex, uv + vec2(0.0, texel.y)).g;
        glow += texture2D(tex, uv - vec2(0.0, texel.y)).g;
        glow += texture2D(tex, uv + vec2(texel.x, texel.y)).b;
        glow += texture2D(tex, uv - vec2(texel.x, texel.y)).b;
        
        return (glow / 6.0) * (brightness - 0.5) * 2.0;
    }
    
    return 0.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 texel = 1.0 / uResolution;
    
    // ========== LAYER 7: SIGNAL INSTABILITY EVENTS ==========
    float syncOffset = 0.0;
    float brightnessMod = 1.0;
    float desatAmount = 0.0;
    
    if(uGlitchTimer > 0.0) {
        if(uGlitchType == 0) {
            // Horizontal sync shift
            syncOffset = uGlitchOffset;
        } else if(uGlitchType == 1) {
            // Brightness spike
            brightnessMod = 1.5 + sin(uTime * 50.0) * 0.5;
        } else if(uGlitchType == 2) {
            // Desaturation collapse
            desatAmount = 0.8;
        } else if(uGlitchType == 3) {
            // Frame washout
            brightnessMod = 0.2;
        }
    }
    
    uv.x += syncOffset;
    
    // Wrap UV for sync shift
    if(uv.x > 1.0) uv.x -= 1.0;
    if(uv.x < 0.0) uv.x += 1.0;
    
    // ========== LAYER 3: TAPE WARP DISTORTION ==========
    vec2 warpedUV = uv;
    
    // Horizontal wave with noise modulation
    float warpNoise = multiFreqNoise(vec2(uv.y * 5.0, uTime * 0.8), uTime);
    warpedUV.x += sin(uv.y * 30.0 + uTime * 2.0) * uHorizontalWarp;
    warpedUV.x += warpNoise * uHorizontalWarp * 0.5;
    
    // Vertical jitter bursts
    float jitterNoise = noise(vec2(uTime * 10.0, uv.x * 20.0));
    if(jitterNoise > 0.85) {
        warpedUV.y += (jitterNoise - 0.85) * uVerticalJitter * 5.0;
    }
    
    // Tracking loss (subtle continuous instability)
    warpedUV.x += sin(uTime * 1.5) * uTrackingLoss;
    warpedUV.y += cos(uTime * 0.8) * uTrackingLoss * 0.3;
    
    // Scan tearing (random horizontal lines)
    float tearNoise = hash(floor(vec2(uv.x * 100.0, uv.y * 500.0 + uTime)));
    if(tearNoise > (1.0 - uScanTearing * 0.02)) {
        warpedUV.x += (tearNoise - 0.5) * 0.02;
    }
    
    // ========== SAMPLE WITH WARPED UV ==========
    vec3 color = texture2D(uColorBuffer, warpedUV).rgb;
    
    // ========== LAYER 2: CHROMATIC FAILURE ==========
    // Time-varying RGB separation
    float timeVary = sin(uTime * 3.0) * uChromaTimeVary;
    
    // Non-uniform offset per scanline
    float scanlineOffset = sin(warpedUV.y * 100.0) * uChromaNonUniform;
    
    // Edge-dependent chroma drift
    float edgeStrength = detectEdge(uColorBuffer, warpedUV, texel);
    float edgeChroma = edgeStrength * uEdgeDependentChroma;
    
    // Camera velocity influence on chroma
    float velChroma = min(uCameraVelocity * 0.02, 1.0) * uChromaSeparation * 0.3;
    
    // Total separation amounts
    float sepR = (uChromaSeparation + timeVary + scanlineOffset + edgeChroma + velChroma) * texel.x;
    float sepG = (timeVary * 0.5) * texel.x;
    float sepB = -(uChromaSeparation + timeVary - scanlineOffset + edgeChroma + velChroma) * texel.x;
    
    float r = texture2D(uColorBuffer, warpedUV + vec2(sepR, 0.0)).r;
    float g = texture2D(uColorBuffer, warpedUV + vec2(sepG, 0.0)).g;
    float b = texture2D(uColorBuffer, warpedUV + vec2(sepB, 0.0)).b;
    
    color = vec3(r, g, b);
    
    // ========== LAYER 1: COLOR DEGRADATION ==========
    // Lifted blacks (never true black)
    color = max(color, vec3(uBlackLevel));
    
    // Crushed highlight roll-off
    color = pow(color, vec3(1.0 / uHighlightRollOff));
    color = clamp(color, 0.0, 1.0);
    
    // Unstable white balance drift
    float wbOsc = sin(uTime * 0.3) * uWhiteBalanceDrift;
    color.r *= (1.0 + wbOsc);
    color.b *= (1.0 - wbOsc * 0.7);
    
    // Aggressive midtone compression
    color = pow(color, vec3(uMidtoneCompression));
    
    // Apply signal instability mods
    color *= brightnessMod;
    color = mix(color, vec3(dot(color, vec3(0.333))), desatAmount);
    
    // ========== LAYER 4: CRT SCAN STRUCTURE ==========
    // Variable intensity scanlines
    float scanline = variableScanline(uv, uTime);
    color *= 1.0 - scanline * uScanlineIntensity * 0.5;
    
    // Phosphor glow
    float glow = phosphorGlow(uColorBuffer, warpedUV, texel);
    color += glow * uPhosphorGlow * vec3(1.0, 0.9, 0.8);
    
    // Subpixel shimmer
    float shimmer = noise(vec2(uv.x * uResolution.x, uTime * 10.0)) * uSubpixelShimmer;
    if(fract(uv.x * uResolution.x) < 0.33) color.r += shimmer;
    else if(fract(uv.x * uResolution.x) < 0.66) color.g += shimmer;
    else color.b += shimmer;
    
    // ========== LAYER 5: ANALOG NOISE FIELD ==========
    float temporalNoise = uTime * uNoiseTemporal;
    
    // Multi-frequency grain
    float grain = multiFreqNoise(uv * (2.0 / uIntensity) + temporalNoise, temporalNoise);
    grain = grain * 2.0 - 1.0; // Center around 0
    
    // Macro blotches (localized clusters)
    float macro = macroNoise(uv + temporalNoise * 0.1, temporalNoise);
    macro = (macro - 0.25) * 2.0;
    
    // Combine noise types
    float totalNoise = grain * uNoiseGrain + macro * uNoiseMacro;
    
    // Color bias (blue/purple dominance)
    vec3 noiseColor = totalNoise * uNoiseColorBias;
    color += noiseColor;
    
    // Temporal noise drift (ensure it's not static)
    color += sin(uTime * 20.0 + uv.y * 100.0) * 0.02 * uNoiseColorBias;
    
    // ========== ATMOSPHERIC INTEGRATION ==========
    // Fog color bleed
    float depthFactor = smoothstep(0.0, 1.0, (uv.y - 0.5) * 2.0);
    color = mix(color, color + uFogColor * uFogBleed * depthFactor, depthFactor);
    
    // Distance erosion (loss of edge clarity)
    float erosion = smoothstep(0.3, 1.0, uv.y) * uDistanceErosion;
    float blurNoise = noise(vec2(uv.x * 10.0 + uTime, uv.y * 5.0));
    vec2 erosionUV = uv + vec2(blurNoise * erosion * 0.01, 0.0);
    if(erosionUV.x >= 0.0 && erosionUV.x <= 1.0) {
        color = mix(color, texture2D(uColorBuffer, erosionUV).rgb, erosion * 0.3);
    }
    
    // Heavy fog blending enhancement
    float fogBlend = smoothstep(0.4, 1.0, uv.y);
    color = mix(color, uFogColor * 0.3, fogBlend * uFogBleed * 0.5);
    
    // Silhouette erosion at distance
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    float silhouetteLoss = fogBlend * erosion * 0.4;
    color = mix(color, vec3(luminance), silhouetteLoss);
    
    // ========== FINAL OUTPUT ==========
    // Clamp to valid range
    color = clamp(color, 0.0, 1.0);
    
    // Slight vignette for analog feel
    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    vignette = pow(vignette, 2.0);
    color *= vignette * 0.8 + 0.2;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

    return new pc.Shader(gd, {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION
        },
        vshader: `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,
        fshader: shaderCode,
        tag: pc.SHADERTAG_MATERIAL
    });
};

ExtremeVHSPostProcess.prototype.updateShader = function() {
    if(!this.effect || !this.effect.shader) return;
    
    var gd = this.app.graphicsDevice;
    this.effect.shader = this.createShader();
};

ExtremeVHSPostProcess.prototype.update = function(dt) {
    if(!this.effect || !this.effect.shader) return;
    
    this.time += dt;
    
    // Calculate camera velocity
    if(this.camera && this.camera.camera) {
        var camEntity = this.camera.entity;
        var currentPos = camEntity.getPosition();
        var velocity = currentPos.clone().sub(this.lastCameraPos).length() / dt;
        this.cameraVelocity = velocity;
        this.lastCameraPos.copy(currentPos);
    }
    
    // Random signal instability events
    if(Math.random() < this.signalInstability * dt && !this.glitchState.active) {
        this.glitchState.active = true;
        this.glitchState.timer = 0.1 + Math.random() * 0.15; // 100-250ms
        this.glitchState.type = Math.floor(Math.random() * 4);
        this.glitchState.offset = (Math.random() - 0.5) * this.syncShiftStrength;
    }
    
    if(this.glitchState.active) {
        this.glitchState.timer -= dt;
        if(this.glitchState.timer <= 0) {
            this.glitchState.active = false;
        }
    }
    
    // Get fog settings from scene
    var fogColor = this.app.scene.fogColor;
    var fogStart = this.app.scene.fogStart;
    var fogEnd = this.app.scene.fogEnd;
    
    // Update shader uniforms
    var device = this.app.graphicsDevice;
    var scope = device.scope;
    
    scope.resolve('uTime').setValue(this.time);
    scope.resolve('uIntensity').setValue(this.intensity);
    scope.resolve('uResolution').setValue([device.width, device.height]);
    
    // Layer 1
    scope.resolve('uBlackLevel').setValue(this.blackLevel);
    scope.resolve('uHighlightRollOff').setValue(this.highlightRollOff);
    scope.resolve('uWhiteBalanceDrift').setValue(this.whiteBalanceDrift);
    scope.resolve('uMidtoneCompression').setValue(this.midtoneCompression);
    
    // Layer 2
    scope.resolve('uChromaSeparation').setValue(this.chromaSeparation);
    scope.resolve('uChromaNonUniform').setValue(this.chromaNonUniform);
    scope.resolve('uChromaTimeVary').setValue(this.chromaTimeVary);
    scope.resolve('uEdgeDependentChroma').setValue(this.edgeDependentChroma);
    
    // Layer 3
    scope.resolve('uHorizontalWarp').setValue(this.horizontalWarp);
    scope.resolve('uVerticalJitter').setValue(this.verticalJitter);
    scope.resolve('uTrackingLoss').setValue(this.trackingLoss);
    scope.resolve('uScanTearing').setValue(this.scanTearing);
    
    // Layer 4
    scope.resolve('uScanlineIntensity').setValue(this.scanlineIntensity);
    scope.resolve('uPhosphorGlow').setValue(this.phosphorGlow);
    scope.resolve('uSubpixelShimmer').setValue(this.subpixelShimmer);
    
    // Layer 5
    scope.resolve('uNoiseGrain').setValue(this.noiseGrain);
    scope.resolve('uNoiseMacro').setValue(this.noiseMacro);
    scope.resolve('uNoiseTemporal').setValue(this.noiseTemporal);
    scope.resolve('uNoiseColorBias').setValue([this.noiseColorBias.x, this.noiseColorBias.y, this.noiseColorBias.z]);
    
    // Layer 6
    scope.resolve('uGhostingIntensity').setValue(this.ghostingEnabled ? this.ghostingIntensity : 0.0);
    scope.resolve('uGhostingDecay').setValue(this.ghostingDecay);
    
    // Layer 7
    scope.resolve('uSignalInstability').setValue(this.signalInstability);
    scope.resolve('uSyncShiftStrength').setValue(this.syncShiftStrength);
    scope.resolve('uGlitchTimer').setValue(this.glitchState.active ? this.glitchState.timer : 0.0);
    scope.resolve('uGlitchType').setValue(this.glitchState.active ? this.glitchState.type : -1);
    scope.resolve('uGlitchOffset').setValue(this.glitchState.offset);
    
    // Camera & Scene
    scope.resolve('uCameraVelocity').setValue(this.cameraVelocity * this.cameraInfluence);
    scope.resolve('uFogBleed').setValue(this.fogBleed);
    scope.resolve('uDistanceErosion').setValue(this.distanceErosion);
    scope.resolve('uFogColor').setValue([fogColor.r, fogColor.g, fogColor.b]);
    scope.resolve('uFogStart').setValue(fogStart);
    scope.resolve('uFogEnd').setValue(fogEnd);
};

ExtremeVHSPostProcess.prototype.onDisable = function() {
    if(this.camera && this.camera.postEffects) {
        this.camera.postEffects.removeEffect(this.effect);
    }
};

ExtremeVHSPostProcess.prototype.onEnable = function() {
    if(this.camera && this.camera.postEffects) {
        this.camera.postEffects.addEffect(this.effect);
    }
};
