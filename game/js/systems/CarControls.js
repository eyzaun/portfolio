// Car Controls System - Handles input and key states
export class CarControls {
    constructor() {
        this.keys = {
            accelerate: false,
            brake: false,
            left: false,
            right: false,
            handbrake: false
        };
        
        // Input smoothing for better control feel
        this.inputSmoothing = {
            throttle: 0,
            brake: 0,
            steering: 0
        };
        
        this.smoothingFactor = 0.15;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log("Setting up car controls...");
        
        // Keyboard down events
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
        
        // Keyboard up events
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
    
    update() {
        // Update input smoothing for better control feel
        this.updateInputSmoothing();
    }
    
    updateInputSmoothing() {
        // Throttle input
        const targetThrottle = this.keys.accelerate ? 1 : 0;
        this.inputSmoothing.throttle += (targetThrottle - this.inputSmoothing.throttle) * this.smoothingFactor;
        
        // Brake input
        const targetBrake = this.keys.brake ? 1 : 0;
        this.inputSmoothing.brake += (targetBrake - this.inputSmoothing.brake) * this.smoothingFactor;
        
        // Steering input (corrected directions)
        let targetSteering = 0;
        if (this.keys.left) targetSteering = -1;  // Left should be negative
        if (this.keys.right) targetSteering = 1;   // Right should be positive
        this.inputSmoothing.steering += (targetSteering - this.inputSmoothing.steering) * this.smoothingFactor * 2;
    }
    
    getInputState() {
        return {
            throttle: this.inputSmoothing.throttle,
            brake: this.inputSmoothing.brake,
            steering: this.inputSmoothing.steering,
            handbrake: this.keys.handbrake,
            rawKeys: { ...this.keys }
        };
    }
    
    toggleMenu() {
        const menuPanel = document.getElementById('menu-panel');
        if (menuPanel) {
            menuPanel.classList.toggle('hidden');
        }
    }
    
    // Helper methods for external access
    isAccelerating() {
        return this.keys.accelerate;
    }
    
    isBraking() {
        return this.keys.brake;
    }
    
    isTurningLeft() {
        return this.keys.left;
    }
    
    isTurningRight() {
        return this.keys.right;
    }
    
    isHandbraking() {
        return this.keys.handbrake;
    }
}
