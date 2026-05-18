/* ============================================
   SATWIKFX - Modern Portfolio JavaScript
   Tech: Vanilla JS, Three.js, GSAP
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavbar();
    initThreeJS();
    initGSAP();
    initCarousel();
    initFilters();
    initFAQ();
    initForm();
    initBackToTop();
    initMobileMenu();
    initPlaceholderCards();
});

/* ===== LOADER ===== */
function initLoader() {
    const loader = document.querySelector('.loader');
    const fill = document.querySelector('.loader-fill');
    if (!loader || !fill) return;

    requestAnimationFrame(() => {
        fill.style.width = '100%';
    });

    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            animateHeroReveal();
        }, 300);
    }, 2500);
}

/* ===== CUSTOM CURSOR ===== */
function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .carousel-card, .project-card, .play-btn, .placeholder-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = (e.clientX - 20) + 'px';
        ripple.style.top = (e.clientY - 20) + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

/* ===== NAVBAR ===== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const menu = document.querySelector('.nav-mobile-menu');
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

/* ===== THREE.JS PARTICLES ===== */
function initThreeJS() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xff6b35);
    const color2 = new THREE.Color(0xff8c5a);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const mixRatio = Math.random();
        const c = color1.clone().lerp(color2, mixRatio);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 8;

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.002;

        const targetRotationY = mouseX * 0.3;
        const targetRotationX = mouseY * 0.2;

        particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
        particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;
        particles.position.y = Math.sin(time) * 0.3;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ===== GSAP ANIMATIONS ===== */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('section').forEach(section => {
        const children = section.querySelectorAll('.fade-up, .fade-in');
        if (children.length > 0) {
            gsap.fromTo(children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    });

    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    document.querySelectorAll('.stat-number[data-target]').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        gsap.fromTo(stat,
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function() {
                    stat.innerText = Math.round(this.targets()[0].innerText) + '+';
                }
            }
        );
    });

    document.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
        const width = bar.dataset.width;
        gsap.to(bar, {
            width: width + '%',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/* ===== HERO REVEAL ===== */
function animateHeroReveal() {
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('.hero-content > *').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const heroElements = document.querySelectorAll('.hero-content > *');
    gsap.fromTo(heroElements,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out'
        }
    );
}

/* ===== STATIC CAROUSEL ===== */
function initCarousel() {
    document.querySelectorAll('.carousel-container').forEach(container => {
        const track = container.querySelector('.carousel-track');
        const cards = container.querySelectorAll('.carousel-card');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        const dots = container.querySelectorAll('.carousel-dot');
        if (!track || cards.length === 0) return;

        let currentIndex = 0;
        const total = cards.length;

        function updateCarousel(index) {
            currentIndex = index;
            cards.forEach((card, i) => {
                card.classList.remove('active');
                if (i === index) {
                    card.dataset.position = 'center';
                    card.classList.add('active');
                } else if (i === (index - 1 + total) % total) {
                    card.dataset.position = 'left';
                } else if (i === (index + 1) % total) {
                    card.dataset.position = 'right';
                } else {
                    card.dataset.position = 'hidden';
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function next() {
            updateCarousel((currentIndex + 1) % total);
        }

        function prev() {
            updateCarousel((currentIndex - 1 + total) % total);
        }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateCarousel(i));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });

        updateCarousel(0);
    });
}

/* ===== FILTERS ===== */
function initFilters() {
    document.querySelectorAll('.filter-bar').forEach(bar => {
        const buttons = bar.querySelectorAll('.filter-btn');
        const grid = bar.closest('section, .portfolio-section')?.querySelector('.project-grid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.project-card, .placeholder-card');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach(card => {
                    const category = card.dataset.category || 'all';
                    if (filter === 'all' || category === filter) {
                        card.style.display = card.classList.contains('placeholder-card') ? 'flex' : 'block';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => { card.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    });
}

/* ===== PLACEHOLDER CARDS ===== */
function initPlaceholderCards() {
    document.querySelectorAll('.placeholder-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category || 'project';
            alert('Ready to add your next ' + category + ' project! Replace this placeholder by updating the HTML with your project image and video link.');
        });
    });
}

/* ===== FAQ ACCORDION ===== */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ===== FORM ===== */
function initForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Thank you! Your message has been sent successfully.');
            btn.innerText = originalText;
            btn.disabled = false;
            form.reset();
        }, 1500);
    });
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== LUCIDE ICONS INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/* ===== VIDEO MODAL ===== */
function openVideoModal(fileId) {
    if (fileId.startsWith('placeholder-')) {
        alert('This is a demo project. Replace the placeholder video ID in the HTML with your actual Google Drive file ID.');
        return;
    }

    const existing = document.querySelector('.video-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-overlay" onclick="closeVideoModal()"></div>
        <div class="video-modal-content">
            <button class="video-modal-close" onclick="closeVideoModal()" aria-label="Close video">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div class="video-modal-frame">
                <iframe 
                    src="https://drive.google.com/file/d/${fileId}/preview" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen
                    frameborder="0"
                ></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
});
