const sections = document.querySelectorAll('section');
const options = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, options);
sections.forEach(section => observer.observe(section));

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionMap = Array.from(navLinks).reduce((map, link) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) map[id] = link;
    return map;
}, {});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const link = sectionMap['#' + entry.target.id];
        if (link) {
            if (entry.isIntersecting) {
                navLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}, { threshold: 0.45 });

Object.keys(sectionMap).forEach(id => {
    const section = document.querySelector(id);
    if (section) sectionObserver.observe(section);
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});
