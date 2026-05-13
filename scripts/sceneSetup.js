/**
 * Scene Setup Script
 * Creates a minimal night street/highway environment with fog and atmospheric lighting
 * Attach this script to an empty entity called "SceneManager"
 */

var SceneSetup = pc.createScript('sceneSetup');

// Initialize function - runs once at startup
SceneSetup.prototype.initialize = function() {
    // Set up the scene background and fog
    this.setupEnvironment();
    
    // Create ground plane
    this.createGround();
    
    // Create environment objects (buildings/barriers)
    this.createEnvironmentObjects();
    
    // Create light sources
    this.createLights();
};

SceneSetup.prototype.setupEnvironment = function() {
    var scene = this.app.scene;
    
    // Dark night sky color (deep blue/purple)
    scene.background = new pc.Color(0.05, 0.02, 0.1);
    
    // Enable fog for atmosphere
    scene.fog = pc.FOG_LINEAR;
    scene.fogStart = 5;
    scene.fogEnd = 80;
    scene.fogColor = new pc.Color(0.08, 0.05, 0.15);
    
    // Ambient light (dim purple/blue)
    scene.ambientLight = new pc.Color(0.15, 0.1, 0.25);
};

SceneSetup.prototype.createGround = function() {
    // Create ground entity
    var ground = new pc.Entity('Ground');
    ground.addComponent('render', {
        type: 'plane',
        castShadows: false,
        receiveShadows: true
    });
    
    // Scale to make it larger
    ground.setLocalScale(100, 1, 100);
    ground.setLocalPosition(0, 0, 0);
    
    // Create a dark asphalt-like material
    var groundMaterial = new pc.StandardMaterial();
    groundMaterial.diffuse = new pc.Color(0.1, 0.1, 0.12);
    groundMaterial.metalness = 0.3;
    groundMaterial.roughness = 0.8;
    groundMaterial.update();
    
    ground.render.material = groundMaterial;
    
    this.entity.addChild(ground);
};

SceneSetup.prototype.createEnvironmentObjects = function() {
    // Color palette: neon blue, purple, orange
    var colors = [
        new pc.Color(0.2, 0.3, 0.8),   // Neon blue
        new pc.Color(0.5, 0.1, 0.6),   // Purple
        new pc.Color(0.9, 0.4, 0.1),   // Orange
        new pc.Color(0.1, 0.5, 0.7),   // Cyan-blue
        new pc.Color(0.7, 0.2, 0.5)    // Pink-purple
    ];
    
    // Create buildings/structures along the "street"
    var structures = [
        // Left side buildings
        { pos: [-15, 10, -30], scale: [8, 20, 15], color: colors[0] },
        { pos: [-15, 8, -10], scale: [6, 16, 12], color: colors[1] },
        { pos: [-15, 12, 20], scale: [10, 24, 18], color: colors[3] },
        
        // Right side buildings
        { pos: [15, 9, -25], scale: [7, 18, 14], color: colors[2] },
        { pos: [15, 11, 0], scale: [8, 22, 16], color: colors[4] },
        { pos: [15, 7, 25], scale: [6, 14, 10], color: colors[0] },
        
        // Distant structures
        { pos: [0, 15, -60], scale: [20, 30, 10], color: colors[1] },
        
        // Street barriers/posts
        { pos: [-8, 2, -20], scale: [1, 4, 1], color: colors[2] },
        { pos: [8, 2, -20], scale: [1, 4, 1], color: colors[2] },
        { pos: [-8, 2, 10], scale: [1, 4, 1], color: colors[3] },
        { pos: [8, 2, 10], scale: [1, 4, 1], color: colors[3] }
    ];
    
    for (var i = 0; i < structures.length; i++) {
        var data = structures[i];
        var box = new pc.Entity('Structure_' + i);
        
        box.addComponent('render', {
            type: 'box',
            castShadows: true,
            receiveShadows: true
        });
        
        box.setLocalPosition(data.pos[0], data.pos[1], data.pos[2]);
        box.setLocalScale(data.scale[0], data.scale[1], data.scale[2]);
        
        // Create emissive material for neon look
        var material = new pc.StandardMaterial();
        material.diffuse = data.color.clone().mulScalar(0.3);
        material.emissive = data.color.clone().mulScalar(0.5);
        material.emissiveIntensity = 0.8;
        material.metalness = 0.5;
        material.roughness = 0.4;
        material.update();
        
        box.render.material = material;
        
        this.entity.addChild(box);
    }
};

SceneSetup.prototype.createLights = function() {
    // Main directional light (moonlight)
    var moonLight = new pc.Entity('MoonLight');
    moonLight.addComponent('light', {
        type: 'directional',
        color: new pc.Color(0.6, 0.7, 1.0),
        intensity: 0.4,
        castShadows: true,
        shadowBias: 0.05,
        normalOffsetBias: 0.1,
        shadowResolution: 1024
    });
    moonLight.setLocalEulerAngles(45, -30, 0);
    this.entity.addChild(moonLight);
    
    // Street lights (point lights with orange glow)
    var streetLightPositions = [
        [-8, 6, -20],
        [8, 6, -20],
        [-8, 6, 10],
        [8, 6, 10]
    ];
    
    for (var i = 0; i < streetLightPositions.length; i++) {
        var pos = streetLightPositions[i];
        var streetLight = new pc.Entity('StreetLight_' + i);
        
        streetLight.addComponent('light', {
            type: 'point',
            color: new pc.Color(1.0, 0.7, 0.3),
            intensity: 0.8,
            range: 25,
            castShadows: true,
            shadowResolution: 512
        });
        
        streetLight.setLocalPosition(pos[0], pos[1], pos[2]);
        this.entity.addChild(streetLight);
        
        // Add a small sphere to represent the light source visually
        var bulb = new pc.Entity('Bulb_' + i);
        bulb.addComponent('render', {
            type: 'sphere'
        });
        bulb.setLocalScale(0.5, 0.5, 0.5);
        bulb.setLocalPosition(0, 0, 0);
        
        var bulbMat = new pc.StandardMaterial();
        bulbMat.diffuse = new pc.Color(1.0, 0.8, 0.4);
        bulbMat.emissive = new pc.Color(1.0, 0.7, 0.3);
        bulbMat.emissiveIntensity = 2.0;
        bulbMat.update();
        
        bulb.render.material = bulbMat;
        streetLight.addChild(bulb);
    }
    
    // Accent lights (purple/blue neon signs)
    var accentLights = [
        { pos: [-14, 12, -30], color: new pc.Color(0.3, 0.2, 1.0), range: 15 },
        { pos: [14, 10, 0], color: new pc.Color(0.8, 0.2, 0.6), range: 12 }
    ];
    
    for (var j = 0; j < accentLights.length; j++) {
        var accent = accentLights[j];
        var accentLight = new pc.Entity('AccentLight_' + j);
        
        accentLight.addComponent('light', {
            type: 'point',
            color: accent.color,
            intensity: 1.2,
            range: accent.range,
            castShadows: false
        });
        
        accentLight.setLocalPosition(accent.pos[0], accent.pos[1], accent.pos[2]);
        this.entity.addChild(accentLight);
    }
};
