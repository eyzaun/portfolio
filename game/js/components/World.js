// World Component - Track, environment and scenery
export class World {
    constructor(scene) {
        this.scene = scene;
        this.track = null;
        this.borders = [];
        this.buildings = [];
        
        this.createWorld();
    }
    
    createWorld() {
        console.log("Creating race track world...");
        
        this.createTrack();
        this.createTrackBorders();
        this.createBuildings();
        this.createEnvironment();
    }
    
    createTrack() {
        // Main track surface
        const trackGeometry = new THREE.PlaneGeometry(200, 200);
        const trackMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        
        this.track = new THREE.Mesh(trackGeometry, trackMaterial);
        this.track.rotation.x = -Math.PI / 2;
        this.track.receiveShadow = true;
        this.scene.add(this.track);
        
        // Track markings
        this.createTrackMarkings();
    }
    
    createTrackMarkings() {
        // Center line
        this.createCenterLine();
        
        // Lane markings
        this.createLaneMarkings();
        
        // Start/finish line
        this.createStartFinishLine();
    }
    
    createCenterLine() {
        const lineGeometry = new THREE.PlaneGeometry(2, 160);
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.y = 0.01;
        this.scene.add(centerLine);
    }
    
    createLaneMarkings() {
        // Dashed lane markings
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 60;
            
            const markingGeometry = new THREE.PlaneGeometry(1, 8);
            const markingMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2;
            marking.rotation.z = angle;
            marking.position.x = Math.cos(angle) * radius;
            marking.position.z = Math.sin(angle) * radius;
            marking.position.y = 0.01;
            
            this.scene.add(marking);
        }
    }
    
    createStartFinishLine() {
        const lineGeometry = new THREE.PlaneGeometry(20, 2);
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.9
        });
        
        const startLine = new THREE.Mesh(lineGeometry, lineMaterial);
        startLine.rotation.x = -Math.PI / 2;
        startLine.position.set(0, 0.01, 0);
        this.scene.add(startLine);
    }
    
    createTrackBorders() {
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0xff4757 });
        const radius = 80;
        const segments = 32;
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const border = new THREE.Mesh(
                new THREE.BoxGeometry(4, 3, 4),
                borderMaterial
            );
            border.position.set(x, 1.5, z);
            border.castShadow = true;
            border.receiveShadow = true;
            
            this.borders.push(border);
            this.scene.add(border);
        }
        
        // Additional decorative borders
        this.createDecorativeBorders();
    }
    
    createDecorativeBorders() {
        // Tire barriers
        const tireGeometry = new THREE.TorusGeometry(1, 0.5, 8, 16);
        const tireMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const radius = 75;
            
            const tire = new THREE.Mesh(tireGeometry, tireMaterial);
            tire.position.set(
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius
            );
            tire.rotation.x = Math.PI / 2;
            tire.castShadow = true;
            
            this.scene.add(tire);
        }
    }
    
    createBuildings() {
        const buildingMaterials = [
            new THREE.MeshLambertMaterial({ color: 0x6c5ce7 }),
            new THREE.MeshLambertMaterial({ color: 0xa29bfe }),
            new THREE.MeshLambertMaterial({ color: 0x74b9ff }),
            new THREE.MeshLambertMaterial({ color: 0x0984e3 }),
            new THREE.MeshLambertMaterial({ color: 0x00b894 }),
            new THREE.MeshLambertMaterial({ color: 0xe17055 })
        ];
        
        // Modern city buildings
        for (let i = 0; i < 25; i++) {
            const building = this.createBuilding(buildingMaterials);
            this.buildings.push(building);
            this.scene.add(building);
        }
    }
    
    createBuilding(materials) {
        const building = new THREE.Group();
        
        // Main building structure
        const width = Math.random() * 8 + 4;
        const height = Math.random() * 20 + 8;
        const depth = Math.random() * 8 + 4;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const material = materials[Math.floor(Math.random() * materials.length)];
        const buildingMesh = new THREE.Mesh(buildingGeometry, material);
        
        buildingMesh.position.y = height / 2;
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        building.add(buildingMesh);
        
        // Building details
        this.addBuildingDetails(building, width, height, depth);
        
        // Position buildings around the track
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 60;
        building.position.set(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );
        
        return building;
    }
    
    addBuildingDetails(building, width, height, depth) {
        // Windows
        this.addWindows(building, width, height, depth);
        
        // Antenna (some buildings)
        if (Math.random() > 0.7) {
            this.addAntenna(building, height);
        }
        
        // Rooftop equipment
        if (Math.random() > 0.5) {
            this.addRooftopEquipment(building, width, height, depth);
        }
    }
    
    addWindows(building, width, height, depth) {
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() > 0.3 ? 0xffff88 : 0x333333,
            emissive: Math.random() > 0.3 ? 0x222200 : 0x000000
        });
        
        const windowsPerFloor = Math.floor(width / 2);
        const floors = Math.floor(height / 3);
        
        for (let floor = 1; floor < floors; floor++) {
            for (let window = 0; window < windowsPerFloor; window++) {
                const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                
                windowMesh.position.set(
                    (window - windowsPerFloor / 2) * 2,
                    floor * 3,
                    width / 2 + 0.01
                );
                
                building.add(windowMesh);
            }
        }
    }
    
    addAntenna(building, height) {
        const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        
        antenna.position.y = height + 2.5;
        building.add(antenna);
    }
    
    addRooftopEquipment(building, width, height, depth) {
        // Air conditioning units
        const equipmentGeometry = new THREE.BoxGeometry(1, 0.5, 1);
        const equipmentMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        
        for (let i = 0; i < Math.random() * 3 + 1; i++) {
            const equipment = new THREE.Mesh(equipmentGeometry, equipmentMaterial);
            equipment.position.set(
                (Math.random() - 0.5) * width * 0.8,
                height + 0.25,
                (Math.random() - 0.5) * depth * 0.8
            );
            building.add(equipment);
        }
    }
    
    createEnvironment() {
        // Skybox/background elements
        this.createClouds();
        this.createGroundTexture();
    }
    
    createClouds() {
        const cloudMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        
        for (let i = 0; i < 8; i++) {
            const cloudGeometry = new THREE.SphereGeometry(
                Math.random() * 20 + 10,
                8,
                6
            );
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 400,
                50 + Math.random() * 30,
                (Math.random() - 0.5) * 400
            );
            
            this.scene.add(cloud);
        }
    }
    
    createGroundTexture() {
        // Additional ground details around the track
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
        
        for (let i = 0; i < 20; i++) {
            const patchSize = Math.random() * 10 + 5;
            const grassPatch = new THREE.Mesh(
                new THREE.PlaneGeometry(patchSize, patchSize),
                grassMaterial
            );
            
            grassPatch.rotation.x = -Math.PI / 2;
            grassPatch.position.set(
                (Math.random() - 0.5) * 300,
                -0.01,
                (Math.random() - 0.5) * 300
            );
            
            this.scene.add(grassPatch);
        }
    }
    
    // World modification methods
    addObstacle(position, size) {
        const obstacleGeometry = new THREE.BoxGeometry(size, size * 2, size);
        const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        
        obstacle.position.copy(position);
        obstacle.position.y = size;
        obstacle.castShadow = true;
        
        this.scene.add(obstacle);
        return obstacle;
    }
    
    // Cleanup method
    dispose() {
        this.buildings.forEach(building => {
            this.scene.remove(building);
        });
        
        this.borders.forEach(border => {
            this.scene.remove(border);
        });
        
        if (this.track) {
            this.scene.remove(this.track);
        }
    }
}
