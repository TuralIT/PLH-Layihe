'use strict';

window.PROBIZ = window.PROBIZ || {};

/* --- 1. UI MODULE (Structure & Interaction) --- */
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchTrigger = document.getElementById('search-trigger');
    const searchInput = document.getElementById('dropdown-search-input');

    const init = () => {
        _bindScrollEvents();
        _bindSearchEvents();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            // Navbar Transition
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            // Reading Progress Bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById("scroll-progress");
            if(progressBar) progressBar.style.width = scrolled + "%";
        });
    };

    const _bindSearchEvents = () => {
        if (!searchTrigger || !searchDropdown) return;

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
            if (!searchDropdown.contains(e.target) && !searchTrigger.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") searchDropdown.classList.remove('active');
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
        // Optimized IntersectionObserver for Counters (if any exist on page)
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const speed = 200;
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    
                    const updateCount = () => {
                        const count = +counter.innerText;
                        const inc = target / speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

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
        setTimeout(() => {
            next(step);
        }, 300);
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
    // Assessment engine is lazy-loaded via user interaction, no init needed
});