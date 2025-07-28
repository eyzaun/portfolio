// Car Physics System - Realistic car physics and drift mechanics
export class CarPhysics {
    constructor(car, scene) {
        this.car = car;
        this.scene = scene;
        
        // Physics state
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.angularVelocity = 0;
        this.speed = 0;
        
        // Car orientation and position
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = 0; // Y-axis rotation in radians
        
        // Physics constants
        this.maxSpeed = 2.0;
        this.acceleration = 0.08;
        this.brakeForce = 0.12;
        this.friction = 0.88;
        this.steeringSensitivity = 0.03;
        this.maxSteerAngle = 0.8;
        
        // Drift system
        this.driftThreshold = 0.4;
        this.isDrifting = false;
        this.driftScore = 0;
        this.driftParticles = [];
    }
    
    update(inputState) {
        // Get clean input values
        const throttle = inputState.throttle || 0;
        const brake = inputState.brake || 0;
        const steering = inputState.steering || 0;
        const handbrake = inputState.handbrake || false;
        
        // Update position from car mesh
        this.position.copy(this.car.mesh.position);
        this.rotation = this.car.mesh.rotation.y;
        
        // Calculate movement
        this.updateMovement(throttle, brake, steering, handbrake);
        
        // Update car mesh position and rotation
        this.car.mesh.position.copy(this.position);
        this.car.mesh.rotation.y = this.rotation;
        
        // Update visuals
        this.updateWheelSteering(steering);
        this.car.animateWheels(this.speed, this.velocity);
        this.updateDriftEffects();
    }
    
    updateMovement(throttle, brake, steering, handbrake) {
        // Calculate forward and right vectors based on car rotation
        const forward = new THREE.Vector3(
            -Math.sin(this.rotation), 
            0, 
            -Math.cos(this.rotation)
        );
        const right = new THREE.Vector3(
            Math.cos(this.rotation), 
            0, 
            -Math.sin(this.rotation)
        );
        
        // Handle forward movement
        if (throttle > 0) {
            const forwardForce = forward.clone().multiplyScalar(throttle * this.acceleration);
            this.velocity.add(forwardForce);
        }
        
        // Handle reverse movement
        if (brake > 0 && this.speed < 0.1) {
            // When stopped, brake acts as reverse
            const reverseForce = forward.clone().multiplyScalar(-brake * this.acceleration * 0.6);
            this.velocity.add(reverseForce);
        } else if (brake > 0 && this.speed > 0.1) {
            // When moving, brake slows down
            const brakeForce = this.velocity.clone().normalize().multiplyScalar(-brake * this.brakeForce);
            this.velocity.add(brakeForce);
        }
        
        // Handle handbrake (for drifting)
        if (handbrake && this.speed > 0.2) {
            // Light braking + reduced lateral grip for drift
            const lightBrake = this.velocity.clone().normalize().multiplyScalar(-this.brakeForce * 0.3);
            this.velocity.add(lightBrake);
            this.isDrifting = true;
        } else {
            this.isDrifting = false;
        }
        
        // Calculate current speed
        this.speed = this.velocity.length();
        
        // Limit maximum speed
        if (this.speed > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
            this.speed = this.maxSpeed;
        }
        
        // Handle steering (only when moving)
        if (Math.abs(steering) > 0.1 && this.speed > 0.1) {
            const steerAmount = steering * this.steeringSensitivity * this.speed;
            this.rotation += steerAmount;
        }
        
        // Apply friction
        this.velocity.multiplyScalar(this.friction);
        
        // Update position
        this.position.add(this.velocity);
        
        // Reset very small velocities to prevent jitter
        if (this.speed < 0.01) {
            this.velocity.set(0, 0, 0);
            this.speed = 0;
        }
        
        // Update drift score
        if (this.isDrifting) {
            this.driftScore += this.speed * 2;
        }
    }
    
    updateWheelSteering(steering) {
        // Update front wheel steering visuals
        if (this.car.updateSteeringWheels) {
            const steerAngle = steering * this.maxSteerAngle;
            this.car.updateSteeringWheels(steerAngle);
        }
    }
    
    updateDriftEffects() {
        if (this.isDrifting && this.speed > 0.3) {
            // Create drift particle effects
            if (Math.random() < 0.4) {
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
    
    createDriftParticle() {
        const particleGeometry = new THREE.SphereGeometry(0.15);
        const particleMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position behind the car
        const backward = new THREE.Vector3(
            Math.sin(this.rotation), 
            0, 
            Math.cos(this.rotation)
        ).multiplyScalar(2.5);
        
        particle.position.copy(this.position).add(backward);
        particle.position.y = 0.1;
        
        // Add randomness
        particle.position.x += (Math.random() - 0.5) * 1.5;
        particle.position.z += (Math.random() - 0.5) * 1.5;
        
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
            velocity: this.velocity.clone(),
            speed: this.speed,
            isDrifting: this.isDrifting,
            position: this.position.clone(),
            rotation: this.rotation
        };
    }
    
    getPosition() {
        return this.position;
    }
    
    getRotation() {
        return this.rotation;
    }
    
    // Reset car to starting position
    reset() {
        this.velocity.set(0, 0, 0);
        this.position.set(0, 0, 0);
        this.rotation = 0;
        this.speed = 0;
        this.driftScore = 0;
        this.isDrifting = false;
        
        // Clear particles
        this.driftParticles.forEach(particle => {
            this.scene.remove(particle);
        });
        this.driftParticles = [];
    }
}
