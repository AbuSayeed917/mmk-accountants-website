// ============================================
// MMK Accountants - Premium Interactive JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => setTimeout(() => preloader.classList.add('loaded'), 800);
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 3500);

    // --- Custom Cursor ---
    if (!isMobile && !prefersReducedMotion) {
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursorFollower');
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        const hoverElements = document.querySelectorAll('a, button, [data-magnetic], .service-card, .specialist-item, .testimonial-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
    }

    // --- Header scroll + Top bar hide ---
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const topBar = document.getElementById('topBar');
    const isInnerPage = document.body.classList.contains('page-inner');
    let lastScrollY = 0;

    const onScroll = () => {
        const scrollY = window.scrollY;
        const scrollingDown = scrollY > lastScrollY;

        // Hide top bar when scrolling down past it
        if (topBar) {
            if (scrollY > 40) {
                topBar.classList.add('hidden');
            } else {
                topBar.classList.remove('hidden');
            }
        }

        header.classList.toggle('scrolled', isInnerPage || scrollY > 80);
        backToTop.classList.toggle('visible', scrollY > 600);

        // Scroll progress for back-to-top circle
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollY / docHeight, 1);
        backToTop.style.setProperty('--scroll-progress', progress);

        lastScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile menu ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Active nav set per-page via HTML class (multi-page site) ---
    // No scroll-based nav detection needed; active class is set in each page's HTML.

    // --- Hero reveal animations ---
    setTimeout(() => {
        document.querySelectorAll('.reveal-text').forEach(el => {
            const delay = parseFloat(el.dataset.delay || 0);
            el.style.setProperty('--reveal-delay', delay + 's');
            setTimeout(() => el.classList.add('revealed'), delay * 1000 + 100);
        });
        document.querySelectorAll('.reveal-fade').forEach(el => {
            const delay = parseFloat(el.dataset.delay || 0);
            el.style.transitionDelay = delay + 's';
            setTimeout(() => el.classList.add('revealed'), 100);
        });
    }, 1200);

    // --- Scroll animations (staggered) ---
    const animItems = document.querySelectorAll('.anim-item');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find siblings for stagger
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.anim-item');
                let index = 0;
                siblings.forEach((sib, i) => { if (sib === entry.target) index = i; });
                const staggerDelay = index * 0.08;
                entry.target.style.transitionDelay = staggerDelay + 's';
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    animItems.forEach(el => animObserver.observe(el));

    // --- Animated counters (eased) ---
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const animateCounterGroup = (container) => {
        if (container.dataset.animated) return;
        container.dataset.animated = 'true';
        const counters = container.querySelectorAll('.stat-number, .stats-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2200;
            const startTime = performance.now();
            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutQuart(progress);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) animateCounterGroup(e.target); });
    }, { threshold: 0.5 });
    document.querySelectorAll('.hero-stats, .stats-grid').forEach(el => statsObserver.observe(el));

    // --- Particles ---
    if (!isMobile && !prefersReducedMotion) {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) { /* skip on inner pages */ }
        else for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (8 + Math.random() * 12) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            p.style.width = (2 + Math.random() * 3) + 'px';
            p.style.height = p.style.width;
            p.style.opacity = 0.2 + Math.random() * 0.4;
            particlesContainer.appendChild(p);
        }
    }

    // --- Marquee clone for infinite loop ---
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        const content = marqueeTrack.querySelector('.marquee-content');
        const clone = content.cloneNode(true);
        marqueeTrack.appendChild(clone);
    }

    // --- Tilt effect on cards ---
    if (!isMobile && !prefersReducedMotion) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const intensity = parseInt(card.dataset.tiltIntensity || 8, 10);
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -intensity;
                const rotateY = ((x - centerX) / centerX) * intensity;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { card.style.transition = ''; }, 600);
            });
        });
    }

    // --- Magnetic buttons ---
    if (!isMobile && !prefersReducedMotion) {
        document.querySelectorAll('[data-magnetic]').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => { btn.style.transition = ''; }, 500);
            });
        });
    }

    // --- Parallax on scroll ---
    if (!isMobile && !prefersReducedMotion) {
        const parallaxEls = document.querySelectorAll('[data-parallax]');
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    parallaxEls.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax);
                        el.style.transform = `translateY(${scrollY * speed}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Contact form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            if (!data.name || !data.email || !data.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const original = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10"/></svg><span class="btn-text">Sending...</span>';
            submitBtn.disabled = true;
            setTimeout(() => {
                showFormMessage("Thank you! We'll be in touch within 2 hours.", 'success');
                contactForm.reset();
                submitBtn.innerHTML = original;
                submitBtn.disabled = false;
            }, 1800);
        });
    }

    function showFormMessage(message, type) {
        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();
        const el = document.createElement('div');
        el.className = 'form-message';
        el.textContent = message;
        Object.assign(el.style, {
            padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
            fontSize: '0.9rem', fontWeight: '500',
            animation: 'fadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1)',
            ...(type === 'success'
                ? { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }
                : { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
            )
        });
        contactForm.querySelector('h3').insertAdjacentElement('afterend', el);
        setTimeout(() => {
            el.style.animation = 'fadeSlideOut 0.4s forwards';
            setTimeout(() => el.remove(), 400);
        }, 5000);
    }

    // --- Back to Top ---
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Smooth anchor scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Dynamic styles ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});
