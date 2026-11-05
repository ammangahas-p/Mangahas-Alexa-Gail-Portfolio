const projects = [
  {
    id: '01',
    title: 'Lumina Identity System',
    category: 'Brand Identity',
    description: 'A feather-inspired emblem and matching badge for Lumina, created in a gold-on-navy palette.',
    year: '2026',
    role: 'Brand identity',
    status: 'Course project',
    technologies: ['GIMP', 'Logo Design', 'Badge Design'],
    image: '/manus-storage/lumina-badge_622ae7ba.png',
    imageAlt: 'Gold feather-like Lumina emblem inside a circular navy badge.',
    localImage: 'assets/projects/lumina-badge.png',
  },
  {
    id: '02',
    title: 'Urban Threads Campaign',
    category: 'Campaign Design',
    description: 'An apparel campaign concept with a branded T-shirt mockup, landing-page banner, social post, ad banner, and newsletter header.',
    year: '2026',
    role: 'Campaign design',
    status: 'Course project',
    technologies: ['Canva', 'Apparel Branding', 'Campaign Design'],
    image: '/manus-storage/urban-threads-tshirt_a3d2a5d9.png',
    imageAlt: 'Black Urban Threads T-shirt apparel mockup with the campaign logo.',
    localImage: 'assets/projects/urban-threads-tshirt.png',
  },
  {
    id: '03',
    title: 'Cozy Cove Café Identity',
    category: 'Brand Identity',
    description: 'A reading-café brand concept shaped around the “Lattes & Literature” theme and a crest-style mark.',
    year: '2026',
    role: 'Brand concept',
    status: 'Course project',
    technologies: ['Canva', 'Branding', 'Typography'],
    image: '/manus-storage/cozy-cove_179ecdd0.jpg',
    imageAlt: 'Cozy Cove crest with the Lattes & Literature theme.',
    localImage: 'assets/projects/cozy-cove.jpg',
  },
  {
    id: '04',
    title: 'Portfolio Wireframe & Prototype',
    category: 'UI/UX Design',
    description: 'A portfolio experience mapped across Home, About & Works, and Contact, progressing from wireframes to a high-fidelity mobile prototype.',
    year: '2026',
    role: 'Interface design',
    status: 'Course project',
    technologies: ['Figma', 'Wireframing', 'Mobile UI'],
    image: '/manus-storage/portfolio-wireframe_dbf0adf9.png',
    imageAlt: 'Three-screen portfolio prototype showing Home, About & Works, and Contact views.',
    localImage: 'assets/projects/portfolio-wireframe.png',
  },
];

const projectGrid = document.querySelector('#project-grid');
const searchInput = document.querySelector('#project-search');
const filterList = document.querySelector('#category-filters');
const resultsStatus = document.querySelector('#results-status');
const carouselPosition = document.querySelector('#carousel-position');
const previousProjectButton = document.querySelector('#project-prev');
const nextProjectButton = document.querySelector('#project-next');
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-toggle-icon');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const editCvButton = document.querySelector('#edit-cv');
const printCvButton = document.querySelector('#print-cv');
const cvEditNote = document.querySelector('#cv-edit-note');
const editableCvFields = document.querySelectorAll('[data-editable]');

let activeCategory = 'All';

function setCvEditing(isEditing) {
  editableCvFields.forEach((field) => {
    field.contentEditable = String(isEditing);
    field.classList.toggle('is-editable', isEditing);
  });
  editCvButton?.setAttribute('aria-pressed', String(isEditing));
  if (editCvButton) editCvButton.innerHTML = isEditing ? 'Save CV <span aria-hidden="true">✓</span>' : 'Edit CV <span aria-hidden="true">✎</span>';
  if (cvEditNote) cvEditNote.textContent = isEditing
    ? 'Editing is on. Update the highlighted text, then choose “Save CV”.'
    : 'Select “Edit CV” to update the text. Your changes are saved in this browser.';
}

try {
  const savedCv = JSON.parse(window.localStorage.getItem('portfolio-cv') || '{}');
  editableCvFields.forEach((field) => {
    const key = field.dataset.editable;
    if (key && savedCv[key]) field.innerHTML = savedCv[key];
  });
} catch {
  // The starter CV remains available when browser storage is unavailable.
}

editCvButton?.addEventListener('click', () => {
  const isEditing = editCvButton.getAttribute('aria-pressed') === 'true';
  if (isEditing) {
    const savedCv = {};
    editableCvFields.forEach((field) => {
      if (field.dataset.editable) savedCv[field.dataset.editable] = field.innerHTML;
    });
    try {
      window.localStorage.setItem('portfolio-cv', JSON.stringify(savedCv));
    } catch {
      // The CV still updates for this page even if storage is unavailable.
    }
  }
  setCvEditing(!isEditing);
});

printCvButton?.addEventListener('click', () => window.print());

function setTheme(theme, persist = true) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  const isDark = selectedTheme === 'dark';
  document.documentElement.dataset.theme = selectedTheme;
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  if (themeIcon) themeIcon.textContent = isDark ? '☼' : '☾';
  themeColorMeta?.setAttribute('content', isDark ? '#191420' : '#faf8fc');

  if (persist) {
    try {
      window.localStorage.setItem('portfolio-theme', selectedTheme);
    } catch {
      // The theme still changes for this page even if storage is unavailable.
    }
  }
}

let savedTheme = 'light';
try {
  const storedTheme = window.localStorage.getItem('portfolio-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') savedTheme = storedTheme;
} catch {
  // Keep the default light theme when browser storage is unavailable.
}
setTheme(savedTheme, false);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  setMenuOpen(false);
});

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createProjectCard(project, index, total) {
  const article = makeElement('article', 'project-card');
  article.dataset.projectId = project.id;
  article.setAttribute('aria-roledescription', 'slide');
  article.setAttribute('aria-label', `Slide ${index + 1} of ${total}: ${project.title}`);

  const art = makeElement('div', 'project-art');
  const image = makeElement('img', 'project-art-image');
  image.alt = project.imageAlt;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    if (!project.localImage || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = project.localImage;
  }, { once: true });
  image.src = project.image;
  art.append(image);

  const body = makeElement('div', 'project-card-body');
  const meta = makeElement('div', 'project-meta-row');
  meta.append(makeElement('span', 'project-category', project.category));
  meta.append(makeElement('span', 'project-status', project.status));

  const title = makeElement('h3', '', project.title);
  const description = makeElement('p', 'project-description', project.description);
  const tags = makeElement('div', 'project-tags');
  tags.setAttribute('aria-label', 'Tools and project focus');
  project.technologies.forEach((technology) => {
    tags.append(makeElement('span', 'project-tag', technology));
  });

  const bottom = makeElement('div', 'project-card-bottom');
  const role = makeElement('span', 'project-role', project.role);
  const year = makeElement('span', 'project-year', project.year);
  const contactLink = makeElement('a', 'project-contact-link', 'Ask about this work ↗');
  contactLink.href = '#contact';
  bottom.append(role, year);

  body.append(meta, title, description, tags, bottom, contactLink);
  article.append(art, body);
  return article;
}

function renderProjects() {
  if (!projectGrid) return;

  const query = (searchInput?.value || '').trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const searchableText = [
      project.title,
      project.category,
      project.description,
      project.year,
      project.role,
      project.status,
      ...project.technologies,
    ].join(' ').toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  projectGrid.replaceChildren();
  projectGrid.scrollLeft = 0;

  if (filteredProjects.length === 0) {
    const emptyState = makeElement('div', 'empty-state');
    emptyState.append(makeElement('strong', '', 'No matching projects yet.'));
    emptyState.append(makeElement('span', '', 'Try a different search or category.'));
    projectGrid.append(emptyState);
  } else {
    filteredProjects.forEach((project, index) => {
      projectGrid.append(createProjectCard(project, index, filteredProjects.length));
    });
  }

  if (resultsStatus) {
    const count = filteredProjects.length;
    resultsStatus.textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'PROJECT' : 'PROJECTS'} SHOWN`;
  }
  updateCarouselControls();
}

function getProjectStep() {
  const firstCard = projectGrid?.querySelector('.project-card');
  if (!firstCard) return 0;
  const trackStyles = window.getComputedStyle?.(projectGrid);
  if (!trackStyles) return firstCard.getBoundingClientRect().width;
  const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function updateCarouselControls() {
  if (!projectGrid) return;
  const cards = projectGrid.querySelectorAll('.project-card');
  const maxScroll = Math.max(0, projectGrid.scrollWidth - projectGrid.clientWidth);
  if (previousProjectButton) previousProjectButton.disabled = cards.length < 2 || projectGrid.scrollLeft <= 2;
  if (nextProjectButton) nextProjectButton.disabled = cards.length < 2 || projectGrid.scrollLeft >= maxScroll - 2;

  const step = getProjectStep();
  const slideNumber = cards.length && step
    ? Math.min(cards.length, Math.floor((projectGrid.scrollLeft + step / 2) / step) + 1)
    : 0;
  if (carouselPosition) {
    carouselPosition.textContent = cards.length
      ? `${String(slideNumber).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`
      : '00 / 00';
    carouselPosition.setAttribute('aria-label', cards.length ? `Slide ${slideNumber} of ${cards.length}` : 'No projects');
  }
}

function moveCarousel(direction) {
  const step = getProjectStep();
  if (!step || !projectGrid) return;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  projectGrid.scrollBy({ left: direction * step, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function renderFilters() {
  if (!filterList) return;
  const categories = ['All', ...new Set(projects.map((project) => project.category))];

  categories.forEach((category) => {
    const button = makeElement('button', 'filter-button', category);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(category === activeCategory));
    button.addEventListener('click', () => {
      activeCategory = category;
      filterList.querySelectorAll('.filter-button').forEach((filterButton) => {
        filterButton.setAttribute('aria-pressed', String(filterButton.textContent === activeCategory));
      });
      renderProjects();
    });
    filterList.append(button);
  });
}

function setMenuOpen(isOpen) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  navigation.classList.toggle('is-open', isOpen);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);

  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    searchInput?.focus();
  }
});

searchInput?.addEventListener('input', renderProjects);
previousProjectButton?.addEventListener('click', () => moveCarousel(-1));
nextProjectButton?.addEventListener('click', () => moveCarousel(1));
projectGrid?.addEventListener('scroll', updateCarouselControls, { passive: true });
projectGrid?.addEventListener('keydown', (event) => {
  if (event.target !== projectGrid) return;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveCarousel(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveCarousel(1);
  }
});
window.addEventListener('resize', updateCarouselControls);

const yearLabel = document.querySelector('#current-year');
if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());

renderFilters();
renderProjects();
