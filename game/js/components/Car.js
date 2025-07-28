// Car Component - 3D car model and visual effects
export class Car {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.wheels = [];
        this.frontWheels = [];
        this.physics = null; // Will be set by CarPhysics
        
        this.createCar();
    }
    
    createCar() {
        console.log("Creating player car...");
        
        this.mesh = new THREE.Group();
        
        // Car body - realistic proportions
        this.createBody();
        this.createRoof();
        this.createBumper();
        this.createWheels();
        
        // Initial position and physics state
        this.mesh.position.set(0, 0, 0);
        this.mesh.rotation.y = 0;
        
        this.scene.add(this.mesh);
    }
    
    createBody() {
        const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xe17055 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        body.castShadow = true;
        this.mesh.add(body);
    }
    
    createRoof() {
        const roofGeometry = new THREE.BoxGeometry(1.6, 0.6, 2.2);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.1;
        roof.position.z = -0.3;
        roof.castShadow = true;
        this.mesh.add(roof);
    }
    
    createBumper() {
        const bumperGeometry = new THREE.BoxGeometry(1.8, 0.3, 0.5);
        const bumperMaterial = new THREE.MeshLambertMaterial({ color: 0x636e72 });
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.y = 0.15;
        frontBumper.position.z = 2.5;
        this.mesh.add(frontBumper);
    }
    
    createWheels() {
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const rimMaterial = new THREE.MeshLambertMaterial({ color: 0x74b9ff });
        
        const wheelPositions = [
            { x: -1.2, z: 1.8 },  // Front left
            { x: 1.2, z: 1.8 },   // Front right
            { x: -1.2, z: -1.8 }, // Rear left
            { x: 1.2, z: -1.8 }   // Rear right
        ];
        
        wheelPositions.forEach((pos, index) => {
            const wheelGroup = this.createWheelGroup(wheelGeometry, wheelMaterial, rimMaterial);
            wheelGroup.position.set(pos.x, 0.4, pos.z);
            wheelGroup.castShadow = true;
            
            this.mesh.add(wheelGroup);
            this.wheels.push(wheelGroup);
            
            // Store front wheels for steering
            if (index < 2) {
                this.frontWheels.push(wheelGroup);
            }
        });
    }
    
    createWheelGroup(wheelGeometry, wheelMaterial, rimMaterial) {
        const wheelGroup = new THREE.Group();
        
        // Main wheel
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheelGroup.add(wheel);
        
        // Rim details
        const rim = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 0.32),
            rimMaterial
        );
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);
        
        return wheelGroup;
    }
    
    updateSteeringWheels(steerAngle) {
        this.frontWheels.forEach(wheel => {
            wheel.rotation.y = steerAngle;
        });
    }
    
    animateWheels(speed, velocity) {
        const wheelRotationSpeed = speed * 8;
        const direction = velocity.z > 0 ? 1 : -1;
        
        this.wheels.forEach(wheel => {
            // Rotate the actual wheel mesh (first child)
            if (wheel.children[0]) {
                wheel.children[0].rotation.x += wheelRotationSpeed * direction;
            }
        });
    }
    
    // Visual effects methods
    addSpoiler() {
        const spoilerGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.3);
        const spoilerMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        spoiler.position.y = 1.2;
        spoiler.position.z = -2.2;
        spoiler.castShadow = true;
        this.mesh.add(spoiler);
    }
    
    addExhaust() {
        const exhaustGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
        const exhaustMaterial = new THREE.MeshLambertMaterial({ color: 0x636e72 });
        
        // Left exhaust
        const leftExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        leftExhaust.position.set(-0.6, 0.2, -2.2);
        leftExhaust.rotation.z = Math.PI / 2;
        this.mesh.add(leftExhaust);
        
        // Right exhaust
        const rightExhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        rightExhaust.position.set(0.6, 0.2, -2.2);
        rightExhaust.rotation.z = Math.PI / 2;
        this.mesh.add(rightExhaust);
    }
    
    // Car customization methods
    changeColor(color) {
        this.mesh.children.forEach(child => {
            if (child.material && child.geometry.type === 'BoxGeometry') {
                child.material.color.setHex(color);
            }
        });
    }
    
    // Physics integration
    setPhysics(physics) {
        this.physics = physics;
    }
    
    // Utility methods
    getPosition() {
        return this.mesh.position;
    }
    
    getRotation() {
        return this.mesh.rotation.y;
    }
    
    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }
    
    setRotation(y) {
        this.mesh.rotation.y = y;
    }
    
    // Cleanup
    dispose() {
        this.scene.remove(this.mesh);
        
        this.mesh.traverse((child) => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}
