// Main JavaScript functionality for the portfolio website

document.addEventListener("DOMContentLoaded", function() {
    // Custom cursor
    const cursor = document.querySelector(".cursor");
    
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
    
    document.addEventListener("mousedown", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });
    
    document.addEventListener("mouseup", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
    
    const links = document.querySelectorAll("a, button, .btn");
    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursor.style.borderColor = "var(--color-secondary)";
        });
        
        link.addEventListener("mouseleave", () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
            cursor.style.borderColor = "var(--color-primary)";
        });
    });
    
    // Hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav ul");
    
    hamburger.addEventListener("click", function() {
        this.classList.toggle("active");
        nav.classList.toggle("active");
        
        if (this.classList.contains("active")) {
            this.children[0].style.transform = "translateY(8px) rotate(45deg)";
            this.children[1].style.opacity = "0";
            this.children[2].style.transform = "translateY(-8px) rotate(-45deg)";
        } else {
            this.children[0].style.transform = "none";
            this.children[1].style.opacity = "1";
            this.children[2].style.transform = "none";
        }
    });
    
    // Smooth scroll for navigation
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: "smooth"
            });
            
            if (nav.classList.contains("active")) {
                hamburger.click();
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector("header");
    
    window.addEventListener("scroll", function() {
        if (this.scrollY > 100) {
            header.style.padding = "1rem 5rem";
            header.style.backgroundColor = "rgba(26, 26, 46, 0.95)";
        } else {
            header.style.padding = "2rem 5rem";
            header.style.backgroundColor = "rgba(26, 26, 46, 0.8)";
        }
    });
    
    // Skill bars animation
    const skillBars = document.querySelectorAll(".skill-progress span");
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const percent = bar.getAttribute("data-percent");
            bar.style.width = percent;
        });
    }
    
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains("skill-progress")) {
                    animateSkillBars();
                } else {
                    entry.target.classList.add("animate");
                }
            }
        });
    }, {threshold: 0.1});
    
    // Observe elements that need to be animated
    document.querySelectorAll(".skill-progress").forEach(el => {
        observer.observe(el);
    });
    
    document.querySelectorAll(".about-image, .project-card, .contact-container > div").forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });
    
    // Form submission handling
    const contactForm = document.querySelector(".contact-form form");
    
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Here you would normally send the form data to a server
        // For now, we'll just simulate a submission
        
        const submitButton = this.querySelector("button[type='submit']");
        const originalText = submitButton.textContent;
        
        submitButton.textContent = "Gönderiliyor...";
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.textContent = "Gönderildi!";
            this.reset();
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }, 1500);
    });
});

// Add fade-in animation for page elements
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("loaded");
});
