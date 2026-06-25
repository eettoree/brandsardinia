// ============================================================
// preloader.js — Gestione preloader BrandSardinia
// ============================================================

(function () {
  'use strict';

  function runPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-bar');
    const progressText = document.getElementById('preloader-percent');

    if (!preloader) return;

    let progress = 0;
    const duration = 2200; // ms totali
    const interval = 30;   // ms per step
    const steps = duration / interval;
    const increment = 100 / steps;

    // Aggiorna la barra progressivamente con leggera accelerazione
    const timer = setInterval(() => {
      // Easing: più lenta all'inizio e alla fine
      const easedStep = increment * (1 + Math.sin(Math.PI * (progress / 100) - Math.PI / 2) * 0.3);
      progress = Math.min(progress + easedStep, 100);

      if (progressBar) {
        progressBar.style.width = progress.toFixed(1) + '%';
      }
      if (progressText) {
        progressText.textContent = Math.floor(progress) + '%';
      }

      if (progress >= 100) {
        clearInterval(timer);
        // Piccola pausa poi fade out
        setTimeout(fadeOutPreloader, 300);
      }
    }, interval);
  }

  function fadeOutPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      initHero();
      return;
    }

    preloader.style.transition = 'opacity 0.6s ease';
    preloader.style.opacity = '0';

    setTimeout(() => {
      preloader.style.display = 'none';
      initHero();
    }, 650);
  }

  // Avvia al caricamento DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloader);
  } else {
    runPreloader();
  }
})();
