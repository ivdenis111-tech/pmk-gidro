// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Horizontal Scroll for Cases
    const container = document.getElementById('cases-container');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');

    if (container && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            container.scrollBy({ left: -400, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            container.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }

    // 2. Navbar shrink effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('h-16', 'shadow-md');
            header.classList.remove('h-20');
        } else {
            header.classList.remove('h-16', 'shadow-md');
            header.classList.add('h-20');
        }
    });

    // 3. Simple Reveal Animations
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // 4. Hero Title Animation
    gsap.from('h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.2
    });
});
