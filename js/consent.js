// ============================================================
// consent.js — Consenso GDPR + raccolta dati di domanda anonima
// ------------------------------------------------------------
// Fondamenta privacy-first (nessun backend, nessun dato personale):
//  - banner di consenso granulare (necessari sempre attivi + "dati di
//    domanda" opt-in), revocabile in ogni momento dal footer;
//  - privacy policy consultabile;
//  - API Consent.logDemand(): registra SOLO segnali anonimi e aggregati
//    e SOLO dopo consenso esplicito. Finche' non c'e' backend, gli
//    eventi restano in un buffer locale cap-limitato (bs_demand_q),
//    pronti per un futuro endpoint di raccolta.
// Direttiva: mai emoji. Tema light, accento rosso, coerente col design.
// ============================================================
(function () {
  'use strict';

  var STORE_KEY = 'bs_consent';
  var QUEUE_KEY = 'bs_demand_q';
  var POLICY_VERSION = 1;      // incrementare quando cambia la policy -> riproporre il consenso
  var QUEUE_MAX = 200;

  // ---- Stato consenso ---------------------------------------
  function readState() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (s && s.v === POLICY_VERSION) return s;
    } catch (e) { /* storage non disponibile */ }
    return null;
  }
  function writeState(domanda) {
    var s = { v: POLICY_VERSION, ts: new Date().toISOString(), necessario: true, domanda: !!domanda };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* ignora */ }
    return s;
  }

  var Consent = {
    get: function (cat) {
      if (cat === 'necessario') return true;
      var s = readState();
      return !!(s && s[cat]);
    },
    state: readState,
    // Registra un segnale di domanda ANONIMO e aggregato (solo con consenso).
    // payload deve contenere SOLO dati non personali (zona, stagione, categoria...).
    logDemand: function (type, payload) {
      if (!Consent.get('domanda')) return false;
      var evt = { t: String(type || 'event'), s: currentSeason(), ts: Date.now() };
      if (payload && typeof payload === 'object') {
        // whitelist di campi non personali
        ['zona', 'periodo', 'categoria', 'lingua', 'sezione', 'filtro', 'valore'].forEach(function (k) {
          if (payload[k] != null) evt[k] = String(payload[k]).slice(0, 60);
        });
      }
      try {
        var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        q.push(evt);
        if (q.length > QUEUE_MAX) q = q.slice(q.length - QUEUE_MAX);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
      } catch (e) { /* ignora */ }
      return true;
    },
    show: function () { openPrefs(); }
  };
  window.Consent = Consent;

  function currentSeason() {
    var m = new Date().getMonth() + 1;
    return [12, 1, 2].indexOf(m) >= 0 ? 'inverno' : [3, 4, 5].indexOf(m) >= 0 ? 'primavera' : [6, 7, 8].indexOf(m) >= 0 ? 'estate' : 'autunno';
  }

  // ---- Traduzione locale del sotto-albero --------------------
  function T(key) { return (typeof t === 'function') ? t(key) : key; }
  function applyI18n(root) {
    if (!root) return;
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = T(el.getAttribute('data-i18n')); });
  }

  // ---- Costruzione UI ----------------------------------------
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function buildBanner() {
    var b = el('div', 'bs-consent-banner', ''
      + '<div class="bs-consent-inner">'
      + '  <div class="bs-consent-text">'
      + '    <strong data-i18n="consent.title">Rispettiamo la tua privacy</strong>'
      + '    <p data-i18n="consent.body">Usiamo solo cookie tecnici necessari. Con il tuo consenso raccogliamo segnali di navigazione anonimi e aggregati per capire quando e dove c\'e\' interesse per la Sardegna. Nessun dato personale, nessuna profilazione.</p>'
      + '  </div>'
      + '  <div class="bs-consent-actions">'
      + '    <button type="button" class="btn btn-outline bs-c-reject" data-i18n="consent.reject">Solo necessari</button>'
      + '    <button type="button" class="btn btn-outline bs-c-prefs" data-i18n="consent.customize">Personalizza</button>'
      + '    <button type="button" class="btn btn-primary bs-c-accept" data-i18n="consent.accept">Accetta</button>'
      + '  </div>'
      + '</div>');
    b.querySelector('.bs-c-accept').addEventListener('click', function () { writeState(true); closeBanner(); });
    b.querySelector('.bs-c-reject').addEventListener('click', function () { writeState(false); closeBanner(); });
    b.querySelector('.bs-c-prefs').addEventListener('click', function () { openPrefs(); });
    applyI18n(b);
    return b;
  }

  var bannerEl = null;
  function showBanner() {
    if (bannerEl || readState()) return;
    bannerEl = buildBanner();
    document.body.appendChild(bannerEl);
    requestAnimationFrame(function () { bannerEl.classList.add('is-visible'); });
  }
  function closeBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('is-visible');
    var ref = bannerEl; bannerEl = null;
    setTimeout(function () { if (ref && ref.parentNode) ref.parentNode.removeChild(ref); }, 300);
  }

  // ---- Modale generica ---------------------------------------
  function openModal(contentNode) {
    var ov = el('div', 'bs-modal-overlay');
    var panel = el('div', 'bs-modal-panel');
    var close = el('button', 'bs-modal-close');
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';
    panel.appendChild(close);
    panel.appendChild(contentNode);
    ov.appendChild(panel);
    function dismiss() {
      ov.classList.remove('is-visible');
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 250);
    }
    close.addEventListener('click', dismiss);
    ov.addEventListener('click', function (e) { if (e.target === ov) dismiss(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', esc); } });
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('is-visible'); });
    return { overlay: ov, dismiss: dismiss };
  }

  // ---- Preferenze consenso -----------------------------------
  function openPrefs() {
    var s = readState();
    var domandaOn = s ? !!s.domanda : false;
    var c = el('div', 'bs-consent-prefs', ''
      + '<h2 data-i18n="consent.prefs_title">Preferenze di privacy</h2>'
      + '<div class="bs-pref-row">'
      + '  <div class="bs-pref-info"><strong data-i18n="consent.cat_necessary">Necessari</strong>'
      + '    <span data-i18n="consent.cat_necessary_desc">Indispensabili al funzionamento del sito (lingua, preferenze). Sempre attivi.</span></div>'
      + '  <span class="bs-pref-fixed" data-i18n="consent.always_on">Sempre attivi</span>'
      + '</div>'
      + '<div class="bs-pref-row">'
      + '  <div class="bs-pref-info"><strong data-i18n="consent.cat_demand">Dati di domanda (anonimi)</strong>'
      + '    <span data-i18n="consent.cat_demand_desc">Segnali aggregati e anonimi su zone e periodi di interesse, per migliorare l\'offerta e la destagionalizzazione. Nessun dato personale, nessuna profilazione.</span></div>'
      + '  <label class="bs-switch"><input type="checkbox" class="bs-toggle-demand"' + (domandaOn ? ' checked' : '') + '><span class="bs-switch-track"></span></label>'
      + '</div>'
      + '<div class="bs-prefs-actions">'
      + '  <button type="button" class="btn btn-ghost bs-open-privacy" data-i18n="consent.read_policy">Leggi la privacy policy</button>'
      + '  <button type="button" class="btn btn-primary bs-prefs-save" data-i18n="consent.save">Salva preferenze</button>'
      + '</div>');
    var modal = openModal(c);
    applyI18n(c);
    c.querySelector('.bs-prefs-save').addEventListener('click', function () {
      writeState(c.querySelector('.bs-toggle-demand').checked);
      modal.dismiss();
      closeBanner();
    });
    c.querySelector('.bs-open-privacy').addEventListener('click', function () { openPrivacy(); });
  }

  // ---- Privacy policy ----------------------------------------
  // Corpo in italiano (contenuto legale: traduzione demandata a fase LLM,
  // coerente con la decisione UI-only i18n). I TITOLARE_* sono da compilare.
  function openPrivacy() {
    var c = el('div', 'bs-privacy', ''
      + '<h2 data-i18n="consent.policy_title">Informativa sulla privacy</h2>'
      + '<p class="bs-privacy-note" data-i18n="consent.policy_lang_note">Documento in italiano. Le traduzioni saranno disponibili a breve.</p>'
      + '<div class="bs-privacy-body">'
      + '<p><em>Ultimo aggiornamento: agosto 2026 — versione ' + POLICY_VERSION + '</em></p>'
      + '<h3>1. Titolare del trattamento</h3>'
      + '<p>[RAGIONE SOCIALE / NOME], [indirizzo], email: [email di contatto]. Per esercitare i tuoi diritti scrivi a questo indirizzo.</p>'
      + '<h3>2. Quali dati trattiamo</h3>'
      + '<p>Non raccogliamo dati che ti identificano personalmente per navigare il sito. Trattiamo:</p>'
      + '<ul>'
      + '<li><strong>Dati tecnici necessari:</strong> la tua preferenza di lingua e la scelta sul consenso, salvate solo nel tuo browser (localStorage). Base giuridica: legittimo interesse al funzionamento del sito.</li>'
      + '<li><strong>Dati di domanda anonimi (solo con consenso):</strong> segnali aggregati e non identificativi su zone, periodi e categorie di interesse (es. "interesse per il nord-est in inverno"), usati in forma statistica per capire la domanda turistica e favorire la destagionalizzazione. Non sono collegati alla tua identita\' e non permettono di profilarti. Base giuridica: consenso (art. 6.1.a GDPR), revocabile in ogni momento.</li>'
      + '<li><strong>Chat SardinAI:</strong> i messaggi che invii all\'assistente vengono trasmessi al fornitore del modello di intelligenza artificiale (Google, servizio Gemini) al solo scopo di generare la risposta. Non inserire dati personali o sensibili nella chat. Base giuridica: esecuzione del servizio richiesto da te.</li>'
      + '</ul>'
      + '<h3>3. Destinatari e trasferimenti</h3>'
      + '<p>Hosting su Vercel; generazione delle risposte AI su Google (Gemini). Questi fornitori possono trattare i dati anche fuori dall\'Unione Europea, sulla base delle garanzie previste dal GDPR (clausole contrattuali standard). Non vendiamo ne\' cediamo dati a terzi per marketing.</p>'
      + '<h3>4. Conservazione</h3>'
      + '<p>Le preferenze restano nel tuo browser finche\' non le cancelli o revochi il consenso. I segnali di domanda anonimi sono conservati in forma aggregata per finalita\' statistiche.</p>'
      + '<h3>5. I tuoi diritti</h3>'
      + '<p>Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilita\' (art. 15-22 GDPR) e di revocare il consenso in qualsiasi momento dal link "Preferenze privacy" a fondo pagina, con la stessa facilita\' con cui lo hai prestato. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali.</p>'
      + '<h3>6. Trasparenza sull\'intelligenza artificiale</h3>'
      + '<p>SardinAI e\' un assistente basato su intelligenza artificiale generativa. Le risposte possono contenere errori o imprecisioni: verifica sempre le informazioni importanti sulle fonti ufficiali. L\'uso dell\'AI e\' segnalato in modo chiaro nell\'interfaccia, in conformita\' al Regolamento europeo sull\'intelligenza artificiale (AI Act).</p>'
      + '</div>');
    openModal(c);
    applyI18n(c);
  }

  // ---- Footer legale (revoca sempre accessibile) -------------
  function buildFooter() {
    var f = el('footer', 'bs-legal-footer', ''
      + '<button type="button" class="bs-legal-link bs-open-privacy" data-i18n="consent.privacy">Privacy</button>'
      + '<span class="bs-legal-sep">&middot;</span>'
      + '<button type="button" class="bs-legal-link bs-open-prefs" data-i18n="consent.manage">Preferenze privacy</button>');
    f.querySelector('.bs-open-privacy').addEventListener('click', function () { openPrivacy(); });
    f.querySelector('.bs-open-prefs').addEventListener('click', function () { openPrefs(); });
    applyI18n(f);
    document.body.appendChild(f);
  }

  // ---- Hook di raccolta anonima (event delegation, no PII) ----
  // Non modifica gli altri moduli: intercetta i click gia' presenti.
  function wireDemandHooks() {
    document.addEventListener('click', function (e) {
      if (!Consent.get('domanda')) return;
      var card = e.target.closest && e.target.closest('[data-section]');
      if (card) { Consent.logDemand('section', { sezione: card.getAttribute('data-section'), lingua: (typeof getCurrentLang === 'function' ? getCurrentLang() : '') }); return; }
      var pill = e.target.closest && e.target.closest('.filter-pill, .map-filter, [data-filter]');
      if (pill) { Consent.logDemand('filtro', { filtro: (pill.getAttribute('data-filter') || pill.textContent || '').trim(), lingua: (typeof getCurrentLang === 'function' ? getCurrentLang() : '') }); }
    }, true);
  }

  // ---- Init --------------------------------------------------
  function init() {
    buildFooter();
    wireDemandHooks();
    showBanner();
    // ritraduci i nostri elementi quando cambia lingua
    document.addEventListener('langChanged', function () {
      document.querySelectorAll('.bs-consent-banner, .bs-legal-footer, .bs-modal-overlay').forEach(applyI18n);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
