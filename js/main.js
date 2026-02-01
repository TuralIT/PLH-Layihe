'use strict';

window.PROBIZ = window.PROBIZ || {};

/* --- 1. UI MODULE (Structure & Interaction) --- */
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    // Optional Search Elements
    const searchDropdown = document.getElementById('search-dropdown');
    const searchTrigger = document.getElementById('search-trigger');
    const searchInput = document.getElementById('dropdown-search-input');

    const init = () => {
        _bindScrollEvents();
        if (searchTrigger) _bindSearchEvents();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Navbar Transition
            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            // Reading Progress Bar
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }
        }, { passive: true });
    };

    const _bindSearchEvents = () => {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            searchDropdown.classList.toggle('active');
            if (searchDropdown.classList.contains('active')) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });

        document.addEventListener('click', (e) => {
            if (searchDropdown && 
                searchDropdown.classList.contains('active') && 
                !searchDropdown.contains(e.target) && 
                !searchTrigger.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && searchDropdown) searchDropdown.classList.remove('active');
        });
    };

    return { init };
})();

/* --- 2. MOTION MODULE (GSAP & Lenis) --- */
PROBIZ.motion = (function() {
    
    // Config
    const isMobile = window.innerWidth < 992;
    let heroSliderInterval;

    const init = () => {
        if (typeof gsap === 'undefined') {
            console.warn('PROBIZ: GSAP not loaded. Motion module disabled.');
            return;
        }

        _initLenis();
        _registerGSAP();

        // Animations
        _heroCarousel(); // Replaces single hero sequence
        _processPinning(); // New Scroll Process
        _scrollReveals();
        _initCounters();

        if (!isMobile) {
            _magneticInteractions();
        }
    };

    const _initLenis = () => {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            lerp: 0.05,             
            wheelMultiplier: 0.9,   
            smoothWheel: true,
            wrapper: window,        
            content: document.body 
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    };

    const _registerGSAP = () => {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.defaults({ ease: "power3.out", duration: 1.0 });
        }
    };

    // NEW: Hero Carousel Logic
    const _heroCarousel = () => {
        const slides = document.querySelectorAll('.hero-slide');
        const nextBtn = document.getElementById('nextSlide');
        const prevBtn = document.getElementById('prevSlide');
        let currentIndex = 0;
        let isAnimating = false;

        // Initial Animate In (First Slide)
        _animateSlideContent(slides[0]);

        const changeSlide = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const currentSlide = slides[currentIndex];
            let nextIndex = (direction === 'next') ? currentIndex + 1 : currentIndex - 1;

            if (nextIndex >= slides.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = slides.length - 1;

            const nextSlide = slides[nextIndex];

            // Timeline for transition
            const tl = gsap.timeline({
                onComplete: () => {
                    currentIndex = nextIndex;
                    isAnimating = false;
                    currentSlide.classList.remove('active');
                    nextSlide.classList.add('active');
                }
            });

            // Reset next slide content for animation
            gsap.set(nextSlide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns'), { 
                y: 30, autoAlpha: 0 
            });

            // 1. Crossfade Backgrounds
            tl.to(currentSlide, { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" })
              .to(nextSlide, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, "-=1.2");

            // 2. Animate Content In
            // We use a helper function to animate internal elements
             tl.add(_getSlideContentTween(nextSlide), "-=0.8");

        };

        // Helper to return tween for slide content
        const _getSlideContentTween = (slide) => {
            const tl = gsap.timeline();
            const elements = slide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            
            tl.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
            return tl;
        };

        // Helper for initial load
        function _animateSlideContent(slide) {
            const elements = slide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            gsap.set(elements, { y: 30, autoAlpha: 0 }); // Ensure hidden first
            gsap.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                stagger: 0.15,
                delay: 0.5
            });
        }

        // Binds
        if (nextBtn) nextBtn.addEventListener('click', () => {
            clearInterval(heroSliderInterval);
            changeSlide('next');
            _startAutoPlay();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            clearInterval(heroSliderInterval);
            changeSlide('prev');
            _startAutoPlay();
        });

        // Auto Play
        const _startAutoPlay = () => {
            heroSliderInterval = setInterval(() => changeSlide('next'), 6000);
        };
        _startAutoPlay();
    };

    // NEW: Scroll Process Pinning (Sequential Reveal)
    const _processPinning = () => {
        if (typeof ScrollTrigger === 'undefined') return;

        const pinContainer = document.querySelector('.protocol-pin-container');
        const cards = document.querySelectorAll('.protocol-stack-card');

        if (!pinContainer || cards.length === 0) return;

        // 1. Initial State: Hide all cards (Push them down)
        // We do this in JS so if JS fails, CSS keeps them visible (Progressive Enhancement)
        gsap.set(cards, { y: "150%" }); 
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                start: "top top",
                end: "+=400%", // Reduced slightly for better pacing
                pin: true,
                scrub: 1, 
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        // Step 1: Animate Card 1 Up
        tl.to('.protocol-stack-card.card-1', { 
            y: "0%", 
            ease: "power1.inOut", // Smoother easing
            duration: 1 
        })
        // Step 2: Animate Card 2 Up
        .to('.protocol-stack-card.card-2', { 
            y: "0%", 
            ease: "power1.inOut", 
            duration: 1 
        })
        // Step 3: Animate Card 3 Up
        .to('.protocol-stack-card.card-3', { 
            y: "0%", 
            ease: "power1.inOut", 
            duration: 1 
        });
    };

    const _scrollReveals = () => {
        const revealElements = document.querySelectorAll('.class-to-animate, .row.mb-5');

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

        _staggerReveal('.result-card-gsap', 0.15);
        _staggerReveal('.attorney-card-gsap', 0.2);
    };

    const _staggerReveal = (targetClass, staggerAmount) => {
        if (typeof ScrollTrigger === 'undefined') return;

        ScrollTrigger.batch(targetClass, {
            onEnter: batch => gsap.fromTo(batch, 
                { y: 60, autoAlpha: 0 }, 
                { 
                    y: 0, autoAlpha: 1, 
                    stagger: staggerAmount, 
                    overwrite: true 
                }
            ),
            start: "top 85%",
            once: true 
        });
    };

    const _initCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: "top 90%",
                    once: true
                },
                onUpdate: function() {
                    this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText).toLocaleString();
                }
            });
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

PROBIZ.assessment = (function() {
    const next = (step) => _showStep(step);
    const prev = (step) => _showStep(step);
    const selectOption = (btn, step) => {
        const siblings = btn.parentElement.querySelectorAll('.choice-btn');
        siblings.forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        setTimeout(() => next(step), 300);
    };
    const _showStep = (step) => {
        document.querySelectorAll('.assessment-step').forEach(el => el.classList.remove('active'));
        const target = document.querySelector(`.assessment-step[data-step="${step}"]`);
        if (target) {
            target.classList.add('active');
            _updateDots(step);
        }
    };
    const _updateDots = (step) => {
        document.querySelectorAll('.step-dot').forEach(dot => {
            const s = parseInt(dot.getAttribute('data-step'));
            dot.classList.remove('active', 'completed');
            if (s === step) dot.classList.add('active');
            if (s < step) dot.classList.add('completed');
        });
    };
    return { next, prev, selectOption };
})();

document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.motion.init(); 
});