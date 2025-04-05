// Three.js animation for the portfolio website

document.addEventListener("DOMContentLoaded", function() {
    // Scene setup
    const canvas = document.getElementById('canvas-container');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvas.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 30;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 60;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x6c63ff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add some lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xf50057, 0.8);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    // Create a ring / torus
    const torusGeometry = new THREE.TorusGeometry(10, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6c63ff,
        wireframe: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    
    // Create a second torus
    const torus2Geometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const torus2Material = new THREE.MeshBasicMaterial({ 
        color: 0xf50057,
        wireframe: true
    });
    const torus2 = new THREE.Mesh(torus2Geometry, torus2Material);
    torus2.rotation.x = Math.PI / 2;
    scene.add(torus2);
    
    // Mouse effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        
        // Mouse movement effect
        particlesMesh.rotation.y += mouseX * 0.001;
        particlesMesh.rotation.x += mouseY * 0.001;
        
        // Rotate torus
        torus.rotation.x += 0.003;
        torus.rotation.y += 0.002;
        torus.rotation.z += 0.001;
        
        // Rotate second torus
        torus2.rotation.x += 0.002;
        torus2.rotation.y += 0.003;
        torus2.rotation.z += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
});
