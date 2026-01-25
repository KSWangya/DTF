document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 手機漢堡選單
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    const navLinks = document.querySelectorAll('.menu a');

    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // 2. 導航欄滾動變色
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. 進階滾動動畫 Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .reveal-img');
    animatedElements.forEach(el => observer.observe(el));
});