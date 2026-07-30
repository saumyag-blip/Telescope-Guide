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

// Sample-recommendation sky swatches — a tiny generative star field per
// card, density and glow driven by that location's Bortle class.
function buildSkySwatches() {
  const swatches = document.querySelectorAll('.sample-sky');

  swatches.forEach((swatch) => {
    const count = parseInt(swatch.dataset.stars, 10) || 20;
    const glow = parseFloat(swatch.dataset.glow) || 0;
    const hasBand = swatch.dataset.band === 'true';

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

      const size = 1 + Math.random() * 1.4;
      const top = Math.random() * 90;
      // Keep the brightest, densest cluster out of the bottom glow band
      // on light-polluted cards so it still reads as "sky" not "haze".
      const left = Math.random() * 96;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${top}%`;
      star.style.left = `${left}%`;
      star.style.setProperty('--d', `${(Math.random() * 3.4).toFixed(2)}s`);
      star.style.setProperty('--o-min', (0.25 + Math.random() * 0.2).toFixed(2));
      star.style.setProperty('--o-max', (0.7 + Math.random() * 0.3).toFixed(2));

      swatch.appendChild(star);
    }
  });
}

buildSkySwatches();
