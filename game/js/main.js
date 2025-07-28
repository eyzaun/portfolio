// Main Entry Point - Portfolio Drift Racing Game
// Developed by Eyüp Zafer ÜNAL

import { PortfolioDriftGame } from './Game.js';

console.log("Portfolio Drift Racing - Modular Version 4.0");
console.log("Initializing game modules...");

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing Portfolio Drift Game...");
    
    // Add a slight delay to ensure all resources are ready
    setTimeout(() => {
        try {
            window.gameInstance = new PortfolioDriftGame();
            console.log("Game instance created successfully!");
        } catch (error) {
            console.error("Failed to initialize game:", error);
            
            // Show user-friendly error message
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div class="loading-content">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f50057; margin-bottom: 20px;"></i>
                        <p style="color: #f50057; font-size: 18px; margin-bottom: 10px;">
                            Portfolio Drift oyunu başlatılamadı
                        </p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                            Hata: ${error.message}
                        </p>
                        <button onclick="window.location.reload()" 
                                style="margin: 10px; padding: 10px 20px; background: #f50057; 
                                       color: white; border: none; border-radius: 6px; cursor: pointer;
                                       font-size: 16px;">
                            <i class="fas fa-redo"></i> Yeniden Dene
                        </button>
                        <button onclick="window.location.href='../index.html'" 
                                style="margin: 10px; padding: 10px 20px; background: #666; 
                                       color: white; border: none; border-radius: 6px; cursor: pointer;
                                       font-size: 16px;">
                            <i class="fas fa-home"></i> Ana Sayfaya Dön
                        </button>
                    </div>
                `;
            }
        }
    }, 500);
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log("Portfolio Drift Game main.js loaded successfully");
