// Portfolio Drift Racing - Main Game Class
// Developed by Eyüp Zafer ÜNAL

import { CarPhysics } from './systems/CarPhysics.js';
import { CarControls } from './systems/CarControls.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { UISystem } from './systems/UISystem.js';
import { SceneManager } from './systems/SceneManager.js';
import { Car } from './components/Car.js';
import { World } from './components/World.js';
import { CollectibleManager } from './components/CollectibleManager.js';
import { PortfolioData } from './utils/PortfolioData.js';

console.log("Loading Portfolio Drift Racing Game - VERSION 4.0 - Modular");

export class PortfolioDriftGame {
    constructor() {
        console.log("Portfolio Drift Game starting...");
        this.initialized = false;
        this.loading = true;
        
        // Game statistics
        this.gameStats = {
            projectsCollected: 0,
            skillsCollected: 0,
            experienceCollected: 0,
            totalCollectibles: 15,
            score: 0,
            driftScore: 0
        };
        
        // Game systems
        this.sceneManager = null;
        this.carPhysics = null;
        this.carControls = null;
        this.cameraSystem = null;
        this.collisionSystem = null;
        this.uiSystem = null;
        
        // Game objects
        this.car = null;
        this.world = null;
        this.collectibleManager = null;
        
        this.init();
    }
    
    async init() {
        console.log("Initializing Portfolio Drift Game...");
        try {
            // Initialize scene and renderer
            this.sceneManager = new SceneManager();
            
            // Load assets
            await this.loadAssets();
            
            // Create world and car
            this.world = new World(this.sceneManager.scene);
            this.car = new Car(this.sceneManager.scene);
            
            // Initialize collectibles
            this.collectibleManager = new CollectibleManager(
                this.sceneManager.scene, 
                PortfolioData
            );
            
            // Initialize game systems
            this.carPhysics = new CarPhysics(this.car, this.sceneManager.scene);
            this.carControls = new CarControls();
            this.cameraSystem = new CameraSystem(this.sceneManager.camera, this.car);
            this.collisionSystem = new CollisionSystem(this.car, this.collectibleManager);
            this.uiSystem = new UISystem(this.gameStats);
            
            // Setup UI event handlers
            this.setupUI();
            
            // Hide loading screen and start game
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
    
    async loadAssets() {
        return new Promise((resolve) => {
            console.log("Loading game assets...");
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    setupUI() {
        // Update initial UI
        this.uiSystem.updateUI();
        
        // Event listeners for UI buttons
        document.getElementById('dialog-continue').addEventListener('click', () => {
            this.uiSystem.hideDialog();
        });
        
        document.getElementById('menu-button').addEventListener('click', () => {
            this.uiSystem.toggleMenu();
        });
        
        document.getElementById('close-menu').addEventListener('click', () => {
            this.uiSystem.toggleMenu();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('back-to-portfolio').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
    
    update() {
        if (!this.initialized || this.loading) return;
        
        // Update input
        this.carControls.update();
        
        // Update car physics
        this.carPhysics.update(this.carControls.getInputState());
        
        // Check collisions
        const collisionResult = this.collisionSystem.checkCollisions();
        if (collisionResult.collected) {
            this.handleItemCollection(collisionResult);
        }
        
        // Update camera
        this.cameraSystem.update(this.carPhysics.getPhysicsState());
        
        // Update collectibles animation
        this.collectibleManager.update();
        
        // Update UI
        this.uiSystem.updateUI();
        this.uiSystem.updateSpeedDisplay(this.carPhysics.getSpeed(), this.carPhysics.isDrifting());
        this.uiSystem.updateDriftDisplay(this.carPhysics.isDrifting(), this.carPhysics.getDriftScore());
    }
    
    handleItemCollection(collisionResult) {
        const itemData = collisionResult.itemData;
        
        // Update game stats
        this.gameStats.score += itemData.points;
        
        switch(itemData.type) {
            case 'project':
                this.gameStats.projectsCollected++;
                break;
            case 'skill':
                this.gameStats.skillsCollected++;
                break;
            case 'experience':
                this.gameStats.experienceCollected++;
                break;
        }
        
        // Show collection dialog
        this.uiSystem.showCollectionDialog(itemData);
        
        // Check win condition
        const totalCollected = this.gameStats.projectsCollected + 
                              this.gameStats.skillsCollected + 
                              this.gameStats.experienceCollected;
        
        if (totalCollected >= this.gameStats.totalCollectibles) {
            setTimeout(() => {
                this.uiSystem.showVictoryDialog(this.gameStats);
            }, 2000);
        }
    }
    
    showWelcomeDialog() {
        this.uiSystem.showWelcomeDialog();
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
            this.update();
            this.sceneManager.render();
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}
