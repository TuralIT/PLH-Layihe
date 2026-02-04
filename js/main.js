'use strict';

window.PROBIZ = window.PROBIZ || {};

PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    const init = () => {
        _bindScrollEvents();
        _initTestimonials();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }

            const mobileCTA = document.querySelector('.mobile-sticky-cta');
            if (mobileCTA) {
                if (scrollY > 300) mobileCTA.classList.add('cta-visible');
                else mobileCTA.classList.remove('cta-visible');
            }
        }, { passive: true });
    };

    const _initTestimonials = () => {
        const track = document.querySelector('.marquee-track-right');
        if (!track) return;

        const items = Array.from(track.children);
        
        for (let i = 0; i < 2; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
        }
    };

    return { init };
})();

PROBIZ.motion = (function() {
    const isMobile = window.innerWidth < 992;
    let heroSliderInterval;

    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('PROBIZ Motion: GSAP or ScrollTrigger not found. Animations disabled.');
            return;
        }

        _initLenis();
        _registerGSAP();

        _heroCarousel();
        _processPinning();
        _scrollReveals();


        if (!isMobile) {
            _magneticInteractions();
        }
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

    const _heroCarousel = () => {
        const slides = document.querySelectorAll('.hero-slide');
        const nextBtn = document.getElementById('nextSlide');
        const prevBtn = document.getElementById('prevSlide');
        
        if (!slides.length) return;

        let currentIndex = 0;
        let isAnimating = false;

        _animateSlideContent(slides[0]);

        const changeSlide = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const currentSlide = slides[currentIndex];
            let nextIndex = (direction === 'next') ? currentIndex + 1 : currentIndex - 1;

            if (nextIndex >= slides.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = slides.length - 1;

            const nextSlide = slides[nextIndex];

            gsap.set(nextSlide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns'), { 
                y: 30, autoAlpha: 0 
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    currentIndex = nextIndex;
                    isAnimating = false;
                    currentSlide.classList.remove('active');
                    nextSlide.classList.add('active');
                }
            });

            tl.to(currentSlide, { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" })
              .to(nextSlide, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, "-=1.2");

            const elements = nextSlide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            tl.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.8");
        };

        function _animateSlideContent(slide) {
            const elements = slide.querySelectorAll('.slide-badge, .slide-title, .slide-desc, .slide-btns');
            gsap.set(elements, { y: 30, autoAlpha: 0 });
            gsap.to(elements, {
                y: 0, autoAlpha: 1, duration: 1, stagger: 0.15, delay: 0.5
            });
        }

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
            heroSliderInterval = setInterval(() => changeSlide('next'), 3800);
        };
        _startAutoPlay();
    };

    const _processPinning = () => {
        const pinContainer = document.querySelector('.protocol-pin-container');
        const cards = document.querySelectorAll('.protocol-stack-card');
        
        if (!pinContainer || cards.length === 0) return;

        const offset = isMobile ? "150%" : "175%";
        gsap.set(cards, { y: offset, autoAlpha: 1 }); 
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinContainer,
                start: "top top",
                end: isMobile ? "+=300%" : "+=200%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        cards.forEach((card) => {
            tl.to(card, { 
                y: "0%", 
                ease: "power1.inOut", 
                duration: 1 
            });
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
    PROBIZ.ui.init();
    PROBIZ.motion.init(); 
});