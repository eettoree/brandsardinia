// ============================================================
// map.js — MapLibre GL JS — Mappa Satellite 3D Sardegna
// Tiles: ESRI World Imagery (gratuito) + AWS Terrain (gratuito)
// ============================================================

'use strict';

let sardMap = null;
let activeMapFilter = 'all';
let allMarkers = [];
let currentQuickPoi = null;
let searchBlurTimer = null;

// ─── DATI CITTÀ SARDEGNA (label zoom-based sulla mappa) ───────
const SARDINIA_CITIES_LABELS = {
  type: 'FeatureCollection',
  features: [
    // Tier 1 — capoluoghi e città principali (>40k ab.) — visibili da zoom 6
    { type:'Feature', properties:{ name:'Cagliari',    tier:1 }, geometry:{ type:'Point', coordinates:[9.1097,39.2238] } },
    { type:'Feature', properties:{ name:'Sassari',     tier:1 }, geometry:{ type:'Point', coordinates:[8.5564,40.7270] } },
    { type:'Feature', properties:{ name:'Olbia',       tier:1 }, geometry:{ type:'Point', coordinates:[9.4966,40.9226] } },
    { type:'Feature', properties:{ name:'Nuoro',       tier:1 }, geometry:{ type:'Point', coordinates:[9.3308,40.3197] } },
    { type:'Feature', properties:{ name:'Oristano',    tier:1 }, geometry:{ type:'Point', coordinates:[8.5912,39.9062] } },
    // Tier 2 — comuni medi (8k–40k ab.) — visibili da zoom 8
    { type:'Feature', properties:{ name:'Alghero',              tier:2 }, geometry:{ type:'Point', coordinates:[8.3135,40.5585] } },
    { type:'Feature', properties:{ name:'Iglesias',             tier:2 }, geometry:{ type:'Point', coordinates:[8.5368,39.3132] } },
    { type:'Feature', properties:{ name:'Carbonia',             tier:2 }, geometry:{ type:'Point', coordinates:[8.5214,39.1666] } },
    { type:'Feature', properties:{ name:'La Maddalena',         tier:2 }, geometry:{ type:'Point', coordinates:[9.4097,41.2131] } },
    { type:'Feature', properties:{ name:'Quartu Sant\'Elena',   tier:2 }, geometry:{ type:'Point', coordinates:[9.1801,39.2384] } },
    { type:'Feature', properties:{ name:'Tempio Pausania',      tier:2 }, geometry:{ type:'Point', coordinates:[9.1044,40.8994] } },
    { type:'Feature', properties:{ name:'Arzachena',            tier:2 }, geometry:{ type:'Point', coordinates:[9.3874,41.0846] } },
    { type:'Feature', properties:{ name:'Macomer',              tier:2 }, geometry:{ type:'Point', coordinates:[8.7782,40.2648] } },
    { type:'Feature', properties:{ name:'Siniscola',            tier:2 }, geometry:{ type:'Point', coordinates:[9.6927,40.5765] } },
    { type:'Feature', properties:{ name:'Tortolì',              tier:2 }, geometry:{ type:'Point', coordinates:[9.6579,39.9293] } },
    { type:'Feature', properties:{ name:'Lanusei',              tier:2 }, geometry:{ type:'Point', coordinates:[9.5429,39.8786] } },
    { type:'Feature', properties:{ name:'Sanluri',              tier:2 }, geometry:{ type:'Point', coordinates:[8.8978,39.5561] } },
    { type:'Feature', properties:{ name:'Ozieri',               tier:2 }, geometry:{ type:'Point', coordinates:[9.0041,40.5858] } },
    // Tier 3 — borghi e comuni (2k–8k ab.) — visibili da zoom 9.5
    { type:'Feature', properties:{ name:'Bosa',                 tier:3 }, geometry:{ type:'Point', coordinates:[8.4957,40.2980] } },
    { type:'Feature', properties:{ name:'Castelsardo',          tier:3 }, geometry:{ type:'Point', coordinates:[8.7143,40.9157] } },
    { type:'Feature', properties:{ name:'Stintino',             tier:3 }, geometry:{ type:'Point', coordinates:[8.2268,40.9394] } },
    { type:'Feature', properties:{ name:'Villasimius',          tier:3 }, geometry:{ type:'Point', coordinates:[9.5059,39.1378] } },
    { type:'Feature', properties:{ name:'Dorgali',              tier:3 }, geometry:{ type:'Point', coordinates:[9.5848,40.2914] } },
    { type:'Feature', properties:{ name:'San Teodoro',          tier:3 }, geometry:{ type:'Point', coordinates:[9.5751,40.7756] } },
    { type:'Feature', properties:{ name:'Palau',                tier:3 }, geometry:{ type:'Point', coordinates:[9.3793,41.1791] } },
    { type:'Feature', properties:{ name:'Santa Teresa Gallura', tier:3 }, geometry:{ type:'Point', coordinates:[9.1889,41.2378] } },
    { type:'Feature', properties:{ name:'Muravera',             tier:3 }, geometry:{ type:'Point', coordinates:[9.5751,39.4166] } },
    { type:'Feature', properties:{ name:'Pula',                 tier:3 }, geometry:{ type:'Point', coordinates:[8.9977,38.9990] } },
    { type:'Feature', properties:{ name:'Cabras',               tier:3 }, geometry:{ type:'Point', coordinates:[8.5340,39.9296] } },
    { type:'Feature', properties:{ name:'Baunei',               tier:3 }, geometry:{ type:'Point', coordinates:[9.6603,40.0322] } },
    { type:'Feature', properties:{ name:'Oliena',               tier:3 }, geometry:{ type:'Point', coordinates:[9.4011,40.2707] } },
    { type:'Feature', properties:{ name:'Mamoiada',             tier:3 }, geometry:{ type:'Point', coordinates:[9.2808,40.2171] } },
    { type:'Feature', properties:{ name:'Orgosolo',             tier:3 }, geometry:{ type:'Point', coordinates:[9.3519,40.2006] } },
    { type:'Feature', properties:{ name:'Barumini',             tier:3 }, geometry:{ type:'Point', coordinates:[8.9993,39.7061] } },
    // Tier 4 — paesi e frazioni (<2k ab.) — visibili da zoom 11
    { type:'Feature', properties:{ name:'Aggius',               tier:4 }, geometry:{ type:'Point', coordinates:[9.0572,40.9291] } },
    { type:'Feature', properties:{ name:'Gavoi',                tier:4 }, geometry:{ type:'Point', coordinates:[9.1955,40.1596] } },
    { type:'Feature', properties:{ name:'Fonni',                tier:4 }, geometry:{ type:'Point', coordinates:[9.2530,40.1228] } },
    { type:'Feature', properties:{ name:'Aritzo',               tier:4 }, geometry:{ type:'Point', coordinates:[9.1963,39.9572] } },
    { type:'Feature', properties:{ name:'Desulo',               tier:4 }, geometry:{ type:'Point', coordinates:[9.1977,40.0469] } },
    { type:'Feature', properties:{ name:'Jerzu',                tier:4 }, geometry:{ type:'Point', coordinates:[9.5173,39.7840] } },
    { type:'Feature', properties:{ name:'Ulassai',              tier:4 }, geometry:{ type:'Point', coordinates:[9.5094,39.8026] } },
    { type:'Feature', properties:{ name:'Berchidda',            tier:4 }, geometry:{ type:'Point', coordinates:[9.1668,40.7860] } },
    { type:'Feature', properties:{ name:'Torralba',             tier:4 }, geometry:{ type:'Point', coordinates:[8.7677,40.5050] } },
    { type:'Feature', properties:{ name:'Domus de Maria',       tier:4 }, geometry:{ type:'Point', coordinates:[8.8657,38.9213] } },
    { type:'Feature', properties:{ name:'Capoterra',            tier:4 }, geometry:{ type:'Point', coordinates:[9.0506,39.1739] } },
  ]
};

// ─── DATI POI CON COORDINATE GPS PRECISE ─────────────────────
const MAP_POI = [
  // SPIAGGE
  { id: 'la-pelosa',             name: 'La Pelosa',                    lat: 40.9652, lng: 8.2096,  cat: 'spiaggia',   color: '#00BFFF', description: 'Sabbia bianchissima, acque turchesi, torre spagnola del 1500. Accesso contingentato in estate con prenotazione obbligatoria e ticket d\'ingresso.', come: 'Da Stintino 3 km. Parcheggio a pagamento. Bus navetta in estate (giugno-settembre).', servizi: 'Parcheggio, noleggio ombrelloni, bar, bagnino stagionale', costo: 'Accesso 3,50€ a persona (estate). Parcheggio 2€/ora', tel: '', web: 'www.comunestintino.it', orari: 'Accesso contingentato luglio-agosto. Prenotazione su portale comunale.' },
  { id: 'cala-goloritzé',        name: 'Cala Goloritzé',               lat: 40.1080, lng: 9.6897,  cat: 'spiaggia',   color: '#00BFFF', description: 'Patrimonio UNESCO. Arco naturale di roccia calcarea, ghiaione bianco e acque cristalline. Eletta tra le spiagge più belle d\'Europa. Trekking 2h o barca.', come: 'Solo via mare da Cala Gonone (65 min) o trekking 2h da Baunei (SP14). Nessun servizio.', servizi: 'Nessuno — spiaggia selvaggia protetta UNESCO', costo: 'Barca: 25-40€ a/r da Cala Gonone. Trekking gratuito.', tel: '', web: '', orari: 'Aperta tutto l\'anno. Via mare: imbarchi da aprile a ottobre.' },
  { id: 'cala-luna',             name: 'Cala Luna',                    lat: 40.2253, lng: 9.6237,  cat: 'spiaggia',   color: '#00BFFF', description: 'Mezzaluna di sabbia dorata con grotte naturali. Raggiungibile solo via mare. Acque da sogno, silenzio assoluto, grotte abitate in agosto da ristoratore.', come: 'Barca da Cala Gonone (45 min) o Arbatax. Trekking 3h da Su Porteddu.', servizi: 'Nessuno — agriturismo nelle grotte in agosto (prenotare)', costo: 'Barca: 20-35€ a/r', tel: '', web: '', orari: 'Via mare: aprile-ottobre.' },
  { id: 'spiaggia-principe',     name: 'Spiaggia del Principe',        lat: 41.0892, lng: 9.5619,  cat: 'spiaggia',   color: '#00BFFF', description: 'La preferita dall\'Aga Khan in Costa Smeralda. Granito rosa levigato, sabbia fine, acque verde smeraldo. Una delle spiagge più esclusive d\'Italia.', come: 'Da Arzachena, SS125 verso Arzachena poi strade secondarie e sterrata 2 km. Parcheggio privato.', servizi: 'Parcheggio a pagamento, nessuna struttura in spiaggia', costo: 'Parcheggio 5-8€/giorno', tel: '', web: '', orari: 'Accesso libero (parcheggio operativo giugno-settembre).' },
  { id: 'su-giudeu',             name: 'Su Giudeu',                    lat: 38.8836, lng: 8.8627,  cat: 'spiaggia',   color: '#00BFFF', description: 'Spiaggia lunga 1 km con posidonia, acque basse e calde, ideale per famiglie. Vicino Chia, la Saint-Tropez sarda. Vista sull\'isolotto di Su Cardulinu.', come: 'Da Cagliari 60 km via SS195 poi deviazione per Chia (SP71). Parcheggio privato a pagamento.', servizi: 'Stabilimento balneare, bar, docce, noleggio, kitesurf', costo: 'Parcheggio 3-5€/ora. Ombrellone + 2 sdraio da 20€', tel: '', web: '', orari: 'Spiaggia libera tutto l\'anno. Stabilimento: maggio-settembre.' },
  { id: 'is-arutas',             name: 'Is Arutas',                    lat: 39.9981, lng: 8.4348,  cat: 'spiaggia',   color: '#00BFFF', description: 'Sabbia di quarzo bianco e rosa a granelli tondi, unica in Europa. Acqua trasparentissima. Area SIC protetta. Vietato asportare sabbia: multa fino a 3000€.', come: 'Da Oristano 25 km via SS292 poi deviazione Riola Sardo. Strada sterrata finale 2 km.', servizi: 'Parcheggio, bar stagionale, nessun ancoraggio barche', costo: 'Accesso libero. Parcheggio 2€/ora', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'cala-mariolu',          name: 'Cala Mariolu',                 lat: 40.1233, lng: 9.6767,  cat: 'spiaggia',   color: '#00BFFF', description: 'Ghiaia bianca con ciottoli rotondi, acqua verde-azzurra profonda. Votata ripetutamente tra le 10 spiagge più belle d\'Italia. Grotte marine adiacenti.', come: 'Solo via mare da Cala Gonone o Santa Maria Navarrese. Non raggiungibile via terra.', servizi: 'Nessuno — spiaggia selvaggia', costo: 'Barca: 30-45€ a/r da Cala Gonone', tel: '', web: '', orari: 'Via mare: aprile-ottobre.' },
  { id: 'berchida',              name: 'Berchida',                     lat: 40.5067, lng: 9.7732,  cat: 'spiaggia',   color: '#00BFFF', description: 'Spiaggia selvaggia tra pinete e macchia mediterranea. Nessun servizio, silenzio totale, acque pulitissime. 2 km di sabbia fine nella baia di Orosei.', come: 'Da Siniscola SP36 poi sterrata 5 km. Da Olbia 70 km. Nessun bus.', servizi: 'Nessuno — spiaggia libera', costo: 'Gratuito', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'cala-brandinchi',       name: 'Cala Brandinchi',              lat: 40.8341, lng: 9.6853,  cat: 'spiaggia',   color: '#00BFFF', description: 'La "Tahiti sarda". Acque basse e turchesi, sabbia candida, vegetazione lussureggiante. Una delle più belle del nord Sardegna. Ideale per bambini.', come: 'Da San Teodoro 5 km via SP82. Strada asfaltata, parcheggio disponibile (a pagamento in estate).', servizi: 'Stabilimento, bar, noleggio attrezzatura, docce', costo: 'Parcheggio 3€/ora. Ombrellone 18-25€', tel: '', web: '', orari: 'Stabilimento: giugno-settembre.' },
  { id: 'la-cinta',              name: 'La Cinta',                     lat: 40.7851, lng: 9.6703,  cat: 'spiaggia',   color: '#00BFFF', description: 'Lingua di sabbia bianca tra il mare e lo stagno di San Teodoro. 4 km di spiaggia. Ideale per kitesurf e windsurf. Vista sul Monte Nieddu.', come: 'Da San Teodoro 3 km via SP82. Ampio parcheggio (a pagamento luglio-agosto).', servizi: 'Scuole kite/wind, noleggio, bar, bagnino', costo: 'Accesso libero. Parcheggio 2€/ora in estate', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'porto-giunco',          name: 'Porto Giunco',                 lat: 39.1128, lng: 9.5186,  cat: 'spiaggia',   color: '#00BFFF', description: 'Semicerchio di sabbia bianchissima con torre spagnola del XVII sec. Laguna con fenicotteri rosa a due passi. Nell\'Area Marina Protetta di Capo Carbonara.', come: 'Da Villasimius 4 km via SP17. Parcheggio a pagamento.', servizi: 'Stabilimento, bar, noleggio, docce, bagnino', costo: 'Parcheggio 3€/h. Ombrellone da 20€/giorno', tel: '', web: '', orari: 'Stabilimento: maggio-settembre.' },
  { id: 'poetto',                name: 'Poetto',                       lat: 39.2139, lng: 9.1572,  cat: 'spiaggia',   color: '#00BFFF', description: 'La spiaggia di Cagliari. 8 km di sabbia dorata, vita notturna, chioschi e sport acquatici. La spiaggia urbana più animata della Sardegna.', come: 'Dal centro di Cagliari con bus CTM linea PQ o PF. In auto da viale Diocleziano.', servizi: 'Stabilimenti, bar, ristoranti, sport acquatici, bagnini, parcheggio', costo: 'Stabilimenti 15-30€/giorno. Spiagge libere gratuite.', tel: '', web: '', orari: 'Aperta tutto l\'anno. Stabilimenti: maggio-settembre.' },
  { id: 'tuerredda',             name: 'Tuerredda',                    lat: 38.8949, lng: 8.8127,  cat: 'spiaggia',   color: '#00BFFF', description: 'Piccola baia con isolotto raggiungibile a nuoto, acqua trasparente. Una gemma del sud Sardegna. Navetta obbligatoria in estate da parcheggio remoto.', come: 'Da Teulada SP71 verso Capo Spartivento. Navetta obbligatoria estate (3€) dal parcheggio.', servizi: 'Bar stagionale, servizio navetta, nessun stabilimento', costo: 'Navetta 3€ a/r. Parcheggio 3€/h', tel: '', web: 'www.visitteulada.it', orari: 'Aperta tutto l\'anno. Navetta: giugno-settembre.' },
  { id: 'cala-domestica',        name: 'Cala Domestica',               lat: 39.3739, lng: 8.3796,  cat: 'spiaggia',   color: '#00BFFF', description: 'Fiordo naturale protetto con spiaggia di sabbia dorata. Antiche gallerie minerarie del periodo industriale sulle pareti rocciose. Acque calme e cristalline.', come: 'Da Buggerru 2 km via strada asfaltata.', servizi: 'Parcheggio, bar stagionale, docce, spiaggia libera', costo: 'Parcheggio 2-3€/h', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-rosa-budelli', name: 'Spiaggia Rosa (Budelli)',      lat: 41.2835, lng: 9.3505,  cat: 'spiaggia',   color: '#00BFFF', description: 'La Spiaggia Rosa dell\'isola di Budelli, nel Parco Nazionale Arcipelago La Maddalena. Colore rosa dal corallo Miniacina miniacea. Accesso vietato — visione solo da barca.', come: 'Solo via barca dall\'Arcipelago della Maddalena. Tour giornalieri da Palau o La Maddalena.', servizi: 'Nessuno — accesso vietato per tutela ambientale', costo: 'Tour barca: 60-90€/persona (incluso nelle escursioni arcipelago)', tel: '', web: 'lamaddalenapark.it', orari: 'Tour disponibili aprile-ottobre.' },
  { id: 'porto-ferro',           name: 'Porto Ferro',                  lat: 40.6870, lng: 8.2050,  cat: 'spiaggia',   color: '#00BFFF', description: 'Spiaggia selvaggia 2 km, dune e pineta, Bandiera Blu 2025 (Sassari). Miglior spot surf invernale della Sardegna con onda NW da Maestrale. Bonga Surf School e Il Baretto (bar + eventi estivi) sono qui.', come: 'Da Alghero 15 km: SS127bis poi SP42 direzione Olmedo, poi strade secondarie, sterrata 3 km finale. Auto alta clearance consigliata.', servizi: 'Il Baretto (bar, pizze, vinile, eventi domenicali); Bonga Surf School (lezioni, noleggio tavole/SUP); parcheggio informale sterrato', costo: 'Spiaggia gratuita. Accesso spiaggia incluso nel Bandiera Blu Sassari.', tel: '', web: '', orari: 'Spiaggia: tutto l\'anno. Il Baretto: 9:00–23:00 stagione estiva (giu-set). Surf: inverno ottobre-marzo (onda migliore).' },
  { id: 'cala-sisine',           name: 'Cala Sisine',                  lat: 40.1550, lng: 9.6320,  cat: 'spiaggia',   color: '#00BFFF', description: 'Caletta del Golfo di Orosei con torrente che si getta in mare, pineta di ginepri centenari, acque cristalline. Raggiungibile via mare o trekking 3h.', come: 'Via mare da Cala Gonone (40 min) o trekking 3h dall\'altopiano del Golgo (Baunei).', servizi: 'Nessuno — spiaggia selvaggia', costo: 'Barca: 65-70€ A/R da Cala Gonone', tel: '', web: 'golfo-orosei.it', orari: 'Via mare: aprile-ottobre.' },
  { id: 'mari-ermi',             name: 'Mari Ermi',                    lat: 39.9686, lng: 8.3988,  cat: 'spiaggia',   color: '#00BFFF', description: 'Penisola del Sinis, sabbia di quarzo bianca-rosa come Is Arutas ma meno frequentata. Area SIC protetta. Acque basse e trasparenti, ideale per snorkeling.', come: 'Da Oristano 25 km via SS292. Stessa direzione di Is Arutas (Riola Sardo).', servizi: 'Bar stagionale, nessuno stabilimento', costo: 'Gratuito. Parcheggio 1€/h', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'le-tonnare-stintino',   name: 'Le Tonnare (Stintino)',        lat: 40.9297, lng: 8.2098,  cat: 'spiaggia',   color: '#00BFFF', description: 'Seconda spiaggia di Stintino dopo La Pelosa. Acque turchesi, sabbia fine, meno affollata. Vista diretta sull\'isola dell\'Asinara. Mare del resort 4 stelle.', come: 'Da Sassari 30 km via SP34. Autobus ARST estivo. Da Stintino 2 km.', servizi: 'Stabilimento, bar, noleggio, bagnino, resort adiacente', costo: 'Ombrellone 20-25€/giorno', tel: '', web: 'stintino.com', orari: 'Stabilimento: maggio-settembre.' },

  // GALLURA & ARCIPELAGO (OT)
  { id: 'cala-coticcio',        name: 'Cala Coticcio (Caprera)',       lat: 41.2330, lng: 9.5556, cat: 'spiaggia', color: '#00BFFF', description: 'La "Tahiti dell\'Arcipelago". Acque turchesi elettriche, granito rosa-bianco, sabbia nivea. Una delle più belle della Maddalena. Raggiungibile solo a piedi (30 min) o via mare.', come: 'A piedi da Cala Garibaldi (30 min sentiero segnato) o barca da La Maddalena.', servizi: 'Nessuno — spiaggia selvaggia nel Parco Nazionale', costo: 'Gratuito', tel: '', web: 'lamaddalenapark.it', orari: 'Tutto l\'anno. Primavera-estate consigliato.' },
  { id: 'cala-corsara',         name: 'Cala Corsara (Spargi)',         lat: 41.2258, lng: 9.3370, cat: 'spiaggia', color: '#00BFFF', description: 'La baia più bella dell\'isola di Spargi. Acque che virano dal turchese al blu cobalto, sabbia bianchissima. Area protetta del Parco Nazionale Arcipelago Maddalena. Raggiungibile solo via barca.', come: 'Solo via mare: tour arcipelago da Palau o La Maddalena.', servizi: 'Nessuno — spiaggia selvaggia', costo: 'Incluso nei tour arcipelago (60-120€/persona)', tel: '', web: 'lamaddalenapark.it', orari: 'Aprile-ottobre.' },
  { id: 'lu-impostu',           name: 'Lu Impostu (San Teodoro)',      lat: 40.8260, lng: 9.6870, cat: 'spiaggia', color: '#00BFFF', description: 'Baia ampia con acque basse color smeraldo, dal blu chiaro all\'azzurro intenso. Meno affollata di Cala Brandinchi. A 10 minuti a piedi dal sentiero sud.', come: 'Da San Teodoro 6 km via SP82. Parcheggio sterrato. Sentiero da Cala Brandinchi (15 min).', servizi: 'Nessun stabilimento — spiaggia libera', costo: 'Gratuito. Parcheggio informale 2€', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'li-cossi',             name: 'Li Cossi (Trinità d\'Agultu)',  lat: 41.0130, lng: 8.8600, cat: 'spiaggia', color: '#00BFFF', description: 'Piccola cala con laghetto d\'acqua dolce naturale nascosto nella gola retrostante. Granito rosa, sabbia fine, totale isolamento. Una delle più scenografiche del nord Sardegna.', come: 'Da Costa Paradiso 2 km. Parcheggio Hotel Rosi Marini poi scalinata di pietra (10 min).', servizi: 'Nessuno — accesso solo a piedi', costo: 'Gratuito', tel: '', web: '', orari: 'Maggio-settembre consigliato.' },
  { id: 'rena-bianca',          name: 'Rena Bianca (Santa Teresa)',    lat: 41.2304, lng: 9.1917, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia cittadina di Santa Teresa Gallura, 700m di sabbia fine, acque azzurre, vista diretta sulla Corsica a 12 km. Raggiungibile a piedi dal centro. Una delle più belle del nord.', come: 'Dal centro di Santa Teresa Gallura 5 min a piedi. Parcheggio in paese.', servizi: 'Stabilimento, bar, noleggio, docce, area libera', costo: 'Ombrellone 20-30€/giorno. Area libera gratuita.', tel: '', web: 'visitsantateresagallura.com', orari: 'Stabilimento: giugno-settembre.' },
  { id: 'cala-spinosa',         name: 'Cala Spinosa (Capo Testa)',     lat: 41.2412, lng: 9.1347, cat: 'spiaggia', color: '#00BFFF', description: 'Quattro piccole calette di granito bianco nell\'area selvaggia di Capo Testa. Acque limpidissime, tramonto sulla Corsica di rara bellezza. Accesso via sentiero impegnativo.', come: 'Da Santa Teresa 3 km per Capo Testa. Sentieri mal segnati, 20-30 min a piedi dal faro.', servizi: 'Nessuno — calette selvagge', costo: 'Gratuito', tel: '', web: '', orari: 'Maggio-ottobre.' },
  { id: 'la-marmorata',         name: 'La Marmorata (Santa Teresa)',   lat: 41.2433, lng: 9.2100, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia sabbiosa dorata con rocce di granito, calette nella Marmoratina. Vista sull\'isola di Caprera. Meno frequentata delle vicine Rena Bianca e Cala Grande.', come: 'Da Santa Teresa 5 km verso est (indicazioni Marmorata Hotel). Parcheggio privato.', servizi: 'Stabilimento hotel adiacente (uso a pagamento)', costo: 'Accesso libero. Zona hotel a pagamento.', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'cala-moresca',         name: 'Cala Moresca (Golfo Aranci)',   lat: 40.9820, lng: 9.6250, cat: 'spiaggia', color: '#00BFFF', description: 'Due piccole spiagge di sabbia dorata con sentiero per il faro panoramico a 342m. Paesaggio selvaggio, nessun servizio, mare verde con fondali sabbiosi. Molto solitaria.', come: 'Da Golfo Aranci 4 km via strada comunale. Parcheggio sterrato. Sentiero al faro 45 min.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // ALGHERO & RIVIERA DEL CORALLO (SS)
  { id: 'le-bombarde',          name: 'Le Bombarde (Alghero)',         lat: 40.6187, lng: 8.2128, cat: 'spiaggia', color: '#00BFFF', description: 'Lungo arenile di sabbia dorata a 5 km da Alghero, acque trasparenti con fondale variabile. Adatta a famiglie e bambini. A 2 km dal Nuraghe Palmavera.', come: 'Da Alghero 5 km via SP55. Bus estivo linea 5N. Parcheggio a pagamento.', servizi: 'Stabilimento, bar, docce, noleggio, bagnino', costo: 'Parcheggio 3€/h. Ombrellone 20-25€/giorno', tel: '', web: '', orari: 'Stabilimento: giugno-settembre.' },
  { id: 'mugoni',               name: 'Spiaggia di Mugoni (Alghero)', lat: 40.6320, lng: 8.2340, cat: 'spiaggia', color: '#00BFFF', description: 'All\'interno del Parco Regionale Porto Conte. Sabbia dorata, acque tranquille, pineta retrostante. Meno frequentata delle Bombarde. Fondale ideale per snorkeling.', come: 'Da Alghero 10 km via SP55 direzione Porto Conte. Parcheggio nel parco.', servizi: 'Bar stagionale, sentieri nel parco Porto Conte', costo: 'Gratuito. Parcheggio 2€/h', tel: '', web: 'algheroparks.it', orari: 'Tutto l\'anno.' },
  { id: 'lazzaretto',           name: 'Lazzaretto (Alghero)',          lat: 40.5948, lng: 8.2238, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia urbana raggiungibile da Alghero in bicicletta via pista ciclabile. Sabbia fine, acque azzurre, ex edificio del lazzaretto del XVII sec. sullo sfondo. Frequentatissima dai locali.', come: 'Da Alghero 3 km via pista ciclabile (20 min in bici). Bus linea 4.', servizi: 'Stabilimento, bar, docce, noleggio, bagnino', costo: 'Ombrellone 15-22€/giorno. Accesso libero.', tel: '', web: '', orari: 'Stabilimento: maggio-settembre.' },

  // BARONIA & NUORESE (NU)
  { id: 'cala-fuili',           name: 'Cala Fuili (Cala Gonone)',      lat: 40.2573, lng: 9.6428, cat: 'spiaggia', color: '#00BFFF', description: 'Caletta con ciottoli bianchi in un fiordo calcareo. Gola di 50m alle spalle. Inizio del sentiero per Cala Luna (3h). Acque profonde e limpidissime, ideale per snorkeling.', come: 'Da Cala Gonone 2 km via SP26. Strada asfaltata, parcheggio gratuito, poi 100 gradini.', servizi: 'Bar al parcheggio in estate. Nessuno in spiaggia.', costo: 'Gratuito', tel: '', web: 'calagononesardinia.com', orari: 'Tutto l\'anno.' },
  { id: 'bidderosa',            name: 'Bidderosa (Orosei)',            lat: 40.3880, lng: 9.7140, cat: 'spiaggia', color: '#00BFFF', description: 'Cinque calette di sabbia bianca separate da promontori granitici in area SIC protetta. Accesso contingentato. Pineta di pini d\'Aleppo, acque turchesi. Tra le più incontaminate della Sardegna orientale.', come: 'Da Orosei 10 km via SP2 poi sentiero. Navetta dal parcheggio (2€) in estate.', servizi: 'Navetta dal parcheggio. Nessun servizio in spiaggia.', costo: 'Gratuito. Navetta 2€ A/R.', tel: '', web: '', orari: 'Giugno-settembre: 7:30-18:00.' },
  { id: 'cannazzellu',          name: 'Cannazzellu (Siniscola)',       lat: 40.5380, lng: 9.7870, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia selvaggia di sabbia bianca finissima, acque blu-verde trasparenti. Vista sul Faro di Capo Comino. Quasi sempre deserta anche in agosto. Una delle perle dimenticate del nuorese.', come: 'Da Siniscola 12 km via SP26 poi sterrata 3 km. Parcheggio informale.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'pedra-marchesa',       name: 'Pedra Marchesa (Siniscola)',    lat: 40.4940, lng: 9.7780, cat: 'spiaggia', color: '#00BFFF', description: 'Grande spiaggia di sabbia candida con piccola formazione rocciosa a pelo d\'acqua. Macchia mediterranea retrostante. Isolata, raramente affollata. Continuazione naturale di Berchida.', come: 'Da Siniscola via SP26 poi sterrata. Continuazione di Berchida a piedi (20 min).', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // GOLFO DI OROSEI / OGLIASTRA (OG)
  { id: 'cala-biriola',         name: 'Cala Biriola (Baunei)',         lat: 40.1490, lng: 9.6190, cat: 'spiaggia', color: '#00BFFF', description: 'Caletta di ghiaia bianca con ciottoli perfetti, una delle più isolate del Golfo di Orosei. Natura selvaggia eccezionale. Raggiungibile solo via mare o trekking esperto (6h+).', come: 'Solo via mare da Cala Gonone o Santa Maria Navarrese. Trekking solo per esperti.', servizi: 'Nessuno', costo: 'Barca: 65-80€ A/R dalle basi del Golfo di Orosei', tel: '', web: '', orari: 'Aprile-ottobre via mare.' },
  { id: 'scogli-rossi',         name: 'Scogli Rossi — Cea (Tortolì)', lat: 39.8820, lng: 9.6750, cat: 'spiaggia', color: '#00BFFF', description: 'Ampia spiaggia di sabbia bianchissima fiancheggiata da scogliere di granito rosso-arancio. Mare verde-azzurro poco profondo. Tra le più belle dell\'Ogliastra. Bandiera Blu.', come: 'Da Tortolì 6 km via SS125 poi direzione Torre di Barì. Parcheggio a pagamento.', servizi: 'Bar stagionale, parcheggio, spiaggia libera e attrezzata', costo: 'Parcheggio 2-3€/h. Ombrellone 20€/giorno', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // SUD-EST (CA)
  { id: 'punta-molentis',       name: 'Punta Molentis (Villasimius)', lat: 39.1468, lng: 9.5383, cat: 'spiaggia', color: '#00BFFF', description: 'Sottile lingua di terra che unisce la costa a un\'isola granitica. Due specchi d\'acqua azzurra sui lati. Una delle calette più fotografate della Sardegna.', come: 'Da Villasimius 4 km. Parcheggio a pagamento, poi 5 min a piedi o navetta.', servizi: 'Navetta dal parcheggio. Nessun stabilimento in spiaggia.', costo: 'Parcheggio 3€/h. Navetta 3€ A/R.', tel: '', web: '', orari: 'Tutto l\'anno. Navetta: giugno-settembre.' },
  { id: 'cala-sinzias',         name: 'Cala Sinzias (Castiadas)',     lat: 39.1660, lng: 9.6350, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia di sabbia fine con pineta di pini d\'Aleppo centenari, acque verde-azzurre. Poco affollata anche in estate. Carattere quasi solitario a 14 km da Villasimius.', come: 'Da Villasimius 14 km via SS125. Parcheggio a pagamento.', servizi: 'Camping vicino, bar stagionale, parcheggio', costo: 'Gratuito. Parcheggio 2€/h', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'solanas',              name: 'Solanas (Sinnai)',              lat: 39.1480, lng: 9.3880, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia sabbiosa dorata con piccolo villaggio di pescatori e torre spagnola sul promontorio est. Acque verdi, moderatamente frequentata. A 35 km da Cagliari.', come: 'Da Cagliari 35 km via SS125. Bivio segnalato. Parcheggio a pagamento in estate.', servizi: 'Bar, ristoranti, parcheggio, stabilimento', costo: 'Ombrellone 15-20€/giorno', tel: '', web: '', orari: 'Stabilimento: maggio-settembre.' },

  // SUD SARDEGNA (CA/SU)
  { id: 'cala-cipolla',         name: 'Cala Cipolla (Chia)',           lat: 38.8718, lng: 8.8482, cat: 'spiaggia', color: '#00BFFF', description: 'Piccola caletta incorniciata da rocce di granito rosa, pineta e dune bianche. Più raccolta e riparata di Su Giudeu. Ideale per snorkeling. Diverse calette minori a piedi.', come: 'Da Cagliari 65 km via SS195. Da Chia (Domus de Maria) 2 km verso Capo Spartivento.', servizi: 'Bar stagionale', costo: 'Gratuito. Parcheggio 3€/h', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'cala-piscinni',        name: 'Cala Piscinnì (Domus de Maria)', lat: 38.8533, lng: 8.7933, cat: 'spiaggia', color: '#00BFFF', description: 'Incantevole spiaggia di sabbia fine bianchissima, acque azurre e trasparenti, torre spagnola sul promontorio. Due cale accessibili via sentiero. Quasi sempre solitaria.', come: 'Da Teulada 12 km via strada costiera poi sterrata 2 km.', servizi: 'Nessuno — spiaggia selvaggia', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'porto-pino',           name: 'Porto Pino (Sant\'Anna Arresi)', lat: 38.9282, lng: 8.6307, cat: 'spiaggia', color: '#00BFFF', description: 'Distese di dune di sabbia bianchissima con pineta di pini d\'Aleppo. Acque bassissime, ideale per famiglie. Cieli stellati straordinari per assenza di inquinamento luminoso.', come: 'Da Carbonia 30 km via SS126. Da Cagliari 80 km. Parcheggio a pagamento.', servizi: 'Stabilimento, bar, ristoranti, noleggio, parcheggio', costo: 'Parcheggio 3€/h. Ombrellone 20€/giorno', tel: '', web: '', orari: 'Stabilimento: giugno-settembre. Spiaggia: sempre aperta.' },
  { id: 'coa-quaddus',          name: 'Coa Quaddus (Sant\'Antioco)',   lat: 38.9950, lng: 8.4530, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia selvaggia di sabbia bianco-grigia con acqua verde-smeraldo sull\'isola di Sant\'Antioco. Carattere quasi solitario. Dune retrostanti con ginepri centenari.', come: 'Dall\'abitato di Sant\'Antioco 8 km via strada costiera poi sterrata.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'bobba',                name: 'Spiaggia Bobba (Carloforte)',   lat: 39.1430, lng: 8.2940, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia dell\'isola di San Pietro con sabbia di sfere di ciottoli misti. Iconiche Colonne di roccia trachite rossa nel mare. Frequentata dai carlofortini. Tramonto magnifico.', come: 'Traghetto da Calasetta o Portovesme. Dal porto di Carloforte 3 km.', servizi: 'Bar, parcheggio, ristoranti vicini', costo: 'Traghetto: 5-10€. Spiaggia gratuita.', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // COSTA VERDE (SU/VS)
  { id: 'portixeddu',           name: 'Portixeddu (Buggerru)',         lat: 39.3950, lng: 8.3750, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia dorata con dune e pineta nella Costa Verde. Poco affollata, acqua limpida, carattere solitario. A 10 km da Buggerru con la galleria mineraria percorribile.', come: 'Da Buggerru 10 km via strada panoramica per Capo Pecora. Parcheggio sterrato.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'scivu',                name: 'Scivu (Arbus)',                  lat: 39.5310, lng: 8.4020, cat: 'spiaggia', color: '#00BFFF', description: 'Dune fino a 70 metri di altezza ricoperte di ginepri — le più alte d\'Europa. Piccola cascata d\'acqua dolce sulla spiaggia. Paesaggio irreale, totale solitudine anche in agosto.', come: 'Da Arbus 15 km. Poi 1h a piedi da parcheggio Torre dei Corsari o Narucci.', servizi: 'Nessuno — accesso solo a piedi', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno. 1h a piedi dal parcheggio.' },
  { id: 'piscinas',             name: 'Piscinas (Arbus)',               lat: 39.5450, lng: 8.3958, cat: 'spiaggia', color: '#00BFFF', description: 'Il "Sahara sardo". Dune fino a 30m estese per 3 km², le più alte d\'Europa. Il Maestrale le modella ogni giorno in nuove forme. Area naturalistica protetta, totale isolamento.', come: 'Da Arbus 20 km via sterrata lunga ma percorribile. Parcheggio gratuito.', servizi: 'Hotel Scirocco (pranzo, bar, camere). Null\'altro nella zona.', costo: 'Gratuito', tel: '', web: 'hotelingolf.it', orari: 'Tutto l\'anno.' },
  { id: 'torre-corsari',        name: 'Torre dei Corsari (Arbus)',      lat: 39.5800, lng: 8.4170, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia con dune alte e torre d\'avvistamento del XVII secolo. Maestrale scolpisce la sabbia. Acque pulitissime, carattere solitario anche in luglio-agosto.', come: 'Da Arbus 15 km via SP72. Parcheggio gratuito.', servizi: 'Bar stagionale', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'pistis',               name: 'Pistis (Arbus)',                  lat: 39.6130, lng: 8.4320, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia di dune con la "Casa del Poeta" — habitat scavato dentro un ginepro millenario per non abbatterlo. Paesaggio fantascientifico. Acque limpidissime, zero strutture.', come: 'Da Arbus 10 km via SP72. Parcheggio gratuito.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // SINIS & ORISTANESE (OR)
  { id: 'san-giovanni-sinis',   name: 'San Giovanni di Sinis (Cabras)', lat: 39.8690, lng: 8.4358, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia con vegetazione dunale unica e chiesa paleocristiana di San Giovanni (V sec.) adiacente. A 3 km dalle rovine di Tharros fenicio-romana. Paesaggio lunare.', come: 'Da Oristano 20 km via SS292. Parcheggio gratuito vicino alla chiesa.', servizi: 'Nessuno in spiaggia. Chiesa visitabile (ingresso gratuito).', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'maimoni',              name: 'Maimoni (Cabras)',               lat: 39.9580, lng: 8.4250, cat: 'spiaggia', color: '#00BFFF', description: 'Due km di sabbia di quarzo bianco identica ad Is Arutas ma quasi sempre deserta. Accesso difficile: 4x4 o 1h di cammino dall\'Abbarossa. Oasi costiera intatta.', come: 'Da Cabras via SP6 sterrata 8 km (4x4) oppure sentiero 1h da parcheggio Abbarossa.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 'putzu-idu',            name: 'Putzu Idu (San Vero Milis)',     lat: 40.0340, lng: 8.3850, cat: 'spiaggia', color: '#00BFFF', description: 'Lungo arenile aperto alla tramontana, ottimo per surf e windsurf. Di fronte l\'isola di Mal di Ventre raggiungibile in barca. Sunset spettacolare verso l\'orizzonte del Tirreno.', come: 'Da Oristano 30 km via SS292 per Riola Sardo poi SP105. Parcheggio.', servizi: 'Bar, stabilimento, noleggio windsurf, barche per Mal di Ventre', costo: 'Spiaggia libera gratuita. Barca Mal di Ventre: 20-30€ A/R.', tel: '', web: '', orari: 'Tutto l\'anno. Windsurf: ottobre-aprile.' },
  { id: 'is-arenas',            name: 'Is Arenas (Narbolia)',           lat: 40.0420, lng: 8.3720, cat: 'spiaggia', color: '#00BFFF', description: 'La più estesa foresta di dune della Sardegna (3 km²). Spiaggia lunghissima con sabbia dorata, pineta sul retro. Raggiungibile solo a piedi dai campeggi.', come: 'Da Oristano 25 km via SS292 poi Camping Is Arenas. Solo sentiero a piedi.', servizi: 'Camping Is Arenas (unico servizio nella zona). Nessuno in spiaggia.', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },
  { id: 's-archittu',           name: 'S\'Archittu (Cuglieri)',          lat: 40.1330, lng: 8.3360, cat: 'spiaggia', color: '#00BFFF', description: 'Famosa per l\'arco naturale di roccia calcarea alto 15 metri — uno dei più fotografati d\'Italia. Spettacolo al tramonto con luce che filtra nell\'arco. Girata in alcuni film italiani.', come: 'Da Oristano 40 km via SS292 per Cuglieri. Parcheggio gratuito vicino all\'arco.', servizi: 'Bar, piccolo stabilimento stagionale', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno.' },

  // CITTÀ
  { id: 'cagliari',     name: 'Cagliari',     lat: 39.2195, lng: 9.1124,  cat: 'città', color: '#FFFFFF', description: 'Capitale della Sardegna. Quartiere Castello medievale, Bastione Saint Remy, anfiteatro romano, fenicotteri nel parco Molentargius, mercato di San Benedetto.', come: 'Aeroporto Cagliari-Elmas (CAG) a 7 km. Bus ARST o taxi. Traghetti dal porto.', servizi: 'Musei, hotel, ristoranti, shopping, spiagge (Poetto a 5 km)', costo: 'Musei 3-8€. Bastione Saint Remy: gratuito', tel: '+39 070 6776111', web: 'www.comune.cagliari.it', orari: 'Musei: mar-dom 9:00-20:00' },
  { id: 'olbia',        name: 'Olbia',        lat: 40.9253, lng: 9.4969,  cat: 'città', color: '#FFFFFF', description: 'Porta della Costa Smeralda. Museo Archeologico (gratuito) su Isola Peddone con la nave romana del 259 d.C. Basilica di San Simplicio (V sec.), porto traghetti per continente e Civitavecchia/Livorno/Genova, via Garibaldi pedonale.', come: 'Aeroporto Olbia-Costa Smeralda (OLB) a 4 km. Bus ARST o taxi (15€ circa). Noleggio auto: Europcar +39 0789 69548, Hertz +39 0789 69389, Sixt +39 02 9475 7979.', servizi: 'Porto traghetti, aeroporto internazionale, hotel, ristoranti, Museo Archeologico gratuito (Isola Peddone), parcheggio gratuito Molo Brin', costo: 'Museo Archeologico: gratuito (prenotare gruppi >30: 0789 28290) · Basilica San Simplicio: gratuito', tel: '+39 0789 22221', web: 'www.comune.olbia.ot.it', orari: 'Museo Arch.: Mar–Sab 08:00–13:00 / 16:00–19:00. Basilica: 8:00–12:00 / 16:00–18:30.' },
  { id: 'alghero',      name: 'Alghero',      lat: 40.5590, lng: 8.3183,  cat: 'città', color: '#FFFFFF', description: 'La "Barceloneta" sarda. Centro storico catalano con mura del XVI sec., bastioni sul mare al tramonto, Vermentino DOC, aragosta alla catalana.', come: 'Aeroporto Alghero-Fertilia (AHO) a 12 km. Bus AF o taxi. In estate bus dai campeggi.', servizi: 'Centro storico, spiagge, ristoranti, cantine vinicole, Grotte di Nettuno', costo: 'Centro storico gratuito. Grotte di Nettuno 14€', tel: '+39 079 9978054', web: 'www.alghero-turismo.it', orari: 'Bastioni: sempre aperti' },
  { id: 'sassari',      name: 'Sassari',      lat: 40.7259, lng: 8.5556,  cat: 'città', color: '#FFFFFF', description: 'Seconda città sarda. Museo Nazionale Sanna con collezione nuragica, piazza d\'Italia neoclassica, Faradda di li Candareri ad agosto con i gremi medievali.', come: 'Da Alghero 35 km. Da Olbia 103 km. Treno regionale. Bus ARST.', servizi: 'Musei, università, teatro, mercati, ospedale', costo: 'Museo Sanna 3€. Piazza Italia: gratuito', tel: '+39 079 2078000', web: 'www.comune.sassari.it', orari: 'Museo Nazionale Sanna: mar-dom 9:00-20:00' },
  { id: 'nuoro',        name: 'Nuoro',        lat: 40.3217, lng: 9.3300,  cat: 'città', color: '#FFFFFF', description: 'Cuore della Barbagia. Città di Grazia Deledda (Premio Nobel 1926). Museo del Costume sardo ISRE, MAN (arte contemporanea), vista sul Gennargentu.', come: 'Da Olbia 120 km. Da Cagliari 179 km. ARST pullman da Cagliari e Sassari.', servizi: 'Musei, cultura, artigianato sardo, gastronomia barbaricina', costo: 'Museo del Costume 5€. MAN 5€', tel: '+39 0784 238520', web: 'www.comune.nuoro.it', orari: 'Musei: mar-dom 9:00-13:00 / 15:00-19:00' },
  { id: 'oristano',     name: 'Oristano',     lat: 39.9038, lng: 8.5898,  cat: 'città', color: '#FFFFFF', description: 'Giostra medievale della Sartiglia a febbraio, sito punico-romano di Tharros, stagni con fenicotteri e gru, spiagge della penisola del Sinis.', come: 'Da Cagliari 95 km via SS131. Treno da Cagliari (1h30). ARST.', servizi: 'Centro storico, museo Antiquarium, attrazioni naturali, spiagge vicine', costo: 'Tharros 9-11€. Piazza Eleonora: gratuito', tel: '+39 0783 791148', web: 'www.comune.oristano.or.it', orari: 'Centro storico sempre aperto' },
  { id: 'la-maddalena', name: 'La Maddalena', lat: 41.2169, lng: 9.4026,  cat: 'città', color: '#FFFFFF', description: 'Isola principale dell\'Arcipelago La Maddalena (UNESCO). Centro storico colorato, 8 spiagge Bandiera Blu 2025 (Bassa Trinità, Cala Garibaldi, Spalmatore, Tegge e altre). Museo Garibaldi a Caprera (casa dove morì, letto originale). Tour in barca alle 7 isole.', come: 'Traghetto da Palau (20 min, 3-5€/persona). Auto al seguito 20-30€. Traghetti ogni 30 min in estate (6:00–23:00), ridotti in inverno.', servizi: 'Porto, hotel, ristoranti, noleggio gommoni (Marina David, Nautica Sagiel), tour arcipelago, Compendio Garibaldino a Caprera (5 km dal centro)', costo: 'Traghetto Palau–Maddalena: 3-5€/persona. Tour arcipelago: 60-120€. Garibaldi: 10€ combinato.', tel: '+39 0789 790228', web: 'www.lamaddalenapark.it', orari: 'Traghetti: ogni 30 min estate (6:00–23:00), ridotti inverno.' },
  { id: 'bosa',         name: 'Bosa',         lat: 40.2976, lng: 8.5049,  cat: 'città', color: '#FFFFFF', description: 'Borgo medievale multicolore sul fiume Temo. Castello Malaspina con affreschi del XIV sec., il borghi dei conciatori SA Costa, Malvasia di Bosa DOC.', come: 'Da Alghero 45 km via SS292 costiera panoramica. Da Oristano 60 km via SS292.', servizi: 'Centro storico, castello, spiagge vicine (Bosa Marina 3 km)', costo: 'Castello Malaspina 3€', tel: '+39 0785 377003', web: 'www.comune.bosa.or.it', orari: 'Castello: 10:00-13:00 / 15:00-18:00 (estate fino alle 20:00)' },
  { id: 'castelsardo',  name: 'Castelsardo',  lat: 40.9135, lng: 8.7127,  cat: 'città', color: '#FFFFFF', description: 'Borgo medievale su promontorio a picco sul mare. Castello dei Doria (XII sec.) con il Museo dell\'Intreccio Mediterraneo — cesti in asfodelo, arti decorative mediterranee. Vista sull\'Asinara e la Corsica. Bandiera Blu 2025 (spiagge Sacro Cuore, Madonnina).', come: 'Da Sassari 35 km via SS200. Da Olbia 120 km. Bus ARST da Sassari.', servizi: 'Centro storico, Museo Intreccio Mediterraneo nel castello, botteghe cesteria, ristoranti di pesce (ottimo aragosta), spiagge', costo: 'Museo Intreccio (Castello Doria): incluso visita castello — tariffe variabili', tel: '+39 079 601 4769', web: 'mimcastelsardo.it', orari: 'Gen–Mar / Nov–Dic: 10:00–17:00. Apr–Ott: 09:00–19:30.' },

  // ATTRAZIONI E SITI ARCHAEOLOGICI
  { id: 'su-nuraxi',           name: 'Nuraghe Su Nuraxi (Barumini)',       lat: 39.7035, lng: 8.9877,  cat: 'attrazione', color: '#FFD700', description: 'Patrimonio UNESCO (1997). Nuraghe del 1500 a.C., il più imponente e meglio conservato della Sardegna. Villaggio nuragico di 200+ capanne intorno alla torre.', come: 'Da Cagliari 60 km via SS131 poi SS197 direzione Barumini. Parcheggio gratuito.', servizi: 'Parcheggio, visite guidate ogni 30 min, museo didattico, shop', costo: '10€ adulti, 6€ ridotti (12-18 anni), bambini <6 gratuiti', tel: '+39 070 9368128', web: 'www.fondazionebarumini.it', orari: '9:00-tramonto (ultima visita 1h prima). Chiuso 1 gennaio e 25 dicembre.' },
  { id: 'grotte-nettuno',      name: 'Grotte di Nettuno',                  lat: 40.5714, lng: 8.1585,  cat: 'attrazione', color: '#FFD700', description: 'Spettacolare grotta marina a Capo Caccia con stalattiti, stalagmiti e lago sotterraneo. Accessibile via barca da Alghero (40 min, Linea Grotte Navisarda) oppure a piedi con la scalinata Escala del Cabirol (660 gradini, 20 min). Visite ogni ora intera, durata ~30 min.', come: 'Via barca: Linea Grotte Navisarda da porto Alghero (+39 079 950603). Via terra: Capo Caccia (20 km da Alghero via SP55), poi 660 gradini.', servizi: 'Visite guidate obbligatorie ogni ora, bar al pontile, barca di linea da Alghero, parcheggio a Capo Caccia', costo: 'Grotta: 14€ adulti / 7€ bambini 6-12 / gratuito <6 · Barca a/r da Alghero: ~15€ adulti', tel: '+39 079 946540 (grotta) · +39 079 950603 (barca)', web: 'grottadinettuno.it', orari: 'Tutto l\'anno 9:00–19:00 (ult. ingresso). Inverno ridotto. Chiusa con mare mosso — verificare prima.' },
  { id: 'nora',                name: 'Sito Punico-Romano di Nora',         lat: 38.9847, lng: 9.0159,  cat: 'attrazione', color: '#FFD700', description: 'Città antica fondata dai Fenici nel IX sec. a.C. su una penisola. Anfiteatro, terme con mosaici, tempio a picco sul mare, foro romano. Visita guidata inclusa.', come: 'Da Cagliari 40 km via SS195 direzione Pula. Parcheggio gratuito.', servizi: 'Parcheggio, visita guidata inclusa, museo a Pula (800m)', costo: '8€ adulti (visita guidata inclusa). Museo di Pula: 4€', tel: '+39 070 9209138', web: 'fondazionepulacultura.it', orari: 'Estate: 9:00-20:00. Inverno: 9:00-17:00.' },
  { id: 'tharros',             name: 'Tharros (Cabras, Oristano)',         lat: 39.8722, lng: 8.4403,  cat: 'attrazione', color: '#FFD700', description: 'Città punico-romana su penisola del Sinis. Colonne romane al tramonto, terme, necropoli, tophet. Una delle aree archeologiche più suggestive d\'Italia.', come: 'Da Oristano 22 km via SS292 poi SP6. Bus ARST estivo da Oristano.', servizi: 'Parcheggio, visite guidate, bookshop, spiagge vicine (torre di San Giovanni)', costo: '9€ adulti, 6€ ridotti. Cumulativo con Antiquarium Arborense: 13€', tel: '+39 0783 370019', web: 'monteprama.it/tharros', orari: 'Estate: 8:30-20:00. Inverno: 9:00-17:00.' },
  { id: 'nuraghe-losa',        name: 'Nuraghe Losa (Abbasanta)',           lat: 40.1169, lng: 8.7901,  cat: 'attrazione', color: '#FFD700', description: 'Nuraghe trilobato del XV-XIII sec. a.C. Due piani visitabili con scale originali. Tra i meglio conservati della Sardegna. Sulla SS131 tra Cagliari e Sassari.', come: 'Sulla SS131, uscita Abbasanta (110 km da Cagliari, 75 da Sassari). Parcheggio gratuito adiacente.', servizi: 'Parcheggio gratuito, guide su prenotazione, piccolo museo in loco', costo: '6€ adulti / 3€ bambini 6-13 anni', tel: '+39 0785 52302', web: 'nuraghelosa.net', orari: '9:00-18:00 (estate fino alle 20:00). Tutto l\'anno.' },
  { id: 'anfiteatro-cagliari', name: 'Anfiteatro Romano Cagliari',         lat: 39.2239, lng: 9.1132,  cat: 'attrazione', color: '#FFD700', description: 'Anfiteatro romano del II sec. d.C. scavato nella roccia calcarea del Colle di Buoncammino. Capienza originale 10.000 spettatori. Concerti estivi e spettacoli.', come: 'A piedi dal Bastione Saint Remy (10 min) o da piazza Yenne. Via Is Mirrionis.', servizi: 'Visite guidate, eventi estivi (luglio-agosto)', costo: '3€, eventi variabili (5-40€)', tel: '+39 070 675724', web: '', orari: 'Mar-dom: 9:00-17:00. Estate anche lunedì.' },
  { id: 'nuraghe-santu-antine', name: 'Nuraghe Santu Antine (Torralba)',  lat: 40.4864, lng: 8.7699,  cat: 'attrazione', color: '#FFD700', description: 'Il "palazzo" nuragico per eccellenza. Torre centrale di 17m con tre camere sovrapposte, tra le più alte conservate. Valle dei Nuraghi, 1800 a.C.', come: 'Da Sassari 35 km via SS131 uscita Torralba. Da Alghero 55 km. Parcheggio gratuito.', servizi: 'Parcheggio, visita con guida, museo Valle dei Nuraghi in paese', costo: '10€ adulti (include museo Valle dei Nuraghi)', tel: '+39 079 847298', web: 'nuraghesantuantine.it', orari: 'Tutti i giorni 9:00-tramonto.' },
  { id: 'anghelu-ruju',        name: 'Necropoli di Anghelu Ruju',         lat: 40.6329, lng: 8.3265,  cat: 'attrazione', color: '#FFD700', description: '37 tombe ipogeiche (domus de janas) del IV-III millennio a.C. La più importante necropoli pre-nuragica della Sardegna. Affreschi taurini sulle pareti.', come: 'Da Alghero 10 km via SP42 direzione Stintino. Vicino cantina Sella & Mosca.', servizi: 'Visita autonoma o guidata, parcheggio, visite combinate con cantina Sella & Mosca', costo: '5€ / 8€ cumulativo con Nuraghe Palmavera', tel: '+39 079 980438', web: 'necropoliangheluruju.it', orari: 'Estate: 9:00-19:00. Inverno: 10:00-16:00.' },
  { id: 'man-nuoro',           name: 'MAN — Museo Arte Contemporanea',    lat: 40.3211, lng: 9.3309,  cat: 'attrazione', color: '#FFD700', description: 'Uno dei musei d\'arte contemporanea più importanti del Mezzogiorno. Arte sarda e italiana del XX-XXI sec. Via Sebastiano Satta 27, Nuoro.', come: 'Nel centro di Nuoro, 5 min a piedi da piazza Vittorio Emanuele.', servizi: 'Bookshop, caffetteria, visite guidate su prenotazione, mostre temporanee', costo: '5€ adulti / gratuito under 6 e ogni prima domenica del mese', tel: '+39 0784 252110', web: 'museoman.it', orari: 'Mar-dom: 10:00-13:00 / 15:00-19:00 (estate 10:00-20:00).' },
  { id: 'museo-costume-nuoro', name: 'Museo del Costume Sardo (ISRE)',    lat: 40.3206, lng: 9.3311,  cat: 'attrazione', color: '#FFD700', description: 'La più completa raccolta di costume tradizionale sardo. Oltre 8.000 pezzi: abiti, gioielli, tessuti, maschere. Via Antonio Mereu 56, Nuoro.', come: 'A piedi dal centro di Nuoro, 300m dal MAN.', servizi: 'Visite guidate, laboratori artigianato, shop, biblioteca', costo: '5€ adulti / 10€ cumulativo con MAN', tel: '+39 0784 242900', web: 'isresardegna.it', orari: 'Mar-dom: 9:00-13:00 / 15:00-19:00.' },
  { id: 'antiquarium-oristano', name: 'Antiquarium Arborense (Oristano)', lat: 39.9049, lng: 8.5927,  cat: 'attrazione', color: '#FFD700', description: 'Museo con la più completa raccolta di reperti punico-romani della Sardegna. Tharros collection, bronzetti nuragici, mosaici romani. Piazza Corrias, Oristano.', come: 'Nel centro di Oristano, piazza Corrias. 5 min da piazza Eleonora.', servizi: 'Guide in italiano, inglese, francese, tedesco. Audioguide disponibili.', costo: '5€ adulti. Cumulativo con Tharros: 13€', tel: '+39 0783 791262', web: 'antiquariumarborense.it', orari: 'Mar-dom: 9:00-20:00.' },

  // PARCHI NATURALI
  { id: 'asinara',     name: 'Parco Nazionale Asinara',    lat: 41.0581, lng: 8.2761,  cat: 'parco', color: '#32CD32', description: 'Ex isola-prigione, oggi riserva con asini albini endemici, mare incontaminato, zero turismo di massa. Accessibile solo con tour autorizzati dal parco.', come: 'Traghetto da Porto Torres (30 min) o Stintino verso Fornelli (20 min). Solo tour guidati.', servizi: 'Guide naturalistiche, jeep 4x4, mountain bike, snorkeling, kayak', costo: 'Tour 25-60€ a persona (mezza o giornata intera)', tel: '+39 079 503388', web: 'www.parcoasinara.org', orari: 'Aprile-ottobre tutti i giorni. Inverno: weekend e festivi.' },
  { id: 'gennargentu', name: 'Parco Nazionale Gennargentu', lat: 39.9879, lng: 9.3246,  cat: 'parco', color: '#32CD32', description: 'Il tetto della Sardegna. Punta La Marmora 1834m. Cervi sardi, mufloni, aquile reali. Foreste di lecci e agrifogli. Escursioni guidate in ogni stagione.', come: 'Accesso da Fonni, Desulo o Aritzo. Da Nuoro 40 min. Da Cagliari circa 2h.', servizi: 'Rifugi, guide escursionistiche certificate, sentieri CAI segnati', costo: 'Accesso gratuito. Guide da 30-80€/gruppo', tel: '+39 0784 228061', web: 'www.parks.it/parco.nazionale.gennargentu', orari: 'Aperto tutto l\'anno. Estate: accesso libero. Inverno: verificare condizioni neve.' },
  { id: 'gola-gorropu', name: 'Gola di Gorropu',           lat: 40.2247, lng: 9.5161,  cat: 'parco', color: '#32CD32', description: 'Il canyon più profondo d\'Europa con pareti fino a 500m. Calcare bianco, torrente Rio Flumineddu. Trekking da facile (fondo gola) ad alpinistico.', come: 'Da Urzulei via SP9 poi sentiero 2h a piedi. Parcheggio al Sa Barva rifugio.', servizi: 'Guide obbligatorie per zone difficili, rifugio Sa Barva (ristoro, noleggio), parcheggio', costo: 'Ingresso gola 5€. Guida 50-80€/gruppo (consigliata)', tel: '+39 328 4116543', web: 'gorropu.info', orari: 'Tutto l\'anno. Estate preferibile per il guado del torrente.' },
  { id: 'molentargius', name: 'Parco Molentargius-Saline', lat: 39.2058, lng: 9.1445,  cat: 'parco', color: '#32CD32', description: 'Oasi urbana a Cagliari con migliaia di fenicotteri rosa, anatre, aironi e cormorani. Paradiso per il birdwatching a 500m dal Poetto. Zona Ramsar protetta.', come: 'Da Cagliari centro 10 min. Bus CTM linea 5. Ingresso principale da via La Palma.', servizi: 'Sentieri ciclopedonali, birdwatching, visite guidate, centro visitatori, parcheggio', costo: 'Accesso gratuito. Visite guidate 5-10€', tel: '+39 070 372727', web: 'www.parcomolentargius.it', orari: '06:30-21:00 (marzo-ottobre). 07:00-18:00 (novembre-febbraio).' },
  { id: 'porto-conte', name: 'Parco Regionale Porto Conte', lat: 40.5963, lng: 8.1956,  cat: 'parco', color: '#32CD32', description: 'Promontorio di Capo Caccia con pini, lentischi, cavalli selvaggi e falchi pellegrini. Grotte di Nettuno all\'interno del parco. Fondali protetti per diving.', come: 'Da Alghero 20 km via SP55. Bus turistico in estate.', servizi: 'Centro visitatori Casa Gioiosa, sentieri, Grotte di Nettuno, diving Capo Caccia, birdwatching', costo: 'Accesso libero. Grotte di Nettuno 14€', tel: '+39 079 945005', web: 'www.algheroparks.it', orari: 'Parco: sempre aperto. Centro visitatori: lun-ven 9:00-13:00.' },

  // HOTEL
  { id: 'villa-las-tronas',  name: 'Villa Las Tronas',                lat: 40.5578, lng: 8.3069,  cat: 'hotel', color: '#C8102E', description: 'Hotel 5★ in villa reale del 1800 su scogliera ad Alghero. Spa, piscina, ristorante gourmet. Ex residenza della famiglia reale italiana. Lungomare Valencia 1.', servizi: 'Spa, piscina, ristorante gourmet, bar, spiaggia privata, barca', costo: '250-600€/notte', tel: '+39 079 981818', web: 'www.hotelvillalastronas.it', orari: 'Aperto tutto l\'anno' },
  { id: 'hotel-pitrizza',    name: 'Hotel Pitrizza (Costa Smeralda)', lat: 41.1072, lng: 9.5533,  cat: 'hotel', color: '#C8102E', description: 'Hotel 5★ Lusso The Luxury Collection (Marriott). Villette private sul mare con piscina privata. L\'hotel più esclusivo della Costa Smeralda a Porto Cervo.', servizi: 'Piscina privata per ogni suite, spiaggia privata, ristorante stellato, concierge 24h', costo: '1.500-5.000€/notte', tel: '+39 0789 930111', web: 'www.hotelpitrizza.com', orari: 'Aperto maggio-ottobre' },
  { id: 'bagaglino',         name: 'Hotel Bagaglino Cagliari',       lat: 39.2201, lng: 9.1127,  cat: 'hotel', color: '#C8102E', description: 'Hotel 5★ di riferimento a Cagliari. Posizione centrale vicino al porto, ristorante panoramico, centro congressi, terrazza con vista sul golfo degli Angeli.', servizi: 'Ristorante panoramico, bar, sala congressi, parcheggio convenzionato', costo: '120-300€/notte', tel: '+39 070 286101', web: 'www.bagaglino.it', orari: 'Aperto tutto l\'anno' },
  { id: 'hotel-capo-d-orso', name: 'Capo d\'Orso Hotel (Palau)',    lat: 41.1916, lng: 9.3868,  cat: 'hotel', color: '#C8102E', description: 'Hotel 5★ Leading Hotels of the World con thalasso spa e accesso diretto al mare. Vista sulle isole dell\'arcipelago della Maddalena. Cala Capra, Palau.', servizi: 'Thalasso spa, piscina, ristorante, spiaggia privata, campi tennis', costo: '250-600€/notte', tel: '+39 0789 702000', web: 'www.hotelcapodorso.com', orari: 'Aperto maggio-ottobre' },
  { id: 'corte-bianca',      name: 'Corte Bianca (Arzachena)',      lat: 41.0751, lng: 9.5183,  cat: 'hotel', color: '#C8102E', description: 'Boutique hotel 4★ Adults Only in stazzu (masseria) gallurese ristrutturata. Piscina con idromassaggio, ristorante con prodotti km0, spa.', servizi: 'Piscina, spa, ristorante, giardino, noleggio bici, solo adulti', costo: '150-300€/notte (solo adulti)', tel: '+39 0789 82644', web: 'www.hotelcortebianca.it', orari: 'Aperto aprile-ottobre' },

  // RISTORANTI
  { id: 'dal-corsaro',         name: 'Dal Corsaro (Cagliari)',         lat: 39.2134, lng: 9.1103,  cat: 'ristorante', color: '#FF8C00', description: 'Stella Michelin. Cucina sarda creativa e contemporanea in viale Regina Margherita. Specialità: culurgiones al tartufo, spaghetti all\'aragosta, agnello del Gennargentu.', servizi: 'Sala elegante, sommelier, menu degustazione, lista vini sarda', costo: 'Menu degustazione 80-120€/persona. Carta: 50-80€', tel: '+39 070 664318', web: 'www.dalcorsaro.com', orari: 'Lun-sab: 13:00-14:30 / 20:00-22:30. Chiuso domenica.' },
  { id: 'sa-mandra',           name: 'Sa Mandra Agriturismo (Alghero)', lat: 40.6529, lng: 8.2977,  cat: 'ristorante', color: '#FF8C00', description: 'Miglior agriturismo d\'Italia 2025 (Il Golosario). 4 anni consecutivi sulla Guida Michelin. Produttore → tavola: formaggi, salumi, olio, miele propri. Maialetto allo spiedo, pasta fatta a mano, dolci tradizionali. Anche B&B (Sa Mandra + Su Passu Country House), spa, tour caseificio, escursioni a cavallo, workshop pasta.', come: 'SP44 km 14, 07041 Alghero (SS). Da Alghero 10 km. Da aeroporto 5 km.', servizi: 'Ristorante su prenotazione, B&B, spa, caseificio visitabile, laboratorio pasta, scuola cucina, matrimoni, shop prodotti (formaggi, salumi, conserve, miele, olio)', costo: 'Menu fisso ristorante: 35–45€/persona (tutto incluso) · B&B: 80–150€/notte', tel: '+39 079 999150', web: 'samandra.it', orari: 'Solo su prenotazione online (obbligatoria). Cene: ven–dom. Pranzi festivi. Shop: lun–sab 9–13/16–19.' },
  { id: 'su-gologone',         name: 'Su Gologone (Oliena)',           lat: 40.2888, lng: 9.4970,  cat: 'ristorante', color: '#FF8C00', description: 'Ristorante storico in hotel-resort di charme. Cucina barbaricina premiata: porceddu, pane carasau, seadas, Cannonau di Sardegna. A 8 km da Nuoro, sorgente carsica vicina.', servizi: 'Hotel 4★ annesso, piscina, arte murale, pinacoteca, trekking guidato', costo: 'Ristorante: 50-70€/persona. Hotel: 120-250€/notte', tel: '+39 0784 287512', web: 'www.sugologone.it', orari: 'Ristorante: 12:30-14:00 / 19:30-22:00 tutti i giorni.' },
  { id: 'andreini',            name: 'Andreini (Alghero)',             lat: 40.5597, lng: 8.3239,  cat: 'ristorante', color: '#FF8C00', description: 'Il riferimento per la cucina di pesce ad Alghero. Specialità: aragosta alla catalana, bottarga di muggine, risotto ai ricci. Via Ardoino, centro storico.', servizi: 'Sala interna elegante, terrazza estiva, cantina vini locali', costo: '45-80€/persona', tel: '+39 079 982098', web: '', orari: 'Mer-lun: 12:30-14:00 / 19:30-22:30. Chiuso martedì.' },
  { id: 'agriturismo-testone', name: 'Li Licci (Arzachena)',           lat: 41.0667, lng: 9.5000,  cat: 'ristorante', color: '#FF8C00', description: 'Agriturismo immerso nella macchia gallurese vicino Costa Smeralda. Antipasti sardi, culurgiones, maialetto allo spiedo, dolci tradizionali. Solo prenotazione.', servizi: 'Ambiente rustico autentico, prodotti biologici propri, parcheggio', costo: 'Menu fisso 30-40€/persona (antipasti inclusi)', tel: '+39 0789 83110', web: '', orari: 'Solo su prenotazione. Principalmente cene estive.' },

  // ESPERIENZE E GUIDE
  { id: 'selvaggio-blu',       name: 'Selvaggio Blu (Trekking)',          lat: 40.0272, lng: 9.7069,  cat: 'esperienza', color: '#B040FF', description: 'Il trekking più bello (e difficile) d\'Italia. 7 giorni, 45 km lungo la costa del Supramonte. Partenza da Pedra Longa (Baunei). Solo con guide esperte.', come: 'Partenza da Pedra Longa (Baunei), arrivo Cala Luna. Solo con guide autorizzate AIGAE.', servizi: 'Guide certificate, attrezzatura tecnica consigliata, campo base Baunei, transfer', costo: '800-1.500€/persona (tutto incluso con guida, 7 giorni)', tel: '+39 0782 610271', web: 'www.golfodioro.com', orari: 'Aprile-ottobre. Maggio e settembre: condizioni ideali.' },
  { id: 'giro-maddalena',      name: 'Tour Arcipelago Maddalena',         lat: 41.2169, lng: 9.4026,  cat: 'esperienza', color: '#B040FF', description: 'Gita in barca tra le 7 isole dell\'arcipelago UNESCO: Caprera, Spargi, Budelli (Spiaggia Rosa), Santa Maria. La più bella navigazione del Tirreno.', come: 'Imbarco da porto La Maddalena o porto di Palau. Giornata intera (9:00-17:30).', servizi: 'Skipper, equipaggio, pranzo a bordo, snorkeling (maschera inclusa)', costo: '60-120€/persona. Gozzo privato noleggio: 300-600€/giorno', tel: '+39 0789 737009', web: 'www.coopmaddalena.it', orari: 'Aprile-ottobre: tutti i giorni con meteo favorevole.' },
  { id: 'kayak-orosei',        name: 'Kayak Golfo di Orosei',            lat: 40.2821, lng: 9.6343,  cat: 'esperienza', color: '#B040FF', description: 'Esplorazione del Golfo di Orosei in kayak da Cala Gonone. Cala Luna, Cala Mariolu, calette selvagge. La più bella navigazione costiera d\'Italia.', come: 'Partenza da Cala Gonone, porto di Dorgali. Parcheggio in paese.', servizi: 'Istruttore, kayak singolo o doppio, giubbotto, snorkeling, pranzo al sacco', costo: 'Mezza giornata: 50-90€. Giornata intera: 80-140€', tel: '+39 0784 93177', web: 'www.dolmentravel.it', orari: 'Aprile-ottobre: 8:30-17:30.' },
  { id: 'climbing-ulassai',    name: 'Arrampicata Ulassai',               lat: 39.8014, lng: 9.4929,  cat: 'esperienza', color: '#B040FF', description: 'Paradiso europeo dell\'arrampicata. 200+ vie su calcare dall\'1a al 9c. Canyon di Sa Tappara a 10 min dal paese. Adatto da principiante ad esperto.', come: 'Da Cagliari 90 km via SS125. Da Nuoro 75 km. Parcheggio nel paese di Ulassai.', servizi: 'Guide UIAGM/IFMGA, noleggio attrezzatura, corsi, via ferrata, B&B Climbing Ulassai', costo: 'Corso base mezza giornata 50€. Giornata con guida 80-120€', tel: '+39 349 2345678', web: 'www.climbingulassai.com', orari: 'Arrampicata: ottobre-maggio (caldo in estate). Guida: su prenotazione.' },
  { id: 'diving-villasimius',  name: 'Diving Area Marina Villasimius',   lat: 39.1422, lng: 9.5206,  cat: 'esperienza', color: '#B040FF', description: 'Area marina protetta Capo Carbonara: posidonia, cernie, murene, razze. Relitti WWII. Visibilità fino a 40m. Tra i migliori spot diving del Mediterraneo.', come: 'Da Cagliari 50 km via SS125. Diving center al porto turistico di Villasimius.', servizi: 'Diving center, noleggio attrezzatura completa, corsi PADI, barca propria per site boat-dive', costo: 'Immersione guidata 50-70€. Corso PADI Open Water 350-400€', tel: '+39 070 791 6044', web: 'www.subaquadive.it', orari: 'Aprile-ottobre: 8:30-18:30. Prenotazione consigliata.' },
  { id: 'trenino-verde',       name: 'Trenino Verde',                     lat: 39.6601, lng: 9.1322,  cat: 'esperienza', color: '#B040FF', description: 'Ferrovia storica (1888) attraverso i paesaggi più selvaggi della Sardegna. Percorso Mandas-Arbatax (159 km) tra canyon, boschi e paesini. Un viaggio nel tempo.', come: 'Stazione Mandas: 60 km da Cagliari via SS125. Parcheggio gratuito alla stazione.', servizi: 'Treno storico diesel, carrozze panoramiche, bar a bordo, pranzo su prenotazione', costo: '10-25€ a tratta secondo percorso', tel: '+39 070 580246', web: 'www.treninoverde.com', orari: 'Estate (giugno-settembre): fine settimana e festivi. Orari sul sito.' },
  { id: 'kitesurf-porto-pollo', name: 'Porto Pollo — Kite & Windsurf', lat: 41.1683, lng: 9.3356, cat: 'esperienza', color: '#B040FF', description: 'Spot world-class per kitesurf e windsurf sullo Stretto di Bonifacio. Vento Maestrale e Tramontana costanti, acque piatte o ondulate secondo posizione. Attivo tutto l\'anno, migliore maggio–settembre. 5 scuole operative con istruttori IKO/FIV/VDWS.', come: 'Da Palau 10 km via SP90. Da Olbia 55 km. Parcheggio gratuito sterrato in spiaggia.', servizi: '5 scuole certificate (Wind Porto Pollo, Windsurf Village, FH Academy, Kitesurf Village, Porto Pollo Adventure Center), noleggio kite/tavole, bar, camping, appartamenti', costo: 'Corso base kite (3h): 130–160€ · Settimana intensiva: 400–600€ · Noleggio attrezzatura: 60–90€/h', tel: '+39 331 988 9133 (Wind Porto Pollo) · +39 0789 704 075 (Windsurf Village)', web: 'windportopollo.com · windsurfvillage.it · fh.academy · portopollo.it', orari: 'Tutto l\'anno. Scuole: aprile–ottobre 8:00–tramonto. Vento migliore: maggio–settembre.' },

  // NORD SARDEGNA — SPORT, TREKKING, CULTURA INVERNALE
  { id: 'bonga-surf-school', name: 'Bonga Surf School — Porto Ferro', lat: 40.6875, lng: 8.2055, cat: 'esperienza', color: '#B040FF', description: 'Scuola surf certificata ISA diretta da Marco "Bonga" Pistidda, longboarder campione italiano. Lezioni per tutti i livelli, bambini, adulti, programma adattato per bambini autistici (SurfedAUT). Noleggio tavole soft e hard, SUP. Pick-up dal camping.', come: 'Direttamente in spiaggia a Porto Ferro (da Alghero 15 km, sterrata finale 3 km).', servizi: 'Lezioni individuali e di gruppo, noleggio surf/SUP, muta, progetto Girl Surf Power, surf therapy, pick-up da Torre del Porticciolo (20€)', costo: 'Lezione surf: da 50€/pers · Lezione bambini: 30€ · Noleggio soft-board: 10€/h o 30€/giorno · Hard-board: 15€/h o 40€/giorno · Muta: 8€/gg', tel: '+39 351 945 7142', web: 'www.bongasurfschool.it', orari: 'Stagione: aprile–ottobre. Disponibile anche inverno su prenotazione per gruppi.' },

  { id: 'il-baretto-porto-ferro', name: 'Il Baretto — Porto Ferro', lat: 40.6868, lng: 8.2058, cat: 'ristorante', color: '#FF8C00', description: 'Bar/lounge sulla spiaggia di Porto Ferro, 50m dal mare. Oltre 40 eventi a estate: concerti aperitivo, "A Tutto Vinyl" (domeniche selettive da giugno con selezione vinile), Blues Sunset Festival, danza, presentazioni libri. Libreria con scambio "Libri di Ponente". Noleggio tavole SUP.', come: 'Direttamente sulla spiaggia di Porto Ferro (da Alghero 15 km, sterrata finale 3 km).', servizi: 'Bar, birre artigianali, pizze/panini, noleggio tavole SUP (da maggio), libreria scambio libri, eventi stagionali, spettacoli tramonto', costo: 'Consumazioni: 3-15€. Ingresso eventi: gratuito o contributo', tel: '+39 333 327 9256', web: '', orari: 'Stagione estiva: 09:00–23:00. Eventi: domeniche e weekend. Apertura: giugno–settembre.' },

  { id: 'valle-luna-aggius', name: 'Valle della Luna — Aggius', lat: 40.9246, lng: 9.0644, cat: 'parco', color: '#32CD32', description: 'Canyon di granito grigio con formazioni millenarie, ginepri centenari e panorami mozzafiato sulla Gallura. Trekking 4 km A/R, dislivello 200m. Colori autunnali spettacolari ottobre-novembre.', come: 'Da Tempio Pausania 10 km. Da Olbia 40 km via SS127. Parcheggio gratuito ad Aggius.', servizi: 'Sentiero segnato, parcheggio, bar/ristoranti ad Aggius, visita al paese obbligatoria', costo: 'Gratuito', tel: '', web: 'www.comune.aggius.ss.it', orari: 'Aperto tutto l\'anno. Alba e tramonto: luce spettacolare.' },

  { id: 'monte-limbara', name: 'Monte Limbara', lat: 40.8461, lng: 9.1719, cat: 'parco', color: '#32CD32', description: 'Il punto più alto della Gallura (1362m). Boschi di roverella, leccio, ginepro, agrifoglio. Cervi sardi, cinghiali, aquile. 50+ km sentieri MTB e trekking. Vista Corsica e su tutta la Gallura.', come: 'Da Tempio Pausania 15 km via SP14. Stazione Voghienu (910m) con parcheggio.', servizi: 'Ristorante Voghienu, parcheggio, sentieri CAI, nessuna guida obbligatoria', costo: 'Gratuito. Ristorante ~25-35€', tel: '', web: '', orari: 'Tutto l\'anno. Neve possibile >1000m: dic-feb verificare strada.' },

  { id: 'necropoli-li-muri', name: 'Necropoli di Li Muri — Arzachena', lat: 41.0197, lng: 9.4494, cat: 'attrazione', color: '#FFD700', description: 'Tomba dei Giganti e circoli megalitici del IV millennio a.C. (3500 a.C.). Complesso di 5 tombe con lastre di granito. Uno dei siti preistorici più antichi d\'Europa. Visita in piena solitudine in bassa stagione.', come: 'Da Arzachena 5 km via SP14. Segnalato. Parcheggio gratuito adiacente.', servizi: 'Visita autonoma, pannelli informativi, ombra, area picnic', costo: 'Gratuito (parte Parco Archeologico Arzachena)', tel: '+39 0789 84000', web: 'www.parcarcheoarzachena.it', orari: 'Aperto tutto l\'anno 8:00-tramonto.' },

  { id: 'tempio-pausania', name: 'Tempio Pausania', lat: 40.8996, lng: 9.1025, cat: 'città', color: '#FFFFFF', description: 'Capitale della Gallura. Centro storico in granito bigio, cattedrale gotica, carnevale più antico del nord (gen-feb). Birra artigianale gallurese, Vermentino di Gallura DOCG doc.', come: 'Da Olbia 30 km via SS127. Da Sassari 65 km. ARST pullman da Sassari e Olbia.', servizi: 'Centro storico, musei, ristoranti, cantine vinicole, parcheggi gratuiti', costo: 'Centro storico gratuito. Museo Bernardi: 3€', tel: '+39 079 671011', web: 'www.comune.tempiopausania.ss.it', orari: 'Sempre aperto. Carnevale: gen-feb (sfilate domenica pomeriggio).' },

  { id: 'palau-centro', name: 'Palau', lat: 41.1802, lng: 9.3808, cat: 'città', color: '#FFFFFF', description: 'Porto per La Maddalena (traghetti ogni 30 min), Capo d\'Orso (roccia orso), spiagge dorate vicine (Acero Rosso, Cala Trana). Base logistica per l\'Arcipelago. Vivace in estate, tranquillo in inverno.', come: 'Da Olbia 45 km via SS127. Da Arzachena 25 km. Bus ARST in estate.', servizi: 'Porto traghetti, hotel, ristoranti, supermercato, noleggio barche', costo: 'Traghetto La Maddalena: 3€/persona (20 min)', tel: '+39 0789 709570', web: 'www.palauturismo.it', orari: 'Traghetti ogni 30 min: 6:00-23:00 (inverno ridotto).' },

  { id: 'santa-teresa-gallura', name: 'Santa Teresa di Gallura', lat: 41.2325, lng: 9.1859, cat: 'città', color: '#FFFFFF', description: 'La punta nord della Sardegna. Spiaggia Rena Bianca con acqua incredibile, vista Corsica a 12 km, Torre di Longosardo spagnola. Porto traghetti per Bonifacio (Corsica).', come: 'Da Olbia 60 km via SS125. Bus ARST. Traghetti per Bonifacio (Corsica): Moby e Saremar.', servizi: 'Porto, spiagge, ristoranti, mercatino estivo, camping nei dintorni', costo: 'Centro gratuito. Traghetti Corsica: da 15€', tel: '', web: 'www.visitsantateresagallura.com', orari: 'Spiagge aperte tutto l\'anno. Traghetti Corsica: aprile-ottobre.' },

  { id: 'nuraghe-palmavera', name: 'Nuraghe Palmavera — Alghero', lat: 40.6329, lng: 8.2016, cat: 'attrazione', color: '#FFD700', description: 'Complesso nuragico del 1600 a.C. con torre centrale, villaggio di 50 capanne, area sacra con menhir a volto scolpito. A 10 km da Alghero. Vicino spiagge Le Bombarde e Maria Pia.', come: 'Da Alghero 10 km via SP55 per Porto Conte. Parcheggio gratuito.', servizi: 'Visite guidate, parcheggio, percorso su passerelle di legno, pannelli multilingue', costo: '5€ / 8€ cumulativo con Anghelu Ruju', tel: '+39 079 980438', web: 'villeinpietre.com', orari: 'Estate: 9:00-19:00. Inverno: 10:00-16:00.' },

  { id: 'lago-baratz', name: 'Lago del Baratz — Sassari', lat: 40.6688, lng: 8.2260, cat: 'parco', color: '#32CD32', description: 'Unico lago naturale della Sardegna. Biodiversità straordinaria: nutrie, lontre, germani, gallinelle, aironi. Raggiungibile in bici da Alghero (pista ciclabile). Porto Ferro a 2 km a piedi.', come: 'Da Alghero 12 km via pista ciclabile o SP105. Da Sassari 30 km.', servizi: 'Sentiero perimetrale 3 km, panchine, birdwatching, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },

  { id: 'stagno-san-teodoro', name: 'Stagno di San Teodoro — Fenicotteri', lat: 40.7718, lng: 9.6624, cat: 'parco', color: '#32CD32', description: '400 fenicotteri rosa svernano qui da ottobre ad aprile. Aironi cenerini, anatre, svassi. Il laghetto è separato dal mare da 100m di sabbia (La Cinta). Vista spettacolare all\'alba.', come: 'Da San Teodoro 2 km via SP82 direzione spiaggia La Cinta. Parcheggio gratuito.', servizi: 'Accesso libero, nessun servizio, osservazione da argine naturale', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Fenicotteri presenti: ottobre-aprile.' },

  { id: 'platamona-surf', name: 'Spiaggia di Platamona — Surf', lat: 40.8121, lng: 8.3938, cat: 'esperienza', color: '#B040FF', description: '20 km di spiaggia a nord di Sassari. Spot surf ideale per principianti con onda lenta e morbida. Inverno: Tramontana e Libeccio portano onda consistente. Pineta protetta alle spalle.', come: 'Da Sassari 15 km via SS131 poi deviazione Platamona. Bus ARST linea Sassari-Porto Torres.', servizi: 'Stabilimenti stagionali, bar, docce. In inverno: nessun servizio.', costo: 'Gratuito', tel: '', web: '', orari: 'Spiaggia aperta tutto l\'anno. Surf: ottobre-marzo migliore.' },

  { id: 'pattada-coltelli', name: 'Pattada — Coltelli Tradizionali', lat: 40.5261, lng: 9.1298, cat: 'attrazione', color: '#FFD700', description: 'Paese in granito famoso per i coltelli artigianali resolzas. Laboratori aperti, museo del coltello, visita ai maestri coltellai. A 50 km da Olbia. Tour dei bottegai tutto l\'anno.', come: 'Da Olbia 50 km via SS125 poi SP14. Da Sassari 60 km. Nessun bus diretto.', servizi: 'Laboratori visibili, acquisto diretto dai fabbri, piccolo museo, ristorazione locale', costo: 'Museo: 2€. Coltelli: 50-500€ (artigianali)', tel: '', web: 'www.comune.pattada.ss.it', orari: 'Laboratori: lun-sab 9:00-13:00 / 15:00-18:00.' },

  { id: 'ozieri-museo', name: 'Ozieri — Museo Civico e Cultura', lat: 40.5842, lng: 9.0033, cat: 'attrazione', color: '#FFD700', description: 'Città di granito con importante museo archeologico (Cultura di Ozieri, 4000 a.C.), cattedrale, grotta di San Michele. Premio letterario nazionale Città di Ozieri. Celebre per le copulette dolci di mandorla.', come: 'Da Sassari 50 km via SS597. Da Olbia 50 km via SS127.', servizi: 'Museo, pasticcerie storiche (copulette di mandorla), cattedrale, grotta naturale', costo: 'Museo: 2€', tel: '', web: 'www.comune.ozieri.ss.it', orari: 'Museo: mar-dom 9:00-13:00 / 15:00-18:00.' },

  { id: 'valledoria-kayak', name: 'Valledoria — Kayak Fiume Coghinas', lat: 40.9226, lng: 8.8280, cat: 'esperienza', color: '#B040FF', description: 'Discesa in kayak del Fiume Coghinas tra la Gallura e l\'Anglona. 15 km di canyon e macchia mediterranea. Adatto tutto l\'anno, ideale novembre-aprile. Operatore New Kayak Sardinia.', come: 'Da Sassari 50 km via SS200. Imbarco al ponte di Valledoria.', servizi: 'Guida obbligatoria, kayak incluso, muta fornita, transfer', costo: 'Mezza giornata: 45€/persona. Giornata: 70€', tel: '', web: 'newkayaksardinia.com', orari: 'Tutto l\'anno. Ottobre-aprile: ideale (acqua pulita, fauna abbondante).' },

  // ─── NOLEGGIO GOMMONI E BARCHE ───────────────────────────────

  { id: 'nautica-sagiel-palau', name: 'Nautica Sagiel — Noleggio Gommoni Palau', lat: 41.1788, lng: 9.3831, cat: 'esperienza', color: '#B040FF', description: 'Noleggio gommoni con/senza patente nel porto di Palau. Base ideale per esplorare l\'Arcipelago della Maddalena in autonomia. 5 imbarcazioni disponibili da 5 a 7 metri. Escursioni con skipper disponibili.', come: 'Porto Turistico di Palau, Molo C — Loc. Barrabisa.', servizi: 'Gommoni 5–7 metri (6–10 pers), con e senza patente, skipper su richiesta, mappe percorsi, pacchetti con pranzo/bevande/carburante inclusi', costo: 'Gommone senza patente 5m: 150€/gg · 6m: 180€/gg · Con patente 7m: 250€/gg', tel: '+39 339 399 8689', web: 'www.nauticasagiel.it', orari: 'Aprile–ottobre: 8:00–20:00. Prenotazione consigliata in alta stagione.' },

  { id: 'marina-david-palau', name: 'Marina David — Gommoni & Tour Palau', lat: 41.1792, lng: 9.3840, cat: 'esperienza', color: '#B040FF', description: 'Oltre 30 anni di attività a Palau. Noleggio gommoni con/senza patente, escursioni all\'Arcipelago della Maddalena e in Corsica, taxi marittimo per le isole. Operatore storico della zona.', come: 'Porto Turistico Palau.', servizi: 'Noleggio gommoni, tour guidati Arcipelago Maddalena, traghetto taxi isole, escursioni Corsica', costo: 'Variabile secondo imbarcazione e durata — chiedere preventivo', tel: '+39 335 535 3038 · +39 336 466 712', web: 'noleggiogommonipalau.com', orari: 'Lun–Dom 08:00–13:00 / 16:00–20:00 (stagionale).' },

  { id: 'sun-sea-alghero', name: 'Sun&Sea — Gommoni & Tour Alghero', lat: 40.5585, lng: 8.3138, cat: 'esperienza', color: '#B040FF', description: 'Noleggio gommoni e tour guidati dalla Banchina Dogana di Alghero. Escursioni lungo la Riviera del Corallo, Parco di Porto Conte, grotte marine, snorkeling. Ideale per esplorare la costa senza guida a Capo Caccia.', come: 'Banchina Dogana, porto di Alghero — centro storico.', servizi: 'Noleggio gommoni con e senza patente, tour guidati, snorkeling, visita grotte marine, escursioni Capo Caccia', costo: 'Chiedere preventivo — variabile per durata e numero persone', tel: '+39 366 465 5120', web: 'sunesea.com', orari: 'Aprile–ottobre. Prenotazione via telefono o sito.' },

  { id: 'linea-grotte-nettuno', name: 'Linea Grotte di Nettuno — Barche Alghero', lat: 40.5590, lng: 8.3185, cat: 'esperienza', color: '#B040FF', description: 'Servizio ufficiale di trasporto via mare per le Grotte di Nettuno dal porto di Alghero. ~40 minuti di navigazione lungo la costa rocciosa fino a Capo Caccia. Panorami spettacolari sulla Riviera del Corallo.', come: 'Imbarco dal porto turistico di Alghero, molo principale. 40 min navigazione fino alla grotta.', servizi: 'Traghetto di linea per Grotte di Nettuno, solo andata/ritorno (ingresso grotta separato 14€)', costo: 'Barca: ~15€ a/r adulti · 8€ bambini. Grotta: 14€ adulti / 7€ bambini (separato)', tel: '+39 079 950603 · +39 320 741 2400', web: 'grottedinettuno.it', orari: 'Aprile–ottobre: corse mattina, mezzogiorno, sera. Inverno: ridotto. Chiuso con mare mosso.' },

  // ─── LOCALI E NIGHTLIFE ──────────────────────────────────────

  { id: 'phi-beach', name: 'Phi Beach — Baja Sardinia', lat: 41.1148, lng: 9.5432, cat: 'ristorante', color: '#FF8C00', description: 'Il locale più iconico della Costa Smeralda. Club/ristorante su scogliera con tramonto mozzafiato su Golfo di Cugnana. DJ internazionali (residency Nammos), aperitivo con vista, ristorante Luciano\'s. Frequentato da vip e jet set europeo. Giugno–settembre.', come: 'Da Porto Cervo 8 km via SP59 direzione Baja Sardinia. Parcheggio privato a pagamento.', servizi: 'Ristorante (Luciano\'s), bar, DJ set al tramonto, area lounge su roccia, eventi privati VIP, prenotazione tavoli online', costo: 'Aperitivo: 20-40€ · Cena: 60-120€/pers · Ingresso club: 20-50€ secondo serata', tel: '+39 345 288 4254 (WhatsApp booking ≤6 pers) · +39 348 645 5320 (gruppi/VIP)', web: 'phibeach.com', orari: 'Giugno–settembre: 18:00–4:00. Chiuso in bassa stagione.' },

  // ─── ATTRAZIONI AGGIORNATE ────────────────────────────────────

  { id: 'museo-garibaldi-caprera', name: 'Compendio Garibaldino — Caprera', lat: 41.1956, lng: 9.4545, cat: 'attrazione', color: '#FFD700', description: 'Casa museo di Giuseppe Garibaldi sull\'isola di Caprera. Il letto su cui morì il 2 giugno 1882, oggetti personali, la tomba, il giardino. Due sezioni: Compendio Garibaldino e Memoriale Garibaldi. Uno dei luoghi storici più emozionanti d\'Italia.', come: 'Traghetto da Palau a La Maddalena (3€, 20 min), poi bus o auto fino a Caprera (ponte). 8 km da La Maddalena.', servizi: 'Visite guidate con ingressi cadenzati ogni 15 min (max 20 persone), audioguide, parcheggio', costo: 'Compendio: 8€ adulti / gratuito under 18 · Memoriale: 6€ / 2€ (18-25 anni UE) · Combinato: 10€', tel: '+39 0789 727162', web: 'garibaldicaprera.beniculturali.it', orari: 'Compendio: tutti i gg tranne lunedì, 9:00–20:00 (ult. ingresso 19:15) · Memoriale: tutti i gg tranne mercoledì, 10:15–19:15.' },

  { id: 'siti-arch-arzachena', name: 'Siti Archeologici di Arzachena (GE.SE.CO.)', lat: 41.0214, lng: 9.4419, cat: 'attrazione', color: '#FFD700', description: 'Complesso di 7 siti preistorici gestito da GE.SE.CO.: Necropoli Li Muri e Li Lolghi (tombe dei giganti, 3500 a.C.), Nuraghe La Prisgiona, Coddu Ecchju (allée couverte più grande della Sardegna), Tomba di Malchittu, Albucciu, Moru. Il parco archeologico più completo della Gallura.', come: 'Arzachena: 25 km da Olbia via SS125. I singoli siti sono a 3–8 km dal centro di Arzachena, segnalati.', servizi: 'Guide su prenotazione, pannelli multilingue, parcheggio a ciascun sito, Museo Civico Ruzittu in paese', costo: 'Area Li Muri (Li Lolghi + Li Muri): 10€ adulti / 7€ bambini · Area Capichera (La Prisgiona + Coddu Ecchju): 7€ · Famiglia: sconto 10-20%', tel: '+39 333 428 2607 · +39 345 576 0643', web: 'www.gesecoarzachena.it', orari: 'Apr–Set 9:00–19:00 (Li Muri/Lolghi fino 18:00). Ott–Mar: orari ridotti — verificare sul sito.' },

  // ─── CANTINE E VINO ─────────────────────────────────────────

  { id: 'cantina-gallura', name: 'Cantina Sociale Gallura — Tempio', lat: 40.8997, lng: 9.1035, cat: 'ristorante', color: '#FF8C00', description: 'Cantina che produce il Vermentino di Gallura DOCG — l\'unica DOCG di tutta la Sardegna. Degustazioni guidate, vendita diretta, tour cantina. Il miglior posto per capire il vino sardo per eccellenza.', come: 'Via Val di Cossu 9, Tempio Pausania. Da Olbia 30 km via SS127.', servizi: 'Vendita diretta vini (DOCG, DOC, IGT, rosati, spumanti), degustazioni guidate su prenotazione, visite cantina', costo: 'Degustazione: su richiesta. Vini: 8–25€/bottiglia', tel: '+39 079 631 241', web: 'cantinagallura.net', orari: 'Lun–Ven 08:00–12:00 / 14:00–18:00 · Sab 09:00–13:00.' },

  // ─── NOLEGGIO BICI E E-BIKE ──────────────────────────────────

  { id: 'noleggio-ebike-alghero', name: 'Noleggio E-Bike — Alghero', lat: 40.5595, lng: 8.3200, cat: 'esperienza', color: '#B040FF', description: 'Più operatori di noleggio e-bike ad Alghero per esplorare la Riviera del Corallo, Porto Conte, Lago Baratz e Porto Ferro in bici elettrica. Consegna in hotel disponibile. La pista ciclabile dal porto raggiunge Le Bombarde (8 km) e Fertilia.', come: 'Operatori in centro Alghero e zona porto. Consegna hotel in tutta l\'area algherese.', servizi: 'E-bike GIANT (autonomia 130 km), city bike, MTB, gravel, cargo bike · Raggi di Sardegna (algherorentabike.com) · Alghero Rent Scooter (algherorentscooter.com) · NWB Northwestern Bikers (northwesternbikers.it) · Cicloexpress (cicloexpress.com)', costo: 'E-bike: 25–45€/giorno · MTB: 15–25€/gg · City bike: 10–18€/gg', tel: '', web: 'algherorentabike.com · algherorentscooter.com', orari: 'Tutto l\'anno. Prenotazione online consigliata in estate.' },

  // ─── ARRAMPICATA NORD ────────────────────────────────────────

  { id: 'arrampicata-san-pantaleo', name: 'Torri di Granito — San Pantaleo', lat: 41.0589, lng: 9.5001, cat: 'esperienza', color: '#B040FF', description: 'Granito gallurese tra i più scenografici d\'Europa. Tafoni giganteschi, torri naturali, boulder e vie sportive/tradizionali in un paesaggio di macchia mediterranea. 5c–8a su roccia granitica cristallina. Stagione ideale: autunno e primavera.', come: 'Da San Pantaleo (25 km da Olbia) via SS125, poi strade secondarie per i boulder. Info vie su thecrag.com.', servizi: 'Accesso libero. Guide locali su richiesta tramite climbingsardinia.com. No strutture fisse.', costo: 'Gratuito', tel: '', web: 'climbingsardinia.com', orari: 'Tutto l\'anno. Stagione ideale: set–nov / feb–mag. Evitare luglio–agosto (caldo).' },

  { id: 'arrampicata-capo-testa', name: 'Capo Testa — Boulder & Vie', lat: 41.2358, lng: 9.1429, cat: 'esperienza', color: '#B040FF', description: 'Granito cristallino a Capo Testa, punta nord della Sardegna. Boulder e vie sportive fino a 35 tiri, difficoltà 5c–8a. Vista su Corsica. Uno dei posti più scenici per arrampicare nel Mediterraneo. Autunno ideale.', come: 'Da Santa Teresa di Gallura 3 km via strada per Capo Testa. Parcheggio gratuito al faro.', servizi: 'Accesso libero, nessun servizio. Topo su planetmountain.com e thecrag.com', costo: 'Gratuito', tel: '', web: 'thecrag.com', orari: 'Settembre–maggio. Luglio–agosto: troppo caldo.' },

  // ─── BORGHI & CENTRI STORICI (STEP 3) ──────────────────────

  // Barbagia & Nuorese
  { id: 'orgosolo',              name: 'Orgosolo',                          lat: 40.2078, lng: 9.3510, cat: 'città', color: '#FFFFFF', description: 'Il paese dei murales. Oltre 150 affreschi politici e sociali sulle facciate delle case dal 1975 ad oggi. Borgata pastorale della Barbagia, culla del banditismo sardo e al contempo di una straordinaria tradizione culturale. Sfilata dei Mamuthones in febbraio.', come: 'Da Nuoro 20 km via SS129 bis. Bus ARST da Nuoro.', servizi: 'Mappa murales disponibile in paese, ristoranti locali (porceddu, malloreddus), artigianato', costo: 'Accesso gratuito. Parcheggio libero.', tel: '', web: 'proloco-orgosolo.com', orari: 'Sempre aperto. Carnevale: febbraio.' },
  { id: 'mamoiada',              name: 'Mamoiada',                          lat: 40.2164, lng: 9.2843, cat: 'città', color: '#FFFFFF', description: 'Paese delle maschere più celebri della Sardegna: i Mamuthones (maschera nera ossidiana) e gli Issohadores (mantello rosso). Il carnevale di Mamoiada (gennaio-febbraio) è candidato al patrimonio UNESCO. Museo MATER delle maschere barbaricine. Cannonau doc.', come: 'Da Nuoro 13 km via SS129. Bus ARST da Nuoro.', servizi: 'Museo MATER maschere (5€), cantine Cannonau, botteghe artigianato maschere, ristoranti tradizionali', costo: 'Museo MATER: 5€ adulti / gratuito <6. Carnevale: accesso libero.', tel: '+39 0784 56392', web: 'museomater.com', orari: 'Museo: mar-dom 9:00-13:00 / 15:30-19:00. Carnevale: 17 gen e martedì grasso.' },
  { id: 'oliena',                name: 'Oliena',                            lat: 40.2700, lng: 9.4098, cat: 'città', color: '#FFFFFF', description: 'Ai piedi del Supramonte con le sue pareti di calcare bianche. Patria del Nepente di Oliena (Cannonau doc citato da D\'Annunzio). Punto base per Tiscali, Gola di Gorropu e Su Gologone. Costumi tradizionali femminili tra i più belli della Sardegna.', come: 'Da Nuoro 9 km via SS129. Bus ARST. Punto di partenza per escursioni Supramonte.', servizi: 'Cantine Cannonau, guide escursionistiche certificate, hotel/agriturismo, ristorante Su Gologone (8 km)', costo: 'Centro: gratuito. Escursioni Supramonte: 30-80€/persona', tel: '', web: 'comune.oliena.nu.it', orari: 'Centro aperto tutto l\'anno. Autunno in Barbagia: ottobre.' },
  { id: 'gavoi',                 name: 'Gavoi',                             lat: 40.1560, lng: 9.1996, cat: 'città', color: '#FFFFFF', description: 'Borgo medievale sul lago artificiale di Gusana (kayak, pesca, natura). Sede del Festival Letteratura dell\'Isola (giugno-luglio) tra gli appuntamenti culturali più importanti della Sardegna. Fiore Sardo DOP nelle latterie locali.', come: 'Da Nuoro 40 km via SS128. Da Oristano 80 km.', servizi: 'Lago Gusana (noleggio kayak, pedalò), festival letteratura, Fiore Sardo cantine', costo: 'Centro: gratuito. Kayak lago: 10-15€/h', tel: '', web: 'festivalletteraturaisola.it', orari: 'Festival: luglio. Lago Gusana: tutto l\'anno.' },
  { id: 'aritzo',                name: 'Aritzo',                            lat: 39.9503, lng: 9.1940, cat: 'città', color: '#FFFFFF', description: 'Paese di montagna a 800m celebre per il commercio della neve in estate (secoli XVIII-XIX: "niargios" vendevano neve alle città). Sagra delle castagne in ottobre. Boschi di castagno, nocciolo, roverella. Stagione sci e ciaspolate invernali sul Gennargentu.', come: 'Da Nuoro 60 km via SS128. Da Cagliari 120 km.', servizi: 'Sagra castagne (ottobre), botteghe dolci tradizionali (torrone, pan\'e saba), escursioni montagna', costo: 'Centro: gratuito. Sagra: ingresso libero.', tel: '', web: 'proloco.aritzo.it', orari: 'Sagra delle castagne: ultima domenica di ottobre.' },
  { id: 'desulo',                name: 'Desulo',                            lat: 40.1061, lng: 9.2340, cat: 'città', color: '#FFFFFF', description: 'A 900m sul Gennargentu, Desulo ha i costumi tradizionali più elaborati della Barbagia: abiti di orbace (lana rasata), ricami d\'oro, gioielli in corallo. Autunno in Barbagia (ottobre) apre cantine e case private. Escursioni verso Punta La Marmora.', come: 'Da Nuoro 55 km via SS128 per Fonni poi deviazione. Da Oristano 80 km.', servizi: 'Laboratori artigianato orbace, Autunno in Barbagia (ottobre), escursioni Gennargentu', costo: 'Centro: gratuito. Autunno in Barbagia: ingresso libero.', tel: '', web: 'autunnoinbarbagia.it', orari: 'Autunno in Barbagia: ottobre (ogni weekend).' },
  { id: 'tonara',                name: 'Tonara',                            lat: 40.0167, lng: 9.1603, cat: 'città', color: '#FFFFFF', description: 'Capitale del torrone sardo IGP: venduto da 50+ laboratori artigianali con miele amaro, mandorle tostate e albume. Sagra del Torrone la domenica di Pasqua. Boschi di nocciolo, roverella, castagne. Panorama a 900m sulla Barbagia di Belvì.', come: 'Da Nuoro 50 km via SS128. Da Oristano 65 km via SS128.', servizi: 'Laboratori torrone aperti tutto l\'anno (vendita diretta), Sagra Torrone a Pasqua, trattorie locali', costo: 'Centro: gratuito. Torrone: 10-25€/kg', tel: '', web: 'prolocotonara.it', orari: 'Botteghe: lun-sab 9:00-13:00 / 15:00-19:00. Sagra: domenica di Pasqua.' },

  // Ogliastra
  { id: 'baunei',                name: 'Baunei',                            lat: 40.0354, lng: 9.6699, cat: 'città', color: '#FFFFFF', description: 'Paese dell\'Ogliastra arroccato su falesie calcaree a 500m sul mare. Base del Selvaggio Blu (trekking più bello d\'Italia) e dell\'Altopiano del Golgo con dolina di 270m. Da qui si raggiunge Cala Sisine, Cala Mariolu, Cala Goloritzé.', come: 'Da Nuoro 80 km via SS125. Da Tortolì 45 km. Cooperativa Goloritze per escursioni.', servizi: 'Guide Selvaggio Blu, noleggio barche per le calette, Altopiano Golgo, Su Sterru (dolina)', costo: 'Centro: gratuito. Selvaggio Blu con guida: 800-1500€/persona (7 giorni)', tel: '+39 0782 610271', web: 'golfodioro.com', orari: 'Altopiano Golgo: sempre aperto. Escursioni: aprile-ottobre.' },
  { id: 'dorgali',               name: 'Dorgali',                           lat: 40.2920, lng: 9.5878, cat: 'città', color: '#FFFFFF', description: 'Porta del Supramonte e del Golfo di Orosei. Cannonau di Sardegna DOC, artigianato del cuoio e della ceramica. A 10 km si scende a Cala Gonone. Villaggio nuragico Serra Orrios a 4 km. Grotta di Ispinigoli (seconda stalattite del mondo) a 12 km.', come: 'Da Nuoro 35 km via SS125 Orientale. Bus ARST da Nuoro.', servizi: 'Guide montagna/mare, cantine Cannonau, ceramiche tradizionali, Grotta Ispinigoli, su Gologone', costo: 'Centro: gratuito. Grotta Ispinigoli: 9€', tel: '', web: 'comune.dorgali.nu.it', orari: 'Grotta Ispinigoli: estate 9:00-19:00.' },
  { id: 'tortoli',               name: 'Tortolì',                           lat: 39.9252, lng: 9.6552, cat: 'città', color: '#FFFFFF', description: 'Capoluogo dell\'Ogliastra. Hub logistico per spiagge rosse di Cea (Scogli Rossi), Lido di Orrì, Cea. Porto Frailis con marina turistica. Aeroporto Tortolì (TWF) con voli stagionali. Ottima base per esplorare l\'intera Ogliastra.', come: 'Aeroporto Tortolì-Arbatax (TWF) stagionale. Da Cagliari 150 km via SS125. Bus ARST.', servizi: 'Aeroporto stagionale, marina, ristoranti, supermercati, noleggio auto', costo: 'Centro: gratuito.', tel: '', web: 'comune.tortoli.og.it', orari: 'Aeroporto: aprile-ottobre (voli stagionali da Milano, Roma, Bergamo).' },

  // Gallura
  { id: 'aggius',                name: 'Aggius',                            lat: 40.9260, lng: 9.0644, cat: 'città', color: '#FFFFFF', description: 'Borgo di granito della Gallura con il Museo Etnografico del Banditismo (storia del banditismo gallurese, unico in Sardegna). A 2 km la Valle della Luna per trekking nel granito. Produzione di tappeti gallurese e Vermentino.', come: 'Da Tempio Pausania 10 km. Da Olbia 40 km via SS127.', servizi: 'Museo Banditismo (4€), tappeti tradizionali, Valle della Luna a piedi (30 min), ristoranti gallurese', costo: 'Centro: gratuito. Museo Banditismo: 4€', tel: '+39 079 621057', web: 'museoetnoaggius.it', orari: 'Museo: mar-dom 9:30-12:30 / 15:30-18:30. Chiuso lunedì.' },

  // Costa Est
  { id: 'galtelli',              name: 'Galtellì',                          lat: 40.3547, lng: 9.6113, cat: 'città', color: '#FFFFFF', description: 'Il piccolo borgo medievale è il paese di "Canne al Vento" di Grazia Deledda (Nobel 1926). Case rurali in pietra, chiesa di San Pietro con il più bello stile pisano-romanico della Sardegna (XI sec.), vicoli lastricati, campanile. Atmosfera di inizio Novecento ancora intatta.', come: 'Da Nuoro 30 km via SS129 bis poi SS131 bis. Da Orosei 8 km.', servizi: 'Chiesa San Pietro (XII sec., ingresso libero), casa museo Deledda, botteghe, trattorie', costo: 'Centro: gratuito', tel: '', web: 'comune.galtelli.nu.it', orari: 'Chiesa: 9:00-12:00 / 15:00-18:00.' },
  { id: 'orosei',                name: 'Orosei',                            lat: 40.3797, lng: 9.6993, cat: 'città', color: '#FFFFFF', description: 'Borgo medievale con il centro storico tra i più intatti del nuorese: piazza del Popolo porticata, chiesa di San Giacomo (XVII sec.), carcere aragonese, vecchi magazzini sul canale. A 10 km le spiagge di Bidderosa, a 25 km Cala Gonone.', come: 'Da Nuoro 40 km via SS131 bis. Bus ARST. Da Olbia 90 km.', servizi: 'Centro storico a piedi, ristoranti pesce, base per escursioni Golfo di Orosei, camping', costo: 'Centro: gratuito', tel: '', web: 'comune.orosei.nu.it', orari: 'Centro: sempre aperto.' },
  { id: 'posada',                name: 'Posada',                            lat: 40.6370, lng: 9.7077, cat: 'città', color: '#FFFFFF', description: 'Borgo aragonese con castello della Fava (XIII sec.) su faraglione di roccia bianca con vista sul mare. Centro storico di case colorate in discesa verso il mare. Laguna di Posada con aironi e nibbi. Una delle cartoline più belle della Sardegna orientale.', come: 'Da Nuoro 60 km via SS131 bis per Siniscola poi deviazione. Da Olbia 55 km.', servizi: 'Castello della Fava (4€, vista panoramica), porto turistico, spiagge vicine, trattorie', costo: 'Castello: 4€ adulti', tel: '', web: 'comune.posada.nu.it', orari: 'Castello: estate 9:00-19:00. Inverno: orari ridotti.' },

  // Sulcis-Iglesiente
  { id: 'carloforte',            name: 'Carloforte (Isola di San Pietro)',  lat: 39.1388, lng: 8.3074, cat: 'città', color: '#FFFFFF', description: 'Unica città tabarchina al mondo: fondata nel 1738 da pescatori di corallo liguri di Tabarca (Tunisia). Lingua tabarchina ancora parlata, cucina di pesto alla ligure + tonno in trappola. Festival del Girotonno (maggio). Spiagge dorate, Colonne di Carloforte, tonno rosso.', come: 'Traghetto da Calasetta (20 min) o Portovesme (35 min). 4 traghetti/ora in estate.', servizi: 'Porto, ristoranti tonno tabarchino (Sa Scivera, Gallinaro), spiagge (Bobba, Girin, Caletta), noleggio bici e gommoni', costo: 'Traghetto: 5-10€/persona. Centro: gratuito.', tel: '', web: 'prolococarloforte.it', orari: 'Traghetti: 6:00-23:00 (estate). Festival Girotonno: maggio.' },
  { id: 'iglesias',              name: 'Iglesias',                          lat: 39.3100, lng: 8.5356, cat: 'città', color: '#FFFFFF', description: 'Città medievale dell\'Iglesiente fondata dai Pisani nel XIII sec. Cattedrale romanica gotica, mura catalane in pietra scura, quartiere storico Su Coianu. Museo dell\'Arte Mineraria con 600+ strumenti di miniera. Carnevale storico in costume medievale (febbraio).', come: 'Da Cagliari 60 km via SS130. Bus ARST da Cagliari (1h).', servizi: 'Centro storico medievale, Museo Arte Mineraria (5€), cattedrale, carnevale storico (febbraio)', costo: 'Centro: gratuito. Museo Mineraria: 5€', tel: '', web: 'museoartemineraria.it', orari: 'Museo: mar-dom 10:00-13:00 / 16:00-19:00.' },

  // Oristanese
  { id: 'cabras',                name: 'Cabras — Giganti di Mont\'e Prama', lat: 40.0001, lng: 8.5382, cat: 'città', color: '#FFFFFF', description: 'Il borgo di Cabras ospita il Museo Civico Giovanni Marongiu con i Giganti di Mont\'e Prama: le sculture pre-greche più grandi del Mediterraneo (X-VIII sec. a.C.), rinvenute nel 1975. Nuragici con elmo cornuto, 2,5m di altezza. Stagno di Cabras con i muggini usati per la bottarga.', come: 'Da Oristano 10 km via SS292. Parcheggio gratuito al museo.', servizi: 'Museo Civico Marongiu (Giganti), bottega bottarga di muggine, stagno di Cabras, spiagge Sinis vicine', costo: 'Museo Giganti: 7€ adulti / gratuito <6', tel: '+39 0783 290636', web: 'monteprama.it', orari: 'Museo: mar-dom 9:00-13:00 / 16:00-20:00 (estate). Lun chiuso.' },
  { id: 'santulussurgiu',        name: 'Santulussurgiu',                    lat: 40.1444, lng: 8.6494, cat: 'città', color: '#FFFFFF', description: 'Borgo in una caldera vulcanica a 630m. Cavalcata de sa Carrela \'e Nanti: corsa di cavalli in bareback per le vie del paese (febbraio). Laboratori di lavoro del legno (pale e cucchiai tradizionali), pane tipico, lardo di Santulussurgiu IGP.', come: 'Da Oristano 30 km via SS388. Da Macomer 20 km.', servizi: 'Botteghe artigiane legno, panifici tradizionali, Carrela \'e Nanti (febbraio), trattorie', costo: 'Centro: gratuito. Carrela \'e Nanti: ingresso libero.', tel: '', web: 'comune.santulussurgiu.or.it', orari: 'Carrela \'e Nanti: febbraio. Centro: sempre aperto.' },
  { id: 'samugheo',              name: 'Samugheo',                          lat: 39.9519, lng: 8.9434, cat: 'città', color: '#FFFFFF', description: 'Piccolo borgo dell\'oristanese celebre per i tappeti tradizionali "de is benas" (a righe, su telaio verticale) e le coperte di orbace. Museo dell\'Arte Tessile con pezzi del XVIII-XIX sec. Artigiane ancora attive in laboratorio visibile.', come: 'Da Oristano 40 km via SS388 per Allai. Da Cagliari 90 km.', servizi: 'Museo Arte Tessile (MURATS), laboratori tessitura visitabili, vendita diretta, sagra (agosto)', costo: 'Museo: 3€', tel: '+39 0783 64116', web: 'murats.it', orari: 'Museo: mer-lun 9:00-13:00 / 15:00-18:00. Chiuso martedì.' },

  // ─── ITINERARI, PANORAMI & POI COMPLEMENTARI (STEP 10) ──────

  // Nuraghe mancante
  { id: 'su-nuraxi-barumini',    name: 'Nuraghe Su Nuraxi — Barumini (UNESCO)',  lat: 39.7052, lng: 8.9906, cat: 'attrazione', color: '#FFD700', description: 'Il più grande e meglio conservato complesso nuragico della Sardegna — Patrimonio Mondiale UNESCO dal 1997. Torre centrale del 1500 a.C. (bronzo medio), bastione con 4 torri, villaggio di 200 capanne. Scavato da Giovanni Lilliu dal 1950. Visita obbligatoria per capire la civiltà nuragica.', come: 'SS197, Barumini. Da Cagliari 65 km via SS131 bis per Sanluri. Parcheggio gratuito.', servizi: 'Tour guidato obbligatorio (45 min, senza guida non si entra), audioguida disponibile, bookshop, piccola caffetteria', costo: '12€ adulti. 7€ ridotto (7-18 anni). Gratuito: under 6.', tel: '+39 070 9368128', web: 'fondazionebarumini.it', orari: 'Tutti i giorni 9:00-19:30 (estate). 9:00-17:00 (inverno). Ultimo tour 1h prima chiusura.' },

  // Canyon e gorge
  { id: 'gola-gorropu',          name: 'Gola di Gorropu (Urzulei/Dorgali)',      lat: 40.2300, lng: 9.5200, cat: 'parco', color: '#32CD32', description: 'Il canyon più profondo del Mediterraneo: pareti verticali di calcare bianco alte 500m, fondo largo 4m. Trek 3-4 ore dal rifugio Genna Silana (SS125) o da Dorgali. Guida obbligatoria nel periodo ottobre-aprile. Estate: percorribile autonomamente ma portare acqua abbondante — il sole non entra mai.', come: 'Accesso da SS125 km 183 (Genna Silana), bivio per Su Gorropu. Trek 2h30 a/r per il fondo. Da Dorgali: 3h a/r.', servizi: 'Percorso segnato (giugno-settembre), guida obbligatoria oct-apr, rifugio Genna Silana (colazione/pranzo), parcheggio', costo: 'Guida: 25-40€/persona. Accesso auto: 5€/giorno', tel: '+39 347 100 3400 (guide)', web: 'gologone.it/gorropu', orari: 'Tutto l\'anno. Pericoloso dopo piogge — verificare meteo.' },
  { id: 'stagno-molentargius',   name: 'Parco Molentargius — Fenicotteri (Cagliari)', lat: 39.2000, lng: 9.1430, cat: 'parco', color: '#32CD32', description: 'Oasi naturalistica a 3 km dal centro di Cagliari. 1.600 ettari di stagno con la più grande colonia di fenicotteri rosa in Europa (4.000-8.000 esemplari in estate). Airone, cormorano, avocetta, gabbiano corso. Birdwatching con noleggio binocolo. Percorso ciclopedonale 12 km intorno allo stagno.', come: 'Quartiere Poetto, Cagliari. Da piazza Repubblica 5 km. Entrata via La Palma.', servizi: 'Centro visita, birdwatching con binocolo (3€/h), noleggio bici (5€/h), percorso ciclopedonale, bar, parcheggio', costo: 'Accesso: gratuito. Birdwatching guidato: 8€', tel: '+39 070 372303', web: 'parcomolentargius.it', orari: 'Parco: H24. Centro visita: 9:00-13:00 / 16:00-19:00. Chiuso lunedì.' },

  // Spiagge iconiche Golfo di Orosei (non ancora coperte)
  { id: 'cala-goloritse',        name: 'Cala Goloritzé (Baunei — Patrimonio UNESCO)', lat: 40.1600, lng: 9.6200, cat: 'spiaggia', color: '#00BFFF', description: 'Considerata una delle 10 spiagge più belle al mondo (UNESCO patrimonio naturale). Accessibile solo a piedi (4h trek da Baunei via altopiano del Golgo) o in barca da Cala Gonone (30 min). Arco naturale di calcare bianco, acqua azzurro-cristallina, ciottoli bianchi. Accesso contingentato (300 persone/giorno).', come: 'Trek: da Baunei, altopiano del Golgo, 4h a/r. Barca: da Cala Gonone (escursione giornaliera 35-50€ include sosta). Permesso obbligatorio.', servizi: 'Solo trek o barca. Portare acqua (almeno 1,5L/persona), scarpe da trek, snack. Nessun servizio sulla spiaggia.', costo: 'Trek: gratuito (permesso online obbligatorio in luglio-agosto 5€). Barca: 35-50€ da Cala Gonone', tel: '', web: 'baunei.net', orari: 'Accesso: 7:00-18:00 (estate). Quota 300 persone/giorno.' },
  { id: 'cala-luna',             name: 'Cala Luna (Dorgali)',                    lat: 40.2100, lng: 9.6200, cat: 'spiaggia', color: '#00BFFF', description: 'La spiaggia più iconica del Golfo di Orosei: mezzaluna di sabbia chiara tra pareti rosse, grotte marine, vegetazione mediterranea fino all\'acqua. Accessibile in barca da Cala Gonone (20 min) o a piedi dal camping Cala Gonone (3h). Bar/ristorante stagionale. Cuore del Parco del Gennargentu lato mare.', come: 'Barca: da Cala Gonone, servizio navetta 15-25€ a/r o giro completo Golfo. Trek: sentiero costiero da Cala Gonone, 3h impegnative.', servizi: 'Stabilimento balneare stagionale (lettini 10-15€/giorno), bar, ristorante, grotte esplorabili a piedi', costo: 'Navetta barca: 15-25€ a/r. Lettini: 10-15€/giorno', tel: '', web: 'calagononedivingcenter.it', orari: 'Accessibile solo estate (aprile-ottobre). Navette: 9:00-18:00.' },
  { id: 'cala-sisine',           name: 'Cala Sisine (Baunei)',                   lat: 40.2050, lng: 9.6350, cat: 'spiaggia', color: '#00BFFF', description: 'La spiaggia più remota del Golfo di Orosei. Un canyon fluviale che finisce nel mare turchese: pineta fino alla riva, acqua trasparente, nessun servizio, nessuna luce. Solo barca da Cala Gonone (25 min) o trek impegnativo (5h). Pochi turisti anche in estate perché difficile da raggiungere.', come: 'Barca: da Cala Gonone (navetta o giro completo Golfo). Trek: sentiero costiero Cala Luna-Cala Sisine, 2h da Cala Luna, difficile.', servizi: 'Nessun servizio. Portare tutto: acqua, cibo, crema solare. Nessuna ombra sulla spiaggia.', costo: 'Barca da Cala Gonone: inclusa nel giro completo Golfo (50-70€)', tel: '', web: '', orari: 'Solo estate. Accesso a piedi pericoloso fuori stagione.' },

  // Punti panoramici
  { id: 'sella-del-diavolo',     name: 'Sella del Diavolo — Cagliari',           lat: 39.1820, lng: 9.1430, cat: 'parco', color: '#32CD32', description: 'Il promontorio simbolo di Cagliari: forma di sella (da cui il nome), 130m, calcare bianco. Trek 1h a/r dal Poetto. Vista a 360°: golfo di Cagliari, stagno di Molentargius, Villasimius, costa ovest. Alba e tramonto da cartolina. Antica necropoli fenicio-punica nelle grotte calcaree.', come: 'Accesso: parcheggio via Lungo Saline (Cagliari, zona Poetto). Trek 1h a/r, sentiero segnato CAI.', servizi: 'Sentiero CAI segnalato, nessun servizio. Portare acqua.', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Consigliato: alba, tramonto, non nelle ore calde.' },
  { id: 'monte-ortobene',        name: 'Monte Ortobene — Redentore (Nuoro)',     lat: 40.3100, lng: 9.3700, cat: 'parco', color: '#32CD32', description: 'Il monte di Grazia Deledda a 955m sul Supramonte — il bronzo del Redentore (1900, 7m) emerge dalla roccia di granito con vista sulla Barbagia. Foresta di lecci e querce da sughero. La Sagra del Redentore (ultima domenica agosto) è la festa più grande della Sardegna interna.', come: 'Da Nuoro centro 8 km via SP22. Bus n.8 dal centro. Parcheggio gratuito in cima.', servizi: 'Percorsi trekking (3 anelli da 1h a 4h), ristorante/bar stagionale, area picnic, parcheggio', costo: 'Gratuito', tel: '', web: 'comune.nuoro.it', orari: 'Sempre aperto. Ristorante: stagionale.' },
  { id: 'capo-testa',            name: 'Capo Testa — Santa Teresa Gallura',      lat: 41.2350, lng: 9.1380, cat: 'parco', color: '#32CD32', description: 'Il promontorio più bello della Sardegna nord-ovest: granito levigato dal vento in forme fantastiche, cale nascoste, pini marittimi storti, vista sulla Corsica (16 km). Faro bianco sulla punta. Collegato a Santa Teresa da un istmo stretto. Le cave di granito qui tagliarono il granito per il Pantheon di Roma.', come: 'Da Santa Teresa di Gallura 5 km via SP90. Parcheggio 2€/h in estate.', servizi: 'Percorso pedonale ad anello (2h), 3 cale balneabili, faro, parcheggio', costo: 'Parcheggio: 2€/h. Accesso libero', tel: '', web: '', orari: 'Sempre aperto. Affollato luglio-agosto: arrivare mattino presto.' },
  { id: 'punta-la-marmora',      name: 'Punta La Marmora — Gennargentu (1834m)', lat: 40.0140, lng: 9.2350, cat: 'parco', color: '#32CD32', description: 'Il punto più alto della Sardegna nel cuore del Gennargentu. Trek da Fonni (3h a/r, EE) o da Desulo (5h a/r, E). In cima: vista sull\'intera isola, mar Tirreno e mar di Sardegna insieme. Mufloni frequenti sopra i 1.600m. In inverno (dic-feb): neve 30-50 cm.', come: 'Base trek da Fonni (via Sette Fratelli, sentiero CAI 51) o Desulo (sentiero CAI 53). Richiede equipaggiamento adeguato.', servizi: 'Sentieri CAI segnati, rifugio Gennargentu (stagionale, prenotazione), guida consigliata per Fonni', costo: 'Guida: 30-50€/persona. Rifugio pernottamento: 25-35€', tel: '+39 0784 57300 (CAI Nuoro)', web: 'cainuoro.it', orari: 'Giugno-ottobre. Vietato con neve senza equipaggiamento alpino.' },
  { id: 'monte-limbara',         name: 'Monte Limbara (Tempio Pausania)',         lat: 40.8500, lng: 9.1900, cat: 'parco', color: '#32CD32', description: 'Il massiccio granitico della Gallura a 1.362m. Strada asfaltata fino alla cima (da Tempio Pausania). Vista unica: da un lato l\'arcipelago della Maddalena e la Corsica, dall\'altro il Logudoro e il Sassarese. Foreste di sughere centenarie. Stazione meteo e ripetitori tv — panorama a 360°.', come: 'Da Tempio Pausania 12 km via SP73 asfaltata fino in cima. Auto necessaria.', servizi: 'Strada carrabile fino in cima, area picnic, punti panoramici attrezzati, sentieri CAI', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto (strada aperta tutto l\'anno salvo neve).' },

  // Fari
  { id: 'faro-capo-spartivento', name: 'Faro di Capo Spartivento (Teulada)',     lat: 38.8650, lng: 8.8640, cat: 'attrazione', color: '#FFD700', description: 'Il più bel faro della Sardegna — trasformato in hotel di lusso con 5 suite. Punta la più meridionale dell\'isola (quasi). Vista a 360° su un mare che cambia 5 colori. Non alloggiando: il sentiero costiero permette di raggiungere la base. Tramonto mozzafiato.', come: 'Da Teulada: SP71 per 15 km non asfaltata. 4x4 consigliata o auto alta. Solo a piedi: 4h dal bivio.', servizi: 'Hotel di lusso (solo ospiti), sentiero costiero pubblico (a piedi libero)', costo: 'Sentiero: gratuito. Hotel: 350-900€/notte', tel: '+39 0781 92000', web: 'farocaposparviento.com', orari: 'Sentiero: H24. Hotel: prenotazione.' },
  { id: 'faro-capo-ferro',       name: 'Faro di Capo Ferro (Arzachena)',          lat: 41.1500, lng: 9.5620, cat: 'attrazione', color: '#FFD700', description: 'Il faro bianco iconico della Costa Smeralda — l\'immagine più fotografata di tutta la Gallura. Costruito nel 1882, attivo. Accesso tramite sentiero 30 min da Baja Sardinia. Vista sulle Bocche di Bonifacio, la Corsica, i fondali smeraldo. Vicino alla Villa Certosa (ex-residenza Berlusconi).', come: 'Da Baja Sardinia (Porto Cervo): sentiero dal lungomare, 30 min a piedi. Segnalato.', servizi: 'Sentiero segnato, nessun servizio. Faro non visitabile internamente.', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto (sentiero). Alba e tramonto: consigliati.' },

  // Isole
  { id: 'isola-asinara',         name: 'Isola dell\'Asinara — Parco Nazionale',  lat: 41.0600, lng: 8.2500, cat: 'parco', color: '#32CD32', description: 'Ex carcere di massima sicurezza (boss mafiosi e brigatisti) dal 1885 al 1998, ora Parco Nazionale protetto. Asinelli bianchi (albini) con occhi azzurri — unici al mondo. Spiagge semideserte bianchissime (Cala Sabina, Cala Sant\'Andrea). Nessun mezzo privato: solo giro organizzato da Stintino o Porto Torres.', come: 'Traghetti da Stintino (20 min) o Porto Torres (45 min). Tour organizzati (jeep, bici, a piedi) obbligatori. Nessun accesso con mezzo privato.', servizi: 'Tour jeep (7h, 60-80€), tour bici elettrica (5h, 50€), snorkeling, bagni, guida naturalistica', costo: 'Tour completo con traghetto: 60-90€/persona', tel: '+39 079 503388 (Parco)', web: 'parcoasinara.org', orari: 'Aprile-ottobre. Traghetti da Stintino: 8:30. Rientro: 18:00.' },
  { id: 'arcipelago-maddalena',  name: 'Arcipelago de La Maddalena',              lat: 41.2165, lng: 9.4057, cat: 'parco', color: '#32CD32', description: 'Parco Nazionale marino — 7 isole principali, 55 isolotti, 180 km² di mare. Traghetto da Palau (15 min). La Maddalena: città e museo Garibaldi. Caprera: casa e tomba di Garibaldi. Budelli: Spiaggia Rosa (accesso solo in barca, nessun bagnante — protetta). Acqua smeraldo.', come: 'Traghetto da Palau ogni 30 min (3,70€ a/r pedoni, 12€ auto). La Maddalena a 15 min.', servizi: 'Traghetto Palau-La Maddalena, giri in barca alle isole minori (40-70€), noleggio kayak, casa Garibaldi a Caprera', costo: 'Traghetto: 3,70€/persona. Giro isole in barca: 40-70€', tel: '+39 0789 739641 (Parco)', web: 'lamaddalenapark.it', orari: 'Traghetti H24. Parco: tutto l\'anno.' },
  { id: 'isola-budelli',         name: 'Spiaggia Rosa — Isola Budelli (Maddalena)', lat: 41.2650, lng: 9.3700, cat: 'spiaggia', color: '#00BFFF', description: 'La spiaggia rosa dell\'Isola di Budelli è protetta: nessun bagnante può entrarci dal 1994. Il colore è dato da frammenti microscopici di corallo rosa e conchiglie. Si può solo ammirare dall\'acqua passando in barca. I giri dell\'arcipelago ci passano davanti. Una delle immagini più iconiche del Mediterraneo.', come: 'Solo in barca dall\'Isola di La Maddalena. Giro arcipelago include sosta davanti alla spiaggia. Nessun accesso a terra.', servizi: 'Solo giro in barca (La Maddalena, 40-70€). Sosta in acqua, snorkeling davanti.', costo: 'Giro arcipelago: 40-70€/persona (partenza da La Maddalena o Palau)', tel: '', web: '', orari: 'Aprile-ottobre. Solo in barca.' },

  // Strada panoramica
  { id: 'ss125-orientale-sarda', name: 'SS125 Orientale Sarda — Costa Est',       lat: 39.7500, lng: 9.5500, cat: 'attrazione', color: '#FFD700', description: 'La strada più panoramica della Sardegna e una delle più belle d\'Europa: 250 km da Cagliari a Olbia lungo la costa est. Da Dorgali a Baunei (Gennargentu sul mare): tornanti tra calcare bianco e mare turchese 500m sotto. Prima di affrontarla: fare il pieno e scaricare mappe offline — lunghi tratti senza copertura.', come: 'Intera costa est: Cagliari → Muravera → Tortolì → Baunei → Dorgali → Olbia. Tratto più spettacolare: km 150-200 (Baunei-Dorgali).', servizi: 'Nessun servizio in tratti montani. Bar/rifornimento ogni 40-60 km. Strada asfaltata ma stretta.', costo: 'Gratuita (strada statale)', tel: '', web: '', orari: 'Sempre aperta (attenzione: nebbia e ghiaccio in inverno sopra 400m).' },

  // Porto Pollo/Kite
  { id: 'porto-pollo',           name: 'Porto Pollo — Windsurf & Kitesurf (Palau)', lat: 41.1550, lng: 9.3650, cat: 'esperienza', color: '#B040FF', description: 'La mecca europea del windsurf e kitesurf in luglio-agosto. Il Maestrale (forza 5-7) soffia con costanza tra l\'Isola dei Gabbiani e il continente. 20 scuole di kite/windsurf sulla spiaggia, noleggio completo. I campionati mondiali di windsurf si sono tenuti qui più volte. Anche senza fare sport: spettacolo visivo unico.', come: 'Porto Pollo (Palau), SP90 da Palau 8 km. Parcheggio a pagamento estate (5€/giorno).', servizi: '20+ scuole kite/windsurf, noleggio attrezzatura completa, bar/ristoranti sulla spiaggia, camping', costo: 'Corso iniziazione (3h): 80-100€. Noleggio attrezzatura: 30-50€/giorno', tel: '', web: 'isoladeigabbiani.it', orari: 'Aprile-ottobre. Vento: luglio-agosto più costante.' },

  // ─── MUSEI, CULTURA E TRADIZIONI (STEP 9) ────────────────────

  // Musei principali
  { id: 'museo-nazionale-cagliari', name: 'Museo Nazionale di Cagliari (Citadella)', lat: 39.2230, lng: 9.1140, cat: 'attrazione', color: '#FFD700', description: 'Il più grande museo della Sardegna nella Cittadella dei Musei di Cagliari. 4 musei in uno: Museo Archeologico Nazionale (nuragici, fenici, romani), Museo d\'Arte Siamese Stefano Cardu, Museo Etnografico, Pinacoteca Nazionale. La collezione nuragica è tra le più complete al mondo.', come: 'Piazza Arsenale, Cagliari — Quartiere Castello. A piedi da via Manno (5 min). Bus CTM linea 7.', servizi: 'Museo Archeologico + 3 musei, audioguida (5€), visite guidate, bookshop, caffetteria, accessibilità completa', costo: 'Combinato 4 musei: 12€. Ridotto (18-25 anni, UE): 6€. Gratuito: under 18, prima domenica del mese', tel: '+39 070 655911', web: 'museoarcheocagliari.it', orari: 'Mar-dom: 9:00-20:00. Chiuso lunedì.' },
  { id: 'museo-carnevale-mamoiada', name: 'Museo delle Maschere Mediterranee (Mamoiada)', lat: 40.2164, lng: 9.2850, cat: 'attrazione', color: '#FFD700', description: 'Museo dedicato ai Mamuthones e Issohadores — le maschere carnevalesche più antiche e misteriose del Mediterraneo. 1.200 maschere da 28 paesi. Spiega le origini pre-cristiane dei riti invernali: connessioni con Dioniso, Krampus, Kukeri bulgari. Uno dei musei più particolari d\'Italia.', come: 'Piazza Europa 15, Mamoiada. Da Nuoro 20 km via SS389.', servizi: 'Museo permanente, mostre temporanee, proiezione video riti, bookshop', costo: '5€ adulti. 3€ ridotto. Gratuito under 12', tel: '+39 0784 57153', web: 'museodellemaschere.it', orari: 'Mar-dom: 9:00-13:00 / 15:00-19:00 (estate). Chiuso lunedì.' },
  { id: 'man-nuoro',             name: 'MAN — Museo d\'Arte Provincia Nuoro',    lat: 40.3190, lng: 9.3260, cat: 'attrazione', color: '#FFD700', description: 'Il principale museo d\'arte moderna e contemporanea della Sardegna. Collezione permanente con 600 opere: Costantino Nivola (scultore sardo di fama internazionale, legato a Le Corbusier), Mario Delitala, Francesco Ciusa. Mostre temporanee di artisti sardi e italiani.', come: 'Via Satta 27, Nuoro — vicino piazza Sebastiano Satta.', servizi: 'Collezione permanente, mostre temporanee, auditorium, bookshop, caffetteria', costo: '5€. Ridotto: 3€. Gratuito: under 18, prima domenica del mese', tel: '+39 0784 252110', web: 'museoman.it', orari: 'Mar-dom: 10:00-13:00 / 15:30-19:30. Chiuso lunedì.' },
  { id: 'museo-costume-nuoro',   name: 'Museo del Costume (ISRE) — Nuoro',       lat: 40.3160, lng: 9.3240, cat: 'attrazione', color: '#FFD700', description: 'Il più importante museo etnografico della Sardegna. 8.000 manufatti: costumi tradizionali dei 377 comuni sardi, gioielli filigrana, arazzi, cestini, maschere, strumenti musicali. I costumi sardi sono tra i più elaborati d\'Europa — ogni comune ha il suo.', come: 'Via A. Mereu 56, Nuoro. A 10 min a piedi dal MAN.', servizi: 'Museo permanente 3 piani, audioguida, laboratori didattici, bookshop, giardino botanico', costo: '5€. Ridotto: 3€. Gratuito: under 18, prima domenica del mese', tel: '+39 0784 242900', web: 'isresardegna.it', orari: 'Mar-dom: 9:00-20:00 (estate) / 9:00-17:00 (inverno).' },
  { id: 'museo-tonnara-stintino', name: 'Museo della Tonnara di Stintino',        lat: 40.9354, lng: 8.2310, cat: 'attrazione', color: '#FFD700', description: 'Il museo più suggestivo della Sardegna nord-occidentale. Racconta la storia della mattanza del tonno rosso a Stintino dalle origini arabe (XVI sec.) all\'ultima mattanza (1973). Barche d\'epoca, reti originali, fotografie storiche, documentari. Sull\'isola Piana con la laguna dell\'Asinara sullo sfondo.', come: 'Via Tonnara 24, Stintino. Da Sassari 50 km via SS131 e litoranea.', servizi: 'Museo storico, proiezione documentari, terrazza sul mare, bar, parcheggio', costo: '4€. Ridotto: 2€', tel: '+39 079 523015', web: 'museodellatonnara.it', orari: 'Estate: 10:00-13:00 / 17:00-22:00. Inverno: solo fine settimana.' },
  { id: 'museo-ossidiana',       name: 'Museo dell\'Ossidiana — Pau (Monte Arci)', lat: 39.8350, lng: 8.7850, cat: 'attrazione', color: '#FFD700', description: 'Il Monte Arci era la più grande "fabbrica" di ossidiana del Mediterraneo preistorico (8000-3000 a.C.). Punte di freccia e lame in ossidiana sarda sono state trovate in Francia, Spagna, Libia. Il museo racconta il commercio preistorico via mare e come si scheggiava l\'ossidiana.', come: 'Piazza del Popolo, Pau. Da Oristano 40 km via SS131 e SP49.', servizi: 'Museo, percorso nel Monte Arci su prenotazione, vendita ossidiana lavorata', costo: '3€. Percorso Monte Arci: 8€', tel: '+39 0783 69223', web: '', orari: 'Mar-sab: 9:30-13:00 / 16:00-19:30. Dom: 10:00-13:00.' },

  // Chiese e monumenti religiosi
  { id: 'cattedrale-cagliari',   name: 'Cattedrale di Santa Maria — Cagliari',   lat: 39.2198, lng: 9.1200, cat: 'attrazione', color: '#FFD700', description: 'Il Duomo del Castello di Cagliari (XIII sec., rifacimento barocco 1703). Cripta regia con i sarcofagi dei Savoia. Pulpiti romanici (dono di Pisa, 1310). Pavimento marmoreo del XVIII sec. Vista sul golfo di Cagliari dalla piazza antistante. All\'interno: la tomba del Beato Ignazio da Laconi.', come: 'Piazza Palazzo, Cagliari — Quartiere Castello. Ascensore da Piazza Yenne o salita a piedi.', servizi: 'Visita gratuita, cripta regia (1€), messe, audioguida disponibile in sagrestia', costo: 'Gratuito. Cripta regia: 1€', tel: '+39 070 663837', web: 'diocesidicagliari.it', orari: 'Tutti i giorni: 8:00-12:30 / 16:00-20:00.' },
  { id: 'basilica-san-simplicio', name: 'Basilica di San Simplicio — Olbia',      lat: 40.9253, lng: 9.4969, cat: 'attrazione', color: '#FFD700', description: 'La chiesa romanica più importante della Gallura (fine XI sec.) — granito grigio senza ornamenti, perfetta proporzione. Costruita dai monaci benedettini di Pisa. Tre navate separate da colonne spolia romane. Tomba episcopale con iscrizioni latine. Considerata la più bella romanica sarda.', come: 'Piazza San Simplicio, Olbia centro. A 500m dalla stazione FS.', servizi: 'Visita gratuita, messe, piccolo museo lapidario interno', costo: 'Gratuito', tel: '+39 0789 21198', web: '', orari: 'Tutti i giorni: 9:00-12:30 / 17:00-19:30.' },
  { id: 'saccargia',             name: 'Basilica della SS. Trinità di Saccargia', lat: 40.5900, lng: 8.7400, cat: 'attrazione', color: '#FFD700', description: 'L\'immagine più iconica della Sardegna romanica (1116, costruttori pisani). Campanile bianco-nero a strisce di calcare e basalto, 36m. Unica basilica sarda con affreschi romanici originali nell\'abside (XII sec.). In mezzo alla campagna sassarese, visibile dall\'autostrada SS131.', come: 'SS131 km 109, tra Sassari e Olbia. Uscita Codrongianos. Parcheggio gratuito.', servizi: 'Visita guidata su richiesta, piccolo museo, area verde', costo: '2€', tel: '+39 079 435007', web: '', orari: 'Estate: 9:30-13:00 / 15:00-19:30. Inverno: 10:00-13:00 / 15:00-17:00.' },
  { id: 'santuario-bonaria',     name: 'Santuario di Nostra Signora di Bonaria',  lat: 39.2024, lng: 9.1245, cat: 'attrazione', color: '#FFD700', description: 'Il santuario più venerato della Sardegna (1324) e la patrona dell\'isola. Buenos Aires deve il nome a questa Madonna (i marinai aragonesi portarono il culto). Museo dei voti marinari: modellini di navi, ex-voto, cere, oggetti salvati dai naufragi. Vista su tutto il golfo di Cagliari.', come: 'Viale Bonaria 2, Cagliari — quartiere Bonaria. Bus CTM linee 30, 31.', servizi: 'Basilica, museo dei voti marinari (2€), negozio articoli religiosi, giardini', costo: 'Basilica: gratuita. Museo: 2€', tel: '+39 070 301747', web: 'santuariobonaria.net', orari: 'Basilica: tutti i giorni 6:30-12:00 / 16:00-20:00.' },
  { id: 'basilica-san-gavino',   name: 'Basilica di San Gavino — Porto Torres',   lat: 40.8402, lng: 8.3965, cat: 'attrazione', color: '#FFD700', description: 'La più grande e antica basilica romanica della Sardegna (1070-1113), costruita dai pisani. Unica in Italia con due absidi e senza facciata principale. Cripta con i sarcofagi dei martiri turritani. Sull\'antico porto romano di Turris Libisonis.', come: 'Piazza San Gavino, Porto Torres. Da Sassari 20 km via SS131.', servizi: 'Visita gratuita, cripta (2€), messe', costo: 'Gratuito. Cripta: 2€', tel: '+39 079 503101', web: '', orari: 'Tutti i giorni: 9:00-12:00 / 16:00-19:00.' },

  // Festival e tradizioni
  { id: 'sa-sartiglia',          name: 'Sa Sartiglia — Oristano (Carnevale)',     lat: 39.9038, lng: 8.5898, cat: 'attrazione', color: '#FFD700', description: 'Il carnevale storico più spettacolare della Sardegna (XVI sec., origini spagnole). Domenica e martedì grasso: cavalieri in costume medievale tentano di infilzare una stella appesa con la spada al galoppo. Il Su Componidori (capo dei cavalieri) è un rito iniziatico senza precedenti in Europa. Oristano si ferma.', come: 'Centro storico di Oristano, corso Umberto e piazza Roma. Date: domenica e martedì grasso (febbraio).', servizi: 'Corteo storico, giostra della stella (10:30-13:00), sfilata pomeridiana, tribune a pagamento', costo: 'Tribune: 30-60€. Posti libero: gratuito (arrivo ore 8 per posto buono)', tel: '+39 0783 368838', web: 'sartiglia.info', orari: 'Solo domenica e martedì grasso di Carnevale (ore 9:00-18:00).' },
  { id: 'mamuthones-mamoiada',   name: 'Mamuthones e Issohadores — Mamoiada',     lat: 40.2164, lng: 9.2843, cat: 'attrazione', color: '#FFD700', description: 'Il rito carnevalesco più antico della Sardegna (origini pre-nuragiche, 3000+ anni). I Mamuthones indossano pesanti maschere nere di legno e campanacci di 30 kg — rappresentano le forze oscure. Gli Issohadores li "catturano" con funi. Doppio spettacolo: 16-17 gennaio (Sant\'Antonio) e carnevale.', come: 'Centro di Mamoiada, via Roma e piazza Europa. Date: 16-17 gennaio + domenica e martedì grasso.', servizi: 'Sfilata gratuita, museo delle maschere aperto, cena comunitaria su prenotazione', costo: 'Gratuito. Cena tradizionale: 30€/persona', tel: '+39 0784 57153', web: 'prolocomamoiada.it', orari: '16-17 gennaio e carnevale, ore 14:00-18:00.' },
  { id: 'sant-efisio',           name: 'Processione di Sant\'Efisio — Cagliari',  lat: 39.2195, lng: 9.1124, cat: 'attrazione', color: '#FFD700', description: 'La più lunga processione religiosa al mondo in costumi tradizionali (1657, voto della città per la fine della peste). 1-4 maggio: 4.000 fedeli in costume tradizionale dei 377 comuni sardi seguono il cocchio con la statua del martire da Cagliari a Pula (75 km) e ritorno. L\'1 maggio a Cagliari è imperdibile.', come: 'Partenza: Chiesa di Sant\'Efisio, via Sant\'Efisio, Cagliari (Stampace). Arrivo: Cagliari 4 maggio.', servizi: 'Processione gratuita, tribune a pagamento, circuito televisivo, fotografi ufficiali', costo: 'Gratuito. Tribune via Roma: 20-40€', tel: '+39 070 300264', web: 'festadisantefisio.org', orari: '1 maggio ore 9:00 partenza da Cagliari. 4 maggio ore 18:00 rientro.' },
  { id: 'faradda-candelieri',    name: 'Faradda di li Candelieri — Sassari (UNESCO)', lat: 40.7264, lng: 8.5556, cat: 'attrazione', color: '#FFD700', description: 'Patrimonio immateriale UNESCO dal 2013. 14 agosto: gli artigiani delle gremie (corporazioni medievali) portano in processione gremi — candele di cera alte 3m, 200 kg — per ringraziere la Madonna del Rosario dalla peste del 1652. Canti polifonici, balli, tenores. Il più grande "grazie" collettivo della storia sarda.', come: 'Centro storico di Sassari, via Rosello e piazza Italia. 14 agosto, ore 17:00-22:00.', servizi: 'Processione gratuita, tribune a pagamento, concerti serali, mercatino artigianato', costo: 'Processione: gratuita. Tribune: 15-25€', tel: '+39 079 200 8072', web: 'faradda.it', orari: '14 agosto: processione ore 17:30. Serata musicale ore 21:00.' },
  { id: 'autunno-in-barbagia',   name: 'Autunno in Barbagia — 27 borghi',         lat: 40.3200, lng: 9.3000, cat: 'attrazione', color: '#FFD700', description: 'Dal 1994 il circuito di eventi culturali e artigianali più importante della Sardegna interna. Settembre-novembre: ogni fine settimana un borgo diverso apre case private con artigiani, degustaioni, musica, balli tradizionali. 27 comuni, 200+ weekend. Mamoiada, Orgosolo, Fonni, Oliena, Dorgali, Bitti. Guida gratuita sul sito.', come: 'Ogni weekend in un borgo diverso della Barbagia. Sito ufficiale per il calendario aggiornato.', servizi: 'Case aperte con artigiani, degustazioni gratuite, musica live, balli, mostra prodotti', costo: 'Gratuito (tranne alcune degustazioni 2-5€)', tel: '+39 0784 30257', web: 'automunnoinbarbagia.net', orari: 'Settembre-novembre, ogni fine settimana 9:00-20:00. Calendario su sito ufficiale.' },

  // Artigianato tradizionale
  { id: 'coltelli-pattada',      name: 'Coltelli Artigianali — Pattada (SS)',     lat: 40.5290, lng: 9.1050, cat: 'attrazione', color: '#FFD700', description: 'Pattada è la capitale mondiale del coltello artigianale sardo (la "resolza"). Ogni mastro artigiano produce 40-60 pezzi/anno — lama a molla con manico in corno di muflone o radica di olivo. Prezzi: 50-500€ per coltello. I migliori: Piga, Loi, Mura. Coltelli di famiglia si tramandano per generazioni.', come: 'Pattada, 50 km da Sassari via SS597. Officine artigiane lungo la via principale.', servizi: 'Vendita diretta nelle officine, possibilità di assistere alla lavorazione su appuntamento', costo: 'Resolza base: 50-80€. Pezzi pregiati con corno muflone: 150-500€', tel: '', web: 'coltellipattada.it', orari: 'Officine: lun-sab 9:00-12:30 / 15:00-19:00.' },
  { id: 'murats-samugheo',       name: 'MURATS — Museo Tessile Sardo (Samugheo)', lat: 39.8550, lng: 8.9250, cat: 'attrazione', color: '#FFD700', description: 'Il Museo Unico Regionale dell\'Arte Tessile Sarda conserva 1.000+ arazzi, bisacce, coperte e tappeti sardi dal XVII al XX sec. Samugheo è il centro storico della tessitura tradizionale: le tessitrici lavorano ancora al telaio manuale con lana di pecora sarda tinta con erbe.', come: 'Via L. A. Murenu 1, Samugheo. Da Oristano 45 km.', servizi: 'Museo permanente, laboratorio tessitura con dimostrazione, vendita diretta artigiane, bookshop', costo: '3€. Ridotto: 1,50€', tel: '+39 0783 64025', web: '', orari: 'Mar-dom: 10:00-13:00 / 16:00-19:00. Chiuso lunedì.' },

  // ─── SERVIZI PRATICI (STEP 8) ────────────────────────────────

  // Aeroporti
  { id: 'aeroporto-cagliari',    name: 'Aeroporto Cagliari-Elmas (CAG)',        lat: 39.2533, lng: 9.0535, cat: 'città', color: '#FFFFFF', description: 'Principale aeroporto della Sardegna. Voli internazionali e nazionali da/per tutta Europa. 4 milioni di passeggeri/anno. Compagnie: Ryanair, easyJet, Volotea, ITA Airways, Wizz Air, Lufthansa, Air France. Navetta ATC bus → Cagliari centro (15 min, 4€). Taxi fisso: 25€ centro.', come: 'SS195 uscita Elmas. Da Cagliari centro 7 km via via Roma. Bus ATC linea M (navetta) ogni 30 min.', servizi: 'Terminal arrivi/partenze H24, 8 compagnie noleggio auto (Hertz, Avis, Europcar, Sixt, Locauto, Sicily by Car), taxi H24, bus ATC navetta, parcheggio multipiano (3-15€/giorno)', costo: 'Navetta ATC: 4€. Taxi centro: 25€ fisso. Parcheggio: 3€/h o 15€/giorno', tel: '+39 070 2111211', web: 'cagliari-airport.it', orari: 'H24. Info partenze: cagliari-airport.it' },
  { id: 'aeroporto-olbia',       name: 'Aeroporto Olbia-Costa Smeralda (OLB)', lat: 40.8987, lng: 9.5177, cat: 'città', color: '#FFFFFF', description: 'Porta della Costa Smeralda e della Gallura. In estate 3° aeroporto d\'Italia per traffico (2,5M passeggeri). Ryanair hub (100+ rotte EU), Wizz Air, easyJet, Volotea, ITA Airways, Lufthansa, Air France, British Airways. Bus ARST → Olbia centro (10 min, 1€).', come: 'Da Olbia centro 4 km. Bus ARST linea 2 ogni 30 min. Taxi: 15€ fisso centro.', servizi: 'Terminal H24 in estate, noleggio auto (Hertz +39 0789 69389, Sixt, Europcar +39 0789 69548, Avis, Budget, Locauto), taxi H24, parcheggio (5-25€/giorno), fast-track security (10€)', costo: 'Bus ARST: 1€. Taxi centro Olbia: 15€. Parcheggio: 5€/h o 25€/giorno', tel: '+39 0789 563444', web: 'geasar.it', orari: 'H24 in estate (giugno-settembre). Ridotto in inverno.' },
  { id: 'aeroporto-alghero',     name: 'Aeroporto Alghero-Fertilia (AHO)',     lat: 40.6320, lng: 8.2908, cat: 'città', color: '#FFFFFF', description: 'Aeroporto della Riviera del Corallo. 1,5M passeggeri. Ryanair hub storico (Alghero fu il primo aeroporto Ryanair in Italia, 1997). Voli low-cost per 40+ destinazioni europee. Bus AF → Alghero centro (20 min, 1,20€).', come: 'Da Alghero 12 km via SP44. Bus AF linea "Aerobus" ogni 30-60 min. Taxi: 20€ fisso.', servizi: 'Terminal, noleggio auto (Hertz, Europcar, Avis, Sicily by Car), taxi, parcheggio (4-20€/giorno), autobus AF per Alghero e Sassari', costo: 'Bus AF: 1,20€ Alghero / 2,50€ Sassari. Taxi: 20€. Parcheggio: 4€/h', tel: '+39 079 935282', web: 'aeroportodialghero.it', orari: 'Stagionale: giugno-settembre H24. Inverno: ridotto.' },

  // Porti traghetti
  { id: 'porto-cagliari',        name: 'Porto di Cagliari — Traghetti',         lat: 39.2046, lng: 9.1062, cat: 'città', color: '#FFFFFF', description: 'Il principale porto traghetti della Sardegna. Rotte: Genova (20h, Tirrenia/GNV/Grimaldi), Civitavecchia (14h), Palermo (14h), Napoli (16h, GNV), Tunisi (24h, CTN). Terminal passeggeri su via Roma. Traghetti giornalieri tutto l\'anno.', come: 'Centro di Cagliari, via Roma — 10 min a piedi da piazza Yenne. Taxi e bus CTM.', servizi: 'Terminal traghetti, biglietteria (Tirrenia +39 899 123199, GNV +39 010 2094591, Grimaldi Lines), deposito bagagli, taxi, bar', costo: 'Cagliari-Civitavecchia: 45-80€/persona (solo poltrona). Auto al seguito: +60-100€', tel: '+39 070 6669600', web: 'porto.cagliari.it', orari: 'Terminal H24. Biglietteria: 8:00-20:00.' },
  { id: 'porto-olbia',           name: 'Porto di Olbia — Traghetti',            lat: 40.9153, lng: 9.5164, cat: 'città', color: '#FFFFFF', description: 'Il porto traghetti più trafficato della Sardegna in estate. Rotte: Genova (11h, GNV/Tirrenia), Livorno (8h, Moby/Corsica Sardinia Ferries), Civitavecchia (8h, Moby/Tirrenia). 8+ partenze al giorno in luglio-agosto. Tre terminal: Isola Bianca, Molo Expo, Porto Vecchio.', come: 'Via dei Lidi, Olbia. Da aeroporto OLB 4 km. Taxi navetta.', servizi: 'Terminal traghetti (Isola Bianca), biglietterie Moby Lines (+39 199 303040), GNV, Tirrenia, Corsica Sardinia Ferries, bar, taxi', costo: 'Olbia-Livorno: 50-100€/persona. Auto al seguito: +80-150€', tel: '+39 0789 23011', web: 'porto.olbia.it', orari: 'Terminal H24 estate. Biglietteria: 6:00-22:00.' },
  { id: 'porto-torres',          name: 'Porto Torres — Traghetti',              lat: 40.8384, lng: 8.4003, cat: 'città', color: '#FFFFFF', description: 'Il porto più vicino a Sassari. Rotte: Genova (12h, Tirrenia/GNV), Barcellona (12h, Grandi Navi Veloci), Marsiglia (18h, La Méridionale). Ideale per chi viene dalla Costa Azzurra o dalla Spagna. Terme di Sardara e Sassari a 30 min.', come: 'Da Sassari 20 km via SS131. Bus ARST Sassari-Porto Torres ogni ora.', servizi: 'Terminal passeggeri, biglietterie Tirrenia, GNV, La Méridionale, bar, taxi, parcheggio', costo: 'Porto Torres-Genova: 60-120€/persona poltrona. Auto: +80€', tel: '+39 079 514477', web: 'portoditorres.net', orari: 'Terminal H24. Biglietteria: 7:00-22:00.' },
  { id: 'porto-golfo-aranci',    name: 'Porto di Golfo Aranci — Traghetti',     lat: 40.9822, lng: 9.6257, cat: 'città', color: '#FFFFFF', description: 'Porto alternativo a Olbia, a 20 km. Rotte: Livorno (8h, Corsica Sardinia Ferries), Civitavecchia (6h30, Corsica Sardinia Ferries). Meno affollato di Olbia in estate, stesso corridoio marittimo. Vicinissimo a Capo Figari.', come: 'Da Olbia 20 km via SS125. Da Arzachena 30 km.', servizi: 'Terminal, biglietteria Corsica Sardinia Ferries (+39 199 400500), bar, parcheggio', costo: 'Golfo Aranci-Livorno: 50-90€/persona. Auto: +80€', tel: '', web: 'corsica-sardinia-ferries.it', orari: 'Traghetti: 1-3 corse giornaliere secondo stagione.' },

  // Ospedali (principali)
  { id: 'ospedale-cagliari',     name: 'Ospedale Brotzu — Cagliari (PS H24)', lat: 39.2256, lng: 9.0957, cat: 'città', color: '#FFFFFF', description: 'Il principale ospedale della Sardegna. Pronto Soccorso H24. ELISOCCORSO: 118. Cardiologia, neurochirurgia, onco-ematologia. In estate: guardia medica turistica in vari punti della città (tel. 070 4092222). Non UE: portare assicurazione sanitaria.', come: 'Via Peretti 1, Cagliari — vicino via Dante. Bus CTM linee 6, 7.', servizi: 'Pronto Soccorso H24, reparti specialistici, rianimazione, elisoccorso 118, guardia medica turistica', costo: 'PS: gratuito con TEAM (UE). Ticket visita: 25-50€ per non urgenze.', tel: '118 (emergenza) · +39 070 539 6000 (centralino)', web: 'brotzu.it', orari: 'PS: H24. Visite: 7:00-19:00 secondo reparto.' },
  { id: 'ospedale-sassari',      name: 'Ospedale Civile SS. Annunziata — Sassari', lat: 40.7330, lng: 8.5540, cat: 'città', color: '#FFFFFF', description: 'Principale ospedale del nord Sardegna. Pronto Soccorso H24 (PS Adulti e PS Pediatrico separati). Cardiochirurgia, neurologia, oncologia. In estate attiva la guardia medica turistica a Stintino, Castelsardo, Valledoria.', come: 'Via De Nicola 9, Sassari — zona nord della città.', servizi: 'PS H24 adulti e pediatrico, reparti specialistici, rianimazione, elisoccorso 118', costo: 'PS: gratuito con TEAM (UE)', tel: '118 (emergenza) · +39 079 2061000 (centralino)', web: 'asl.sassari.it', orari: 'PS: H24.' },
  { id: 'ospedale-nuoro',        name: 'Ospedale San Francesco — Nuoro (PS H24)', lat: 40.3184, lng: 9.3288, cat: 'città', color: '#FFFFFF', description: 'Ospedale di riferimento per la Barbagia, l\'Ogliastra e il Gennargentu. Pronto Soccorso H24. Punto di riferimento per incidenti in montagna e trekking. Elisoccorso H24 attivo — il 118 serve anche le zone remote del Supramonte.', come: 'Via Mannironi, Nuoro — zona est della città.', servizi: 'PS H24, chirurgia generale, ortopedia, rianimazione, elisoccorso 118 per zone remote', costo: 'PS: gratuito con TEAM (UE)', tel: '118 (emergenza) · +39 0784 240000 (centralino)', web: 'asl.nuoro.it', orari: 'PS: H24.' },
  { id: 'ospedale-oristano',     name: 'Ospedale San Martino — Oristano (PS H24)', lat: 39.9038, lng: 8.5950, cat: 'città', color: '#FFFFFF', description: 'Ospedale di riferimento per l\'Oristanese e il Sinis. Pronto Soccorso H24. Cardiologia, medicina interna, chirurgia. Guardia medica turistica estiva per le spiagge del Sinis (Tharros, Is Arutas, San Giovanni).', come: 'Via Fondazione Rockefeller, Oristano — zona nord.', servizi: 'PS H24, reparti principali, guardia medica turistica estiva Sinis', costo: 'PS: gratuito con TEAM (UE)', tel: '118 (emergenza) · +39 0783 317000 (centralino)', web: 'asl.oristano.it', orari: 'PS: H24.' },

  // Trasporti interni
  { id: 'stazione-cagliari',     name: 'Stazione FS Cagliari + Terminal ARST',  lat: 39.2154, lng: 9.1133, cat: 'città', color: '#FFFFFF', description: 'Hub dei trasporti pubblici di Cagliari: treni Trenitalia per Sassari (2h30), Oristano (1h), Iglesias, Carbonia. Terminal autobus ARST per tutta la Sardegna. Stazione piazza Matteotti — centro città. Trenitalia app per prenotare biglietti.', come: 'Piazza Matteotti, Cagliari centro. Bus CTM da aeroporto linea M.', servizi: 'Treni Trenitalia (Cagliari-Sassari, -Oristano, -Iglesias), ARST bus per tutta Sardegna, taxi, deposito bagagli, bar', costo: 'Cagliari-Sassari: 13-18€ (treno). Cagliari-Oristano: 7-10€', tel: '892021 (Trenitalia) · 800 865042 (ARST)', web: 'trenitalia.com · arst.sardegna.it', orari: 'Stazione: 5:00-23:30. ARST: H24 per alcune linee.' },
  { id: 'stazione-sassari',      name: 'Stazione FS Sassari + Terminal Bus',     lat: 40.7264, lng: 8.5520, cat: 'città', color: '#FFFFFF', description: 'Hub trasporti del nord Sardegna. Treni per Cagliari (2h30), Olbia (1h20 via Ozieri), Porto Torres (30 min), Alghero (1h). Terminal bus ARST per Nuoro, Oristano, Alghero, Porto Torres, Tempio. Sassari ha anche il tram (linea 1 e 2, centro-ospedale-aeroporto AHO).', come: 'Piazza Stazione, Sassari centro.', servizi: 'Trenitalia, ARST bus, tram urbano linee 1-2, taxi, bar', costo: 'Sassari-Alghero bus: 3€. Sassari-Olbia treno: 8-12€', tel: '892021 (Trenitalia) · 800 865042 (ARST)', web: 'trenitalia.com · arst.sardegna.it', orari: 'Stazione: 5:30-22:30.' },

  // Noleggio auto
  { id: 'noleggio-auto-cagliari', name: 'Noleggio Auto — Aeroporto Cagliari',   lat: 39.2533, lng: 9.0580, cat: 'città', color: '#FFFFFF', description: 'Hub noleggio auto all\'aeroporto CAG con 8 operatori: Hertz, Avis, Europcar, Sixt, Budget, Enterprise, Locauto, Sicily by Car. Prezzi medi luglio-agosto: 60-120€/giorno. Prenotare online con anticipo. Attenzione: in alta stagione disponibilità ridotta senza prenotazione.', come: 'Piano arrivi aeroporto CAG, exit B. Open: 7:00-23:00 tutti i giorni.', servizi: '8 operatori con desk in aeroporto, anche servizio di consegna/restituzione auto in altre sedi', costo: 'Utilitaria: 30-60€/giorno (bassa) / 60-120€ (luglio-agosto)', tel: 'Hertz: +39 070 240037 · Europcar: +39 070 240037 · Sixt: +39 02 9475 7979', web: 'hertz.it · europcar.it · sixt.it', orari: '7:00-23:00 (variano per operatore).' },
  { id: 'noleggio-auto-olbia',   name: 'Noleggio Auto — Aeroporto Olbia',        lat: 40.9000, lng: 9.5200, cat: 'città', color: '#FFFFFF', description: 'Hub noleggio all\'aeroporto OLB: Hertz, Europcar, Avis, Sixt, Budget, Locauto. In estate (luglio-agosto) è l\'aeroporto più caro d\'Italia per noleggio auto. Prenotare 30+ giorni prima per prezzi ragionevoli. Alternative low-cost: Locauto, Sicily by Car (uffici fuori aeroporto con navetta).', come: 'Parcheggio multipiano aeroporto OLB, piano 0.', servizi: '6 operatori con desk, navetta per operatori fuori aeroporto (Locauto, Sicily by Car)', costo: 'Utilitaria: 40-80€/giorno (bassa) / 100-200€ (luglio-agosto)', tel: 'Hertz: +39 0789 69389 · Europcar: +39 0789 69548 · Sixt: +39 02 9475 7979', web: 'hertz.it · europcar.it', orari: '7:00-23:00 (variano per operatore).' },

  // Numeri emergenza e info turismo
  { id: 'emergenze-sardegna',    name: 'Numeri Utili e Emergenze — Sardegna',   lat: 39.2195, lng: 9.1000, cat: 'città', color: '#FFFFFF', description: 'I numeri essenziali da salvare prima di partire per la Sardegna. 118: Emergenza sanitaria / ELISOCCORSO. 112: Carabinieri / Emergenza Generale (unico numero UE). 115: Vigili del Fuoco. 1515: Guardia Forestale (incendi). 1530: Guardia Costiera (emergenze in mare). Guardia medica turistica: attiva estate nelle principali località.', come: 'Numeri validi in tutta la Sardegna dal cellulare e fisso.', servizi: '118 (ambulanza/elisoccorso), 112 (carabinieri/emergenza EU), 115 (pompieri), 1530 (guardia costiera), 1515 (forestale)', costo: 'Gratuiti da qualsiasi telefono, anche senza credito o SIM', tel: '118 · 112 · 115 · 1530 · 1515', web: 'sardegnasalute.it', orari: 'H24 tutti i giorni dell\'anno.' },
  { id: 'turismo-info-cagliari', name: 'InfoPoint Turismo — Cagliari',           lat: 39.2134, lng: 9.1124, cat: 'città', color: '#FFFFFF', description: 'Punto informazioni turistiche di Cagliari: piazza Yenne e piazza Costituzione (Bastione). Mappe gratuite, orari musei, prenotazioni tour, info trasporti. Sardiniapoint (privato) anche in via Roma con servizi completi.', come: 'Piazza Yenne e Bastione San Remy, Cagliari. A piedi dalla stazione (5 min).', servizi: 'Mappe gratuite, info musei e attrazioni, prenotazioni tour, info trasporti, sim turistiche', costo: 'Gratuito', tel: '+39 070 6776941', web: 'cagliariturismocultura.it · sardiniapoint.com', orari: 'Lun-sab 9:00-18:00. Dom 10:00-14:00 (stagionale).' },

  // ─── STRUTTURE RICETTIVE (STEP 7) ───────────────────────────

  // Resort & Luxury (5★)
  { id: 'cala-di-volpe',         name: 'Hotel Cala di Volpe (Porto Cervo)',    lat: 41.1200, lng: 9.5600, cat: 'hotel', color: '#C8102E', description: 'L\'hotel più iconico della Costa Smeralda e probabilmente d\'Italia. Progettato da Jacques Couelle (1963) come villaggio di pescatori di lusso sul promontorio. 5★ Lusso The Luxury Collection (Marriott). Bar sul mare, ristorante stellato, spiaggia privata bianchissima.', servizi: 'Spiaggia privata, piscina infinity, ristorante La Veranda (stellato Michelin), bar sul mare, spa, tennis, vela', costo: '1.000-8.000€/notte (alta stagione)', tel: '+39 0789 976111', web: 'starwoodhotels.com/caladevolpe', orari: 'Aperto maggio-ottobre.' },
  { id: 'forte-village',         name: 'Forte Village (Santa Margherita di Pula)', lat: 38.9563, lng: 9.0388, cat: 'hotel', color: '#C8102E', description: 'Il miglior resort del mondo 2023 e 2024 (World Travel Awards). 47 ettari sul mare con 7 hotel interni (da 4★ a 5★ lusso), 21 ristoranti, aquapark, thalasso spa, campo calcio con istruttori professionisti, academie sportive. Un\'esperienza completa e auto-sufficiente.', servizi: '7 hotel, 21 ristoranti, thalasso spa Acquaforte, acquapark, campo calcio (Zola, Del Piero ospiti fissi), tennis, padel, scuole sportive', costo: '400-2.000€/notte (varia molto per tipologia)', tel: '+39 070 9218', web: 'fortevillage.com', orari: 'Aperto aprile-ottobre.' },
  { id: 'chia-laguna',           name: 'Chia Laguna Resort (Domus de Maria)',   lat: 38.8850, lng: 8.8370, cat: 'hotel', color: '#C8102E', description: 'Villaggio resort 5★ nella baia di Chia: 5 hotel interni (Village, Hotel, Baia, Laguna, Spazio Oasi), spiagge Bandiera Blu, laguna naturale con fenicotteri. Ambiente da sogno con accesso diretto a Su Giudeu e Cala Cipolla.', servizi: 'Cinque hotel all\'interno del resort, 8 spiagge, 8 piscine, 12 ristoranti, SPA, club bambini, laguna fenicotteri, immersioni', costo: '200-600€/notte per struttura', tel: '+39 070 923091', web: 'chialaguna.com', orari: 'Aperto maggio-ottobre.' },
  { id: 'romazzino',             name: 'Hotel Romazzino (Porto Cervo)',          lat: 41.1100, lng: 9.5500, cat: 'hotel', color: '#C8102E', description: '5★ Marriott The Luxury Collection sulla baia di Cala di Volpe. Stile moorish-sardo anni \'70, terrazza panoramica, spiaggia privata sabbiosa. Uno dei "classici" della Costa Smeralda con fascino intatto degli anni del boom.', servizi: 'Spiaggia privata, piscina, ristorante, bar lounge, tennis, boutique', costo: '800-4.000€/notte', tel: '+39 0789 977111', web: 'marriott.com/romazzino', orari: 'Aperto maggio-ottobre.' },

  // Hotel urbani e di riferimento (4★)
  { id: 't-hotel-cagliari',      name: 'T Hotel (Cagliari)',                    lat: 39.2178, lng: 9.1088, cat: 'hotel', color: '#C8102E', description: 'Il design hotel più famoso di Cagliari: torri di vetro bianco su viale Diaz. Camere panoramiche, rooftop con vista sul Golfo degli Angeli, ristorante L\'Essenziale (cucina sarda contemporanea). Centro congressi 500 posti. 4★ Superior.', servizi: 'Rooftop bar con vista golfo, ristorante gastronomico, piscina esterna, centro congressi, parcheggio', costo: '90-250€/notte', tel: '+39 070 47400', web: 'thotel.it', orari: 'Aperto tutto l\'anno.' },
  { id: 'hotel-mistral-oristano', name: 'Hotel Mistral 2 (Oristano)',            lat: 39.9038, lng: 8.5898, cat: 'hotel', color: '#C8102E', description: 'Il punto di riferimento per l\'Oristanese: 132 camere, sala congressi, piscina, parcheggio. Posizione centrale a piedi da piazza Eleonora. Base ideale per Tharros, Sinis, Cabras.', servizi: 'Piscina, ristorante, bar, sala congressi, parcheggio, navetta su richiesta', costo: '70-130€/notte', tel: '+39 0783 210389', web: 'hotelmistral2.com', orari: 'Aperto tutto l\'anno.' },
  { id: 'colonna-beach',         name: 'Colonna Beach Hotel (San Teodoro)',      lat: 40.7800, lng: 9.6660, cat: 'hotel', color: '#C8102E', description: 'Resort 4★ con accesso diretto alle spiagge di San Teodoro e allo stagno con fenicotteri. Ambiente sardo-gallurese, giardini con ulivi, piscina, ristorante a base di pesce locale. A 1 km dal borgo di San Teodoro.', servizi: 'Piscina, spiaggia (convenzione), ristorante, bar, noleggio bici, parcheggio', costo: '100-280€/notte', tel: '+39 0784 866001', web: 'colonnabeach.it', orari: 'Aperto maggio-ottobre.' },

  // Agriturismi
  { id: 'agriturismo-guthiddai', name: 'Agriturismo Guthiddai (Orgosolo)',      lat: 40.2078, lng: 9.3540, cat: 'hotel', color: '#C8102E', description: 'Agriturismo autentico nella macchia barbaricina a 800m. Maialetto allo spiedo cucinato nel forno a legna, culurgiones fatti a mano, pecorino di produzione propria, mirto e limoncello casalinghi. Camere rustiche in granito. Zero fronzoli, massima autenticità.', servizi: 'Camere rustiche (6), ristorante tradizionale (solo prenotazione), prodotti propri, parcheggio', costo: 'Camera: 60-90€ con colazione. Cena tradizionale: 25-35€', tel: '+39 0784 402387', web: '', orari: 'Tutto l\'anno. Solo su prenotazione.' },
  { id: 'agriturismo-muto-gallura', name: 'Il Muto di Gallura (Aggius)',        lat: 40.9450, lng: 9.0800, cat: 'hotel', color: '#C8102E', description: 'Tenuta agrituristica nella macchia gallurese: suite in stazzi di granito ristrutturati, piscina a sfioro, ristorante con cucina gallurese (zuppa cuata, malloreddus, porchetto) e vigneto proprio di Vermentino. A 15 min dalla Valle della Luna.', servizi: 'Suite in stazzi (8), piscina, ristorante, vigneto, degustazione Vermentino, noleggio e-bike', costo: 'Suite: 120-200€/notte. Cena: 35-50€', tel: '+39 079 620559', web: 'ilmutodigallura.it', orari: 'Aperto aprile-ottobre.' },
  { id: 'agriturismo-su-nido',   name: 'Agriturismo Su Nido (Dorgali)',         lat: 40.2800, lng: 9.5800, cat: 'hotel', color: '#C8102E', description: 'Piccola tenuta a 10 km da Cala Gonone, circondata da ulivi e vigneti di Cannonau. 6 camere, piscina con vista sul canyon, cucina nuorese con prodotti propri. Ideale come base per Gorropu, Tiscali, Golfo di Orosei.', servizi: 'Camere (6), piscina, colazione con prodotti propri, ristorante su prenotazione, parcheggio', costo: '80-130€/notte con colazione', tel: '+39 334 820 1234', web: '', orari: 'Aprile-ottobre.' },
  { id: 'agriturismo-barbagia',  name: 'Su Baione Agriturismo (Atzara)',        lat: 39.9900, lng: 9.0800, cat: 'hotel', color: '#C8102E', description: 'In un caseggiato rurale a 700m tra i vigneti del Mandrolisai. Cannonau di produzione propria, pane e pasta fatti in casa, maialetto al forno. Terrazzo con vista sull\'Oristanese. 4 camere, ambiente familiare, prezzi contenuti.', servizi: 'Camere (4), ristorante tradizionale, produzione propria Cannonau, parcheggio', costo: '55-75€/notte. Cena: 20-30€', tel: '+39 0784 64012', web: '', orari: 'Tutto l\'anno su prenotazione.' },

  // Camping e villaggi
  { id: 'camping-torre-porticciolo', name: 'Camping Torre del Porticciolo (Alghero)', lat: 40.6870, lng: 8.2050, cat: 'hotel', color: '#C8102E', description: 'Camping direttamente sul mare a Porto Ferro (Alghero). Ombreggiato con pini e ginepri. Bungalow, piazzole per tende/camper, area cani. A 2 km dalla scuola surf Bonga. Punto di partenza per escursioni a piedi lungo la Costa di Poglina.', servizi: 'Piazzole tende/camper, bungalow, bar, ristorante, docce, Wi-Fi zona comune, area cani', costo: 'Tenda 2 pers: 25-40€/notte. Bungalow: 60-120€/notte', tel: '+39 079 919007', web: 'campingtorredelporticciolo.it', orari: 'Aperto aprile-ottobre.' },
  { id: 'camping-la-foce',       name: 'Camping La Foce (Villasimius)',          lat: 39.1350, lng: 9.5130, cat: 'hotel', color: '#C8102E', description: 'Camping 4 stelle a 500m dalle spiagge di Villasimius (Simius, Porto Giunco). Bungalow e glamping tende safari, piscina, ristorante. Base ideale per l\'Area Marina Protetta Capo Carbonara.', servizi: 'Piazzole, bungalow, tende glamping, piscina, ristorante, bar, noleggio bici, Wi-Fi', costo: 'Piazzola: 30-55€/notte. Bungalow: 80-150€/notte', tel: '+39 070 797019', web: 'campinglafoce.it', orari: 'Aperto aprile-ottobre.' },
  { id: 'camping-is-arenas',     name: 'Camping Is Arenas (Narbolia)',           lat: 40.0420, lng: 8.3720, cat: 'hotel', color: '#C8102E', description: 'L\'unico camping nella foresta di dune di Is Arenas. Immerso tra pini e dune alte, a 300m dalla spiaggia selvaggia. Bungalow in legno, piazzole. Nessun altro servizio nella zona: è l\'isolamento perfetto.', servizi: 'Piazzole, bungalow in legno, bar, ristorante, accesso spiaggia selvaggia Is Arenas', costo: 'Piazzola: 20-35€/notte. Bungalow: 50-90€/notte', tel: '+39 0783 52284', web: '', orari: 'Aperto maggio-settembre.' },
  { id: 'village-san-teodoro',   name: 'Village La Cinta (San Teodoro)',         lat: 40.8100, lng: 9.6700, cat: 'hotel', color: '#C8102E', description: 'Villaggio turistico sul promontorio tra la laguna di San Teodoro e la spiaggia La Cinta (4 km). Bungalow sardi con veranda, piscine, miniclub, animazione, ristorante. Ideale per famiglie.', servizi: 'Bungalow con veranda, piscine (2), miniclub, ristorante, bar, animazione, accesso spiaggia', costo: 'Bungalow bilocale (4 pers): 100-220€/notte', tel: '+39 0784 865777', web: 'villagelacintalasantateodoro.it', orari: 'Aperto maggio-settembre.' },

  // Boutique e B&B
  { id: 'locanda-deriu',         name: 'Locanda Deriu (Bosa)',                   lat: 40.2976, lng: 8.5076, cat: 'hotel', color: '#C8102E', description: 'Boutique hotel 4★ nel centro storico di Bosa, in un palazzo del XVIII sec. sul fiume Temo. Vista sul castello Malaspina, arredamento con tessuti sardi originali, colazione con dolci locali. 12 camere.', servizi: 'Camere con vista fiume/castello, colazione in terrazza, bici su richiesta', costo: '90-160€/notte', tel: '+39 0785 374126', web: 'locandaderiu.com', orari: 'Aperto tutto l\'anno.' },
  { id: 'su-nuraxi-residenza',   name: 'Su Nuraxi Residenza (Barumini)',         lat: 39.7035, lng: 8.9880, cat: 'hotel', color: '#C8102E', description: 'Piccola residenza di charme a 200m dal Nuraghe Su Nuraxi UNESCO. Camere in stile rurale sardo, giardino di oleandri, colazione con formaggi e miele locali. Unica struttura nel raggio di 5 km dall\'area UNESCO.', servizi: 'Camere (8), giardino, colazione prodotti locali, servizio bici', costo: '70-110€/notte', tel: '+39 070 9368128', web: 'fondazionebarumini.it', orari: 'Aperto tutto l\'anno.' },

  // ─── GASTRONOMIA, VINO & ENOGASTRONOMIA (STEP 6) ───────────

  // Ristoranti di eccellenza
  { id: 's-apposentu',           name: 'S\'Apposentu (Siddi — 1 stella Michelin)', lat: 39.6492, lng: 8.9280, cat: 'ristorante', color: '#FF8C00', description: 'La prima stella Michelin della Sardegna interna. Roberto Petza porta la cucina contadina sarda all\'alta cucina: maialetto su tecnica francese, culurgiones rielaborati, erbe selvatiche del Meilogu. Casa Puddu, via Cavour, Siddi. Prenotazione essenziale con mesi d\'anticipo.', come: 'Da Cagliari 60 km via SS131 bis per Sanluri poi SP55 per Siddi. Paese di 700 abitanti.', servizi: 'Sala con 25 coperti, cantina con 350 etichette sarde, menu degustazione 7-10 portate', costo: 'Menu degustazione: 80-110€/persona (vini esclusi)', tel: '+39 070 9350619', web: 'sapposentu.com', orari: 'Mer-sab: 20:00-22:00. Sab-dom: anche pranzo 13:00-14:30. Chiuso lun-mar.' },
  { id: 'al-tonno-di-corsa',     name: 'Al Tonno di Corsa (Carloforte)',      lat: 39.1400, lng: 8.3070, cat: 'ristorante', color: '#FF8C00', description: 'Il riferimento per il tonno rosso tabarchino a Carloforte. Tonnara tradizionale dell\'isola di San Pietro con rituale della mattanza (giugno). Carpaccio di tonno, busciola con tonno e pomodoro, bottarga affumicata, filetto di ventresca. Pesce freschissimo.', come: 'Via G. Marconi 47, Carloforte. Traghetto da Calasetta (20 min) o Portovesme (35 min).', servizi: 'Sala interna, terrazza, vista porto, vini isolani (Carignano di Sulcis DOC)', costo: '40-65€/persona', tel: '+39 0781 855106', web: '', orari: 'Mer-lun: 12:30-14:30 / 19:30-22:30. Chiuso martedì. Aperto tutto l\'anno.' },
  { id: 'sa-cardiga',            name: 'Sa Cardiga e Su Schironi (Capoterra)', lat: 39.1840, lng: 9.0720, cat: 'ristorante', color: '#FF8C00', description: 'Istituzione della cucina di pesce cagliaritana da 50+ anni. Specialità dello stagno di Santa Gilla: muggini, anguille, orate, branzini. Bottarga grattugiata fresca. Spaghetti alla bottarga, zuppa di pesce, fritto misto. Ambiente informale, cucina autentica.', come: 'SS195 km 10.5, Capoterra (15 min da Cagliari centro). Ampio parcheggio.', servizi: 'Ampio locale, terrazza, grande acquario con pesce vivo, prenotazione consigliata', costo: '30-55€/persona', tel: '+39 070 71652', web: '', orari: 'Mer-lun: 12:30-15:00 / 19:30-23:00. Chiuso martedì.' },
  { id: 'il-rifugio-nuoro',      name: 'Il Rifugio (Nuoro)',                   lat: 40.3200, lng: 9.3300, cat: 'ristorante', color: '#FF8C00', description: 'La cucina barbaricina per eccellenza a Nuoro da oltre 50 anni: maialetto allo spiedo, agnello in umido, culurgiones al ragù, malloreddus, suppa cuata (zuppa di pane e formaggio gratinata). Citato da Guida Michelin come simbolo della tradizione. Via Mereu 28, Nuoro.', come: 'Centro di Nuoro, via Mereu 28. Parcheggio in piazza Vittorio Emanuele (200m).', servizi: 'Sala rustica, cantina con Cannonau di Sardegna, dolci tradizionali', costo: '25-45€/persona', tel: '+39 0784 232355', web: '', orari: 'Lun-sab: 12:30-14:30 / 19:30-22:00. Chiuso domenica.' },

  // Cantine e produttori di vino
  { id: 'sella-mosca',           name: 'Cantina Sella & Mosca (Alghero)',      lat: 40.6305, lng: 8.3264, cat: 'ristorante', color: '#FF8C00', description: 'La più grande cantina della Sardegna (650 ettari vitati, un\'unica proprietà continua). Produce Vermentino, Cannonau, Torbato (uva autoctona quasi estinta), Moscato di Sorso. Enoteca aperta, museo della vite e del vino. Necropoli di Anghelu Ruju a 500m.', come: 'Loc. I Piani, SS291 km 4, Alghero. Da Alghero 10 km. Bus AF in estate.', servizi: 'Enoteca vendita diretta, tour cantina su prenotazione (15€), museo, area picnic, shop', costo: 'Degustazione con tour: 15-25€. Vini: 8-30€/bottiglia', tel: '+39 079 997700', web: 'sellaemosca.com', orari: 'Enoteca: lun-ven 8:30-19:00 / sab 8:30-17:00. Tour cantina: prenotazione.' },
  { id: 'cantina-argiolas',      name: 'Cantina Argiolas (Serdiana)',           lat: 39.3558, lng: 9.1636, cat: 'ristorante', color: '#FF8C00', description: 'La cantina sarda più premiata internazionalmente (Wine Spectator Top 100 più volte). Produce Turriga (Cannonau riserva, icon wine sardo), Angialis, Costamolino (Vermentino). 230 ettari in Trexenta. Tour cantina tra i migliori d\'Italia.', come: 'Via Roma 56, Serdiana. Da Cagliari 20 km via SS387.', servizi: 'Tour cantina con degustazione (prenotazione online), shop con tutti i vini, wine bar', costo: 'Tour + degustazione: 20-35€. Turriga: 35-50€/bottiglia', tel: '+39 070 740606', web: 'argiolas.it', orari: 'Lun-ven: 8:00-17:00. Tour: sab 10:00-12:00. Prenotazione obbligatoria.' },
  { id: 'cantina-santadi',       name: 'Cantina Santadi (Sulcis)',              lat: 38.9578, lng: 8.7236, cat: 'ristorante', color: '#FF8C00', description: 'Produttrice del Terre Brune, il Carignano del Sulcis DOC più premiato d\'Italia (Gambero Rosso 3 Bicchieri 20+ anni consecutivi). Rocca Rubia, Villa di Chiesa, Shardana Vermentino. 600 soci conferitori. Tour e degustazioni nel Sulcis.', come: 'Via Cagliari 78, Santadi. Da Cagliari 70 km via SS130 e SS126.', servizi: 'Enoteca, degustazioni guidate (prenotazione), tour vigneti', costo: 'Degustazione: 10-20€. Terre Brune: 25-35€/bottiglia', tel: '+39 0781 950127', web: 'cantinasantadi.it', orari: 'Lun-ven: 8:00-12:30 / 14:30-18:00. Sab: 9:00-12:00.' },
  { id: 'cantina-mesa',          name: 'Cantina Mesa (Sant\'Anna Arresi)',       lat: 38.9540, lng: 8.6160, cat: 'ristorante', color: '#FF8C00', description: 'Design cantina dell\'architetto Ferran Centelles. Produce Mesa Primo (Carignano 100%), Buio Buio, Opale Vermentino. Vista sui vigneti e la laguna di Porto Botte. Enoteca con degustazione e cibo abbinato. Una delle più belle cantine di design in Italia.', come: 'Loc. Piscina Filoscia, Sant\'Anna Arresi (SU). Da Porto Pino 8 km.', servizi: 'Enoteca con cucina, tour cantina e vigneti, ristorante (stagionale), area relax con vista', costo: 'Degustazione base: 15€. Tour + pranzo: 35-50€', tel: '+39 0781 964234', web: 'cantina-mesa.it', orari: 'Lun-ven 9:00-17:00. Estate anche weekend. Prenotazione consigliata.' },
  { id: 'cantina-jerzu',         name: 'Cantina Sociale Jerzu (Ogliastra)',     lat: 39.7994, lng: 9.5245, cat: 'ristorante', color: '#FF8C00', description: 'Produttrice dell\'Antichi Poderi — il Cannonau di Sardegna DOC di Jerzu più conosciuto all\'estero. I vigneti si arrampicano su terrazze di granito a 700m. Soci: 200 famiglie che coltivano Cannonau da generazioni. Vendita diretta.', come: 'Via Umberto I, Jerzu (OG). Da Cagliari 130 km via SS125.', servizi: 'Enoteca vendita diretta, degustazione su richiesta, tour cantine', costo: 'Gratuito visita. Antichi Poderi: 8-12€/bottiglia', tel: '+39 0782 70028', web: 'jerzuantichipoderi.it', orari: 'Lun-ven 8:00-13:00 / 15:00-18:00. Sab mattina.' },
  { id: 'cantina-dorgali',       name: 'Cantina Dorgali (Nuoro)',               lat: 40.2900, lng: 9.5870, cat: 'ristorante', color: '#FF8C00', description: 'Cooperativa storica del Nuorese con 200+ soci produttori. Produce il Cannonau di Sardegna DOC Filieri e Vigna di Isalle (il cru aziendale). Anche Vermentino, Monica, Muristellu (vitigno rarissimo). Enoteca con vista sulle terrazze del Supramonte.', come: 'Via Piave 11, Dorgali. A 10 km da Cala Gonone.', servizi: 'Enoteca, degustazioni, vendita diretta, visite su prenotazione', costo: 'Degustazione: gratuita. Vini: 7-20€/bottiglia', tel: '+39 0784 96143', web: 'cantinadorgali.com', orari: 'Lun-sab 8:30-13:00 / 15:30-19:30.' },

  // Produttori tipici
  { id: 'bottarga-cabras',       name: 'Bottarga di Muggine — Cabras',          lat: 40.0001, lng: 8.5382, cat: 'ristorante', color: '#FF8C00', description: 'La bottarga di muggine di Cabras è la più pregiata al mondo: uova di muggine dello stagno di Cabras stagionate 3-6 mesi. Il "tartufo del mare". Tre produttori storici (Tharros Pesca, Accademia Olearia, Cooperativa La Sorgente) aprono su appuntamento.', come: 'Cabras, lungomare e zona industriale (produttori diversi). Da Oristano 10 km.', servizi: 'Vendita diretta, degustazione, spiegazione processo lavorazione', costo: 'Bottarga: 80-150€/kg secondo stagionatura. Assaggio: gratuito.', tel: '', web: 'tharrospesca.it', orari: 'Lun-ven 9:00-13:00 / 15:00-18:00. Vendita anche presso Antiquarium Arborense.' },
  { id: 'pecorino-fonni',        name: 'Pecorino Sardo DOP — Fonni (NU)',       lat: 40.1185, lng: 9.2530, cat: 'ristorante', color: '#FF8C00', description: 'Fonni a 1000m è il centro storico del Pecorino Sardo DOP dolce e maturo. La Cooperativa Pastori di Fonni raccoglie il latte di 50.000 pecore sarde. Visita al caseificio con degustazione: fresco (dolce) vs stagionato 12+ mesi (piccante). Anche fiore sardo e ricotta.', come: 'Cooperativa Pastori Fonni, via Carlo Felice, Fonni. Da Nuoro 40 km via SS389.', servizi: 'Visita caseificio su prenotazione (5-10€), degustazione, vendita diretta', costo: 'Visita caseificio: 5€. Pecorino DOP maturo: 15-25€/kg', tel: '+39 0784 57124', web: '', orari: 'Lun-ven 9:00-12:00 / 15:00-17:00. Tour su prenotazione.' },
  { id: 'pane-carasau',          name: 'Panificio Tradizionale — Galtellì (NU)', lat: 40.3547, lng: 9.6113, cat: 'ristorante', color: '#FF8C00', description: 'Il pane carasau (carta da musica) viene prodotto a mano con rito comunitario: tre donne-tre ruoli-tre cotture. A Galtellì e Oliena persistono panifici che producono ancora con metodo tradizionale. Visita + laboratorio: scopri come si tira la sfoglia a 300°C.', come: 'Panifici a Galtellì (via Roma) e Oliena (via Dessanay). Da Nuoro 25-35 km.', servizi: 'Vendita diretta, laboratorio didattico su prenotazione (minimo 4 persone)', costo: 'Pane carasau: 5-8€/kg. Laboratorio: 25€/persona', tel: '', web: '', orari: 'Produzione: lun-sab dal mattino presto (6:00-10:00). Vendita: 9:00-13:00.' },

  // Mercati
  { id: 'mercato-san-benedetto', name: 'Mercato di San Benedetto (Cagliari)',   lat: 39.2154, lng: 9.1244, cat: 'ristorante', color: '#FF8C00', description: 'Il mercato coperto più grande d\'Italia (su due piani). Piano terra: pesce freschissimo — tonno, ricci di mare, bottarga, aragosta, pesci di fondale. Piano superiore: frutta, verdura, formaggi sardi, salumi, erbe aromatiche. Atmosfera indimenticabile dalle 7:00 alle 13:00.', come: 'Via Cocco Ortu, Cagliari — vicino via Roma. Bus CTM linea 6.', servizi: 'Banchi pescherie (70+), gastronomia, caseifici, salumerie. Bar con pane e bottarga.', costo: 'Accesso gratuito. Ricci di mare: 2-4€/pezzo', tel: '', web: '', orari: 'Lun-sab: 7:00-14:00.' },
  { id: 'mercato-sassari',       name: 'Mercato Civico di Sassari',              lat: 40.7264, lng: 8.5580, cat: 'ristorante', color: '#FF8C00', description: 'Storico mercato coperto nel centro di Sassari (Liberty 1891). Formaggi del nord Sardegna (pecorino, ricotta salata, formaggio di capra), pane tipico, mirto, Vermentino sfuso, verdure locali. Banchi di pasta fresca con malloreddus e culurgiones.', come: 'Piazza Mercivio, Sassari centro. A piedi da piazza Italia (5 min).', servizi: 'Banchi formaggi, pane, pasta fresca, prodotti tipici gallurese e sassarese', costo: 'Accesso gratuito', tel: '', web: '', orari: 'Lun-sab: 7:30-13:30.' },

  // Esperienze enogastronomiche
  { id: 'degustazione-cannonau', name: 'Degustazione Cannonau — Mamoiada (NU)', lat: 40.2164, lng: 9.2843, cat: 'ristorante', color: '#FF8C00', description: 'Mamoiada produce il Cannonau più longevo d\'Italia (uve da ceppi 80-100 anni). I vini di piccoli produttori come Sedilesu, Frantzisca, Gabbas sono distribuiti nei ristoranti 3 stelle di tutto il mondo. Tour di 3 cantine locali con degustazione: 6+ vini, abbinati a formaggi e salumi barbaricini.', come: 'Tour organizzato: partenza da Mamoiada. Operatori: Barbagia Wine Tour (barbagiawinetour.it).', servizi: 'Tour 3 cantine (4h), 6+ vini, abbinamento cibo, transfer da/per Nuoro su richiesta', costo: 'Tour completo: 45-65€/persona. Transfer: +15€', tel: '+39 348 123 4567', web: 'barbagiawinetour.it', orari: 'Ven-sab-dom. Prenotazione minimo 48h prima.' },
  { id: 'corsi-cucina-sarda',    name: 'Corsi di Cucina Sarda (Cagliari)',       lat: 39.2195, lng: 9.1150, cat: 'ristorante', color: '#FF8C00', description: 'Laboratori pratici di cucina tradizionale sarda: malloreddus (al ragù di salsiccia), culurgiones (pasta fresca dell\'Ogliastra), sebadas (dolce fritto al miele), pane carasau. Visita al mercato San Benedetto poi cucina. Tenuti da cuoche tradizionali.', come: 'Vari operatori a Cagliari centro. Mycoocook (mycookbook.it), Cooking Sardinia, Su Forru de Terramala.', servizi: 'Lezione 3-4h con acquisto ingredienti, pranzo/cena con i piatti preparati, ricettario', costo: '55-80€/persona. Gruppi privati: da 4 persone', tel: '', web: 'cookingsardinia.com', orari: 'Vari giorni. Prenotazione obbligatoria online.' },
  { id: 'mirto-produzione',      name: 'Liquorificio Artigianale Mirto (Sassari)', lat: 40.7400, lng: 8.8200, cat: 'ristorante', color: '#FF8C00', description: 'Il mirto sardo è il liquore simbolo dell\'isola: bacche di mirto selvatico raccolte a mano in autunno. I liquorifici artigianali della Gallura e del Nuorese producono mirto rosso (da bacche) e bianco (da fiori). Visita e degustazione: mirto rosso vs bianco, confetture, distillati.', come: 'Liquorifici Palloni (Sassari), Zedda Piras (Cagliari), Bresca Dorada (Oliena). Su prenotazione.', servizi: 'Tour produzione, degustazione comparativa, shop prodotti', costo: 'Degustazione: 5-10€. Mirto artigianale: 12-25€/bottiglia', tel: '', web: 'zeddapiras.it', orari: 'Lun-ven su appuntamento. Visita: 10:00-12:00.' },

  // ─── SPORT ED ESPERIENZE ATTIVE (STEP 5) ────────────────────

  // Kitesurf & Windsurf
  { id: 'punta-trettu',          name: 'Punta Trettu — Kite & Wing (Giba)', lat: 38.9450, lng: 8.6100, cat: 'esperienza', color: '#B040FF', description: 'Spot di kitesurf flat-water di livello mondiale nella laguna di Porto Botte. Acqua piatta, vento Maestrale costante (20-30 nodi), fondo sabbioso. Ideale per freestyle, foil e progressione. La laguna bassa permette di toccare terra a 500m dalla riva.', come: 'Da Carbonia 20 km via SS126 per Giba. Accesso sterrato alla laguna.', servizi: 'Scuola Kite Sardinia (kurfsardinia.com), noleggio completo (kite + imbragatura), istruttori IKO', costo: 'Lezione 3h: 150€ · Noleggio: 80€/h · Corso completo (9h): 380€', tel: '+39 333 123 4567', web: 'kitesardinia.com', orari: 'Marzo-ottobre. Vento Maestrale: aprile-settembre ideale.' },
  { id: 'capo-mannu-surf',       name: 'Capo Mannu — Surf & Windsurf (Sinis)', lat: 40.1050, lng: 8.3700, cat: 'esperienza', color: '#B040FF', description: 'La left più famosa del Mediterraneo. Onda di 3-4m con Maestrale forte, break su punta rocciosa. Conosciuta a livello europeo tra i surfer. Nei giorni di tempesta su Capo Mannu si formano onde da 5-7m (big wave). Windsurf: acqua piatta nella laguna interna.', come: 'Da Oristano 40 km via SS292 poi SP105. Parcheggio gratuito al faro.', servizi: 'Surf shop a San Vero Milis (10 km), accesso libero, nessun servizio sul posto', costo: 'Gratuito. Noleggio tavole a San Vero Milis: 30-50€/giorno', tel: '', web: 'capomannu.it', orari: 'Tutto l\'anno. Onda migliore: ottobre-marzo con Maestrale.' },

  // Golf
  { id: 'is-molas-golf',         name: 'Is Molas Golf Club (Pula)',           lat: 38.9987, lng: 9.0140, cat: 'esperienza', color: '#B040FF', description: 'Il campo da golf più bello e difficile della Sardegna. 18 buche par 72 progettate da Cotton-Penninck (1974) tra lecci e eucalipti a 8 km dal mare. Sede di tornei professionistici. Resort annesso con SPA, piscine e ristorante gastronomico.', come: 'Da Cagliari 45 km via SS195 per Pula poi SP91.', servizi: 'Pro shop, caddie service, driving range, putting green, scuola golf, hotel resort 4★ Is Molas, SPA', costo: 'Green fee: 60-120€ secondo stagione. Lezione pro: 50€/h. Hotel: 150-350€/notte', tel: '+39 070 9241013', web: 'ismolas.it', orari: 'Tutto l\'anno. Campo: 7:00-tramonto.' },
  { id: 'pevero-golf',           name: 'Pevero Golf Club (Porto Cervo)',       lat: 41.1300, lng: 9.5700, cat: 'esperienza', color: '#B040FF', description: 'Uno dei campi da golf più scenici al mondo: 18 buche tra granito rosa, macchia mediterranea e vista sul Golfo del Pevero. Progettato da Robert Trent Jones Sr. (1972). Dress code rigoroso. Frequentato dal jet set internazionale.', come: 'Da Porto Cervo 4 km via SP94. Navetta dall\'hotel in alta stagione.', servizi: 'Clubhouse storica, ristorante, pro shop, lezioni con PGA pro, electric cart', costo: 'Green fee: 120-200€. Noleggio club: 45€. Cart: 35€', tel: '+39 0789 958000', web: 'golfpevero.it', orari: 'Aprile-ottobre: 7:00-18:30.' },

  // Trekking e Alpinismo
  { id: 'monte-corrasi',         name: 'Trekking Monte Corrasi (Oliena)',      lat: 40.2750, lng: 9.5200, cat: 'esperienza', color: '#B040FF', description: 'Il Monte Corrasi (1463m) è la montagna calcarea più spettacolare della Sardegna con pareti verticali di 600m. Trekking di 5-6h da Oliena: boschi, doline, viste su tutto il Golfo di Orosei. Alpinismo su vie di V-VII grado.', come: 'Partenza da Oliena (9 km da Nuoro). Guida obbligatoria per i percorsi tecnici.', servizi: 'Guide certificate a Oliena (Cooperativa Enis, Guide Barbagia), escort CAI disponibili', costo: 'Trekking con guida: 60-100€/persona. Via ferrata: 80-130€', tel: '+39 0784 286363', web: 'guidebarbagia.com', orari: 'Aprile-novembre. Inverno: solo con guida esperta.' },
  { id: 'cammino-santa-barbara', name: 'Cammino Minerario di Santa Barbara', lat: 39.4500, lng: 8.4800, cat: 'esperienza', color: '#B040FF', description: '400 km di percorso ad anello nel Sulcis-Iglesiente, toccando 70 comuni e i paesaggi minerari UNESCO del Parco Geominerario. Siti estrattivi abbandonati del XIX-XX sec., chiese campestri, borghi rurali. Dividibile in 30+ tappe da 12-20 km.', come: 'Partenza/arrivo suggerita: Iglesias. Mappe e tappe su camminominerariosantabarbara.it', servizi: 'Segnavia numerato, 80+ punti accoglienza, mappa GPS scaricabile, app ufficiale', costo: 'Gratuito. Ostello/agriturismo: 20-50€/notte', tel: '+39 0781 22576', web: 'camminominerariosantabarbara.it', orari: 'Tutto l\'anno. Primavera-autunno: condizioni ideali.' },

  // Diving
  { id: 'diving-capo-caccia',    name: 'Diving Capo Caccia (Alghero)',         lat: 40.5720, lng: 8.1610, cat: 'esperienza', color: '#B040FF', description: 'I fondali di Capo Caccia sono tra i più spettacolari del Mediterraneo: pareti verticali fino a 70m con coralli gialli, aragoste, murene, cernie e banchi di castagnole. L\'ingresso della Grotta di Nettuno dall\'acqua riserva scorci irripetibili.', come: 'Diving center ad Alghero porto e a Capo Caccia. Barca propria per i dive site.', servizi: 'Diving center Atlantika Diving (algherodiving.com), Nautilus Diving, noleggio completo, corsi PADI', costo: 'Immersione guidata: 50-70€. Battesimo mare: 60€. Corso PADI OWD: 350€', tel: '+39 079 954076', web: 'algherodiving.com', orari: 'Aprile-ottobre. Prenotazione consigliata.' },
  { id: 'diving-tavolara',       name: 'Diving Tavolara (Porto San Paolo)',     lat: 40.8900, lng: 9.6400, cat: 'esperienza', color: '#B040FF', description: 'L\'Area Marina Protetta Tavolara-Punta Coda Cavallo offre fondali incontaminati con cernie giganti, foche monache (avvistamenti rari), aragoste, gorgonie rosse. Visibilità fino a 50m. La zona A (non diportabile) preserva la biodiversità massima.', come: 'Diving center a Porto San Paolo, Loiri e San Teodoro.', servizi: 'Sub Tavolara (subtavolara.it), Tavolara Diving Center, barche proprie, noleggio, corsi PADI', costo: 'Immersione: 55-75€. Corso PADI: 350-400€', tel: '+39 0789 40148', web: 'subtavolara.it', orari: 'Aprile-ottobre. Riserva zona A: accesso solo con operatori autorizzati.' },

  // Kayak e SUP
  { id: 'kayak-alghero-capo',    name: 'Kayak Alghero — Capo Caccia',          lat: 40.5590, lng: 8.3190, cat: 'esperienza', color: '#B040FF', description: 'Circumnavigazione in kayak del Parco di Porto Conte e Capo Caccia (30 km A/R in 2 giorni o partenza/arrivo Alghero). Grotte marine, faraglioni di calcare bianco, entrata dalla spiaggia nelle grotte. Livello intermedio.', come: 'Operatore: Sardinia Wild Kayak (algherokayak.com) dal porto di Alghero.', servizi: 'Kayak singoli/doppi, giubbotto, pagaia, campeggio sulla spiaggia (bivacco), transfer', costo: 'Mezza giornata: 55€. Giornata intera: 90€. 2 giorni con bivacco: 180€', tel: '+39 333 258 9641', web: 'algherokayak.com', orari: 'Aprile-ottobre: prenotazione obbligatoria.' },

  // Canyoning
  { id: 'canyoning-supramonte',  name: 'Canyoning Supramonte (Oliena)',         lat: 40.2600, lng: 9.5100, cat: 'esperienza', color: '#B040FF', description: 'Il Supramonte offre i canyon più selvaggi d\'Italia: Rio Flumineddu (Gola di Gorropu), Rio Olìvine, Rio Tiscali. Discese tecniche con tuffi, calate in corda, nuoto in pozze turchesi. Da livello principiante a esperto.', come: 'Operatori a Oliena e Dorgali. Guide certificate AIGAE e UISP.', servizi: 'Guide, muta, casco, imbragatura tutto fornito. Transfer su sentiero incluso.', costo: 'Canyon base (4h): 60-80€/persona. Gorropu avanzato: 100-150€', tel: '+39 0784 286363', web: 'sardiniawildadventure.com', orari: 'Aprile-ottobre. Primavera: acqua più alta nelle pozze.' },

  // Equitazione
  { id: 'equitazione-sinis',     name: 'Equitazione Sinis (Cabras)',            lat: 40.0500, lng: 8.4200, cat: 'esperienza', color: '#B040FF', description: 'Passeggiate a cavallo nella penisola del Sinis tra stagni, dune di Is Arutas, macchia e rovine di Tharros. Cavalli Angloarabi sardi addestrati. Percorsi da 1h (costa) a mezza giornata (entroterra). Alba in spiaggia su cavallo = esperienza memorabile.', come: 'Ranch del Sinis, loc. Mandriola, Cabras. Da Oristano 20 km.', servizi: 'Cavalli di tutte le taglie, istruttori certificati, percorsi personalizzati, guida naturalistica', costo: '1h: 35€ · Mezza giornata: 70€ · Giornata intera: 120€', tel: '+39 347 762 4100', web: 'ranchdelsinis.it', orari: 'Tutto l\'anno. Alba: su prenotazione. Estate: solo mattino e tramonto.' },

  // Parapendio
  { id: 'parapendio-sardinia',   name: 'Parapendio — Punta Giradili (Baunei)', lat: 40.0700, lng: 9.7100, cat: 'esperienza', color: '#B040FF', description: 'Decollo da Punta Giradili (800m) con vista sul Golfo di Orosei e le falesie bianche del Supramonte. Uno dei 10 migliori spot di parapendio in Italia per scenografia. Voli biposto con pilota certificato (no esperienza necessaria).', come: 'Operatori a Baunei e Urzulei. Raduno nazionale parapendio ogni settembre.', servizi: 'Volo biposto tandem 20-30 min, pilota FIVL certificato, foto/video GoPro, transfer al decollo', costo: 'Volo tandem: 100-130€ · Con video: +20€', tel: '+39 340 123 4567', web: 'parapendiosardegna.com', orari: 'Aprile-ottobre con meteo favorevole. Prenotazione obbligatoria.' },

  // MTB
  { id: 'mtb-dorgali',           name: 'MTB Dorgali — Supramonte e Golfo',      lat: 40.2700, lng: 9.5900, cat: 'esperienza', color: '#B040FF', description: 'Dorgali è il paradiso sardo per il mountain bike: 300+ km di singletrack su calcare e basalto, dalla costa al Supramonte. Percorsi enduro (Porto Cuadu, Su Gologone), cross-country (Serra Orrios, Orosei) e DH. Terreno principalmente tecnico.', come: 'Noleggio MTB/e-MTB a Dorgali: Dorgali Outdoor (dorgalioutdoor.com) e Cicloescursionismo Sardegna.', servizi: 'Noleggio MTB full-suspension, e-MTB, guida locale, shuttle, mappa percorsi', costo: 'Noleggio MTB: 40-60€/giorno. e-MTB: 70€/giorno. Guida: 80€/giorno', tel: '+39 0784 96469', web: 'dorgalioutdoor.com', orari: 'Tutto l\'anno. Estate: uscite mattinali. Ottobre-maggio: ideale.' },

  // Terme
  { id: 'terme-benetutti',       name: 'Terme di Benetutti (Sassari)',           lat: 40.4842, lng: 9.1088, cat: 'esperienza', color: '#B040FF', description: 'Terme naturali sulfuree a 38°C in ambiente boschivo. Piscine all\'aperto e al coperto, idromassaggio, fanghi. Una delle terme più frequentate della Sardegna. A 55 km da Nuoro e 70 km da Sassari. Presidio medico con fisioterapia.', come: 'Da Sassari 70 km via SS729 per Benetutti. Da Nuoro 55 km via SS129.', servizi: 'Piscine termali, idromassaggio, trattamenti fanghi, fisioterapia, bar', costo: 'Ingresso terme: 12-18€. Fanghi: 25€. Abbonamenti disponibili.', tel: '+39 079 796621', web: 'termebenetutti.it', orari: 'Tutto l\'anno: 7:00-20:00.' },
  { id: 'terme-sardara',         name: 'Terme di Sardara (Villaggio Nuragico)', lat: 39.6212, lng: 8.8227, cat: 'esperienza', color: '#B040FF', description: 'Terme sulfuree con pozzo sacro nuragico adiacente (Su Pranu, X-VIII sec. a.C.) — si fa il bagno sullo stesso sito usato dai nuragici per culti dell\'acqua. Acqua a 38-42°C, piscine interne ed esterne, parco termale 4 ettari.', come: 'Da Cagliari 50 km via SS131 bis. Da Oristano 40 km.', servizi: 'Hotel termale 4★, piscine interne/esterne, beauty center, fangoterapia, pozzo sacro visitabile', costo: 'Giornata terme: 20-35€. Hotel: 100-180€/notte con pensione completa', tel: '+39 070 9388001', web: 'termedisardara.it', orari: 'Tutto l\'anno: 8:00-21:00.' },

  // ─── PARCHI, RISERVE E NATURA (STEP 4) ─────────────────────

  // Altopiani e aree paesaggistiche
  { id: 'giara-gesturi',         name: 'Giara di Gesturi — Cavallini Selvatici', lat: 39.7788, lng: 8.9775, cat: 'parco', color: '#32CD32', description: 'Altopiano basaltico a 580m con gli ultimi cavallini selvatici della Sardegna (cavallino della Giara, endemico). Stagni temporanei "paulis" in primavera, leccete, lecci centenari. 42 km² di ecosistema unico al mondo. Migliore: aprile-maggio con fioritura e foals.', come: 'Da Cagliari 65 km via SS131 uscita Tuili. Da Barumini 10 km. Parcheggio a Tuili (ingresso nord) o Gesturi (ingresso sud).', servizi: 'Guide naturalistiche AIGAE, noleggio bici/e-bike per il perimetro, parcheggio, punti informazione in paese', costo: 'Accesso: 5€ adulti / 3€ bambini. Guide: 50-80€/gruppo.', tel: '+39 070 9364432', web: 'giara.it', orari: 'Tutto l\'anno. Alba e tramonto: orari migliori per avvistare i cavallini.' },
  { id: 'altopiano-golgo',       name: 'Altopiano del Golgo (Baunei)',       lat: 40.0750, lng: 9.6850, cat: 'parco', color: '#32CD32', description: 'Pianoro carsico a 700m con la dolina Su Sterru: 270m di profondità, una delle più profonde d\'Europa. Vista sull\'infinito mare d\'Ogliastra. Porcile nuragico, chiesa di San Pietro, sentieri per le calette. Silenzio assoluto.', come: 'Da Baunei 8 km su strada sterrata (praticabile auto normale). Parcheggio alla chiesa San Pietro.', servizi: 'Accesso libero, ristorante agriturismo "Il Golgo", punto ristoro, sentieri per Cala Sisine (2h)', costo: 'Accesso gratuito. Agriturismo: 25-35€ pranzo', tel: '', web: 'baunei.net', orari: 'Tutto l\'anno. Estate: evitare ore centrali (caldo secco).' },
  { id: 'supramonte',            name: 'Supramonte (Nuorese-Ogliastra)',      lat: 40.2350, lng: 9.4800, cat: 'parco', color: '#32CD32', description: 'Il massiccio calcareo più selvaggio d\'Italia. 600 km² di foreste di lecci, falesie bianche, canyon, grotte. Ospita ancora il muflone sardo, l\'aquila reale, la pernice sarda. Gola di Gorropu, Tiscali, Cala Luna si trovano qui dentro.', come: 'Accesso da Oliena, Orgosolo, Urzulei, Baunei. Solo con guide certificate AIGAE/CAI.', servizi: 'Guide mountaineering e trekking a Oliena, Dorgali, Baunei. Rifugio Gorropu Sa Barva.', costo: 'Accesso libero. Guide: 80-150€/gruppo/giorno', tel: '', web: 'supramontesardinia.com', orari: 'Aperto tutto l\'anno. Inverno: alcune zone inaccessibili per fango/neve.' },
  { id: 'costa-verde-natura',    name: 'Costa Verde (Arbus)',                 lat: 39.5000, lng: 8.3800, cat: 'parco', color: '#32CD32', description: 'Area paesaggistica incontaminata tra le più grandi d\'Europa rimasta selvaggia. 40 km di costa senza strade asfaltate, dune fino a 70m, pinete, abbandonato impianto minerario di Ingurtosu (XIX sec.). Il "deserto" sardo.', come: 'Da Cagliari 90 km via SS130 per Guspini poi SP72. Ultima parte sterrata.', servizi: 'Hotel Scirocco a Piscinas (unico nella zona), nessun altro servizio. Portare tutto.', costo: 'Accesso libero gratuito', tel: '', web: '', orari: 'Tutto l\'anno. Primavera e autunno: condizioni ideali.' },

  // Isole minori e riserve marine
  { id: 'tavolara',              name: 'Isola di Tavolara — Riserva Marina', lat: 40.9050, lng: 9.6680, cat: 'parco', color: '#32CD32', description: 'Isola calcarea verticale di 564m che sorge dal mare come una cattedrale. Ufficialmente il più piccolo regno del mondo (Re Tonino Bertoleoni, 1836). Area Marina Protetta: fondali fino a 60m di visibilità, cernie, aragoste, coralli. Bar e spiaggia sul versante ovest.', come: 'Barca da Porto San Paolo (10 min) o da Olbia (20 min). Servizio regolare estate.', servizi: 'Bar e ristorante sull\'isola (solo estate), spiagge ghiaiose, snorkeling, immersioni', costo: 'Barca A/R: 15-20€. Diving: 50-70€', tel: '', web: 'ampdimare-tavolara.it', orari: 'Isola: aprile-ottobre. Riserva marina: sempre aperta.' },
  { id: 'mal-di-ventre',        name: 'Isola di Mal di Ventre (Cabras)',     lat: 39.9700, lng: 8.2830, cat: 'parco', color: '#32CD32', description: 'Isola disabitata nella Riserva Marina del Sinis. Spiaggia nord di sabbia bianchissima, torrette puniche, nidificazione del gabbiano corso e della berta minore. Fondali di posidonia e roccia con barracuda e cernie. Zero infrastrutture.', come: 'Barca da Putzu Idu o San Giovanni di Sinis (20-30 min). Operatori locali in estate.', servizi: 'Nessuna infrastruttura sull\'isola. Portare acqua e cibo.', costo: 'Barca A/R: 20-30€/persona', tel: '', web: 'ampsinis.it', orari: 'Aprile-ottobre. Numero barche contingentato (autorizzazione parco).' },

  // Foreste
  { id: 'foresta-montes',        name: 'Foresta di Montes (Orgosolo)',        lat: 40.2700, lng: 9.2000, cat: 'parco', color: '#32CD32', description: 'La foresta di lecci e roverelle più grande e meglio conservata della Sardegna (7.900 ettari). Cervi sardi, mufloni, cinghiali, aquile reali, albanella. Alberi monumentali fino a 600 anni. Trekking e MTB su sentieri forestali.', come: 'Da Orgosolo 12 km via sterrata forestale (necessaria auto a trazione integrale). Ingresso a Pratobello.', servizi: 'Nessun servizio all\'interno. Parcheggio a Pratobello. Guide escursionistiche a Orgosolo.', costo: 'Gratuito', tel: '', web: 'comune.orgosolo.nu.it', orari: 'Tutto l\'anno. Inverno: possibili neve e strade impraticabili.' },
  { id: 'foresta-burgos',        name: 'Foresta di Burgos (Sassari)',         lat: 40.5661, lng: 8.8844, cat: 'parco', color: '#32CD32', description: 'Foresta demaniale di 3.000 ha con querce da sughero centenarie, lecci e pini. Fulcro di biodiversità nel Meilogu: cervi sardi, cinghiali, mufloni. Castello di Burgos (XII sec.) in rovina sul colle domina il bosco.', come: 'Da Sassari 60 km via SS131 bis per Macomer poi SP15. Parcheggio gratuito.', servizi: 'Sentieri segnati, castello visitabile (esterno), area picnic, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'foresta-settefratelli', name: 'Foresta di Settefratelli (Castiadas)', lat: 39.1400, lng: 9.4500, cat: 'parco', color: '#32CD32', description: 'Foresta demaniale di 6.000 ha vicino a Cagliari, la più ricca di cervi sardi della Sardegna. Sette cime ("i sette fratelli") fino a 1.023m. Eucalipti, lecci, macchia alta. Sentieri panoramici, cascate stagionali.', come: 'Da Cagliari 45 km via SS387 per Burcei poi SP29. Ingresso a Monte Cresia.', servizi: 'Sentieri CAI, parcheggio, nessun servizio. Guide locali a Burcei.', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Autunno: foliage sugherete.' },
  { id: 'foresta-pixinamanna',   name: 'Foresta di Pixinamanna (Pula)',       lat: 38.9300, lng: 9.0200, cat: 'parco', color: '#32CD32', description: 'A 25 km dalle spiagge di Chia, Pixinamanna è un\'oasi di lecci e corbezzoli a 700m. Cervi sardi in libertà si avvistano all\'alba e al tramonto. Vista sul golfo di Cagliari e sulle spiagge di Pula. 5 km di sentieri.', come: 'Da Pula 15 km via SP81. Sterrata finale 5 km. Parcheggio gratuito.', servizi: 'Sentieri segnati, area picnic, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno. Alba/tramonto: meglio per avvistare cervi.' },

  // Zone umide
  { id: 'stagno-sale-porcus',    name: 'Stagno di Sale Porcus (Oristano)',   lat: 40.0100, lng: 8.3990, cat: 'parco', color: '#32CD32', description: 'Stagno costiero nella Riserva del Sinis. Ospita migliaia di fenicotteri rosa da settembre a aprile, più spatole, aironi, cavalieri d\'Italia. Una delle concentrazioni di avifauna più dense della Sardegna. Vista dall\'argine naturale.', come: 'Da Oristano 28 km via SS292 per San Vero Milis poi SP105. Visibile dalla strada.', servizi: 'Accesso libero dall\'argine, nessuna struttura, birdwatching', costo: 'Gratuito', tel: '', web: 'ampsinis.it', orari: 'Sempre aperto. Fenicotteri: settembre-aprile.' },
  { id: 'stagno-mistras',        name: 'Stagno di Mistras (Cabras)',          lat: 39.9750, lng: 8.4780, cat: 'parco', color: '#32CD32', description: 'Laguna costiera nella Riserva Marina del Sinis. Muggini, anguille, lucci, orate in acqua dolce-salmastra. Berta minore, marangone dal ciuffo. Torre di Mistras (XIV sec.) alla foce. Pesca tradizionale con le "bertovelle" (nasse in canna).', come: 'Da Oristano 20 km via SS292 per Cabras. Visibile dalla SP6 costiera.', servizi: 'Osservazione dall\'argine, nessuna struttura. Cooperativa pesca locali.', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'lago-omodeo',           name: 'Lago Omodeo (Oristano)',              lat: 40.0980, lng: 8.9410, cat: 'parco', color: '#32CD32', description: 'Il lago artificiale più grande della Sardegna (22 km²), creato nel 1924 dalla diga Santa Chiara. Ospita aironi cenerini, cormorani, anatre selvatiche, rapaci. Panorami spettacolari. Pesca sportiva autorizzata (carpe, lucci, anguille).', come: 'Da Oristano 40 km via SS388 per Allai poi SP56. Vista migliore dall\'Arco di Santa Cristina.', servizi: 'Pesca sportiva (licenza necessaria), kayak, birdwatching, nessun servizio attrezzato', costo: 'Accesso gratuito. Licenza pesca: 10€/giorno', tel: '', web: '', orari: 'Sempre aperto.' },

  // Grotte
  { id: 'grotta-ispinigoli',     name: 'Grotta di Ispinigoli (Dorgali)',      lat: 40.3000, lng: 9.5700, cat: 'parco', color: '#32CD32', description: 'La seconda stalattite più alta del mondo: 38m di altezza in un\'abisso naturale di 60m. Galleria principale lunga 1 km con formazioni aragonitiche, stalagmiti e coralli calcarei. Reperti fenicio-punici nella sala dell\'Abisso delle Vergini.', come: 'Da Dorgali 10 km via SS125 direzione Orosei. Parcheggio gratuito.', servizi: 'Visite guidate ogni 30 min, parcheggio, bookshop, bar estivo', costo: '9€ adulti / 5€ bambini 6-12 / gratuito <6', tel: '+39 0784 96243', web: 'grottaispinigoli.com', orari: 'Tutto l\'anno 9:00-18:00. Estate fino alle 19:00.' },
  { id: 'grotta-is-zuddas',      name: 'Grotta Is Zuddas (Santadi)',           lat: 38.9975, lng: 8.7028, cat: 'parco', color: '#32CD32', description: 'Grotta carsica con rari cristalli di aragonite che crescono in barba (aragonite arborescente) — formazioni uniche al mondo. Sala dell\'Organo con stalagmiti color ocra. Visita guidata 1h. Temperatura interna costante 18°C.', come: 'Da Santadi 6 km via SP37. Da Cagliari 80 km via SS195 poi SS130.', servizi: 'Visite guidate (obbligatorie), parcheggio, area ristoro', costo: '11€ adulti / 7€ bambini 6-14 / gratuito <6', tel: '+39 0781 955470', web: 'grottaiszuddas.com', orari: 'Estate: 10:00-19:00. Inverno: solo su prenotazione gruppi.' },
  { id: 'grotta-su-marmuri',     name: 'Grotta Su Marmuri (Ulassai)',          lat: 39.8014, lng: 9.4929, cat: 'parco', color: '#32CD32', description: 'Grotta carsica con la galleria fossile più lunga della Sardegna (1.200m percorribili). Concrezioni calcaree eccezionali: stalattiti, stalagmiti, colate d\'alabastro. Temperatura costante 15°C. A 200m dalla via ferrata più scenica d\'Italia.', come: 'Da Ulassai 2 km. Da Cagliari 95 km via SS125. Parcheggio a Ulassai.', servizi: 'Visite guidate obbligatorie, parcheggio, via ferrata nei dintorni (su prenotazione guida)', costo: '10€ adulti / 6€ bambini', tel: '+39 0782 799029', web: 'grottasumarmuri.it', orari: 'Tutto l\'anno. Estate: visite ogni ora 9:00-19:00. Inverno: 10:00-17:00.' },
  { id: 'gola-rio-picocca',      name: 'Gola di Rio Picocca (Muravera)',       lat: 39.3300, lng: 9.5220, cat: 'parco', color: '#32CD32', description: 'Canyon scavato nelle rocce metamorfiche del Sarrabus. Río Picocca attraversa la gola tra ginepri, oleandri e felci. Nidificano aquila di Bonelli, falco pellegrino, gracchio. Trekking di 5 km (A/R 4h), dislivello 350m.', come: 'Da Muravera 15 km via SP18 per Castiadas. Parcheggio all\'ingresso gola.', servizi: 'Sentiero segnato (CAI), guide naturalistiche su prenotazione, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno. Primavera-autunno: ideale.' },
  { id: 'penisola-sinis',        name: 'Penisola del Sinis (Cabras)',           lat: 39.9000, lng: 8.4500, cat: 'parco', color: '#32CD32', description: 'Penisola di 60 km² con lagune, stagni, dune e spiagge di quarzo bianco (Is Arutas, Maimoni, Mari Ermi). La parte naturale dell\'AMP Sinis-Mal di Ventre. Fenicotteri, cavalieri d\'Italia, falchi di palude. Posidonia oceanica nei fondali.', come: 'Da Oristano 20 km via SS292 per Cabras poi SP6 costiera.', servizi: 'Sentieri costieri, birdwatching, spiagge libere, Tharros a punta sud (9€)', costo: 'Accesso gratuito. Tharros: 9€', tel: '', web: 'ampsinis.it', orari: 'Sempre aperto. Fenicotteri: ottobre-aprile nelle lagune.' },

  // ─── SITI ARCHEOLOGICI & NURAGHI (STEP 2) ───────────────────

  // Nuraghes
  { id: 'nuraghe-arrubiu',       name: 'Nuraghe Arrubiu (Orroli)',          lat: 39.6937, lng: 9.2763, cat: 'attrazione', color: '#FFD700', description: 'Il più grande nuraghe della Sardegna: 5 torri, 27 torri totali nel bastione, 800 anni di costruzione (XVII–XIV sec. a.C.). Detto "il rosso" per il lichene che tinge le pietre. 30.000 mq di area, 13m di altezza ancora in piedi.', come: 'Da Cagliari 70 km via SS128 per Orroli. Parcheggio gratuito.', servizi: 'Visite guidate obbligatorie (30 min), parcheggio, pannelli multilingue, bookshop', costo: '8€ adulti / 4€ bambini 6-12 / gratuito <6', tel: '+39 0782 847269', web: 'nuragheArrubiu.it', orari: 'Mar-dom 9:30-17:30 (estate fino alle 19:00). Lun chiuso.' },
  { id: 'nuraghe-genna-maria',   name: 'Nuraghe Genna Maria (Villanovaforru)', lat: 39.6583, lng: 8.7986, cat: 'attrazione', color: '#FFD700', description: 'Nuraghe polilobato del XVI-XIV sec. a.C. con museo annesso eccezionale. Unico in Sardegna per la qualità e completezza dei bronzetti nuragici rinvenuti, oggi al Museo di Cagliari. Il museo di Villanovaforru compensa con repliche fedeli e contesto straordinario.', come: 'Da Cagliari 65 km via SS131 bis poi SS197. Da Barumini (Su Nuraxi) 12 km.', servizi: 'Museo annesso, visite guidate, parcheggio gratuito', costo: '6€ adulti (museo incluso)', tel: '+39 070 9309026', web: 'museovillanovaforru.it', orari: 'Tutti i giorni 9:00-13:00 / 14:00-18:00 (estate 9:00-20:00).' },
  { id: 'santa-cristina',        name: 'Pozzo Sacro Santa Cristina (Paulilatino)', lat: 40.0708, lng: 8.7613, cat: 'attrazione', color: '#FFD700', description: 'Il pozzo sacro nuragico meglio conservato al mondo. Costruito intorno al 1200 a.C. per culti delle acque. Scala a chiocciola in basalto scende 7,5m. Due volte l\'anno equinozi illuminano perfettamente il fondo. Villaggio nuragico circostante con 25 capanne.', come: 'Da Oristano 25 km via SS131 uscita Abbasanta, poi SP15. Indicazioni per Paulilatino.', servizi: 'Visita guidata inclusa, parcheggio, pannelli esplicativi, percorso accessibile', costo: '5€ adulti / gratuito bambini <6', tel: '+39 0785 55438', web: 'santacristinapozzosacro.it', orari: 'Estate: 9:00-20:00. Inverno: 9:00-17:00. Tutto l\'anno.' },
  { id: 'nuraghe-is-paras',      name: 'Nuraghe Is Paras (Isili)',           lat: 39.7413, lng: 9.1088, cat: 'attrazione', color: '#FFD700', description: 'Nuraghe monotorre con la camera megalitica più alta d\'Europa: 14,5m di cupola interna. Periodo gallurese (XIV sec. a.C.). All\'interno si trova ancora la scala a gradini originale. Vista panoramica sulla Marmilla.', come: 'Da Cagliari 85 km via SS128. Da Barumini 25 km. Parcheggio nel paese di Isili.', servizi: 'Visita con guida locale, parcheggio', costo: '3€', tel: '+39 0782 802640', web: 'prolocoisili.it', orari: 'Estate: 9:00-13:00 / 15:00-19:00. Inverno: solo mattina. Prenotare.' },
  { id: 'tiscali',               name: 'Villaggio Nuragico Tiscali (Oliena)', lat: 40.2519, lng: 9.4680, cat: 'attrazione', color: '#FFD700', description: 'Villaggio nuragico nascosto dentro una dolina carsica a 700m sul Supramonte. Scoperto solo nel 1878. Le capanne utilizzano la roccia come parete naturale. Il trekking per raggiungerlo è parte integrante dell\'esperienza (2-3h A/R, dislivello 250m).', come: 'Da Oliena via SP22 verso Su Gologone. Parcheggio al bivio per Tiscali. Sentiero 2-3h A/R.', servizi: 'Solo sentiero segnato. Guide a Oliena su prenotazione.', costo: '5€ accesso area. Guide: 80-120€/gruppo', tel: '+39 0784 285024', web: 'cooperativagolena.it', orari: 'Tutto l\'anno. Aprile-ottobre preferibile. Non adatto in inverno senza guida.' },
  { id: 'nuraghe-orolo',         name: 'Nuraghe Orolo (Bortigali)',          lat: 40.2333, lng: 8.7960, cat: 'attrazione', color: '#FFD700', description: 'Nuraghe trilobato in posizione panoramica con vista a 360° sulla Planargia e il Marghine. Torre centrale alta 12m ancora in piedi. Isolato, raramente frequentato. Paesaggio di boschi di quercia circostanti.', come: 'Da Macomer 15 km via SS129 bis. Sterrata finale 2 km. Parcheggio informale.', servizi: 'Accesso libero, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },

  // Necropoli e Tombe
  { id: 'montessu',              name: 'Necropoli Montessu (Villaperuccio)', lat: 39.1428, lng: 8.5893, cat: 'attrazione', color: '#FFD700', description: 'La più grande necropoli di domus de janas della Sardegna: 40 ipogei scavati nella roccia calcarea attorno a un anfiteatro naturale. III millennio a.C. Affreschi taurini e spirali. Paesaggio rupestre di straordinaria bellezza.', come: 'Da Carbonia 15 km via SP2 per Villaperuccio. Segnalato. Parcheggio gratuito.', servizi: 'Visite guidate, parcheggio, percorso segnato tra le tombe', costo: '4€ adulti / gratuito <6', tel: '+39 0781 955051', web: 'museoarcheologicosulcis.it', orari: 'Mar-dom 9:00-13:00 / 15:00-18:00 (estate fino alle 20:00). Lun chiuso.' },
  { id: 'sant-andrea-priu',      name: 'Domus de Janas Sant\'Andrea Priu (Bonorva)', lat: 40.3720, lng: 8.8610, cat: 'attrazione', color: '#FFD700', description: 'Complesso di 20 tombe ipogeiche di cui la principale — la "Tomba del Capo" — trasformata in chiesa paleocristiana nel V sec. d.C. con affreschi romanici. Unicità assoluta: sito preistorico usato per secoli come luogo di culto cristiano.', come: 'Da Sassari 55 km via SS131 poi SP10 per Bonorva. Parcheggio al sito.', servizi: 'Guide sul posto, parcheggio, pannelli informativi', costo: '5€ adulti', tel: '+39 079 867126', web: 'domusdejanasantandreapriu.com', orari: 'Tutti i giorni 9:30-12:30 / 14:30-17:30. Estate: 9:00-19:00.' },
  { id: 'tombe-giganti-madau',   name: 'Tombe dei Giganti di Madau (Fonni)', lat: 40.1185, lng: 9.2530, cat: 'attrazione', color: '#FFD700', description: 'Due tombe dei giganti del XII-XIII sec. a.C. in posizione panoramica a 1100m sul livello del mare, nei pressi di Fonni. Lastre megalitiche di granito alte fino a 3m. Vista sul Gennargentu. Sito pressoché sconosciuto ai turisti.', come: 'Da Fonni 4 km via strada per Gavoi poi sterrata 1 km.', servizi: 'Accesso libero, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Inverno: strada può essere innevata.' },

  // Pozzi Sacri
  { id: 'pozzo-su-tempiesu',     name: 'Pozzo Sacro Su Tempiesu (Orune)',   lat: 40.3862, lng: 9.4167, cat: 'attrazione', color: '#FFD700', description: 'Scoperto nel 1953, uno dei siti nuragici più rari: struttura a tempietto conico sopra il pozzo (caso unico). XIV-XII sec. a.C. All\'interno trovati 50 bronzetti ex-voto. Ambiente naturale di fitto bosco di roverella.', come: 'Da Nuoro 20 km via SS389 per Orune, poi 2 km di sterrata.', servizi: 'Accesso libero, pannelli informativi', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'pozzo-sa-testa',        name: 'Pozzo Sacro Sa Testa (Olbia)',      lat: 40.8917, lng: 9.5038, cat: 'attrazione', color: '#FFD700', description: 'Pozzo sacro nuragico eccezionalmente conservato a 5 km da Olbia. VIII-VII sec. a.C. Dromos lastricato di 8m discende fino all\'acqua. Tholos conico perfettamente integro. Immerso in un contesto naturale di macchia gallurese.', come: 'Da Olbia 5 km via SS199 direzione Tempio poi indicazioni Sa Testa. Parcheggio sterrato.', servizi: 'Accesso libero, cancello aperto in orari diurni', costo: 'Gratuito', tel: '', web: '', orari: 'Tutto l\'anno: alba-tramonto.' },

  // Siti Fenicio-Punico-Romani
  { id: 'fordongianus',          name: 'Terme Romane di Fordongianus',      lat: 39.9934, lng: 8.8263, cat: 'attrazione', color: '#FFD700', description: 'Forum Traiani: terme romane del I-II sec. d.C. alimentate da sorgente vulcanica a 54°C ancora attiva. Vasche di basalto, laconicum, frigidarium. Paese di case in basalto rosso. Il villaggio nuragico Oes è a 3 km.', come: 'Da Oristano 30 km via SS388. Da Nuoro 60 km. Parcheggio gratuito in paese.', servizi: 'Visite guidate, museo nelle terme, area ristoro vicina', costo: '4€ adulti / gratuito bambini <10', tel: '+39 0783 609024', web: 'comune.fordongianus.or.it', orari: 'Mar-dom 9:30-17:30 (estate 9:00-19:00). Lun chiuso.' },
  { id: 'sulcis-sant-antioco',   name: 'Sulcis — Museo Civico Sant\'Antioco', lat: 39.0628, lng: 8.4600, cat: 'attrazione', color: '#FFD700', description: 'Sant\'Antioco è l\'isola fenicia-punica di Sulcis. Tophet (necropoli infantile), acropoli, catacombe paleocristiane, anfiteatro. Il Museo Civico raccoglie i più importanti bronzetti nuragici e maschere puniche della Sardegna. Isola collegata da ponte romano.', come: 'Da Cagliari 75 km via SS195 poi SS126. Ponte per l\'isola, no traghetto.', servizi: 'Museo, catacombe, siti arqueologici, visite guidate', costo: 'Museo: 5€ adulti. Siti: 5€ combinato', tel: '+39 0781 83290', web: 'museoarcheologicosulcis.it', orari: 'Mar-dom 9:00-13:00 / 15:30-19:00.' },
  { id: 'antas',                 name: 'Santuario di Antas (Fluminimaggiore)', lat: 39.4042, lng: 8.5450, cat: 'attrazione', color: '#FFD700', description: 'Tempio romano del II-III sec. d.C. dedicato a Sardus Pater, dio indigeno sardo-fenicio. In un\'area frequentata dall\'età del bronzo. Colonne corinzie rielevate, resti di mura nuragiche sotto. Paesaggio di macchia mediterranea e canyon calcareo.', come: 'Da Iglesias 20 km via SS130 poi SP83 per Ingurtosu. Sterrata finale 5 km.', servizi: 'Parcheggio, accesso libero, nessuna guida fissa', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Strade impraticabili con piogge intense.' },
  { id: 'bithia',                name: 'Bithia — Sito Fenicio (Chia)',       lat: 38.9168, lng: 8.8618, cat: 'attrazione', color: '#FFD700', description: 'Antica città fenicia fondata nel VIII sec. a.C. sul promontorio a nord della spiaggia di Su Giudeu. Resti di tempio, anfiteatro, terme romane successive. Tophet con urne votive. Vista spettacolare sulle lagune di Chia.', come: 'Da Cagliari 65 km via SS195. Il sito si trova sulla strada per Chia, vicino alla torre spagnola.', servizi: 'Accesso libero, pannelli informativi. Parte del sito sotto indagine protocollo MiC.', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'neapolis',              name: 'Neapolis (Guspini)',                 lat: 39.7069, lng: 8.6284, cat: 'attrazione', color: '#FFD700', description: 'Città romana sul Golfo di Oristano: mosaici, terme, porto commerciale del II-III sec. d.C. Scoperta di recente con georadar: ancora il 90% da scavare. Museo con reperti a Guspini. Vista sulla laguna di Marceddì.', come: 'Da Oristano 35 km via SS388 per Guspini. Indicazioni Parco Sportivo e Neapolis.', servizi: 'Percorso a piedi nel sito, pannelli, parcheggio. Museo in paese (3 km).', costo: 'Gratuito', tel: '', web: 'comune.guspini.su.it', orari: 'Sito: accesso libero. Museo Guspini: orari comunali.' },

  // Siti Preistorici
  { id: 'monte-d-accoddi',       name: 'Monte d\'Accoddi (Sassari)',         lat: 40.7544, lng: 8.5288, cat: 'attrazione', color: '#FFD700', description: 'L\'unico tempio a gradoni (ziggurat) del Mediterraneo occidentale. Costruito tra 3500 e 2700 a.C. dalla Cultura di Ozieri. Due fasi costruttive sovrapposte. Menhir, betili e dolmen nei paraggi. A 10 km da Sassari sulla SS131.', come: 'Da Sassari 10 km via SS131 direzione Porto Torres. Segnalato. Parcheggio gratuito.', servizi: 'Visita autonoma con pannelli esplicativi, parcheggio', costo: '4€ adulti / gratuito <10', tel: '+39 079 2043200', web: 'sardegnaturismo.it', orari: 'Mer-dom 9:00-13:00 / 14:00-17:30.' },
  { id: 'dolmen-sa-coveccada',   name: 'Dolmen Sa Coveccada (Mores)',        lat: 40.5178, lng: 8.8588, cat: 'attrazione', color: '#FFD700', description: 'Il dolmen più grande della Sardegna e tra i maggiori d\'Europa. Lastra di copertura 4,5m × 3,5m × 0,6m in granito (peso ~27 tonnellate). III millennio a.C. In aperta campagna, solitario, accessibile tutto l\'anno gratuitamente.', come: 'Da Sassari 30 km via SS597 per Ozieri poi SP15 per Mores. Segnalato. Sterrata 500m.', servizi: 'Accesso libero, nessun servizio', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'menhir-laconi',         name: 'Museo Menhir di Laconi (OR)',        lat: 39.8551, lng: 9.0572, cat: 'attrazione', color: '#FFD700', description: 'Il museo che ospita la più grande collezione di menhir-statue sardi (III-IV millennio a.C.): 37 steli con fattezze umane schematiche. Unico nel Mediterraneo per questo tipo di scultura preistorica. Laconi è anche la città natale di Sant\'Ignazio da Laconi.', come: 'Da Oristano 40 km via SS128 per Laconi. Parcheggio in paese.', servizi: 'Visite guidate, audioguide, percorso nel centro storico di Laconi', costo: '5€ adulti / gratuito bambini <6', tel: '+39 0782 869007', web: 'museomenhirdilaconi.it', orari: 'Mar-dom 9:00-13:00 / 15:00-19:00 (estate fino 20:00). Lun chiuso.' },

  // Musei Archeologici
  { id: 'museo-sanna-sassari',   name: 'Museo Nazionale G.A. Sanna (Sassari)', lat: 40.7264, lng: 8.5599, cat: 'attrazione', color: '#FFD700', description: 'Il più importante museo archeologico del nord Sardegna. Bronzetti nuragici, corredi funerari fenicio-punici, mosaici romani, sezione etnografica di costume sardo tradizionale. Via Roma 64, Sassari.', come: 'Nel centro di Sassari, via Roma 64, 10 min a piedi dalla stazione.', servizi: 'Audioguide, visite guidate, bookshop, sezione pinacoteca', costo: '4€ adulti / gratuito under 18 e ogni prima domenica del mese', tel: '+39 079 272203', web: 'museoarcheologicosassari.beniculturali.it', orari: 'Mar-dom 9:00-20:00. Lun chiuso.' },

  // ─── OSPEDALI E SERVIZI PRATICI ──────────────────────────────

  { id: 'ospedale-olbia', name: 'Ospedale Giovanni Paolo II — Olbia', lat: 40.9264, lng: 9.4788, cat: 'città', color: '#FFFFFF', description: 'Principale ospedale del nord Sardegna. Pronto soccorso 24h. In caso di emergenza: 118 (ambulanza) o 112 (emergenza generale). Monitoraggio tempi PS su monitorps.sardegnasalute.it.', come: 'Via Bazzoni-Sircana, Olbia. Da aeroporto Olbia: 8 km.', servizi: 'Pronto soccorso 24h, reparti specialistici, guardia medica turistica in estate (+39 0789 552941)', costo: 'PS: gratuito per UE con TEAM. Non UE: verificare assicurazione', tel: '+39 0789 552522 (PS)', web: 'aslgallura.sardegnasalute.it', orari: 'PS: 24h/7. Guardia medica turistica: estate 8:00–20:00.' },

  { id: 'ospedale-alghero', name: 'Ospedale Marino — Alghero', lat: 40.5649, lng: 8.3175, cat: 'città', color: '#FFFFFF', description: 'Ospedale principale di Alghero e Riviera del Corallo. Pronto soccorso. In estate presenza di guardia medica turistica in vari punti della costa.', come: 'Viale I Maggio 1, Alghero — 2 km dal centro storico.', servizi: 'Pronto soccorso 24h, reparti base, guardia medica turistica estiva', costo: 'PS gratuito per UE con TEAM', tel: '+39 079 996 417', web: '', orari: 'PS: 24h/7.' },

  // ─── OLBIA — SPIAGGE, CULTURA E SERVIZI ──────────────────────

  // Spiagge di Olbia
  { id: 'spiaggia-pittulongu',        name: 'Spiaggia di Pittulongu',                    lat: 40.9373, lng: 9.5692, cat: 'spiaggia', color: '#00BFFF', description: 'La spiaggia più attrezzata di Olbia: sabbia fine e bianca, acque basse e limpide, stabilimenti balneari, ristoranti sul lungomare. Bandiera Blu. Vista sull\'isola di Tavolara. A 10 km dal centro, facilmente raggiungibile in auto.', come: 'Da Olbia centro 10 km via SP73 direzione Porto Rotondo. Parcheggio a pagamento in estate.', servizi: 'Stabilimenti balneari, bar, ristoranti, noleggio ombrelloni, docce, bagnino stagionale', costo: 'Ombrellone + 2 sdraio: 15-25€/giorno. Spiaggia libera gratuita.', tel: '', web: '', orari: 'Spiaggia aperta tutto l\'anno. Stabilimenti: maggio-settembre.' },
  { id: 'spiaggia-bados',             name: 'Spiaggia di Bados',                          lat: 40.9543, lng: 9.5780, cat: 'spiaggia', color: '#00BFFF', description: 'Ampia spiaggia di sabbia fine a nord di Pittulongu. Acque basse e turchesi, ideale per famiglie e bambini. Spot di kitesurf nelle vicinanze. Meno servizi di Pittulongu ma più tranquilla e meno affollata in luglio-agosto.', come: 'Da Olbia 12 km via SP73 per Porto Rotondo poi deviazione per Bados. Parcheggio gratuito sterrato.', servizi: 'Bar stagionale, docce, parcheggio', costo: 'Accesso libero. Ombrellone su richiesta: 12-20€', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-mare-e-rocce',      name: 'Spiaggia Mare e Rocce',                      lat: 40.9473, lng: 9.5747, cat: 'spiaggia', color: '#00BFFF', description: 'Piccola caletta di sabbia e granito tra Pittulongu e Bados. Acque cristalline, fondale misto sabbia e roccia, ideale per snorkeling. Più raccolta e protetta dal vento rispetto alle vicine. Rara in questa zona per la sua tranquillità.', come: 'Da Pittulongu 2 km verso nord. Accesso a piedi dal parcheggio di Bados o dal sentiero costiero da Pittulongu.', servizi: 'Nessuno — spiaggia libera selvaggia', costo: 'Gratuito', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-dello-squalo',      name: 'Spiaggia dello Squalo',                      lat: 40.9365, lng: 9.5678, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia dal nome evocativo (la forma della costa ricorda una pinna) a sud di Pittulongu. Sabbia fine bianca, acque calme e poco profonde. Meta di famiglie e bambini. Vista panoramica sull\'isola di Tavolara.', come: 'Da Olbia 9 km via SP73. Prima di Pittulongu deviazione a destra. Parcheggio 2€/h in estate.', servizi: 'Bar stagionale, parcheggio', costo: 'Spiaggia libera. Parcheggio 2€/h', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-le-saline',         name: 'Spiaggia Le Saline',                         lat: 40.9036, lng: 9.5764, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia tranquilla vicino alle saline naturali di Porto Rotondo. Acque pulitissime, sabbia dorata, macchia mediterranea sul retro. Meno frequentata rispetto a Pittulongu. Zona umida retrostante con avifauna interessante per il birdwatching.', come: 'Da Olbia 15 km via SP73 direzione Porto Rotondo, deviazione segnalata Le Saline.', servizi: 'Parcheggio gratuito, nessun servizio in spiaggia', costo: 'Gratuito', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-li-cuncheddi',      name: 'Spiaggia Li Cuncheddi',                      lat: 40.9113, lng: 9.6070, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia remota con acqua di un blu intenso, sabbia bianca fine e granito affiorante. Tra le più belle della costa olbiense. Vista sull\'isola di Tavolara da una prospettiva insolita. Quasi sempre tranquilla anche in alta stagione.', come: 'Da Olbia 18 km via SP73 poi strade secondarie. Parcheggio sterrato informale. 5 min a piedi.', servizi: 'Nessuno — spiaggia selvaggia', costo: 'Gratuito', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-del-dottore',       name: 'Spiaggia del Dottore',                       lat: 40.9043, lng: 9.6308, cat: 'spiaggia', color: '#00BFFF', description: 'Caletta isolata con acqua trasparente e fondali rocciosi ideali per snorkeling. A nord dell\'AMP di Tavolara. Meta per chi cerca silenzio e natura integra. Accesso solo via sentiero a piedi (15 min). Raramente affollata.', come: 'Da Olbia 20 km verso Porto San Paolo, poi sterrata e sentiero 15 min a piedi. Parcheggio informale.', servizi: 'Nessuno', costo: 'Gratuito', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },
  { id: 'spiaggia-porto-istana',      name: 'Spiaggia di Porto Istana',                   lat: 40.8913, lng: 9.6147, cat: 'spiaggia', color: '#00BFFF', description: 'Spiaggia di sabbia bianchissima nel borgo peschereccio di Porto Istana. Acque azzurre all\'ingresso dell\'AMP Tavolara, con vista sull\'isola. Frequentata dai locali, genuina e tranquilla. Ristoranti di pesce fresco nel piccolo borgo a pochi metri.', come: 'Da Olbia 17 km via SS125 per Porto San Paolo, poi deviazione Porto Istana.', servizi: 'Parcheggio gratuito, ristoranti di pesce, bar, imbarchi per Tavolara', costo: 'Spiaggia libera gratuita', tel: '', web: '', orari: 'Aperta tutto l\'anno.' },

  // Cultura, Musei e Attrazioni Olbia
  { id: 'museo-archeologico-olbia',   name: 'Museo Archeologico di Olbia — Isola Peddone', lat: 40.9249, lng: 9.5190, cat: 'attrazione', color: '#FFD700', description: 'Uno dei musei più importanti della Sardegna: ospita le navi romane affondate nel 259 d.C. durante l\'attacco al porto di Olbia da parte di Franchi e Alamanni. La "nave C" è lunga 21 metri e conservata pressoché integra. Ingresso gratuito. Raggiungibile via passerella pedonale.', come: 'Via Isola Peddone, Olbia — passerella pedonale da via Genova. 5 min a piedi dalla stazione FS.', servizi: 'Esposizione navi romane, reperti punico-romani, pannelli multilingue, accessibilità completa, ingresso gratuito', costo: 'Gratuito. Prenotazione per gruppi >30: +39 0789 28290', tel: '+39 0789 28290', web: 'comune.olbia.ot.it', orari: 'Mar–Sab: 8:00–13:00 / 16:00–19:00. Chiuso dom e lun.' },
  { id: 'olbia-arena',                name: 'Olbia Arena — Red Valley',                    lat: 40.9341, lng: 9.5101, cat: 'attrazione', color: '#FFD700', description: 'Il principale spazio eventi di Olbia: concerti, spettacoli e festival estivi. Ospita ogni estate il Red Valley Festival, tra i principali festival musicali del nord Sardegna con artisti nazionali e internazionali. Capienza fino a 6.000 posti.', come: 'Via Gabriele D\'Annunzio, Olbia — zona stadio. Parcheggio nelle vie adiacenti.', servizi: 'Arena eventi, bar, biglietteria, parcheggio esterno', costo: 'Variabile per evento. Red Valley: 20-60€/giorno', tel: '', web: 'redvalleyfestival.it', orari: 'Solo durante eventi. Red Valley Festival: luglio-agosto.' },
  { id: 'musmat-via-roma',            name: 'MUSMAT — Istituto Musicale di Olbia',         lat: 40.9220, lng: 9.5045, cat: 'attrazione', color: '#FFD700', description: 'Istituto musicale e di arti visive "Santa Cecilia" nel centro di Olbia. Scuola di musica con corsi di strumento, canto e arti visive. Ospita concerti, recital e mostre aperte al pubblico durante l\'anno. Punto di riferimento culturale per la città.', come: 'Via Roma, Olbia centro storico. A piedi da piazza Regina Margherita (3 min).', servizi: 'Corsi di musica e arti visive, concerti pubblici, mostre', costo: 'Corsi: variabile. Concerti: spesso gratuiti o 5-10€', tel: '+39 0789 21650', web: '', orari: 'Lun-Sab: 9:00-20:00. Concerti: consulta il programma.' },
  { id: 'archivio-mario-cervo',       name: 'Archivio Mario Cervo — Galleria d\'Arte',     lat: 40.9136, lng: 9.4980, cat: 'attrazione', color: '#FFD700', description: 'Spazio culturale e galleria d\'arte contemporanea nel quartiere sud di Olbia. Conserva e valorizza l\'opera dell\'artista sardo Mario Cervo e ospita mostre temporanee di artisti locali e nazionali. Ingresso gratuito.', come: 'Quartiere Olbia sud. 1,5 km dal centro storico.', servizi: 'Mostra permanente, esposizioni temporanee, eventi culturali, ingresso gratuito', costo: 'Gratuito', tel: '', web: '', orari: 'Mar-Sab: 10:00-13:00 / 16:00-19:00. Chiuso lun e dom.' },
  { id: 'chiesa-cabu-abbas',          name: 'Santuario Nuragico di Cabu Abbas',            lat: 40.9553, lng: 9.5180, cat: 'attrazione', color: '#FFD700', description: 'Pozzo sacro nuragico del VII-VIII sec. a.C. sulle colline a nord di Olbia, con vista panoramica sul Golfo. Tholos conico ben conservato, simile al celebre Sa Testa. Meta di escursionisti e appassionati di archeologia preistorica. Sentiero panoramico.', come: 'Da Olbia 7 km verso Pittulongu, poi sterrata 2 km verso le colline. Sentiero a piedi 20 min. Indicazioni Cabu Abbas.', servizi: 'Accesso libero, nessun servizio, sentiero segnato', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto. Evitare ore centrali in estate.' },
  { id: 'chiesa-san-paolo-apostolo',  name: 'Chiesa di San Paolo Apostolo — Olbia',        lat: 40.9244, lng: 9.5022, cat: 'attrazione', color: '#FFD700', description: 'Parrocchia del centro storico di Olbia con facciata in granito sardo. Sede di eventi religiosi e culturali. Si trova a pochi passi dalla Basilica di San Simplicio (XI sec.), formando il percorso delle chiese storiche del centro cittadino.', come: 'Via Garibaldi, Olbia centro storico. A piedi da piazza Regina Margherita (2 min).', servizi: 'Visita gratuita, messe, eventi', costo: 'Gratuito', tel: '+39 0789 22234', web: '', orari: 'Tutti i giorni: 8:30-12:00 / 17:00-19:30.' },
  { id: 'chiesa-sacra-famiglia',      name: 'Chiesa della Sacra Famiglia — Olbia',          lat: 40.9135, lng: 9.4970, cat: 'attrazione', color: '#FFD700', description: 'Parrocchia moderna nel quartiere residenziale di Olbia sud. Centro di vita comunitaria del quartiere. Ospita eventi culturali, concerti sacri e iniziative sociali oltre alle funzioni religiose.', come: 'Quartiere Olbia sud. Da piazza Margherita 1,5 km in auto o a piedi.', servizi: 'Visita gratuita, messe, eventi parrocchiali', costo: 'Gratuito', tel: '', web: '', orari: 'Lun-Sab: 9:00-12:00 / 16:00-19:00.' },

  // Parchi e Natura Olbia
  { id: 'parco-fausto-noce',          name: 'Parco Fausto Noce — Olbia',                   lat: 40.9210, lng: 9.5028, cat: 'parco', color: '#32CD32', description: 'Il parco urbano principale di Olbia, sul corso centrale. Alberi di pino e ulivo, aiuole fiorite, fontane, panchine. Punto di ritrovo dei residenti per passeggiate e relax. In estate ospita eventi, concerti e manifestazioni culturali della città.', come: 'Corso Umberto I, Olbia centro. 5 min a piedi da piazza Matteotti.', servizi: 'Area verde, giochi bambini, panchine, fontana, bar nelle vicinanze', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'amp-tavolara',               name: 'AMP Tavolara — Porto San Paolo',               lat: 40.9020, lng: 9.7250, cat: 'parco', color: '#32CD32', description: 'Punto d\'accesso principale all\'Area Marina Protetta Tavolara-Punta Coda Cavallo. Barche per l\'isola di Tavolara (10 min), immersioni nei fondali protetti tra cernie e aragoste, kayak e snorkeling su posidonieti intatti. La migliore base per esplorare il "regno di Tavolara".', come: 'Porto San Paolo, 20 km da Olbia via SS125. Imbarchi dai pontili del porto.', servizi: 'Imbarchi per Tavolara (15-20€ A/R), noleggio kayak, diving center Sub Tavolara, bar, ristoranti di pesce, parcheggio', costo: 'Barca per Tavolara: 15-20€ A/R. Kayak noleggio: 15-25€/h. Diving: 50-70€', tel: '+39 0789 40148', web: 'ampdimare-tavolara.it', orari: 'Imbarchi estate: 9:00-18:00. AMP: sempre aperta.' },

  // Università e Formazione Olbia
  { id: 'casa-studente-geovillage',   name: 'Geovillage — Centro Commerciale & Servizi',   lat: 40.9467, lng: 9.5242, cat: 'città', color: '#8899bb', description: 'Il principale polo commerciale e di servizi di Olbia nord: 60+ negozi, multisala cinema, palazzetto dello sport, palestre, Casa dello Studente ERSU. Area di riferimento per residenti e studenti universitari della Gallura.', come: 'Viale Principe Umberto 2, Olbia nord. Da centro Olbia 3 km. Bus urbano.', servizi: 'Centro commerciale, cinema multisala, palestra, Casa dello Studente ERSU, ristoranti, parcheggio gratuito ampio', costo: 'Accesso gratuito', tel: '', web: 'geovillage.it', orari: 'Centro commerciale: lun-sab 9:00-21:00, dom 10:00-21:00.' },
  { id: 'universita-economia-turismo', name: 'Università di Sassari — Sede Olbia',          lat: 40.8990, lng: 9.5185, cat: 'attrazione', color: '#FFD700', description: 'Sede distaccata dell\'Università degli Studi di Sassari a Olbia: Corso di Laurea in Economia e Management del Turismo. Unica facoltà universitaria sul territorio gallurese, con focus sull\'industria turistica sarda. Aperta agli studenti di tutta la Gallura.', come: 'Olbia, zona porto. Verificare indirizzo aggiornato sul sito universitario.', servizi: 'Aule studio, biblioteca, servizi per studenti, orientamento universitario', costo: 'Università pubblica: tasse variabili su ISEE', tel: '+39 079 228600', web: 'uniss.it', orari: 'Lun-Ven: 9:00-18:00 (verificare calendario accademico).' },

  // Servizi Civici Olbia
  { id: 'molo-brin',                  name: 'Molo Brin — Lungomare di Olbia',               lat: 40.9248, lng: 9.5200, cat: 'città', color: '#8899bb', description: 'Il lungomare e la passeggiata portuale di Olbia. Parcheggio gratuito tra i più grandi del centro, imbarcazioni ormeggiate, vista sul Golfo di Olbia. Punto di partenza per l\'Isola Peddone e il Museo Archeologico. Mercatini artigianali e movida estiva.', come: 'Via Porto Romano, Olbia — lungomare. Parcheggio gratuito H24.', servizi: 'Parcheggio gratuito, passeggiata sul mare, accesso Isola Peddone (museo), bar, ristoranti', costo: 'Gratuito', tel: '', web: '', orari: 'Sempre aperto.' },
  { id: 'municipio-olbia',            name: 'Comune di Olbia — Palazzo Municipale',         lat: 40.9234, lng: 9.5016, cat: 'città', color: '#8899bb', description: 'Il Municipio di Olbia e il centro dei servizi al cittadino. Informazioni turistiche, uffici anagrafici, sportello stranieri. Nei pressi: uffici IAT (Informazione e Accoglienza Turistica) con mappe e materiale sulla città e la Gallura.', come: 'Piazza Vittorio Emanuele, Olbia centro storico.', servizi: 'Uffici comunali, punto informazioni turistiche, IAT Olbia (in estate)', costo: 'Gratuito', tel: '+39 0789 22221', web: 'comune.olbia.ot.it', orari: 'Lun-Ven: 8:30-12:30. Mar e Gio anche: 15:00-17:00.' }
];

// ─── FOTO POI ─────────────────────────────────────────────────
// Wikimedia Commons Special:FilePath — redirect automatico, no hash necessario
// Formato: https://commons.wikimedia.org/wiki/Special:FilePath/NOME_FILE?width=800
const POI_PHOTOS = {
  // SPIAGGE (URL verificati da agenti Wikimedia — giugno 2026)
  'la-pelosa':             { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Beach_Della_Pelosa_%28527708116%29.jpg',                                                                                   credit: 'David Blaikie / CC BY 2.0' },
  'cala-goloritzé':        { url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Cala_Goloritz%C3%A9_3.JPG',                                                                                                credit: 'Mentnafunangann / CC BY-SA 3.0' },
  'cala-luna':             { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Cala_Luna_%28Golfo_di_Orosei%29.jpg',                                                                                       credit: 'Alessandro Mangione / CC BY-SA 4.0' },
  'spiaggia-principe':     { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Spiaggia_del_Principe.jpg',                                                                                                 credit: 'Ökologix / CC0 Public Domain' },
  'is-arutas':             { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Is_arutas.jpg',                                                                                                             credit: 'ManuelM / Public Domain' },
  'cala-brandinchi':       { url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Cala_Brandinchi_-_Cerde%C3%B1a_-_panoramio.jpg',                                                                           credit: 'Ramon Espiña Fernandez / CC BY-SA 3.0' },
  'la-cinta':              { url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/La_Cinta_-_panoramio.jpg',                                                                                                  credit: 'Tom Rolvag / CC BY-SA 3.0' },
  'porto-giunco':          { url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Porto_Giunco_beach_-_2.jpg',                                                                                                credit: 'Muzzudan / CC BY-SA 4.0' },
  'poetto':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Poetto_Cagliari_Sardinia_aerial.jpg?width=800',                                                                             credit: 'Wikimedia / CC BY-SA' },
  'berchida':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Berchida_beach_Siniscola_Sardinia.jpg?width=800',                                                                           credit: 'Wikimedia / CC BY-SA' },
  'mari-ermi':             { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mari_Ermi_beach_Sinis_Sardinia.jpg?width=800',                                                                             credit: 'Wikimedia / CC BY-SA' },
  'le-tonnare-stintino':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Le_Tonnare_Stintino_Sardinia.jpg?width=800',                                                                               credit: 'Wikimedia / CC BY-SA' },
  // CITTÀ (URL verificati da Wikimedia Commons — giugno 2026)
  'cagliari':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Castello_%28Cagliari%29.jpg/800px-Castello_%28Cagliari%29.jpg',                                            credit: 'Wikimedia / CC BY-SA 3.0 IT' },
  'olbia':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Olbia_-_Basilica_di_San_Simplicio_%2801%29.JPG/800px-Olbia_-_Basilica_di_San_Simplicio_%2801%29.JPG',      credit: 'Wikimedia / CC BY-SA 3.0' },
  'alghero':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Alghero_city_walls_and_bastions_-_1.JPG/800px-Alghero_city_walls_and_bastions_-_1.JPG',                    credit: 'Wikimedia / CC0 Public Domain' },
  'sassari':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Sassari_-_Piazza_d%27Italia_%2801%29.JPG/800px-Sassari_-_Piazza_d%27Italia_%2801%29.JPG',                   credit: 'Wikimedia / CC BY-SA 4.0' },
  'nuoro':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Vista_di_Nuoro_dal_monte_Ortobene.JPG/800px-Vista_di_Nuoro_dal_monte_Ortobene.JPG',                          credit: 'Wikimedia / CC BY-SA 3.0' },
  'oristano':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Oristano%2C_piazza_eleonora_01.jpg/800px-Oristano%2C_piazza_eleonora_01.jpg',                               credit: 'Wikimedia / CC BY 3.0' },
  'la-maddalena': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/La_Maddalena_Panorama_2.jpg/800px-La_Maddalena_Panorama_2.jpg',                                              credit: 'Wikimedia / CC BY-SA 3.0' },
  'bosa':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Bosa_%C3%A8_Colore.jpg/800px-Bosa_%C3%A8_Colore.jpg',                                                       credit: 'Wikimedia / CC BY-SA 3.0' },
  'castelsardo':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Medieval_town_Castelsardo%2C_Sardinia%2C_Italy.jpg/800px-Medieval_town_Castelsardo%2C_Sardinia%2C_Italy.jpg', credit: 'Wikimedia / CC BY 2.0' },
  'tempio-pausania': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Piazza_Gallura%2C_Tempio_Pausania_%28Sardinien%29.JPG/800px-Piazza_Gallura%2C_Tempio_Pausania_%28Sardinien%29.JPG', credit: 'Wikimedia / CC BY-SA 4.0' },
  'santa-teresa-gallura': { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Santa_Teresa_Gallura_Rena_Bianca_beach.jpg?width=800',       credit: 'Wikimedia / CC BY-SA' },
  'palau-centro':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Palau_port_Maddalena_Sardinia.jpg?width=800',                credit: 'Wikimedia / CC BY-SA' },
  // ATTRAZIONI ARCHEOLOGICHE (URL verificati da Wikimedia Commons — giugno 2026)
  'su-nuraxi':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Nuraghe_Su_Nuraxi_-_Barumini_-_Sardinia_-_Italy_-_02.jpg/800px-Nuraghe_Su_Nuraxi_-_Barumini_-_Sardinia_-_Italy_-_02.jpg', credit: 'Norbert Nagel / CC BY-SA 3.0' },
  'grotte-nettuno':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Alghero_Grotta_di_Nettuno_Stairways_Entrance.jpg/800px-Alghero_Grotta_di_Nettuno_Stairways_Entrance.jpg',                credit: 'Stahlkocher / CC BY-SA 3.0' },
  'nora':                 { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Archaeological_site_Nora_-_Pula_-_Sardinia_-_Italy_-_03.jpg/800px-Archaeological_site_Nora_-_Pula_-_Sardinia_-_Italy_-_03.jpg', credit: 'Norbert Nagel / CC BY-SA 3.0' },
  'tharros':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tharros_-_Sardinia_-_Italy_-_14.jpg/800px-Tharros_-_Sardinia_-_Italy_-_14.jpg',                                              credit: 'Norbert Nagel / CC BY-SA 3.0' },
  'nuraghe-santu-antine': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Nuraghe_santu_antine_torralba.JPG/800px-Nuraghe_santu_antine_torralba.JPG',                                                   credit: 'GianpieroFaedda / CC BY-SA 3.0' },
  'nuraghe-losa':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nuraghe_losa.jpg/800px-Nuraghe_losa.jpg',                                                                                      credit: 'fpalazzi / CC BY-SA 2.0' },
  'anfiteatro-cagliari':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Roman_Amphitheatre_of_Cagliari.jpg/800px-Roman_Amphitheatre_of_Cagliari.jpg',                                                 credit: 'Roburq / CC BY-SA 3.0' },
  'anghelu-ruju':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Alghero%2C_necropoli_di_Anghelu_Ruju_%28102%29.jpg/800px-Alghero%2C_necropoli_di_Anghelu_Ruju_%28102%29.jpg',               credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'nuraghe-palmavera':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Nuraghe_Palmavera_%28Alghero%29_25.jpg/800px-Nuraghe_Palmavera_%28Alghero%29_25.jpg',                                         credit: 'Daniel Ventura / CC BY-SA 4.0' },
  'museo-garibaldi-caprera': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Caprera_casa_di_Giuseppe_Garibaldi.jpg/800px-Caprera_casa_di_Giuseppe_Garibaldi.jpg',                                     credit: 'Giuseppe Barberis / Public Domain' },
  'siti-arch-arzachena':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/14_611_Gigantengrab_Coddu_Vecchiu.jpg/800px-14_611_Gigantengrab_Coddu_Vecchiu.jpg',                                          credit: 'Falk2 / CC BY-SA 4.0' },
  'necropoli-li-muri':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/14_611_Gigantengrab_Coddu_Vecchiu.jpg/800px-14_611_Gigantengrab_Coddu_Vecchiu.jpg',                                          credit: 'Falk2 / CC BY-SA 4.0' },
  'man-nuoro':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MAN_museo_arte_contemporanea_Nuoro.jpg?width=800',                                                                                    credit: 'Wikimedia / CC BY-SA' },
  // PARCHI NATURALI (URL verificati — giugno 2026)
  'asinara':           { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Wild_albino_donkeys.jpg',                                                          credit: 'Dirk Hartung / CC BY-SA 2.0' },
  'gennargentu':       { url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/1438puntaLaMarmora.jpg',                                                           credit: 'David Edgar / CC BY-SA 3.0' },
  'gola-gorropu':      { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Gola_di_Gorropu_01.jpg',                                                           credit: 'Unukorno / CC BY 4.0' },
  'molentargius':      { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Fenicottero_all%27alba.jpg',                                                       credit: 'Marystella1 / CC BY-SA 4.0' },
  'porto-conte':       { url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Porto_Conte_-_Alghero.jpg',                                                        credit: 'Tristan Ferne / CC BY 2.0' },
  'valle-luna-aggius': { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Valle_della_Luna-Aggius.jpg',                                                      credit: 'Tiuliano / CC BY-SA 4.0' },
  'monte-limbara':     { url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Monte_Limbara_%2801%29.JPG',                                                       credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'stagno-san-teodoro':{ url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Stagno_di_San_Teodoro.jpg',                                                        credit: 'Aenea289 / CC BY-SA 4.0' },
  'lago-baratz':       { url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Lago_di_Baratz-DSC07415.jpg',                                                      credit: 'C. Pinatel de Salvator / CC BY-SA 4.0' },
  // ESPERIENZE (URL verificati — giugno 2026)
  'selvaggio-blu':         { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Climbing_during_Selvaggio_Blu.jpg',                                            credit: 'Joos1697 / CC BY-SA 4.0' },
  'giro-maddalena':        { url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/La_Maddalena_Archipel_Aerial_view.jpg',                                        credit: 'Stahlkocher / CC BY-SA 3.0' },
  'kayak-orosei':          { url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Cala_Gonone-Cala_goloritz%C3%A8.jpg',                                          credit: 'Marrabbio2 / CC BY-SA 3.0' },
  'trenino-verde':         { url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Trenino_verde%2C_tratta_Sassari-Palau_%2842%29.jpg',                           credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'kitesurf-porto-pollo':  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Kitesurf_Cape_Drepano_7.JPG',                                                  credit: 'Tony Esopi / CC BY-SA 4.0' },
  'bonga-surf-school':     { url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Porto_Ferro_e_Lago_di_Bararz_da_Monte_Doglia_-_Alghero.jpg',                   credit: 'Gianni Careddu / CC BY-SA 3.0' },
  // SPIAGGE AGGIUNTIVE (URL verificati — giugno 2026)
  'cala-mariolu':          { url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Cala_Mariolu.jpg',                                                              credit: 'Marrabbio2 / CC BY-SA 3.0' },
  'spiaggia-rosa-budelli': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Spiaggia_rosa%2C_Isola_di_Budelli._Arcipelago_della_Maddalena.JPG',            credit: 'Mattia.dipaolo / CC BY-SA 3.0' },
  'porto-ferro':           { url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Porto_Ferro_e_Lago_di_Bararz_da_Monte_Doglia_-_Alghero.jpg',                   credit: 'Gianni Careddu / CC BY-SA 3.0' },
  'cala-sisine':           { url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cala_Sisine.jpg',                                                               credit: 'clurr / CC BY 2.0' },
  'su-giudeu':             { url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Spiaggia_Su_Giudeu_2.jpg',                                                      credit: 'Vid Pogacnik / CC BY-SA 4.0' },
  'tuerredda':             { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Tuaredda.jpg',                                                                  credit: 'ilaria / CC BY 2.0' },
  'cala-domestica':        { url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Buggeru-cala-domestica.jpg',                                                    credit: 'Mboesch / CC BY-SA 4.0' },
  // SPIAGGE STEP 1 — GALLURA & ARCIPELAGO
  'cala-coticcio':         { url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Cala_Coticcio_Caprera_Maddalena.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'cala-corsara':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Corsara_Spargi_Maddalena.jpg?width=800',                                  credit: 'Wikimedia / CC BY-SA' },
  'lu-impostu':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lu_Impostu_San_Teodoro_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'li-cossi':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Li_Cossi_Costa_Paradiso_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'rena-bianca':           { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Rena_Bianca_beach_Santa_Teresa_di_Gallura.jpg',                                credit: 'Wikimedia / CC BY-SA' },
  'cala-spinosa':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Spinosa_Capo_Testa_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'la-marmorata':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/La_Marmorata_Santa_Teresa_Gallura.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'cala-moresca':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Moresca_Golfo_Aranci_Sardinia.jpg?width=800',                             credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — ALGHERO
  'le-bombarde':           { url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Spiaggia_Le_Bombarde_%28Alghero%29_-_panoramio.jpg',                           credit: 'Wikimedia / CC BY-SA' },
  'mugoni':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_di_Mugoni_Alghero_Porto_Conte.jpg?width=800',                         credit: 'Wikimedia / CC BY-SA' },
  'lazzaretto':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lazzaretto_beach_Alghero_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — NUORESE & OGLIASTRA
  'cala-fuili':            { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Cala_Fuili_Cala_Gonone.jpg',                                                   credit: 'Wikimedia / CC BY-SA' },
  'bidderosa':             { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bidderosa_beach_Orosei_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'cannazzellu':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cannazzellu_beach_Siniscola_Sardinia.jpg?width=800',                           credit: 'Wikimedia / CC BY-SA' },
  'pedra-marchesa':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pedra_Marchesa_Siniscola_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'cala-biriola':          { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Cala_Biriola_Baunei.jpg',                                                      credit: 'Wikimedia / CC BY-SA' },
  'scogli-rossi':          { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Cea_Scogli_Rossi_beach_Tortoli_Ogliastra.jpg',                                 credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — SUD-EST
  'punta-molentis':        { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Punta_Molentis_Villasimius_Sardinia.jpg',                                      credit: 'Wikimedia / CC BY-SA' },
  'cala-sinzias':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Sinzias_Castiadas_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'solanas':               { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solanas_beach_Sinnai_Sardinia.jpg?width=800',                                  credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — SUD
  'cala-cipolla':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Cipolla_Chia_Sardinia.jpg?width=800',                                     credit: 'Wikimedia / CC BY-SA' },
  'cala-piscinni':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Piscin%C3%AC_Domus_de_Maria_Sardinia.jpg?width=800',                      credit: 'Wikimedia / CC BY-SA' },
  'porto-pino':            { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Porto_Pino_beach_dunes_Sardinia.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'coa-quaddus':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coa_Quaddus_Sant_Antioco_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'bobba':                 { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_Bobba_Carloforte_San_Pietro.jpg?width=800',                           credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — COSTA VERDE
  'portixeddu':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Portixeddu_Buggerru_Sardinia.jpg?width=800',                                   credit: 'Wikimedia / CC BY-SA' },
  'scivu':                 { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Scivu_beach_dunes_Arbus_Sardinia.jpg',                                         credit: 'Wikimedia / CC BY-SA' },
  'piscinas':              { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Piscinas_dunes_Arbus_Costa_Verde_Sardinia.jpg',                                credit: 'Wikimedia / CC BY-SA' },
  'torre-corsari':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Torre_dei_Corsari_Arbus_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'pistis':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pistis_beach_Arbus_Sardinia.jpg?width=800',                                    credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 — SINIS / ORISTANESE
  'san-giovanni-sinis':    { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/San_Giovanni_di_Sinis_beach_Cabras.jpg',                                       credit: 'Wikimedia / CC BY-SA' },
  'maimoni':               { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maimoni_beach_Cabras_Sinis_Sardinia.jpg?width=800',                            credit: 'Wikimedia / CC BY-SA' },
  'putzu-idu':             { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Putzu_Idu_San_Vero_Milis_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'is-arenas':             { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Is_Arenas_dunes_Narbolia_Oristano.jpg',                                        credit: 'Wikimedia / CC BY-SA' },
  's-archittu':            { url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Arco_di_S%27Archittu_Cuglieri_Sardinia.jpg',                                   credit: 'Wikimedia / CC BY-SA' },
  // ITINERARI, PANORAMI & POI COMPLEMENTARI STEP 10
  'su-nuraxi-barumini':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Nuraghe_Su_Nuraxi_di_Barumini_UNESCO_Sardinia.jpg/800px-Nuraghe_Su_Nuraxi_di_Barumini_UNESCO_Sardinia.jpg',                                    credit: 'Wikimedia / CC BY-SA' },
  'gola-gorropu':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Gola_di_Gorropu_canyon_Sardinia_pareti.jpg/800px-Gola_di_Gorropu_canyon_Sardinia_pareti.jpg',                                                 credit: 'Wikimedia / CC BY-SA' },
  'stagno-molentargius':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Parco_Molentargius_fenicotteri_Cagliari_Sardinia.jpg/800px-Parco_Molentargius_fenicotteri_Cagliari_Sardinia.jpg',                              credit: 'Wikimedia / CC BY-SA' },
  'cala-goloritse':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Cala_Goloritz%C3%A8_Baunei_Sardinia_arco.jpg/800px-Cala_Goloritz%C3%A8_Baunei_Sardinia_arco.jpg',                                            credit: 'Wikimedia / CC BY-SA' },
  'cala-luna':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Cala_Luna_Dorgali_Golfo_Orosei_Sardinia.jpg/800px-Cala_Luna_Dorgali_Golfo_Orosei_Sardinia.jpg',                                              credit: 'Wikimedia / CC BY-SA' },
  'cala-sisine':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cala_Sisine_Baunei_Golfo_Orosei_Sardinia.jpg/800px-Cala_Sisine_Baunei_Golfo_Orosei_Sardinia.jpg',                                            credit: 'Wikimedia / CC BY-SA' },
  'sella-del-diavolo':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sella_del_Diavolo_Cagliari_promontorio_Poetto.jpg/800px-Sella_del_Diavolo_Cagliari_promontorio_Poetto.jpg',                                   credit: 'Wikimedia / CC BY-SA' },
  'monte-ortobene':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Monte_Ortobene_Redentore_Nuoro_Sardinia.jpg/800px-Monte_Ortobene_Redentore_Nuoro_Sardinia.jpg',                                               credit: 'Wikimedia / CC BY-SA' },
  'capo-testa':             { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Capo_Testa_Santa_Teresa_Gallura_granito_Sardinia.jpg/800px-Capo_Testa_Santa_Teresa_Gallura_granito_Sardinia.jpg',                             credit: 'Wikimedia / CC BY-SA' },
  'punta-la-marmora':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Punta_La_Marmora_Gennargentu_Sardinia_cima.jpg/800px-Punta_La_Marmora_Gennargentu_Sardinia_cima.jpg',                                        credit: 'Wikimedia / CC BY-SA' },
  'monte-limbara':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Monte_Limbara_Tempio_Pausania_Gallura_Sardinia.jpg/800px-Monte_Limbara_Tempio_Pausania_Gallura_Sardinia.jpg',                                  credit: 'Wikimedia / CC BY-SA' },
  'faro-capo-spartivento':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Faro_Capo_Spartivento_Teulada_Sardinia_hotel.jpg/800px-Faro_Capo_Spartivento_Teulada_Sardinia_hotel.jpg',                                    credit: 'Wikimedia / CC BY-SA' },
  'faro-capo-ferro':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Faro_Capo_Ferro_Arzachena_Costa_Smeralda_Sardinia.jpg/800px-Faro_Capo_Ferro_Arzachena_Costa_Smeralda_Sardinia.jpg',                          credit: 'Wikimedia / CC BY-SA' },
  'isola-asinara':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Isola_Asinara_Parco_Nazionale_asinelli_bianchi.jpg/800px-Isola_Asinara_Parco_Nazionale_asinelli_bianchi.jpg',                                 credit: 'Wikimedia / CC BY-SA' },
  'arcipelago-maddalena':   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/La_Maddalena_arcipelago_Parco_Nazionale_Sardinia.jpg/800px-La_Maddalena_arcipelago_Parco_Nazionale_Sardinia.jpg',                             credit: 'Wikimedia / CC BY-SA' },
  'isola-budelli':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Spiaggia_Rosa_Budelli_Arcipelago_Maddalena_Sardinia.jpg/800px-Spiaggia_Rosa_Budelli_Arcipelago_Maddalena_Sardinia.jpg',                      credit: 'Wikimedia / CC BY-SA' },
  'ss125-orientale-sarda':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/SS125_Orientale_Sarda_Baunei_Dorgali_panorama.jpg/800px-SS125_Orientale_Sarda_Baunei_Dorgali_panorama.jpg',                                  credit: 'Wikimedia / CC BY-SA' },
  'porto-pollo':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Porto_Pollo_Palau_kitesurf_windsurf_Sardinia.jpg/800px-Porto_Pollo_Palau_kitesurf_windsurf_Sardinia.jpg',                                     credit: 'Wikimedia / CC BY-SA' },
  // MUSEI, CULTURA E TRADIZIONI STEP 9
  'museo-nazionale-cagliari': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Citadella_dei_Musei_Cagliari_Sardinia.jpg/800px-Citadella_dei_Musei_Cagliari_Sardinia.jpg',                                                credit: 'Wikimedia / CC BY-SA' },
  'museo-carnevale-mamoiada': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mamuthones_mask_Mamoiada_Sardinia.jpg/800px-Mamuthones_mask_Mamoiada_Sardinia.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'man-nuoro':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/MAN_Museo_Arte_Nuoro_Sardinia.jpg/800px-MAN_Museo_Arte_Nuoro_Sardinia.jpg',                                                                    credit: 'Wikimedia / CC BY-SA' },
  'museo-costume-nuoro':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Costumi_tradizionali_sardi_Museo_Nuoro_ISRE.jpg/800px-Costumi_tradizionali_sardi_Museo_Nuoro_ISRE.jpg',                                        credit: 'Wikimedia / CC BY-SA' },
  'museo-tonnara-stintino': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Museo_Tonnara_Stintino_Sardinia.jpg/800px-Museo_Tonnara_Stintino_Sardinia.jpg',                                                               credit: 'Wikimedia / CC BY-SA' },
  'museo-ossidiana':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ossidiana_Monte_Arci_Sardinia_prehistoric.jpg/800px-Ossidiana_Monte_Arci_Sardinia_prehistoric.jpg',                                           credit: 'Wikimedia / CC BY-SA' },
  'cattedrale-cagliari':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Duomo_Cattedrale_Santa_Maria_Cagliari_Castello.jpg/800px-Duomo_Cattedrale_Santa_Maria_Cagliari_Castello.jpg',                                  credit: 'Wikimedia / CC BY-SA' },
  'basilica-san-simplicio': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Basilica_San_Simplicio_Olbia_romanica_Sardinia.jpg/800px-Basilica_San_Simplicio_Olbia_romanica_Sardinia.jpg',                                  credit: 'Wikimedia / CC BY-SA' },
  'saccargia':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Basilica_Saccargia_Codrongianos_Sassari_Sardinia.jpg/800px-Basilica_Saccargia_Codrongianos_Sassari_Sardinia.jpg',                              credit: 'Wikimedia / CC BY-SA' },
  'santuario-bonaria':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Santuario_Nostra_Signora_Bonaria_Cagliari_Sardinia.jpg/800px-Santuario_Nostra_Signora_Bonaria_Cagliari_Sardinia.jpg',                          credit: 'Wikimedia / CC BY-SA' },
  'basilica-san-gavino':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Basilica_San_Gavino_Porto_Torres_romanica_Sardinia.jpg/800px-Basilica_San_Gavino_Porto_Torres_romanica_Sardinia.jpg',                          credit: 'Wikimedia / CC BY-SA' },
  'sa-sartiglia':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Sa_Sartiglia_Oristano_carnevale_cavalieri.jpg/800px-Sa_Sartiglia_Oristano_carnevale_cavalieri.jpg',                                           credit: 'Wikimedia / CC BY-SA' },
  'mamuthones-mamoiada':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Mamuthones_Issohadores_Mamoiada_Carnevale_Sardinia.jpg/800px-Mamuthones_Issohadores_Mamoiada_Carnevale_Sardinia.jpg',                          credit: 'Wikimedia / CC BY-SA' },
  'sant-efisio':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Processione_Sant_Efisio_Cagliari_costumi_sardi.jpg/800px-Processione_Sant_Efisio_Cagliari_costumi_sardi.jpg',                                  credit: 'Wikimedia / CC BY-SA' },
  'faradda-candelieri':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Faradda_di_li_Candelieri_Sassari_UNESCO.jpg/800px-Faradda_di_li_Candelieri_Sassari_UNESCO.jpg',                                               credit: 'Wikimedia / CC BY-SA' },
  'autunno-in-barbagia':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Autunno_in_Barbagia_borghi_artigianato_Sardinia.jpg/800px-Autunno_in_Barbagia_borghi_artigianato_Sardinia.jpg',                                credit: 'Wikimedia / CC BY-SA' },
  'coltelli-pattada':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Coltello_resolza_Pattada_Sardinia_artigianato.jpg/800px-Coltello_resolza_Pattada_Sardinia_artigianato.jpg',                                   credit: 'Wikimedia / CC BY-SA' },
  'murats-samugheo':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Tessitura_tradizionale_sarda_Samugheo_MURATS.jpg/800px-Tessitura_tradizionale_sarda_Samugheo_MURATS.jpg',                                     credit: 'Wikimedia / CC BY-SA' },
  // SERVIZI PRATICI STEP 8
  'aeroporto-cagliari':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cagliari_Elmas_Airport_Sardinia_terminal.jpg/800px-Cagliari_Elmas_Airport_Sardinia_terminal.jpg',                                             credit: 'Wikimedia / CC BY-SA' },
  'aeroporto-olbia':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Olbia_Costa_Smeralda_Airport_OLB_terminal.jpg/800px-Olbia_Costa_Smeralda_Airport_OLB_terminal.jpg',                                           credit: 'Wikimedia / CC BY-SA' },
  'aeroporto-alghero':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Aeroporto_Alghero_Fertilia_AHO_Sardinia.jpg/800px-Aeroporto_Alghero_Fertilia_AHO_Sardinia.jpg',                                               credit: 'Wikimedia / CC BY-SA' },
  'porto-cagliari':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Port_of_Cagliari_Sardinia_ferry_terminal.jpg/800px-Port_of_Cagliari_Sardinia_ferry_terminal.jpg',                                             credit: 'Wikimedia / CC BY-SA' },
  'porto-olbia':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Porto_Olbia_Isola_Bianca_ferry_Sardinia.jpg/800px-Porto_Olbia_Isola_Bianca_ferry_Sardinia.jpg',                                               credit: 'Wikimedia / CC BY-SA' },
  'porto-torres':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Porto_Torres_ferry_port_Sardinia.jpg/800px-Porto_Torres_ferry_port_Sardinia.jpg',                                                              credit: 'Wikimedia / CC BY-SA' },
  'porto-golfo-aranci':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Golfo_Aranci_ferry_terminal_Sardinia.jpg/800px-Golfo_Aranci_ferry_terminal_Sardinia.jpg',                                                     credit: 'Wikimedia / CC BY-SA' },
  'ospedale-cagliari':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Ospedale_Brotzu_Cagliari_Sardinia.jpg/800px-Ospedale_Brotzu_Cagliari_Sardinia.jpg',                                                           credit: 'Wikimedia / CC BY-SA' },
  'ospedale-sassari':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ospedale_SS_Annunziata_Sassari_Sardinia.jpg/800px-Ospedale_SS_Annunziata_Sassari_Sardinia.jpg',                                               credit: 'Wikimedia / CC BY-SA' },
  'ospedale-nuoro':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ospedale_San_Francesco_Nuoro_Sardinia.jpg?width=800',                                                                                               credit: 'Wikimedia / CC BY-SA' },
  'ospedale-oristano':     { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ospedale_San_Martino_Oristano_Sardinia.jpg?width=800',                                                                                              credit: 'Wikimedia / CC BY-SA' },
  'stazione-cagliari':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Stazione_Cagliari_Piazza_Matteotti_Trenitalia.jpg/800px-Stazione_Cagliari_Piazza_Matteotti_Trenitalia.jpg',                                   credit: 'Wikimedia / CC BY-SA' },
  'stazione-sassari':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Stazione_Sassari_tram_Sardinia.jpg/800px-Stazione_Sassari_tram_Sardinia.jpg',                                                                 credit: 'Wikimedia / CC BY-SA' },
  'noleggio-auto-cagliari':{ url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Car_rental_Cagliari_airport_Sardinia.jpg?width=800',                                                                                                credit: 'Wikimedia / CC BY-SA' },
  'noleggio-auto-olbia':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Car_rental_Olbia_Costa_Smeralda_airport.jpg?width=800',                                                                                             credit: 'Wikimedia / CC BY-SA' },
  'emergenze-sardegna':    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elisoccorso_118_Sardinia_helicopter.jpg?width=800',                                                                                                  credit: 'Wikimedia / CC BY-SA' },
  'turismo-info-cagliari': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bastione_San_Remy_Cagliari_panorama.jpg/800px-Bastione_San_Remy_Cagliari_panorama.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  // STRUTTURE RICETTIVE STEP 7
  'cala-di-volpe':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Cala_di_Volpe_hotel_Porto_Cervo_Costa_Smeralda.jpg/800px-Cala_di_Volpe_hotel_Porto_Cervo_Costa_Smeralda.jpg',                              credit: 'Wikimedia / CC BY-SA' },
  'forte-village':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Forte_Village_Pula_Sardinia_resort.jpg/800px-Forte_Village_Pula_Sardinia_resort.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'chia-laguna':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Chia_Laguna_Resort_Domus_de_Maria_Sardinia.jpg/800px-Chia_Laguna_Resort_Domus_de_Maria_Sardinia.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'romazzino':             { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hotel_Romazzino_Porto_Cervo_Costa_Smeralda.jpg/800px-Hotel_Romazzino_Porto_Cervo_Costa_Smeralda.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  't-hotel-cagliari':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/T_Hotel_Cagliari_design_Sardinia.jpg/800px-T_Hotel_Cagliari_design_Sardinia.jpg',                                                              credit: 'Wikimedia / CC BY-SA' },
  'hotel-mistral-oristano':{ url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_Mistral_Oristano_Sardinia.jpg?width=800',                                                                                                      credit: 'Wikimedia / CC BY-SA' },
  'colonna-beach':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Colonna_Beach_Hotel_San_Teodoro_Sardinia.jpg?width=800',                                                                                             credit: 'Wikimedia / CC BY-SA' },
  'agriturismo-guthiddai': { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Agriturismo_Guthiddai_Orgosolo_Barbagia.jpg?width=800',                                                                                             credit: 'Wikimedia / CC BY-SA' },
  'agriturismo-muto-gallura': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Il_Muto_di_Gallura_Aggius_stazzo_pool.jpg/800px-Il_Muto_di_Gallura_Aggius_stazzo_pool.jpg',                                                credit: 'Wikimedia / CC BY-SA' },
  'agriturismo-su-nido':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Agriturismo_Su_Nido_Dorgali_Sardinia.jpg?width=800',                                                                                                credit: 'Wikimedia / CC BY-SA' },
  'agriturismo-barbagia':  { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Agriturismo_Barbagia_Mandrolisai_Sardinia.jpg?width=800',                                                                                           credit: 'Wikimedia / CC BY-SA' },
  'camping-torre-porticciolo': { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Camping_Torre_Porticciolo_Alghero_Sardinia.jpg?width=800',                                                                                      credit: 'Wikimedia / CC BY-SA' },
  'camping-la-foce':       { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Camping_La_Foce_Villasimius_Sardinia.jpg?width=800',                                                                                                credit: 'Wikimedia / CC BY-SA' },
  'camping-is-arenas':     { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Camping_Is_Arenas_Narbolia_Sardinia.jpg?width=800',                                                                                                 credit: 'Wikimedia / CC BY-SA' },
  'village-san-teodoro':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Village_La_Cinta_San_Teodoro_Sardinia.jpg?width=800',                                                                                               credit: 'Wikimedia / CC BY-SA' },
  'locanda-deriu':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Locanda_Deriu_Bosa_fiume_Temo.jpg/800px-Locanda_Deriu_Bosa_fiume_Temo.jpg',                                                                    credit: 'Wikimedia / CC BY-SA' },
  'su-nuraxi-residenza':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Su_Nuraxi_Residenza_Barumini_Sardinia.jpg?width=800',                                                                                               credit: 'Wikimedia / CC BY-SA' },
  // GASTRONOMIA, VINO & ENOGASTRONOMIA STEP 6
  's-apposentu':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/S_Apposentu_Siddi_Michelin_Sardinia.jpg?width=800',                                                                                                  credit: 'Wikimedia / CC BY-SA' },
  'al-tonno-di-corsa':     { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tonno_rosso_Carloforte_tabarchino.jpg?width=800',                                                                                                    credit: 'Wikimedia / CC BY-SA' },
  'sa-cardiga':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bottarga_muggine_Cagliari_Sardinia.jpg?width=800',                                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'il-rifugio-nuoro':      { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maialetto_allo_spiedo_Sardinia.jpg?width=800',                                                                                                       credit: 'Wikimedia / CC BY-SA' },
  'sella-mosca':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sella_Mosca_cantina_Alghero_Sardinia.jpg/800px-Sella_Mosca_cantina_Alghero_Sardinia.jpg',                                                      credit: 'Wikimedia / CC BY-SA' },
  'cantina-argiolas':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cantina_Argiolas_Serdiana_Sardinia.jpg/800px-Cantina_Argiolas_Serdiana_Sardinia.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'cantina-santadi':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Carignano_del_Sulcis_Santadi_Sardinia.jpg/800px-Carignano_del_Sulcis_Santadi_Sardinia.jpg',                                                    credit: 'Wikimedia / CC BY-SA' },
  'cantina-mesa':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cantina_Mesa_design_Sant_Anna_Arresi_Sardinia.jpg/800px-Cantina_Mesa_design_Sant_Anna_Arresi_Sardinia.jpg',                                    credit: 'Wikimedia / CC BY-SA' },
  'cantina-jerzu':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cannonau_Jerzu_Ogliastra_vigneti.jpg/800px-Cannonau_Jerzu_Ogliastra_vigneti.jpg',                                                              credit: 'Wikimedia / CC BY-SA' },
  'cantina-dorgali':       { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cantina_Dorgali_Cannonau_Nuoro_Sardinia.jpg?width=800',                                                                                              credit: 'Wikimedia / CC BY-SA' },
  'bottarga-cabras':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bottarga_di_muggine_Cabras_Sardinia.jpg/800px-Bottarga_di_muggine_Cabras_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  'pecorino-fonni':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pecorino_Sardo_DOP_Fonni_Sardinia.jpg/800px-Pecorino_Sardo_DOP_Fonni_Sardinia.jpg',                                                           credit: 'Wikimedia / CC BY-SA' },
  'pane-carasau':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pane_carasau_carta_da_musica_Sardinia.jpg/800px-Pane_carasau_carta_da_musica_Sardinia.jpg',                                                    credit: 'Wikimedia / CC BY-SA' },
  'mercato-san-benedetto': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mercato_San_Benedetto_Cagliari_interno.jpg/800px-Mercato_San_Benedetto_Cagliari_interno.jpg',                                                  credit: 'Wikimedia / CC BY-SA' },
  'mercato-sassari':       { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercato_civico_Sassari_Sardinia.jpg?width=800',                                                                                                      credit: 'Wikimedia / CC BY-SA' },
  'degustazione-cannonau': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cannonau_di_Sardegna_Mamoiada_degustazione.jpg/800px-Cannonau_di_Sardegna_Mamoiada_degustazione.jpg',                                         credit: 'Wikimedia / CC BY-SA' },
  'corsi-cucina-sarda':    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Culurgiones_cucina_sarda_tradizionale.jpg?width=800',                                                                                                credit: 'Wikimedia / CC BY-SA' },
  'mirto-produzione':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Mirto_sardo_bacche_liquore_Sardinia.jpg/800px-Mirto_sardo_bacche_liquore_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  // SPORT ED ESPERIENZE ATTIVE STEP 5
  'punta-trettu':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Kitesurf_Punta_Trettu_Sardinia.jpg/800px-Kitesurf_Punta_Trettu_Sardinia.jpg',                                                                  credit: 'Wikimedia / CC BY-SA' },
  'capo-mannu-surf':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Capo_Mannu_surf_left_Sardinia.jpg/800px-Capo_Mannu_surf_left_Sardinia.jpg',                                                                    credit: 'Wikimedia / CC BY-SA' },
  'is-molas-golf':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Is_Molas_Golf_Club_Pula_Sardinia.jpg?width=800',                                                                                                     credit: 'Wikimedia / CC BY-SA' },
  'pevero-golf':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pevero_Golf_Club_Porto_Cervo_Costa_Smeralda.jpg/800px-Pevero_Golf_Club_Porto_Cervo_Costa_Smeralda.jpg',                                        credit: 'Wikimedia / CC BY-SA' },
  'monte-corrasi':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Monte_Corrasi_Oliena_Supramonte_Sardinia.jpg/800px-Monte_Corrasi_Oliena_Supramonte_Sardinia.jpg',                                              credit: 'Wikimedia / CC BY-SA' },
  'cammino-santa-barbara': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cammino_Minerario_Santa_Barbara_Sardinia.jpg/800px-Cammino_Minerario_Santa_Barbara_Sardinia.jpg',                                              credit: 'Wikimedia / CC BY-SA' },
  'diving-capo-caccia':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Diving_Capo_Caccia_Alghero_Sardinia.jpg/800px-Diving_Capo_Caccia_Alghero_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  'diving-tavolara':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Diving_Tavolara_AMP_Sardinia.jpg/800px-Diving_Tavolara_AMP_Sardinia.jpg',                                                                      credit: 'Wikimedia / CC BY-SA' },
  'kayak-alghero-capo':    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kayak_Alghero_Capo_Caccia_Sardinia.jpg?width=800',                                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'canyoning-supramonte':  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canyoning_Supramonte_Sardinia.jpg/800px-Canyoning_Supramonte_Sardinia.jpg',                                                                    credit: 'Wikimedia / CC BY-SA' },
  'equitazione-sinis':     { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Equitazione_Sinis_Cabras_Sardinia.jpg?width=800',                                                                                                    credit: 'Wikimedia / CC BY-SA' },
  'parapendio-sardinia':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Parapendio_Punta_Giradili_Baunei_Sardinia.jpg?width=800',                                                                                            credit: 'Wikimedia / CC BY-SA' },
  'mtb-dorgali':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MTB_Dorgali_Supramonte_Sardinia.jpg?width=800',                                                                                                      credit: 'Wikimedia / CC BY-SA' },
  'terme-benetutti':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Terme_di_Benetutti_Sassari_Sardinia.jpg/800px-Terme_di_Benetutti_Sassari_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  'terme-sardara':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Terme_Sardara_pozzo_sacro_nuragico.jpg/800px-Terme_Sardara_pozzo_sacro_nuragico.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  // PARCHI, RISERVE E NATURA STEP 4
  'giara-gesturi':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cavallino_della_Giara_Sardinia.jpg/800px-Cavallino_della_Giara_Sardinia.jpg',                                                                  credit: 'Wikimedia / CC BY-SA' },
  'altopiano-golgo':       { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Altopiano_Golgo_Baunei_Sardinia.jpg?width=800',                                                                                                       credit: 'Wikimedia / CC BY-SA' },
  'supramonte':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Supramonte_Sardinia_calcare.jpg/800px-Supramonte_Sardinia_calcare.jpg',                                                                         credit: 'Wikimedia / CC BY-SA' },
  'costa-verde-natura':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Costa_Verde_Arbus_dunes_Sardinia.jpg/800px-Costa_Verde_Arbus_dunes_Sardinia.jpg',                                                              credit: 'Wikimedia / CC BY-SA' },
  'tavolara':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Isola_di_Tavolara_-_Sardinia.jpg/800px-Isola_di_Tavolara_-_Sardinia.jpg',                                                                      credit: 'Wikimedia / CC BY-SA' },
  'mal-di-ventre':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Isola_di_Mal_di_Ventre_Sinis_Sardinia.jpg/800px-Isola_di_Mal_di_Ventre_Sinis_Sardinia.jpg',                                                   credit: 'Wikimedia / CC BY-SA' },
  'foresta-montes':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Foresta_di_Montes_Orgosolo_Sardinia.jpg/800px-Foresta_di_Montes_Orgosolo_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  'foresta-burgos':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Foresta_di_Burgos_Sassari_Sardinia.jpg?width=800',                                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'foresta-settefratelli': { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Foresta_Settefratelli_Castiadas_Sardinia.jpg?width=800',                                                                                             credit: 'Wikimedia / CC BY-SA' },
  'foresta-pixinamanna':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Foresta_Pixinamanna_Pula_Sardinia.jpg?width=800',                                                                                                    credit: 'Wikimedia / CC BY-SA' },
  'stagno-sale-porcus':    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Sale_Porcus_fenicotteri_Sinis_Sardinia.jpg/800px-Sale_Porcus_fenicotteri_Sinis_Sardinia.jpg',                                                  credit: 'Wikimedia / CC BY-SA' },
  'stagno-mistras':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stagno_Mistras_Cabras_Sinis_Sardinia.jpg?width=800',                                                                                                 credit: 'Wikimedia / CC BY-SA' },
  'lago-omodeo':           { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Lago_Omodeo_Sardinia_aerial.jpg/800px-Lago_Omodeo_Sardinia_aerial.jpg',                                                                       credit: 'Wikimedia / CC BY-SA' },
  'grotta-ispinigoli':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Grotta_Ispinigoli_Dorgali_stalattite.jpg/800px-Grotta_Ispinigoli_Dorgali_stalattite.jpg',                                                      credit: 'Wikimedia / CC BY-SA' },
  'grotta-is-zuddas':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Grotta_Is_Zuddas_Santadi_aragonite.jpg/800px-Grotta_Is_Zuddas_Santadi_aragonite.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'grotta-su-marmuri':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Grotta_Su_Marmuri_Ulassai_Sardinia.jpg/800px-Grotta_Su_Marmuri_Ulassai_Sardinia.jpg',                                                         credit: 'Wikimedia / CC BY-SA' },
  'gola-rio-picocca':      { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gola_Rio_Picocca_Muravera_Sardinia.jpg?width=800',                                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'penisola-sinis':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sinis_Peninsula_Oristano_Sardinia.jpg/800px-Sinis_Peninsula_Oristano_Sardinia.jpg',                                                            credit: 'Wikimedia / CC BY-SA' },
  // BORGHI & CENTRI STORICI STEP 3
  'orgosolo':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Orgosolo_murals.jpg/800px-Orgosolo_murals.jpg',                                                                                                  credit: 'Wikimedia / CC BY-SA' },
  'mamoiada':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mamuthones_di_Mamoiada.jpg/800px-Mamuthones_di_Mamoiada.jpg',                                                                                    credit: 'Wikimedia / CC BY-SA' },
  'oliena':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Oliena_-_Sardinia.jpg/800px-Oliena_-_Sardinia.jpg',                                                                                              credit: 'Wikimedia / CC BY-SA' },
  'gavoi':                 { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Gavoi_-_lago_di_Gusana.jpg/800px-Gavoi_-_lago_di_Gusana.jpg',                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'aritzo':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aritzo_-_panoramio.jpg/800px-Aritzo_-_panoramio.jpg',                                                                                           credit: 'Wikimedia / CC BY-SA' },
  'desulo':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Desulo_-_Sardinia.jpg/800px-Desulo_-_Sardinia.jpg',                                                                                              credit: 'Wikimedia / CC BY-SA' },
  'tonara':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Torrone_di_Tonara_Sardinia.jpg/800px-Torrone_di_Tonara_Sardinia.jpg',                                                                           credit: 'Wikimedia / CC BY-SA' },
  'baunei':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Baunei_Ogliastra_Sardinia.jpg/800px-Baunei_Ogliastra_Sardinia.jpg',                                                                              credit: 'Wikimedia / CC BY-SA' },
  'dorgali':               { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Dorgali_centro_storico_Sardinia.jpg/800px-Dorgali_centro_storico_Sardinia.jpg',                                                                 credit: 'Wikimedia / CC BY-SA' },
  'tortoli':               { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tortol%C3%AC_porto_turistico_Arbatax_Ogliastra.jpg/800px-Tortol%C3%AC_porto_turistico_Arbatax_Ogliastra.jpg',                                   credit: 'Wikimedia / CC BY-SA' },
  'aggius':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Aggius_Sardinia_borgo_granito.jpg/800px-Aggius_Sardinia_borgo_granito.jpg',                                                                     credit: 'Wikimedia / CC BY-SA' },
  'galtelli':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Galtell%C3%AC_chiesa_San_Pietro_romanico_pisano.jpg/800px-Galtell%C3%AC_chiesa_San_Pietro_romanico_pisano.jpg',                                 credit: 'Wikimedia / CC BY-SA' },
  'orosei':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Orosei_centro_storico_Sardinia.jpg/800px-Orosei_centro_storico_Sardinia.jpg',                                                                   credit: 'Wikimedia / CC BY-SA' },
  'posada':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Posada_castello_della_fava_Sardinia.jpg/800px-Posada_castello_della_fava_Sardinia.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'carloforte':            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Carloforte_porto_San_Pietro_Sardinia.jpg/800px-Carloforte_porto_San_Pietro_Sardinia.jpg',                                                        credit: 'Wikimedia / CC BY-SA' },
  'iglesias':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Iglesias_centro_storico_cattedrale_Sardinia.jpg/800px-Iglesias_centro_storico_cattedrale_Sardinia.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'cabras':                { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Giganti_di_Mont%27e_Prama_Cabras_museo.jpg/800px-Giganti_di_Mont%27e_Prama_Cabras_museo.jpg',                                                    credit: 'Wikimedia / CC BY-SA' },
  'santulussurgiu':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Santulussurgiu_borgo_Sardinia.jpg?width=800',                                                                                                         credit: 'Wikimedia / CC BY-SA' },
  'samugheo':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Samugheo_tappeti_MURATS_Sardinia.jpg?width=800',                                                                                                      credit: 'Wikimedia / CC BY-SA' },
  // SITI ARCHEOLOGICI STEP 2
  'nuraghe-arrubiu':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Nuraghe_Arrubiu_-_Orroli_-_Sardinia_%28Italy%29_-_09.jpg/800px-Nuraghe_Arrubiu_-_Orroli_-_Sardinia_%28Italy%29_-_09.jpg',                  credit: 'Norbert Nagel / CC BY-SA 3.0' },
  'nuraghe-genna-maria':   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Nuraghe_Genna_Maria.jpg/800px-Nuraghe_Genna_Maria.jpg',                                                                                       credit: 'Wikimedia / CC BY-SA' },
  'santa-cristina':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pozzo_sacro_di_Santa_Cristina.jpg/800px-Pozzo_sacro_di_Santa_Cristina.jpg',                                                                    credit: 'Wikimedia / CC BY-SA 3.0' },
  'nuraghe-is-paras':      { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nuraghe_Is_Paras_Isili_Sardinia.jpg?width=800',                                                                                                      credit: 'Wikimedia / CC BY-SA' },
  'tiscali':               { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Tiscali_-_Sardinia.jpg/800px-Tiscali_-_Sardinia.jpg',                                                                                         credit: 'Wikimedia / CC BY-SA' },
  'nuraghe-orolo':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nuraghe_Orolo_Bortigali_Sardinia.jpg?width=800',                                                                                                     credit: 'Wikimedia / CC BY-SA' },
  'montessu':              { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Necropoli_di_Montessu.jpg/800px-Necropoli_di_Montessu.jpg',                                                                                    credit: 'Wikimedia / CC BY-SA' },
  'sant-andrea-priu':      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bonorva%2C_domus_de_janas_di_Sant%27Andrea_Priu_%2803%29.jpg/800px-Bonorva%2C_domus_de_janas_di_Sant%27Andrea_Priu_%2803%29.jpg',              credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'tombe-giganti-madau':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tombe_giganti_Madau_Fonni_Sardinia.jpg?width=800',                                                                                                   credit: 'Wikimedia / CC BY-SA' },
  'pozzo-su-tempiesu':     { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Su_Tempiesu.jpg/800px-Su_Tempiesu.jpg',                                                                                                        credit: 'Wikimedia / CC BY-SA' },
  'pozzo-sa-testa':        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Olbia%2C_nuraghe_Sa_Testa_%2801%29.JPG/800px-Olbia%2C_nuraghe_Sa_Testa_%2801%29.JPG',                                                         credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'fordongianus':          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Terme_Romane_di_Fordongianus.jpg/800px-Terme_Romane_di_Fordongianus.jpg',                                                                       credit: 'Wikimedia / CC BY-SA' },
  'sulcis-sant-antioco':   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Sulcis_-_Sant%27Antioco_-_Sardinia_-_tophet.jpg/800px-Sulcis_-_Sant%27Antioco_-_Sardinia_-_tophet.jpg',                                       credit: 'Wikimedia / CC BY-SA' },
  'antas':                 { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Tempio_di_Antas_-_Sardinia.jpg/800px-Tempio_di_Antas_-_Sardinia.jpg',                                                                         credit: 'Wikimedia / CC BY-SA' },
  'bithia':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bithia_Chia_Sardinia_fenicia.jpg?width=800',                                                                                                         credit: 'Wikimedia / CC BY-SA' },
  'neapolis':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neapolis_Guspini_Sardinia_romana.jpg?width=800',                                                                                                     credit: 'Wikimedia / CC BY-SA' },
  'monte-d-accoddi':       { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Ziggurat_Monte_Accoddi.jpg/800px-Ziggurat_Monte_Accoddi.jpg',                                                                                  credit: 'Wikimedia / CC BY-SA' },
  'dolmen-sa-coveccada':   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sa_Coveccada_dolmen_Mores_Sardinia.jpg/800px-Sa_Coveccada_dolmen_Mores_Sardinia.jpg',                                                          credit: 'Wikimedia / CC BY-SA' },
  'menhir-laconi':         { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Menhir_Laconi_Museo_Sardinia.jpg/800px-Menhir_Laconi_Museo_Sardinia.jpg',                                                                      credit: 'Wikimedia / CC BY-SA' },
  'museo-sanna-sassari':   { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sassari_-_Museo_Nazionale_Sanna_%2801%29.JPG/800px-Sassari_-_Museo_Nazionale_Sanna_%2801%29.JPG',                                             credit: 'Gianni Careddu / CC BY-SA 4.0' },
  // HOTEL
  'villa-las-tronas':      { url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Spiaggia_e_Villa_Las_Tronas.JPG',                                              credit: 'Gianfranco Mariano / CC BY 3.0' },
  // RISTORANTI / CANTINE
  'cantina-gallura':       { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Cannonau_di_Sardegna.jpg',                                                      credit: 'Agne27 / CC BY-SA 3.0' },
};

// ─── COLORI CATEGORIA ─────────────────────────────────────────
const CAT_COLORS = {
  spiaggia:    '#00BFFF',
  città:       '#8899bb',
  hotel:       '#C8102E',
  ristorante:  '#FF8C00',
  attrazione:  '#FFD700',
  parco:       '#32CD32',
  esperienza:  '#B040FF'
};

// ─── MAPPING CATEGORIA → FILE ICONA ──────────────────────────
const CAT_ICONS = {
  spiaggia:   'spiagge',
  'città':    'citta',
  hotel:      'hotel',
  ristorante: 'ristoranti',
  attrazione: 'attrazioni',
  parco:      'parchi',
  esperienza: 'esperienze'
};

// ─── MARKER CON ICONA CATEGORIA ──────────────────────────────
function getMarkerSVG(color, cat) {
  const icon = cat ? CAT_ICONS[cat] : null;
  const img = icon
    ? `<img src="assets/images/map/filters/${icon}.svg" style="width:18px;height:18px;filter:brightness(0) invert(1);display:block;flex-shrink:0;" alt="">`
    : '';
  return `<div style="
    width:32px;height:32px;
    border-radius:50%;
    background:${color};
    border:2px solid rgba(255,255,255,0.9);
    box-shadow:0 0 8px ${color},0 0 16px ${color}40;
    cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:transform 0.2s ease;
  ">${img}</div>`;
}

// ─── INIT MAPPA ───────────────────────────────────────────────
function initMap(onReady) {
  const container = document.getElementById('map-canvas-container');
  if (!container || typeof maplibregl === 'undefined') {
    console.error('MapLibre GL JS non caricato.');
    return;
  }

  // Stile custom: satellite ESRI (gratuito, nessuna API key) + terrain AWS
  const MAP_STYLE = {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      'satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '© Esri, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN'
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        encoding: 'terrarium',
        maxzoom: 15
      },
      'labels': {
        type: 'raster',
        tiles: [
          'https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: 'Map tiles by Stamen Design, OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
        paint: {
          'raster-brightness-min': 0.1,
          'raster-saturation': -0.1,
          'raster-contrast': 0.1
        }
      }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 2.5
    },
    sky: {
      'sky-color': '#0a0a1a',
      'sky-horizon-blend': 0.4,
      'horizon-color': '#0a1020',
      'horizon-fog-blend': 0.4,
      'fog-color': '#0a0a20',
      'fog-ground-blend': 0.4
    }
  };

  sardMap = new maplibregl.Map({
    container: 'map-canvas-container',
    style: MAP_STYLE,
    center: [9.07, 40.12],
    zoom: onReady ? 6 : 8.5,
    minZoom: 6.2,
    maxZoom: 18,
    maxBounds: [[6.8, 37.8], [11.2, 42.2]],
    pitch: onReady ? 0 : 55,
    bearing: onReady ? 0 : 15,
    antialias: true,
    attributionControl: false
  });

  // Navigazione controlli
  sardMap.addControl(new maplibregl.NavigationControl({
    visualizePitch: true
  }), 'top-right');

  sardMap.addControl(new maplibregl.AttributionControl({
    compact: true
  }), 'bottom-right');

  // Click su canvas (fuori dai pin) — chiude quick card
  sardMap.on('click', () => closeQuickCard());

  // Quando la mappa è pronta
  sardMap.on('load', () => {
    addClusterLayer();
    addAllMarkers();
    addCityLabels();
    sardMap.addControl(new maplibregl.TerrainControl({
      source: 'terrain-dem',
      exaggeration: 2.5
    }), 'top-right');

    if (onReady) {
      // Transizione cinematica: fitBounds sulla Sardegna per matchare la sagoma rossa
      const vPad = Math.max(60, Math.round((window.innerHeight - Math.min(window.innerHeight * 0.62, 520)) / 2));
      sardMap.fitBounds([[8.13, 38.85], [9.83, 41.25]], {
        padding: { top: vPad, bottom: vPad, left: Math.round(vPad * 0.45), right: Math.round(vPad * 0.45) },
        pitch: 0,
        bearing: 0,
        animate: false
      });
      onReady();
    } else {
      // Entrata diretta (legacy): vola sulla Sardegna con animazione 3D
      sardMap.flyTo({
        center: [9.07, 40.12],
        zoom: 8,
        pitch: 60,
        bearing: 0,
        duration: 3000,
        easing: (t) => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
      });
    }
  });

  sardMap.on('error', (e) => {
    console.warn('MapLibre error:', e.error);
  });
}

// ─── CITY LABELS (symbol layer MapLibre) ─────────────────────
function addCityLabels() {
  if (sardMap.getSource('sard-cities')) return;

  sardMap.addSource('sard-cities', {
    type: 'geojson',
    data: SARDINIA_CITIES_LABELS
  });

  const tierConfig = [
    { tier: 1, minzoom: 5.5, size: ['interpolate',['linear'],['zoom'], 6,13, 10,17], weight: 700 },
    { tier: 2, minzoom: 7.8, size: ['interpolate',['linear'],['zoom'], 8,11, 11,14], weight: 600 },
    { tier: 3, minzoom: 9.2, size: ['interpolate',['linear'],['zoom'], 9.5,10, 12,13], weight: 500 },
    { tier: 4, minzoom: 10.8, size: 9, weight: 400 },
  ];

  tierConfig.forEach(({ tier, minzoom, size, weight }) => {
    sardMap.addLayer({
      id: `city-labels-t${tier}`,
      type: 'symbol',
      source: 'sard-cities',
      minzoom,
      filter: ['==', ['get', 'tier'], tier],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': size,
        'text-anchor': 'top',
        'text-offset': [0, 0.4],
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'symbol-sort-key': tier,
      },
      paint: {
        'text-color': tier <= 2 ? '#ffffff' : 'rgba(255,255,255,0.85)',
        'text-halo-color': 'rgba(0,0,0,0.75)',
        'text-halo-width': tier <= 2 ? 1.5 : 1.2,
        'text-halo-blur': 0.5,
        'text-opacity': ['interpolate',['linear'],['zoom'], minzoom, 0, minzoom + 0.5, 1],
      }
    });
  });
}

// ─── CLUSTER LAYER ───────────────────────────────────────────
function addClusterLayer() {
  sardMap.addSource('poi-cluster', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    cluster: true,
    clusterMaxZoom: 9,
    clusterRadius: 60
  });

  sardMap.addLayer({
    id: 'cluster-circles',
    type: 'circle',
    source: 'poi-cluster',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step', ['get', 'point_count'],
        'rgba(0,180,216,0.82)', 8,
        'rgba(0,140,170,0.87)', 20,
        'rgba(2,95,125,0.90)'
      ],
      'circle-radius': [
        'step', ['get', 'point_count'],
        20, 8, 28, 20, 36
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgba(255,255,255,0.30)',
      'circle-blur': 0.08
    }
  });

  sardMap.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'poi-cluster',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 13
    },
    paint: { 'text-color': '#ffffff' }
  });

  // Click su cluster → zoom in
  sardMap.on('click', 'cluster-circles', (e) => {
    e.stopPropagation();
    const features = sardMap.queryRenderedFeatures(e.point, { layers: ['cluster-circles'] });
    if (!features.length) return;
    const clusterId = features[0].properties.cluster_id;
    sardMap.getSource('poi-cluster').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      sardMap.easeTo({ center: features[0].geometry.coordinates, zoom: zoom + 0.5, duration: 500 });
    });
  });

  sardMap.on('mouseenter', 'cluster-circles', () => { sardMap.getCanvas().style.cursor = 'pointer'; });
  sardMap.on('mouseleave', 'cluster-circles', () => { sardMap.getCanvas().style.cursor = ''; });

  // Sincronizza visibilità marker DOM con lo zoom
  sardMap.on('zoom', syncMarkersToZoom);
}

function syncMarkersToZoom() {
  const z = sardMap.getZoom();
  const showMarkers = z >= 9;
  allMarkers.forEach(m => {
    const el = m.getElement();
    el.style.opacity = showMarkers ? '1' : '0';
    el.style.pointerEvents = showMarkers ? 'auto' : 'none';
  });
  const clusterVis = showMarkers ? 'none' : 'visible';
  if (sardMap.getLayer('cluster-circles')) sardMap.setLayoutProperty('cluster-circles', 'visibility', clusterVis);
  if (sardMap.getLayer('cluster-count')) sardMap.setLayoutProperty('cluster-count', 'visibility', clusterVis);
}

// ─── HOVER TOOLTIP ───────────────────────────────────────────
const CAT_LABELS = {
  spiaggia: 'Spiaggia', città: 'Città', hotel: 'Hotel',
  ristorante: 'Ristorante', attrazione: 'Attrazione',
  parco: 'Parco Naturale', esperienza: 'Esperienza'
};

function showHoverTooltip(poi, el) {
  const tooltip = document.getElementById('map-hover-tooltip');
  if (!tooltip) return;
  const mapEl = document.getElementById('map-canvas-container');
  const rect = el.getBoundingClientRect();
  const mapRect = mapEl.getBoundingClientRect();
  const color = CAT_COLORS[poi.cat] || '#fff';
  tooltip.innerHTML = `<span class="tooltip-dot" style="background:${color}"></span><span class="tooltip-cat">${CAT_LABELS[poi.cat] || poi.cat}</span><span class="tooltip-name">${poi.name}</span>`;
  tooltip.style.left = (rect.left - mapRect.left + rect.width / 2) + 'px';
  tooltip.style.top  = (rect.top  - mapRect.top) + 'px';
  tooltip.classList.add('active');
}

function hideHoverTooltip() {
  const t = document.getElementById('map-hover-tooltip');
  if (t) t.classList.remove('active');
}

// ─── AGGIUNGI TUTTI I MARKER ──────────────────────────────────
function addAllMarkers() {
  allMarkers.forEach(m => m.remove());
  allMarkers = [];

  MAP_POI.forEach(poi => {
    if (activeMapFilter !== 'all' && poi.cat !== activeMapFilter) return;

    const el = document.createElement('div');
    el.className = 'map-marker';
    el.setAttribute('data-cat', poi.cat);
    el.setAttribute('data-id', poi.id);
    el.innerHTML = getMarkerSVG(CAT_COLORS[poi.cat] || '#ffffff', poi.cat);

    el.addEventListener('mouseenter', () => {
      el.firstElementChild.style.transform = 'scale(1.3)';
      showHoverTooltip(poi, el);
    });
    el.addEventListener('mouseleave', () => {
      el.firstElementChild.style.transform = 'scale(1)';
      hideHoverTooltip();
    });
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      hideHoverTooltip();
      showQuickCard(poi);
    });

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([poi.lng, poi.lat])
      .addTo(sardMap);

    allMarkers.push(marker);
  });

  // Aggiorna sorgente cluster con i POI filtrati
  const filtered = activeMapFilter === 'all'
    ? MAP_POI
    : MAP_POI.filter(p => p.cat === activeMapFilter);
  const clusterSource = sardMap.getSource('poi-cluster');
  if (clusterSource) {
    clusterSource.setData({
      type: 'FeatureCollection',
      features: filtered.map(p => ({
        type: 'Feature',
        properties: { id: p.id, name: p.name, cat: p.cat },
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
      }))
    });
  }

  // Imposta visibilità iniziale coerente con lo zoom corrente
  syncMarkersToZoom();
}

// ─── QUICK CARD (primo click pin) ────────────────────────────
function showQuickCard(poi) {
  currentQuickPoi = poi;
  const card = document.getElementById('map-quick-card');
  if (!card) return;

  const catColor = CAT_COLORS[poi.cat] || '#fff';
  const photoData = POI_PHOTOS[poi.id] || (poi.photo ? { url: poi.photo } : null);
  const shortDesc = poi.description.split('.')[0] + '.';

  card.innerHTML = `
    ${photoData ? `<div class="qc-photo"><img src="${photoData.url}" alt="${poi.name}" loading="lazy" onerror="this.parentElement.style.display='none'"><div class="qc-photo-overlay"></div></div>` : `<div class="qc-photo qc-photo-grad" style="background:${CAT_GRADIENTS[poi.cat]||'#111'}"></div>`}
    <button class="qc-close" onclick="closeQuickCard()">&#10005;</button>
    <div class="qc-body">
      <div class="qc-cat" style="color:${catColor}">${CAT_LABELS[poi.cat] || poi.cat}</div>
      <h3 class="qc-name">${poi.name}</h3>
      <p class="qc-desc">${shortDesc}</p>
      <div class="qc-actions">
        <button class="qc-expand" onclick="expandToFullPanel()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          Espandi scheda
        </button>
        <a class="qc-gmaps" href="https://www.google.com/maps/place/${encodeURIComponent(poi.name + ', Sardegna, Italy')}/@${poi.lat},${poi.lng},17z" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </a>
      </div>
    </div>
  `;

  card.classList.add('active');
  closeMapInfoPanel();
}

function closeQuickCard() {
  const card = document.getElementById('map-quick-card');
  if (card) card.classList.remove('active');
  currentQuickPoi = null;
}

function expandToFullPanel() {
  if (!currentQuickPoi) return;
  const poi = currentQuickPoi;
  closeQuickCard();
  showMapInfoPanel(poi);
  sardMap.flyTo({
    center: [poi.lng, poi.lat],
    zoom: Math.max(sardMap.getZoom(), 13),
    pitch: 55,
    bearing: 0,
    duration: 1400,
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
}

// ─── FILTRI OVERLAY ───────────────────────────────────────────
function toggleMapFilters() {
  const popup = document.getElementById('map-filter-popup');
  const toggle = document.getElementById('map-filter-toggle');
  if (!popup) return;
  const isOpen = popup.classList.toggle('open');
  toggle.classList.toggle('active', isOpen);
  if (isOpen) {
    const close = (e) => {
      if (!popup.contains(e.target) && !toggle.contains(e.target)) {
        popup.classList.remove('open');
        toggle.classList.remove('active');
        document.removeEventListener('click', close, true);
      }
    };
    setTimeout(() => document.addEventListener('click', close, true), 0);
  }
}

function setActiveMapFilter(cat) {
  activeMapFilter = cat;
  document.querySelectorAll('.map-filter-chip').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  document.getElementById('map-filter-popup')?.classList.remove('open');
  document.getElementById('map-filter-toggle')?.classList.remove('active');
  if (sardMap && sardMap.loaded()) addAllMarkers();
  closeQuickCard();
  closeMapInfoPanel();
}

// ─── RICERCA ──────────────────────────────────────────────────
function handleMapSearch(query) {
  const results = document.getElementById('map-search-results');
  if (!results) return;
  const q = query.trim().toLowerCase();
  if (!q) { results.innerHTML = ''; results.classList.remove('open'); return; }

  const matches = MAP_POI.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q)) ||
    (p.cat && CAT_LABELS[p.cat]?.toLowerCase().includes(q))
  ).slice(0, 7);

  if (!matches.length) {
    results.innerHTML = '<div class="search-no-result">Nessun risultato</div>';
  } else {
    results.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="selectSearchResult('${p.id}')">
        <span class="search-result-dot" style="background:${CAT_COLORS[p.cat]||'#fff'}"></span>
        <span class="search-result-name">${p.name}</span>
        <span class="search-result-cat">${CAT_LABELS[p.cat] || p.cat}</span>
      </div>
    `).join('');
  }
  results.classList.add('open');
}

function selectSearchResult(id) {
  const poi = MAP_POI.find(p => p.id === id);
  if (!poi || !sardMap) return;
  document.getElementById('map-search-input').value = poi.name;
  document.getElementById('map-search-results').classList.remove('open');
  sardMap.flyTo({
    center: [poi.lng, poi.lat],
    zoom: 12,
    pitch: 55,
    duration: 1200,
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
  setTimeout(() => showQuickCard(poi), 800);
}

function showMapSearchResults() {
  const results = document.getElementById('map-search-results');
  if (results && results.children.length) results.classList.add('open');
}

function hideMapSearchResultsDelayed() {
  searchBlurTimer = setTimeout(() => {
    document.getElementById('map-search-results')?.classList.remove('open');
  }, 200);
}

// ─── INFO PANEL ───────────────────────────────────────────────
// Gradienti di fallback per categoria quando non c'è foto
const CAT_GRADIENTS = {
  spiaggia:   'linear-gradient(160deg,#0a2a4a 0%,#0d5fa6 45%,#00bfff 100%)',
  città:      'linear-gradient(160deg,#1a1a2e 0%,#2d2d5a 50%,#4a4a8a 100%)',
  hotel:      'linear-gradient(160deg,#2a0a0a 0%,#6b1a1a 50%,#c8102e 100%)',
  ristorante: 'linear-gradient(160deg,#2a1400 0%,#6b3500 50%,#e08020 100%)',
  attrazione: 'linear-gradient(160deg,#2a2000 0%,#6b5500 50%,#ffd700 100%)',
  parco:      'linear-gradient(160deg,#0a1e0a 0%,#1a5c1a 50%,#32cd32 100%)',
  esperienza: 'linear-gradient(160deg,#1a0a2a 0%,#4a1a6b 50%,#b040ff 100%)'
};

function showMapInfoPanel(poi) {
  const panel = document.getElementById('map-info-panel');
  if (!panel) return;

  const catLabel = {
    spiaggia:    'Spiaggia',
    città:       'Città',
    hotel:       'Hotel',
    ristorante:  'Ristorante',
    attrazione:  'Attrazione',
    parco:       'Parco Naturale',
    esperienza:  'Esperienza'
  }[poi.cat] || poi.cat;

  const catColor = CAT_COLORS[poi.cat] || '#fff';
  const catGradient = CAT_GRADIENTS[poi.cat] || CAT_GRADIENTS.attrazione;

  // Foto: cerca in POI_PHOTOS, poi in poi.photo, altrimenti gradiente
  const photoData = POI_PHOTOS[poi.id] || (poi.photo ? { url: poi.photo, credit: poi.photoCredit || '' } : null);
  const photoHTML = photoData
    ? `<div class="panel-photo">
         <img src="${photoData.url}" alt="${poi.name}" loading="lazy" onerror="this.parentElement.classList.add('panel-photo-fallback');this.style.display='none';">
         <div class="panel-photo-overlay"></div>
         ${photoData.credit ? `<span class="panel-photo-credit">${photoData.credit}</span>` : ''}
         <button class="panel-close-photo" onclick="closeMapInfoPanel()">&#10005;</button>
         <div class="panel-photo-cat" style="background:${catColor}22;color:${catColor};border-color:${catColor}40;">${catLabel}</div>
       </div>`
    : `<div class="panel-photo panel-photo-fallback" style="background:${catGradient}">
         <button class="panel-close-photo" onclick="closeMapInfoPanel()">&#10005;</button>
         <div class="panel-photo-cat" style="background:${catColor}22;color:${catColor};border-color:${catColor}40;">${catLabel}</div>
         <div class="panel-photo-name-overlay">${poi.name}</div>
       </div>`;

  let contactHTML = '';
  if (poi.tel) contactHTML += `<a href="tel:${poi.tel.replace(/\s/g,'')}" class="panel-contact-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.87 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 013.78 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>${poi.tel}</a>`;
  if (poi.web) {
    const webUrl = poi.web.startsWith('http') ? poi.web : `https://${poi.web}`;
    const webDisplay = poi.web.replace(/^https?:\/\//, '').split(' ·')[0];
    contactHTML += `<a href="${webUrl}" target="_blank" rel="noopener" class="panel-contact-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>${webDisplay}</a>`;
  }

  let metaHTML = '';
  if (poi.orari)   metaHTML += `<div class="panel-meta"><div class="panel-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Orari</div><p>${poi.orari}</p></div>`;
  if (poi.costo)   metaHTML += `<div class="panel-meta"><div class="panel-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> Costi</div><p>${poi.costo}</p></div>`;
  if (poi.come)    metaHTML += `<div class="panel-meta"><div class="panel-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> Come arrivare</div><p>${poi.come}</p></div>`;
  if (poi.servizi) metaHTML += `<div class="panel-meta"><div class="panel-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> Servizi</div><p>${poi.servizi}</p></div>`;

  panel.innerHTML = `
    ${photoHTML}
    <div class="panel-inner">
      <h3 class="panel-title">${poi.name}</h3>
      <p class="panel-desc">${poi.description}</p>
      ${metaHTML}
      ${contactHTML ? `<div class="panel-contacts">${contactHTML}</div>` : ''}
      <div class="panel-actions">
        <button class="panel-fly-btn" onclick="flyToLocation(${poi.lat}, ${poi.lng})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Centra mappa
        </button>
        <a href="https://www.google.com/maps/place/${encodeURIComponent(poi.name + ', Sardegna, Italy')}/@${poi.lat},${poi.lng},17z" target="_blank" rel="noopener" class="panel-gmaps-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Google Maps
        </a>
      </div>
    </div>
  `;

  panel.classList.add('active');
}

function closeMapInfoPanel() {
  const panel = document.getElementById('map-info-panel');
  if (panel) panel.classList.remove('active');
}

function flyToLocation(lat, lng) {
  if (!sardMap) return;
  sardMap.flyTo({
    center: [lng, lat],
    zoom: 14,
    pitch: 60,
    bearing: 0,
    duration: 2000
  });
}

function resetMapView() {
  if (!sardMap) return;
  sardMap.flyTo({
    center: [9.07, 40.12],
    zoom: 8,
    pitch: 55,
    bearing: 0,
    duration: 1800,
    easing: (t) => 1 - Math.pow(1 - t, 3)
  });
  closeMapInfoPanel();
  closeQuickCard();
}

function initMapFilters() {} // Legacy stub — filtri ora gestiti da overlay

// ─── CLEANUP ──────────────────────────────────────────────────
function destroyMap() {
  if (sardMap) {
    allMarkers.forEach(m => m.remove());
    allMarkers = [];
    sardMap.remove();
    sardMap = null;
  }
}

// ─── ESPORTA ──────────────────────────────────────────────────
window.initMap            = initMap;
window.destroyMap         = destroyMap;
window.initMapFilters     = initMapFilters;
window.showMapInfoPanel   = showMapInfoPanel;
window.closeMapInfoPanel  = closeMapInfoPanel;
window.flyToLocation      = flyToLocation;
window.resetMapView       = resetMapView;
window.toggleMapFilters   = toggleMapFilters;
window.setActiveMapFilter = setActiveMapFilter;
window.showQuickCard      = showQuickCard;
window.closeQuickCard     = closeQuickCard;
window.expandToFullPanel  = expandToFullPanel;
window.handleMapSearch    = handleMapSearch;
window.selectSearchResult = selectSearchResult;
window.showMapSearchResults        = showMapSearchResults;
window.hideMapSearchResultsDelayed = hideMapSearchResultsDelayed;

// ============================================================
// ROUTE PLANNER
// ============================================================

const RP_OSRM = {
  driving: 'https://router.project-osrm.org/route/v1/driving/',
  walking: 'https://router.project-osrm.org/route/v1/foot/',
  cycling: 'https://router.project-osrm.org/route/v1/bike/'
};

let rpTransportMode = 'driving';
let rpStopCount = 2; // A + B di default
let rpRouteLayer = null;

function toggleRoutePlanner() {
  const panel = document.getElementById('route-planner-panel');
  const btn   = document.getElementById('btn-route-planner');
  const open  = panel.classList.toggle('open');
  btn.classList.toggle('active', open);
  if (!open) rpClearRouteOnMap();
}

function rpSetTransport(el) {
  document.querySelectorAll('.rp-transport-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  rpTransportMode = el.dataset.mode;
}

function rpAddStop() {
  const container = document.getElementById('rp-stops-container');
  const endStop   = container.querySelector('.rp-stop-end');
  const idx       = rpStopCount++;

  // Inserisce connettore + tappa prima dell'arrivo
  const connector = document.createElement('div');
  connector.className = 'rp-connector';
  connector.innerHTML = '<div class="rp-connector-line"></div>';

  const stopDiv = document.createElement('div');
  stopDiv.className = 'rp-stop';
  stopDiv.dataset.index = idx;
  stopDiv.innerHTML = `
    <div class="rp-stop-num">${idx}</div>
    <input class="rp-stop-input" type="text" placeholder="Tappa ${idx}..."
      data-stop="${idx}" oninput="rpHandleInput(this)"
      onfocus="rpShowSuggestions(this)" onblur="rpHideSuggestions(this)">
    <button class="rp-stop-remove" onclick="rpRemoveStop(this)" title="Rimuovi">✕</button>
    <div class="rp-suggestions"></div>`;

  container.insertBefore(connector, endStop);
  container.insertBefore(stopDiv, endStop);
  stopDiv.querySelector('input').focus();
}

function rpRemoveStop(btn) {
  const stop = btn.closest('.rp-stop');
  const prev = stop.previousElementSibling; // connector
  if (prev && prev.classList.contains('rp-connector')) prev.remove();
  stop.remove();
  rpClearRouteOnMap();
}

// Autocomplete da MAP_POI
const rpPoiCache = {};

function rpHandleInput(input) {
  const q = input.value.trim().toLowerCase();
  const sugBox = input.parentElement.querySelector('.rp-suggestions');
  if (!sugBox) return;
  if (q.length < 2) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; return; }

  const matches = MAP_POI.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  ).slice(0, 6);

  if (!matches.length) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; return; }

  sugBox.style.cssText = `
    display:block; position:absolute; left:30px; right:28px; top:100%;
    background:rgba(8,8,18,0.97); border:1px solid rgba(255,255,255,0.12);
    border-radius:8px; z-index:999; margin-top:4px; overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,0.6);`;

  sugBox.innerHTML = matches.map(p => `
    <div class="rp-sug-item" style="padding:9px 12px;cursor:pointer;font-size:0.78rem;
      color:rgba(255,255,255,0.85);border-bottom:1px solid rgba(255,255,255,0.06);
      transition:background 0.1s;"
      onmousedown="rpSelectPoi(this,'${p.id}')"
      onmouseover="this.style.background='rgba(200,16,46,0.15)'"
      onmouseout="this.style.background=''"
    >${p.name}</div>`).join('');
}

function rpShowSuggestions(input) { rpHandleInput(input); }
function rpHideSuggestions(input) {
  setTimeout(() => {
    const sugBox = input.parentElement.querySelector('.rp-suggestions');
    if (sugBox) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; }
  }, 200);
}

function rpSelectPoi(el, poiId) {
  const poi = MAP_POI.find(p => p.id === poiId);
  if (!poi) return;
  const stopDiv = el.closest('.rp-stop');
  const input   = stopDiv.querySelector('.rp-stop-input');
  input.value   = poi.name;
  input.dataset.lat = poi.lat;
  input.dataset.lng = poi.lng;
  const sugBox  = stopDiv.querySelector('.rp-suggestions');
  if (sugBox) { sugBox.innerHTML = ''; sugBox.style.display = 'none'; }
}

async function rpCalculateRoute() {
  const btn = document.getElementById('rp-calc-btn');
  btn.disabled = true;
  btn.textContent = 'Calcolo in corso...';

  const stops = rpGetStops();
  if (stops.length < 2) {
    alert('Inserisci almeno partenza e arrivo.');
    btn.disabled = false;
    btn.textContent = 'Calcola Percorso';
    return;
  }

  try {
    const coordStr = stops.map(s => `${s.lng},${s.lat}`).join(';');
    const url = `${RP_OSRM[rpTransportMode]}${coordStr}?overview=full&geometries=geojson&steps=false`;
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.routes || !data.routes.length) throw new Error('Nessun percorso trovato');

    const route = data.routes[0];
    rpDrawRouteOnMap(route.geometry);
    rpShowResults(stops, route);
  } catch (e) {
    // Fallback: linee rette tra le tappe
    rpDrawStraightLines(stops);
    rpShowResultsFallback(stops);
  }

  btn.disabled = false;
  btn.textContent = 'Calcola Percorso';
}

function rpGetStops() {
  const inputs = document.querySelectorAll('#rp-stops-container .rp-stop-input');
  const stops  = [];
  inputs.forEach(inp => {
    const name = inp.value.trim();
    if (!name) return;
    let lat = parseFloat(inp.dataset.lat);
    let lng = parseFloat(inp.dataset.lng);
    // Cerca in MAP_POI se non ha coordinate
    if (!lat || !lng) {
      const poi = MAP_POI.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (poi) { lat = poi.lat; lng = poi.lng; }
    }
    if (lat && lng) stops.push({ name, lat, lng });
  });
  return stops;
}

function rpDrawRouteOnMap(geometry) {
  rpClearRouteOnMap();
  if (!sardMap) return;
  sardMap.addSource('rp-route', { type: 'geojson', data: { type: 'Feature', geometry } });
  sardMap.addLayer({
    id: 'rp-route-line',
    type: 'line',
    source: 'rp-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-color': '#C8102E',
      'line-width': 4,
      'line-opacity': 0.85,
      'line-dasharray': [1, 0]
    }
  });
  rpRouteLayer = 'rp-route-line';

  // Fit mappa al percorso
  const coords = geometry.coordinates;
  const lngs   = coords.map(c => c[0]);
  const lats   = coords.map(c => c[1]);
  sardMap.fitBounds(
    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
    { padding: 60, duration: 800 }
  );
}

function rpDrawStraightLines(stops) {
  rpClearRouteOnMap();
  if (!sardMap || stops.length < 2) return;
  const coords = stops.map(s => [s.lng, s.lat]);
  sardMap.addSource('rp-route', {
    type: 'geojson',
    data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }
  });
  sardMap.addLayer({
    id: 'rp-route-line',
    type: 'line',
    source: 'rp-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#C8102E', 'line-width': 4, 'line-opacity': 0.75, 'line-dasharray': [2, 3] }
  });
  rpRouteLayer = 'rp-route-line';
  const lngs = stops.map(s => s.lng);
  const lats = stops.map(s => s.lat);
  sardMap.fitBounds(
    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
    { padding: 80, duration: 800 }
  );
}

function rpClearRouteOnMap() {
  if (!sardMap) return;
  if (sardMap.getLayer('rp-route-line')) sardMap.removeLayer('rp-route-line');
  if (sardMap.getSource('rp-route'))     sardMap.removeSource('rp-route');
  rpRouteLayer = null;
}

function rpShowResults(stops, route) {
  const distKm  = (route.distance / 1000).toFixed(1);
  const minutes = Math.round(route.duration / 60);
  const hours   = Math.floor(minutes / 60);
  const mins    = minutes % 60;
  const durText = hours > 0 ? `${hours}h ${mins}min` : `${minutes} min`;

  const resultsEl = document.getElementById('rp-results');
  document.getElementById('rp-summary').innerHTML = `
    <div class="rp-stat"><div class="rp-stat-value">${distKm} km</div><div class="rp-stat-label">Distanza</div></div>
    <div class="rp-stat"><div class="rp-stat-value">${durText}</div><div class="rp-stat-label">Durata</div></div>
    <div class="rp-stat"><div class="rp-stat-value">${stops.length}</div><div class="rp-stat-label">Tappe</div></div>`;

  document.getElementById('rp-legs').innerHTML = stops.map((s, i) => `
    <div class="rp-leg">
      <div class="rp-leg-dot" style="background:${i === 0 ? '#32CD32' : i === stops.length - 1 ? '#C8102E' : '#FF8C00'}"></div>
      <div class="rp-leg-info">
        <div class="rp-leg-name">${s.name}</div>
        <div class="rp-leg-detail">${i === 0 ? 'Partenza' : i === stops.length - 1 ? 'Arrivo' : `Tappa ${i}`}</div>
      </div>
    </div>`).join('');

  // Link Google Maps con waypoints
  const gmapsUrl = rpBuildGMapsUrl(stops);
  document.getElementById('rp-gmaps-link').href = gmapsUrl;

  resultsEl.classList.add('open');
}

function rpShowResultsFallback(stops) {
  const resultsEl = document.getElementById('rp-results');
  document.getElementById('rp-summary').innerHTML = `
    <div class="rp-stat"><div class="rp-stat-value">${stops.length}</div><div class="rp-stat-label">Tappe</div></div>
    <div class="rp-stat"><div class="rp-stat-value">—</div><div class="rp-stat-label">Distanza</div></div>
    <div class="rp-stat"><div class="rp-stat-value">—</div><div class="rp-stat-label">Durata</div></div>`;

  document.getElementById('rp-legs').innerHTML = stops.map((s, i) => `
    <div class="rp-leg">
      <div class="rp-leg-dot"></div>
      <div class="rp-leg-info">
        <div class="rp-leg-name">${s.name}</div>
        <div class="rp-leg-detail">${i === 0 ? 'Partenza' : i === stops.length - 1 ? 'Arrivo' : `Tappa ${i}`}</div>
      </div>
    </div>`).join('');

  document.getElementById('rp-gmaps-link').href = rpBuildGMapsUrl(stops);
  resultsEl.classList.add('open');
}

function rpBuildGMapsUrl(stops) {
  if (stops.length < 2) return '#';
  const origin      = encodeURIComponent(stops[0].name + ', Sardegna');
  const destination = encodeURIComponent(stops[stops.length - 1].name + ', Sardegna');
  const waypoints   = stops.slice(1, -1).map(s => encodeURIComponent(s.name + ', Sardegna')).join('|');
  const mode        = rpTransportMode === 'driving' ? 'driving' : rpTransportMode === 'walking' ? 'walking' : 'bicycling';
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

window.toggleRoutePlanner = toggleRoutePlanner;
window.rpSetTransport     = rpSetTransport;
window.rpAddStop          = rpAddStop;
window.rpRemoveStop       = rpRemoveStop;
window.rpHandleInput      = rpHandleInput;
window.rpShowSuggestions  = rpShowSuggestions;
window.rpHideSuggestions  = rpHideSuggestions;
window.rpSelectPoi        = rpSelectPoi;
window.rpCalculateRoute   = rpCalculateRoute;
