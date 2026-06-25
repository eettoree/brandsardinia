// ============================================================
// sardinai.js — Chat AI per pianificazione itinerari Sardegna
// ============================================================

'use strict';

// ─── STATO CHAT ──────────────────────────────────────────────
const SardinAIState = {
  step: 0,
  answers: {},
  isTyping: false
};

// ─── DATI REALI SARDEGNA (verificati giugno 2026) ────────────
const SARDINIA_DATA = {
  hotels: {
    cagliari: [
      { name: 'Palazzo Tirso Cagliari MGallery 5★', tel: 'Vedi sito', web: 'accorhotels.com', stars: 5, price: '214-350€/notte', area: 'Centro storico', note: 'Palazzo storico, ristorante Terra (Due Forchette Gambero Rosso 2026)' },
      { name: 'Palazzo Doglio 5★', tel: 'Vedi sito', web: 'palazzodoglio.com', stars: 5, price: '227-400€/notte', area: 'Centro', note: 'Palazzo d\'epoca restaurato nel cuore di Cagliari' },
      { name: 'UNAHOTELS T Hotel 4★', tel: 'Vedi sito', web: 'unahotels.it', stars: 4, price: '120-200€/notte', area: 'Quartiere Europeo', note: 'Design contemporaneo, business friendly, ottima posizione' },
      { name: 'Hotel Villa Fanny 4★', tel: 'Vedi sito', web: 'booking.com/cagliari', stars: 4, price: '80-150€/notte', area: 'Cagliari', note: 'Elegante e ben posizionato' },
      { name: 'B&B / Appartamento (budget)', tel: '', web: 'booking.com | airbnb.com', stars: 0, price: '40-90€/notte', area: 'Varie zone', note: 'Disponibili su booking.com e airbnb. Media B&B 41-164€/notte.' }
    ],
    olbia: [
      { name: 'Hotel Cala di Volpe 5★ (Marriott Luxury Collection)', tel: 'Vedi sito', web: 'marriott.com', stars: 5, price: 'da 500€/notte', area: 'Costa Smeralda', note: 'Design arch. Jacques Couëlle. Spiaggia privata, piscina olimpionica acqua di mare' },
      { name: 'Hotel Pitrizza Costa Smeralda 5★', tel: 'Vedi sito', web: 'tripadvisor.com', stars: 5, price: 'da 514€/notte', area: 'Costa Smeralda - Liscia di Vacca', note: '44 camere + 5 suite + 9 ville con piscina privata. Leading Hotels of the World' },
      { name: 'W Sardinia Poltu Quatu 5★ (Marriott)', tel: 'Vedi sito', web: 'marriott.com', stars: 5, price: 'Verificare sito (rating 10.0)', area: 'Poltu Quatu', note: '2 miglia da Porto Cervo. Kayak, hiking, parasailing inclusi' },
      { name: 'Jazz Hotel 4★', tel: 'Vedi sito', web: 'booking.com/olbia', stars: 4, price: 'Verificare (rating 9.2)', area: 'Olbia', note: 'Hotel a tema, accesso golf. Sistemazioni moderne.' },
      { name: 'B&B centro Olbia (budget)', tel: '', web: 'booking.com | airbnb.com', stars: 0, price: '50-100€/notte', area: 'Olbia centro', note: 'Buona scelta nel centro città vicino al porto' }
    ],
    alghero: [
      { name: 'Villa Las Tronas Hotel & SPA 4★', tel: '+39 079 981818', web: 'hvillas.com', stars: 4, price: '150-350€/notte', area: 'Lungomare Valencia 1', note: 'Villa storica su promontorio direttamente sul mare. SPA, posizione unica.' },
      { name: 'El Faro Hotel & Spa 4★', tel: 'Vedi sito', web: 'booking.com/alghero', stars: 4, price: 'Verificare (rating 9.0)', area: 'Alghero', note: 'Rifugio di lusso con valutazione eccellente. SPA.' },
      { name: 'Agriturismo Sa Mandra', tel: '+39 079 999150', web: 'agriturismo-samandra.it', stars: 0, price: '25-40€/persona (mezza pensione)', area: 'Campagna algherese', note: 'Miglior agriturismo Sardegna Gambero Rosso 2026. Maialetto, formaggi, vini propri.' }
    ]
  },
  restaurants: {
    cagliari: [
      { name: 'Dal Corsaro', tel: '+39 070 664318', web: 'dalcorsaro.com', specialty: 'Stella Michelin. Culurgiones al tartufo, maialetto del Gennargentu, malvasia sarda', price: '70-120€/persona' },
      { name: 'Trattoria Lillicu (storica dal 1946)', tel: '+39 070 652970', web: '', specialty: 'Malloreddus alla campidanese, culurgiones, agnello arrosto. Cucina casalinga sarda', price: '20-35€/persona' },
      { name: 'Ristorante Terra (Palazzo Tirso)', tel: 'Vedi sito', web: 'palazzotirso.com', specialty: 'Due Forchette Gambero Rosso 2026. Cucina sarda contemporanea', price: '60-90€/persona' }
    ],
    olbia: [
      { name: 'Il Fuoco Sacro (San Pantaleo)', tel: 'Vedi sito', web: 'booking.com/ristorante', specialty: 'Quasi Tre Forchette Gambero Rosso 2026. Cucina gallurese di qualità superiore', price: '60-100€/persona' },
      { name: 'Ristorante Il Molo (Olbia)', tel: '+39 0789 27059', web: '', specialty: 'Pesce fresco del Tirreno, zuppa gallurese, bottarga', price: '40-70€/persona' }
    ],
    alghero: [
      { name: 'Agriturismo Sa Mandra', tel: '+39 079 999150', web: 'agriturismo-samandra.it', specialty: 'Maialetto allo spiedo, formaggi DOP, mirto e vini bio produzione propria. Prenotazione essenziale.', price: '35-45€ menu fisso' },
      { name: 'Il Pavone (centro storico)', tel: '+39 079 979584', web: '', specialty: 'Aragosta alla catalana (piatto identitario algherese), spaghetti ricci, bottarga', price: '50-90€/persona' },
      { name: 'Andreini', tel: '+39 079 982098', web: '', specialty: 'Pesce fresco, aragosta, risotto ai frutti di mare, cantina vini locali', price: '50-80€/persona' }
    ]
  },
  beaches: {
    cagliari: [
      'Poetto — 8 km di arenile, raggiungibile con bus CTM. Stabilimenti e accesso libero. Flamingo nello stagno adiacente.',
      'Su Giudeu (Chia) — 60 km da Cagliari. Dune di sabbia bianca, acque basse ideali per famiglie. Kitesurf.',
      'Tuerredda (Teulada) — 85 km. Piccola baia con isolotto raggiungibile a nuoto. Selvaggia, barra stagionale.',
      'Porto Giunco (Villasimius) — 50 km. Laguna con fenicotteri, sabbia bianchissima, area marina protetta.'
    ],
    olbia: [
      'Spiaggia del Principe — 30 km da Olbia. La preferita dell\'Aga Khan. Granito rosa, acque verde smeraldo. Accesso libero.',
      'Cala Brandinchi (San Teodoro) — 35 km. La "Tahiti sarda". Acque basse e turchesi, ideale per famiglie.',
      'La Cinta (San Teodoro) — 33 km. Lingua di sabbia tra mare e stagno. Spot kitesurf e windsurf.',
      'Cala Luna — 100 km da Olbia. Solo via mare da Cala Gonone (45 min barca). Una delle più belle d\'Italia.'
    ],
    alghero: [
      'La Pelosa (Stintino) — 30 km da Alghero. Sabbia bianchissima, acque turchesi, torre spagnola 1500. Accesso contingentato: 3,50€ a persona.',
      'Le Bombarde — 8 km da Alghero. Spiaggia protetta, acque cristalline, pineta. Molto frequentata in estate.',
      'Maria Pia — 5 km da Alghero. Boschiva, acque calme, ideale per famiglie. Comoda e servita.',
      'Cala Domestica (Buggerru) — 100 km. Fiordo naturale con gallerie minerarie. Autentica e poco frequentata.'
    ]
  },
  attractions: {
    cultura: [
      { name: 'Nuraghe Su Nuraxi (UNESCO)', location: 'Barumini (SU)', tel: '+39 070 9368128', web: 'fondazionebarumini.it', orari: 'Tutto l\'anno, visita ogni 30 min', costo: '15€ adulti / 12€ ridotti / 9€ bambini 7-12 / gratuito <6 anni', note: 'Il nuraghe più importante della Sardegna (1500 a.C.). Visita obbligatoriamente guidata ~1h. Include Casa Zapata e Centro Lilliu. Prenotare: prenotazioni@fondazionebarumini.it. Da Cagliari 60 km.' },
      { name: 'Grotte di Nettuno', location: 'Alghero (Capo Caccia)', tel: '+39 079 946540', web: 'grottenettuno.it', orari: '9:00–19:00 (aprile–novembre)', costo: '14€ adulti / 7€ bambini 6-12 (barca esclusa ~15€)', note: 'Grotta marina spettacolare. Consigliata la barca da Alghero porto (40 min, più suggestivo). In alternativa: 654 gradini dell\'Escala del Cabirol a piedi.' },
      { name: 'Museo Nazionale Archeologia Cagliari', location: 'Piazza Arsenale, Cagliari', tel: '+39 070 655911', web: 'museinazionalicagliari.cultura.gov.it', orari: '9:00–20:00 (chiuso lunedì)', costo: '10€ cumulativo con Pinacoteca Nazionale', note: 'Bronzetti nuragici più importanti del mondo. Gioielli fenici, arte punica e romana. Cittadella dei Musei.' },
      { name: 'Quartiere Castello (Cagliari)', location: 'Cagliari alta', tel: '+39 070 6776397', web: 'cagliariturismo.comune.cagliari.it', orari: 'Sempre aperto', costo: 'Gratuito', note: 'Borgata medievale murata. Torre dell\'Elefante (XIV sec.), Bastione Saint Remy, Cattedrale pisano-romanica, Palazzo Regio. Vista mozzafiato sul Golfo degli Angeli.' },
      { name: 'Sito di Nora (Romano-Punico)', location: 'Pula (CA)', tel: '+39 070 9209138', web: 'fondazionepulacultura.it', orari: '9:00–20:00 (estate)', costo: '8€ adulti (visita guidata obbligatoria)', note: 'Città punico-romana fondata dai Fenici (IX sec. a.C.). Anfiteatro, terme, mosaici a picco sul mare. 40 km da Cagliari via SS195.' },
      { name: 'Nuraghe Losa', location: 'Abbasanta (OR)', tel: '+39 0785 52302', web: 'nuraghelosa.net', orari: 'Aprile–ottobre: 9:00–tramonto / Nov–marzo: 9:00–17:00', costo: '6€ adulti / 4,50€ gruppi / 3€ bambini 6-13', note: 'Tra i nuraghi trilobati meglio conservati. Due piani visitabili. Sulla SS131, 110 km da Cagliari. Parcheggio gratuito.' },
      { name: 'Tharros (Punico-Romano)', location: 'Cabras (OR)', tel: '+39 0783 370019', web: '', orari: '9:00–tramonto (estate)', costo: '9-11€ adulti', note: 'Penisola del Sinis. Colonne romane con il tramonto sul Golfo di Oristano. Una delle aree archaeologiche più suggestive d\'Italia. 20 km da Oristano.' }
    ],
    natura: [
      { name: 'Parco Nazionale del Gennargentu', location: 'Fonni / Desulo (NU)', tel: '+39 0784 228061', web: 'parks.it/parco.nazionale.gennargentu', orari: 'Sempre aperto (estate/autunno consigliati)', costo: 'Accesso libero / guide da 30€', note: 'Punta La Marmora 1834m, tetto della Sardegna. Cervi sardi endemici, mufloni, aquile reali, avvoltoi. Da Cagliari 2h, da Nuoro 40 min.' },
      { name: 'Parco Molentargius-Saline', location: 'Cagliari (adiacente al Poetto)', tel: '+39 070 372727', web: 'parcomolentargius.it', orari: '7:00–19:00', costo: 'Gratuito', note: 'Oasi naturalistica urbana con migliaia di fenicotteri rosa (presenti tutto l\'anno), aironi, germani reali. Percorsi ciclopedonali 10 km. A 10 min dal centro di Cagliari.' },
      { name: 'Gola di Gorropu', location: 'Urzulei (OG)', tel: '', web: '', orari: 'Accesso libero (guida consigliata)', costo: 'Guida 50-80€/gruppo', note: 'Canyon più profondo d\'Europa (500m di pareti verticali). Trekking avanzato 4-5h A/R. Accesso da SP9 Urzulei o da rifugio Sa Barva.' },
      { name: 'Parco Nazionale Asinara', location: 'Porto Torres / Stintino', tel: '+39 079 503388', web: 'parcoasinara.org', orari: 'Tour aprile–ottobre', costo: '25-60€/persona (tour guidato)', note: 'Ex isola-prigione di massima sicurezza. Asini albini, cervi, mare cristallino. Accesso SOLO con tour guidati autorizzati. Tour 4x4 interno parco. No turismo di massa.' }
    ]
  },
  experiences: [
    { name: 'Cala Gonone Crociere', activity: 'Tour giornaliero Golfo di Orosei (Cala Luna, Cala Mariolu, Cala Goloritzé)', tel: 'Vedi sito', web: 'calagononecrociere.it', price: '65-70€ adulti / 35€ bambini (+ 2-3€ contributo ambientale cale)', duration: 'Giornata intera', nota: 'Partenza da Cala Gonone (Dorgali). Prenotazione obbligatoria estate. Dal 2026 contributo ambientale per accesso cale.' },
    { name: 'Nannai Climbing Home (Ulassai)', activity: 'Arrampicata sportiva e multi-pitch a Ulassai, Jerzu, Osini', tel: '+39 366 370 7749 / +39 334 770 9038', web: 'climbingulassai.com', price: 'Camp guidato da 500€/persona. Guide su richiesta.', duration: '1 giorno – 1 settimana', nota: 'Email: nannaiclimbinghome@gmail.com — WhatsApp preferito. Guidebook Ulassai disponibile (18€).' },
    { name: 'ProKite Sardegna (Punta Trettu)', activity: 'Kitesurf, windsurf, wing foil, SUP', tel: 'Vedi sito', web: 'prokitesardegna.com', price: 'Lezioni da 70€/sessione', duration: '2-3 ore per sessione', nota: 'Centro IKO certificato. Punta Trettu (SU) è tra i migliori spot kitesurf europei. Anche quad, equitazione.' },
    { name: 'SubAquaDive Service (Villasimius)', activity: 'Diving e snorkeling AMP Capo Carbonara', tel: 'Vedi sito', web: 'subaquadive.it', price: 'Snorkeling 40€ / Singola immersione 60€ / Doppia 110€ (attrezzatura inclusa)', duration: 'Mezza giornata', nota: 'Attivo dal 1974. Area marina protetta, alta biodiversità. Serpentara Island extra 70€.' },
    { name: 'Sella & Mosca (Alghero)', activity: 'Tour vigneti e degustazione vini DOC', tel: '+39 079 9997700', web: 'sellaemosca.com', price: '15-30€ degustazione', duration: '2 ore', nota: 'La più grande tenuta vinicola d\'Italia (650 ettari). Vermentino, Cannonau, Torbato, Alghero DOC. Prenotare.' },
    { name: 'Su Gologone (Oliena)', activity: 'Cena con cucina barbaricina autentica', tel: '+39 0784 287512', web: 'sugologone.it', price: '45-70€/persona', duration: 'Pranzo o cena', nota: 'Icona dell\'ospitalità nuorese. Porceddu, culurgiones, seadas, Cannonau. Hotel-resort annesso con arte sarda.' },
    { name: 'Selvaggio Blu Trekking (Baunei)', activity: 'Il trekking più bello d\'Italia — 7 giorni, 45 km costa selvaggia', tel: '+39 0782 610271', web: 'golfodioro.com', price: '800-1200€/persona tutto incluso', duration: '7 giorni', nota: 'Solo con guide esperte certificate. Da Pedra Longa a Cala Luna. Fisicamente impegnativo. Prenotare mesi prima.' },
    { name: 'Trenino Verde (ARST)', activity: 'Viaggio in treno storico attraverso la Sardegna più autentica', tel: '+39 070 580246', web: 'treninoverde.com', price: '10-22€ a tratta', duration: 'Mezza o intera giornata', nota: '4 percorsi: Mandas-Arbatax (150 km, 7h), Macomer-Bosa Marina, Isili-Sorgono, Nulvi-Palau. Stagionale.' }
  ]
};

// ─── DISTANZE STRADALI (km, minuti) ──────────────────────────
const DISTANCE_DATA = {
  'cagliari-sassari':     { km: 215, min: 170 },
  'cagliari-nuoro':      { km: 170, min: 130 },
  'cagliari-oristano':   { km: 95,  min: 75  },
  'cagliari-olbia':      { km: 263, min: 198 },
  'cagliari-alghero':    { km: 257, min: 194 },
  'cagliari-villasimius':{ km: 64,  min: 70  },
  'cagliari-pula':       { km: 38,  min: 45  },
  'cagliari-chia':       { km: 50,  min: 54  },
  'cagliari-barumini':   { km: 60,  min: 75  },
  'cagliari-arbatax':    { km: 140, min: 120 },
  'olbia-alghero':       { km: 137, min: 115 },
  'olbia-palau':         { km: 40,  min: 43  },
  'olbia-san teodoro':   { km: 31,  min: 28  },
  'olbia-sassari':       { km: 100, min: 85  },
  'alghero-stintino':    { km: 54,  min: 50  },
  'alghero-bosa':        { km: 45,  min: 50  },
  'alghero-sassari':     { km: 37,  min: 40  },
  'nuoro-cala gonone':   { km: 41,  min: 43  },
  'nuoro-oliena':        { km: 12,  min: 18  },
  'nuoro-orgosolo':      { km: 20,  min: 28  },
  'oristano-tharros':    { km: 21,  min: 25  },
  'oristano-barumini':   { km: 66,  min: 70  },
  'sassari-alghero':     { km: 37,  min: 40  },
  'sassari-olbia':       { km: 100, min: 85  }
};

function getDistance(from, to) {
  const key = `${from.toLowerCase()}-${to.toLowerCase()}`;
  const rev = `${to.toLowerCase()}-${from.toLowerCase()}`;
  return DISTANCE_DATA[key] || DISTANCE_DATA[rev] || null;
}

function formatMinutes(min) {
  if (!min) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}`.trim() : `${m} min`;
}

// ─── EVENTI PER PERIODO ───────────────────────────────────────
const PERIOD_EVENTS = {
  'apr-mag': [
    { nome: 'Monumenti Aperti', citta: 'Tutta la Sardegna', costo: 'Gratuito', link: 'sardegnatuttolanno.net', desc: 'Apertura straordinaria di monumenti e chiese in 30+ comuni' },
    { nome: 'Giro di Sardegna Ciclistico (UCI)', citta: 'Tutta la Sardegna', costo: 'Gratuito', link: '', desc: 'Corsa ciclistica a tappe sulle strade più belle dell\'isola — 25 apr/1 mag' },
    { nome: 'Festa di Sant\'Efisio', citta: 'Cagliari / Pula', costo: 'Gratuito', link: 'santefisio.it', desc: '1–4 maggio. Processione storica dal 1657: la più grande d\'Italia. 3.000 figuranti in costume sardo' }
  ],
  'giu': [
    { nome: 'Festival del Cinema di Tavolara', citta: 'Porto San Paolo (OT)', costo: 'A pagamento', link: '', desc: 'Proiezioni all\'aperto con l\'isola di Tavolara come scenografia naturale — 13-26 giugno' },
    { nome: 'Vasco Rossi Live', citta: 'Olbia Arena', costo: 'A pagamento', link: 'ticketone.it', desc: 'Due date del tour — 12-13 giugno 2026' },
    { nome: 'Focs de Sant Joan', citta: 'Alghero', costo: 'Gratuito', link: '', desc: 'Festa catalana del fuoco di San Giovanni: falò, musica, balli — 20-24 giugno' },
    { nome: 'Negramaro in concerto', citta: 'Golfo Aranci', costo: 'Gratuito', link: '', desc: 'Concerto in piazza — 27 giugno' },
    { nome: 'Time in Jazz (Preview)', citta: 'Berchidda', costo: 'Variabile', link: 'timeinjazz.it', desc: 'Anteprima del festival con tributo a Miles Davis — 19-21 giugno' },
    { nome: 'Mare e Miniere', citta: 'Portoscuso (SU)', costo: 'Variabile', link: '', desc: 'Festival musica etnica e patrimonio minerario del Sulcis-Iglesiente — 23-28 giugno' }
  ],
  'lug': [
    { nome: 'S\'Ardia di Sedilo', citta: 'Sedilo (OR)', costo: 'Gratuito', link: '', desc: 'Corsa votiva a cavallo più adrenalinica del mondo — 6-7 luglio' },
    { nome: 'Notte dei Nuraghi', citta: 'Barumini (SU)', costo: 'A pagamento', link: 'fondazionebarumini.it', desc: 'Visita notturna al nuraghe UNESCO con luci e narrazione — 11 luglio. Prenotazione obbligatoria' },
    { nome: 'Dromos Festival', citta: 'Oristano e provincia', costo: 'Variabile', link: 'dromos.org', desc: 'Musica world, jazz, teatro nei siti storici oristanesi — 18 lug/16 ago' }
  ],
  'ago': [
    { nome: 'Time in Jazz (Paolo Fresu)', citta: 'Berchidda e 15 comuni', costo: 'Variabile', link: 'timeinjazz.it', desc: 'Festival jazz internazionale nei paesaggi della Gallura — 8-16 agosto' },
    { nome: 'Faradda dei Candelieri', citta: 'Sassari', costo: 'Gratuito', link: 'ilcandeliere.it', desc: 'Patrimonio UNESCO. Sfilata candelieri a spalla — 14 agosto' },
    { nome: 'Red Valley Festival', citta: 'Olbia', costo: 'A pagamento', link: '', desc: 'Festival musicale estivo con artisti nazionali e internazionali — 13-15 agosto' },
    { nome: 'Festa del Redentore', citta: 'Nuoro', costo: 'Gratuito', link: '', desc: 'Processione e sfilata in costumi barbaricini — 22-29 agosto' }
  ],
  'set-ott': [
    { nome: 'Autunno in Barbagia — Cortes Apertas', citta: 'Barbagia (NU)', costo: 'Gratuito', link: 'autunnoinbarbagia.it', desc: 'Ogni weekend un borgo apre le porte: cantine, artigianato, cucina locale. Da settembre a dicembre' },
    { nome: 'Sagra delle Castagne e delle Nocciole', citta: 'Aritzo (NU)', costo: 'Gratuito', link: '', desc: '50.000 visitatori, 24-25 ottobre. Castagne, musica folk, costumi tradizionali' }
  ],
  'inv': [
    { nome: 'Carnevale Storico di Mamoiada', citta: 'Mamoiada (NU)', costo: 'Gratuito', link: 'museodellemaschere.it', desc: 'I Mamuthones sfilano con campanacci — gennaio/febbraio' },
    { nome: 'Sa Sartiglia', citta: 'Oristano', costo: 'Gratuito (tribune a pagamento)', link: 'sartiglia.info', desc: 'Giostra equestre medievale — 15-17 febbraio 2026' },
    { nome: 'Tutankhamon (Mostra)', citta: 'Cagliari', costo: 'A pagamento', link: '', desc: 'Mostra immersiva al Bastione di Saint Remy — marzo/luglio 2026' }
  ]
};

function getPeriodKey(periodAnswer) {
  if (!periodAnswer) return 'ago';
  const p = periodAnswer.toLowerCase();
  if (p.includes('april') || p.includes('abril') || p.includes('avril') || p.includes('apr') || p.includes('mag') || p.includes('may') || p.includes('mai')) return 'apr-mag';
  if (p.includes('giugno') || p.includes('june') || p.includes('junio') || p.includes('juin') || p.includes('juni')) return 'giu';
  if (p.includes('luglio') || p.includes('july') || p.includes('julio') || p.includes('juillet') || p.includes('juli')) return 'lug';
  if (p.includes('agosto') || p.includes('august') || p.includes('août') || p.includes('aug')) return 'ago';
  if (p.includes('sett') || p.includes('sept') || p.includes('set') || p.includes('oct') || p.includes('ott') || p.includes('okto')) return 'set-ott';
  if (p.includes('inv') || p.includes('nov') || p.includes('dic') || p.includes('jan') || p.includes('feb') || p.includes('win') || p.includes('hiv')) return 'inv';
  return 'ago';
}

function getSeasonalTip(periodKey, vacationType) {
  const tips = {
    'apr-mag': 'STAGIONE IDEALE: Maggio è il mese migliore per la Sardegna. Temperatura perfetta (18-24°C), mare già praticabile per snorkeling, nessuna folla e prezzi bassi. Trekking in condizioni ottimali nel Supramonte e Gennargentu.',
    'giu': 'GIUGNO OTTIMALE: Caldo piacevole, mare caldo (22-24°C), ancora senza la ressa di luglio-agosto. Perfetto per spiagge e cultura. Le serate sono lunghe e fresche. Attenzione: prenotare alloggi in anticipo soprattutto sulla costa nord-est.',
    'lug': 'ALTA STAGIONE: Luglio è il mese più affollato. Spiagge bellissime ma piene. Prezzi al massimo (+50-100% su primavera). Prenotare La Pelosa e Cala Goloritzé obbligatoriamente. Preferire le calette meno note e visitare i siti interni nelle ore calde.',
    'ago': 'PICCO STAGIONALE: Agosto è il mese più caldo (fino a 38°C nell\'interno) e più costoso. Le spiagge top sono sempre esaurite. Compensazione: eventi straordinari (Time in Jazz, Faradda dei Candelieri, Red Valley). Prenotare tutto con mesi di anticipo.',
    'set-ott': 'STAGIONE D\'ORO: Settembre e ottobre sono forse i mesi migliori. Mare ancora caldo (24-26°C a settembre), folla quasi azzerata dal 15 settembre, prezzi in forte calo. Vendemmia: periodo perfetto per enoturismo (Cannonau, Vermentino, Malvasia di Bosa).',
    'inv': 'BASSA STAGIONE: Inverno ideale per borghi, archeologia e cultura. Prezzi minimi, nessuna folla. Paesaggi verdi e suggestivi dopo le piogge. Carnevale di Mamoiada e Sartiglia di Oristano sono esperienze uniche. Il mare non è balneabile.'
  };
  return tips[periodKey] || tips['ago'];
}

// ─── COSTRUZIONE ITINERARIO ───────────────────────────────────
function buildItinerary(answers) {
  const airport = answers[0] || 'Cagliari';
  const days = parseInt(answers[1]) || 7;
  const type = answers[2] || 'Misto';
  const budget = answers[3] || 'Medio (80-150€)';
  const company = answers[4] || 'Coppia';
  const period = answers[5] || 'Agosto';

  const airportKey = airport.toLowerCase().includes('olbia') ? 'olbia'
    : airport.toLowerCase().includes('alghero') ? 'alghero'
    : 'cagliari';

  // Seleziona hotel in base a budget
  const hotelList = SARDINIA_DATA.hotels[airportKey];
  let selectedHotel;
  if (budget.includes('Lusso') || budget.includes('300')) {
    selectedHotel = hotelList[0]; // 5 stelle
  } else if (budget.includes('Premium') || budget.includes('150')) {
    selectedHotel = hotelList[1] || hotelList[0];
  } else {
    selectedHotel = hotelList[2] || hotelList[1];
  }

  const restaurants = SARDINIA_DATA.restaurants[airportKey] || SARDINIA_DATA.restaurants.cagliari;
  const beaches = SARDINIA_DATA.beaches[airportKey] || SARDINIA_DATA.beaches.cagliari;

  // Esperienze in base al tipo di vacanza
  let experiences = [];
  if (type.includes('Avventura') || type.includes('Sport') || type.includes('Adventure')) {
    experiences = [SARDINIA_DATA.experiences[0], SARDINIA_DATA.experiences[1], SARDINIA_DATA.experiences[2]];
  } else if (type.includes('Cultura') || type.includes('History')) {
    experiences = [SARDINIA_DATA.experiences[4], SARDINIA_DATA.experiences[5]];
  } else if (type.includes('Enogastronom') || type.includes('Food') || type.includes('Gastr') || type.includes('Kulin')) {
    experiences = [SARDINIA_DATA.experiences[4], SARDINIA_DATA.experiences[5]];
  } else if (type.includes('Mare') || type.includes('Sea') || type.includes('Meer') || type.includes('Mer')) {
    experiences = [SARDINIA_DATA.experiences[0], SARDINIA_DATA.experiences[3]];
  } else {
    experiences = [SARDINIA_DATA.experiences[0], SARDINIA_DATA.experiences[4]];
  }

  // Attrazioni in base al tipo
  let attractions;
  if (type.includes('Cultura') || type.includes('History') || type.includes('Histoire') || type.includes('Kultur')) {
    attractions = SARDINIA_DATA.attractions.cultura;
  } else if (type.includes('Avventura') || type.includes('Sport') || type.includes('Abenteuer')) {
    attractions = SARDINIA_DATA.attractions.natura;
  } else {
    attractions = [...SARDINIA_DATA.attractions.cultura.slice(0, 2), ...SARDINIA_DATA.attractions.natura.slice(0, 1)];
  }

  // Costruisce il testo dell'itinerario giorno per giorno
  const itineraryDays = [];
  const effectiveDays = Math.min(days, 10);

  for (let d = 1; d <= effectiveDays; d++) {
    let dayPlan = '';
    if (d === 1) {
      dayPlan = `**Arrivo e sistemazione**\nArrivo all'aeroporto di ${airport}. Check-in presso ${selectedHotel.name} (${selectedHotel.stars}★, ${selectedHotel.price}, tel: ${selectedHotel.tel}). Passeggiata nel centro per ambientarsi. Cena da ${restaurants[0].name}: ${restaurants[0].specialty} — ${restaurants[0].price}.`;
    } else if (d === 2) {
      const att = attractions[0];
      dayPlan = `**Esplorazione storica**\nMattina: visita a ${att.name} a ${att.location}. Orari: ${att.orari}, Costo: ${att.costo}. ${att.note}.\nPomeriggio: ${beaches[0]}.\nCena da ${restaurants[1] ? restaurants[1].name : restaurants[0].name}.`;
    } else if (d === 3 && experiences[0]) {
      const exp = experiences[0];
      dayPlan = `**Giornata esperienziale**\n${exp.activity} con ${exp.name} (tel: ${exp.tel}, ${exp.web ? 'web: ' + exp.web : ''}). Durata: ${exp.duration}, Prezzo: ${exp.price}. ${exp.nota}`;
    } else if (d === 4 && attractions[1]) {
      const att = attractions[1];
      dayPlan = `**Cultura e territorio**\n${att.name} a ${att.location} (${att.orari}, ${att.costo}). ${att.note}.\nNel pomeriggio: ${beaches[1] || beaches[0]}.`;
    } else if (d === 5 && experiences[1]) {
      const exp = experiences[1];
      dayPlan = `**Seconda esperienza**\n${exp.activity} con ${exp.name} (tel: ${exp.tel}). Prezzo: ${exp.price}. ${exp.nota}`;
    } else if (d === days) {
      dayPlan = `**Ultima giornata e partenza**\nMattina libera per acquisti e souvenirs (mercato di Cagliari, bottega Is Mirrionis). Pranzo finale da ${restaurants[0].name}. Trasferimento all'aeroporto e partenza.`;
    } else {
      const dayBeach = beaches[(d - 1) % beaches.length];
      dayPlan = `**Relax e scoperta**\nGiornata a ${dayBeach}. Aperitivo con Vermentino di Sardegna. Cena locale.`;
    }
    itineraryDays.push({ day: d, plan: dayPlan });
  }

  // Consiglio speciale per tipo di gruppo
  let tip = '';
  if (company.includes('Famiglia') || company.includes('Family') || company.includes('enfants') || company.includes('Kindern')) {
    tip = 'CONSIGLIO FAMIGLIE: Prenotate in anticipo i tour in kayak (minimo 6 anni) e optate per spiagge con acque basse come Maria Pia ad Alghero o Poetto a Cagliari. I nuraghi sono adatti a bambini dai 5 anni.';
  } else if (company.includes('Solo') || company.includes('Alleine')) {
    tip = 'CONSIGLIO VIAGGIATORI SOLO: Valutate i tour di gruppo di Barbagia Trek per socializzare. I B&B di paese sono ottimi per conoscere la cultura locale. Evitate agosto in Costa Smeralda per i prezzi.';
  } else if (company.includes('Gruppo') || company.includes('Group') || company.includes('amis') || company.includes('Freun')) {
    tip = 'CONSIGLIO GRUPPI: Noleggiate un minivan da Cagliari (circa 60€/giorno). Le sagre paesane e gli agriturismi sono perfetti per gruppi numerosi e conviviali.';
  } else {
    tip = 'CONSIGLIO COPPIE: Per un\'esperienza romantica, prenotate una cena al tramonto sul bastione di Alghero. La suite con vista mare di Villa Las Tronas è una scelta eccellente per una notte speciale.';
  }

  const periodKey = getPeriodKey(period);
  const matchingEvents = PERIOD_EVENTS[periodKey] || [];
  const seasonalTip = getSeasonalTip(periodKey, type);

  return { days: itineraryDays, hotel: selectedHotel, tip, experiences, restaurants, matchingEvents, seasonalTip, period, airportKey };
}

// ─── RENDER CHAT ─────────────────────────────────────────────
function addMessage(text, sender, isHTML) {
  const chat = document.getElementById('sardinai-chat');
  if (!chat) return;

  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;

  if (isHTML) {
    msg.innerHTML = text;
  } else {
    // Markdown semplice: **bold**
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    msg.innerHTML = formatted;
  }

  chat.appendChild(msg);

  gsap.fromTo(msg,
    { opacity: 0, y: 15, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
  );

  chat.scrollTop = chat.scrollHeight;
  return msg;
}

function showTypingIndicator() {
  const chat = document.getElementById('sardinai-chat');
  if (!chat) return null;

  const typing = document.createElement('div');
  typing.className = 'chat-message ai typing-indicator';
  typing.id = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  return typing;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function addQuickReplies(options, callback) {
  const chat = document.getElementById('sardinai-chat');
  if (!chat) return;

  const container = document.createElement('div');
  container.className = 'quick-replies';
  container.id = 'quick-replies-container';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      container.remove();
      callback(opt);
    });
    container.appendChild(btn);
  });

  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;

  gsap.fromTo(container,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.1 }
  );
}

function typeMessage(text, sender, delay, callback, isHTML) {
  setTimeout(() => {
    showTypingIndicator();
    const thinkTime = 600 + Math.random() * 600;
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(text, sender, isHTML);
      if (callback) callback();
    }, thinkTime);
  }, delay || 0);
}

// ─── FLUSSO DOMANDE ──────────────────────────────────────────
function askQuestion(stepIndex) {
  const questions = t('sardinai.questions');
  if (!Array.isArray(questions) || stepIndex >= questions.length) {
    generateItinerary();
    return;
  }

  const question = questions[stepIndex];
  typeMessage(question, 'ai', 300, () => {
    const chatInput = document.getElementById('sardinai-input-area');

    // Mostra opzioni quick reply o input testo
    if (stepIndex === 0) {
      const opts = t('sardinai.q1.options');
      addQuickReplies(Array.isArray(opts) ? opts : ['Cagliari', 'Olbia', 'Alghero', 'Altro'], handleUserAnswer);
      if (chatInput) chatInput.style.display = 'none';
    } else if (stepIndex === 1) {
      // Input numerico
      if (chatInput) chatInput.style.display = 'flex';
      const input = document.getElementById('sardinai-input');
      if (input) {
        input.placeholder = t('sardinai.q2.placeholder') || 'Es: 7';
        input.type = 'number';
        input.min = '1';
        input.max = '30';
        input.focus();
      }
    } else if (stepIndex === 2) {
      const opts = t('sardinai.q3.options');
      addQuickReplies(Array.isArray(opts) ? opts : ['Mare & Relax', 'Cultura & Storia', 'Avventura & Sport', 'Enogastronomia', 'Misto'], handleUserAnswer);
      if (chatInput) chatInput.style.display = 'none';
    } else if (stepIndex === 3) {
      const opts = t('sardinai.q4.options');
      addQuickReplies(Array.isArray(opts) ? opts : ['Economico', 'Medio', 'Premium', 'Lusso'], handleUserAnswer);
      if (chatInput) chatInput.style.display = 'none';
    } else if (stepIndex === 4) {
      const opts = t('sardinai.q5.options');
      addQuickReplies(Array.isArray(opts) ? opts : ['Solo', 'Coppia', 'Famiglia', 'Gruppo'], handleUserAnswer);
      if (chatInput) chatInput.style.display = 'none';
    } else if (stepIndex === 5) {
      const opts = t('sardinai.q6.options');
      addQuickReplies(Array.isArray(opts) ? opts : ['Aprile - Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre - Ottobre', 'Inverno (Nov-Mar)'], handleUserAnswer);
      if (chatInput) chatInput.style.display = 'none';
    }
  });
}

function handleUserAnswer(answer) {
  // Mostra risposta utente
  addMessage(answer, 'user');

  // Salva risposta
  SardinAIState.answers[SardinAIState.step] = answer;
  SardinAIState.step++;

  // Nascondi input testo se era visibile
  const chatInput = document.getElementById('sardinai-input-area');
  if (chatInput) chatInput.style.display = 'none';
  const input = document.getElementById('sardinai-input');
  if (input) { input.value = ''; input.type = 'text'; }

  // Prossima domanda o genera itinerario
  if (SardinAIState.step < 6) {
    askQuestion(SardinAIState.step);
  } else {
    generateItinerary();
  }
}

// ─── GENERAZIONE ITINERARIO ───────────────────────────────────
function generateItinerary() {
  const chatInput = document.getElementById('sardinai-input-area');
  if (chatInput) chatInput.style.display = 'none';

  // Messaggio "sto generando"
  typeMessage(t('sardinai.generating'), 'ai', 400, () => {
    const itinerary = buildItinerary(SardinAIState.answers);

    // Costruisce HTML itinerario
    // Trasferimenti chiave per aeroporto base
    const transferNotes = {
      cagliari: {
        'Villasimius': '64 km · 1h 10min',
        'Pula': '38 km · 45 min',
        'Chia': '50 km · 54 min',
        'Barumini': '60 km · 1h 15min (Su Nuraxi UNESCO)',
        'Oristano': '95 km · 1h 15min',
        'Nuoro': '170 km · 2h 10min',
        'Alghero': '257 km · 3h 14min',
        'Olbia': '263 km · 3h 18min'
      },
      olbia: {
        'San Teodoro': '31 km · 28 min',
        'Palau': '40 km · 43 min (traghetto Maddalena)',
        'Alghero': '137 km · 1h 55min',
        'Nuoro': '104 km · 1h 30min',
        'Cala Gonone': '145 km · 2h 10min'
      },
      alghero: {
        'Stintino (La Pelosa)': '54 km · 50 min',
        'Bosa': '45 km · 50 min (strada SP49 panoramica)',
        'Sassari': '37 km · 40 min',
        'Oristano': '190 km · 2h 30min'
      }
    };
    const baseTimes = transferNotes[itinerary.airportKey] || {};

    let html = `<div class="itinerary-result">
      <div class="itinerary-header">
        <h3>${t('sardinai.itinerary.title')}</h3>
        <p>${t('sardinai.itinerary.intro')}</p>
      </div>
      <div class="itinerary-season-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
        ${itinerary.period || 'Estate'}
      </div>
      <div class="itinerary-hotel">
        <strong>Alloggio consigliato:</strong><br>
        ${itinerary.hotel.name} (${itinerary.hotel.stars}★)<br>
        Tel: <a href="tel:${itinerary.hotel.tel}">${itinerary.hotel.tel}</a> — ${itinerary.hotel.price}<br>
        <span class="hotel-area">${itinerary.hotel.area}</span>
      </div>
      <div class="itinerary-days">`;

    itinerary.days.forEach(d => {
      const planFormatted = d.plan
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      html += `<div class="day-card">
        <div class="day-number">Giorno ${d.day}</div>
        <div class="day-content">${planFormatted}</div>
      </div>`;
    });

    html += `</div>`;

    // Sezione trasferimenti utili
    const transferEntries = Object.entries(baseTimes);
    if (transferEntries.length > 0) {
      html += `<div class="itinerary-transfers">
        <div class="transfers-title">Distanze dalla tua base</div>
        <div class="transfers-grid">
          ${transferEntries.map(([dest, info]) => `
            <div class="transfer-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span class="transfer-dest">${dest}</span>
              <span class="transfer-time">${info}</span>
            </div>`).join('')}
        </div>
      </div>`;
    }

    // Sezione eventi corrispondenti al periodo
    if (itinerary.matchingEvents && itinerary.matchingEvents.length > 0) {
      html += `<div class="itinerary-events">
        <div class="events-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Eventi durante il tuo viaggio
        </div>
        ${itinerary.matchingEvents.map(ev => `
          <div class="itin-event-item">
            <div class="itin-event-name">${ev.nome}</div>
            <div class="itin-event-meta">${ev.citta} · ${ev.costo}</div>
            <div class="itin-event-desc">${ev.desc}</div>
          </div>`).join('')}
      </div>`;
    }

    html += `
      <div class="itinerary-seasonal-tip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        ${itinerary.seasonalTip}
      </div>
      <div class="itinerary-tip">
        <strong>Suggerimento:</strong> ${itinerary.tip}
      </div>
    </div>`;

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(html, 'ai', true);

        // Bottone ricomincia
        setTimeout(() => {
          const chat = document.getElementById('sardinai-chat');
          if (chat) {
            const restartBtn = document.createElement('button');
            restartBtn.className = 'restart-btn';
            restartBtn.textContent = t('sardinai.restart');
            restartBtn.addEventListener('click', resetSardinAI);
            chat.appendChild(restartBtn);
            gsap.fromTo(restartBtn,
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.2 }
            );
            chat.scrollTop = chat.scrollHeight;
          }
        }, 300);
      }, 2000);
    }, 600);
  });
}

// ─── RESET CHAT ───────────────────────────────────────────────
function resetSardinAI() {
  SardinAIState.step = 0;
  SardinAIState.answers = {};

  const chat = document.getElementById('sardinai-chat');
  if (chat) {
    gsap.to(chat, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        chat.innerHTML = '';
        chat.style.opacity = '1';
        startSardinAIChat();
      }
    });
  }
}

// ─── AVVIO CHAT ───────────────────────────────────────────────
function startSardinAIChat() {
  // Messaggio benvenuto
  typeMessage(t('sardinai.welcome'), 'ai', 200, () => {
    askQuestion(0);
  });
}

function initSardinAI() {
  // Reset stato
  SardinAIState.step = 0;
  SardinAIState.answers = {};

  const chat = document.getElementById('sardinai-chat');
  if (chat) chat.innerHTML = '';

  // Setup invio input testo
  const sendBtn = document.getElementById('sardinai-send');
  const input = document.getElementById('sardinai-input');

  if (sendBtn) {
    sendBtn.onclick = () => {
      const val = input ? input.value.trim() : '';
      if (val) handleUserAnswer(val);
    };
  }

  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) handleUserAnswer(val);
      }
    };
  }

  // Ascolta cambio lingua
  document.addEventListener('langChanged', () => {
    if (AppState && AppState.currentSection === 'sardinai') {
      resetSardinAI();
    }
  });

  startSardinAIChat();
}
