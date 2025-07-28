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
        
        // Car physics
        this.carSpeed = 0;
        this.maxSpeed = 0.8;
        this.acceleration = 0.02;
        this.friction = 0.95;
        this.turnSpeed = 0.03;
        this.driftFactor = 0.9;
        
        // Controls
        this.keys = {
            accelerate: false,
            brake: false,
            left: false,
            right: false,
            handbrake: false
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
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(4, 1, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xe17055 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        this.car.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(3, 1, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 1.5;
        roof.castShadow = true;
        this.car.add(roof);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        
        const wheelPositions = [
            { x: -1.8, z: 2.5 },  // Front left
            { x: 1.8, z: 2.5 },   // Front right
            { x: -1.8, z: -2.5 }, // Rear left
            { x: 1.8, z: -2.5 }   // Rear right
        ];
        
        this.wheels = [];
        wheelPositions.forEach((pos, index) => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, 0, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            this.car.add(wheel);
            this.wheels.push(wheel);
        });
        
        // Car initial position
        this.car.position.set(0, 0, 0);
        this.carVelocity = new THREE.Vector3(0, 0, 0);
        this.carDirection = 0;
        
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
        // Handle acceleration and braking
        if (this.keys.accelerate) {
            this.carSpeed = Math.min(this.carSpeed + this.acceleration, this.maxSpeed);
        } else if (this.keys.brake) {
            this.carSpeed = Math.max(this.carSpeed - this.acceleration * 2, -this.maxSpeed * 0.5);
        } else {
            this.carSpeed *= this.friction;
        }
        
        // Handle steering
        if (this.keys.left && Math.abs(this.carSpeed) > 0.01) {
            this.carDirection += this.turnSpeed * (this.carSpeed > 0 ? 1 : -1);
        }
        if (this.keys.right && Math.abs(this.carSpeed) > 0.01) {
            this.carDirection -= this.turnSpeed * (this.carSpeed > 0 ? 1 : -1);
        }
        
        // Handle handbrake for drifting
        if (this.keys.handbrake && Math.abs(this.carSpeed) > 0.2) {
            this.drift = true;
            this.carSpeed *= 0.9;
            this.driftScore += Math.abs(this.carSpeed) * 10;
        } else {
            this.drift = false;
        }
        
        // Update car velocity based on direction
        this.carVelocity.x = Math.sin(this.carDirection) * this.carSpeed;
        this.carVelocity.z = Math.cos(this.carDirection) * this.carSpeed;
        
        // Apply drift effect
        if (this.drift) {
            this.carVelocity.multiplyScalar(this.driftFactor);
        }
        
        // Update car position
        this.car.position.add(this.carVelocity);
        this.car.rotation.y = this.carDirection;
        
        // Animate wheels
        this.wheels.forEach(wheel => {
            wheel.rotation.x += this.carSpeed * 2;
        });
        
        // Update speed display
        this.speed = Math.abs(this.carSpeed) * 100;
        document.getElementById('code-fragments').textContent = Math.floor(this.speed);
    }
    
    checkCollisions() {
        this.collectibles.forEach((collectible, index) => {
            if (!collectible.userData.collected) {
                const distance = this.car.position.distanceTo(collectible.position);
                
                if (distance < 3) {
                    this.collectItem(collectible, index);
                }
            }
        });
        
        // Keep car on track (simple boundary)
        const maxDistance = 90;
        const carDistance = Math.sqrt(this.car.position.x ** 2 + this.car.position.z ** 2);
        
        if (carDistance > maxDistance) {
            // Push car back towards center
            const angle = Math.atan2(this.car.position.z, this.car.position.x);
            this.car.position.x = Math.cos(angle) * maxDistance;
            this.car.position.z = Math.sin(angle) * maxDistance;
            this.carSpeed *= 0.5; // Slow down when hitting boundary
        }
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
        // Follow car with smooth camera movement
        const idealOffset = new THREE.Vector3(0, 8, 12);
        idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.carDirection);
        
        const idealPosition = this.car.position.clone().add(idealOffset);
        
        // Smooth camera movement
        this.camera.position.lerp(idealPosition, 0.1);
        this.camera.lookAt(this.car.position);
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
