// Car Physics System - Simple and working car physics
export class CarPhysics {
    constructor(car, scene) {
        this.car = car;
        this.scene = scene;
        
        // Car state
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = 0; // Y-axis rotation in radians
        this.velocity = { x: 0, z: 0 };
        this.speed = 0;
        
        // Physics settings
        this.maxSpeed = 1.5;
        this.acceleration = 0.06;
        this.friction = 0.9;
        this.turnSpeed = 0.025;
        this.brakeForce = 0.08;
        
        // Drift settings
        this.isDrifting = false;
        this.driftScore = 0;
        this.driftParticles = [];
        
        // Initialize car position
        this.updateCarTransform();
    }
    
    update(inputState) {
        // Get input
        const throttle = inputState.throttle || 0;
        const brake = inputState.brake || 0;
        const steering = inputState.steering || 0;
        const handbrake = inputState.handbrake || false;
        
        // Calculate movement
        this.handleAcceleration(throttle, brake, handbrake);
        this.handleSteering(steering);
        this.updatePosition();
        this.updateCarTransform();
        this.updateDrift(handbrake);
        this.updateWheels();
        
        // Update speed for UI
        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    }
    
    handleAcceleration(throttle, brake, handbrake) {
        // Forward/backward movement
        if (throttle > 0) {
            // Accelerate forward
            const forwardX = -Math.sin(this.rotation) * throttle * this.acceleration;
            const forwardZ = -Math.cos(this.rotation) * throttle * this.acceleration;
            this.velocity.x += forwardX;
            this.velocity.z += forwardZ;
        }
        
        if (brake > 0 && this.speed < 0.1) {
            // Reverse when stopped
            const reverseX = Math.sin(this.rotation) * brake * this.acceleration * 0.6;
            const reverseZ = Math.cos(this.rotation) * brake * this.acceleration * 0.6;
            this.velocity.x += reverseX;
            this.velocity.z += reverseZ;
        } else if (brake > 0) {
            // Normal braking
            this.velocity.x *= (1 - brake * this.brakeForce);
            this.velocity.z *= (1 - brake * this.brakeForce);
        }
        
        // Handbrake (light braking for drift)
        if (handbrake) {
            this.velocity.x *= 0.97;
            this.velocity.z *= 0.97;
            this.isDrifting = this.speed > 0.3;
        } else {
            this.isDrifting = false;
        }
        
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
        
        // Limit max speed
        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.velocity.x *= scale;
            this.velocity.z *= scale;
        }
        
        // Stop micro movements
        if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
        if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;
    }
    
    handleSteering(steering) {
        // Only steer when moving
        if (this.speed > 0.1 && Math.abs(steering) > 0.1) {
            this.rotation += steering * this.turnSpeed * this.speed;
        }
        
        // Keep rotation in bounds
        while (this.rotation > Math.PI) this.rotation -= Math.PI * 2;
        while (this.rotation < -Math.PI) this.rotation += Math.PI * 2;
    }
    
    updatePosition() {
        // Update position based on velocity
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
        
        // Boundary checking (circular track)
        const distanceFromCenter = Math.sqrt(this.position.x * this.position.x + this.position.z * this.position.z);
        const maxDistance = 80;
        
        if (distanceFromCenter > maxDistance) {
            // Push back to safe area
            const angle = Math.atan2(this.position.z, this.position.x);
            this.position.x = Math.cos(angle) * maxDistance;
            this.position.z = Math.sin(angle) * maxDistance;
            
            // Reduce velocity on collision
            this.velocity.x *= 0.3;
            this.velocity.z *= 0.3;
        }
    }
    
    updateCarTransform() {
        // Apply position and rotation to car mesh
        this.car.mesh.position.set(this.position.x, 0, this.position.z);
        this.car.mesh.rotation.y = this.rotation;
    }
    
    updateDrift(handbrake) {
        if (this.isDrifting) {
            this.driftScore += this.speed * 2;
            
            // Create drift particles
            if (Math.random() < 0.3) {
                this.createDriftParticle();
            }
        }
        
        // Update existing particles
        this.driftParticles.forEach((particle, index) => {
            particle.scale.multiplyScalar(0.95);
            particle.material.opacity *= 0.95;
            
            if (particle.scale.x < 0.1) {
                this.scene.remove(particle);
                this.driftParticles.splice(index, 1);
            }
        });
    }
    
    updateWheels() {
        // Update steering wheels
        if (this.car.updateSteeringWheels) {
            // Calculate steering angle for visual
            const steerAngle = 0; // We'll implement this when we have proper input
            this.car.updateSteeringWheels(steerAngle);
        }
        
        // Animate wheel rotation
        if (this.car.animateWheels) {
            const velocity = { x: this.velocity.x, y: 0, z: this.velocity.z };
            this.car.animateWheels(this.speed, velocity);
        }
    }
    
    createDriftParticle() {
        const particleGeometry = new THREE.SphereGeometry(0.15);
        const particleMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position behind the car
        const behindX = this.position.x + Math.sin(this.rotation) * 2;
        const behindZ = this.position.z + Math.cos(this.rotation) * 2;
        
        particle.position.set(
            behindX + (Math.random() - 0.5) * 1.5,
            0.1,
            behindZ + (Math.random() - 0.5) * 1.5
        );
        
        this.scene.add(particle);
        this.driftParticles.push(particle);
    }
    
    // Getter methods for external systems
    getSpeed() {
        return this.speed;
    }
    
    getDriftScore() {
        return Math.floor(this.driftScore);
    }
    
    getIsDrifting() {
        return this.isDrifting;
    }
    
    getPhysicsState() {
        return {
            position: { ...this.position },
            rotation: this.rotation,
            velocity: { ...this.velocity },
            speed: this.speed,
            isDrifting: this.isDrifting
        };
    }
    
    getPosition() {
        return this.position;
    }
    
    getRotation() {
        return this.rotation;
    }
    
    // Reset method
    reset() {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = 0;
        this.velocity = { x: 0, z: 0 };
        this.speed = 0;
        this.isDrifting = false;
        this.driftScore = 0;
        
        // Clear particles
        this.driftParticles.forEach(particle => {
            this.scene.remove(particle);
        });
        this.driftParticles = [];
        
        this.updateCarTransform();
    }
}
