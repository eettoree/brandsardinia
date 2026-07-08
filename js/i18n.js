// ============================================================
// i18n.js — Internazionalizzazione BrandSardinia
// Lingue: IT, EN, ES, FR, DE
// ============================================================

const TRANSLATIONS = {
  IT: {
    'hero.title': 'Benvenuti in BrandSardinia',
    'hero.subtitle': "L'isola più bella del Mediterraneo, raccontata da chi la vive.",
    'hero.cta': 'Inizia Esperienza',

    'nav.sardinai': 'SardinAI',
    'nav.map': 'Mappa Interattiva',
    'nav.tools': 'Tools',
    'nav.back': '← Torna al menu',

    'selector.title': 'Cosa vuoi esplorare?',
    'selector.subtitle': 'Scegli la tua esperienza',
    'selector.sardinai.title': 'SardinAI',
    'selector.sardinai.desc': 'Il tuo assistente intelligente per scoprire, vivere, conoscere e investire in Sardegna.',
    'selector.map.title': 'Mappa Interattiva',
    'selector.map.desc': 'Esplora la Sardegna in 3D con pin e filtri',
    'selector.tools.title': 'Tools',
    'selector.tools.desc': 'Spiagge live, eventi, camper e sport',

    'sardinai.welcome': "Ciao, sono SardinAI, l'assistente intelligente dedicato alla Sardegna. Posso aiutarti a scoprire territori, eventi, esperienze, imprese locali e opportunità legate all'isola: che tu voglia organizzare un viaggio, conoscere un Comune, valutare un investimento, trasferirti, lavorare da remoto o immaginare una nuova vita in Sardegna.",
    'sardinai.questions': [
      'Da quale aeroporto atterri o da dove parti?',
      'Quanti giorni hai a disposizione?',
      "Che tipo di vacanza cerchi?",
      'Qual è il tuo budget giornaliero approssimativo per persona?',
      'Con chi viaggi?',
      'Quando pensi di venire in Sardegna?'
    ],
    'sardinai.placeholder': 'Scrivi la tua risposta...',
    'sardinai.send': 'Invia',
    'sardinai.generating': 'Sto preparando il tuo itinerario personalizzato...',
    'sardinai.restart': 'Ricomincia',
    'sardinai.q1.options': ['Cagliari', 'Olbia', 'Alghero', 'Altro'],
    'sardinai.q2.placeholder': 'Es: 7',
    'sardinai.q3.options': ['Mare & Relax', 'Cultura & Storia', 'Avventura & Sport', 'Enogastronomia', 'Misto'],
    'sardinai.q4.options': ['Economico (<80€)', 'Medio (80-150€)', 'Premium (150-300€)', 'Lusso (300€+)'],
    'sardinai.q5.options': ['Solo', 'Coppia', 'Famiglia con bambini', 'Gruppo di amici'],
    'sardinai.q6.options': ['Aprile - Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre - Ottobre', 'Inverno (Nov-Mar)'],
    'sardinai.itinerary.title': 'Il tuo itinerario personalizzato',
    'sardinai.itinerary.intro': "Eccolo! Ho creato un itinerario su misura per te basato sulle tue preferenze.",

    'map.title': 'Mappa Interattiva',
    'map.filter.all': 'Tutti',
    'map.filter.spiagge': 'Spiagge',
    'map.filter.citta': 'Città',
    'map.filter.hotel': 'Hotel',
    'map.filter.ristoranti': 'Ristoranti',
    'map.filter.attrazioni': 'Attrazioni',
    'map.filter.parchi': 'Parchi',
    'map.filter.esperienze': 'Esperienze',
    'map.info.close': 'Chiudi',
    'map.info.contacts': 'Contatti',
    'map.info.web': 'Sito web',
    'map.info.rating': 'Rating',
    'map.info.price': 'Prezzo',
    'map.hint': 'Ruota con il mouse · Zoom con la rotella · Clicca sui pin',

    'tools.title': 'Tools Sardegna',
    'tools.calendar': 'Calendario Eventi',
    'tools.beaches': 'Spiagge Live',
    'tools.camper': 'Camper & Van',
    'tools.sports': 'Sport & Avventura',
    'tools.back': '← Tools',

    'tools.beaches.update': 'Aggiorna Dati',
    'tools.beaches.wind': 'Vento',
    'tools.beaches.status.great': 'Ottima',
    'tools.beaches.status.good': 'Buona',
    'tools.beaches.status.bad': 'Sconsigliata',
    'tools.beaches.updated': 'Dati aggiornati',

    'tools.calendar.filter': 'Filtra per mese',
    'tools.calendar.all': 'Tutti',

    'tools.sports.level': 'Livello',
    'tools.sports.season': 'Stagione migliore',
    'tools.sports.operators': 'Operatori',
    'tools.sports.areas': 'Aree migliori',

    'tools.camper.services': 'Servizi',
    'tools.camper.cost': 'Costo',
    'tools.camper.notes': 'Note',

    'preloader.loading': 'Caricamento in corso...'
  },

  EN: {
    'hero.title': 'Welcome to BrandSardinia',
    'hero.subtitle': 'The most beautiful island in the Mediterranean, told by those who live it.',
    'hero.cta': 'Start Experience',

    'nav.sardinai': 'SardinAI',
    'nav.map': 'Interactive Map',
    'nav.tools': 'Tools',
    'nav.back': '← Back to menu',

    'selector.title': 'What do you want to explore?',
    'selector.subtitle': 'Choose your experience',
    'selector.sardinai.title': 'SardinAI',
    'selector.sardinai.desc': 'Plan your trip with artificial intelligence',
    'selector.map.title': 'Interactive Map',
    'selector.map.desc': 'Explore Sardinia in 3D with pins and filters',
    'selector.tools.title': 'Tools',
    'selector.tools.desc': 'Live beaches, events, camper spots and sports',

    'sardinai.welcome': "Hi! I'm SardinAI, your travel assistant for Sardinia. I'll ask you a few questions to create the perfect itinerary for you.",
    'sardinai.questions': [
      'Which airport do you land at or where do you depart from?',
      'How many days do you have available?',
      'What type of holiday are you looking for?',
      'What is your approximate daily budget per person?',
      'Who are you travelling with?',
      'When are you planning to visit Sardinia?'
    ],
    'sardinai.placeholder': 'Type your answer...',
    'sardinai.send': 'Send',
    'sardinai.generating': 'Preparing your personalised itinerary...',
    'sardinai.restart': 'Start Over',
    'sardinai.q1.options': ['Cagliari', 'Olbia', 'Alghero', 'Other'],
    'sardinai.q2.placeholder': 'e.g. 7',
    'sardinai.q3.options': ['Sea & Relax', 'Culture & History', 'Adventure & Sport', 'Food & Wine', 'Mixed'],
    'sardinai.q4.options': ['Budget (<80€)', 'Mid-range (80-150€)', 'Premium (150-300€)', 'Luxury (300€+)'],
    'sardinai.q5.options': ['Solo', 'Couple', 'Family with children', 'Group of friends'],
    'sardinai.q6.options': ['April - May', 'June', 'July', 'August', 'September - October', 'Winter (Nov-Mar)'],
    'sardinai.itinerary.title': 'Your Personalised Itinerary',
    'sardinai.itinerary.intro': 'Here it is! I created a tailored itinerary based on your preferences.',

    'map.title': 'Interactive Map',
    'map.filter.all': 'All',
    'map.filter.spiagge': 'Beaches',
    'map.filter.citta': 'Cities',
    'map.filter.hotel': 'Hotels',
    'map.filter.ristoranti': 'Restaurants',
    'map.filter.attrazioni': 'Attractions',
    'map.filter.parchi': 'Parks',
    'map.filter.esperienze': 'Experiences',
    'map.info.close': 'Close',
    'map.info.contacts': 'Contacts',
    'map.info.web': 'Website',
    'map.info.rating': 'Rating',
    'map.info.price': 'Price',
    'map.hint': 'Rotate with mouse · Zoom with scroll · Click on pins',

    'tools.title': 'Sardinia Tools',
    'tools.calendar': 'Events Calendar',
    'tools.beaches': 'Live Beaches',
    'tools.camper': 'Camper & Van',
    'tools.sports': 'Sport & Adventure',
    'tools.back': '← Tools',

    'tools.beaches.update': 'Update Data',
    'tools.beaches.wind': 'Wind',
    'tools.beaches.status.great': 'Excellent',
    'tools.beaches.status.good': 'Good',
    'tools.beaches.status.bad': 'Not recommended',
    'tools.beaches.updated': 'Data updated',

    'tools.calendar.filter': 'Filter by month',
    'tools.calendar.all': 'All',

    'tools.sports.level': 'Level',
    'tools.sports.season': 'Best season',
    'tools.sports.operators': 'Operators',
    'tools.sports.areas': 'Best areas',

    'tools.camper.services': 'Services',
    'tools.camper.cost': 'Cost',
    'tools.camper.notes': 'Notes',

    'preloader.loading': 'Loading...'
  },

  ES: {
    'hero.title': 'Bienvenidos a BrandSardinia',
    'hero.subtitle': 'La isla más bella del Mediterráneo, contada por quienes la viven.',
    'hero.cta': 'Iniciar Experiencia',

    'nav.sardinai': 'SardinAI',
    'nav.map': 'Mapa Interactivo',
    'nav.tools': 'Herramientas',
    'nav.back': '← Volver al menú',

    'selector.title': '¿Qué quieres explorar?',
    'selector.subtitle': 'Elige tu experiencia',
    'selector.sardinai.title': 'SardinAI',
    'selector.sardinai.desc': 'Planifica tu viaje con inteligencia artificial',
    'selector.map.title': 'Mapa Interactivo',
    'selector.map.desc': 'Explora Cerdeña en 3D con pins y filtros',
    'selector.tools.title': 'Herramientas',
    'selector.tools.desc': 'Playas en vivo, eventos, autocaravanas y deportes',

    'sardinai.welcome': "¡Hola! Soy SardinAI, tu asistente de viaje para Cerdeña. Te haré algunas preguntas para crear el itinerario perfecto.",
    'sardinai.questions': [
      '¿En qué aeropuerto aterrizas o desde dónde partes?',
      '¿Cuántos días tienes disponibles?',
      '¿Qué tipo de vacaciones buscas?',
      '¿Cuál es tu presupuesto diario aproximado por persona?',
      '¿Con quién viajas?',
      '¿Cuándo planeas visitar Cerdeña?'
    ],
    'sardinai.placeholder': 'Escribe tu respuesta...',
    'sardinai.send': 'Enviar',
    'sardinai.generating': 'Preparando tu itinerario personalizado...',
    'sardinai.restart': 'Empezar de nuevo',
    'sardinai.q1.options': ['Cagliari', 'Olbia', 'Alghero', 'Otro'],
    'sardinai.q2.placeholder': 'Ej: 7',
    'sardinai.q3.options': ['Mar y Relax', 'Cultura e Historia', 'Aventura y Deporte', 'Gastronomía', 'Mixto'],
    'sardinai.q4.options': ['Económico (<80€)', 'Medio (80-150€)', 'Premium (150-300€)', 'Lujo (300€+)'],
    'sardinai.q5.options': ['Solo', 'Pareja', 'Familia con niños', 'Grupo de amigos'],
    'sardinai.q6.options': ['Abril - Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre - Octubre', 'Invierno (Nov-Mar)'],
    'sardinai.itinerary.title': 'Tu Itinerario Personalizado',
    'sardinai.itinerary.intro': 'Aquí está. He creado un itinerario a medida basado en tus preferencias.',

    'map.title': 'Mapa Interactivo',
    'map.filter.all': 'Todos',
    'map.filter.spiagge': 'Playas',
    'map.filter.citta': 'Ciudades',
    'map.filter.hotel': 'Hoteles',
    'map.filter.ristoranti': 'Restaurantes',
    'map.filter.attrazioni': 'Atracciones',
    'map.filter.parchi': 'Parques',
    'map.filter.esperienze': 'Experiencias',
    'map.info.close': 'Cerrar',
    'map.info.contacts': 'Contactos',
    'map.info.web': 'Sitio web',
    'map.info.rating': 'Valoración',
    'map.info.price': 'Precio',
    'map.hint': 'Rotar con ratón · Zoom con rueda · Clic en los pins',

    'tools.title': 'Herramientas Cerdeña',
    'tools.calendar': 'Calendario de Eventos',
    'tools.beaches': 'Playas en Vivo',
    'tools.camper': 'Autocaravana & Furgoneta',
    'tools.sports': 'Deporte y Aventura',
    'tools.back': '← Herramientas',

    'tools.beaches.update': 'Actualizar Datos',
    'tools.beaches.wind': 'Viento',
    'tools.beaches.status.great': 'Excelente',
    'tools.beaches.status.good': 'Buena',
    'tools.beaches.status.bad': 'No recomendada',
    'tools.beaches.updated': 'Datos actualizados',

    'tools.calendar.filter': 'Filtrar por mes',
    'tools.calendar.all': 'Todos',

    'tools.sports.level': 'Nivel',
    'tools.sports.season': 'Mejor temporada',
    'tools.sports.operators': 'Operadores',
    'tools.sports.areas': 'Mejores zonas',

    'tools.camper.services': 'Servicios',
    'tools.camper.cost': 'Coste',
    'tools.camper.notes': 'Notas',

    'preloader.loading': 'Cargando...'
  },

  FR: {
    'hero.title': 'Bienvenue sur BrandSardinia',
    'hero.subtitle': "La plus belle île de la Méditerranée, racontée par ceux qui la vivent.",
    'hero.cta': "Commencer l'Expérience",

    'nav.sardinai': 'SardinAI',
    'nav.map': 'Carte Interactive',
    'nav.tools': 'Outils',
    'nav.back': '← Retour au menu',

    'selector.title': 'Que voulez-vous explorer?',
    'selector.subtitle': 'Choisissez votre expérience',
    'selector.sardinai.title': 'SardinAI',
    'selector.sardinai.desc': "Planifiez votre voyage avec l'intelligence artificielle",
    'selector.map.title': 'Carte Interactive',
    'selector.map.desc': 'Explorez la Sardaigne en 3D avec des épingles et filtres',
    'selector.tools.title': 'Outils',
    'selector.tools.desc': 'Plages en direct, événements, camping-cars et sports',

    'sardinai.welcome': "Bonjour! Je suis SardinAI, votre assistant de voyage pour la Sardaigne. Je vais vous poser quelques questions pour créer l'itinéraire parfait.",
    'sardinai.questions': [
      'À quel aéroport atterrissez-vous ou depuis où partez-vous?',
      'Combien de jours avez-vous disponibles?',
      'Quel type de vacances cherchez-vous?',
      'Quel est votre budget journalier approximatif par personne?',
      'Avec qui voyagez-vous?',
      'Quand prévoyez-vous de visiter la Sardaigne?'
    ],
    'sardinai.placeholder': 'Écrivez votre réponse...',
    'sardinai.send': 'Envoyer',
    'sardinai.generating': 'Préparation de votre itinéraire personnalisé...',
    'sardinai.restart': 'Recommencer',
    'sardinai.q1.options': ['Cagliari', 'Olbia', 'Alghero', 'Autre'],
    'sardinai.q2.placeholder': 'Ex: 7',
    'sardinai.q3.options': ['Mer & Détente', 'Culture & Histoire', 'Aventure & Sport', 'Gastronomie', 'Mixte'],
    'sardinai.q4.options': ['Économique (<80€)', 'Moyen (80-150€)', 'Premium (150-300€)', 'Luxe (300€+)'],
    'sardinai.q5.options': ['Seul', 'Couple', 'Famille avec enfants', 'Groupe d\'amis'],
    'sardinai.q6.options': ['Avril - Mai', 'Juin', 'Juillet', 'Août', 'Septembre - Octobre', 'Hiver (Nov-Mar)'],
    'sardinai.itinerary.title': 'Votre Itinéraire Personnalisé',
    'sardinai.itinerary.intro': 'Le voici! J\'ai créé un itinéraire sur mesure basé sur vos préférences.',

    'map.title': 'Carte Interactive',
    'map.filter.all': 'Tous',
    'map.filter.spiagge': 'Plages',
    'map.filter.citta': 'Villes',
    'map.filter.hotel': 'Hôtels',
    'map.filter.ristoranti': 'Restaurants',
    'map.filter.attrazioni': 'Attractions',
    'map.filter.parchi': 'Parcs',
    'map.filter.esperienze': 'Expériences',
    'map.info.close': 'Fermer',
    'map.info.contacts': 'Contacts',
    'map.info.web': 'Site web',
    'map.info.rating': 'Note',
    'map.info.price': 'Prix',
    'map.hint': 'Rotation avec souris · Zoom avec molette · Clic sur les épingles',

    'tools.title': 'Outils Sardaigne',
    'tools.calendar': 'Calendrier des Événements',
    'tools.beaches': 'Plages en Direct',
    'tools.camper': 'Camping-Car & Van',
    'tools.sports': 'Sport & Aventure',
    'tools.back': '← Outils',

    'tools.beaches.update': 'Mettre à jour',
    'tools.beaches.wind': 'Vent',
    'tools.beaches.status.great': 'Excellente',
    'tools.beaches.status.good': 'Bonne',
    'tools.beaches.status.bad': 'Déconseillée',
    'tools.beaches.updated': 'Données mises à jour',

    'tools.calendar.filter': 'Filtrer par mois',
    'tools.calendar.all': 'Tous',

    'tools.sports.level': 'Niveau',
    'tools.sports.season': 'Meilleure saison',
    'tools.sports.operators': 'Opérateurs',
    'tools.sports.areas': 'Meilleures zones',

    'tools.camper.services': 'Services',
    'tools.camper.cost': 'Coût',
    'tools.camper.notes': 'Notes',

    'preloader.loading': 'Chargement...'
  },

  DE: {
    'hero.title': 'Willkommen bei BrandSardinia',
    'hero.subtitle': 'Die schönste Insel des Mittelmeers, erzählt von denen, die sie leben.',
    'hero.cta': 'Erlebnis starten',

    'nav.sardinai': 'SardinAI',
    'nav.map': 'Interaktive Karte',
    'nav.tools': 'Tools',
    'nav.back': '← Zurück zum Menü',

    'selector.title': 'Was möchten Sie erkunden?',
    'selector.subtitle': 'Wählen Sie Ihr Erlebnis',
    'selector.sardinai.title': 'SardinAI',
    'selector.sardinai.desc': 'Planen Sie Ihre Reise mit künstlicher Intelligenz',
    'selector.map.title': 'Interaktive Karte',
    'selector.map.desc': 'Erkunden Sie Sardinien in 3D mit Pins und Filtern',
    'selector.tools.title': 'Tools',
    'selector.tools.desc': 'Live-Strände, Events, Wohnmobil und Sport',

    'sardinai.welcome': 'Hallo! Ich bin SardinAI, Ihr Reiseassistent für Sardinien. Ich stelle Ihnen einige Fragen, um die perfekte Reiseroute zu erstellen.',
    'sardinai.questions': [
      'An welchem Flughafen landen Sie oder von wo reisen Sie ab?',
      'Wie viele Tage haben Sie zur Verfügung?',
      'Welche Art von Urlaub suchen Sie?',
      'Was ist Ihr ungefähres Tagesbudget pro Person?',
      'Mit wem reisen Sie?',
      'Wann planen Sie Sardinien zu besuchen?'
    ],
    'sardinai.placeholder': 'Schreiben Sie Ihre Antwort...',
    'sardinai.send': 'Senden',
    'sardinai.generating': 'Ihre persönliche Reiseroute wird erstellt...',
    'sardinai.restart': 'Neu starten',
    'sardinai.q1.options': ['Cagliari', 'Olbia', 'Alghero', 'Andere'],
    'sardinai.q2.placeholder': 'z.B. 7',
    'sardinai.q3.options': ['Meer & Entspannung', 'Kultur & Geschichte', 'Abenteuer & Sport', 'Kulinarik', 'Gemischt'],
    'sardinai.q4.options': ['Günstig (<80€)', 'Mittel (80-150€)', 'Premium (150-300€)', 'Luxus (300€+)'],
    'sardinai.q5.options': ['Alleine', 'Pärchen', 'Familie mit Kindern', 'Freundesgruppe'],
    'sardinai.q6.options': ['April - Mai', 'Juni', 'Juli', 'August', 'September - Oktober', 'Winter (Nov-Mär)'],
    'sardinai.itinerary.title': 'Ihre Persönliche Reiseroute',
    'sardinai.itinerary.intro': 'Hier ist sie! Ich habe eine maßgeschneiderte Route basierend auf Ihren Präferenzen erstellt.',

    'map.title': 'Interaktive Karte',
    'map.filter.all': 'Alle',
    'map.filter.spiagge': 'Strände',
    'map.filter.citta': 'Städte',
    'map.filter.hotel': 'Hotels',
    'map.filter.ristoranti': 'Restaurants',
    'map.filter.attrazioni': 'Sehenswürdigkeiten',
    'map.filter.parchi': 'Parks',
    'map.filter.esperienze': 'Erlebnisse',
    'map.info.close': 'Schließen',
    'map.info.contacts': 'Kontakte',
    'map.info.web': 'Webseite',
    'map.info.rating': 'Bewertung',
    'map.info.price': 'Preis',
    'map.hint': 'Drehen mit Maus · Zoom mit Mausrad · Klicken auf Pins',

    'tools.title': 'Sardinien Tools',
    'tools.calendar': 'Veranstaltungskalender',
    'tools.beaches': 'Live-Strände',
    'tools.camper': 'Wohnmobil & Van',
    'tools.sports': 'Sport & Abenteuer',
    'tools.back': '← Tools',

    'tools.beaches.update': 'Daten aktualisieren',
    'tools.beaches.wind': 'Wind',
    'tools.beaches.status.great': 'Ausgezeichnet',
    'tools.beaches.status.good': 'Gut',
    'tools.beaches.status.bad': 'Nicht empfohlen',
    'tools.beaches.updated': 'Daten aktualisiert',

    'tools.calendar.filter': 'Nach Monat filtern',
    'tools.calendar.all': 'Alle',

    'tools.sports.level': 'Niveau',
    'tools.sports.season': 'Beste Saison',
    'tools.sports.operators': 'Anbieter',
    'tools.sports.areas': 'Beste Gebiete',

    'tools.camper.services': 'Dienste',
    'tools.camper.cost': 'Kosten',
    'tools.camper.notes': 'Hinweise',

    'preloader.loading': 'Wird geladen...'
  }
};

// Lingua corrente (default IT)
let currentLang = 'IT';

// Funzione principale di traduzione
function t(key) {
  const langData = TRANSLATIONS[currentLang] || TRANSLATIONS['IT'];
  if (langData[key] !== undefined) return langData[key];
  // Fallback italiano
  if (TRANSLATIONS['IT'][key] !== undefined) return TRANSLATIONS['IT'][key];
  console.warn(`[i18n] Chiave mancante: "${key}" per lingua "${currentLang}"`);
  return key;
}

// Cambia lingua e aggiorna tutti gli elementi con data-i18n
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) {
    console.warn(`[i18n] Lingua non supportata: ${lang}`);
    return;
  }
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  // Aggiorna attributo lang sull'html
  document.documentElement.lang = lang.toLowerCase();
  // Dispatch evento per moduli che dipendono dalla lingua
  document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
}

function getCurrentLang() {
  return currentLang;
}
