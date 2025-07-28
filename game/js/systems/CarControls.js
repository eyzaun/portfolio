// Car Controls System - Simple and reliable input handling
export class CarControls {
    constructor() {
        // Raw key states
        this.keys = {
            accelerate: false,    // W or Up Arrow
            brake: false,         // S or Down Arrow  
            left: false,          // A or Left Arrow
            right: false,         // D or Right Arrow
            handbrake: false      // Space
        };
        
        // Processed input values (0 to 1)
        this.input = {
            throttle: 0,
            brake: 0,
            steering: 0,
            handbrake: false
        };
        
        // Input smoothing factor
        this.smoothing = 0.15;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log("Setting up car controls...");
        
        // Key down events
        window.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        // Key up events
        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }
    
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
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
                e.preventDefault(); // Prevent page scroll
                break;
            case 'escape':
                this.toggleMenu();
                break;
        }
    }
    
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
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
    }
    
    update() {
        // Update input values with smoothing
        this.updateThrottle();
        this.updateBrake();
        this.updateSteering();
        this.updateHandbrake();
    }
    
    updateThrottle() {
        const target = this.keys.accelerate ? 1 : 0;
        this.input.throttle += (target - this.input.throttle) * this.smoothing;
        
        // Clean up very small values
        if (Math.abs(this.input.throttle) < 0.01) {
            this.input.throttle = 0;
        }
    }
    
    updateBrake() {
        const target = this.keys.brake ? 1 : 0;
        this.input.brake += (target - this.input.brake) * this.smoothing;
        
        // Clean up very small values
        if (Math.abs(this.input.brake) < 0.01) {
            this.input.brake = 0;
        }
    }
    
    updateSteering() {
        let target = 0;
        
        if (this.keys.left) target = -1;   // Left is negative
        if (this.keys.right) target = 1;   // Right is positive
        
        // Faster steering response
        this.input.steering += (target - this.input.steering) * (this.smoothing * 3);
        
        // Clean up very small values
        if (Math.abs(this.input.steering) < 0.01) {
            this.input.steering = 0;
        }
    }
    
    updateHandbrake() {
        this.input.handbrake = this.keys.handbrake;
    }
    
    getInputState() {
        return {
            throttle: this.input.throttle,
            brake: this.input.brake,
            steering: this.input.steering,
            handbrake: this.input.handbrake
        };
    }
    
    toggleMenu() {
        const menuPanel = document.getElementById('menu-panel');
        if (menuPanel) {
            menuPanel.classList.toggle('hidden');
        }
    }
    
    // Debug method to check input states
    getDebugInfo() {
        return {
            keys: { ...this.keys },
            input: { ...this.input }
        };
    }
    
    // Reset all inputs
    reset() {
        this.keys.accelerate = false;
        this.keys.brake = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.handbrake = false;
        
        this.input.throttle = 0;
        this.input.brake = 0;
        this.input.steering = 0;
        this.input.handbrake = false;
    }
}
