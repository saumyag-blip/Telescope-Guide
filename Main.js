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
