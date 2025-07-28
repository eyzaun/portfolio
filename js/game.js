// 3D Car Drift Game - Portfolio Collection Adventure
// Developed by Eyüp Zafer ÜNAL

console.log("Loading Portfolio Drift Racing Game - VERSION 3.0");

class PortfolioDriftGame {
    constructor() {
        console.log("Portfolio Drift Game starting...");
        this.initialized = false;
        this.loading = true;
        
        // Game statistics
        this.projectsCollected = 0;
        this.skillsCollected = 0;
        this.experienceCollected = 0;
        this.totalCollectibles = 15;
        this.score = 0;
        this.speed = 0;
        this.drift = false;
        this.driftScore = 0;
        
        // Enhanced Car Physics
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.angularVelocity = 0;
        this.steerAngle = 0;
        this.maxSteerAngle = 0.6;
        this.wheelBase = 4; // Distance between front and rear axles
        
        // Physics constants
        this.maxSpeed = 1.2;
        this.acceleration = 0.03;
        this.brakeForce = 0.05;
        this.friction = 0.92;
        this.lateralFriction = 0.85;
        this.driftThreshold = 0.3;
        this.driftMultiplier = 0.7;
        
        // Drift system
        this.isDrifting = false;
        this.driftAngle = 0;
        this.driftIntensity = 0;
        this.driftParticles = [];
        
        // Controls
        this.keys = {
            accelerate: false,
            brake: false,
            left: false,
            right: false,
            handbrake: false
        };
        
        // Input smoothing
        this.inputSmoothing = {
            throttle: 0,
            brake: 0,
            steering: 0
        };
        
        // Portfolio data from CV
        this.portfolioData = {
            projects: [
                { name: "AvukatLLM", tech: "AI/ML", points: 100, color: 0xff6b6b },
                { name: "GoDash", tech: "Go", points: 80, color: 0x4ecdc4 },
                { name: "MyYDS", tech: "React", points: 90, color: 0x45b7d1 },
                { name: "TYT Platform", tech: "PWA", points: 85, color: 0x96ceb4 },
                { name: "LinkedHU", tech: "Node.js", points: 75, color: 0xffeaa7 }
            ],
            skills: [
                { name: "JavaScript", level: 90, color: 0xf39c12 },
                { name: "Python", level: 85, color: 0x3498db },
                { name: "React", level: 80, color: 0x61dafb },
                { name: "Three.js", level: 75, color: 0x000000 },
                { name: "AI/ML", level: 85, color: 0xe74c3c }
            ],
            experiences: [
                { company: "Binary Brain Technology", role: "Software Intern", points: 150, color: 0x9b59b6 },
                { company: "TellUS", role: "Software Intern", points: 120, color: 0x34495e },
                { company: "Hacettepe University", role: "Student", points: 100, color: 0x2ecc71 }
            ]
        };
        
        this.collectibles = [];
        this.init();
    }
    
    async init() {
        console.log("Initializing Portfolio Drift Game...");
        try {
            this.setupScene();
            await this.loadAssets();
            this.createWorld();
            this.createCar();
            this.createCollectibles();
            this.setupControls();
            this.setupUI();
            this.hideLoadingScreen();
            this.showWelcomeDialog();
            this.gameLoop();
            
            this.initialized = true;
            console.log("Portfolio Drift Game successfully initialized!");
        } catch (error) {
            console.error("Game initialization error:", error);
            this.showError(error.message);
        }
    }
    
    setupScene() {
        console.log("Setting up 3D scene...");
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    async loadAssets() {
        return new Promise((resolve) => {
            console.log("Loading game assets...");
            // Simulate asset loading
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    createWorld() {
        console.log("Creating race track world...");
        
        // Ground/Track
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
        
        // Track borders and obstacles
        this.createTrackBorders();
        this.createBuildings();
    }
    
    createTrackBorders() {
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0xff4757 });
        
        // Create circular track borders
        const borderPositions = [];
        const radius = 80;
        const segments = 32;
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            borderPositions.push({ x, z });
        }
        
        borderPositions.forEach((pos, index) => {
            const border = new THREE.Mesh(
                new THREE.BoxGeometry(4, 3, 4),
                borderMaterial
            );
            border.position.set(pos.x, 1.5, pos.z);
            border.castShadow = true;
            this.scene.add(border);
        });
    }
    
    createBuildings() {
        const buildingMaterials = [
            new THREE.MeshLambertMaterial({ color: 0x6c5ce7 }),
            new THREE.MeshLambertMaterial({ color: 0xa29bfe }),
            new THREE.MeshLambertMaterial({ color: 0x74b9ff }),
            new THREE.MeshLambertMaterial({ color: 0x0984e3 })
        ];
        
        // Create random buildings around the track
        for (let i = 0; i < 20; i++) {
            const building = new THREE.Mesh(
                new THREE.BoxGeometry(
                    Math.random() * 8 + 4,
                    Math.random() * 15 + 5,
                    Math.random() * 8 + 4
                ),
                buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)]
            );
            
            // Position buildings outside the track
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            building.position.set(
                Math.cos(angle) * distance,
                building.geometry.parameters.height / 2,
                Math.sin(angle) * distance
            );
            
            building.castShadow = true;
            this.scene.add(building);
        }
    }
    
    createCar() {
        console.log("Creating player car...");
        
        this.car = new THREE.Group();
        
        // Car body - more realistic proportions
        const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xe17055 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        body.castShadow = true;
        this.car.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(1.6, 0.6, 2.2);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.1;
        roof.position.z = -0.3;
        roof.castShadow = true;
        this.car.add(roof);
        
        // Front bumper
        const bumperGeometry = new THREE.BoxGeometry(1.8, 0.3, 0.5);
        const bumperMaterial = new THREE.MeshLambertMaterial({ color: 0x636e72 });
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.y = 0.15;
        frontBumper.position.z = 2.5;
        this.car.add(frontBumper);
        
        // Wheels - better positioning and size
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const rimMaterial = new THREE.MeshLambertMaterial({ color: 0x74b9ff });
        
        const wheelPositions = [
            { x: -1.2, z: 1.8 },  // Front left
            { x: 1.2, z: 1.8 },   // Front right
            { x: -1.2, z: -1.8 }, // Rear left
            { x: 1.2, z: -1.8 }   // Rear right
        ];
        
        this.wheels = [];
        this.frontWheels = [];
        
        wheelPositions.forEach((pos, index) => {
            const wheelGroup = new THREE.Group();
            
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheelGroup.add(wheel);
            
            // Add rim details
            const rim = new THREE.Mesh(
                new THREE.CylinderGeometry(0.25, 0.25, 0.32),
                rimMaterial
            );
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);
            
            wheelGroup.position.set(pos.x, 0.4, pos.z);
            wheelGroup.castShadow = true;
            this.car.add(wheelGroup);
            this.wheels.push(wheelGroup);
            
            // Store front wheels for steering
            if (index < 2) {
                this.frontWheels.push(wheelGroup);
            }
        });
        
        // Car initial position and physics
        this.car.position.set(0, 0, 0);
        this.car.rotation.y = 0;
        
        // Physics initialization
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.angularVelocity = 0;
        this.speed = 0;
        
        this.scene.add(this.car);
    }
    
    createCollectibles() {
        console.log("Creating portfolio collectibles...");
        
        // Create project collectibles
        this.portfolioData.projects.forEach((project, index) => {
            const collectible = this.createCollectible(
                project.name,
                project.tech,
                project.color,
                'project',
                project.points
            );
            
            // Position around the track
            const angle = (index / this.portfolioData.projects.length) * Math.PI * 2;
            const radius = 30;
            collectible.position.set(
                Math.cos(angle) * radius,
                2,
                Math.sin(angle) * radius
            );
            
            this.collectibles.push(collectible);
            this.scene.add(collectible);
        });
        
        // Create skill collectibles
        this.portfolioData.skills.forEach((skill, index) => {
            const collectible = this.createCollectible(
                skill.name,
                `${skill.level}%`,
                skill.color,
                'skill',
                skill.level
            );
            
            // Position in inner circle
            const angle = (index / this.portfolioData.skills.length) * Math.PI * 2;
            const radius = 15;
            collectible.position.set(
                Math.cos(angle) * radius,
                2,
                Math.sin(angle) * radius
            );
            
            this.collectibles.push(collectible);
            this.scene.add(collectible);
        });
        
        // Create experience collectibles
        this.portfolioData.experiences.forEach((exp, index) => {
            const collectible = this.createCollectible(
                exp.company,
                exp.role,
                exp.color,
                'experience',
                exp.points
            );
            
            // Position in outer circle
            const angle = (index / this.portfolioData.experiences.length) * Math.PI * 2;
            const radius = 50;
            collectible.position.set(
                Math.cos(angle) * radius,
                2,
                Math.sin(angle) * radius
            );
            
            this.collectibles.push(collectible);
            this.scene.add(collectible);
        });
    }
    
    createCollectible(name, subtitle, color, type, points) {
        const group = new THREE.Group();
        
        // Main collectible shape
        const geometry = new THREE.OctahedronGeometry(1.5);
        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        group.add(mesh);
        
        // Floating animation
        group.userData = {
            name: name,
            subtitle: subtitle,
            type: type,
            points: points,
            collected: false,
            originalY: 2,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        return group;
    }
    
    
    setupControls() {
        console.log("Setting up car controls...");
        
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.accelerate = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.brake = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = true;
                    break;
                case ' ':
                    this.keys.handbrake = true;
                    e.preventDefault();
                    break;
                case 'escape':
                    this.toggleMenu();
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.accelerate = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.brake = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = false;
                    break;
                case ' ':
                    this.keys.handbrake = false;
                    break;
            }
        });
    }
    
    setupUI() {
        // Update progress display
        this.updateUI();
        
        // Event listeners for UI buttons
        document.getElementById('dialog-continue').addEventListener('click', () => {
            this.hideDialog();
        });
        
        document.getElementById('menu-button').addEventListener('click', () => {
            this.toggleMenu();
        });
        
        document.getElementById('close-menu').addEventListener('click', () => {
            this.toggleMenu();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('back-to-portfolio').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    updateCarPhysics() {
        const deltaTime = 1/60; // Assuming 60fps
        
        // Smooth input handling
        this.updateInputSmoothing();
        
        // Calculate forces
        const throttle = this.inputSmoothing.throttle;
        const brakeInput = this.inputSmoothing.brake;
        const steerInput = this.inputSmoothing.steering;
        
        // Current speed
        this.speed = this.velocity.length();
        
        // Steering - only effective when moving
        const speedFactor = Math.min(this.speed * 3, 1);
        this.steerAngle = steerInput * this.maxSteerAngle * speedFactor;
        
        // Update front wheel steering visuals
        this.frontWheels.forEach(wheel => {
            wheel.rotation.y = this.steerAngle;
        });
        
        // Engine force
        const engineForce = throttle * this.acceleration;
        
        // Brake force
        const totalBrakeForce = brakeInput * this.brakeForce + 
                               (this.keys.handbrake ? this.brakeForce * 1.5 : 0);
        
        // Calculate car's forward and right vectors
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.car.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.car.quaternion);
        
        // Apply engine force in forward direction
        const engineVector = forward.clone().multiplyScalar(engineForce);
        this.velocity.add(engineVector);
        
        // Apply braking force opposite to velocity direction
        if (this.speed > 0.01) {
            const brakeVector = this.velocity.clone().normalize().multiplyScalar(-totalBrakeForce);
            this.velocity.add(brakeVector);
        }
        
        // Lateral friction and drift calculation
        const velocityDirection = this.velocity.clone().normalize();
        const forwardComponent = velocityDirection.dot(forward);
        const rightComponent = velocityDirection.dot(right);
        
        // Calculate drift angle
        this.driftAngle = Math.atan2(rightComponent, Math.abs(forwardComponent));
        
        // Determine if we're drifting
        const lateralSpeed = Math.abs(rightComponent * this.speed);
        this.isDrifting = lateralSpeed > this.driftThreshold && this.keys.handbrake;
        this.driftIntensity = Math.min(lateralSpeed / 0.8, 1);
        
        // Apply lateral friction
        let lateralFrictionCoeff = this.lateralFriction;
        if (this.isDrifting) {
            lateralFrictionCoeff *= this.driftMultiplier;
            this.driftScore += this.driftIntensity * 2;
        }
        
        // Separate velocity into forward and lateral components
        const forwardVelocity = forward.clone().multiplyScalar(forward.dot(this.velocity));
        const lateralVelocity = right.clone().multiplyScalar(right.dot(this.velocity));
        
        // Apply lateral friction
        lateralVelocity.multiplyScalar(lateralFrictionCoeff);
        
        // Recombine velocities
        this.velocity = forwardVelocity.add(lateralVelocity);
        
        // Apply general friction
        this.velocity.multiplyScalar(this.friction);
        
        // Angular velocity calculation (Ackermann steering)
        if (Math.abs(this.steerAngle) > 0.01 && this.speed > 0.01) {
            // Calculate angular velocity based on Ackermann steering geometry
            const turningRadius = this.wheelBase / Math.tan(Math.abs(this.steerAngle));
            this.angularVelocity = (this.speed / turningRadius) * Math.sign(this.steerAngle);
            
            // Limit angular velocity
            this.angularVelocity = Math.max(-0.1, Math.min(0.1, this.angularVelocity));
        } else {
            this.angularVelocity *= 0.9; // Damping
        }
        
        // Update car rotation
        this.car.rotation.y += this.angularVelocity;
        
        // Update car position
        this.car.position.add(this.velocity);
        
        // Animate wheels based on movement
        const wheelRotationSpeed = this.speed * 8;
        this.wheels.forEach(wheel => {
            wheel.children[0].rotation.x += wheelRotationSpeed * (this.velocity.z > 0 ? 1 : -1);
        });
        
        // Visual effects for drifting
        this.updateDriftEffects();
        
        // Update UI with current speed (convert to km/h-like display)
        const displaySpeed = Math.floor(this.speed * 200);
        const speedElement = document.querySelector('.controls-hint p');
        if (speedElement && this.isDrifting) {
            speedElement.innerHTML = `<strong>🔥 DRIFT! Speed: ${displaySpeed} km/h | WASD - Hareket | SPACE - Drift | ESC - Menü</strong>`;
        } else if (speedElement) {
            speedElement.innerHTML = `<strong>Speed: ${displaySpeed} km/h | WASD - Hareket | SPACE - Drift | ESC - Menü</strong>`;
        }
    }
    
    updateInputSmoothing() {
        const smoothingFactor = 0.15;
        
        // Throttle
        const targetThrottle = this.keys.accelerate ? 1 : 0;
        this.inputSmoothing.throttle += (targetThrottle - this.inputSmoothing.throttle) * smoothingFactor;
        
        // Brake
        const targetBrake = this.keys.brake ? 1 : 0;
        this.inputSmoothing.brake += (targetBrake - this.inputSmoothing.brake) * smoothingFactor;
        
        // Steering
        let targetSteering = 0;
        if (this.keys.left) targetSteering = 1;
        if (this.keys.right) targetSteering = -1;
        this.inputSmoothing.steering += (targetSteering - this.inputSmoothing.steering) * smoothingFactor * 2;
    }
    
    updateDriftEffects() {
        if (this.isDrifting && this.driftIntensity > 0.3) {
            // Create drift particle effects (simplified)
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
        const carBack = new THREE.Vector3(0, 0, -2).applyQuaternion(this.car.quaternion);
        particle.position.copy(this.car.position).add(carBack);
        particle.position.y = 0.1;
        
        // Add some randomness
        particle.position.x += (Math.random() - 0.5) * 2;
        particle.position.z += (Math.random() - 0.5) * 2;
        
        this.scene.add(particle);
        this.driftParticles.push(particle);
    }
    
    checkCollisions() {
        // Check collectible collisions
        this.collectibles.forEach((collectible, index) => {
            if (!collectible.userData.collected) {
                const distance = this.car.position.distanceTo(collectible.position);
                
                if (distance < 3) {
                    this.collectItem(collectible, index);
                }
            }
        });
        
        // Enhanced boundary checking with collision response
        const maxDistance = 85;
        const carDistance = Math.sqrt(this.car.position.x ** 2 + this.car.position.z ** 2);
        
        if (carDistance > maxDistance) {
            // Calculate collision normal (direction from center to car)
            const normal = new THREE.Vector3(this.car.position.x, 0, this.car.position.z).normalize();
            
            // Reflect velocity off the boundary
            const velocityDotNormal = this.velocity.dot(normal);
            if (velocityDotNormal > 0) {
                // Remove the component of velocity going into the wall
                const reflection = normal.multiplyScalar(velocityDotNormal * 1.5);
                this.velocity.sub(reflection);
            }
            
            // Push car back to safe position
            const safePosition = normal.multiplyScalar(maxDistance * 0.98);
            this.car.position.x = safePosition.x;
            this.car.position.z = safePosition.z;
            
            // Add collision effect
            this.velocity.multiplyScalar(0.3); // Lose speed on collision
        }
        
        // Keep car on ground
        this.car.position.y = 0;
    }
    
    collectItem(collectible, index) {
        collectible.userData.collected = true;
        
        // Hide collectible with animation
        collectible.scale.set(0, 0, 0);
        
        // Update score and stats
        this.score += collectible.userData.points;
        
        switch(collectible.userData.type) {
            case 'project':
                this.projectsCollected++;
                break;
            case 'skill':
                this.skillsCollected++;
                break;
            case 'experience':
                this.experienceCollected++;
                break;
        }
        
        // Show collection dialog
        this.showCollectionDialog(collectible.userData);
        
        // Update UI
        this.updateUI();
        
        // Check if all items collected
        const totalCollected = this.projectsCollected + this.skillsCollected + this.experienceCollected;
        if (totalCollected >= this.totalCollectibles) {
            setTimeout(() => {
                this.showVictoryDialog();
            }, 2000);
        }
    }
    
    updateUI() {
        const totalCollected = this.projectsCollected + this.skillsCollected + this.experienceCollected;
        const progress = (totalCollected / this.totalCollectibles) * 100;
        
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Update the items collected display to show different categories
        const itemsDisplay = document.getElementById('code-fragments');
        if (itemsDisplay) {
            itemsDisplay.textContent = `${totalCollected}/${this.totalCollectibles}`;
        }
        
        // Update drift score display if drifting
        if (this.isDrifting && this.driftIntensity > 0.5) {
            const progressLabel = document.querySelector('.progress-label');
            if (progressLabel) {
                progressLabel.textContent = `🔥 DRIFT COMBO: ${Math.floor(this.driftScore)} | Portfolio: ${totalCollected}/${this.totalCollectibles}`;
            }
        } else {
            const progressLabel = document.querySelector('.progress-label');
            if (progressLabel) {
                progressLabel.textContent = 'Portfolio Toplama İlerlemesi';
            }
        }
    }
    
    animateCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.userData.collected) {
                // Floating animation
                collectible.position.y = collectible.userData.originalY + 
                    Math.sin(Date.now() * 0.003 + collectible.userData.floatOffset) * 0.5;
                
                // Rotation animation
                collectible.rotation.y += 0.02;
                collectible.rotation.x += 0.01;
            }
        });
    }
    
    updateCamera() {
        // Enhanced camera follow system
        const carPosition = this.car.position.clone();
        const carRotation = this.car.rotation.y;
        
        // Calculate ideal camera position based on car speed and direction
        const speedFactor = Math.min(this.speed * 2, 1);
        const baseDistance = 12 + speedFactor * 8;
        const baseHeight = 6 + speedFactor * 4;
        
        // Camera offset behind the car
        const cameraOffset = new THREE.Vector3(0, baseHeight, baseDistance);
        
        // Apply car rotation to offset
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation);
        
        // Add some camera shake during drift
        if (this.isDrifting) {
            const shakeIntensity = this.driftIntensity * 0.5;
            cameraOffset.x += (Math.random() - 0.5) * shakeIntensity;
            cameraOffset.y += (Math.random() - 0.5) * shakeIntensity * 0.5;
        }
        
        const idealPosition = carPosition.clone().add(cameraOffset);
        
        // Smooth camera movement with variable lerp based on speed
        const lerpFactor = 0.08 + speedFactor * 0.02;
        this.camera.position.lerp(idealPosition, lerpFactor);
        
        // Look ahead of the car based on velocity
        const lookAhead = this.velocity.clone().multiplyScalar(3);
        const lookTarget = carPosition.clone().add(lookAhead);
        lookTarget.y += 2;
        
        this.camera.lookAt(lookTarget);
    }
    
    showCollectionDialog(itemData) {
        const dialogEl = document.getElementById('story-dialog');
        const titleEl = document.getElementById('dialog-title');
        const textEl = document.getElementById('dialog-text');
        
        titleEl.textContent = `${itemData.name} Toplandı!`;
        
        let description = '';
        switch(itemData.type) {
            case 'project':
                description = `${itemData.name} projesi toplandı! Teknoloji: ${itemData.subtitle}. Bu proje portfolio deneyimimin önemli bir parçası.`;
                break;
            case 'skill':
                description = `${itemData.name} yeteneği toplandı! Seviye: ${itemData.subtitle}. Bu teknolojide güçlü deneyimim var.`;
                break;
            case 'experience':
                description = `${itemData.name} deneyimi toplandı! Pozisyon: ${itemData.subtitle}. Bu deneyim kariyerimde önemli bir adım.`;
                break;
        }
        
        textEl.textContent = description;
        dialogEl.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideDialog();
        }, 3000);
    }
    
    showWelcomeDialog() {
        const dialogEl = document.getElementById('story-dialog');
        const titleEl = document.getElementById('dialog-title');
        const textEl = document.getElementById('dialog-text');
        
        titleEl.textContent = 'Portfolio Drift Racing\'e Hoş Geldin!';
        textEl.textContent = 'Merhaba! Ben Eyüp Zafer ÜNAL. Bu oyunda arabamla drift atarak CV\'mdeki projeleri, yetenekleri ve deneyimleri toplamalısın. WASD ile sür, SPACE ile drift yap!';
        
        dialogEl.classList.remove('hidden');
    }
    
    showVictoryDialog() {
        const dialogEl = document.getElementById('story-dialog');
        const titleEl = document.getElementById('dialog-title');
        const textEl = document.getElementById('dialog-text');
        
        titleEl.textContent = 'Tebrikler! 🎉';
        textEl.textContent = `Tüm portfolio öğelerini topladın! Toplam skor: ${this.score} puan. Drift skoru: ${Math.floor(this.driftScore)}. Artık portfolyoma göz atabilirsin!`;
        
        dialogEl.classList.remove('hidden');
    }
    
    hideDialog() {
        document.getElementById('story-dialog').classList.add('hidden');
    }
    
    toggleMenu() {
        document.getElementById('menu-panel').classList.toggle('hidden');
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.loading = false;
        }, 500);
    }
    
    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <p style="color: #f50057; font-size: 18px;">Hata: ${message}</p>
                    <button onclick="window.location.reload()" 
                            style="margin-top: 15px; padding: 8px 16px; background: #f50057; 
                                   color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Yeniden Yükle
                    </button>
                </div>
            `;
        }
    }
    
    gameLoop() {
        const animate = () => {
            if (this.initialized && !this.loading) {
                this.updateCarPhysics();
                this.checkCollisions();
                this.animateCollectibles();
                this.updateCamera();
            }
            
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing Portfolio Drift Game...");
    setTimeout(() => {
        try {
            window.gameInstance = new PortfolioDriftGame();
        } catch (error) {
            console.error("Failed to initialize game:", error);
            alert("Portfolio Drift oyunu başlatılamadı: " + error.message);
        }
    }, 500);
});

console.log("Portfolio Drift Game.js file successfully loaded");
