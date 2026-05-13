/**
 * VHS Post-Process Effect Script
 * Implements chromatic aberration, scanlines, noise, and warm color shift
 * Uses PlayCanvas post-effect system with custom shader
 * Attach this script to the camera entity
 */

var VhsPostProcess = pc.createScript('vhsPostProcess');

// Shader definition for VHS effect
var vhsShaderDefinition = {
    attributes: {
        uColorBuffer: {
            type: 'texture',
            title: 'Color Buffer'
        },
        uTime: {
            type: 'float',
            title: 'Time'
        },
        uIntensity: {
            type: 'float',
            title: 'Intensity',
            value: 1.0
        },
        uChromaticAberration: {
            type: 'float',
            title: 'Chromatic Aberration',
            value: 2.0
        },
        uScanlineIntensity: {
            type: 'float',
            title: 'Scanline Intensity',
            value: 0.15
        },
        uNoiseIntensity: {
            type: 'float',
            title: 'Noise Intensity',
            value: 0.08
        },
        uWarmth: {
            type: 'float',
            title: 'Warm Color Shift',
            value: 0.1
        },
        uVignette: {
            type: 'float',
            title: 'Vignette',
            value: 0.3
        }
    },
    glsl: `
        precision highp float;
        
        uniform sampler2D uColorBuffer;
        uniform float uTime;
        uniform float uIntensity;
        uniform float uChromaticAberration;
        uniform float uScanlineIntensity;
        uniform float uNoiseIntensity;
        uniform float uWarmth;
        uniform float uVignette;
        
        varying vec2 vUv0;
        
        // Pseudo-random function for noise
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Noise function
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            
            vec2 u = f * f * (3.0 - 2.0 * f);
            
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main(void) {
            vec2 uv = vUv0;
            
            // Chromatic aberration - offset RGB channels
            float caOffset = uChromaticAberration * 0.001;
            float caWave = sin(uTime * 0.5) * 0.0005;
            
            vec2 redOffset = vec2(caOffset + caWave, 0.0);
            vec2 blueOffset = vec2(-caOffset - caWave, 0.0);
            
            // Sample color channels with offsets
            float r = texture2D(uColorBuffer, uv + redOffset).r;
            float g = texture2D(uColorBuffer, uv).g;
            float b = texture2D(uColorBuffer, uv + blueOffset).b;
            
            vec3 color = vec3(r, g, b);
            
            // Scanlines - horizontal lines
            float scanlineFreq = 480.0;
            float scanline = sin(uv.y * scanlineFreq) * 0.5 + 0.5;
            scanline = scanline * uScanlineIntensity * 0.5 + (1.0 - uScanlineIntensity * 0.5);
            color *= scanline;
            
            // Add subtle moving scanline artifact
            float movingScanline = step(0.98, sin(uv.y * 100.0 - uTime * 2.0));
            color += vec3(movingScanline * 0.02);
            
            // Film grain / noise
            float grain = noise(uv * vec2(1024.0) + uTime * 10.0);
            grain = (grain - 0.5) * uNoiseIntensity;
            color += vec3(grain);
            
            // Temporal noise flicker
            float flicker = random(vec2(uTime * 10.0, 0.0)) * 0.03;
            color += vec3(flicker);
            
            // Warm color shift (orange/amber tint)
            color.r += uWarmth * 0.15;
            color.g += uWarmth * 0.08;
            color.b -= uWarmth * 0.05;
            
            // Slight desaturation
            float luminance = dot(color, vec3(0.299, 0.587, 0.114));
            color = mix(vec3(luminance), color, 0.85);
            
            // Vignette - darken edges
            vec2 center = uv - 0.5;
            float vignette = 1.0 - dot(center, center) * uVignette * 1.5;
            vignette = clamp(vignette, 0.0, 1.0);
            color *= vignette;
            
            // Subtle color bleed at edges
            float edgeDist = length(center);
            float edgeGlow = smoothstep(0.7, 1.0, edgeDist) * 0.1;
            color.r += edgeGlow;
            color.b += edgeGlow * 0.5;
            
            // Apply overall intensity
            color *= uIntensity;
            
            // Gamma correction for CRT-like appearance
            color = pow(color, vec3(1.0 / 2.2));
            
            // Clamp output
            color = clamp(color, 0.0, 1.0);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

// Attributes for customization in editor
VhsPostProcess.attributes.add('enabled', {
    type: 'boolean',
    default: true,
    title: 'Enabled',
    description: 'Enable/disable the VHS effect'
});

VhsPostProcess.attributes.add('intensity', {
    type: 'number',
    default: 1.0,
    min: 0,
    max: 2,
    precision: 2,
    title: 'Overall Intensity',
    description: 'Overall effect intensity'
});

VhsPostProcess.attributes.add('chromaticAberration', {
    type: 'number',
    default: 2.0,
    min: 0,
    max: 10,
    precision: 2,
    title: 'Chromatic Aberration',
    description: 'RGB channel separation amount'
});

VhsPostProcess.attributes.add('scanlineIntensity', {
    type: 'number',
    default: 0.15,
    min: 0,
    max: 1,
    precision: 2,
    title: 'Scanline Intensity',
    description: 'Strength of horizontal scanlines'
});

VhsPostProcess.attributes.add('noiseIntensity', {
    type: 'number',
    default: 0.08,
    min: 0,
    max: 0.5,
    precision: 2,
    title: 'Noise Intensity',
    description: 'Film grain/noise strength'
});

VhsPostProcess.attributes.add('warmth', {
    type: 'number',
    default: 0.1,
    min: 0,
    max: 0.5,
    precision: 2,
    title: 'Warm Color Shift',
    description: 'Orange/amber tint amount'
});

VhsPostProcess.attributes.add('vignette', {
    type: 'number',
    default: 0.3,
    min: 0,
    max: 1,
    precision: 2,
    title: 'Vignette',
    description: 'Edge darkening amount'
});

VhsPostProcess.prototype.initialize = function() {
    this.time = 0;
    
    // Create the post-effect
    this.effect = new pc.PostEffect(this.app.graphicsDevice, vhsShaderDefinition);
    
    // Set initial uniform values
    this.updateUniforms();
    
    // Add the effect to the camera's post-effects queue
    var camera = this.entity.camera;
    if (camera) {
        camera.postEffects.addEffect(this.effect);
    }
};

VhsPostProcess.prototype.updateUniforms = function() {
    if (!this.effect) return;
    
    this.effect.setFloat('uTime', this.time);
    this.effect.setFloat('uIntensity', this.intensity);
    this.effect.setFloat('uChromaticAberration', this.chromaticAberration);
    this.effect.setFloat('uScanlineIntensity', this.scanlineIntensity);
    this.effect.setFloat('uNoiseIntensity', this.noiseIntensity);
    this.effect.setFloat('uWarmth', this.warmth);
    this.effect.setFloat('uVignette', this.vignette);
};

VhsPostProcess.prototype.update = function(dt) {
    this.time += dt;
    this.updateUniforms();
};

VhsPostProcess.prototype.onEnable = function() {
    if (this.effect) {
        var camera = this.entity.camera;
        if (camera && !camera.postEffects.hasEffect(this.effect)) {
            camera.postEffects.addEffect(this.effect);
        }
    }
};

VhsPostProcess.prototype.onDisable = function() {
    if (this.effect) {
        var camera = this.entity.camera;
        if (camera) {
            camera.postEffects.removeEffect(this.effect);
        }
    }
};

VhsPostProcess.prototype.onDestroy = function() {
    if (this.effect) {
        var camera = this.entity.camera;
        if (camera) {
            camera.postEffects.removeEffect(this.effect);
        }
    }
};
