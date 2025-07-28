// Collision System - Handles car-collectible and boundary collisions
export class CollisionSystem {
    constructor(car, collectibleManager) {
        this.car = car;
        this.collectibleManager = collectibleManager;
        
        // Collision settings
        this.collectibleRadius = 3;
        this.boundaryRadius = 85;
        this.bounceMultiplier = 1.5;
        this.speedReduction = 0.3;
    }
    
    checkCollisions() {
        const result = {
            collected: false,
            itemData: null,
            boundaryhit: false
        };
        
        // Check collectible collisions
        const collectibleResult = this.checkCollectibleCollisions();
        if (collectibleResult.collected) {
            result.collected = true;
            result.itemData = collectibleResult.itemData;
        }
        
        // Check boundary collisions
        const boundaryResult = this.checkBoundaryCollision();
        if (boundaryResult.hit) {
            result.boundaryhit = true;
        }
        
        return result;
    }
    
    checkCollectibleCollisions() {
        const carPosition = this.car.mesh.position;
        const collectibles = this.collectibleManager.getCollectibles();
        
        for (let i = 0; i < collectibles.length; i++) {
            const collectible = collectibles[i];
            
            if (!collectible.userData.collected) {
                const distance = carPosition.distanceTo(collectible.position);
                
                if (distance < this.collectibleRadius) {
                    // Mark as collected
                    this.collectibleManager.collectItem(i);
                    
                    return {
                        collected: true,
                        itemData: collectible.userData
                    };
                }
            }
        }
        
        return { collected: false };
    }
    
    checkBoundaryCollision() {
        const carPosition = this.car.mesh.position;
        const carDistance = Math.sqrt(carPosition.x ** 2 + carPosition.z ** 2);
        
        if (carDistance > this.boundaryRadius) {
            // Calculate collision normal (direction from center to car)
            const normal = new THREE.Vector3(carPosition.x, 0, carPosition.z).normalize();
            
            // Get car physics for velocity reflection
            const carPhysics = this.car.physics;
            if (carPhysics) {
                // Reflect velocity off the boundary
                const velocityDotNormal = carPhysics.velocity.dot(normal);
                if (velocityDotNormal > 0) {
                    // Remove the component of velocity going into the wall
                    const reflection = normal.multiplyScalar(velocityDotNormal * this.bounceMultiplier);
                    carPhysics.velocity.sub(reflection);
                }
                
                // Reduce speed on collision
                carPhysics.velocity.multiplyScalar(this.speedReduction);
            }
            
            // Push car back to safe position
            const safePosition = normal.multiplyScalar(this.boundaryRadius * 0.98);
            carPosition.x = safePosition.x;
            carPosition.z = safePosition.z;
            
            // Keep car on ground
            carPosition.y = 0;
            
            return { hit: true };
        }
        
        return { hit: false };
    }
    
    // Check collision between two objects (utility method)
    checkSphereCollision(pos1, radius1, pos2, radius2) {
        const distance = pos1.distanceTo(pos2);
        return distance < (radius1 + radius2);
    }
    
    // Get closest collectible for AI or guidance systems
    getClosestCollectible() {
        const carPosition = this.car.mesh.position;
        const collectibles = this.collectibleManager.getCollectibles();
        
        let closest = null;
        let minDistance = Infinity;
        
        collectibles.forEach(collectible => {
            if (!collectible.userData.collected) {
                const distance = carPosition.distanceTo(collectible.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    closest = collectible;
                }
            }
        });
        
        return {
            collectible: closest,
            distance: minDistance
        };
    }
    
    // Update collision settings
    updateSettings(settings) {
        if (settings.collectibleRadius !== undefined) {
            this.collectibleRadius = settings.collectibleRadius;
        }
        if (settings.boundaryRadius !== undefined) {
            this.boundaryRadius = settings.boundaryRadius;
        }
        if (settings.bounceMultiplier !== undefined) {
            this.bounceMultiplier = settings.bounceMultiplier;
        }
        if (settings.speedReduction !== undefined) {
            this.speedReduction = settings.speedReduction;
        }
    }
}
