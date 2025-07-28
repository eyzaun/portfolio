// UI System - Handles all game UI updates and dialogs
export class UISystem {
    constructor(gameStats) {
        this.gameStats = gameStats;
        
        // UI elements cache
        this.progressFill = document.getElementById('progress-fill');
        this.itemsDisplay = document.getElementById('code-fragments');
        this.progressLabel = document.querySelector('.progress-label');
        this.controlsHint = document.querySelector('.controls-hint p');
        this.storyDialog = document.getElementById('story-dialog');
        this.dialogTitle = document.getElementById('dialog-title');
        this.dialogText = document.getElementById('dialog-text');
        this.menuPanel = document.getElementById('menu-panel');
    }
    
    updateUI() {
        const totalCollected = this.gameStats.projectsCollected + 
                              this.gameStats.skillsCollected + 
                              this.gameStats.experienceCollected;
        
        const progress = (totalCollected / this.gameStats.totalCollectibles) * 100;
        
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        // Update items collected display
        if (this.itemsDisplay) {
            this.itemsDisplay.textContent = `${totalCollected}/${this.gameStats.totalCollectibles}`;
        }
    }
    
    updateSpeedDisplay(speed, isDrifting) {
        if (!this.controlsHint) return;
        
        const displaySpeed = Math.floor(speed * 200);
        
        if (isDrifting) {
            this.controlsHint.innerHTML = 
                `<strong>🔥 DRIFT! Speed: ${displaySpeed} km/h | WASD - Hareket | SPACE - Drift | ESC - Menü</strong>`;
        } else {
            this.controlsHint.innerHTML = 
                `<strong>Speed: ${displaySpeed} km/h | WASD - Hareket | SPACE - Drift | ESC - Menü</strong>`;
        }
    }
    
    updateDriftDisplay(isDrifting, driftScore) {
        if (!this.progressLabel) return;
        
        const totalCollected = this.gameStats.projectsCollected + 
                              this.gameStats.skillsCollected + 
                              this.gameStats.experienceCollected;
        
        if (isDrifting && driftScore > 50) {
            this.progressLabel.textContent = 
                `🔥 DRIFT COMBO: ${Math.floor(driftScore)} | Portfolio: ${totalCollected}/${this.gameStats.totalCollectibles}`;
        } else {
            this.progressLabel.textContent = 'Portfolio Toplama İlerlemesi';
        }
    }
    
    showCollectionDialog(itemData) {
        if (!this.storyDialog || !this.dialogTitle || !this.dialogText) return;
        
        this.dialogTitle.textContent = `${itemData.name} Toplandı!`;
        
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
        
        this.dialogText.textContent = description;
        this.storyDialog.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideDialog();
        }, 3000);
    }
    
    showWelcomeDialog() {
        if (!this.storyDialog || !this.dialogTitle || !this.dialogText) return;
        
        this.dialogTitle.textContent = 'Portfolio Drift Racing\'e Hoş Geldin!';
        this.dialogText.textContent = 'Merhaba! Ben Eyüp Zafer ÜNAL. Bu oyunda arabamla drift atarak CV\'mdeki projeleri, yetenekleri ve deneyimleri toplamalısın. WASD ile sür, SPACE ile drift yap!';
        
        this.storyDialog.classList.remove('hidden');
    }
    
    showVictoryDialog(gameStats) {
        if (!this.storyDialog || !this.dialogTitle || !this.dialogText) return;
        
        this.dialogTitle.textContent = 'Tebrikler! 🎉';
        this.dialogText.textContent = 
            `Tüm portfolio öğelerini topladın! Toplam skor: ${gameStats.score} puan. ` +
            `Drift skoru: ${Math.floor(gameStats.driftScore)}. Artık portfolyoma göz atabilirsin!`;
        
        this.storyDialog.classList.remove('hidden');
    }
    
    hideDialog() {
        if (this.storyDialog) {
            this.storyDialog.classList.add('hidden');
        }
    }
    
    toggleMenu() {
        if (this.menuPanel) {
            this.menuPanel.classList.toggle('hidden');
        }
    }
    
    showMessage(title, message, duration = 3000) {
        if (!this.dialogTitle || !this.dialogText || !this.storyDialog) return;
        
        this.dialogTitle.textContent = title;
        this.dialogText.textContent = message;
        this.storyDialog.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideDialog();
            }, duration);
        }
    }
    
    updateCollectionStats(type) {
        switch(type) {
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
        this.updateUI();
    }
    
    // Debug methods
    showDebugInfo(info) {
        const debugElement = document.getElementById('debug-info');
        if (debugElement) {
            debugElement.textContent = JSON.stringify(info, null, 2);
        }
    }
    
    getUIState() {
        return {
            totalCollected: this.gameStats.projectsCollected + 
                           this.gameStats.skillsCollected + 
                           this.gameStats.experienceCollected,
            totalCollectibles: this.gameStats.totalCollectibles,
            score: this.gameStats.score,
            driftScore: this.gameStats.driftScore
        };
    }
}
