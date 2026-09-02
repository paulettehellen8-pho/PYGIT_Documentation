const stars = document.getElementById('stars');
const moon = document.getElementById('moon');
const mountainsBehind = document.getElementById('mountains_behind');
const text = document.getElementById('text');
const btn = document.getElementById('btn');
const mountainsFront = document.getElementById('mountains_front');
const header = document.getElementById('header');

const navLinks = document.querySelectorAll('header a[href^="#"]');
const sections = document.querySelectorAll('#documentation .doc-section');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/*
 * This intentionally keeps the same scroll relationships as the supplied
 * parallax reference:
 * stars     -> left  x 0.25
 * moon      -> top   x 1.05
 * rear hills-> top   x 0.50
 * front hills-> stays fixed
 * title     -> margin-right x 4
 * title     -> margin-top  x 1.5
 * button    -> margin-top  x 1.5
 * header    -> top        x 0.5
 */
window.addEventListener('scroll', () => {
  const value = window.scrollY;

  if (stars) stars.style.left = `${value * 0.25}px`;
  if (moon) moon.style.top = `${18 + value * 0.105}%`;
  if (mountainsBehind) mountainsBehind.style.bottom = `${-2 - value * 0.05}%`;
  if (mountainsFront) mountainsFront.style.bottom = '-2%';

  if (text) {
    text.style.marginRight = `${value * 0.35}px`;
    text.style.marginTop = `${value * 0.15}px`;
  }

  if (btn) {
    btn.style.marginTop = `${36 + value * 0.08}px`;
  }

  if (header) {
    header.style.top = `${value * 0.02}px`;
  }

  updateActiveLink();
}, { passive: true });

function updateActiveLink() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;

  let activeId = 'home';

  sections.forEach(section => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id || 'documentation';
    }
  });

  navLinks.forEach(link => {
    const target = link.getAttribute('href').slice(1);
    const isActive =
      target === activeId ||
      (target === 'documentation' && activeId !== 'home' && activeId !== 'team') ||
      (target === 'team' && activeId === 'team');

    link.classList.toggle('active', isActive);
  });
}

updateActiveLink();
