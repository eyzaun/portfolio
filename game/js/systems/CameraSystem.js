// Camera System - Advanced camera follow with speed-based positioning
export class CameraSystem {
    constructor(camera, car) {
        this.camera = camera;
        this.car = car;
        
        // Camera settings
        this.baseDistance = 12;
        this.baseHeight = 6;
        this.speedMultiplier = 8;
        this.heightMultiplier = 4;
        this.lerpBase = 0.08;
        this.lerpSpeedMultiplier = 0.02;
        this.lookAheadMultiplier = 3;
        this.lookAheadHeight = 2;
    }
    
    update(physicsState) {
        const carPosition = this.car.mesh.position.clone();
        const carRotation = this.car.mesh.rotation.y;
        const speed = physicsState.speed;
        const isDrifting = physicsState.isDrifting;
        const driftIntensity = physicsState.driftIntensity;
        const velocity = physicsState.velocity;
        
        // Calculate camera position based on car speed
        const speedFactor = Math.min(speed * 2, 1);
        const distance = this.baseDistance + speedFactor * this.speedMultiplier;
        const height = this.baseHeight + speedFactor * this.heightMultiplier;
        
        // Base camera offset behind the car
        const cameraOffset = new THREE.Vector3(0, height, distance);
        
        // Apply car rotation to offset
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation);
        
        // Add camera shake during drift
        if (isDrifting) {
            this.addDriftShake(cameraOffset, driftIntensity);
        }
        
        const idealPosition = carPosition.clone().add(cameraOffset);
        
        // Smooth camera movement with variable lerp based on speed
        const lerpFactor = this.lerpBase + speedFactor * this.lerpSpeedMultiplier;
        this.camera.position.lerp(idealPosition, lerpFactor);
        
        // Look ahead based on velocity
        const lookTarget = this.calculateLookTarget(carPosition, velocity);
        this.camera.lookAt(lookTarget);
    }
    
    addDriftShake(cameraOffset, driftIntensity) {
        const shakeIntensity = driftIntensity * 0.5;
        cameraOffset.x += (Math.random() - 0.5) * shakeIntensity;
        cameraOffset.y += (Math.random() - 0.5) * shakeIntensity * 0.5;
        cameraOffset.z += (Math.random() - 0.5) * shakeIntensity * 0.3;
    }
    
    calculateLookTarget(carPosition, velocity) {
        const lookAhead = velocity.clone().multiplyScalar(this.lookAheadMultiplier);
        const lookTarget = carPosition.clone().add(lookAhead);
        lookTarget.y += this.lookAheadHeight;
        return lookTarget;
    }
    
    // Camera preset methods for different situations
    setCameraMode(mode) {
        switch(mode) {
            case 'close':
                this.baseDistance = 8;
                this.baseHeight = 4;
                break;
            case 'far':
                this.baseDistance = 16;
                this.baseHeight = 8;
                break;
            case 'cinematic':
                this.baseDistance = 20;
                this.baseHeight = 10;
                this.lerpBase = 0.05;
                break;
            default: // normal
                this.baseDistance = 12;
                this.baseHeight = 6;
                this.lerpBase = 0.08;
        }
    }
    
    // Get camera info for debugging
    getCameraInfo() {
        return {
            position: this.camera.position.clone(),
            target: this.camera.getWorldDirection(new THREE.Vector3()),
            distance: this.baseDistance,
            height: this.baseHeight
        };
    }
}
