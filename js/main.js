/* ========================================
   Portfolio Main JS
   Animations, cursor, project rendering
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effects
    const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .bento-card, .skill-card, .magnetic');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // --- Magnetic buttons ---
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Reveal on scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay for siblings
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let siblingIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) siblingIndex = i;
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Load Projects ---
    function renderProjects() {
        const projects = PortfolioData.getProjects();
        const grid = document.getElementById('projects-grid');
        const noProjects = document.getElementById('no-projects');

        if (!projects || projects.length === 0) {
            grid.style.display = 'none';
            noProjects.style.display = 'block';
            return;
        }

        grid.style.display = '';
        noProjects.style.display = 'none';
        grid.innerHTML = '';

        projects.forEach((project, i) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.style.transitionDelay = `${i * 0.1}s`;

            const thumbnailContent = project.image
                ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}">`
                : `<div class="project-thumbnail-placeholder" style="color: ${escapeHtml(project.color || '#ff6b35')}">${escapeHtml(project.title.charAt(0))}</div>`;

            const tagsHtml = (project.tags || [])
                .map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`)
                .join('');

            const linkHtml = project.link
                ? `<a href="${escapeHtml(project.link)}" target="_blank" class="project-link">
                       View Project
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                           <path d="M7 17L17 7M17 7H7M17 7V17"/>
                       </svg>
                   </a>`
                : '';

            card.innerHTML = `
                <div class="project-thumbnail">
                    ${thumbnailContent}
                </div>
                <div class="project-info">
                    <div class="project-tags">${tagsHtml}</div>
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <p class="project-description">${escapeHtml(project.description)}</p>
                    ${linkHtml}
                </div>
            `;

            grid.appendChild(card);

            // Add hover listeners for cursor
            card.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });

            // Observe for reveal animation
            setTimeout(() => {
                revealObserver.observe(card);
            }, 50);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    renderProjects();

    // --- Parallax subtle effect on hero ---
    const hero = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.15}px)`;
            hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    });
});
