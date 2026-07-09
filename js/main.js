// ============================================================
// main.js — Controller principale BrandSardinia
// ============================================================

'use strict';

// Stato globale dell'app
const AppState = {
  currentSection: null,
  lang: 'IT',
  mapInitialized: false,
  toolsInitialized: false
};

// ─── INIT HERO ───────────────────────────────────────────────
function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  document.body.classList.add('world-active');
  hero.style.display = 'flex';
  applyTranslations();

  const sardSil  = document.getElementById('sardinia-silhouette');
  const tagline  = hero.querySelector('.hero-tagline');
  const title    = hero.querySelector('.hero-title');
  const subtitle = hero.querySelector('.hero-subtitle');
  const btnStart = document.getElementById('btn-start');
  const deco     = hero.querySelector('.hero-bottom-deco');
  const langSel  = hero.querySelector('.lang-selector');

  // Stato iniziale: tutti gli elementi hero nascosti
  gsap.set([tagline, title, subtitle, btnStart, deco, langSel], { opacity: 0 });
  gsap.set(title,    { x: -28 });
  gsap.set(subtitle, { y: 28 });
  gsap.set(tagline,  { y: -28 });
  gsap.set(btnStart, { y: 18 });
  gsap.set(deco,     { y: 10 });

  // Sardinia inizia a piena opacità (default CSS)
  if (sardSil) gsap.set(sardSil, { opacity: 1 });

  const tl = gsap.timeline();

  // Dopo 1 secondo: sardinia passa da 100% a 41% ease-out
  tl.to(sardSil, { opacity: 0.41, duration: 0.8, ease: 'power2.out' }, 1.0);

  // Logo SVG: ingresso da sinistra verso destra
  tl.to(title, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.1');

  // Sottotitolo: dal basso verso l'alto
  tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  // Tagline: dall'alto verso il basso (opposto al sottotitolo)
  tl.to(tagline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');

  // Bottone CTA
  tl.to(btnStart, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

  // Scritta e freccetta animata
  tl.to(deco, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');

  // Lang selector
  tl.to(langSel, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '<');

  // Listener bottone start
  if (btnStart) btnStart.addEventListener('click', transitionToMainApp);

  // Init custom language dropdown
  initLangDropdown();
}

// ─── CUSTOM LANG DROPDOWN ────────────────────────────────────
const LANG_FLAGS = { IT: '🇮🇹', EN: '🇬🇧', ES: '🇪🇸', FR: '🇫🇷', DE: '🇩🇪' };

function initLangDropdown() {
  document.querySelectorAll('.lang-selector').forEach(container => {
    const btn  = container.querySelector('.lang-btn');
    const menu = container.querySelector('.lang-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeAllLangMenus();
      if (!isOpen) {
        menu.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    menu.querySelectorAll('.lang-item').forEach(item => {
      item.addEventListener('click', () => {
        const lang = item.dataset.lang;
        setLangDropdownValue(lang);
        setLanguage(lang);
        applyTranslations();
        document.querySelectorAll('.lang-select-all').forEach(s => s.value = lang);
        closeAllLangMenus();
      });
    });
  });

  document.addEventListener('click', closeAllLangMenus);
}

function closeAllLangMenus() {
  document.querySelectorAll('.lang-menu.open').forEach(menu => {
    menu.classList.remove('open');
    const btn = menu.previousElementSibling;
    if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });
}

function setLangDropdownValue(lang) {
  document.querySelectorAll('.lang-selector').forEach(container => {
    const flagEl = container.querySelector('.lang-btn .lang-flag');
    const codeEl = container.querySelector('.lang-btn .lang-code');
    if (flagEl) flagEl.textContent = LANG_FLAGS[lang] || lang;
    if (codeEl) codeEl.textContent = lang;
    container.querySelectorAll('.lang-item').forEach(item => {
      item.classList.toggle('active', item.dataset.lang === lang);
    });
  });
}

// ─── TRANSIZIONE HERO → MAIN APP ─────────────────────────────
function transitionToMainApp() {
  const hero = document.getElementById('hero');
  const mainApp = document.getElementById('main-app');
  const btnStart = document.getElementById('btn-start');

  if (!hero || !mainApp) return;

  // Disabilita bottone durante animazione
  if (btnStart) btnStart.style.pointerEvents = 'none';

  const tl = gsap.timeline();

  // Hero slide up ed esce
  tl.to(hero, {
    y: '-100vh',
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut'
  });

  // Main app entra dal basso
  tl.set(mainApp, { display: 'block', y: '100vh', opacity: 0 });
  tl.to(mainApp, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: 'power2.out'
  }, '-=0.2');

  // Appaiono le card in stagger
  tl.fromTo('.selector-card',
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.5,
      stagger: 0.12,
      ease: 'back.out(1.4)'
    }, '-=0.3'
  );

  // Titolo sezione selector
  tl.fromTo('.selector-title',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    '-=0.5'
  );

  tl.call(() => {
    hero.style.display = 'none';
    hero.style.transform = '';
    hero.style.opacity = '';
    applyTranslations();
    renderLandingSections();
  });

  // Bind eventi card
  bindSelectorCards();
  bindBackButtons();
  bindLangSelectors();
}

// ─── CARD SELECTOR ───────────────────────────────────────────
function bindSelectorCards() {
  const cards = document.querySelectorAll('.selector-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const section = card.getAttribute('data-section');
      if (section) showSection(section);
    });
  });
}

function bindBackButtons() {
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      goBackToSelector();
    });
  });
}

function bindLangSelectors() {
  document.querySelectorAll('.lang-select-all').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const lang = e.target.value;
      setLanguage(lang);
      document.querySelectorAll('.lang-select-all').forEach(s => s.value = lang);
      setLangDropdownValue(lang);
      applyTranslations();
    });
  });
}

// ─── NAVIGAZIONE SEZIONI ─────────────────────────────────────
function showSection(name) {
  AppState.currentSection = name;
  document.body.classList.remove('world-active');

  // Dissolvi il mondo sardegna
  const world = document.getElementById('sardinia-world');
  if (world && world.style.display !== 'none') {
    if (name === 'map') {
      world.classList.add('dissolving');
      setTimeout(() => {
        world.style.display = 'none';
        world.style.opacity = '';
        world.classList.remove('dissolving');
      }, 1100);
    } else {
      gsap.to(world, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => {
        world.style.display = 'none';
        world.style.opacity = '';
      }});
    }
  }

  const selector = document.getElementById('section-selector');
  const allSections = document.querySelectorAll('.main-section');

  // Nascondi selector
  gsap.to(selector, {
    opacity: 0,
    y: -30,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      selector.style.display = 'none';

      // Nascondi tutte le sezioni
      allSections.forEach(s => {
        s.style.display = 'none';
        s.style.opacity = '0';
      });

      // Mostra la sezione scelta
      const targetSection = document.getElementById(name + '-section');
      if (targetSection) {
        targetSection.style.display = 'block';
        gsap.fromTo(targetSection,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        // Init sezione specifica
        if (name === 'map' && !AppState.mapInitialized) {
          AppState.mapInitialized = true;
          setTimeout(() => { initMap(); initMapFilters(); }, 150);
        }
        if (name === 'sardinai') {
          initSardinAI();
        }
        if (name === 'tools' && !AppState.toolsInitialized) {
          AppState.toolsInitialized = true;
          initTools();
        }
      }
    }
  });
}

function goBackToSelector() {
  const selector = document.getElementById('section-selector');
  const allSections = document.querySelectorAll('.main-section');

  // Nascondi sezione corrente
  allSections.forEach(s => {
    if (s.style.display !== 'none') {
      gsap.to(s, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => { s.style.display = 'none'; }
      });
    }
  });

  // Dopo il fade della sezione: riporta world-active e sardinia-world
  setTimeout(() => {
    document.body.classList.add('world-active');
    const world   = document.getElementById('sardinia-world');
    const sardSil = document.getElementById('sardinia-silhouette');
    if (sardSil) gsap.set(sardSil, { opacity: 1 });
    if (world) {
      world.style.display = 'flex';
      world.style.opacity = '0';
      gsap.to(world, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }

    selector.style.display = 'flex';
    selector.style.opacity = '0';
    gsap.to(selector, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

    gsap.fromTo('.selector-card',
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.4)' }
    );
  }, 350);

  AppState.currentSection = null;
}

// ─── APPLICAZIONE TRADUZIONI ─────────────────────────────────
function applyTranslations() {
  // Elementi con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// ─── LANDING SECTIONS ────────────────────────────────────────
const BEACH_HIGHLIGHTS = [
  { name: 'Cala Goloritzé', location: 'Baunei, Ogliastra', desc: 'Patrimonio UNESCO. Arco di roccia calcarea, ghiaione bianco, acque cristalline.', cost: '7€', access: 'A piedi o via mare', gradient: 'linear-gradient(135deg,#0098b4 0%,#00c9b8 50%,#a8e6d8 100%)', poi: 'cala-goloritzé' },
  { name: 'La Pelosa', location: 'Stintino, Sassari', desc: 'Sabbia bianchissima e acque turchesi con vista sulla Torre Spagnola del 1500.', cost: '3,50€', access: 'Navetta obbligatoria', gradient: 'linear-gradient(135deg,#00b4d8 0%,#90e0ef 50%,#caf0f8 100%)', poi: 'la-pelosa' },
  { name: 'Spiaggia del Principe', location: 'Arzachena, Costa Smeralda', desc: 'La preferita dell\'Aga Khan. Granito rosa, sabbia fine, acque verde smeraldo.', cost: 'Libera', access: 'Auto + 800m a piedi', gradient: 'linear-gradient(135deg,#48cae4 0%,#90e0ef 50%,#e8f9ff 100%)', poi: 'spiaggia-principe' },
  { name: 'Cala Mariolu', location: 'Baunei, Ogliastra', desc: 'Ciottoli bianchi levigati e acque azzurro intenso. Votata tra le 10 spiagge più belle d\'Italia.', cost: 'Libera', access: 'Solo via mare', gradient: 'linear-gradient(135deg,#0077b6 0%,#00b4d8 50%,#90e0ef 100%)', poi: 'cala-mariolu' },
  { name: 'Is Arutas', location: 'Cabras, Oristano', desc: 'Granelli di quarzo bianco e rosa a chicco di riso, unica in Europa. Area protetta.', cost: 'Libera', access: 'Navetta estiva', gradient: 'linear-gradient(135deg,#8ecae6 0%,#219ebc 50%,#023047 100%)', poi: 'is-arutas' },
  { name: 'Su Giudeu', location: 'Domus de Maria, Cagliari', desc: 'Dune di sabbia bianca, isolotto raggiungibile a nuoto. La Saint-Tropez sarda.', cost: 'Libera', access: 'Auto + 1 km dune', gradient: 'linear-gradient(135deg,#52b788 0%,#74c69d 50%,#b7e4c7 100%)', poi: 'su-giudeu' }
];

const EVENT_HIGHLIGHTS = [
  { name: 'Sa Sartiglia', location: 'Oristano', date: '15–17 Feb', month: 'FEB', day: '15', desc: 'La giostra medievale più spettacolare della Sardegna. 75a edizione. Biglietti 10-55€ su Tick@.', gradient: 'linear-gradient(135deg,#e63946 0%,#c1121f 100%)', tool: 'calendar' },
  { name: 'Time in Jazz', location: 'Berchidda, Sassari', date: '8–16 Ago', month: 'AGO', day: '8', desc: 'Festival jazz internazionale. Tema 2026: "Kind of Blue" di Miles Davis. Venue outdoor spettacolari.', gradient: 'linear-gradient(135deg,#1d3557 0%,#457b9d 100%)', tool: 'calendar' },
  { name: 'Faradda di li Candareri', location: 'Sassari', date: '14 Agosto', month: 'AGO', day: '14', desc: 'Patrimonio UNESCO. Processione dei candelieri. 14 agosto, vigilia di Ferragosto.', gradient: 'linear-gradient(135deg,#f4a261 0%,#e76f51 100%)', tool: 'calendar' },
  { name: 'Dromos Festival', location: 'Oristano e Sinis', date: '18 Lug – 16 Ago', month: 'LUG', day: '18', desc: 'Carmen Consoli, Subsonica, Mario Biondi. Musica tra nuraghi e siti archaeologici.', gradient: 'linear-gradient(135deg,#6d28d9 0%,#a855f7 100%)', tool: 'calendar' }
];

const EXPERIENCE_HIGHLIGHTS = [
  { name: 'Selvaggio Blu', location: 'Supramonte, Ogliastra', desc: 'Il trekking più bello d\'Italia. 7 giorni, 45 km tra pareti e calette inaccessibili.', cost: '800–1200€ tutto incluso', gradient: 'linear-gradient(135deg,#2d6a4f 0%,#52b788 50%,#95d5b2 100%)', poi: 'selvaggio-blu' },
  { name: 'Kayak Golfo di Orosei', location: 'Cala Gonone, Nuoro', desc: 'Pagaiata da Cala Gonone a Cala Luna. La più bella navigazione costiera con pagaia d\'Italia.', cost: '50–140€/persona', gradient: 'linear-gradient(135deg,#0077b6 0%,#00b4d8 100%)', poi: 'kayak-orosei' },
  { name: 'Tour Arcipelago Maddalena', location: 'La Maddalena, OT', desc: 'Gozzo tra le 7 isole UNESCO: Caprera, Spargi, Budelli (Spiaggia Rosa), Santa Maria.', cost: '60–120€/persona', gradient: 'linear-gradient(135deg,#48cae4 0%,#ade8f4 100%)', poi: 'giro-maddalena' },
  { name: 'Kitesurf Porto Pollo', location: 'Palau, Olbia-Tempio', desc: 'Uno dei migliori spot kitesurf d\'Europa. Maestrale costante nello stretto Sardegna-Corsica.', cost: 'Da 120€ corso base', gradient: 'linear-gradient(135deg,#7209b7 0%,#3a0ca3 100%)', poi: 'kitesurf-porto-pollo' }
];

function buildBeachCard(b) {
  return `
    <div class="preview-card" onclick="openMapAtPoi('${b.poi}')">
      <div class="preview-photo">
        <div class="preview-photo-gradient" style="background:${b.gradient};width:100%;height:100%;"></div>
        <div class="preview-photo-overlay"></div>
        <div class="preview-photo-caption">
          <span class="preview-badge">Spiaggia</span>
          <div class="preview-photo-title">${b.name}</div>
          <div class="preview-photo-loc">${b.location}</div>
        </div>
      </div>
      <div class="preview-body">
        <div class="preview-card-sub">${b.desc}</div>
        <div class="preview-card-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><circle cx="8" cy="6" r="3"/><path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z"/></svg>
          ${b.access} &nbsp;·&nbsp; ${b.cost}
        </div>
      </div>
    </div>`;
}

function buildEventCard(e) {
  return `
    <div class="preview-card" onclick="openToolsDirect('calendar')">
      <div class="preview-photo" style="height:140px;">
        <div style="width:100%;height:100%;background:${e.gradient};"></div>
        <div class="preview-photo-overlay"></div>
        <div class="preview-photo-caption">
          <span class="preview-badge">Evento</span>
          <div class="preview-photo-title">${e.name}</div>
          <div class="preview-photo-loc">${e.location}</div>
        </div>
      </div>
      <div class="preview-date-strip">
        <div class="preview-date-day">${e.day}</div>
        <div class="preview-date-right">
          <div class="preview-date-month">${e.month} 2026</div>
          <div class="preview-date-period">${e.date}</div>
        </div>
      </div>
      <div class="preview-body">
        <div class="preview-card-sub">${e.desc}</div>
        <div class="preview-card-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M2 7h12M6 2v2M10 2v2"/></svg>
          Calendario completo
        </div>
      </div>
    </div>`;
}

function buildExperienceCard(x) {
  return `
    <div class="preview-card" onclick="openMapAtPoi('${x.poi}')">
      <div class="preview-photo">
        <div class="preview-photo-gradient" style="background:${x.gradient};width:100%;height:100%;"></div>
        <div class="preview-photo-overlay"></div>
        <div class="preview-photo-caption">
          <span class="preview-badge">Esperienza</span>
          <div class="preview-photo-title">${x.name}</div>
          <div class="preview-photo-loc">${x.location}</div>
        </div>
      </div>
      <div class="preview-body">
        <div class="preview-card-sub">${x.desc}</div>
        <div class="preview-card-meta">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><path d="M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5z"/></svg>
          ${x.cost}
        </div>
      </div>
    </div>`;
}

function buildCarousel(id, cards) {
  return `
    <div class="carousel-wrap" id="carousel-${id}">
      <div class="carousel-track-outer">
        <div class="carousel-track" id="track-${id}">
          ${cards}
        </div>
      </div>
      <div class="carousel-controls">
        <div class="carousel-dots" id="dots-${id}"></div>
        <button class="carousel-btn" id="prev-${id}" aria-label="Precedente">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <button class="carousel-btn" id="next-${id}" aria-label="Successivo">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M6 3l5 5-5 5"/></svg>
        </button>
      </div>
    </div>`;
}

function initCarousel(id) {
  const track = document.getElementById('track-' + id);
  const outer = track ? track.parentElement : null;
  const prevBtn = document.getElementById('prev-' + id);
  const nextBtn = document.getElementById('next-' + id);
  const dotsEl = document.getElementById('dots-' + id);
  if (!track || !outer) return;

  const cards = track.querySelectorAll('.preview-card');
  let current = 0;

  function getVisible() {
    const w = outer.offsetWidth;
    if (w < 540) return 1;
    if (w < 860) return 2;
    if (w < 1200) return 3;
    return 4;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Vai a ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    const cardW = cards[0] ? cards[0].offsetWidth : 0;
    const gap = 20;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex();
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  // Resize
  window.addEventListener('resize', () => { buildDots(); goTo(current); });

  buildDots();
  goTo(0);
}

function renderLandingSections() {
  const container = document.getElementById('landing-sections');
  if (!container) return;

  container.innerHTML = `
    <section class="landing-section" id="ls-spiagge">
      <div class="landing-section-head">
        <div>
          <div class="landing-label">Spiagge</div>
          <div class="landing-title">Le spiagge da non perdere</div>
        </div>
        <button class="landing-cta" onclick="showSection('map')">
          Vedi sulla mappa
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
      </div>
      ${buildCarousel('spiagge', BEACH_HIGHLIGHTS.map(buildBeachCard).join(''))}
    </section>

    <section class="landing-section" id="ls-eventi">
      <div class="landing-section-head">
        <div>
          <div class="landing-label">Eventi 2026</div>
          <div class="landing-title">Prossimi eventi da vivere</div>
        </div>
        <button class="landing-cta" onclick="openToolsDirect('calendar')">
          Calendario completo
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
      </div>
      ${buildCarousel('eventi', EVENT_HIGHLIGHTS.map(buildEventCard).join(''))}
    </section>

    <section class="landing-section" id="ls-esperienze">
      <div class="landing-section-head">
        <div>
          <div class="landing-label">Esperienze</div>
          <div class="landing-title">Avventure uniche nell'isola</div>
        </div>
        <button class="landing-cta" onclick="showSection('map')">
          Esplora sulla mappa
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
      </div>
      ${buildCarousel('esperienze', EXPERIENCE_HIGHLIGHTS.map(buildExperienceCard).join(''))}
    </section>
  `;

  // Init caroselli
  ['spiagge', 'eventi', 'esperienze'].forEach(id => initCarousel(id));

  // In-view observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('.preview-card').forEach((c, i) => {
          c.style.transitionDelay = `${i * 0.06}s`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  container.querySelectorAll('.landing-section').forEach(s => observer.observe(s));
}

function openMapAtPoi(poiId) {
  showSection('map');
  // Aspetta init mappa poi flyTo sul poi
  const tryFly = () => {
    if (typeof MAP_POI !== 'undefined' && typeof sardMap !== 'undefined' && sardMap) {
      const poi = MAP_POI.find(p => p.id === poiId);
      if (poi) setTimeout(() => showMapInfoPanel(poi), 800);
    } else {
      setTimeout(tryFly, 300);
    }
  };
  setTimeout(tryFly, 600);
}

function openToolsDirect(toolName) {
  showSection('tools');
  setTimeout(() => {
    if (typeof openToolSection === 'function') openToolSection(toolName);
  }, 500);
}

// ─── UTILITY ─────────────────────────────────────────────────
// Espone goBackToSelector globalmente per uso inline
window.goBackToSelector = goBackToSelector;
window.showSection = showSection;
window.applyTranslations = applyTranslations;
window.openMapAtPoi = openMapAtPoi;
window.openToolsDirect = openToolsDirect;
