const stars = document.getElementById('stars');
const moon = document.getElementById('moon');
const mountainsBehind = document.getElementById('mountains_behind');
const text = document.getElementById('text');
const btn = document.getElementById('btn');
const mountainsFront = document.getElementById('mountains_front');
const header = document.getElementById('header');
const documentation = document.getElementById('documentation');
const typedTitle = document.getElementById('typedTitle');
const gitEater = document.getElementById('gitEater');
const dotTrack = document.getElementById('dotTrack');

const navLinks = document.querySelectorAll('header a[href^="#"]');
const sections = document.querySelectorAll('#documentation .doc-section');

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

/* Horizontal scrolling:
 * Wheel/trackpad vertical movement is converted into horizontal movement.
 * Shift + wheel works naturally too.
 * Touch swipes use horizontal gesture handling below.
 */
let horizontalX = 0;
let targetX = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

function maxHorizontalScroll() {
  return Math.max(0, documentation.scrollWidth - window.innerWidth);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderHorizontal() {
  horizontalX += (targetX - horizontalX) * 0.12;
  horizontalX = clamp(horizontalX, 0, maxHorizontalScroll());

  documentation.style.transform = `translate3d(${-horizontalX}px, 0, 0)`;

  const progress = maxHorizontalScroll()
    ? horizontalX / maxHorizontalScroll()
    : 0;

  // Parallax layers react to horizontal movement too.
  if (stars) stars.style.transform = `translate3d(${progress * -80}px, 0, 0)`;
  if (moon) moon.style.marginLeft = `${progress * -60}px`;
  if (mountainsBehind) mountainsBehind.style.marginLeft = `${progress * -35}px`;
  if (mountainsFront) mountainsFront.style.marginLeft = `${progress * -8}px`;

  updateActiveLink();
  requestAnimationFrame(renderHorizontal);
}

function openDocumentation() {
  targetX = 0;
  // The hero is removed from the horizontal track, so this enters the docs
  // by replacing the hero with the documentation track.
  document.body.classList.add('docs-open');
  window.scrollTo(0, 0);
}

document.addEventListener('wheel', (event) => {
  if (!document.body.classList.contains('docs-open')) {
    if (Math.abs(event.deltaY) > 0) {
      openDocumentation();
      targetX += event.deltaY;
      event.preventDefault();
    }
    return;
  }

  targetX += event.deltaY + event.deltaX;
  targetX = clamp(targetX, 0, maxHorizontalScroll());
  event.preventDefault();
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (!document.body.classList.contains('docs-open')) {
    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
      openDocumentation();
      event.preventDefault();
    }
    return;
  }

  const amount = window.innerWidth * 0.82;

  if (event.key === 'ArrowRight' || event.key === 'PageDown') {
    targetX += amount;
    event.preventDefault();
  }

  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    targetX -= amount;
    event.preventDefault();
  }

  if (event.key === 'Home') {
    targetX = 0;
    event.preventDefault();
  }

  if (event.key === 'End') {
    targetX = maxHorizontalScroll();
    event.preventDefault();
  }
});

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  touchMoved = false;
}, { passive: true });

document.addEventListener('touchmove', (event) => {
  if (!document.body.classList.contains('docs-open')) return;

  const x = event.touches[0].clientX;
  const y = event.touches[0].clientY;
  const dx = x - touchStartX;
  const dy = y - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    targetX -= dx * 1.5;
    targetX = clamp(targetX, 0, maxHorizontalScroll());
    touchStartX = x;
    touchMoved = true;
    event.preventDefault();
  }
}, { passive: false });

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');

    if (id === '#home') {
      event.preventDefault();
      document.body.classList.remove('docs-open');
      targetX = 0;
      return;
    }

    if (id === '#documentation') {
      event.preventDefault();
      openDocumentation();
      targetX = 0;
      return;
    }

    const section = document.querySelector(id);
    if (section) {
      event.preventDefault();
      openDocumentation();
      const index = Array.from(sections).indexOf(section);
      targetX = Math.max(0, index) * window.innerWidth;
    }
  });
});

function updateActiveLink() {
  const pageIndex = Math.round(horizontalX / window.innerWidth);

  navLinks.forEach(link => {
    const target = link.getAttribute('href');
    let active = false;

    if (!document.body.classList.contains('docs-open')) {
      active = target === '#home';
    } else if (target === '#documentation') {
      active = pageIndex < sections.length - 1;
    } else if (target === '#team') {
      active = pageIndex === sections.length - 1;
    }

    link.classList.toggle('active', active);
  });
}

/* Original reference-inspired parallax values for the hero. */
window.addEventListener('scroll', () => {
  const value = window.scrollY;

  if (!document.body.classList.contains('docs-open')) {
    if (stars) stars.style.left = `${value * 0.25}px`;
    if (moon) moon.style.top = `${17 + value * 0.105}%`;
    if (mountainsBehind) mountainsBehind.style.bottom = `${-2 - value * 0.05}%`;
    if (mountainsFront) mountainsFront.style.bottom = '-2%';
    if (text) {
      text.style.marginRight = `${value * 0.35}px`;
      text.style.marginTop = `${value * 0.15}px`;
    }
    if (btn) btn.style.marginTop = `${32 + value * 0.08}px`;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  targetX = clamp(targetX, 0, maxHorizontalScroll());
});

renderHorizontal();
