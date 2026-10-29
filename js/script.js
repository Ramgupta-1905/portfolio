const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('main section');
const navItems = document.querySelectorAll('.nav-links a');
const progressBar = document.querySelector('.progress-bar');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const form = document.getElementById('contact-form');
const formMessage = document.querySelector('.form-message');
const projectTrack = document.getElementById('project-track');
const projectCards = [...document.querySelectorAll('.project-card')];
const projectFilters = document.querySelectorAll('.project-filter');
const projectRailProgress = document.querySelector('.project-rail-progress span');
const projectRailCount = document.querySelector('.project-rail-count strong');
const skillResults = document.querySelector('.skill-results');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

function updateActiveNavigation() {
  const marker = window.innerHeight * 0.3;
  const activeSection = [...sections].find((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= marker && bounds.bottom > marker;
  }) || [...sections].find((section) => section.getBoundingClientRect().top > 0);

  navItems.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${activeSection?.id}`
    );
  });
}

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${scrollPercent}%`;

  backToTop.classList.toggle('show', scrollTop > 500);
  updateActiveNavigation();
});

updateActiveNavigation();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const skillFilters = [...document.querySelectorAll('.skill-filter')];
const skillTiles = [...document.querySelectorAll('.skill-tile')];

function selectSkillCategory(category, animate = false) {
  skillFilters.forEach((filter) => {
    const selected = filter.dataset.skillFilter === category;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });

  skillTiles.forEach((tile) => {
    tile.hidden = category !== 'all' && tile.dataset.skillCategory !== category;
  });

  if (animate) {
    skillResults?.classList.add('is-filtering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => skillResults?.classList.remove('is-filtering'));
    });
  }
}

skillFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    selectSkillCategory(filter.dataset.skillFilter, true);
  });
});

selectSkillCategory(
  skillFilters.find((filter) => filter.classList.contains('active'))?.dataset.skillFilter
    || skillFilters[0]?.dataset.skillFilter
);

function updateProjectRailStatus() {
  if (!projectTrack || !projectCards.length) return;

  const visibleCards = projectCards.filter((card) => !card.hidden);
  const firstVisible = visibleCards.find((card) => {
    const cardRect = card.getBoundingClientRect();
    const trackRect = projectTrack.getBoundingClientRect();
    return cardRect.right > trackRect.left + 4;
  });
  const index = firstVisible ? visibleCards.indexOf(firstVisible) : 0;
  const progress = visibleCards.length > 1 ? ((index + 1) / visibleCards.length) * 100 : 100;

  if (projectRailProgress) projectRailProgress.style.width = `${progress}%`;
  if (projectRailCount) projectRailCount.textContent = String(index + 1).padStart(2, '0');
}

projectFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.projectFilter;

    projectFilters.forEach((item) => {
      const selected = item === filter;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.categories?.split(' ') || [];
      card.hidden = category !== 'all' && !categories.includes(category);
    });

    projectTrack?.scrollTo({ left: 0, behavior: 'smooth' });
    updateProjectRailStatus();
  });
});

document.querySelectorAll('.carousel-button').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = Number(button.dataset.carouselDirection);
    const card = projectCards.find((item) => !item.hidden);
    const step = (card?.getBoundingClientRect().width || 210) + 10;

    projectTrack?.scrollBy({ left: direction * step, behavior: 'smooth' });
  });
});

projectTrack?.addEventListener('scroll', updateProjectRailStatus, { passive: true });

window.addEventListener('resize', updateProjectRailStatus);
updateProjectRailStatus();

const projectDetails = {
  scribble: {
    title: 'Scribble.io Clone — Multiplayer Drawing and Guessing Game',
    category: 'Full-stack web game',
    description:
      'A browser-based multiplayer game in which players join rooms, take turns drawing a selected word, and guess through chat to earn points. Its frontend uses a drawing canvas and communicates with a Node.js server for real-time game events.',
    technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express.js', 'Socket.IO'],
    features: [
      'Create or join multiplayer rooms.',
      'Take turns selecting words and drawing on an interactive canvas.',
      'Use pencil, color, brush-size, and eraser controls.',
      'Synchronize drawing activity and chat guesses in real time.',
      'Track scores, timed rounds, and word hints.',
      'Reconnect to a room after a temporary connection loss.'
    ],
    implementation:
      'The React and TypeScript frontend uses the Canvas API for drawing. A Node.js and Express server with Socket.IO manages rooms, player connections, game events, scoring, and round progression.',
    screenshot: 'assets/scribbleioclone.png',
    screenshotAlt: 'Scribble.io multiplayer drawing game preview',
    github: 'https://github.com/Ramgupta-1905/Scribble.io-clone',
    demo: 'https://skribbl-clone-frontend-vla2.onrender.com/'
  },
  notenest: {
    title: 'NoteNest — Full-Stack Notes Application',
    category: 'Full-stack web application',
    description:
      'A responsive notes application for capturing, organizing, and managing notes, with a React interface connected to backend APIs and PostgreSQL storage.',
    technologies: [
      'React.js',
      'Vite',
      'JavaScript',
      'CSS',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'REST APIs'
    ],
    features: [
      'Create, view, edit, and delete notes.',
      'Organize notes with colors, favorites, and search.',
      'Move notes to Trash, restore them, or permanently delete them.',
      'Sort notes by newest or oldest.',
      'Switch between light and dark themes.',
      'Save note data in PostgreSQL through backend APIs.'
    ],
    implementation:
      'The React and Vite frontend communicates with an Express API running on Node.js. The repository documents PostgreSQL-backed note storage and CRUD operations.',
    screenshot: 'assets/Notenest.png',
    screenshotAlt: 'NoteNest notes application preview',
    github: 'https://github.com/Ramgupta-1905/NoteNest',
    demo: 'https://note-nest-nu-eight.vercel.app/'
  },
  edusphere: {
    title: 'Edusphere — College Portal Website',
    category: 'Web portal',
    description:
      'A college portal website with separate entry points for students and employees, including login pages, dashboards, and linked academic information pages.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Choose between student and employee portal entry points.',
      'Navigate to separate student and employee login and dashboard pages.',
      'Browse student attendance, profile, results, and company-visit pages.',
      'Use a shared sidebar component for portal navigation.',
      'Explore additional academic pages identified as placeholders in the project documentation.'
    ],
    implementation:
      'The repository is organized as linked HTML pages with shared CSS and JavaScript. No backend functionality is claimed here.',
    screenshot: 'assets/edusphere.png',
    screenshotAlt: 'Edusphere college portal homepage',
    github: 'https://github.com/Ramgupta-1905/Edusphere',
    demo: 'http://edusphere-main.netlify.app/'
  },
  jobtrack: {
    title: 'JobTrack AI — Job and Internship Application Tracker',
    category: 'Frontend prototype; backend deployment incomplete',
    description:
      'A student-focused application tracker project for organizing job and internship applications, assessments, interviews, resumes, and profile information. The repository includes a React frontend and a Spring Boot backend, but backend and database deployment issues mean the complete full-stack application is not presented as operational.',
    technologies: ['React', 'Java', 'Spring Boot', 'PostgreSQL'],
    features: [
      'Frontend dashboard and navigation for application tracking.',
      'Project sections for assessments, interviews, resumes, and profile management.',
      'Backend and database functionality is not claimed as deployed or operational.'
    ],
    implementation:
      'The repository contains a React frontend and a Java/Spring Boot backend configured for PostgreSQL. The backend/database deployment is incomplete; the project is therefore described as a frontend prototype rather than a working full-stack service.',
    screenshot: 'assets/jobtrackai.png',
    screenshotAlt: 'JobTrack AI project landing page preview',
    github: 'https://github.com/Ramgupta-1905/jobtrack-ai',
    demo: null
  },
  reloop: {
    title: 'ReLoop — Pre-Owned Marketplace',
    category: 'Java console application',
    description:
      'A console-based marketplace application for listing pre-owned items and negotiating offers. It demonstrates Java classes, collections, validation, exception handling, and marketplace operations.',
    technologies: ['Java', 'PostgreSQL'],
    features: [
      'Browse items and their asking prices.',
      'Add items with input validation.',
      'Make offers and review pending offers.',
      'Accept, reject, or counter an offer.',
      'Track offer status and handle invalid input.'
    ],
    implementation:
      'The repository documents a console workflow with Java classes and in-memory item and offer data. It also contains PostgreSQL connection code, but persistent database behavior is not claimed because the project documentation describes data as in-memory.',
    screenshot: 'assets/ReLoop_ Buy, Sell, Reuse.png',
    screenshotAlt: 'ReLoop pre-owned marketplace preview',
    github: 'https://github.com/Ramgupta-1905/ReLoop',
    demo: null
  },
  raah: {
    title: 'RAAH — Rural Accessible Affordable Healthcare',
    category: 'Concept / research project',
    description:
      'A telemedicine platform concept focused on improving access to healthcare services for rural communities. The associated research paper was selected for presentation at an international conference.',
    technologies: [],
    features: ['Research concept focused on rural access to healthcare services.'],
    implementation:
      'A complete prototype stack and implemented functionality could not be confirmed from the available portfolio files. This is presented as a concept and research project, not as a deployed application.',
    screenshot: 'assets/RAAH Rural Healthcare Branding Banner.png',
    screenshotAlt: 'RAAH rural accessible healthcare project artwork',
    github: 'https://github.com/Ramgupta-1905/RAAH',
    demo: null
  }
};

const projectDialog = document.getElementById('project-dialog');
const projectTitle = document.getElementById('project-dialog-title');
const projectCategory = document.getElementById('project-dialog-category');
const projectDescription = document.getElementById('project-dialog-description');
const projectTechnologyList = document.getElementById('project-dialog-technologies');
const projectFeatureList = document.getElementById('project-dialog-features');
const projectImplementation = document.getElementById('project-dialog-implementation');
const projectImage = document.getElementById('project-dialog-image');
const projectActionLinks = document.getElementById('project-dialog-links');
const projectCloseButton = document.querySelector('.project-dialog-close');
let lastProjectTrigger;

function appendProjectTags(container, values) {
  container.replaceChildren();

  if (values.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'Not confirmed';
    note.className = 'project-dialog-description';
    container.append(note);
    return;
  }

  values.forEach((value) => {
    const tag = document.createElement('span');
    tag.textContent = value;
    container.append(tag);
  });
}

function addProjectLink(label, href, style) {
  if (!href) return;

  const link = document.createElement('a');
  link.className = `btn ${style}`;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label;
  projectActionLinks.append(link);
}

document.querySelectorAll('.project-card').forEach((card) => {
  const trigger = card.querySelector('.project-card-trigger');
  const project = projectDetails[card.dataset.project];

  trigger?.addEventListener('click', () => {
    if (!project || !projectDialog) return;

    lastProjectTrigger = trigger;
    projectTitle.textContent = project.title;
    projectCategory.textContent = project.category;
    projectDescription.textContent = project.description;
    projectImplementation.textContent = project.implementation;
    appendProjectTags(projectTechnologyList, project.technologies);
    projectFeatureList.replaceChildren();
    project.features.forEach((feature) => {
      const item = document.createElement('li');
      item.textContent = feature;
      projectFeatureList.append(item);
    });

    projectImage.replaceChildren();
    projectImage.hidden = !project.screenshot;
    if (project.screenshot) {
      const image = document.createElement('img');
      image.src = project.screenshot;
      image.alt = project.screenshotAlt;
      image.loading = 'lazy';
      image.decoding = 'async';
      projectImage.append(image);
    }

    projectActionLinks.replaceChildren();
    addProjectLink('GitHub', project.github, 'btn-secondary');
    addProjectLink('Live Demo', project.demo, 'btn-primary');
    projectDialog.showModal();
    projectCloseButton.focus();
  });
});

projectCloseButton?.addEventListener('click', () => projectDialog?.close());

projectDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    projectDialog.close();
  }
});

projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

projectDialog?.addEventListener('close', () => {
  lastProjectTrigger?.focus();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const subject = formData.get('subject')?.toString().trim() || '';
  const message = formData.get('message')?.toString().trim() || '';
  const body = `From: ${name} (${email})\n\n${message}`;
  const mailto = `mailto:ramgupta1906@gmail.com?${new URLSearchParams({
    subject,
    body
  })}`;

  formMessage.textContent =
    'Your default email application should open with your message. If it does not, email ramgupta1906@gmail.com directly.';
  window.location.href = mailto;
});
