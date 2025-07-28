// Collectible Manager - Handles portfolio collectibles
export class CollectibleManager {
    constructor(scene, portfolioData) {
        this.scene = scene;
        this.portfolioData = portfolioData;
        this.collectibles = [];
        
        this.createCollectibles();
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
            
            this.positionCollectible(collectible, index, this.portfolioData.projects.length, 30);
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
            
            this.positionCollectible(collectible, index, this.portfolioData.skills.length, 15);
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
            
            this.positionCollectible(collectible, index, this.portfolioData.experiences.length, 50);
            this.collectibles.push(collectible);
            this.scene.add(collectible);
        });
    }
    
    createCollectible(name, subtitle, color, type, points) {
        const group = new THREE.Group();
        
        // Main collectible shape - more varied based on type
        const geometry = this.getCollectibleGeometry(type);
        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        group.add(mesh);
        
        // Add glow effect
        this.addGlowEffect(group, color);
        
        // Add floating sparkles
        this.addSparkles(group, color);
        
        // Store metadata
        group.userData = {
            name: name,
            subtitle: subtitle,
            type: type,
            points: points,
            collected: false,
            originalY: 2,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: 0.02 + Math.random() * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        
        return group;
    }
    
    getCollectibleGeometry(type) {
        switch(type) {
            case 'project':
                return new THREE.OctahedronGeometry(1.5);
            case 'skill':
                return new THREE.IcosahedronGeometry(1.2);
            case 'experience':
                return new THREE.DodecahedronGeometry(1.3);
            default:
                return new THREE.SphereGeometry(1.2);
        }
    }
    
    addGlowEffect(group, color) {
        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(2.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
    }
    
    addSparkles(group, color) {
        // Small sparkle particles around the collectible
        for (let i = 0; i < 6; i++) {
            const sparkleGeometry = new THREE.SphereGeometry(0.1);
            const sparkleMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
            
            // Random position around the main collectible
            const angle = (i / 6) * Math.PI * 2;
            const radius = 2.5 + Math.random() * 0.5;
            sparkle.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * radius
            );
            
            sparkle.userData = {
                orbitSpeed: 0.01 + Math.random() * 0.01,
                orbitRadius: radius,
                orbitAngle: angle,
                bobSpeed: 0.02 + Math.random() * 0.01
            };
            
            group.add(sparkle);
        }
    }
    
    positionCollectible(collectible, index, total, radius) {
        const angle = (index / total) * Math.PI * 2;
        collectible.position.set(
            Math.cos(angle) * radius,
            2,
            Math.sin(angle) * radius
        );
    }
    
    update() {
        this.collectibles.forEach(collectible => {
            if (!collectible.userData.collected) {
                this.animateCollectible(collectible);
            }
        });
    }
    
    animateCollectible(collectible) {
        const userData = collectible.userData;
        const time = Date.now() * 0.001;
        
        // Floating animation
        collectible.position.y = userData.originalY + 
            Math.sin(time * 3 + userData.floatOffset) * 0.5;
        
        // Rotation animation
        collectible.rotation.x += userData.rotationSpeed.x;
        collectible.rotation.y += userData.rotationSpeed.y;
        collectible.rotation.z += userData.rotationSpeed.z;
        
        // Animate sparkles
        this.animateSparkles(collectible, time);
        
        // Pulse glow effect
        this.animateGlow(collectible, time);
    }
    
    animateSparkles(collectible, time) {
        collectible.children.forEach((child, index) => {
            if (index > 1 && child.userData.orbitSpeed) { // Skip main mesh and glow
                const sparkleData = child.userData;
                
                // Orbit animation
                sparkleData.orbitAngle += sparkleData.orbitSpeed;
                child.position.x = Math.cos(sparkleData.orbitAngle) * sparkleData.orbitRadius;
                child.position.z = Math.sin(sparkleData.orbitAngle) * sparkleData.orbitRadius;
                
                // Bobbing animation
                child.position.y = Math.sin(time * sparkleData.bobSpeed * 10) * 0.3;
                
                // Opacity pulse
                child.material.opacity = 0.5 + Math.sin(time * 5 + sparkleData.orbitAngle) * 0.3;
            }
        });
    }
    
    animateGlow(collectible, time) {
        if (collectible.children[1]) { // Glow effect
            const glow = collectible.children[1];
            glow.material.opacity = 0.05 + Math.sin(time * 2) * 0.05;
            glow.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
        }
    }
    
    collectItem(index) {
        if (index >= 0 && index < this.collectibles.length) {
            const collectible = this.collectibles[index];
            collectible.userData.collected = true;
            
            // Collection animation
            this.playCollectionAnimation(collectible);
        }
    }
    
    playCollectionAnimation(collectible) {
        // Scale down animation
        const scaleAnimation = () => {
            collectible.scale.multiplyScalar(0.95);
            
            if (collectible.scale.x > 0.1) {
                requestAnimationFrame(scaleAnimation);
            } else {
                collectible.visible = false;
            }
        };
        
        scaleAnimation();
        
        // Sparkle burst effect
        this.createCollectionBurst(collectible);
    }
    
    createCollectionBurst(collectible) {
        const burstParticles = [];
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshBasicMaterial({
                    color: collectible.children[0].material.color,
                    transparent: true,
                    opacity: 1
                })
            );
            
            particle.position.copy(collectible.position);
            
            // Random burst direction
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random(),
                (Math.random() - 0.5) * 2
            ).normalize();
            
            particle.userData = {
                velocity: direction.multiplyScalar(Math.random() * 5 + 2),
                life: 1.0
            };
            
            this.scene.add(particle);
            burstParticles.push(particle);
        }
        
        // Animate burst particles
        const animateBurst = () => {
            burstParticles.forEach((particle, index) => {
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                particle.position.add(particle.userData.velocity);
                particle.userData.velocity.multiplyScalar(0.98);
                
                if (particle.userData.life <= 0) {
                    this.scene.remove(particle);
                    burstParticles.splice(index, 1);
                }
            });
            
            if (burstParticles.length > 0) {
                requestAnimationFrame(animateBurst);
            }
        };
        
        animateBurst();
    }
    
    getCollectibles() {
        return this.collectibles;
    }
    
    getCollectibleCount() {
        return this.collectibles.length;
    }
    
    getCollectedCount() {
        return this.collectibles.filter(c => c.userData.collected).length;
    }
    
    reset() {
        this.collectibles.forEach(collectible => {
            collectible.userData.collected = false;
            collectible.visible = true;
            collectible.scale.set(1, 1, 1);
        });
    }
    
    dispose() {
        this.collectibles.forEach(collectible => {
            this.scene.remove(collectible);
            
            collectible.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    child.material.dispose();
                }
            });
        });
        
        this.collectibles = [];
    }
}
