// Car Physics System - Realistic car physics and drift mechanics
export class CarPhysics {
    constructor(car, scene) {
        this.car = car;
        this.scene = scene;
        
        // Physics state
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.angularVelocity = 0;
        this.steerAngle = 0;
        this.speed = 0;
        
        // Physics constants
        this.maxSteerAngle = 0.6;
        this.wheelBase = 4; // Distance between front and rear axles
        this.maxSpeed = 1.2;
        this.acceleration = 0.03;
        this.brakeForce = 0.05;
        this.friction = 0.92;
        this.lateralFriction = 0.85;
        
        // Drift system
        this.driftThreshold = 0.3;
        this.driftMultiplier = 0.7;
        this.isDrifting = false;
        this.driftAngle = 0;
        this.driftIntensity = 0;
        this.driftScore = 0;
        this.driftParticles = [];
    }
    
    update(inputState) {
        const deltaTime = 1/60; // Assuming 60fps
        
        // Get input values
        const throttle = inputState.throttle;
        const brakeInput = inputState.brake;
        const steerInput = inputState.steering;
        const handbrake = inputState.handbrake;
        
        // Update current speed
        this.speed = this.velocity.length();
        
        // Steering - only effective when moving
        const speedFactor = Math.min(this.speed * 3, 1);
        this.steerAngle = steerInput * this.maxSteerAngle * speedFactor;
        
        // Update front wheel steering visuals
        this.car.updateSteeringWheels(this.steerAngle);
        
        // Calculate forces
        this.updateEngineForce(throttle);
        this.updateBrakeForce(brakeInput, handbrake);
        this.updateLateralFriction(handbrake);
        this.updateAngularVelocity();
        
        // Update car position and rotation
        this.car.mesh.rotation.y += this.angularVelocity;
        this.car.mesh.position.add(this.velocity);
        
        // Animate wheels
        this.car.animateWheels(this.speed, this.velocity);
        
        // Update drift effects
        this.updateDriftEffects();
        
        // Apply general friction
        this.velocity.multiplyScalar(this.friction);
    }
    
    updateEngineForce(throttle) {
        const engineForce = throttle * this.acceleration;
        
        // Calculate car's forward vector
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.car.mesh.quaternion);
        
        // Apply engine force in forward direction
        const engineVector = forward.clone().multiplyScalar(engineForce);
        this.velocity.add(engineVector);
    }
    
    updateBrakeForce(brakeInput, handbrake) {
        const totalBrakeForce = brakeInput * this.brakeForce + 
                               (handbrake ? this.brakeForce * 1.5 : 0);
        
        // Apply braking force opposite to velocity direction
        if (this.speed > 0.01) {
            const brakeVector = this.velocity.clone().normalize().multiplyScalar(-totalBrakeForce);
            this.velocity.add(brakeVector);
        }
    }
    
    updateLateralFriction(handbrake) {
        // Calculate car's forward and right vectors
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.car.mesh.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.car.mesh.quaternion);
        
        // Calculate drift
        const velocityDirection = this.velocity.clone().normalize();
        const forwardComponent = velocityDirection.dot(forward);
        const rightComponent = velocityDirection.dot(right);
        
        // Calculate drift angle and intensity
        this.driftAngle = Math.atan2(rightComponent, Math.abs(forwardComponent));
        const lateralSpeed = Math.abs(rightComponent * this.speed);
        
        this.isDrifting = lateralSpeed > this.driftThreshold && handbrake;
        this.driftIntensity = Math.min(lateralSpeed / 0.8, 1);
        
        if (this.isDrifting) {
            this.driftScore += this.driftIntensity * 2;
        }
        
        // Apply lateral friction
        let lateralFrictionCoeff = this.lateralFriction;
        if (this.isDrifting) {
            lateralFrictionCoeff *= this.driftMultiplier;
        }
        
        // Separate velocity into forward and lateral components
        const forwardVelocity = forward.clone().multiplyScalar(forward.dot(this.velocity));
        const lateralVelocity = right.clone().multiplyScalar(right.dot(this.velocity));
        
        // Apply lateral friction
        lateralVelocity.multiplyScalar(lateralFrictionCoeff);
        
        // Recombine velocities
        this.velocity = forwardVelocity.add(lateralVelocity);
    }
    
    updateAngularVelocity() {
        // Ackermann steering calculation
        if (Math.abs(this.steerAngle) > 0.01 && this.speed > 0.01) {
            const turningRadius = this.wheelBase / Math.tan(Math.abs(this.steerAngle));
            this.angularVelocity = (this.speed / turningRadius) * Math.sign(this.steerAngle);
            
            // Limit angular velocity
            this.angularVelocity = Math.max(-0.1, Math.min(0.1, this.angularVelocity));
        } else {
            this.angularVelocity *= 0.9; // Damping
        }
    }
    
    updateDriftEffects() {
        if (this.isDrifting && this.driftIntensity > 0.3) {
            // Create drift particle effects
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
    
    createDriftParticle() {
        const particleGeometry = new THREE.SphereGeometry(0.1);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Position behind the car
        const carBack = new THREE.Vector3(0, 0, -2).applyQuaternion(this.car.mesh.quaternion);
        particle.position.copy(this.car.mesh.position).add(carBack);
        particle.position.y = 0.1;
        
        // Add some randomness
        particle.position.x += (Math.random() - 0.5) * 2;
        particle.position.z += (Math.random() - 0.5) * 2;
        
        this.scene.add(particle);
        this.driftParticles.push(particle);
    }
    
    // Getter methods for external systems
    getSpeed() {
        return this.speed;
    }
    
    getDriftScore() {
        return this.driftScore;
    }
    
    getPhysicsState() {
        return {
            velocity: this.velocity.clone(),
            speed: this.speed,
            isDrifting: this.isDrifting,
            driftIntensity: this.driftIntensity,
            driftAngle: this.driftAngle
        };
    }
    
    getPosition() {
        return this.car.mesh.position;
    }
    
    getRotation() {
        return this.car.mesh.rotation.y;
    }
}
