const body = document.body;
const documentation = document.getElementById('documentation');
const header = document.getElementById('header');
const btn = document.getElementById('btn');
const typedTitle = document.getElementById('typedTitle');
const sections = Array.from(document.querySelectorAll('#documentation .doc-card'));
const railItems = Array.from(document.querySelectorAll('.rail-item'));

let currentIndex = 0;
let wheelLocked = false;
let touchStartY = 0;
let touchStartX = 0;
let titleIndex = 0;
const title = 'PyGit TUI';

function typeTitle() {
  if (!typedTitle) return;
  typedTitle.textContent = title.slice(0, titleIndex);
  if (titleIndex < title.length) {
    titleIndex++;
    setTimeout(typeTitle, 115);
  }
}
typeTitle();

function openDocumentation(index = 0) {
  body.classList.add('docs-open');
  currentIndex = Math.max(0, Math.min(index, sections.length - 1));
  renderDeck();
}

function closeDocumentation() {
  body.classList.remove('docs-open');
  currentIndex = 0;
  renderDeck();
}

function renderDeck() {
  const total = sections.length;

  sections.forEach((card, index) => {
    const depth = (index - currentIndex + total) % total;
    card.classList.toggle('active', depth === 0);
    card.classList.toggle('is-behind', depth > 0);
    card.style.setProperty('--depth', Math.min(depth, 5));

    // Keep a useful stack visible behind the active folder.
    if (depth === 0) {
      card.style.zIndex = 100;
    } else {
      card.style.zIndex = 100 - depth;
    }
  });

  railItems.forEach((item, index) => {
    const active = index === currentIndex;
    item.classList.toggle('active', active);
    item.setAttribute('aria-current', active ? 'page' : 'false');
  });

  const active = sections[currentIndex];
  if (active) {
    const titleText = active.querySelector('h2')?.textContent || '';
    document.title = `${titleText} — PyGit TUI`;
  }
}

function goTo(index, direction = 1) {
  if (!body.classList.contains('docs-open')) {
    openDocumentation(index);
    return;
  }

  const next = Math.max(0, Math.min(index, sections.length - 1));
  if (next === currentIndex) return;

  const old = sections[currentIndex];
  old.classList.add(direction > 0 ? 'flip-back' : 'flip-forward');

  currentIndex = next;
  renderDeck();

  window.setTimeout(() => {
    old.classList.remove('flip-back', 'flip-forward');
  }, 620);
}

function nextPage() {
  goTo(Math.min(currentIndex + 1, sections.length - 1), 1);
}

function previousPage() {
  goTo(Math.max(currentIndex - 1, 0), -1);
}

function unlockWheel() {
  wheelLocked = false;
}

document.addEventListener('wheel', (event) => {
  if (!body.classList.contains('docs-open')) {
    if (Math.abs(event.deltaY) > 5 || Math.abs(event.deltaX) > 5) {
      openDocumentation(0);
      event.preventDefault();
    }
    return;
  }

  event.preventDefault();
  if (wheelLocked) return;

  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
    ? event.deltaY
    : event.deltaX;

  if (Math.abs(delta) < 8) return;

  wheelLocked = true;
  if (delta > 0) nextPage();
  else previousPage();

  window.setTimeout(unlockWheel, 700);
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (!body.classList.contains('docs-open')) {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
      openDocumentation(0);
      event.preventDefault();
    }
    return;
  }

  if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
    nextPage();
    event.preventDefault();
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    previousPage();
    event.preventDefault();
  } else if (event.key === 'Home') {
    goTo(0, -1);
    event.preventDefault();
  } else if (event.key === 'End') {
    goTo(sections.length - 1, 1);
    event.preventDefault();
  } else if (event.key === 'Escape') {
    closeDocumentation();
    event.preventDefault();
  }
});

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (!body.classList.contains('docs-open')) return;

  const x = event.changedTouches[0].clientX;
  const y = event.changedTouches[0].clientY;
  const dx = x - touchStartX;
  const dy = y - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;

  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy < 0) nextPage();
    else previousPage();
  } else {
    if (dx < 0) nextPage();
    else previousPage();
  }
}, { passive: true });

railItems.forEach((item) => {
  item.addEventListener('click', () => {
    const index = Number(item.dataset.index);
    goTo(index, index >= currentIndex ? 1 : -1);
  });
});

document.querySelectorAll('header a[href^="#"]').forEach(link => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');

    if (id === '#home') {
      event.preventDefault();
      closeDocumentation();
      return;
    }

    if (id === '#documentation') {
      event.preventDefault();
      openDocumentation(0);
      return;
    }

    const section = document.querySelector(id);
    if (section) {
      event.preventDefault();
      const index = sections.indexOf(section);
      openDocumentation(index >= 0 ? index : 0);
    }
  });
});

if (btn) {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    openDocumentation(0);
  });
}

renderDeck();
