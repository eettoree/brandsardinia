// ============================================================
// map.js â€” MapLibre GL JS â€” Mappa Satellite 3D Sardegna
// Tiles: ESRI World Imagery (gratuito) + AWS Terrain (gratuito)
// ============================================================

'use strict';

let sardMap = null;
let activeMapFilter = 'all';
let allMarkers = [];
let currentQuickPoi = null;
let searchBlurTimer = null;

// â”€â”€â”€ DATI CITTÃ€ SARDEGNA (label zoom-based sulla mappa) â”€â”€â”€â”€â”€â”€â”€
const SARDINIA_CITIES_LABELS = {
  type: 'FeatureCollection',
  features: [
    // Tier 1 â€” capoluoghi e cittÃ  principali (>40k ab.) â€” visibili da zoom 6
    { type:'Feature', properties:{ name:'Cagliari',    tier:1 }, geometry:{ type:'Point', coordinates:[9.1097,39.2238] } },
    { type:'Feature', properties:{ name:'Sassari',     tier:1 }, geometry:{ type:'Point', coordinates:[8.5564,40.7270] } },
    { type:'Feature', properties:{ name:'Olbia',       tier:1 }, geometry:{ type:'Point', coordinates:[9.4966,40.9226] } },
    { type:'Feature', properties:{ name:'Nuoro',       tier:1 }, geometry:{ type:'Point', coordinates:[9.3308,40.3197] } },
    { type:'Feature', properties:{ name:'Oristano',    tier:1 }, geometry:{ type:'Point', coordinates:[8.5912,39.9062] } },
    // Tier 2 â€” comuni medi (8kâ€“40k ab.) â€” visibili da zoom 8
    { type:'Feature', properties:{ name:'Alghero',              tier:2 }, geometry:{ type:'Point', coordinates:[8.3135,40.5585] } },
    { type:'Feature', properties:{ name:'Iglesias',             tier:2 }, geometry:{ type:'Point', coordinates:[8.5368,39.3132] } },
    { type:'Feature', properties:{ name:'Carbonia',             tier:2 }, geometry:{ type:'Point', coordinates:[8.5214,39.1666] } },
    { type:'Feature', properties:{ name:'La Maddalena',         tier:2 }, geometry:{ type:'Point', coordinates:[9.4097,41.2131] } },
    { type:'Feature', properties:{ name:'Quartu Sant\'Elena',   tier:2 }, geometry:{ type:'Point', coordinates:[9.1801,39.2384] } },
    { type:'Feature', properties:{ name:'Tempio Pausania',      tier:2 }, geometry:{ type:'Point', coordinates:[9.1044,40.8994] } },
    { type:'Feature', properties:{ name:'Arzachena',            tier:2 }, geometry:{ type:'Point', coordinates:[9.3874,41.0846] } },
    { type:'Feature', properties:{ name:'Macomer',              tier:2 }, geometry:{ type:'Point', coordinates:[8.7782,40.2648] } },
    { type:'Feature', properties:{ name:'Siniscola',            tier:2 }, geometry:{ type:'Point', coordinates:[9.6927,40.5765] } },
    { type:'Feature', properties:{ name:'TortolÃ¬',              tier:2 }, geometry:{ type:'Point', coordinates:[9.6579,39.9293] } },
    { type:'Feature', properties:{ name:'Lanusei',              tier:2 }, geometry:{ type:'Point', coordinates:[9.5429,39.8786] } },
    { type:'Feature', properties:{ name:'Sanluri',              tier:2 }, geometry:{ type:'Point', coordinates:[8.8978,39.5561] } },
    { type:'Feature', properties:{ name:'Ozieri',               tier:2 }, geometry:{ type:'Point', coordinates:[9.0041,40.5858] } },
    // Tier 3 â€” borghi e comuni (2kâ€“8k ab.) â€” visibili da zoom 9.5
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
    // Tier 4 â€” paesi e frazioni (<2k ab.) â€” visibili da zoom 11
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

// ─── DATI POI — caricati da assets/data/pois.json ───────────
let MAP_POI = [];

// â”€â”€â”€ FOTO POI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Wikimedia Commons Special:FilePath â€” redirect automatico, no hash necessario
// Formato: https://commons.wikimedia.org/wiki/Special:FilePath/NOME_FILE?width=800
const POI_PHOTOS = {
  // SPIAGGE (URL verificati da agenti Wikimedia â€” giugno 2026)
  'la-pelosa':             { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Beach_Della_Pelosa_%28527708116%29.jpg',                                                                                   credit: 'David Blaikie / CC BY 2.0' },
  'cala-goloritzÃ©':        { url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Cala_Goloritz%C3%A9_3.JPG',                                                                                                credit: 'Mentnafunangann / CC BY-SA 3.0' },
  'cala-luna':             { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Cala_Luna_%28Golfo_di_Orosei%29.jpg',                                                                                       credit: 'Alessandro Mangione / CC BY-SA 4.0' },
  'spiaggia-principe':     { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Spiaggia_del_Principe.jpg',                                                                                                 credit: 'Ã–kologix / CC0 Public Domain' },
  'is-arutas':             { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Is_arutas.jpg',                                                                                                             credit: 'ManuelM / Public Domain' },
  'cala-brandinchi':       { url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Cala_Brandinchi_-_Cerde%C3%B1a_-_panoramio.jpg',                                                                           credit: 'Ramon EspiÃ±a Fernandez / CC BY-SA 3.0' },
  'la-cinta':              { url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/La_Cinta_-_panoramio.jpg',                                                                                                  credit: 'Tom Rolvag / CC BY-SA 3.0' },
  'porto-giunco':          { url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Porto_Giunco_beach_-_2.jpg',                                                                                                credit: 'Muzzudan / CC BY-SA 4.0' },
  'poetto':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Poetto_Cagliari_Sardinia_aerial.jpg?width=800',                                                                             credit: 'Wikimedia / CC BY-SA' },
  'berchida':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Berchida_beach_Siniscola_Sardinia.jpg?width=800',                                                                           credit: 'Wikimedia / CC BY-SA' },
  'mari-ermi':             { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mari_Ermi_beach_Sinis_Sardinia.jpg?width=800',                                                                             credit: 'Wikimedia / CC BY-SA' },
  'le-tonnare-stintino':   { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Le_Tonnare_Stintino_Sardinia.jpg?width=800',                                                                               credit: 'Wikimedia / CC BY-SA' },
  // CITTÃ€ (URL verificati da Wikimedia Commons â€” giugno 2026)
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
  // ATTRAZIONI ARCHEOLOGICHE (URL verificati da Wikimedia Commons â€” giugno 2026)
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
  // PARCHI NATURALI (URL verificati â€” giugno 2026)
  'asinara':           { url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Wild_albino_donkeys.jpg',                                                          credit: 'Dirk Hartung / CC BY-SA 2.0' },
  'gennargentu':       { url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/1438puntaLaMarmora.jpg',                                                           credit: 'David Edgar / CC BY-SA 3.0' },
  'gola-gorropu':      { url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Gola_di_Gorropu_01.jpg',                                                           credit: 'Unukorno / CC BY 4.0' },
  'molentargius':      { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Fenicottero_all%27alba.jpg',                                                       credit: 'Marystella1 / CC BY-SA 4.0' },
  'porto-conte':       { url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Porto_Conte_-_Alghero.jpg',                                                        credit: 'Tristan Ferne / CC BY 2.0' },
  'valle-luna-aggius': { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Valle_della_Luna-Aggius.jpg',                                                      credit: 'Tiuliano / CC BY-SA 4.0' },
  'monte-limbara':     { url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Monte_Limbara_%2801%29.JPG',                                                       credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'stagno-san-teodoro':{ url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Stagno_di_San_Teodoro.jpg',                                                        credit: 'Aenea289 / CC BY-SA 4.0' },
  'lago-baratz':       { url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Lago_di_Baratz-DSC07415.jpg',                                                      credit: 'C. Pinatel de Salvator / CC BY-SA 4.0' },
  // ESPERIENZE (URL verificati â€” giugno 2026)
  'selvaggio-blu':         { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Climbing_during_Selvaggio_Blu.jpg',                                            credit: 'Joos1697 / CC BY-SA 4.0' },
  'giro-maddalena':        { url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/La_Maddalena_Archipel_Aerial_view.jpg',                                        credit: 'Stahlkocher / CC BY-SA 3.0' },
  'kayak-orosei':          { url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Cala_Gonone-Cala_goloritz%C3%A8.jpg',                                          credit: 'Marrabbio2 / CC BY-SA 3.0' },
  'trenino-verde':         { url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Trenino_verde%2C_tratta_Sassari-Palau_%2842%29.jpg',                           credit: 'Gianni Careddu / CC BY-SA 4.0' },
  'kitesurf-porto-pollo':  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Kitesurf_Cape_Drepano_7.JPG',                                                  credit: 'Tony Esopi / CC BY-SA 4.0' },
  'bonga-surf-school':     { url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Porto_Ferro_e_Lago_di_Bararz_da_Monte_Doglia_-_Alghero.jpg',                   credit: 'Gianni Careddu / CC BY-SA 3.0' },
  // SPIAGGE AGGIUNTIVE (URL verificati â€” giugno 2026)
  'cala-mariolu':          { url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Cala_Mariolu.jpg',                                                              credit: 'Marrabbio2 / CC BY-SA 3.0' },
  'spiaggia-rosa-budelli': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Spiaggia_rosa%2C_Isola_di_Budelli._Arcipelago_della_Maddalena.JPG',            credit: 'Mattia.dipaolo / CC BY-SA 3.0' },
  'porto-ferro':           { url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Porto_Ferro_e_Lago_di_Bararz_da_Monte_Doglia_-_Alghero.jpg',                   credit: 'Gianni Careddu / CC BY-SA 3.0' },
  'cala-sisine':           { url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cala_Sisine.jpg',                                                               credit: 'clurr / CC BY 2.0' },
  'su-giudeu':             { url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Spiaggia_Su_Giudeu_2.jpg',                                                      credit: 'Vid Pogacnik / CC BY-SA 4.0' },
  'tuerredda':             { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Tuaredda.jpg',                                                                  credit: 'ilaria / CC BY 2.0' },
  'cala-domestica':        { url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Buggeru-cala-domestica.jpg',                                                    credit: 'Mboesch / CC BY-SA 4.0' },
  // SPIAGGE STEP 1 â€” GALLURA & ARCIPELAGO
  'cala-coticcio':         { url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Cala_Coticcio_Caprera_Maddalena.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'cala-corsara':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Corsara_Spargi_Maddalena.jpg?width=800',                                  credit: 'Wikimedia / CC BY-SA' },
  'lu-impostu':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lu_Impostu_San_Teodoro_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'li-cossi':              { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Li_Cossi_Costa_Paradiso_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'rena-bianca':           { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Rena_Bianca_beach_Santa_Teresa_di_Gallura.jpg',                                credit: 'Wikimedia / CC BY-SA' },
  'cala-spinosa':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Spinosa_Capo_Testa_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'la-marmorata':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/La_Marmorata_Santa_Teresa_Gallura.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'cala-moresca':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Moresca_Golfo_Aranci_Sardinia.jpg?width=800',                             credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” ALGHERO
  'le-bombarde':           { url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Spiaggia_Le_Bombarde_%28Alghero%29_-_panoramio.jpg',                           credit: 'Wikimedia / CC BY-SA' },
  'mugoni':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_di_Mugoni_Alghero_Porto_Conte.jpg?width=800',                         credit: 'Wikimedia / CC BY-SA' },
  'lazzaretto':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lazzaretto_beach_Alghero_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” NUORESE & OGLIASTRA
  'cala-fuili':            { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Cala_Fuili_Cala_Gonone.jpg',                                                   credit: 'Wikimedia / CC BY-SA' },
  'bidderosa':             { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bidderosa_beach_Orosei_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'cannazzellu':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cannazzellu_beach_Siniscola_Sardinia.jpg?width=800',                           credit: 'Wikimedia / CC BY-SA' },
  'pedra-marchesa':        { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pedra_Marchesa_Siniscola_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'cala-biriola':          { url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Cala_Biriola_Baunei.jpg',                                                      credit: 'Wikimedia / CC BY-SA' },
  'scogli-rossi':          { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Cea_Scogli_Rossi_beach_Tortoli_Ogliastra.jpg',                                 credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” SUD-EST
  'punta-molentis':        { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Punta_Molentis_Villasimius_Sardinia.jpg',                                      credit: 'Wikimedia / CC BY-SA' },
  'cala-sinzias':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Sinzias_Castiadas_Sardinia.jpg?width=800',                                credit: 'Wikimedia / CC BY-SA' },
  'solanas':               { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solanas_beach_Sinnai_Sardinia.jpg?width=800',                                  credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” SUD
  'cala-cipolla':          { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Cipolla_Chia_Sardinia.jpg?width=800',                                     credit: 'Wikimedia / CC BY-SA' },
  'cala-piscinni':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Piscin%C3%AC_Domus_de_Maria_Sardinia.jpg?width=800',                      credit: 'Wikimedia / CC BY-SA' },
  'porto-pino':            { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Porto_Pino_beach_dunes_Sardinia.jpg',                                          credit: 'Wikimedia / CC BY-SA' },
  'coa-quaddus':           { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coa_Quaddus_Sant_Antioco_Sardinia.jpg?width=800',                              credit: 'Wikimedia / CC BY-SA' },
  'bobba':                 { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_Bobba_Carloforte_San_Pietro.jpg?width=800',                           credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” COSTA VERDE
  'portixeddu':            { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Portixeddu_Buggerru_Sardinia.jpg?width=800',                                   credit: 'Wikimedia / CC BY-SA' },
  'scivu':                 { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Scivu_beach_dunes_Arbus_Sardinia.jpg',                                         credit: 'Wikimedia / CC BY-SA' },
  'piscinas':              { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Piscinas_dunes_Arbus_Costa_Verde_Sardinia.jpg',                                credit: 'Wikimedia / CC BY-SA' },
  'torre-corsari':         { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Torre_dei_Corsari_Arbus_Sardinia.jpg?width=800',                               credit: 'Wikimedia / CC BY-SA' },
  'pistis':                { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pistis_beach_Arbus_Sardinia.jpg?width=800',                                    credit: 'Wikimedia / CC BY-SA' },
  // SPIAGGE STEP 1 â€” SINIS / ORISTANESE
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

// â”€â”€â”€ COLORI CATEGORIA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CAT_COLORS = {
  spiaggia:    '#00BFFF',
  città:       '#8899bb',
  hotel:       '#C8102E',
  ristorante:  '#FF8C00',
  attrazione:  '#FFD700',
  parco:       '#32CD32',
  esperienza:  '#B040FF',
  porto:       '#0066CC'
};

// â”€â”€â”€ MAPPING CATEGORIA â†’ FILE ICONA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CAT_ICONS = {
  spiaggia:   'spiagge',
  'città':    'citta',
  hotel:      'hotel',
  ristorante: 'ristoranti',
  attrazione: 'attrazioni',
  parco:      'parchi',
  esperienza: 'esperienze',
  porto:      'porti'
};

// â”€â”€â”€ MARKER CON ICONA CATEGORIA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ INIT MAPPA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function initMap(onReady) {
  fetch('assets/data/pois.json')
    .then(r => r.json())
    .then(data => { MAP_POI = data; })
    .catch(() => {})
    .finally(() => { _initMapCore(onReady); });
}

function _initMapCore(onReady) {
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
        attribution: 'Â© Esri, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN'
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

  // Click su canvas (fuori dai pin) â€” chiude quick card
  sardMap.on('click', () => closeQuickCard());

  // Quando la mappa Ã¨ pronta
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

// â”€â”€â”€ CITY LABELS (symbol layer MapLibre) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ CLUSTER LAYER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function addClusterLayer() {
  sardMap.addSource('poi-cluster', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    cluster: true,
    clusterMaxZoom: 12,
    clusterRadius: 52
  });

  sardMap.addLayer({
    id: 'cluster-circles',
    type: 'circle',
    source: 'poi-cluster',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step', ['get', 'point_count'],
        'rgba(0,180,216,0.88)', 15,
        'rgba(0,130,180,0.90)', 50,
        'rgba(2,90,140,0.93)'
      ],
      'circle-radius': [
        'step', ['get', 'point_count'],
        22, 15, 32, 50, 42
      ],
      'circle-stroke-width': 2.5,
      'circle-stroke-color': 'rgba(255,255,255,0.45)',
      'circle-blur': 0.05
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
      'text-size': ['step', ['get', 'point_count'], 12, 15, 14, 50, 16]
    },
    paint: { 'text-color': '#ffffff' }
  });

  sardMap.addLayer({
    id: 'unclustered-dots',
    type: 'circle',
    source: 'poi-cluster',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': ['match', ['get', 'cat'],
        'spiaggia',   '#00BFFF',
        'citt\u00e0', '#8899bb',
        'hotel',      '#C8102E',
        'ristorante', '#FF8C00',
        'attrazione', '#FFD700',
        'parco',      '#32CD32',
        'esperienza', '#B040FF',
        'porto',      '#0066CC',
        '#aaaaaa'
      ],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 5, 11, 7, 12, 0],
      'circle-stroke-width': 1.5,
      'circle-stroke-color': 'rgba(255,255,255,0.9)',
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 11.5, 1, 12, 0]
    }
  });

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

  sardMap.on('click', 'unclustered-dots', (e) => {
    e.stopPropagation();
    if (sardMap.getZoom() >= 12) return;
    const props = e.features && e.features[0] && e.features[0].properties;
    if (!props) return;
    const poi = MAP_POI.find(p => p.id === props.id);
    if (poi) showQuickCard(poi);
  });

  sardMap.on('mouseenter', 'cluster-circles',  () => { sardMap.getCanvas().style.cursor = 'pointer'; });
  sardMap.on('mouseleave', 'cluster-circles',  () => { sardMap.getCanvas().style.cursor = ''; });
  sardMap.on('mouseenter', 'unclustered-dots', () => { sardMap.getCanvas().style.cursor = 'pointer'; });
  let _dotPopup = null;
  sardMap.on('mousemove', 'unclustered-dots', (e) => {
    if (!e.features || !e.features.length) return;
    const props = e.features[0].properties;
    if (!_dotPopup) {
      _dotPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14, className: 'dot-hover-popup' });
    }
    _dotPopup.setLngLat(e.lngLat).setHTML('<span style="font:600 12px/1.4 system-ui;color:#111;white-space:nowrap">' + props.name + '</span>').addTo(sardMap);
  });
  sardMap.on('mouseleave', 'unclustered-dots', () => {
    if (_dotPopup) { _dotPopup.remove(); _dotPopup = null; }
  });

  sardMap.on('mouseleave', 'unclustered-dots', () => { sardMap.getCanvas().style.cursor = ''; });

  sardMap.on('zoom', syncMarkersToZoom);
}

function syncMarkersToZoom() {
  const z = sardMap.getZoom();
  const showDom = z >= 12;
  allMarkers.forEach(m => {
    const el = m.getElement();
    el.style.opacity = showDom ? '1' : '0';
    el.style.pointerEvents = showDom ? 'auto' : 'none';
  });
  const mgl = showDom ? 'none' : 'visible';
  if (sardMap.getLayer('cluster-circles'))  sardMap.setLayoutProperty('cluster-circles',  'visibility', mgl);
  if (sardMap.getLayer('cluster-count'))    sardMap.setLayoutProperty('cluster-count',    'visibility', mgl);
  if (sardMap.getLayer('unclustered-dots')) sardMap.setLayoutProperty('unclustered-dots', 'visibility', mgl);
}

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
    el.addEventListener('mouseenter', () => { el.firstElementChild.style.transform = 'scale(1.3)'; showHoverTooltip(poi, el); });
    el.addEventListener('mouseleave', () => { el.firstElementChild.style.transform = 'scale(1)'; hideHoverTooltip(); });
    el.addEventListener('click', (e) => { e.stopPropagation(); hideHoverTooltip(); showQuickCard(poi); });
    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([poi.lng, poi.lat])
      .addTo(sardMap);
    allMarkers.push(marker);
  });
  const filtered = activeMapFilter === 'all' ? MAP_POI : MAP_POI.filter(p => p.cat === activeMapFilter);
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

  // Imposta visibilitÃ  iniziale coerente con lo zoom corrente
  syncMarkersToZoom();
}

// â”€â”€â”€ QUICK CARD (primo click pin) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ FILTRI OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ RICERCA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ INFO PANEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Gradienti di fallback per categoria quando non c'Ã¨ foto
const CAT_GRADIENTS = {
  spiaggia:   'linear-gradient(160deg,#0a2a4a 0%,#0d5fa6 45%,#00bfff 100%)',
  cittÃ :      'linear-gradient(160deg,#1a1a2e 0%,#2d2d5a 50%,#4a4a8a 100%)',
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
    cittÃ :       'CittÃ ',
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
    const webDisplay = poi.web.replace(/^https?:\/\//, '').split(' Â·')[0];
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

function initMapFilters() {} // Legacy stub â€” filtri ora gestiti da overlay

// â”€â”€â”€ CLEANUP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function destroyMap() {
  if (sardMap) {
    allMarkers.forEach(m => m.remove());
    allMarkers = [];
    sardMap.remove();
    sardMap = null;
  }
}

// â”€â”€â”€ ESPORTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    <button class="rp-stop-remove" onclick="rpRemoveStop(this)" title="Rimuovi">âœ•</button>
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
    <div class="rp-stat"><div class="rp-stat-value">â€”</div><div class="rp-stat-label">Distanza</div></div>
    <div class="rp-stat"><div class="rp-stat-value">â€”</div><div class="rp-stat-label">Durata</div></div>`;

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
