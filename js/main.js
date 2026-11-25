// Scroll progress bar — fills teal -> amber as the page is read,
// echoing the Bortle scale's dark-sky-to-light-pollution gradient.
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Generative sky swatches — sample cards, compare cards, and Bortle hero panels.
// Density + glow come from data-stars / data-glow / data-band / data-dynamic.
function buildSkySwatches() {
  const swatches = document.querySelectorAll('.sky-swatch');

  swatches.forEach((swatch) => {
    // Avoid double-building if script runs twice
    if (swatch.dataset.built === '1') return;
    swatch.dataset.built = '1';

    const count = parseInt(swatch.dataset.stars, 10) || 20;
    const glow = parseFloat(swatch.dataset.glow) || 0;
    const hasBand = swatch.dataset.band === 'true';
    const isDynamic = swatch.dataset.dynamic === 'true' || swatch.classList.contains('sky-swatch--hero');

    swatch.style.setProperty('--glow-strength', glow);

    if (glow > 0) {
      const glowEl = document.createElement('div');
      glowEl.className = 'sky-glow';
      swatch.appendChild(glowEl);
    }

    if (hasBand) {
      const bandEl = document.createElement('div');
      bandEl.className = 'sky-band';
      swatch.appendChild(bandEl);
    }

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star';

      // A few brighter “hero” stars on dynamic Bortle panels
      if (isDynamic && Math.random() < 0.12) {
        star.classList.add('star--bright');
      }

      const sizeBase = isDynamic ? 1.1 : 1;
      const sizeRange = isDynamic ? 1.8 : 1.4;
      const size = sizeBase + Math.random() * sizeRange;
      const top = Math.random() * 90;
      const left = Math.random() * 96;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${top}%`;
      star.style.left = `${left}%`;

      const delayMax = isDynamic ? 2.1 : 3.4;
      star.style.setProperty('--d', `${(Math.random() * delayMax).toFixed(2)}s`);
      star.style.setProperty('--o-min', (0.22 + Math.random() * 0.22).toFixed(2));
      star.style.setProperty('--o-max', (0.72 + Math.random() * 0.28).toFixed(2));

      swatch.appendChild(star);
    }
  });
}

buildSkySwatches();
