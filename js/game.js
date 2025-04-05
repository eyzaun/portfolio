// Simplified 3D game with pure Three.js physics - NO CANNON dependencies

// Debug message to check if the correct file is loaded
console.log("Loading NEW simplified game.js - VERSION 2.0");

class Game {
    constructor() {
        console.log("Game constructor started");
        this.initialized = false;
        this.loading = true;
        this.codeFragments = 0;
        this.totalFragments = 5;
        this.progress = 0;
        this.currentStoryIndex = 0;
        
        // Simple physics variables
        this.gravity = 0.015;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isOnGround = false;
        this.colliders = [];
        
        // Story points for the game
        this.storyPoints = [
            {
                title: "Hoş Geldin, Gezgin",
                text: "Dijital dünyaya hoş geldin. Ben Eyüp, portfolyo kodlarımın içinden sana ulaşıyorum. Bu sanal dünyada kaybolmuş kod parçalarımı bulmam gerekiyor. Bana yardım edecek misin?"
            },
            {
                title: "İlk Kod Parçası",
                text: "Harika! İlk kod parçasını buldun. Bu HTML'in temel yapısını içeriyor. Web geliştiriciliğinin temeli HTML ile başlar ve sayfaların iskeletini oluşturur."
            },
            // ...other story points
        ];
        
        this.init();
    }
    
    async init() {
        console.log("Game initialization started");
        try {
            // Setup three.js scene
            this.setupScene();
            
            // Load assets
            await this.loadAssets();
            
            // Setup world and character
            this.createWorld();
            this.createCharacter();
            this.createCodeFragments();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Show first story dialog
            this.showStoryDialog();
            
            // Start game loop
            this.gameLoop();
            
            this.initialized = true;
            console.log("Game successfully initialized");
        } catch (error) {
            console.error("Error during initialization:", error);
            alert("Oyun yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
            
            // Show error message
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                const errorMsg = document.createElement('p');
                errorMsg.style.color = '#f50057';
                errorMsg.style.fontSize = '18px';
                errorMsg.style.marginTop = '20px';
                errorMsg.textContent = 'Hata: ' + error.message;
                loadingScreen.appendChild(errorMsg);
                
                const reloadBtn = document.createElement('button');
                reloadBtn.style.marginTop = '15px';
                reloadBtn.style.padding = '8px 16px';
                reloadBtn.style.background = '#f50057';
                reloadBtn.style.color = 'white';
                reloadBtn.style.border = 'none';
                reloadBtn.style.borderRadius = '4px';
                reloadBtn.style.cursor = 'pointer';
                reloadBtn.textContent = 'Yeniden Yükle';
                reloadBtn.onclick = () => window.location.reload();
                loadingScreen.appendChild(reloadBtn);
            }
        }
    }
    
    setupScene() {
        console.log("Setting up scene");
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050514);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 10, 5);
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
            console.log("Loading assets (simulated)");
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    
    createWorld() {
        console.log("Creating world");
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3a3a5a,
            roughness: 0.8
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = 0;
        this.scene.add(this.ground);
        this.colliders.push(this.ground);
        
        // Create some platforms
        const platformPositions = [
            { x: 5, y: 0.5, z: 5 },
            { x: 10, y: 1, z: 8 },
            { x: -5, y: 0.5, z: -5 }
        ];
        
        platformPositions.forEach(pos => {
            const platform = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.5, 3),
                new THREE.MeshStandardMaterial({ color: 0x6c63ff })
            );
            platform.position.set(pos.x, pos.y, pos.z);
            this.scene.add(platform);
            this.colliders.push(platform);
        });
    }
    
    createCharacter() {
        console.log("Creating character");
        // Simple character
        this.character = new THREE.Group();
        
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.5, 1),
            new THREE.MeshStandardMaterial({ color: 0x00aaff })
        );
        this.character.add(body);
        
        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            new THREE.MeshStandardMaterial({ color: 0xffaa00 })
        );
        head.position.y = 1;
        this.character.add(head);
        
        // Add to scene
        this.character.position.set(0, 1, 0);
        this.scene.add(this.character);
        
        // Movement controls
        this.moveSpeed = 0.1;
        this.jumpPower = 0.25;
        this.canJump = true;
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };
        
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w': case 'ArrowUp': this.keys.forward = true; break;
                case 's': case 'ArrowDown': this.keys.backward = true; break;
                case 'a': case 'ArrowLeft': this.keys.left = true; break;
                case 'd': case 'ArrowRight': this.keys.right = true; break;
                case ' ': this.keys.jump = true; break;
                case 'e': this.interactWithNearbyObjects(); break;
                case 'Escape': this.toggleMenu(); break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w': case 'ArrowUp': this.keys.forward = false; break;
                case 's': case 'ArrowDown': this.keys.backward = false; break;
                case 'a': case 'ArrowLeft': this.keys.left = false; break;
                case 'd': case 'ArrowRight': this.keys.right = false; break;
                case ' ': this.keys.jump = false; break;
            }
        });
    }
    
    createCodeFragments() {
        console.log("Creating code fragments");
        this.fragments = [];
        
        const fragmentPositions = [
            { x: 5, y: 1.5, z: 5 },
            { x: 10, y: 2, z: 8 },
            { x: -5, y: 1.5, z: -5 }
        ];
        
        fragmentPositions.forEach((pos, index) => {
            const fragment = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.4),
                new THREE.MeshStandardMaterial({ 
                    color: 0x00ffaa,
                    emissive: 0x00aa77,
                    emissiveIntensity: 0.5,
                })
            );
            
            fragment.position.set(pos.x, pos.y, pos.z);
            fragment.userData.index = index;
            this.scene.add(fragment);
            this.fragments.push(fragment);
        });
    }
    
    interactWithNearbyObjects() {
        this.fragments.forEach((fragment, index) => {
            if (fragment.visible) {
                const distance = this.character.position.distanceTo(fragment.position);
                if (distance < 2) {
                    fragment.visible = false;
                    this.collectCodeFragment(index);
                }
            }
        });
    }
    
    collectCodeFragment(index) {
        this.codeFragments++;
        document.getElementById('code-fragments').textContent = this.codeFragments;
        this.updateProgress();
        
        this.currentStoryIndex = index + 1;
        this.showStoryDialog();
        
        if (this.codeFragments === this.fragments.length) {
            setTimeout(() => {
                this.currentStoryIndex = this.storyPoints.length - 1;
                this.showStoryDialog();
            }, 2000);
        }
    }
    
    updateProgress() {
        this.progress = (this.codeFragments / this.fragments.length) * 100;
        document.getElementById('progress-fill').style.width = `${this.progress}%`;
    }
    
    showStoryDialog() {
        const dialogEl = document.getElementById('story-dialog');
        const titleEl = document.getElementById('dialog-title');
        const textEl = document.getElementById('dialog-text');
        
        if (this.currentStoryIndex < this.storyPoints.length) {
            const storyPoint = this.storyPoints[this.currentStoryIndex];
            titleEl.textContent = storyPoint.title;
            textEl.textContent = storyPoint.text;
            dialogEl.classList.remove('hidden');
        }
    }
    
    hideStoryDialog() {
        document.getElementById('story-dialog').classList.add('hidden');
    }
    
    setupEventListeners() {
        document.getElementById('dialog-continue').addEventListener('click', () => {
            this.hideStoryDialog();
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
    
    update() {
        // Apply gravity
        if (!this.isOnGround) {
            this.velocity.y -= this.gravity;
        }
        
        // Handle movement input
        const direction = new THREE.Vector3();
        
        if (this.keys.forward) direction.z -= 1;
        if (this.keys.backward) direction.z += 1;
        if (this.keys.left) direction.x -= 1;
        if (this.keys.right) direction.x += 1;
        
        if (direction.length() > 0) {
            direction.normalize().multiplyScalar(this.moveSpeed);
            this.velocity.x = direction.x;
            this.velocity.z = direction.z;
            
            // Rotate character to face movement direction
            this.character.rotation.y = Math.atan2(direction.x, direction.z);
        } else {
            // Apply friction
            this.velocity.x *= 0.9;
            this.velocity.z *= 0.9;
        }
        
        // Handle jumping
        if (this.keys.jump && this.isOnGround && this.canJump) {
            this.velocity.y = this.jumpPower;
            this.isOnGround = false;
            this.canJump = false;
            
            setTimeout(() => {
                this.canJump = true;
            }, 1000);
        }
        
        // Update position
        this.character.position.x += this.velocity.x;
        this.character.position.y += this.velocity.y;
        this.character.position.z += this.velocity.z;
        
        // Simple ground collision detection
        if (this.character.position.y < 1) {
            this.character.position.y = 1;
            this.velocity.y = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
        
        // Update camera position to follow character
        this.camera.position.x = this.character.position.x;
        this.camera.position.z = this.character.position.z + 5;
        this.camera.position.y = this.character.position.y + 3;
        this.camera.lookAt(this.character.position);
    }
    
    gameLoop() {
        const animate = () => {
            if (this.initialized) {
                this.update();
            }
            
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing game");
    setTimeout(() => {
        try {
            window.gameInstance = new Game();
        } catch (error) {
            console.error("Failed to initialize game:", error);
            alert("Oyun başlatılamadı: " + error.message);
        }
    }, 500);
});

console.log("Game.js file successfully loaded");
