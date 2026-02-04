/**
 * PROBIZ Team Page Logic
 * Executive Profile Edition
 */

// --- 1. Team Data (Global Scope for reliability) ---
const teamData = [
    {
        id: 1,
        name: "Leyla Həsənova",
        role: "UI/UX Dizayner",
        category: "design",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
        subtitle: "Kreativ Rəhbər & Dizayn Sistemləri Memarı",
        bio: "Leyla, mürəkkəb hüquqi prosesləri intuitiv rəqəmsal təcrübələrə çevirmək üzrə ixtisaslaşmışdır. Onun dizayn fəlsəfəsi 'Funksional Estetika' üzərində qurulub.",
        skills: ["Figma", "User Research", "Prototyping", "Interaction Design"],
        stats: [
            { label: "Təcrübə", value: "8 İl" },
            { label: "Layihələr", value: "140+" },
            { label: "Mükafatlar", value: "3" }
        ]
    },
    {
        id: 2,
        name: "Tural Vəliyev",
        role: "Full-Stack Proqramçı",
        category: "tech",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        subtitle: "Texniki İnfrastruktur və Təhlükəsizlik",
        bio: "Tural, PROBIZ-in texniki onurğa sütununu idarə edir. O, həm server tərəfli (Backend) arxitekturanın, həm də müştəri tərəfli (Frontend) interfeyslərin qüsursuz işləməsini təmin edir.",
        skills: ["React & Node.js", "System Architecture", "API Security", "Database Design"],
        stats: [
            { label: "Kod Sətri", value: "500K+" },
            { label: "Uptime", value: "99.9%" },
            { label: "Stack", value: "MERN" }
        ]
    },
    {
        id: 3,
        name: "Nərgiz Quliyeva",
        role: "Məzmun Strateqi",
        category: "design",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
        subtitle: "Hüquqi Kommunikasiya və Brend Səsi",
        bio: "Sözlərin gücü ilə mürəkkəb hüquqi anlayışları sadə dilə çevirir. Nərgiz, şirkətimizin bütün kommunikasiya kanallarında vahid və peşəkar səs tonunu qoruyur.",
        skills: ["Copywriting", "SEO", "Brand Storytelling", "Content Strategy"],
        stats: [
            { label: "Məqalələr", value: "350+" },
            { label: "Dil", value: "AZ/EN/RU" },
            { label: "SEO Rating", value: "A+" }
        ]
    },
    {
        id: 4,
        name: "Elvin Məmmədov",
        role: "Pro Kitabxana Mütəxəssisi",
        category: "tech",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
        subtitle: "Böyük Verilənlər və İnformasiya Təhlili",
        bio: "Məlumat okeanında naviqatorunuz. Elvin, şirkətin geniş hüquqi kitabxanasını və verilənlər bazasını idarə edir.",
        skills: ["Big Data", "Python", "Automation", "Information Retrieval"],
        stats: [
            { label: "Data Həcmi", value: "50TB" },
            { label: "Arxiv", value: "1990-2024" },
            { label: "Axtarış", value: "<0.1s" }
        ]
    },
    {
        id: 5,
        name: "Fərid Rzayev",
        role: "Backend Dev",
        category: "tech",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
        subtitle: "Mikroservislər və Bulud Texnologiyaları",
        bio: "Fərid, görünməyən infrastrukturu quran memardır. Onun həlləri sayəsində sistemlərimiz 99.9% işləmə zəmanəti və yüksək sürət nümayiş etdirir.",
        skills: ["AWS", "Docker", "GoLang", "Cybersecurity"],
        stats: [
            { label: "Serverlər", value: "25+" },
            { label: "API Req", value: "1M/gün" },
            { label: "Təcrübə", value: "6 İl" }
        ]
    },
    {
        id: 6,
        name: "Ayan Kərimova",
        role: "Marketing Lead",
        category: "management",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
        subtitle: "Rəqəmsal Böyümə Strategiyası",
        bio: "Ayan, dataya əsaslanan marketinq strategiyaları ilə şirkətin rəqəmsal görünürlüyünü artırır.",
        skills: ["Digital Marketing", "Analytics", "Social Media", "Campaign Management"],
        stats: [
            { label: "ROI", value: "350%" },
            { label: "Kampaniya", value: "45+" },
            { label: "Böyümə", value: "2x" }
        ]
    },
    {
        id: 7,
        name: "Orxan Səfərov",
        role: "Məlumat Analitiki",
        category: "management",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
        subtitle: "Biznes İntellekti və Hesabatlılıq",
        bio: "Rəqəmlər yalan danışmır. Orxan, mürəkkəb biznes göstəricilərini aydın vizual hesabatlara çevirərək rəhbərliyin düzgün qərarlar verməsinə kömək edir.",
        skills: ["Power BI", "SQL", "Statistics", "Predictive Modeling"],
        stats: [
            { label: "Hesabat", value: "Həftəlik" },
            { label: "Data Point", value: "10M+" },
            { label: "Dəqiqlik", value: "99%" }
        ]
    },
    {
        id: 8,
        name: "Günay Bayramova",
        role: "Layihə Meneceri",
        category: "management",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
        subtitle: "Resursların Planlanması və İdarə Edilməsi",
        bio: "Komandanın təşkilatçısı. Günay, layihələrin vaxtında və büdcə daxilində təhvil verilməsini təmin edir.",
        skills: ["Scrum", "Agile", "Risk Management", "Team Leadership"],
        stats: [
            { label: "Layihələr", value: "70+" },
            { label: "On-Time", value: "95%" },
            { label: "Komanda", value: "25 nəfər" }
        ]
    }
];

// --- 2. Modal Functions (Global Scope for inline onclick) ---
window.openMemberModal = function(id) {
    const member = teamData.find(m => m.id === id);
    if (!member) {
        console.error("Member not found ID:", id);
        return;
    }

    // UI Elements lookup (fresh every time to avoid stale refs if moved)
    const modal = document.getElementById('teamModal');
    const backdrop = document.getElementById('modalBackdrop');
    
    const mImg = document.getElementById('modalImg');
    const mName = document.getElementById('modalName');
    const mRole = document.getElementById('modalRoleBadge');
    const mSub = document.getElementById('modalSubtitle');
    const mBio = document.getElementById('modalBio');
    const mSkills = document.getElementById('modalSkills');
    const mStats = document.getElementById('modalStats');

    // Populate Content
    if(mImg) mImg.style.backgroundImage = `url('${member.img}')`;
    if(mName) mName.textContent = member.name;
    if(mRole) mRole.textContent = member.role;
    if(mSub) mSub.textContent = member.subtitle;
    if(mBio) mBio.textContent = member.bio;
    
    // Populate Skills
    if(mSkills) {
        mSkills.innerHTML = '';
        member.skills.forEach(s => {
            const span = document.createElement('span');
            span.className = 'badge bg-light text-dark border fw-normal p-2';
            span.textContent = s;
            mSkills.appendChild(span);
        });
    }

    // Populate Stats
    if(mStats) {
        mStats.innerHTML = '';
        if(member.stats) {
            member.stats.forEach(stat => {
                const div = document.createElement('div');
                div.className = 'stat-item';
                div.innerHTML = `
                    <span class="stat-value">${stat.value}</span>
                    <span class="stat-label">${stat.label}</span>
                `;
                mStats.appendChild(div);
            });
        }
    }

    // Open
    if(backdrop) backdrop.classList.add('active');
    if(modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeMemberModal = function() {
    const modal = document.getElementById('teamModal');
    const backdrop = document.getElementById('modalBackdrop');
    if(backdrop) backdrop.classList.remove('active');
    if(modal) modal.classList.remove('active');
    document.body.style.overflow = '';
};


document.addEventListener('DOMContentLoaded', () => {
    
    // --- 3. Preloader ---
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
            
            if(typeof gsap !== 'undefined') {
                 gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initPageAnimations();
                    }
                });
            } else {
                 preloader.style.display = 'none';
            }
        }, 800);
    });

    // --- 4. Animation Init ---
    function initPageAnimations() {
        if(typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Header
        gsap.to(".animate-fade-up", {
            y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out"
        });

        // Grid Cards
        gsap.fromTo(".animate-card", 
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out",
                clearProps: "transform" 
            }
        );
    }
    
    if(typeof gsap !== 'undefined') {
        gsap.set(".animate-fade-up", { y: 40, opacity: 0 });
    }

    // --- 5. Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.bento-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardIndex = Array.from(cards).indexOf(card);
                const member = teamData[cardIndex];
                
                if(!member) return;

                if (filterValue === 'all' || member.category === filterValue) {
                    if(typeof gsap !== 'undefined') {
                        gsap.to(card, { opacity: 1,  scale: 1, display: 'flex', duration: 0.4 });
                    } else {
                        card.style.display = 'flex';
                    }
                } else {
                    if(typeof gsap !== 'undefined') {
                        gsap.to(card, { opacity: 0.1, scale: 0.95, duration: 0.4, onComplete: () => card.style.display = 'none' }); 
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // --- 6. Modal Listeners ---
    const closeModal = document.getElementById('modalClose');
    const backdrop = document.getElementById('modalBackdrop');

    if(closeModal) closeModal.addEventListener('click', window.closeMemberModal);
    if(backdrop) backdrop.addEventListener('click', window.closeMemberModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeMemberModal();
    });

});
