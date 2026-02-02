'use strict';

window.PROBIZ = window.PROBIZ || {};

/* --- 1. UI MODULE --- */
PROBIZ.ui = (function() {
    // Cache DOM Elements
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    const init = () => {
        _bindScrollEvents();
        _initTestimonials();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // 1. Navbar Glassmorphism Transition
            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            // 2. Reading Progress Bar (Top of screen)
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }

            // 3. Mobile Sticky CTA Visibility
            const mobileCTA = document.querySelector('.mobile-sticky-cta');
            if (mobileCTA) {
                if (scrollY > 300) mobileCTA.classList.add('cta-visible');
                else mobileCTA.classList.remove('cta-visible');
            }
        }, { passive: true });
    };

    /**
     * Clones testimonial cards for infinite marquee effect.
     * Removes the need for manual HTML duplication.
     */
    const _initTestimonials = () => {
        const track = document.querySelector('.marquee-track-right');
        if (!track) return;

        // Clone all children to ensure seamless loop
        const items = Array.from(track.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
        
        // Clone one more set for extra wide screens if needed
         items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    };

    return { init };
})();

/* --- 2. MOTION MODULE (GSAP & Lenis) --- */
/**
 * Manages all GSAP animations and smooth scrolling.
 * Checks for library existence to prevent runtime errors.
 */
PROBIZ.motion = (function() {
    const isMobile = window.innerWidth < 992;
    let heroSliderInterval;

    const init = () => {
        // Safety Check: Ensure GSAP is loaded via local libraries
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('PROBIZ Motion: GSAP or ScrollTrigger not found. Animations disabled.');
            return;
        }

        _initLenis();
        _registerGSAP();

        // Initialize Sequences
        _heroCarousel();      // Hero Slider Logic
        _processPinning();    // Protocol Section (Scroll Pinning)
        _scrollReveals();     // Standard Fade-ins
        _initCounters();      // Number Counting

        // Desktop Only: Magnetic Buttons
        if (!isMobile) {
            _magneticInteractions();
        }
    };

    /**
     * Initialize Lenis Smooth Scrolling.
     */
    const _initLenis = () => {
        if (typeof Lenis === 'undefined' || isMobile) return;

        const lenis = new Lenis({
            lerp: 0.05,             // Lower = Smoother, Higher = More responsive
            wheelMultiplier: 0.9,   
            smoothWheel: true,
            wrapper: window,        
            content: document.body 
        });

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Standardize time for Lenis
        });
        gsap.ticker.lagSmoothing(0);
    };

    const _registerGSAP = () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: "power3.out", duration: 1.0 });
    };

    /**
     * Hero Section Custom Carousel.
     * Manages slide transitions, text reveals, and auto-play.
     */
    const _heroCarousel = () => {
        const slides = document.querySelectorAll('.hero-slide');
        const nextBtn = document.getElementById('nextSlide');
        const prevBtn = document.getElementById('prevSlide');
        
        if (!slides.length) return;

        let currentIndex = 0;
        let isAnimating = false;

        // Animate first slide on load
        _animateSlideContent(slides[0]);

        const changeSlide = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const currentSlide = slides[currentIndex];
            let nextIndex = (direction === 'next') ? currentIndex + 1 : currentIndex - 1;

            // Loop logic
            if (nextIndex >= slides.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = slides.length - 1;

            const nextSlide = slides[nextIndex];

            // 1. Set Initial State for Incoming Slide (Hidden/Offset)
            gsap.set(nextSlide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns'), { 
                y: 30, autoAlpha: 0 
            });

            // 2. Timeline Sequence
            const tl = gsap.timeline({
                onComplete: () => {
                    currentIndex = nextIndex;
                    isAnimating = false;
                    currentSlide.classList.remove('active');
                    nextSlide.classList.add('active');
                }
            });

            // Crossfade Slides
            tl.to(currentSlide, { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" })
              .to(nextSlide, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, "-=1.2");

            // Animate Text Elements (Staggered)
            const elements = nextSlide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            tl.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.8");
        };

        // Helper: Initial Slide Animation
        function _animateSlideContent(slide) {
            const elements = slide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            gsap.set(elements, { y: 30, autoAlpha: 0 });
            gsap.to(elements, {
                y: 0, autoAlpha: 1, duration: 1, stagger: 0.15, delay: 0.5
            });
        }

        // Event Listeners
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

        const _startAutoPlay = () => {
            heroSliderInterval = setInterval(() => changeSlide('next'), 6000);
        };
        _startAutoPlay();
    };

    /**
     * Protocol Section Pinning.
     * Pins the left column and reveals cards one by one on scroll.
     */
    const _processPinning = () => {
        const pinContainer = document.querySelector('.protocol-pin-container');
        const cards = document.querySelectorAll('.protocol-stack-card');
        
        if (!pinContainer || cards.length === 0) return;

        // Move cards off-screen (down)
        const offset = isMobile ? "150%" : "175%";
        gsap.set(cards, { y: offset, autoAlpha: 1 }); 
        
        // Define ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                start: "top top", // Start immediately when section hits top
                end: isMobile ? "+=300%" : "+=200%", // Duration of the pin (how long to stay)
                pin: true,       // Pin the container
                scrub: 1,        // Smooth scrubbing
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // Lift each card into view
        cards.forEach((card, index) => {
            tl.to(card, { 
                y: "0%", 
                ease: "power1.inOut", 
                duration: 1 
            });
        });
    };

    /**
     * Standard fade-up reveals for sections.
     */
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

        // Staggered reveals for grids
        _staggerReveal('.result-card-gsap', 0.15);
        _staggerReveal('.attorney-card-gsap', 0.2);
    };

    const _staggerReveal = (targetClass, staggerAmount) => {
        ScrollTrigger.batch(targetClass, {
            onEnter: batch => gsap.fromTo(batch, 
                { y: 60, autoAlpha: 0 }, 
                { y: 0, autoAlpha: 1, stagger: staggerAmount, overwrite: true }
            ),
            start: "top 85%",
            once: true 
        });
    };

    const _initCounters = () => {
        document.querySelectorAll('.counter').forEach(counter => {
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
                    // Format number with commas during animation
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



// App Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.motion.init(); 
});