'use strict';

window.PROBIZ = window.PROBIZ || {};

PROBIZ.team = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");
    const isMobile = window.innerWidth < 992;

    const init = () => {
        _bindScrollEvents();
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            _initLenis();
            _registerGSAP();
            _initAnimations();
            
            if (!isMobile) {
                _magneticInteractions();
            }
        }
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Navbar scroll effect
            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            // Scroll progress bar
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }

            // Mobile CTA visibility
            const mobileCTA = document.querySelector('.mobile-sticky-cta');
            if (mobileCTA) {
                if (scrollY > 300) mobileCTA.classList.add('cta-visible');
                else mobileCTA.classList.remove('cta-visible');
            }
        }, { passive: true });
    };

    const _initLenis = () => {
        if (typeof Lenis === 'undefined' || isMobile) return;

        const lenis = new Lenis({
            lerp: 0.05,
            wheelMultiplier: 0.9,   
            smoothWheel: true,
            wrapper: window,        
            content: document.body 
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    };

    const _registerGSAP = () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: "power3.out", duration: 1.0 });
    };

    const _initAnimations = () => {
        // Hero Content Reveal
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-desc');
        if (heroElements.length > 0) {
            gsap.fromTo(heroElements, 
                { y: 30, autoAlpha: 0 },
                { 
                    y: 0, 
                    autoAlpha: 1, 
                    duration: 1.2, 
                    stagger: 0.2,
                    ease: "power3.out",
                    delay: 0.2
                }
            );
        }

        // Standard Scroll Reveals
        const revealElements = document.querySelectorAll('.class-to-animate');
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { y: 60, autoAlpha: 0 },
                {
                    y: 0, autoAlpha: 1,
                    duration: 1.1,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none" 
                    }
                }
            );
        });

        // Staggered Team Cards Reveal
        ScrollTrigger.batch('.team-card-gsap', {
            onEnter: batch => gsap.fromTo(batch, 
                { y: 60, autoAlpha: 0 }, 
                { y: 0, autoAlpha: 1, stagger: 0.15, overwrite: true }
            ),
            start: "top 85%",
            once: true 
        });
    };

    const _magneticInteractions = () => {
        const buttons = document.querySelectorAll('.btn-accent, .btn-outline-white');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
            });
        });
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.team.init();
});
