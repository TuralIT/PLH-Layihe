document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    AOS.init({ duration: 800, once: true });

    // 2. Reading Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-progress").style.width = scrolled + "%";
    });

    // 3. Counter-Up Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1500);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Only animate once
            }
        });
    };

    const observer = new IntersectionObserver(startCounter, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));

    // FLOATING DROPDOWN SEARCH LOGIC
    const searchTrigger = document.querySelector('.bi-search').parentElement;
    const searchDropdown = document.getElementById('search-dropdown');
    const searchInput = document.getElementById('dropdown-search-input');

    searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents immediate closing
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
});