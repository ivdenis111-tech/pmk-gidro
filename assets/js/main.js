'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar: shrink on scroll ──────────────────────────────
    const header = document.querySelector('.site-header');
    const onScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
            header.style.height = '64px';
        } else {
            header.classList.remove('scrolled');
            header.style.height = '';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Mobile menu ───────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
        });
    }

    // ── Active nav link on scroll ─────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

    // ── Accordion ─────────────────────────────────────────────
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion-item');
            const isOpen = item.classList.contains('is-open');
            // Close all others in same group
            const group = item.closest('[data-accordion-group]');
            if (group) {
                group.querySelectorAll('.accordion-item.is-open').forEach(i => i.classList.remove('is-open'));
            }
            if (!isOpen) item.classList.add('is-open');
        });
    });

    // ── Portfolio scroll ──────────────────────────────────────
    const track = document.getElementById('cases-track');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');

    if (track && btnLeft && btnRight) {
        const STEP = 400;
        btnLeft.addEventListener('click', () => track.scrollBy({ left: -STEP, behavior: 'smooth' }));
        btnRight.addEventListener('click', () => track.scrollBy({ left: STEP, behavior: 'smooth' }));

        const updateArrows = () => {
            btnLeft.style.opacity = track.scrollLeft > 10 ? '1' : '0.35';
            btnRight.style.opacity =
                track.scrollLeft < track.scrollWidth - track.clientWidth - 10 ? '1' : '0.35';
        };
        track.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
    }

    // ── Phone input mask ──────────────────────────────────────
    document.querySelectorAll('input[data-phone]').forEach(input => {
        input.addEventListener('input', function () {
            let digits = this.value.replace(/\D/g, '');
            if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
            let out = '+7 (';
            if (digits.length > 0) out += digits.slice(0, 3);
            if (digits.length >= 4) out += ') ' + digits.slice(3, 6);
            if (digits.length >= 7) out += '-' + digits.slice(6, 8);
            if (digits.length >= 9) out += '-' + digits.slice(8, 10);
            this.value = out;
        });
        input.addEventListener('focus', function () {
            if (!this.value) this.value = '+7 (';
        });
        input.addEventListener('blur', function () {
            if (this.value === '+7 (') this.value = '';
        });
    });

    // ── CTA Form submit ───────────────────────────────────────
    document.querySelectorAll('[data-cta-form]').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const phone = form.querySelector('input[data-phone]');
            if (!phone || phone.value.replace(/\D/g, '').length < 11) {
                phone && phone.focus();
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Отправлено!';
                btn.disabled = true;
            }
            // TODO: replace with real endpoint
            console.log('CTA submit:', phone.value);
        });
    });

    // ── GSAP Animations ───────────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        // Mark body so CSS can hide .js-fade elements before animation
        document.body.classList.add('gsap-active');

        // Hero entrance
        gsap.from('.hero__badge', { opacity: 0, y: 20, duration: 0.6, delay: 0.1 });
        gsap.from('.hero__title',    { opacity: 0, y: 60, duration: 1.0, delay: 0.25, ease: 'power3.out' });
        gsap.from('.hero__subtitle', { opacity: 0, y: 40, duration: 0.8, delay: 0.5, ease: 'power2.out' });
        gsap.from('.hero__actions',  { opacity: 0, y: 30, duration: 0.7, delay: 0.75, ease: 'power2.out' });

        // Section reveals
        gsap.utils.toArray('.js-fade').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 48 },
                {
                    opacity: 1, y: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Stagger for grid items
        gsap.utils.toArray('[data-stagger]').forEach(group => {
            const items = group.querySelectorAll('[data-stagger-item]');
            gsap.fromTo(items,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Stat counters
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            const plus = el.dataset.plus === 'true';
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.fromTo({ val: 0 }, { val: target, duration: 1.8, ease: 'power2.out',
                        onUpdate: function () {
                            el.textContent = Math.round(this.targets()[0].val) + (plus ? '+' : '');
                        }
                    });
                }
            });
        });
    }

});
