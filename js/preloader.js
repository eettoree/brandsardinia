// ============================================================
// preloader.js — Preloader BrandSardinia
// Logo SVG rivelato dal basso verso l'alto in base alla percentuale
// ============================================================

(function () {
  'use strict';

  function runPreloader() {
    const preloader   = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-bar');
    const progressPct = document.getElementById('preloader-percent');
    const logoSvg     = document.getElementById('preloader-logo-svg');

    if (!preloader) return;

    let progress = 0;
    const duration  = 2200;
    const interval  = 30;
    const steps     = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      const easedStep = increment * (1 + Math.sin(Math.PI * (progress / 100) - Math.PI / 2) * 0.3);
      progress = Math.min(progress + easedStep, 100);

      // Barra orizzontale
      if (progressBar) progressBar.style.width = progress.toFixed(1) + '%';
      if (progressPct) progressPct.textContent = Math.floor(progress) + '%';

      // Logo: clip-path inset dall'alto — parte da 100% (nascosto) scende a 0% (visibile)
      if (logoSvg) {
        const clip = (100 - progress).toFixed(2);
        logoSvg.style.clipPath = `inset(${clip}% 0 0 0)`;
      }

      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(fadeOutPreloader, 280);
      }
    }, interval);
  }

  function fadeOutPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) { initHero(); return; }

    preloader.style.transition = 'opacity 0.55s ease';
    preloader.style.opacity = '0';

    setTimeout(() => {
      preloader.style.display = 'none';
      initHero();
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloader);
  } else {
    runPreloader();
  }
})();
