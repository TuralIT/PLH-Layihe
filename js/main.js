'use strict';

window.PROBIZ = window.PROBIZ || {};

/* --- 1. UI MODULE (Structure & Interaction) --- */
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    // Optional Search Elements (May not exist on all pages)
    const searchDropdown = document.getElementById('search-dropdown');
    const searchTrigger = document.getElementById('search-trigger');
    const searchInput = document.getElementById('dropdown-search-input');

    const init = () => {
        _bindScrollEvents();
        if (searchTrigger) _bindSearchEvents();
    };

    const _bindScrollEvents = () => {
        // Use passive listener for better scroll performance
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

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (searchDropdown && 
                searchDropdown.classList.contains('active') && 
                !searchDropdown.contains(e.target) && 
                !searchTrigger.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && searchDropdown) searchDropdown.classList.remove('active');
        });
    };

    return { init };
})();

/* --- 2. EFFECTS MODULE (Animations) --- */
PROBIZ.effects = (function() {
    const init = () => {
        _initAOS();
        _initCounters();
    };

    const _initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true });
        }
    };

    const _initCounters = () => {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; 
                    let startTimestamp = null;

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        const currentCount = Math.floor(progress * target);
                        
                        counter.innerText = currentCount.toLocaleString();

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    
                    window.requestAnimationFrame(step);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.25 });

        counters.forEach(counter => observer.observe(counter));
    };

    return { init };
})();

/* --- 3. ASSESSMENT ENGINE (Interactive Form) --- */
PROBIZ.assessment = (function() {
    
    // Public Interaction Methods
    const next = (step) => {
        _showStep(step);
    };

    const prev = (step) => {
        _showStep(step);
    };

    const selectOption = (btn, step) => {
        // Visual selection state
        const siblings = btn.parentElement.querySelectorAll('.choice-btn');
        siblings.forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        
        // Auto-advance
        setTimeout(() => next(step), 300);
    };

    // Private Helpers
    const _showStep = (step) => {
        // 1. Hide all active steps
        document.querySelectorAll('.assessment-step').forEach(el => el.classList.remove('active'));
        
        // 2. Show target step
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

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.effects.init();
});