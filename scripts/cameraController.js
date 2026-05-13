/**
 * Free Camera Controller Script
 * Implements WASD movement + mouse look with cinematic speed
 * Attach this script to the main camera entity
 */

var CameraController = pc.createScript('cameraController');

// Attributes for customization
CameraController.attributes.add('moveSpeed', {
    type: 'number',
    default: 8,
    title: 'Move Speed',
    description: 'Movement speed in units per second'
});

CameraController.attributes.add('lookSensitivity', {
    type: 'number',
    default: 0.15,
    title: 'Look Sensitivity',
    description: 'Mouse look sensitivity'
});

CameraController.attributes.add('pitchLimit', {
    type: 'number',
    default: 80,
    title: 'Pitch Limit',
    description: 'Maximum up/down angle in degrees'
});

CameraController.attributes.add('initialPosition', {
    type: 'vec3',
    default: [0, 3, 15],
    title: 'Initial Position',
    description: 'Starting position of the camera'
});

CameraController.prototype.initialize = function() {
    // Set initial position
    this.entity.setLocalPosition(
        this.initialPosition.x,
        this.initialPosition.y,
        this.initialPosition.z
    );
    
    // Store current rotation (euler angles)
    this.currentEuler = { x: 0, y: 0 };
    
    // Track key states
    this.keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
    };
    
    // Mouse state
    this.mouseDelta = { x: 0, y: 0 };
    this.isMouseLocked = false;
    
    // Bind event listeners
    this.setupInputHandlers();
    
    // Lock pointer on click
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    // Initial camera orientation - looking slightly downward
    this.currentEuler.y = -90; // Start facing down the "street"
    this.updateRotation();
};

CameraController.prototype.setupInputHandlers = function() {
    // Keyboard events
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
    
    // Mouse move events
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    
    // Pointer lock events
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this), false);
};

CameraController.prototype.onMouseDown = function(event) {
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        this.app.mouse.enablePointerLock();
    }
};

CameraController.prototype.onPointerLockChange = function() {
    this.isMouseLocked = (document.pointerLockElement === this.app.canvas);
};

CameraController.prototype.onKeyDown = function(event) {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            this.keys.forward = true;
            break;
        case 's':
        case 'S':
        case 'ArrowDown':
            this.keys.backward = true;
            break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
            this.keys.left = true;
            break;
        case 'd':
        case 'D':
        case 'ArrowRight':
            this.keys.right = true;
            break;
        case ' ':
        case 'q':
        case 'Q':
            this.keys.up = true;
            break;
        case 'e':
        case 'E':
        case 'Control':
            this.keys.down = true;
            break;
    }
};

CameraController.prototype.onKeyUp = function(event) {
    switch (event.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            this.keys.forward = false;
            break;
        case 's':
        case 'S':
        case 'ArrowDown':
            this.keys.backward = false;
            break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
            this.keys.left = false;
            break;
        case 'd':
        case 'D':
        case 'ArrowRight':
            this.keys.right = false;
            break;
        case ' ':
        case 'q':
        case 'Q':
            this.keys.up = false;
            break;
        case 'e':
        case 'E':
        case 'Control':
            this.keys.down = false;
            break;
    }
};

CameraController.prototype.onMouseMove = function(event) {
    if (this.isMouseLocked) {
        this.mouseDelta.x += event.dx;
        this.mouseDelta.y += event.dy;
    }
};

CameraController.prototype.updateRotation = function() {
    // Apply rotation to camera entity
    // Order: Y rotation first (yaw), then X rotation (pitch)
    this.entity.setLocalEulerAngles(
        this.currentEuler.x,
        this.currentEuler.y,
        0
    );
};

CameraController.prototype.update = function(dt) {
    // Handle mouse look
    if (this.mouseDelta.x !== 0 || this.mouseDelta.y !== 0) {
        // Yaw (left/right rotation)
        this.currentEuler.y -= this.mouseDelta.x * this.lookSensitivity;
        
        // Pitch (up/down rotation)
        this.currentEuler.x -= this.mouseDelta.y * this.lookSensitivity;
        
        // Clamp pitch to prevent flipping
        this.currentEuler.x = pc.math.clamp(
            this.currentEuler.x,
            -this.pitchLimit,
            this.pitchLimit
        );
        
        // Normalize yaw to 0-360 range
        this.currentEuler.y = this.currentEuler.y % 360;
        
        this.updateRotation();
        
        // Reset mouse delta
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
    }
    
    // Handle keyboard movement
    var moveX = 0;
    var moveY = 0;
    var moveZ = 0;
    
    // Get camera's forward and right vectors (ignoring Y for flat movement)
    var forward = this.entity.forward.clone();
    forward.y = 0;
    forward.normalize();
    
    var right = this.entity.right.clone();
    right.y = 0;
    right.normalize();
    
    // Calculate movement direction
    if (this.keys.forward) {
        moveZ -= 1;
    }
    if (this.keys.backward) {
        moveZ += 1;
    }
    if (this.keys.left) {
        moveX -= 1;
    }
    if (this.keys.right) {
        moveX += 1;
    }
    if (this.keys.up) {
        moveY += 1;
    }
    if (this.keys.down) {
        moveY -= 1;
    }
    
    // Apply movement relative to camera direction
    var position = this.entity.getPosition();
    
    if (moveX !== 0 || moveZ !== 0) {
        // Horizontal movement (relative to camera view)
        var horizontalMove = right.clone().mulScalar(moveX).add(forward.clone().mulScalar(moveZ));
        horizontalMove.normalize();
        
        position.x += horizontalMove.x * this.moveSpeed * dt;
        position.z += horizontalMove.z * this.moveSpeed * dt;
    }
    
    if (moveY !== 0) {
        // Vertical movement
        position.y += moveY * this.moveSpeed * dt;
    }
    
    this.entity.setPosition(position);
};
