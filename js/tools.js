// ============================================================
// tools.js — Tools Sardegna: Calendario, Spiagge, Camper, Sport
// ============================================================

'use strict';

// ─── DATI REALI (ricerca giugno 2026) ────────────────────────

const EVENTS_DATA = [
  { id: 1,  name: 'Carnevale Storico di Mamoiada', date: '2026-02-15', city: 'Mamoiada (NU)', category: 'tradizione', month: 2, description: 'I Mamuthones (maschere lignee nere, campanacci) e gli Issohadores sfilano in corteo. Prima uscita: 16-17 gennaio per S.Antonio Abate. Sfilata principale: domenica 15 febbraio. Martedi Grasso: 17 febbraio.', link: 'https://www.museodellemaschere.it' },
  { id: 2,  name: 'Sartiglia di Oristano', date: '2026-02-15', city: 'Oristano', category: 'tradizione', month: 2, description: 'Giostra equestre medievale (XV sec.). Domenica 15 febbraio (Gremio dei Falegnami) e Martedì 17 febbraio (Gremio dei Contadini). Biglietti 10–55€ su Tick@ da 4 febbraio. Una delle manifestazioni equestri più antiche d\'Europa.', link: 'https://www.sartiglia.info' },
  { id: 3,  name: 'Festa di Sant\'Efisio', date: '2026-05-01', city: 'Cagliari', category: 'tradizione', month: 5, description: '370ª edizione. 1–4 maggio. Processione storica dal 1657: statua del santo da Cagliari a Pula e ritorno, su carro trainato da buoi, scortata da migliaia in costume sardo. Ingresso gratuito. La più grande processione d\'Italia.', link: 'https://www.santefisio.it' },
  { id: 4,  name: 'Cavalcata Sarda', date: '2026-05-17', city: 'Sassari', category: 'tradizione', month: 5, description: '75ª edizione, 17 maggio 2026. 3.500 figuranti in costume da 100 comuni. Centinaia di cavalieri in sfilata per le vie di Sassari. Una delle manifestazioni folcloristiche più grandi d\'Italia.', link: 'https://www.cavalcatasarda.it' },
  { id: 5,  name: 'S\'Ardia di Sedilo', date: '2026-07-06', city: 'Sedilo (OR)', category: 'tradizione', month: 7, description: 'Corsa votiva a cavallo intorno al Santuario di San Costantino. 6-7 luglio fissi + ottava il 19 luglio. 2026: capocorsa Danilo Pes. Tra gli spettacoli equestri più adrenalinici e pericolosi del mondo.', link: '' },
  { id: 6,  name: 'Dromos Festival', date: '2026-07-18', city: 'Oristano e provincia', category: 'festival', month: 7, description: '18 luglio – 16 agosto 2026. Festival multidisciplinare: musica world, jazz, teatro e arti visive in siti storico-naturali del territorio oristanese. 2026 con Carmen Consoli, Subsonica, Mario Biondi e altri.', link: 'https://www.dromos.org' },
  { id: 7,  name: 'Faradda di li Candareri', date: '2026-08-14', city: 'Sassari', category: 'tradizione', month: 8, description: 'Patrimonio UNESCO. 14 agosto. Grandi candelabri di legno portati a spalla attraverso il centro di Sassari dai rappresentanti delle Gremio (corporazioni storiche). Origini medievali (XIV sec.).', link: 'https://www.ilcandeliere.it' },
  { id: 8,  name: 'Time in Jazz (Paolo Fresu)', date: '2026-08-08', city: 'Berchidda e 15 comuni', category: 'festival', month: 8, description: 'Edizione 2026 tema "Kind of Blue" — Miles Davis. 19-21 giugno (anteprima) + 8-16 agosto (festival principale). Concerti in piazze, cantine, boschi, nuraghi di 15 centri del nord Sardegna. Include workshop "I Colori della Musica" per bambini.', link: 'https://www.timeinjazz.it' },
  { id: 9,  name: 'Festa del Redentore', date: '2026-08-22', city: 'Nuoro', category: 'tradizione', month: 8, description: '125ª edizione, 22-23 e 29 agosto 2026. Processione con la statua del Redentore e sfilata in costumi barbaricini. Festival Tradizioni Popolari annesso. Una delle feste più sentite della Sardegna interna.', link: '' },
  { id: 10, name: 'Autunno in Barbagia — Cortes Apertas', date: '2026-09-26', city: 'Barbagia (NU)', category: 'sagra', month: 9, description: 'Da settembre a dicembre, ogni weekend un paese barbaricino apre le porte: cantine, laboratori artigianali, cucine tradizionali. Mamoiada, Oliena, Orgosolo, Dorgali, Tonara... Date 2026 da confermare su autunnoinbarbagia.it.', link: 'https://www.autunnoinbarbagia.it' },
  { id: 11, name: 'Sagra delle Castagne e delle Nocciole', date: '2026-10-24', city: 'Aritzo (NU)', category: 'sagra', month: 10, description: '47ª edizione. Stimato 24-25 ottobre 2026. 50.000 visitatori. Borgo montano (796m). Castagne arrostite, nocciole, pane, salsiccia sarda, vini locali. Costumi tradizionali, musica folk. Uno degli appuntamenti gastronomici autunnali più amati.', link: '' },
  { id: 12, name: 'Sagra del Pecorino', date: '2026-06-20', city: 'Simaxis (OR)', category: 'sagra', month: 6, description: '20 giugno 2026. Degustazione formaggi DOP (Pecorino Sardo, Fiore Sardo), ricotta, dolci tradizionali. Produttori locali, musica e costumi. Provincia di Oristano.', link: '' },
  { id: 13, name: 'Notte dei Nuraghi', date: '2026-07-11', city: 'Barumini (SU)', category: 'cultura', month: 7, description: 'Visita notturna al nuraghe UNESCO Su Nuraxi illuminato con spettacolo di luci e suoni. Prenotazione obbligatoria: prenotazioni@fondazionebarumini.it — posti limitati.', link: 'https://www.fondazionebarumini.it' },
  { id: 14, name: 'Giro di Sardegna Ciclistico', date: '2026-04-25', city: 'Tutta la Sardegna', category: 'sport', month: 4, description: '25 aprile – 1 maggio 2026. Corsa ciclistica a tappe attraverso le strade più belle dell\'isola. Tappa finale tradizionalmente a Cagliari. Evento internazionale UCI.', link: '' },
  { id: 15, name: 'Sa Sartiglia — Martedì Grasso', date: '2026-02-17', city: 'Oristano', category: 'tradizione', month: 2, description: '17 febbraio 2026. Il Gremio dei Contadini e la Sartiglia del Martedì Grasso. Replica con carattere più intimo rispetto alla domenica. Biglietti su Tick@ da 4 febbraio.', link: 'https://www.sartiglia.info' },
  { id: 16, name: 'Monumenti Aperti 2026', date: '2026-04-18', city: 'Tutta la Sardegna', category: 'cultura', month: 4, description: 'Apertura straordinaria e gratuita di monumenti, chiese e siti storici. Visite guidate da studenti. Weekend selezionati da aprile a novembre in 30+ comuni: Cagliari (18-19 apr), Sassari (2-3 mag), Alghero (16-17 mag), Villasimius/Pula (23-31 mag). Si prosegue in autunno.', link: 'https://sardegnatuttolanno.net/evento/monumenti-aperti-il-calendario-2026/' },
  { id: 17, name: 'Festival del Cinema di Tavolara', date: '2026-06-13', city: 'Porto San Paolo (OT)', category: 'cinema', month: 6, description: '13–26 giugno. Proiezioni cinematografiche all\'aperto con l\'isola di Tavolara come sfondo. Uno degli scenari naturali più spettacolari per un festival di cinema in Italia.', link: 'https://www.sardegnaturismo.it/it/eventi' },
  { id: 18, name: 'Vasco Rossi Live 2026', date: '2026-06-12', city: 'Olbia Arena', category: 'concerto', month: 6, description: '12–13 giugno. Due date del tour di Vasco Rossi all\'Olbia Arena. Evento di grande richiamo nazionale. Biglietti su TicketOne.', link: 'https://www.ticketone.it' },
  { id: 19, name: 'Focs de Sant Joan', date: '2026-06-20', city: 'Alghero', category: 'tradizione', month: 6, description: '20–24 giugno. Festa catalana del fuoco di San Giovanni. Falò, musica, balli tradizionali e fuochi d\'artificio nel centro storico catalano di Alghero. Celebrazione dei legami storici catalano-sardi.', link: '' },
  { id: 20, name: 'Red Valley Festival', date: '2026-08-13', city: 'Olbia', category: 'festival', month: 8, description: '13–15 agosto. Festival musicale estivo con artisti nazionali e internazionali. Uno degli eventi musicali più importanti della Sardegna nord-orientale.', link: '' },
  { id: 21, name: 'Negramaro in concerto', date: '2026-06-27', city: 'Golfo Aranci (SS)', category: 'concerto', month: 6, description: '27 giugno. Unica tappa sarda del tour dei Negramaro. Concerto in piazza a ingresso gratuito.', link: '' },
  { id: 22, name: 'Festival Internazionale dell\'Archeologia', date: '2026-06-24', city: 'Cabras (OR)', category: 'cultura', month: 6, description: '24–29 giugno. Festival dedicato all\'archeologia mediterranea. Conferenze, visite guidate, mostre. Location strategica vicino al sito di Tharros e al Museo del Mediterraneo.', link: 'https://www.sardegnaturismo.it/it/eventi' },
  { id: 23, name: 'Mare e Miniere', date: '2026-06-23', city: 'Portoscuso (SU)', category: 'festival', month: 6, description: '23–28 giugno. Festival che unisce musica etnica, tradizioni marinare e patrimonio minerario del Sulcis-Iglesiente. Concerti, visite alle ex miniere, gastronomia locale.', link: '' },
  { id: 24, name: 'Tutankhamon — La tomba, il tesoro, la scoperta', date: '2026-03-22', city: 'Cagliari', category: 'mostre', month: 3, description: '22 marzo – 31 luglio. Mostra immersiva sulla scoperta della tomba di Tutankhamon con riproduzioni fedeli al Bastione di Saint Remy. Vista panoramica sul Golfo degli Angeli inclusa.', link: '' },
  { id: 25, name: 'Autunno in Barbagia — Cortes Apertas', date: '2026-09-26', city: 'Barbagia (NU)', category: 'cultura', month: 9, description: 'Da settembre a dicembre, ogni weekend un paese della Barbagia apre porte e cortili: cantine, laboratori artigianali, cucine tradizionali. Mamoiada, Oliena, Orgosolo, Dorgali, Tonara e altri. Gratuito.', link: 'https://www.autunnoinbarbagia.it' }
];

// Dati verificati da sardegnaturismo.it, spiaggialapelosa.it, turismobaunei.eu — giugno 2026
const BEACHES_DATA = [
  {
    name: 'Cala Goloritzé',
    location: 'Baunei (OG)',
    type: 'Ciottoli bianchi e rosa · Golfo di Orosei',
    access: 'A piedi 3.5 km (-470m) da Su Porteddu, oppure via mare da Arbatax/Cala Gonone',
    cost: '7€ adulti · gratuito <6 anni e residenti Baunei',
    prenotazione: 'Obbligatoria — heartof sardinia.com o turismobaunei.eu',
    capienza: '250 posti/giorno',
    periodo: 'Maggio–ottobre · luglio-agosto molto affollata',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Cala_Goloritz%C3%A9_3.JPG',
    photoCredit: 'Mentnafunangann / CC BY-SA 3.0',
    lat: 40.0117, lng: 9.6228,
    badFrom: [0, 180]
  },
  {
    name: 'La Pelosa',
    location: 'Stintino (SS)',
    type: 'Sabbia bianca finissima · acque turchesi bassissime',
    access: 'Auto fino al parcheggio (400m dalla spiaggia) o bus navetta da Stintino',
    cost: '3,50€ ingresso · parcheggio separato',
    prenotazione: 'Obbligatoria — spiaggialapelosa.it · max 1.500 posti/giorno',
    capienza: '1.500 posti/giorno',
    periodo: 'Giugno–settembre · prenotare con anticipo in luglio-agosto',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Beach_Della_Pelosa_%28527708116%29.jpg',
    photoCredit: 'David Blaikie / CC BY 2.0',
    lat: 40.9961, lng: 8.2051,
    badFrom: [270, 360]
  },
  {
    name: 'Cala Luna',
    location: 'Dorgali (NU)',
    type: 'Sabbia dorata · grotte carsiche · falesia verticale',
    access: 'Via mare da Cala Gonone (30 min, 10-18€ A/R) · a piedi 2h da Cala Fuili',
    cost: 'Gratuita · battello obbligatorio o lungo trek',
    prenotazione: 'Non richiesta · battelli da Cala Gonone Crociere +39 0784 93305',
    capienza: 'Non regolamentata',
    periodo: 'Maggio–ottobre · estate molto frequentata',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Cala_Luna_%28Golfo_di_Orosei%29.jpg',
    photoCredit: 'Alessandro Mangione / CC BY-SA 4.0',
    lat: 40.2219, lng: 9.6548,
    badFrom: [0, 180]
  },
  {
    name: 'Spiaggia del Principe',
    location: 'Arzachena (SS)',
    type: 'Sabbia bianca granito rosa · Costa Smeralda',
    access: 'Auto SP59 dir. Porto Cervo, parcheggio a 800m · 12 min a piedi',
    cost: 'Gratuita · parcheggio a pagamento estate (~3-5€/h)',
    prenotazione: 'Non richiesta',
    capienza: 'Non regolamentata',
    periodo: 'Giugno–settembre · luglio-agosto affollata',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Spiaggia_del_Principe.jpg',
    photoCredit: 'Ökologix / CC0 Public Domain',
    lat: 41.0942, lng: 9.4673,
    badFrom: [270, 360]
  },
  {
    name: 'Su Giudeu',
    location: 'Domus de Maria (CA)',
    type: 'Dune sabbiose · Isola dei Gabbiani di fronte',
    access: 'Auto SP71, poi 1 km a piedi tra le dune · parcheggio gratuito',
    cost: 'Gratuita',
    prenotazione: 'Non richiesta',
    capienza: 'Non regolamentata',
    periodo: 'Maggio–settembre · frequentata ma mai sovraffollata',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Spiaggia_Su_Giudeu_2.jpg',
    photoCredit: 'Vid Pogacnik / CC BY-SA 4.0',
    lat: 38.8872, lng: 8.8726,
    badFrom: [180, 270]
  },
  {
    name: 'Poetto',
    location: 'Cagliari (CA)',
    type: '12 km sabbia fine · lidos attrezzati · acqua cristallina',
    access: 'Bus CTM dalla città (linea PF/PQ), in bici dalla Sella del Diavolo, auto',
    cost: 'Gratuita tratto libero · lido da 5€ · ombrellone da 8€',
    prenotazione: 'Non richiesta per tratto libero',
    capienza: 'Ampia',
    periodo: 'Anno intero · estate molto frequentata dagli abitanti',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_del_Poetto_Cagliari.jpg?width=800',
    photoCredit: 'Wikimedia / CC BY-SA',
    lat: 39.2062, lng: 9.1398,
    badFrom: [90, 200]
  },
  {
    name: 'Is Arutas',
    location: 'Cabras (OR)',
    type: 'Granelli di quarzo bianco — unica al mondo',
    access: 'Bus navetta obbligatoria in estate da parcheggio Sinis Park (3 km)',
    cost: 'Gratuita · navetta ~3€ A/R · parcheggio 3-5€',
    prenotazione: 'Non richiesta · navetta obbligatoria luglio-agosto',
    capienza: 'Non regolamentata (navetta limita l\'afflusso)',
    periodo: 'Maggio–ottobre · migliore maggio-giugno e settembre',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Is_arutas.jpg',
    photoCredit: 'ManuelM / Public Domain',
    lat: 40.0172, lng: 8.4372,
    badFrom: [240, 360]
  },
  {
    name: 'Cala Mariolu',
    location: 'Baunei (OG)',
    type: 'Ciottoli bianchi levigati · acque azzurro intenso',
    access: 'Solo via mare da Arbatax, Santa Maria Navarrese o Cala Gonone',
    cost: 'Gratuita · battello 15-25€ A/R',
    prenotazione: 'Non richiesta · battelli da più operatori',
    capienza: 'Non regolamentata',
    periodo: 'Giugno–settembre',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Cala_Mariolu.jpg',
    photoCredit: 'Marrabbio2 / CC BY-SA 3.0',
    lat: 40.1481, lng: 9.6386,
    badFrom: [0, 180]
  },
  {
    name: 'Tuerredda',
    location: 'Teulada (CA)',
    type: 'Sabbia bianca fine · isolotto raggiungibile a guado',
    access: 'Auto SP71 poi sterrata 3 km, o navetta estiva da Teulada',
    cost: 'Gratuita · parcheggio 5€/giorno estate',
    prenotazione: 'Non richiesta',
    capienza: 'Non regolamentata',
    periodo: 'Maggio–ottobre · migliore maggio e settembre',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Tuaredda.jpg',
    photoCredit: 'ilaria / CC BY 2.0',
    lat: 38.8731, lng: 8.8511,
    badFrom: [180, 270]
  },
  {
    name: 'Cala Brandinchi',
    location: 'San Teodoro (OT)',
    type: 'Sabbia bianca finissima · Tahiti del Mediterraneo',
    access: 'Auto SP13 dir. Cala Brandinchi, parcheggio a 200m',
    cost: 'Gratuita · parcheggio 3-5€ estate',
    prenotazione: 'Non richiesta',
    capienza: 'Non regolamentata',
    periodo: 'Giugno–settembre · anche in bassa stagione spettacolare',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Cala_Brandinchi_-_Cerde%C3%B1a_-_panoramio.jpg',
    photoCredit: 'Ramon Espiña Fernandez / CC BY-SA 3.0',
    lat: 40.7819, lng: 9.6561,
    badFrom: [0, 135]
  },
  {
    name: 'Porto Giunco',
    location: 'Villasimius (CA)',
    type: 'Due baie · laguna flamingo · Area Marina Protetta',
    access: 'Auto SP17, parcheggio a 300m · 8 km dal centro Villasimius',
    cost: 'Gratuita · parcheggio 3-5€',
    prenotazione: 'Non richiesta',
    capienza: 'Non regolamentata',
    periodo: 'Maggio–ottobre',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Porto_Giunco_beach_-_2.jpg',
    photoCredit: 'Muzzudan / CC BY-SA 4.0',
    lat: 39.1027, lng: 9.5281,
    badFrom: [90, 200]
  },
  {
    name: 'La Cinta',
    location: 'San Teodoro (OT)',
    type: '6 km sabbia bianca · laguna Stagno Lu Cibuddu',
    access: 'Auto, in bici da San Teodoro (2 km), parcheggio gratuito',
    cost: 'Gratuita',
    prenotazione: 'Non richiesta',
    capienza: 'Ampia',
    periodo: 'Anno intero · estate molto frequentata',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/La_Cinta_-_panoramio.jpg',
    photoCredit: 'Tom Rolvag / CC BY-SA 3.0',
    lat: 40.7694, lng: 9.6625,
    badFrom: [0, 135]
  }
];

// Dati verificati da CamperOnLine.it, Caramaps.com — giugno 2026
// Nota: normative restrittive in Sardegna per sosta libera aree costiere in alta stagione
const CAMPER_DATA = [
  { name: 'Bona Vida', city: 'Santa Teresa di Gallura (SS)', services: ['scarico', 'acqua', 'elettricita'], cost: '15-18€ BS / 22-28€ AS', coords: 'N 41.21173, E 9.18384', notes: 'Terreno non asfaltato. 1.5 km dal mare, vista panoramica. Vicino porto e traghetti Corsica. Apr–Ott.' },
  { name: 'Oasi Gallura (Vignola Mare)', city: 'Aglientu (SS)', services: ['scarico', 'acqua', 'elettricita', 'docce'], cost: '28-35€/notte', coords: 'Aglientu, nord Sardegna', notes: 'Vicino spiagge nord Gallura. Verificare apertura su Caramaps.' },
  { name: 'Agricamping La Tankitta', city: 'Stintino (SS)', services: ['scarico', 'acqua', 'elettricita', 'docce', 'bar'], cost: 'Verificare sito', coords: 'Stintino, vicino La Pelosa', notes: 'Vicino alla spiaggia La Pelosa (3 km). Agricamping con servizi completi. Prenotare in estate.' },
  { name: 'Area Sosta La Pineta', city: 'Stintino (SS)', services: ['acqua', 'elettricita'], cost: '30€/notte', coords: 'Stintino, SS', notes: 'Area ombreggiata. Utile per visitare La Pelosa. Estate.' },
  { name: 'Camping Village Laguna Blu', city: 'Alghero-Fertilia (SS)', services: ['scarico', 'acqua', 'elettricita', 'docce', 'wifi', 'bar'], cost: '35-50€/notte', coords: 'Fertilia, vicino Alghero', notes: 'Struttura completa. Vicino spiagge Maria Pia e Le Bombarde. Vicino aeroporto Alghero.' },
  { name: 'Area Sosta S\'Abba Druche', city: 'Bosa Marina (OR)', services: ['scarico', 'acqua'], cost: '28€/notte', coords: 'Bosa Marina, fiume Temo', notes: 'Sul lungofiume di Bosa Marina. Comoda per visitare Bosa centro storico e castello.' },
  { name: 'Area Sosta Arbus', city: 'Arbus (SU)', services: ['acqua', 'scarico'], cost: '15€/notte', coords: 'Arbus, Costa Verde', notes: 'Punto base per Costa Verde (Piscinas, Arbus). Dune più alte d\'Europa nelle vicinanze.' },
  { name: 'Camping Calacavallo', city: 'Oristano area', services: ['scarico', 'acqua', 'elettricita', 'docce'], cost: 'Verificare', coords: 'Area Oristano', notes: 'Verificare disponibilità su Caramaps. Buona base per Tharros e spiagge del Sinis.' },
  { name: 'Camping Car Palmasera', city: 'Cala Gonone-Dorgali (NU)', services: ['scarico', 'acqua', 'docce', 'bar'], cost: 'Verificare', coords: '40.2853°N, 9.6286°E', notes: 'Base ideale per Golfo di Orosei. Vicino imbarchi per Cala Luna e Cala Goloritzé.' },
  { name: 'Cala Sa Prama', city: 'Orosei (NU)', services: ['scarico', 'acqua', 'elettricita'], cost: 'Verificare', coords: 'Orosei, costa', notes: 'Vicino spiagge Orosei. Verificare disponibilità estate su Caramaps.' },
  { name: 'Tanca Orri', city: 'Tortoli (OG)', services: ['scarico', 'acqua', 'elettricita', 'docce'], cost: '30€/notte', coords: 'Tortoli, Ogliastra', notes: 'Base per Ogliastra, Baunei, Arbatax. Vicino porto Arbatax per traghetti Civitavecchia.' },
  { name: 'Area Sosta Dolianova', city: 'Dolianova (CA)', services: ['scarico', 'acqua', 'elettricita'], cost: '18€/notte', coords: 'Dolianova, Cagliari area', notes: 'Base economica vicino Cagliari (25 km). Anno intero. Silenzio garantito, zona rurale.' },
  { name: 'CamperSimius', city: 'Villasimius (CA)', services: ['scarico', 'acqua', 'elettricita', 'docce', 'wifi'], cost: '35-45€/notte', coords: '39.1249°N, 9.5227°E', notes: 'Base per Area Marina Protetta Villasimius. Porto Giunco, Simius, Cala Pira nelle vicinanze. Estate.' },
  { name: 'Area Sosta Chia', city: 'Domus de Maria-Chia (CA)', services: ['scarico', 'acqua'], cost: '25-30€/notte', coords: '38.8833°N, 8.8972°E', notes: 'Vicino spiagge di Chia (Su Giudeu, Tuerredda). Sud Sardegna. Estate.' },
  { name: 'Isola dei Gabbiani Camper Area', city: 'Palau-Porto Pollo (OT)', services: ['scarico', 'acqua', 'elettricita', 'docce', 'wifi', 'bar'], cost: '35-50€/notte', coords: 'Porto Pollo, Palau', notes: 'Su spot kite/windsurf Porto Pollo. Spiagge bianche, Maddalena vicina. Struttura completa. Estate.' }
];

// Operatori verificati da ricerca web giugno 2026
const SPORTS_DATA = [
  {
    name: 'Kayak',
    level: 'Principiante / Avanzato',
    season: 'Maggio – Ottobre',
    operators: [
      { name: 'Blue Dream (Cala Gonone)', tel: 'Vedi sito', web: 'spiaggiapalmasera.com/blue-dream', note: 'Noleggio kayak singoli e doppi + escursioni guidate' },
      { name: 'Prima Sardegna (Cala Gonone)', tel: 'Vedi sito', web: 'primasardegna.com', note: 'Tour guidati Golfo di Orosei' },
      { name: 'New Kayak Sardinia (Valledoria)', tel: 'Vedi sito', web: 'newkayaksardinia.com', note: 'Fiume Coghinas, discese, tutto l\'anno' }
    ],
    areas: ['Golfo di Orosei (Cala Luna, Cala Mariolu)', 'Fiume Coghinas (Valledoria)', 'Laguna di Nora']
  },
  {
    name: 'Arrampicata',
    level: 'Intermedio / Esperto',
    season: 'Settembre – Maggio (evitare luglio-agosto)',
    operators: [
      { name: 'Nannai Climbing Home (Ulassai)', tel: '+39 366 370 7749 / +39 334 770 9038', web: 'climbingulassai.com', note: 'Email: nannaiclimbinghome@gmail.com. WA preferito. Camp da 500€' },
      { name: 'Fellas Outdoors (Ulassai)', tel: 'Vedi sito', web: 'fellasoutdoors.com', note: 'Guida alpina certificata Mandy, base Ulassai' },
      { name: 'Big Alpine Guide (Supramonte)', tel: 'Vedi sito', web: 'bigalpineguide.com', note: 'Guide alpine, Supramonte e Golfo di Orosei' }
    ],
    areas: ['Ulassai / Jerzu / Osini (mecca climbing sardo)', 'Domusnovas (750 vie, ottimale inverno)', 'Supramonte / Pedra Longa']
  },
  {
    name: 'Surf & Kitesurf',
    level: 'Principiante / Pro',
    season: 'Anno intero (maestrale ottimale ottobre-aprile)',
    operators: [
      { name: 'ProKite Sardegna (Punta Trettu)', tel: 'Vedi sito', web: 'prokitesardegna.com', note: 'Centro IKO certificato. Corsi da 70€/sessione' },
      { name: 'Kite House Sardinia (Punta Trettu)', tel: 'Vedi sito', web: 'kitehousesardinia.com', note: 'Resort kitesurf completo' },
      { name: 'Capo Mannu Surf Center', tel: 'Vedi sito', web: 'capomannu.it', note: 'Windsurf, kitesurf, wingfoil, SUP. Spot onde leggendario' }
    ],
    areas: ['Punta Trettu (SU) — hub kite europeo, Italian Big Air 2026', 'Capo Mannu (OR) — surf e windsurf oceanic style', 'Porto Pollo (Palau) — spot kite/wind nord']
  },
  {
    name: 'Diving & Snorkeling',
    level: 'Tutti i livelli (corsi PADI disponibili)',
    season: 'Maggio – Ottobre (picco luglio-settembre)',
    operators: [
      { name: 'SubAquaDive Service (Villasimius)', tel: 'Vedi sito', web: 'subaquadive.it', note: 'Dal 1974. Snorkeling 40€, singola 60€, doppia 110€ (tutto incluso)' },
      { name: 'Argonauta Diving (La Maddalena)', tel: 'Vedi sito', web: 'divinglamaddalena.com', note: '30+ anni attività. Mezza giornata 80€, giornata 150€' },
      { name: 'Nautisub / Capo Galera (Alghero)', tel: 'Vedi sito', web: 'capo-galera.com', note: 'Capo Caccia, grotte subacquee, pareti di posidonia' }
    ],
    areas: ['AMP Capo Carbonara (Villasimius) — posidonia, relitti WWII', 'Arcipelago La Maddalena — granito, limpidezza 40m', 'Capo Caccia (Alghero) — grotte subacquee spettacolari']
  },
  {
    name: 'Mountain Bike & E-Bike',
    level: 'Tutti i livelli',
    season: 'Primavera / Autunno (evitare luglio-agosto)',
    operators: [
      { name: 'Sardinia Cycling (Cagliari/Costa Smeralda)', tel: 'Vedi sito', web: 'sardiniacycling.com', note: 'Dal 2008. MTB, gravel, e-bike, bici da strada. 2 sedi' },
      { name: 'Bike4More', tel: 'Vedi sito', web: 'bike4more.com', note: 'Tour mono e multi-giorno con guida o GPS autonomo' },
      { name: 'Explora Bike Planet (Siniscola)', tel: 'Vedi sito', web: 'explorabikeplanet.com', note: 'Zona Baronia e Siniscola, area Golfo di Orosei' }
    ],
    areas: ['Gennargentu e Supramonte (sentieri panoramici)', 'Gallura (percorsi tra graniti e macchia)', 'Baronia-Siniscola (costa e interno)']
  },
  {
    name: 'Trekking',
    level: 'Tutti i livelli (dal facile all\'estremo)',
    season: 'Marzo – Giugno / Settembre – Novembre',
    operators: [
      { name: 'Orosei AdvenTours (Golfo di Orosei)', tel: 'Vedi sito', web: 'golfodioro.com', note: 'Selvaggio Blu: 800-1200€ tutto incluso. 7gg, 45km' },
      { name: 'Level24 (Supramonte)', tel: 'Vedi sito', web: 'level24.it', note: 'Guide alpine certificate, trekking Supramonte' },
      { name: 'Trenino Verde ARST', tel: '+39 070 580246', web: 'treninoverde.com', note: '4 percorsi storici, 10-22€ a tratta, stagionale' }
    ],
    areas: ['Selvaggio Blu (7gg, difficile, costa Supramonte)', 'Gola di Gorropu (il Grand Canyon sardo)', 'Sentiero Italia Sardegna (percorso completo)', 'Monte Corrasi (Oliena, 1463m, panorama Barbagia)']
  }
];

const SERVICE_ICONS = {
  scarico:     { icon: 'SC', label: 'Scarico acque' },
  acqua:       { icon: 'H2O', label: 'Acqua potabile' },
  elettricita: { icon: 'EL', label: 'Elettricità' },
  docce:       { icon: 'DOC', label: 'Docce' },
  wifi:        { icon: 'WiFi', label: 'WiFi' },
  bar:         { icon: 'BAR', label: 'Bar/Ristorante' }
};

const MONTH_NAMES = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

// ─── CANTINE DATA ─────────────────────────────────────────────
const CANTINE_DATA = [
  { id:1, name:'Argiolas', city:'Serdiana', zona:'sud', vitigni:['Cannonau','Vermentino','Monica','Nasco'], servizi:['visita','degustazione','acquisto','ristorante'], desc:'Una delle cantine più celebrate di Sardegna, produce il Turriga — vino-icona dell\'isola. Fondata nel 1918, oggi è sinonimo di qualità internazionale con presenze nelle migliori wine list mondiali.', web:'https://www.argiolas.it', tel:'+39 070 740606', indirizzo:'Via Roma 56/58, Serdiana (CA)' },
  { id:2, name:'Cantina di Santadi', city:'Santadi', zona:'sulcis', vitigni:['Carignano del Sulcis','Vermentino','Monica'], servizi:['visita','degustazione','acquisto'], desc:'Cooperativa del Sulcis fondata nel 1960. Il Terre Brune Carignano del Sulcis è tra i rossi più premiati di Sardegna. Vitigni centenari ad alberello nella macchia mediterranea.', web:'https://www.cantinasantadi.it', tel:'+39 0781 950127', indirizzo:'Via Su Pranu 12, Santadi (SU)' },
  { id:3, name:'Sella & Mosca', city:'Alghero', zona:'nord', vitigni:['Vermentino','Cannonau','Torbato','Cagnulari'], servizi:['visita','degustazione','acquisto','museo'], desc:'Storica tenuta fondata nel 1899 ad Alghero — oltre 500 ettari vitati, una delle più grandi d\'Italia. Celebre per il Torbato, vitigno rarissimo di origini catalane coltivato solo qui.', web:'https://www.sellaemosca.com', tel:'+39 079 997700', indirizzo:'Loc. I Piani, Alghero (SS)' },
  { id:4, name:'Cantina Sociale di Jerzu', city:'Jerzu', zona:'centro', vitigni:['Cannonau','Vermentino'], servizi:['visita','degustazione','acquisto'], desc:'Nel cuore dell\'Ogliastra, patria del Cannonau più antico e robusto. La cooperativa raccoglie le uve di una delle zone a più lunga tradizione vinicola sarda. Vini potenti e longevi.', web:'https://www.antichicantinedijerzu.it', tel:'+39 0782 70028', indirizzo:'Via Umberto I 1, Jerzu (NU)' },
  { id:5, name:'Tenute Dettori', city:'Sennori', zona:'nord', vitigni:['Cannonau','Monica','Vermentino','Moscato'], servizi:['visita','degustazione','acquisto'], desc:'Produzione biologica e biodinamica nel Romangia, a nord di Sassari. Alessandro Dettori è tra i vignaioli più originali d\'Italia — vini non filtrati, rifermentati in bottiglia, di grande personalità.', web:'https://www.tenutedetteri.com', tel:'+39 079 514711', indirizzo:'Loc. Badde Nigolosu, Sennori (SS)' },
  { id:6, name:'Mesa', city:'Sant\'Anna Arresi', zona:'sulcis', vitigni:['Carignano del Sulcis','Vermentino','Buio'], servizi:['visita','degustazione','acquisto'], desc:'Design contemporaneo nel Sulcis, fondata nel 2004. Il Buio Buio Carignano è il vino più iconico. Architettura moderna immersa nei vigneti del sud-ovest, scenografica al tramonto.', web:'https://www.cantinamesa.com', tel:'+39 0781 965777', indirizzo:'S.P. 75 km 1.5, Sant\'Anna Arresi (SU)' },
  { id:7, name:'Contini', city:'Cabras', zona:'centro', vitigni:['Vernaccia di Oristano','Vermentino','Nieddera'], servizi:['visita','degustazione','acquisto'], desc:'Dal 1898, custodi della Vernaccia di Oristano — il vino ambrato dell\'isola stagionato in botti di castagno. Un\'esperienza unica tra i vini ossidativi più particolari del Mediterraneo.', web:'https://www.vinicontini.com', tel:'+39 0783 290806', indirizzo:'Via Genova 48/50, Cabras (OR)' },
  { id:8, name:'Santa Maria La Palma', city:'Sassari', zona:'nord', vitigni:['Vermentino','Cannonau','Cagnulari'], servizi:['visita','degustazione','acquisto'], desc:'Cooperativa vicino ad Alghero celebre per il Vermentino di Sardegna DOC. Immersa nei vigneti della piana algherese, produce vini freschi, minerali e di grande profilo aromatico.', web:'https://www.santamariapalma.it', tel:'+39 079 999008', indirizzo:'Loc. Santa Maria La Palma, Sassari (SS)' },
  { id:9, name:'Pala', city:'Serdiana', zona:'sud', vitigni:['Cannonau','Vermentino','Nuragus','Monica'], servizi:['visita','degustazione','acquisto'], desc:'Tenuta familiare fondata nel 1950, tra le più rispettate del Campidano. Il Stellato Cannonau e il Vermentino di Sardegna sono i vini di punta — eleganti, identitari, longevi.', web:'https://www.pala.it', tel:'+39 070 740284', indirizzo:'Via Verdi 7, Serdiana (CA)' },
  { id:10, name:'Cantina Olianas', city:'Gergei', zona:'centro', vitigni:['Cannonau','Sangiovese','Vermentino'], servizi:['visita','degustazione','acquisto'], desc:'In Marmilla a 500 metri sul livello del mare. Vigneti ad alta quota con escursione termica marcata — Cannonau eleganti e freschi con tannini setosi. Cantina biodinamica certificata.', web:'https://www.cantinaolianas.com', tel:'+39 0782 808066', indirizzo:'Loc. Su Narboni, Gergei (SU)' },
  { id:11, name:'Ferruccio Deiana', city:'Settimo San Pietro', zona:'sud', vitigni:['Cannonau','Vermentino','Monica','Cagnulari'], servizi:['visita','degustazione','acquisto'], desc:'Azienda familiare a pochi chilometri da Cagliari. Vini artigianali da vitigni autoctoni con metodi tradizionali. Il Sileno Cannonau è il vino di punta — strutturato e speziato.', web:'https://www.ferrucciodeiana.it', tel:'+39 070 749117', indirizzo:'Via Umberto I 29, Settimo San Pietro (CA)' },
  { id:12, name:'Cantina di Dorgali', city:'Dorgali', zona:'centro', vitigni:['Cannonau','Vermentino','Malvasia'], servizi:['visita','degustazione','acquisto'], desc:'Affacciata sul Supramonte, produce Cannonau da uve raccolte a 700 metri. Vini potenti e longevi — la cooperativa è punto di riferimento per il Cannonau di Sardegna DOC Nepente di Oliena.', web:'https://www.cantinedorgali.com', tel:'+39 0784 96143', indirizzo:'Via Piave 11, Dorgali (NU)' }
];

// ─── MUSEI DATA ───────────────────────────────────────────────
const MUSEI_DATA = [
  { id:1, name:'Museo Archeologico Nazionale', city:'Cagliari', tipo:'archeologia', orari:'Mar–Dom 9:00–20:00', biglietto:'5 €', desc:'La più importante collezione di antichità sarde: bronzetti nuragici, ceramiche fenicie, gioielli romani. Imprescindibile per capire la civiltà nuragica e le culture che si sono succedute nell\'isola.', web:'https://museoarcheologicocagliari.cultura.gov.it', indirizzo:'Piazza Arsenale 1, Cagliari' },
  { id:2, name:'Museo delle Maschere Mediterranee', city:'Mamoiada', tipo:'etnografia', orari:'Mar–Dom 9:00–13:00 / 15:00–19:00', biglietto:'5 €', desc:'Raccolta straordinaria di maschere rituali sarde e mediterranee. Sede dei Mamuthones — le maschere nere di Mamoiada, protagoniste del carnevale più antico e suggestivo della Sardegna.', web:'https://www.museodellemaschere.it', indirizzo:'Piazza Europa 15, Mamoiada (NU)' },
  { id:3, name:'MAN – Museo d\'Arte Provincia di Nuoro', city:'Nuoro', tipo:'arte', orari:'Mar–Dom 10:00–13:00 / 16:00–20:00', biglietto:'5 €', desc:'Il museo d\'arte contemporanea di riferimento per la Sardegna. Ospita opere di grandi artisti sardi e mostre temporanee internazionali di rilievo con nomi dell\'arte contemporanea globale.', web:'https://www.museoman.it', indirizzo:'Via Satta 15, Nuoro (NU)' },
  { id:4, name:'Museo Civico G.A. Sanna', city:'Sassari', tipo:'archeologia', orari:'Mar–Dom 9:00–20:00', biglietto:'3 €', desc:'Il principale museo del nord Sardegna. Sezione archeologica con reperti dalla preistoria al periodo romano e sezione etnografica con costumi tradizionali e oggetti di vita quotidiana.', web:'https://www.musei.sassari.it', indirizzo:'Via Roma 64, Sassari (SS)' },
  { id:5, name:'Museo del Bisso', city:'Sant\'Antioco', tipo:'storia', orari:'Lun–Sab 10:00–12:00 / 16:00–18:00', biglietto:'Gratuito', desc:'Chiara Vigo è l\'ultima tessitrice di bisso marino al mondo — la fibra prodotta dal mollusco Pinna nobilis. Un\'esperienza unica candidata all\'UNESCO come patrimonio immateriale dell\'umanità.', web:'https://www.santantioco.net', indirizzo:'Via Regina Margherita 69, Sant\'Antioco (SU)' },
  { id:6, name:'Museo del Carbone', city:'Carbonia', tipo:'storia', orari:'Mar–Dom 9:00–19:00', biglietto:'7 €', desc:'Nel sito minerario di Serbariu racconta la storia delle miniere di carbone del Sulcis e degli operai che le hanno vissute. Include visita vera alla galleria sotterranea — emozionante.', web:'https://www.museodelcarbone.it', indirizzo:'Via Liguria, Carbonia (SU)' },
  { id:7, name:'Museo Etnografico Sardo', city:'Nuoro', tipo:'etnografia', orari:'Mar–Dom 9:00–20:00', biglietto:'3 €', desc:'La più grande collezione di costumi tradizionali sardi — gioielli, tessuti, abiti festivi delle 377 comunità dell\'isola. Un viaggio nell\'identità sarda profonda e nella sua straordinaria varietà locale.', web:'https://www.isre.it', indirizzo:'Via Antonio Mereu 56, Nuoro (NU)' },
  { id:8, name:'Museo d\'Arte Siamese', city:'Cagliari', tipo:'arte', orari:'Mar–Dom 9:00–20:00', biglietto:'4 €', desc:'Straordinaria collezione di arte asiatica donata dal diplomatico Stefano Cardu nel 1914. Oltre 1.500 opere tra sculture, ceramiche, lacche e avori dal Siam (Thailandia) e dal Giappone.', web:'https://musei.cagliari.it', indirizzo:'Piazza Indipendenza, Cagliari' },
  { id:9, name:'Galleria Comunale d\'Arte', city:'Cagliari', tipo:'arte', orari:'Mar–Dom 9:00–21:00', biglietto:'4 €', desc:'La pinacoteca di Cagliari ospita la Collezione Ingrao con oltre 400 opere di arte moderna — da Boldini a De Chirico. Sede di grandi mostre temporanee. Vista panoramica dai Bastioni.', web:'https://www.galleriacomunalecagliari.it', indirizzo:'Largo Giuseppe Dessì, Cagliari' },
  { id:10, name:'Museo di Ozieri', city:'Ozieri', tipo:'archeologia', orari:'Mar–Dom 9:00–13:00 / 15:00–18:00', biglietto:'3 €', desc:'Custodisce i reperti della Cultura di Ozieri (3500–2700 a.C.) — una delle più antiche civiltà preistoriche del Mediterraneo. Ceramiche decorate e statuine votive di rara bellezza.', web:'https://www.comune.ozieri.ss.it', indirizzo:'Ex Convento delle Clarisse, Ozieri (SS)' },
  { id:11, name:'Museo Regionale di Scienze Naturali', city:'Cagliari', tipo:'natura', orari:'Mar–Dom 9:00–19:00', biglietto:'3 €', desc:'Fauna, flora e geologia della Sardegna — dagli ambienti costieri alle foreste interne. Sezione dedicata alla fauna endemica: cervo sardo, muflone, aquila di Bonelli e grifone.', web:'https://www.musei.cagliari.it', indirizzo:'Cittadella dei Musei, Cagliari' },
  { id:12, name:'Museo Speleo Paleontologico di Carbonia', city:'Carbonia', tipo:'natura', orari:'Lun–Sab 9:00–13:00 / 16:00–19:00', biglietto:'2 €', desc:'Dedicato alla paleontologia e alla speleologia del Sulcis. Espone reperti fossili di fauna pleistocenica e reperti dalle grotte della zona, inclusi resti di cervo sardo e capra selvatica preistorici.', web:'https://www.comune.carbonia.su.it', indirizzo:'Via Costituente, Carbonia (SU)' }
];

// ─── SENTIERI DATA ────────────────────────────────────────────
const SENTIERI_DATA = [
  { id:1,  name:'Selvaggio Blu', zona:'Ogliastra / Golfo di Orosei', difficolta:'esperta',  lunghezza:45, dislivello:'+6800 m', durata:'6–8 giorni', tipo:'costa',    desc:'Il trekking più famoso e selvaggio di Sardegna — traversata costiera da Pedra Longa a Cala Sisine tra falesie a picco sul mare, calette inaccessibili e boschi primordiali. Richiede esperienza alpinistica e corde.',                                                                  partenza:'Pedra Longa (Baunei)', web:'https://www.selvaggioblu.it' },
  { id:2,  name:'Gola di Gorropu', zona:'Supramonte', difficolta:'media', lunghezza:12, dislivello:'+400 m', durata:'4–5 ore', tipo:'montagna', desc:'La gola più profonda d\'Europa (500 m di pareti verticali) scavata dal Rio Flumineddu nel Supramonte. Un\'esperienza mozzafiato tra rocce calcaree gigantesche. Con guida obbligatoria per l\'interno della gola.',                        partenza:'Ponte Sa Barva, Urzulei', web:'https://www.gorropu.com' },
  { id:3,  name:'Tiscali — Villaggio Nuragico in Grotta', zona:'Supramonte di Oliena', difficolta:'media', lunghezza:8, dislivello:'+480 m', durata:'3–4 ore', tipo:'nuragico', desc:'Villaggio nuragico nascosto all\'interno di una dolina carsica nel Supramonte. Dimenticato per secoli, riemerso nel XIX secolo. Atmosfera straordinaria tra stalattiti e resti di abitazioni dell\'età del ferro.',                           partenza:'Valle di Lanaitto, Oliena', web:'https://www.sardegnaturismo.it' },
  { id:4,  name:'Cala Luna via Cala Fuili', zona:'Golfo di Orosei', difficolta:'media', lunghezza:7, dislivello:'+320 m', durata:'3 ore', tipo:'costa', desc:'Da Cala Gonone si raggiunge la spiaggia più bella di Sardegna via sentiero costiero. Viste sul Golfo di Orosei, ginepri millenari, mare turchese. Si torna in barca (prenotazione consigliata).',                                                      partenza:'Cala Fuili, Cala Gonone', web:'https://www.dorgaliturismo.it' },
  { id:5,  name:'Punta La Marmora', zona:'Gennargentu', difficolta:'difficile', lunghezza:14, dislivello:'+900 m', durata:'5–6 ore', tipo:'montagna', desc:'La vetta più alta della Sardegna (1834 m). Dal rifugio si sale attraverso boschi di lecci e pascoli altomontani. Panorama a 360° su tutta l\'isola. In inverno ramponi necessari.',                                                               partenza:'Fonni o Desulo', web:'https://www.gennargentu.it' },
  { id:6,  name:'Codula di Luna', zona:'Golfo di Orosei', difficolta:'difficile', lunghezza:24, dislivello:'+600 m', durata:'8–10 ore A/R', tipo:'costa', desc:'La "Valle della Luna" scende dal Supramonte fino a Cala Luna attraversando boschi di tasso e lecci, sorgenti d\'acqua dolce e grotte preistoriche. Una delle escursioni più belle e impegnative di Sardegna.',                                          partenza:'Santa Mama, Urzulei', web:'https://www.sardegnaturismo.it' },
  { id:7,  name:'Monte Limbara — Punta Balistreri', zona:'Gallura', difficolta:'facile', lunghezza:6, dislivello:'+380 m', durata:'2–3 ore', tipo:'montagna', desc:'Il massiccio granitico della Gallura con panorami fino alla Corsica. Sentiero ben segnato tra boschi di querce e affioramenti rocciosi. Meta ideale per famiglie con bambini grandi.',                                                               partenza:'Tempio Pausania', web:'https://www.sardegnaturismo.it' },
  { id:8,  name:'Capo Caccia — Escala del Cabirol', zona:'Alghero', difficolta:'facile', lunghezza:4, dislivello:'+172 m', durata:'1–2 ore', tipo:'costa', desc:'654 gradini scavati nella falesia scendono verso Grotta di Nettuno, la più spettacolare grotta marina di Sardegna. Vista sul Golfo di Alghero e sul mare turchese del promontorio. Imperdibile.',                                                              partenza:'Capo Caccia, Alghero', web:'https://www.grottadinettuno.it' },
  { id:9,  name:'Su Suercone — Foresta di Montarbu', zona:'Barbagia di Seui', difficolta:'media', lunghezza:10, dislivello:'+550 m', durata:'3–4 ore', tipo:'foresta', desc:'Attraverso la foresta demaniale di Montarbu tra roverelle, tassi plurisecolari e lecci. Fauna ricca: cervi sardi, cinghiali, volpi. In primavera il sottobosco è tappezzato di fiori selvatici.',                                                   partenza:'Seui (NU)', web:'https://www.sardegnaturismo.it' },
  { id:10, name:'Nuraghe Arrubiu — Giro Didattico', zona:'Orroli', difficolta:'facile', lunghezza:3, dislivello:'+80 m', durata:'1–2 ore', tipo:'nuragico', desc:'Il più grande nuraghe polilobato di Sardegna (5 torri, 7000 mq) in un contesto paesaggistico di macchia mediterranea. Visita guidata disponibile. Museo annesso con reperti dell\'età del bronzo.',                                                          partenza:'Orroli (SU)', web:'https://www.sardegnaturismo.it' },
  { id:11, name:'Supramonte di Orgosolo — Valle Lanaittu', zona:'Nuoro', difficolta:'media', lunghezza:12, dislivello:'+450 m', durata:'4–5 ore', tipo:'foresta', desc:'Nel cuore del Supramonte di Orgosolo, attraverso la Valle di Sa Oche e Lanaittu. Sorgenti, grotte e foresta primordiale di lecci. Probabile avvistamento di cervi sardi e mufloni.',                                                                  partenza:'Orgosolo (NU)', web:'https://www.sardegnaturismo.it' },
  { id:12, name:'Spiaggia del Principe — Punta Capaccia', zona:'Costa Smeralda', difficolta:'facile', lunghezza:5, dislivello:'+150 m', durata:'1–2 ore', tipo:'costa', desc:'Sentiero costiero tra i promontori granitici della Costa Smeralda fino alla "Spiaggia del Principe". Macchia mediterranea profumata, mare cristallino e calette deserte tra le rocce.',                                                             partenza:'Romazzino, Porto Cervo', web:'https://www.gallura.com' }
];

// ─── RISTORANTI DATA ──────────────────────────────────────────
const RISTORANTI_DATA = [
  { id:1,  name:'Dal Corsaro', city:'Cagliari', tipo:'tipico', fascia:'alto', michelin:true,  desc:'Uno dei ristoranti più eleganti di Cagliari, con stella Michelin. Cucina sarda contemporanea che reinterpreta i classici dell\'isola con tecnica e creatività. Carta vini eccezionale.',                                                                                                         indirizzo:'Viale Regina Margherita 28, Cagliari', tel:'+39 070 664318', web:'https://www.ristorantecorsaro.it', specialita:['Malloreddus al ragù','Aragosta sarda','Burrida'] },
  { id:2,  name:'Su Gologone', city:'Oliena (NU)', tipo:'tipico', fascia:'medio', michelin:false, desc:'Agriturismo-ristorante nell\'oasi naturale del Supramonte. Cucina nuorese autentica: porcetto allo spiedo, malloreddus, culurgiones. Meta di chef internazionali. Ambiente rustico-elegante tra oliveti e ginepri.',                                                                         indirizzo:'Loc. Su Gologone, Oliena (NU)', tel:'+39 0784 287512', web:'https://www.sugologone.it', specialita:['Porcetto allo spiedo','Culurgiones','Malloreddus'] },
  { id:3,  name:'Sa Cardiga e su Schironi', city:'Capoterra (CA)', tipo:'pesce', fascia:'alto', michelin:false, desc:'Istituzione gastronomica da oltre 50 anni. Pesce freschissimo dello stagno di Santa Gilla — muggine, anguilla, bivalvi. Bottarga di muggine propria, la migliore della Sardegna.',                                                                                            indirizzo:'Loc. Santa Gilla, Capoterra (CA)', tel:'+39 070 71652', web:'https://www.sacardiga.it', specialita:['Bottarga di muggine','Anguilla arrosto','Muggine al sale'] },
  { id:4,  name:'Il Ristorante di Alghero', city:'Alghero (SS)', tipo:'pesce', fascia:'alto', michelin:false, desc:'Cucina di mare eccellente ad Alghero — aragosta alla catalana, spaghetti alle arselle, frittura di paranza. Vista sul porto storico. Prenotazione indispensabile in estate.',                                                                                                   indirizzo:'Via Cavour 39, Alghero (SS)', tel:'+39 079 973353', web:'https://www.ristorantecaladinettuno.it', specialita:['Aragosta alla catalana','Spaghetti alle arselle','Orata arrosto'] },
  { id:5,  name:'Agriturismo Sa Mandra', city:'Alghero (SS)', tipo:'tipico', fascia:'economico', michelin:false, desc:'L\'agriturismo più famoso del nord Sardegna. Pranzo e cena fissi con formaggi, salumi, pasta fresca, agnello e maiale tutto dalla fattoria. Esperienza autentica a prezzi giusti.',                                                                                         indirizzo:'Loc. Mamuntanas, Alghero (SS)', tel:'+39 079 999150', web:'https://www.agriturismosamandraalghero.com', specialita:['Agnello allo spiedo','Formaggi artigianali','Pane carasau'] },
  { id:6,  name:"L'Agnata di De André", city:'Tempio Pausania (SS)', tipo:'tipico', fascia:'medio', michelin:false, desc:'L\'agriturismo dove Fabrizio De André visse dieci anni in Gallura. Cucina gallurese tradizionale: suppa cuata, porcetto, dolci sardi. Atmosfera unica tra i graniti e i ginepri.',                                                                                        indirizzo:'Loc. L\'Agnata, Tempio Pausania (SS)', tel:'+39 079 671384', web:'https://www.agnata.it', specialita:['Suppa cuata','Porcetto gallurese','Seadas al miele'] },
  { id:7,  name:'Ristorante Gallura', city:'Olbia (SS)', tipo:'pesce', fascia:'medio', michelin:false, desc:'Un classico di Olbia dal 1963. Cucina gallurese con influenze marine — pesce del giorno, aragosta, sa minestra gallurese. Ambiente familiare, servizio attento. Ottima selezione di Vermentino di Gallura.',                                                                         indirizzo:'Corso Umberto I 145, Olbia (SS)', tel:'+39 0789 24648', web:'https://www.ristorantegallura.it', specialita:['Sa minestra gallurese','Aragosta','Pesce del giorno'] },
  { id:8,  name:'Sa Pischera', city:'Oristano (OR)', tipo:'pesce', fascia:'medio', michelin:false, desc:'Cucina di stagno e di mare a Oristano — specialità della laguna: muggine in carpione, bottarga fresca, arselle. Il ristorante lavora con i pescatori locali di Cabras ogni mattina.',                                                                                                   indirizzo:'Via Cagliari 34, Oristano (OR)', tel:'+39 0783 74596', web:'https://www.sapischera.it', specialita:['Bottarga fresca di Cabras','Muggine in carpione','Gnocchetti alle arselle'] },
  { id:9,  name:'Agriturismo Deriu', city:'Bultei (SS)', tipo:'tipico', fascia:'economico', michelin:false, desc:'Nel cuore della Sardegna rurale — pasta fresca, porcetto, seadas con miele. Tutto viene dall\'orto e dall\'allevamento proprio. Un\'esperienza di vita contadina vera a prezzi accessibili.',                                                                                    indirizzo:'Loc. Badu Piscina, Bultei (SS)', tel:'+39 079 795009', web:'https://www.agriturismoderiu.it', specialita:['Seadas al miele','Porcetto','Pasta fresca'] },
  { id:10, name:'Josto by Pierluigi Fais', city:'Cagliari', tipo:'tipico', fascia:'medio', michelin:false, desc:'La cantina gastronomica più interessante di Cagliari — cicchetti sardi, piatti condivisi, vini naturali. Pierluigi Fais ha reinventato la cucina locale con leggerezza e ironia. Sempre pieno, prenotare.',                                                                      indirizzo:'Via Baylle 48, Cagliari', tel:'+39 070 7346857', web:'https://www.jostoristorante.it', specialita:['Cicchetti sardi','Crudi di pesce','Vini naturali'] },
  { id:11, name:'Il Pescatore', city:'Villasimius (CA)', tipo:'pesce', fascia:'medio', michelin:false, desc:'Affacciato sul porto di Villasimius, cucina di mare semplice e buona. Aragosta, spaghetti allo scoglio, fritto misto. Qualità garantita dai pescatori locali. Terrazza sul porto imperdibile.',                                                                                       indirizzo:'Via del Porto, Villasimius (CA)', tel:'+39 070 791148', web:'#', specialita:['Spaghetti allo scoglio','Aragosta','Fritto misto'] },
  { id:12, name:'Agriturismo Pirastru', city:'Nuoro (NU)', tipo:'carne', fascia:'economico', michelin:false, desc:'Nella campagna del Nuorese, tavola con prodotti propri — maiale, agnello, formaggi, pane carasau fatto al mattino. Prezzi popolari, porzioni generose, atmosfera familiare.',                                                                                                  indirizzo:'SS 389 km 5, Nuoro (NU)', tel:'+39 0784 256712', web:'#', specialita:['Agnello al forno','Formaggi freschi','Pane carasau'] }
];

// ─── HOTEL DATA ───────────────────────────────────────────────
const HOTEL_DATA = [
  { id:1,  name:'Forte Village Resort', city:'Santa Margherita di Pula (CA)', stelle:5, tipo:'resort', fascia:'lusso', desc:'Uno dei migliori resort d\'Europa — 50 ettari sul mare con spiagge private, 20 ristoranti, spa, campi da tennis e suite con butler. Meta dei VIP di mezzo mondo da 30 anni.',                                                                             indirizzo:'S.S. 195 km 39.600, Pula (CA)', tel:'+39 070 921 9000', web:'https://www.fortevillage.com', servizi:['spa','spiaggia privata','piscine','20 ristoranti','tennis','golf'] },
  { id:2,  name:'Hotel Cala di Volpe', city:'Porto Cervo (SS)', stelle:5, tipo:'hotel', fascia:'lusso', desc:'Icona della Costa Smeralda disegnata da Jacques Couelle nel 1963. Architettura che imita un villaggio di pescatori sardo, immersa in una baia privata. Punto d\'incontro dell\'élite internazionale.',                                                            indirizzo:'Loc. Cala di Volpe, Porto Cervo (SS)', tel:'+39 0789 976111', web:'https://www.hotelcaladivolpe.com', servizi:['spiaggia privata','piscina','ristorante','spa','porto privato','tennis'] },
  { id:3,  name:'Su Gologone Experience Hotel', city:'Oliena (NU)', stelle:4, tipo:'boutique', fascia:'alto', desc:'Il boutique hotel più caratteristico di Sardegna, nato da un agriturismo nel Supramonte. Camere decorate da artisti sardi, cucina nuorese stellata, spa con pietre locali. Natura autentica.',                                                                    indirizzo:'Loc. Su Gologone, Oliena (NU)', tel:'+39 0784 287512', web:'https://www.sugologone.it', servizi:['spa','ristorante','piscina','trekking guidato','arte sarda'] },
  { id:4,  name:'T Hotel', city:'Cagliari', stelle:4, tipo:'hotel', fascia:'alto', desc:'Il design hotel di riferimento di Cagliari — 207 camere nel cuore della città con terrazza panoramica sul golfo. Cucina sarda contemporanea, centro congressi, posizione strategica.',                                                                                               indirizzo:'Via dei Giudicati 66, Cagliari', tel:'+39 070 47400', web:'https://www.thotel.it', servizi:['piscina','ristorante','palestra','spa','parcheggio','centro congressi'] },
  { id:5,  name:'Pullman Timi Ama Sardegna', city:'Villasimius (CA)', stelle:5, tipo:'resort', fascia:'lusso', desc:'Resort sul mare di Villasimius con accesso diretto a spiaggia di sabbia bianca finissima. Piscine, ristorante di pesce fresco, thalasso. Ideale per famiglie e coppie.',                                                                                       indirizzo:'Loc. Timi Ama, Villasimius (CA)', tel:'+39 070 79711', web:'https://www.timiama.it', servizi:['spiaggia privata','piscine','spa thalasso','ristorante','animazione'] },
  { id:6,  name:'Arbatax Park Resort', city:'Arbatax (NU)', stelle:4, tipo:'resort', fascia:'alto', desc:'Bungalow e ville nella pineta tra le rocce rosse porfiriche di Arbatax. Spiagge di quarzo rosa, piscine, centro benessere, watersport e mountain bike. Direttamente sul mare dell\'Ogliastra.',                                                                          indirizzo:'Loc. Porto Frailis, Arbatax (NU)', tel:'+39 0782 667890', web:'https://www.arbataxpark.com', servizi:['spiaggia privata','piscine','spa','mountain bike','ristoranti'] },
  { id:7,  name:'Hotel Calabona', city:'Alghero (SS)', stelle:4, tipo:'hotel', fascia:'medio', desc:'Hotel elegante ad Alghero con accesso diretto alla spiaggia di Calabona. Camere luminose, piscina olimpionica sul mare, ristorante con cucina locale. A 5 minuti dal centro storico catalano.',                                                                              indirizzo:'Loc. Calabona, Alghero (SS)', tel:'+39 079 975728', web:'https://www.hotelcalabona.it', servizi:['spiaggia privata','piscina olimpionica','ristorante','bar','parcheggio'] },
  { id:8,  name:'Agriturismo Sa Mandra', city:'Alghero (SS)', stelle:0, tipo:'agriturismo', fascia:'economico', desc:'Il più famoso agriturismo del nord Sardegna — camere in una vera fattoria con cavalli, maiali, pecore. Colazione con formaggi e marmellate fatte in casa. Autentico e accessibile.',                                                                          indirizzo:'Loc. Mamuntanas, Alghero (SS)', tel:'+39 079 999150', web:'https://www.agriturismosamandraalghero.com', servizi:['colazione inclusa','piscina','equitazione','ristorante','fattoria didattica'] },
  { id:9,  name:'Capo d\'Orso Thalasso & SPA', city:'Palau (SS)', stelle:4, tipo:'resort', fascia:'alto', desc:'Resort panoramico tra i graniti del nord Sardegna, vista arcipelago della Maddalena. Centro thalasso rinomato, ristorante di pesce, spiaggia privata nella baia di Palau.',                                                                                         indirizzo:'Loc. Capo d\'Orso, Palau (SS)', tel:'+39 0789 702000', web:'https://www.hotelcapodorso.com', servizi:['thalasso','spiaggia privata','piscina','ristorante','vela'] },
  { id:10, name:'Hotel Nautilus', city:'Villasimius (CA)', stelle:3, tipo:'hotel', fascia:'medio', desc:'A 100 metri dalla spiaggia di Campus, hotel a gestione familiare con camere luminose e accoglienti. Posizione eccellente per esplorare Capo Carbonara. Ottima colazione con dolci sardi.',                                                                               indirizzo:'Via Gardenia, Villasimius (CA)', tel:'+39 070 7918188', web:'https://www.hotelnautilusvillasimius.it', servizi:['piscina','bar','colazione','parcheggio','wifi'] },
  { id:11, name:"L'Agnata di De André", city:'Tempio Pausania (SS)', stelle:0, tipo:'agriturismo', fascia:'medio', desc:'L\'agriturismo dove Fabrizio De André visse dieci anni. Camere nelle vecchie stalle restaurate tra i graniti della Gallura. Cucina gallurese, vigneto proprio, atmosfera unica.',                                                                           indirizzo:'Loc. L\'Agnata, Tempio Pausania (SS)', tel:'+39 079 671384', web:'https://www.agnata.it', servizi:['colazione inclusa','ristorante','piscina','trekking','vigneto'] },
  { id:12, name:'B&B Sa Domu Antiga', city:'Cagliari', stelle:0, tipo:'boutique', fascia:'medio', desc:'B&B di charme nel centro storico di Cagliari (quartiere Castello). Camere con arredi antichi e dettagli sardi originali. Terrazza panoramica sul golfo, una delle viste più belle della città.',                                                                           indirizzo:'Via Lamarmora 14, Cagliari', tel:'+39 070 651231', web:'#', servizi:['colazione inclusa','terrazza panoramica','wifi','aria condizionata','posizione centrale'] }
];

// ─── ARTIGIANI DATA ───────────────────────────────────────────
const ARTIGIANI_DATA = [
  { id:1,  name:'Laboratorio Tessitura Deroma', city:'Nule', zona:'nord', specialita:'tessuti', prodotti:['Tappeti a pibiones','Tovaglie ricamate','Coperte in lana'], desc:'Nule è la capitale del tappeto sardo a "pibiones" — chicchi di riso in rilievo su fondo geometrico. Il laboratorio conserva i telai tradizionali verticali producendo secondo i pattern tramandati da secoli.', web:'https://www.comunenule.it', tel:'+39 079 725028', indirizzo:'Via Roma, Nule (SS)' },
  { id:2,  name:'Filigrana Milia', city:'Dorgali', zona:'centro', specialita:'gioielli', prodotti:['Filigrana in argento','Sa spilla','Bottoni sardi','Anelli tradizionali'], desc:'La filigrana sarda in argento è riconoscibile per le torsioni a spirale. Il laboratorio Milia produce gioielli nuoresi tradizionali — sa spilla cerimoniale, bottoni a filigrana e parure complete per il costume sardo.', web:'https://www.dorgaliturismo.it', tel:'+39 0784 96025', indirizzo:'Via Lamarmora 12, Dorgali (NU)' },
  { id:3,  name:'Coltelleria Pattada', city:'Pattada', zona:'nord', specialita:'coltelli', prodotti:['Resolza tradizionale','Coltelli da caccia','Pezzi personalizzati'], desc:'Pattada è la capitale mondiale del coltello sardo — la "resolza" con lama a foglia di mirto e manico in corno di muflone. Ogni mastro ha il proprio stile. Bottega visitabile con dimostrazione di lavorazione.', web:'https://www.pattada.net', tel:'+39 079 755049', indirizzo:'Piazza del Popolo, Pattada (SS)' },
  { id:4,  name:'Ceramiche Pozzo Giagu', city:'Sassari', zona:'nord', specialita:'ceramica', prodotti:['Ceramica decorata','Piatti e brocche','Azulejos sardi'], desc:'La ceramica sassarese con influenze catalane — decorazioni geometriche in blu, giallo e verde su fondo bianco. Il laboratorio produce oggetti d\'uso e decorativi mantenendo la tradizione medievale nata sotto la dominazione aragonese.', web:'https://www.ceramicasassari.it', tel:'+39 079 232178', indirizzo:'Via Rosello 18, Sassari (SS)' },
  { id:5,  name:'Intreccio Castelsardo', city:'Castelsardo', zona:'nord', specialita:'cestineria', prodotti:['Ceste in giunco','Portafrutta','Copricapo sardi'], desc:'Il cestino intrecciato con giunco sardo è un\'arte tramandata di madre in figlia. Pattern geometrici in nero e naturale unici al mondo — ogni cesta richiede giorni di lavoro manuale. Patrimonio immateriale riconosciuto.', web:'https://www.castellodoria.it', tel:'+39 079 479125', indirizzo:'Vicolo Marina, Castelsardo (SS)' },
  { id:6,  name:'Intaglio Legno Murru', city:'Desulo', zona:'centro', specialita:'legno', prodotti:['Maschere lignee','Statue religiose','Oggetti decorativi'], desc:'Desulo è il centro dell\'intaglio del legno sardo — pero selvatico e castagno. Il laboratorio Murru produce maschere tradizionali del carnevale, sculture di santi e oggetti decorativi intagliati a mano con strumenti tramandati.', web:'https://www.comune.desulo.nu.it', tel:'+39 0784 619012', indirizzo:'Via Funtana, Desulo (NU)' },
  { id:7,  name:'Sughero Design Calangianus', city:'Calangianus', zona:'nord', specialita:'sughero', prodotti:['Borse in sughero','Portafogli','Oggettistica design'], desc:'Calangianus è la capitale mondiale del sughero — il 70% della produzione italiana viene da qui. Dalla tradizionale industria dei tappi si è passati al design contemporaneo: borse, scarpe, accessori moda e oggettistica.', web:'https://www.calangianus.it', tel:'+39 079 661103', indirizzo:'Via Porto Torres, Calangianus (SS)' },
  { id:8,  name:'Arazzi Sarule', city:'Sarule', zona:'centro', specialita:'tessuti', prodotti:['Arazzi figurativi','Tappeti narrativi','Cuscini ricamati'], desc:'Sarule è famosa per gli arazzi figurativi — scene di vita contadina, pastori, cerimonie tessute a telaio con lane multicolori. Ogni arazzo è un racconto visivo unico, collezionati da musei e gallerie d\'arte internazionali.', web:'https://www.comune.sarule.nu.it', tel:'+39 0784 281009', indirizzo:'Via Garibaldi, Sarule (NU)' },
  { id:9,  name:'Ceramiche di Assemini', city:'Assemini', zona:'sud', specialita:'ceramica', prodotti:['Terracotta tradizionale','Maioliche decorate','Presepi sardi'], desc:'Assemini è il principale centro della ceramica cagliaritana — terracotta rossa decorata con motivi floreali e geometrici, maioliche con smalti brillanti. Tradizione risalente al periodo punico, forni artigianali ancora attivi.', web:'https://www.comune.assemini.ca.it', tel:'+39 070 945001', indirizzo:'Via Vittorio Emanuele, Assemini (CA)' },
  { id:10, name:'Merletti a Tombolo Bosa', city:'Bosa', zona:'centro', specialita:'merletti', prodotti:['Tombolo a fuselli','Pizzi decorativi','Tovaglie e corredi'], desc:'Il merletto di Bosa a tombolo con fuselli è tra i più raffinati della Sardegna. Le "bosane" lavorano il filo di lino con tecniche spagnole del XVI secolo — pizzi delicatissimi per corredi nuziali e abiti da cerimonia.', web:'https://www.visitbosa.it', tel:'+39 0785 373107', indirizzo:'Corso Vittorio Emanuele, Bosa (OR)' },
  { id:11, name:'Oreficeria Sarda Contu', city:'Oristano', zona:'centro', specialita:'gioielli', prodotti:['Corallo rosso','Gioielli in filigrana d\'oro','Parure per costume sardo'], desc:'Il corallo rosso del Golfo di Alghero lavorato in oro è uno dei gioielli più preziosi della Sardegna. Il laboratorio Contu produce collane, orecchini e spille secondo le tecniche orafe tradizionali per i costumi cerimoniali.', web:'https://www.oristanodoc.it', tel:'+39 0783 71329', indirizzo:'Piazza Roma, Oristano (OR)' },
  { id:12, name:'Orbace Desulo', city:'Desulo', zona:'centro', specialita:'tessuti', prodotti:['Orbace (panno di lana)','Cappotti tradizionali','Bisacce del pastore'], desc:'L\'orbace è il robusto panno di lana impermeabile dei pastori sardi — grigio scuro, tessuto a telaio con lana di pecora sarda. Il laboratorio di Desulo è uno dei pochi a mantenere questa tradizione millenaria ora rivalutata dal design contemporaneo.', web:'https://www.sardegnadesign.it', tel:'+39 0784 619098', indirizzo:'Via Montagna, Desulo (NU)' }
];

// ─── GUIDE DATA ───────────────────────────────────────────────
const GUIDE_DATA = [
  { id:1,  name:'Cooperativa Gorropu', city:'Urzulei', zona:'centro', tipo:'trekking', lingue:['IT','EN','DE','FR'], desc:'La guida ufficiale della Gola di Gorropu — obbligatoria per l\'ingresso nella gola interna. Escursioni nel Supramonte di Urzulei, trekking multi-giorno, noleggio attrezzatura. Soci tutti guide alpine certificate.', web:'https://www.gorropu.com', tel:'+39 0782 649282' },
  { id:2,  name:'Ghivine', city:'Dorgali', zona:'centro', tipo:'mare', lingue:['IT','EN','DE'], desc:'Escursioni in barca e kayak nel Golfo di Orosei — la costa più selvaggia del Mediterraneo. Tour alle calette inaccessibili via terra: Cala Mariolu, Cala Sisine, Cala Biriola. Barche veloci, guide esperte.', web:'https://www.ghivine.com', tel:'+39 0784 96721' },
  { id:3,  name:'Cooperativa Barbagia Cortes', city:'Orgosolo', zona:'centro', tipo:'culturale', lingue:['IT','EN'], desc:'Guide locali per le tradizioni barbaricine — tour murales di Orgosolo, visita ai pastori transumanti, degustazione formaggi nel caseificio, feste tradizionali. Un\'immersione nell\'identità sarda più profonda.', web:'https://www.orgosolo.com', tel:'+39 0784 402572' },
  { id:4,  name:'Argonauta Sub', city:'Villasimius', zona:'sud', tipo:'mare', lingue:['IT','EN','DE'], desc:'Diving center nell\'Area Marina Protetta di Capo Carbonara. Corsi PADI, noleggio attrezzatura, tour snorkeling. Acque cristalline, pesci napoleone, gorgonie e relitti storici. Uno dei siti sub più belli del Mediterraneo.', web:'https://www.argonauta.it', tel:'+39 070 791355' },
  { id:5,  name:'Vivereilmare Alghero', city:'Alghero', zona:'nord', tipo:'mare', lingue:['IT','EN','ES'], desc:'Escursioni in kayak e a piedi nel nord Sardegna — dalla Grotta di Nettuno via barca al kayak sul Golfo di Alghero, fino al trekking di Capo Caccia. Guide certificate con specializzazione mare e speleologia.', web:'https://www.vivereilmare.net', tel:'+39 079 977000' },
  { id:6,  name:'Sardinia Walking & Trekking', city:'Cagliari', zona:'sud', tipo:'trekking', lingue:['IT','EN','DE','NL'], desc:'L\'agenzia più completa per cammini e trekking in Sardegna — dal Cammino di Santa Barbara al Selvaggio Blu. Pacchetti multi-giorno con trasporti, alloggi e portatori. La migliore offerta walking dell\'isola.', web:'https://www.sardiniawalking.com', tel:'+39 070 670345' },
  { id:7,  name:'Trekking Selvaggio Blu', city:'Baunei', zona:'centro', tipo:'trekking', lingue:['IT','EN','FR'], desc:'Gli specialisti del Selvaggio Blu — il trekking costiero più famoso d\'Italia. Guide alpine con anni di esperienza sulla costa ogliastrina. Traversata completa in 6-8 giorni e versioni ridotte per tutti i livelli.', web:'https://www.selvaggioblu.it', tel:'+39 0782 610034' },
  { id:8,  name:'Gennargentu Guide Alpine', city:'Fonni', zona:'centro', tipo:'trekking', lingue:['IT','EN','DE'], desc:'Guide alpine per le ascensioni al Gennargentu — Punta La Marmora (1834 m), Bruncu Spina, Arcu Correboi. Escursioni in ogni stagione, invernali con ramponi e ciaspole. Massima sicurezza in alta quota.', web:'https://www.gennargentu.it', tel:'+39 0784 57048' },
  { id:9,  name:'Cagliari Walking Tour', city:'Cagliari', zona:'sud', tipo:'culturale', lingue:['IT','EN','ES','FR','DE'], desc:'Tour a piedi del centro storico di Cagliari — dal quartiere Castello alle chiese romaniche, dal Mercato San Benedetto ai bastioni panoramici. Guide storiche specializzate in arte punica, romana e medievale.', web:'https://www.cagliariwalkingtour.it', tel:'+39 070 674393' },
  { id:10, name:'Tour Gastronomici Sardegna', city:'Oristano', zona:'centro', tipo:'gastronomico', lingue:['IT','EN'], desc:'Tour gastronomici ai prodotti sardi — visite a caseifici, cantine Vermentino e Cannonau, aziende di bottarga, mercati locali. Degustazioni guidate con abbinamenti vini. Itinerari da mezza giornata a tre giorni.', web:'https://www.sardegnafoodtour.it', tel:'+39 0783 356012' },
  { id:11, name:'Nuraghi & Archeologia Tour', city:'Sassari', zona:'nord', tipo:'culturale', lingue:['IT','EN','DE'], desc:'Guide archeologhe nei siti nuragici — Su Nuraxi (UNESCO), Mont\'e Prama, tombe dei giganti. Spiegazioni approfondite sulla civiltà nuragica e le culture prenuragiche. Anche tour in lingua straniera.', web:'https://www.sardiniaarchaeology.it', tel:'+39 079 231456' },
  { id:12, name:'Escursì Sardegna', city:'Cagliari', zona:'sud', tipo:'esperienze', lingue:['IT','EN','DE','ES','FR'], desc:'La principale piattaforma sarda per tour ed esperienze — oltre 200 attività prenotabili online. Dalle immersioni al trekking, dalla degustazione di vini ai tour culturali. Guide locali selezionate e recensite dai clienti.', web:'https://www.escursi.com/', tel:'+39 070 600400' }
];

// ─── COMUNI DATA ──────────────────────────────────────────────
const COMUNI_DATA = [
  { id:1,  name:'Alghero',             prov:'SS', zona:'nord', pop:'44.000', alt:'7 m',   desc:'La "Barceloneta sarda" — 300 anni di dominazione aragonese hanno lasciato un centro medievale unico con torri, bastioni e la lingua catalana (algherese) ancora viva. La città più animata e bella del nord.',    cosa_vedere:['Centro storico con torri','Grotta di Nettuno','Capo Caccia','Spiagge del Lido'], web:'https://www.comune.alghero.ss.it' },
  { id:2,  name:'Cagliari',            prov:'CA', zona:'sud',  pop:'154.000',alt:'6 m',   desc:'La capitale — quartiere Castello sulle rocce, il Poetto lungo 8 km, fenicotteri in città e spiagge a 5 minuti dal centro. Vivace, cosmopolita, con scena gastronomica e culturale in forte ascesa.',              cosa_vedere:['Quartiere Castello','Bastioni Saint Remy','Anfiteatro romano','Stagno Molentargius','Poetto'], web:'https://www.comune.cagliari.it' },
  { id:3,  name:'Dorgali',             prov:'NU', zona:'centro',pop:'8.500', alt:'387 m', desc:'Il gateway per il Golfo di Orosei e il Supramonte. Partenza per Cala Gonone, Gorropu, Tiscali e le calette più belle del Mediterraneo. Artigianato in filigrana e Cannonau di primissimo livello.',            cosa_vedere:['Cala Gonone (7 km)','Gola di Gorropu','Tiscali','Grotta del Bue Marino'], web:'https://www.dorgaliturismo.it' },
  { id:4,  name:'Baunei',              prov:'NU', zona:'centro',pop:'3.700', alt:'614 m', desc:'Include la costa ogliastrina più spettacolare — Pedra Longa, Cala Biriola, Cala Mariolu. Base di partenza del Selvaggio Blu. Il Supramontese è uno dei paesaggi più selvaggi d\'Italia.',                         cosa_vedere:['Pedra Longa','Selvaggio Blu','Santa Maria Navarrese','Cala Mariolu'], web:'https://www.comune.baunei.og.it' },
  { id:5,  name:'Bosa',                prov:'OR', zona:'centro',pop:'7.900', alt:'9 m',   desc:'La città dipinta di colori — casette multicolori lungo il Temo, il fiume navigabile più lungo della Sardegna. Castello Malaspina dall\'alto, palmeti lungo le rive. Borgo medievale di straordinaria bellezza.',       cosa_vedere:['Castello Malaspina','Centro storico colorato','Fiume Temo','Spiagge del Serro'], web:'https://www.visitbosa.it' },
  { id:6,  name:'Castelsardo',         prov:'SS', zona:'nord', pop:'5.600', alt:'61 m',  desc:'Borgo medievale su promontorio basaltico nel Golfo dell\'Asinara — castello dei Doria, case a cascata verso il porto. Centro mondiale dell\'intreccio del giunco sardo.',                                             cosa_vedere:['Castello dei Doria','Museo dell\'Intreccio','Porto storico','Lu Bagnu'], web:'https://www.comune.castelsardo.ss.it' },
  { id:7,  name:'Villasimius',         prov:'CA', zona:'sud',  pop:'3.400', alt:'45 m',  desc:'La perla del Capo Carbonara — spiagge turchesi di livello caraibico, Area Marina Protetta, fondi marini straordinari. Meta preferita dei turisti in costa sud-est. Vivacissima in estate.',                            cosa_vedere:['Spiaggia del Riso','Campus','Capo Carbonara','Stagno di Notteri (fenicotteri)'], web:'https://www.comune.villasimius.ca.it' },
  { id:8,  name:'Mamoiada',            prov:'NU', zona:'centro',pop:'2.500', alt:'637 m', desc:'La patria dei Mamuthones — maschere nere tra le più antiche della Sardegna, carnevale preistorico unico in Europa. Museo delle Maschere di livello europeo, Cannonau eccellente.',                                    cosa_vedere:['Museo Maschere Mediterranee','Carnevale (Febbraio)','Cantine Cannonau'], web:'https://www.comune.mamoiada.nu.it' },
  { id:9,  name:'Orgosolo',            prov:'NU', zona:'centro',pop:'4.200', alt:'620 m', desc:'La città dei murales — oltre 200 dipinti murali politici e sociali, il più grande museo a cielo aperto della Sardegna. Paesaggio del Supramonte e identità pastorale barbagia fortissima.',                           cosa_vedere:['Murales','Supramonte','Valle Lanaittu','Trekking guidato'], web:'https://www.comune.orgosolo.nu.it' },
  { id:10, name:'Oliena',              prov:'NU', zona:'centro',pop:'6.800', alt:'379 m', desc:'Ai piedi del Supramonte — sorgente di Su Gologone (una delle più grandi d\'Europa), cantina e ristorante Su Gologone, Nepente d\'Oliena citato da D\'Annunzio. Cucina nuorese di altissimo livello.',               cosa_vedere:['Sorgente Su Gologone','Tiscali','Supramonte','Cantina Su Gologone'], web:'https://www.comune.oliena.nu.it' },
  { id:11, name:'Santa Teresa Gallura',prov:'SS', zona:'nord', pop:'5.300', alt:'14 m',  desc:'L\'estremo nord di fronte alla Corsica. Spiagge di Rena Bianca e Capo Testa tra le rocce granitiche più spettacolari dell\'isola. In estate meta degli amanti del windsurf per il forte vento di tramontana.',         cosa_vedere:['Capo Testa','Rena Bianca','Valle della Luna','Traghetti per Corsica'], web:'https://www.comune.santateresagallura.ot.it' },
  { id:12, name:'Pula',                prov:'CA', zona:'sud',  pop:'7.400', alt:'29 m',  desc:'A mezz\'ora da Cagliari — sito fenicio-punico di Nora (il più antico della Sardegna), spiagge di sabbia bianca, pineta. Il Forte Village è qui. Base ideale per il sud-ovest.',                                      cosa_vedere:['Sito di Nora','Spiaggia di Nora','Forte Village Resort','Stagno di Nora'], web:'https://www.comune.pula.ca.it' },
  { id:13, name:'Carbonia',            prov:'SU', zona:'sud',  pop:'26.000',alt:'111 m', desc:'Città di fondazione fascista (1938) per le miniere di carbone del Sulcis — architettura razionalista unica in Italia, Museo del Carbone con visita alle gallerie sotterranee. Pezzo di storia spesso trascurato.',   cosa_vedere:['Museo del Carbone','Miniera di Serbariu','Piazza Roma razionalista','Monte Sirai'], web:'https://www.comune.carbonia.su.it' },
  { id:14, name:'Tempio Pausania',     prov:'SS', zona:'nord', pop:'13.800',alt:'567 m', desc:'La capitale della Gallura — graniti rosa, sughere monumentali, il carnevale più famoso del nord Sardegna. A 30 km dal mare di Palau, vicino all\'agriturismo L\'Agnata di De André.',                                 cosa_vedere:['Centro storico in granito','Carnevale','Lago del Limbara','L\'Agnata'], web:'https://www.comune.tempiopausania.ot.it' },
  { id:15, name:'Oristano',            prov:'OR', zona:'centro',pop:'31.000',alt:'9 m',  desc:'La capitale del Campidano — Sa Sartiglia (il più spettacolare corteo equestre sardo, a Carnevale), stagni con fenicotteri, bottarga di Cabras, Vernaccia. Centro di una Sardegna spesso ignorata.',                  cosa_vedere:['Sa Sartiglia (Carnevale)','Stagno di Cabras','Terme di Fordongianus','Tharros'], web:'https://www.comune.oristano.or.it' },
  { id:16, name:'Sassari',             prov:'SS', zona:'nord', pop:'120.000',alt:'225 m',desc:'La seconda città — università millenaria, centro medievale, Faradda di li Canderieri (Ferragosto) candidata UNESCO, Museo Sanna. Vivace e universitaria con forte identità culturale propria.',                       cosa_vedere:['Faradda di li Canderieri','Museo Sanna','Piazza d\'Italia','Fontana di Rosello'], web:'https://www.comune.sassari.it' }
];

// ─── PRODOTTI DATA ────────────────────────────────────────────
const PRODOTTI_DATA = [
  { id:1,  name:'Pane Carasau',                  categoria:'gastronomia', zona:'Barbagia / tutta la Sardegna', cert:'PAT',   desc:'Il "pane della carta" o "carta da musica" — sfoglia croccante di semola di grano duro cotta due volte. Conserva settimane: era il pane dei pastori transumanti. Con olio e sale diventa pane guttiau.',                                          dove:'Forni artigianali, mercati locali, botteghe alimentari', link:'https://www.sardegnaenogastronomia.it' },
  { id:2,  name:'Bottarga di Muggine di Cabras', categoria:'gastronomia', zona:'Cabras (OR)',                  cert:'DOP',   desc:'Le uova di muggine essiccate e pressate — il "caviale del Mediterraneo". La bottarga di Cabras è la più pregiata: colore ambrato, profumo intenso. Si grattugia sulla pasta o si affetta sulle bruschette.',                                   dove:'Produttori a Cabras, pescherie Oristano, online', link:'https://www.bottargacabras.com' },
  { id:3,  name:'Pecorino Sardo',                categoria:'gastronomia', zona:'Sardegna intera',              cert:'DOP',   desc:'Il formaggio simbolo della Sardegna — "dolce" (20-60 gg) morbido e lattico, "maturo" (oltre 2 mesi) asciutto e piccante. Solo latte di pecora sarda. Fondamentale in ogni tavola isolana.',                                                       dove:'Caseifici, mercati, botteghe alimentari', link:'https://www.pecorinosardodop.it' },
  { id:4,  name:'Cannonau di Sardegna',          categoria:'vini',        zona:'Ogliastra / Barbagia',         cert:'DOC',   desc:'Il re dei vini sardi — Grenache con oltre 3.000 anni di storia. Rosso potente (min. 12.5%), ricco di polifenoli. Studiato come segreto della longevità degli ogliastrini. Tre sottotipi: Classico, Oliena, Capo Ferrato.',           dove:'Cantine, enoteche, online', link:'https://www.consorziocannonau.it' },
  { id:5,  name:'Vermentino di Gallura',         categoria:'vini',        zona:'Gallura (SS)',                 cert:'DOCG',  desc:'L\'unica DOCG della Sardegna — bianco secco, profumo floreale, sapore fresco con leggera nota amaricante finale. Perfetto con aragosta e pesce. Prodotto solo in Gallura, nel nord-est dell\'isola.',                                    dove:'Cantine di Gallura, enoteche', link:'https://www.vermentinogallura.com' },
  { id:6,  name:'Vernaccia di Oristano',         categoria:'vini',        zona:'Oristano / Cabras',            cert:'DOC',   desc:'Il vino ambrato — ossidato in botti di castagno come i grandi Sherry spagnoli. Secco, complesso, sentori di mandorla e fiori d\'arancio. Custodito dalle Cantine Contini dal 1898. Da meditazione.',                                   dove:'Cantine Contini, enoteche sarde', link:'https://www.vinicontini.com' },
  { id:7,  name:'Mirto Sardo',                   categoria:'liquori',     zona:'Sardegna intera',              cert:'PAT',   desc:'Il liquore delle bacche di mirto selvatico raccolte a mano da novembre a dicembre. Versione rossa (bacche mature) intensa e speziata, versione bianca (fiori) più delicata. Il digestivo dell\'isola.',                                  dove:'Distillerie artigianali, botteghe, aeroporto', link:'https://www.sardegnaenogastronomia.it' },
  { id:8,  name:'Zafferano di Sardegna',         categoria:'gastronomia', zona:'San Gavino Monreale (VS)',     cert:'DOP',   desc:'Coltivato nel Medio Campidano — tra i più pregiati al mondo per colore intenso e aroma potente. San Gavino è la capitale italiana dello zafferano con sagra a ottobre.',                                                                     dove:'Produttori locali, botteghe, online', link:'https://www.zafferanosardodop.it' },
  { id:9,  name:'Miele di Corbezzolo',           categoria:'gastronomia', zona:'Sardegna intera',              cert:'PAT',   desc:'Unico al mondo — amaro in entrata con retrogusto dolce e balsamico. Prodotto solo in Sardegna e Corsica dalle fioriture autunnali (ott-nov). Il miele di asfodelo (primavera) è invece delicato e quasi bianco.',                         dove:'Apicoltori, mercati, botteghe artigianali', link:'https://www.sardegnaenogastronomia.it' },
  { id:10, name:'Culurgiones dell\'Ogliastra',   categoria:'gastronomia', zona:'Ogliastra (NU)',               cert:'IGP',   desc:'I ravioli sardi — chiusura a "spiga di grano" fatta a mano, ripieno di patate, pecorino e menta. Ogni paese ha la propria variante. IGP riconosciuto. Si condiscono con sugo di pomodoro fresco.',                                          dove:'Ristoranti locali, produttori artigianali, mercati', link:'https://www.sardegnaturismo.it' },
  { id:11, name:'Coltello Pattada (Resolza)',    categoria:'artigianato', zona:'Pattada (SS)',                 cert:'PAT',   desc:'Il coltello più famoso della Sardegna — lama a "foglia di mirto" in acciaio, manico in corno di muflone. Ogni maestro pattadese firma il proprio pezzo. Collezionato in tutto il mondo.',                                              dove:'Laboratori a Pattada, fiere artigianato', link:'https://www.pattada.net' },
  { id:12, name:'Corallo Rosso di Alghero',      categoria:'artigianato', zona:'Alghero (SS)',                 cert:'IGP',   desc:'Il Corallium rubrum del Golfo di Alghero — il più pregiato del Mediterraneo. Lavorato da secoli dai maestri gioiellieri algheresi in collane, orecchini e spille. Certificato per autenticità.',                                  dove:'Gioiellerie di Alghero, artigiani del porto', link:'https://www.algherotourism.it' },
  { id:13, name:'Sughero di Calangianus',        categoria:'artigianato', zona:'Calangianus (SS)',             cert:'IGP',   desc:'Il 70% del sughero italiano viene da qui. Tappi, oggettistica e design contemporaneo: borse, scarpe, portafogli. Visita alle sugherete e ai laboratori artigianali della Gallura.',                                               dove:'Laboratori a Calangianus, boutique design', link:'https://www.calangianus.it' },
  { id:14, name:'Fregola Sarda',                 categoria:'gastronomia', zona:'Cagliari / Campidano',         cert:'PAT',   desc:'Pasta sferica sarda tostata — simile al cous cous ma più grande. Condita con arselle è il primo piatto più tipico di Cagliari. Con frutti di mare o ragù di cinghiale nelle versioni montanare.',                                       dove:'Pastifici artigianali, botteghe, supermercati', link:'https://www.sardegnaenogastronomia.it' },
  { id:15, name:'Acquavite di Filu e Ferru',     categoria:'liquori',     zona:'Sardegna intera',              cert:'PAT',   desc:'Il grappa sarda — "filo di ferro" perché veniva nascosta nel terreno con un filo di ferro metallico per sfuggire al fisco. Bianca, potente (40-50%), aromatica. Servita ghiacciata come digestivo dopo il pasto.',                   dove:'Distillerie artigianali, enoteche, botteghe', link:'https://www.sardegnaenogastronomia.it' },
  { id:16, name:'Sale di Cagliari (Saline)',     categoria:'gastronomia', zona:'Cagliari / Molentargius',      cert:'PAT',   desc:'Sale integrale raccolto a mano nelle vasche dello Stagno di Molentargius — dove vivono i fenicotteri. Sale grosso, fino, affumicato e alle erbe. Prodotto storico del Campidano di Cagliari.',                                   dove:'Saline di Molentargius, botteghe alimentari', link:'https://www.salinedicagliari.it' }
];

// ─── STATO TOOLS ─────────────────────────────────────────────
let activeToolSection = null;

// ─── INIT TOOLS ──────────────────────────────────────────────
function initTools() {
  renderToolsMenu();
}

function renderToolsMenu() {
  // Bind click su card tools dal HTML
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const tool = card.getAttribute('data-tool');
      openToolSection(tool);
    });
  });
}

function openToolSection(name) {
  activeToolSection = name;
  const menu = document.getElementById('tools-menu');
  const content = document.getElementById('tools-content');

  gsap.to(menu, {
    opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      menu.style.display = 'none';
      content.style.display = 'block';
      content.style.opacity = '0';

      // Render del contenuto
      const contentArea = document.getElementById('tools-content-area');
      if      (name === 'calendar')     renderCalendar(contentArea);
      else if (name === 'beaches')      renderBeaches(contentArea);
      else if (name === 'camper')       renderCamper(contentArea);
      else if (name === 'sports')       renderSports(contentArea);
      else if (name === 'transport')    renderTransport(contentArea);
      else if (name === 'itinerari')    renderItinerari(contentArea);
      else if (name === 'social')       renderSocialWall(contentArea);
      else if (name === 'nord')         renderNordSardegna(contentArea);
      else if (name === 'prenotazioni') renderPrenotazioni(contentArea);
      else if (name === 'biglietti')    renderBiglietti(contentArea);
      else if (name === 'sentieri')     renderSentieri(contentArea);
      else if (name === 'cantine')      renderCantine(contentArea);
      else if (name === 'prodotti')     renderProdotti(contentArea);
      else if (name === 'artigiani')    renderArtigiani(contentArea);
      else if (name === 'comuni')       renderComuni(contentArea);
      else if (name === 'guide')        renderGuide(contentArea);
      else if (name === 'musei')        renderMusei(contentArea);
      else if (name === 'ristoranti')   renderRistoranti(contentArea);
      else if (name === 'hotel')        renderHotel(contentArea);
      else if (name === 'pacchetti')    renderComingSoon(contentArea, 'Pacchetti Viaggio', 'Pacchetti completi con volo, hotel e esperienze — tutto organizzato, tutto in un click.');
      else if (name === 'navigazione') renderNavigazione(contentArea);

      gsap.fromTo(content,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  });
}

function closeToolSection() {
  const menu = document.getElementById('tools-menu');
  const content = document.getElementById('tools-content');

  gsap.to(content, {
    opacity: 0, y: 20, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      content.style.display = 'none';
      menu.style.display = 'grid';
      gsap.fromTo(menu,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  });
}

// ─── CALENDARIO EVENTI ───────────────────────────────────────
function renderCalendar(container) {
  const CAT_COLORS = {
    sagra: '#C8102E', festival: '#FF8C00', cultura: '#00BFFF',
    sport: '#32CD32', tradizione: '#B040FF', concerto: '#FFD700',
    cinema: '#FF6B6B', mostre: '#4ECDC4'
  };
  const CAT_LABELS = {
    sagra: 'Sagre', festival: 'Festival', cultura: 'Cultura',
    sport: 'Sport', tradizione: 'Tradizioni', concerto: 'Concerti',
    cinema: 'Cinema', mostre: 'Mostre'
  };
  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  let currentView    = 'list';
  let currentFilters = { month: 0, province: 'ALL', category: 'ALL' };
  let calYear        = 2026;
  let calMonth       = new Date().getMonth() + 1;

  // Derive province code from city string
  function getProvince(city) {
    const m = city.match(/\(([A-Z]{2})\)/);
    if (m) {
      const c = m[1];
      if (c === 'CA') return 'CA';
      if (c === 'NU') return 'NU';
      if (c === 'OR') return 'OR';
      if (c === 'SS') return 'SS';
      if (c === 'OT') return 'OT';
      if (['SU', 'VS', 'CI'].includes(c)) return 'SU';
    }
    if (city === 'Cagliari') return 'CA';
    if (city === 'Nuoro') return 'NU';
    if (city.startsWith('Oristano')) return 'OR';
    if (city === 'Sassari' || city === 'Alghero') return 'SS';
    if (city.includes('Berchidda')) return 'SS';
    if (city.includes('Barbagia')) return 'NU';
    if (city.includes('Olbia')) return 'OT';
    return 'ALL'; // Tutta la Sardegna
  }

  // Filter + always sort chronologically
  function filterEvents(filters) {
    return EVENTS_DATA
      .filter(e => {
        if (filters.month !== 0 && e.month !== filters.month) return false;
        if (filters.province !== 'ALL') {
          const ep = getProvince(e.city);
          if (ep !== 'ALL' && ep !== filters.province) return false;
        }
        if (filters.category !== 'ALL' && e.category !== filters.category) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function buildEventCardHTML(ev) {
    const date     = new Date(ev.date);
    const catColor = CAT_COLORS[ev.category] || '#fff';
    return `
      <div class="event-card glass-card">
        <div class="event-date-box" style="border-color:${catColor}">
          <span class="event-day">${date.getDate()}</span>
          <span class="event-month">${MONTH_NAMES[date.getMonth() + 1].substring(0,3).toUpperCase()}</span>
        </div>
        <div class="event-body">
          <div class="event-category" style="color:${catColor}">${(CAT_LABELS[ev.category] || ev.category).toUpperCase()}</div>
          <h3 class="event-name">${ev.name}</h3>
          <div class="event-location">📍 ${ev.city}</div>
          <p class="event-desc">${ev.description}</p>
          ${ev.link ? `<a href="${ev.link}" target="_blank" class="event-link">Scopri di più →</a>` : ''}
        </div>
      </div>`;
  }

  function buildListHTML(filters) {
    const events = filterEvents(filters);
    if (events.length === 0) {
      return '<div class="events-grid"><div class="no-events" style="grid-column:1/-1">Nessun evento trovato con questi filtri.</div></div>';
    }
    // Group by month when no month filter active
    if (filters.month === 0) {
      const grouped = {};
      events.forEach(ev => {
        if (!grouped[ev.month]) grouped[ev.month] = [];
        grouped[ev.month].push(ev);
      });
      const months = Object.keys(grouped).map(Number).sort((a, b) => a - b);
      return months.map(m => `
        <div class="events-month-group">
          <h4 class="events-month-label">${MONTH_NAMES[m]}</h4>
          <div class="events-grid">${grouped[m].map(ev => buildEventCardHTML(ev)).join('')}</div>
        </div>`).join('');
    }
    return `<div class="events-grid">${events.map(ev => buildEventCardHTML(ev)).join('')}</div>`;
  }

  function buildCalendarHTML(year, month) {
    const monthEvents = EVENTS_DATA.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const dayMap = {};
    monthEvents.forEach(ev => {
      const d = new Date(ev.date).getDate();
      if (!dayMap[d]) dayMap[d] = [];
      dayMap[d].push(ev);
    });

    const firstDay    = new Date(year, month - 1, 1).getDay();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    let cells = '';
    for (let i = 0; i < offset; i++) cells += `<div class="cal-day-cell cal-day-empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const evs = dayMap[d] || [];
      cells += `
        <div class="cal-day-cell${evs.length ? ' has-events' : ''}">
          <div class="cal-day-num">${d}</div>
          ${evs.map(ev => {
            const color = CAT_COLORS[ev.category] || '#fff';
            return `<div class="cal-event-chip" data-ev-id="${ev.id}" style="border-left:3px solid ${color};background:${color}1a" title="${ev.name} — ${ev.city}">
              <span class="cal-chip-cat" style="color:${color}">${ev.category}</span>
              <span class="cal-chip-name">${ev.name}</span>
            </div>`;
          }).join('')}
        </div>`;
    }

    return `
      <div class="cal-grid-container">
        <div class="cal-nav">
          <button class="cal-nav-btn" id="cal-prev">&#8592;</button>
          <h3 class="cal-month-title">${MONTH_NAMES[month]} ${year}</h3>
          <button class="cal-nav-btn" id="cal-next">&#8594;</button>
        </div>
        <div class="cal-grid">
          ${DAY_NAMES.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
          ${cells}
        </div>
        ${monthEvents.length === 0 ? '<div class="no-events" style="margin-top:20px">Nessun evento in questo mese.</div>' : ''}
      </div>`;
  }

  function buildMonthOptions(v) {
    return MONTH_NAMES.map((m, i) => i === 0
      ? `<option value="0" ${v === 0 ? 'selected' : ''}>Tutti i mesi</option>`
      : `<option value="${i}" ${v === i ? 'selected' : ''}>${m}</option>`
    ).join('');
  }

  function buildProvinceOptions(v) {
    const opts = [
      ['ALL', 'Tutte le province'], ['CA', 'Cagliari'], ['NU', 'Nuoro'],
      ['OR', 'Oristano'], ['SS', 'Sassari'], ['OT', 'Olbia-Tempio'], ['SU', 'Sud Sardegna']
    ];
    return opts.map(([val, label]) => `<option value="${val}" ${v === val ? 'selected' : ''}>${label}</option>`).join('');
  }

  function buildCategoryOptions(v) {
    const opts = [
      ['ALL', 'Tutte le categorie'], ['tradizione', 'Tradizioni'], ['sagra', 'Sagre'],
      ['festival', 'Festival'], ['cultura', 'Cultura'], ['sport', 'Sport'],
      ['concerto', 'Concerti'], ['cinema', 'Cinema'], ['mostre', 'Mostre']
    ];
    return opts.map(([val, label]) => `<option value="${val}" ${v === val ? 'selected' : ''}>${label}</option>`).join('');
  }

  function openEventModal(ev) {
    const catColor = CAT_COLORS[ev.category] || '#ccc';
    const date     = new Date(ev.date);
    const overlay  = container.querySelector('.event-modal-overlay');
    container.querySelector('.event-modal-content').innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:16px">
        <div class="event-date-box" style="border-color:${catColor};flex-shrink:0">
          <span class="event-day">${date.getDate()}</span>
          <span class="event-month">${MONTH_NAMES[date.getMonth() + 1].substring(0,3).toUpperCase()}</span>
        </div>
        <div>
          <div class="event-category" style="color:${catColor};margin-bottom:4px">${(CAT_LABELS[ev.category] || ev.category).toUpperCase()}</div>
          <h3 class="event-name" style="margin:0 0 4px">${ev.name}</h3>
          <div class="event-location">📍 ${ev.city}</div>
        </div>
      </div>
      <p class="event-desc" style="margin-bottom:16px">${ev.description}</p>
      ${ev.link ? `<a href="${ev.link}" target="_blank" class="event-link">Scopri di più →</a>` : ''}
    `;
    overlay.style.display = 'flex';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(overlay.querySelector('.event-modal-box'),
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }

  function render() {
    const isCal = currentView === 'calendar';
    container.innerHTML = `
      <div class="event-modal-overlay" style="display:none">
        <div class="event-modal-box glass-card">
          <button class="event-modal-close">✕</button>
          <div class="event-modal-content"></div>
        </div>
      </div>
      <div class="tools-section-header">
        <h2>Calendario Eventi Sardegna</h2>
        <div class="tools-filter">
          <div class="view-toggle">
            <div class="view-toggle-indicator ${isCal ? 'right' : ''}"></div>
            <button class="view-toggle-btn ${!isCal ? 'active' : ''}" data-view="list">Elenco</button>
            <button class="view-toggle-btn ${isCal ? 'active' : ''}" data-view="calendar">Calendario</button>
          </div>
        </div>
      </div>
      ${!isCal ? `
        <div class="cal-filters-row">
          <select id="month-filter" class="glass-select">${buildMonthOptions(currentFilters.month)}</select>
          <select id="province-filter" class="glass-select">${buildProvinceOptions(currentFilters.province)}</select>
          <select id="category-filter" class="glass-select">${buildCategoryOptions(currentFilters.category)}</select>
        </div>` : ''}
      ${isCal ? buildCalendarHTML(calYear, calMonth) : buildListHTML(currentFilters)}
    `;

    // Modal close
    const overlay = container.querySelector('.event-modal-overlay');
    container.querySelector('.event-modal-close').addEventListener('click', () => { overlay.style.display = 'none'; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });

    // View toggle
    container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        if (currentView === 'calendar' && currentFilters.month > 0) calMonth = currentFilters.month;
        render();
        const target = container.querySelector('.cal-grid-container, .events-grid, .events-month-group');
        if (target && typeof gsap !== 'undefined') {
          gsap.fromTo(target, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
      });
    });

    // Filters (list view only)
    const monthSel = document.getElementById('month-filter');
    if (monthSel) monthSel.addEventListener('change', () => { currentFilters.month = parseInt(monthSel.value); render(); });
    const provSel = document.getElementById('province-filter');
    if (provSel) provSel.addEventListener('change', () => { currentFilters.province = provSel.value; render(); });
    const catSel = document.getElementById('category-filter');
    if (catSel) catSel.addEventListener('change', () => { currentFilters.category = catSel.value; render(); });

    // Calendar prev/next
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { calMonth--; if (calMonth < 1) { calMonth = 12; calYear--; } render(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { calMonth++; if (calMonth > 12) { calMonth = 1; calYear++; } render(); });

    // Calendar chips — click to open modal
    container.querySelectorAll('.cal-event-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ev = EVENTS_DATA.find(e => e.id === parseInt(chip.dataset.evId));
        if (ev) openEventModal(ev);
      });
    });

    // Animate list cards
    if (!isCal && typeof gsap !== 'undefined') {
      gsap.fromTo(container.querySelectorAll('.event-card'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.32, ease: 'power2.out' }
      );
    }
  }

  render();
}

// ─── COMING SOON PLACEHOLDER ──────────────────────────────────
function renderComingSoon(container, title, desc) {
  const skeletons = Array(4).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="sk-line sk-title"></div>
      <div class="sk-line sk-mid"></div>
      <div class="sk-line sk-short"></div>
    </div>`).join('');

  container.innerHTML = `
    <div class="tools-section-header">
      <h2>${title}</h2>
      <span class="coming-soon-badge">In arrivo</span>
    </div>
    <div class="coming-soon-wrap">
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1" width="64" height="64" class="coming-soon-illus">
        <circle cx="40" cy="40" r="34" stroke-dasharray="6 3"/>
        <path d="M40 22v20l12 8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p class="coming-soon-desc">${desc}</p>
      <span class="coming-soon-note">In costruzione — disponibile a breve</span>
    </div>
    <div class="coming-soon-skeleton">${skeletons}</div>
  `;
  gsap.fromTo('.coming-soon-wrap',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  );
  gsap.fromTo('.skeleton-card',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, delay: 0.1, ease: 'power2.out' }
  );
}

// ─── PRENOTAZIONI HUB ─────────────────────────────────────────
function renderPrenotazioni(container) {
  const hubs = [
    {
      label: 'Alloggi',
      desc: 'Hotel, B&B, agriturismo e ville — le migliori tariffe disponibili online',
      links: [
        { text: 'Booking.com — Sardegna', url: 'https://www.booking.com/region/it/sardinia.it.html' },
        { text: 'Airbnb — Sardegna', url: 'https://www.airbnb.it/sardinia-italy/stays' },
        { text: 'Agriturist — Agriturismo Sardegna', url: 'https://www.agriturist.it/regioni/sardegna' }
      ]
    },
    {
      label: 'Esperienze & Tour',
      desc: 'Escursioni, attività guidate e tour con prenotazione immediata',
      links: [
        { text: 'Escursì — Tour & Esperienze Sarde', url: 'https://www.escursi.com/' },
        { text: 'Viator — Sardinia Tours', url: 'https://www.viator.com/' },
        { text: 'GetYourGuide — Sardinia', url: 'https://www.getyourguide.it/sardinia-l946/' },
        { text: 'Airbnb Esperienze — Sardegna', url: 'https://www.airbnb.it/experiences' }
      ]
    },
    {
      label: 'Traghetti & Trasporti',
      desc: 'Traghetti, voli, noleggio auto e bus per raggiungere e muoversi in Sardegna',
      links: [
        { text: 'Traghetti.com — Sardegna', url: 'https://www.traghetti.com/' },
        { text: 'Rentalcars — Noleggio Sardegna', url: 'https://www.rentalcars.com/' },
        { text: 'Skyscanner — Voli per Sardegna', url: 'https://www.skyscanner.it/voli-per/sar/sardegna.html' }
      ]
    },
    {
      label: 'Biglietti & Attrazioni',
      desc: 'Musei, concerti, parchi e attrazioni — acquisto online senza code',
      links: [
        { text: 'TicketOne — Sardegna', url: 'https://www.ticketone.it/search/?q=sardegna' },
        { text: 'VivaTicket — Sardegna', url: 'https://www.vivaticket.com/?srch=sardegna' },
        { text: 'Eventbrite — Sardegna Events', url: 'https://www.eventbrite.it/d/italy--sardinia/events/' }
      ]
    }
  ];

  const iconsSvg = [
    '<path d="M2 28V14M2 20h28M30 28V18a2 2 0 00-2-2H16a2 2 0 00-2 2v2"/><path d="M2 14V7a2 2 0 012-2h7a2 2 0 012 2v7"/><rect x="14" y="16" width="16" height="6" rx="2" fill="currentColor" opacity="0.15"/><rect x="14" y="16" width="16" height="6" rx="2"/>',
    '<path d="M6 8h20l-2 18H8L6 8zM3 8h26"/><path d="M12 8a4 4 0 018 0"/>',
    '<path d="M16 4v24M4 10l12-6 12 6M6 28h20"/><circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.3"/>',
    '<path d="M2 11a2 2 0 012-2h24a2 2 0 012 2v3a3 3 0 000 4v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a3 3 0 000-4v-3z" fill="currentColor" opacity="0.1"/><path d="M2 11a2 2 0 012-2h24a2 2 0 012 2v3a3 3 0 000 4v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a3 3 0 000-4v-3z"/><path d="M20 9v14" stroke-dasharray="3 2"/><path d="M7 15h8M7 19h5"/>'
  ];

  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Prenotazioni</h2>
      <p class="prenot-subtitle">Hub di prenotazione — accedi alle migliori piattaforme per organizzare il tuo soggiorno.</p>
    </div>
    <div class="prenotazioni-grid">
      ${hubs.map((h, i) => `
        <div class="prenot-card glass-card">
          <div class="prenot-head">
            <div class="prenot-icon-wrap">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">${iconsSvg[i]}</svg>
            </div>
            <div>
              <div class="prenot-title">${h.label}</div>
              <div class="prenot-desc">${h.desc}</div>
            </div>
          </div>
          <div class="prenot-links">
            ${h.links.map(l => `
              <a href="${l.url}" target="_blank" rel="noopener" class="prenot-link">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11" style="flex-shrink:0"><path d="M3 8h9M8 4l5 4-5 4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ${l.text}
              </a>`).join('')}
          </div>
        </div>`).join('')}
    </div>
  `;

  gsap.fromTo('.prenot-card',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.35, ease: 'power2.out' }
  );
}

// ─── BIGLIETTI HUB ────────────────────────────────────────────
function renderBiglietti(container) {
  const platforms = [
    { name: 'Escursì', desc: 'Tour, escursioni e attività in Sardegna — prenotazione immediata online', url: 'https://www.escursi.com/', label: 'Esplora attività' },
    { name: 'TicketOne', desc: 'Concerti, spettacoli ed eventi in Sardegna', url: 'https://www.ticketone.it/search/?q=sardegna', label: 'Cerca eventi' },
    { name: 'VivaTicket', desc: 'Biglietti per sagre, festival e manifestazioni locali', url: 'https://www.vivaticket.com/?srch=sardegna', label: 'Cerca eventi' },
    { name: 'Eventbrite', desc: 'Conferenze, workshop ed eventi culturali', url: 'https://www.eventbrite.it/d/italy--sardinia/events/', label: 'Esplora' },
    { name: 'Musei.it', desc: 'Biglietti musei statali e siti archeologici', url: 'https://www.musei.it/sardegna', label: 'Prenota visita' },
    { name: 'CiaoTickets', desc: 'Teatro, cinema e spettacoli dal vivo', url: 'https://www.ciaotickets.com/biglietti/sardegna', label: 'Acquista' }
  ];

  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Biglietti & Attrazioni</h2>
      <p class="prenot-subtitle">Acquista online — salta le code e accedi direttamente alle piattaforme ufficiali.</p>
    </div>
    <div class="biglietti-grid">
      ${platforms.map(p => `
        <a href="${p.url}" target="_blank" rel="noopener" class="biglietto-card glass-card">
          <div class="biglietto-name">${p.name}</div>
          <div class="biglietto-desc">${p.desc}</div>
          <span class="biglietto-cta">${p.label} →</span>
        </a>`).join('')}
    </div>
  `;

  gsap.fromTo('.biglietto-card',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: 'power2.out' }
  );
}

// ─── ARTIGIANI ───────────────────────────────────────────────
function renderArtigiani(container) {
  const filters = [
    { key:'tutti',     label:'Tutti' },
    { key:'tessuti',   label:'Tessuti' },
    { key:'gioielli',  label:'Gioielli & Filigrana' },
    { key:'ceramica',  label:'Ceramica' },
    { key:'coltelli',  label:'Coltelli' },
    { key:'legno',     label:'Legno & Sughero' },
    { key:'cestineria',label:'Cestineria' },
    { key:'merletti',  label:'Merletti' }
  ];
  const groupMap = {
    tessuti:   ['tessuti','merletti'],
    gioielli:  ['gioielli'],
    ceramica:  ['ceramica'],
    coltelli:  ['coltelli'],
    legno:     ['legno','sughero'],
    cestineria:['cestineria'],
    merletti:  ['merletti']
  };

  function draw(active) {
    const list = active === 'tutti'
      ? ARTIGIANI_DATA
      : ARTIGIANI_DATA.filter(a => (groupMap[active] || [active]).includes(a.specialita));
    container.innerHTML = `
      <h2 class="tool-section-title">Artigiani Sardi</h2>
      <p class="tool-section-sub">Maestri artigiani dell'isola — ceramica, filigrana, tessuti, coltelli e molto altro</p>
      <div class="tool-filter-pills">
        ${filters.map(f => `<button class="filter-pill${f.key===active?' active':''}" data-key="${f.key}">${f.label}</button>`).join('')}
      </div>
      <div class="artigiani-grid">
        ${list.map(a => `
          <div class="artigiano-card glass-card">
            <div class="artg-head">
              <span class="artg-spec-badge artg-spec-${a.specialita}">${a.specialita}</span>
              <span class="artg-zona">${a.zona.charAt(0).toUpperCase()+a.zona.slice(1)} Sardegna</span>
            </div>
            <div class="artg-name">${a.name}</div>
            <div class="artg-city">${a.city}</div>
            <p class="artg-desc">${a.desc}</p>
            <div class="artg-prodotti">${a.prodotti.map(p=>`<span class="artg-prod-tag">${p}</span>`).join('')}</div>
            <div class="artg-footer">
              ${a.tel ? `<span class="artg-tel">${a.tel}</span>` : ''}
              ${a.web ? `<a href="${a.web}" target="_blank" class="artg-link">Sito web</a>` : ''}
            </div>
          </div>`).join('')}
      </div>`;
    container.querySelectorAll('.filter-pill').forEach(btn =>
      btn.addEventListener('click', () => draw(btn.dataset.key)));
    if (window.gsap) gsap.fromTo('.artigiano-card',{opacity:0,y:18},{opacity:1,y:0,duration:0.4,stagger:0.06});
  }
  draw('tutti');
}

// ─── GUIDE ───────────────────────────────────────────────────
function renderGuide(container) {
  const filters = [
    { key:'tutti',       label:'Tutte' },
    { key:'trekking',    label:'Trekking' },
    { key:'culturale',   label:'Culturali' },
    { key:'mare',        label:'Mare & Sub' },
    { key:'gastronomico',label:'Gastronomiche' },
    { key:'esperienze',  label:'Esperienze' }
  ];

  function draw(active) {
    const list = active === 'tutti' ? GUIDE_DATA : GUIDE_DATA.filter(g => g.tipo === active);
    container.innerHTML = `
      <h2 class="tool-section-title">Guide Turistiche</h2>
      <p class="tool-section-sub">Cooperative e agenzie di guide certificate — per scoprire la Sardegna con chi la conosce davvero</p>
      <div class="tool-filter-pills">
        ${filters.map(f => `<button class="filter-pill${f.key===active?' active':''}" data-key="${f.key}">${f.label}</button>`).join('')}
      </div>
      <div class="guide-grid">
        ${list.map(g => `
          <div class="guida-card glass-card">
            <div class="guida-head">
              <span class="guida-tipo-badge guida-tipo-${g.tipo}">${g.tipo}</span>
              <span class="guida-zona">${g.zona.charAt(0).toUpperCase()+g.zona.slice(1)} Sardegna</span>
            </div>
            <div class="guida-name">${g.name}</div>
            <div class="guida-city">${g.city}</div>
            <p class="guida-desc">${g.desc}</p>
            <div class="guida-lingue">${g.lingue.map(l=>`<span class="guida-lang-tag">${l}</span>`).join('')}</div>
            <div class="guida-footer">
              <span class="guida-tel">${g.tel}</span>
              <a href="${g.web}" target="_blank" class="guida-link">Sito web</a>
            </div>
          </div>`).join('')}
      </div>`;
    container.querySelectorAll('.filter-pill').forEach(btn =>
      btn.addEventListener('click', () => draw(btn.dataset.key)));
    if (window.gsap) gsap.fromTo('.guida-card',{opacity:0,y:18},{opacity:1,y:0,duration:0.4,stagger:0.06});
  }
  draw('tutti');
}

// ─── COMUNI ───────────────────────────────────────────────────
function renderComuni(container) {
  const filters = [
    { key:'tutti',  label:'Tutti' },
    { key:'nord',   label:'Nord Sardegna' },
    { key:'centro', label:'Centro' },
    { key:'sud',    label:'Sud Sardegna' }
  ];

  function draw(active) {
    const list = active === 'tutti' ? COMUNI_DATA : COMUNI_DATA.filter(c => c.zona === active);
    container.innerHTML = `
      <h2 class="tool-section-title">Comuni della Sardegna</h2>
      <p class="tool-section-sub">Una selezione dei borghi e città più significativi dell'isola — storia, arte, natura e identità</p>
      <div class="tool-filter-pills">
        ${filters.map(f => `<button class="filter-pill${f.key===active?' active':''}" data-key="${f.key}">${f.label}</button>`).join('')}
      </div>
      <div class="comuni-grid">
        ${list.map(c => `
          <div class="comune-card glass-card">
            <div class="comune-head">
              <span class="comune-prov-badge">Prov. ${c.prov}</span>
              <span class="comune-pop">${c.pop} ab.</span>
            </div>
            <div class="comune-name">${c.name}</div>
            <div class="comune-alt">${c.alt} s.l.m.</div>
            <p class="comune-desc">${c.desc}</p>
            <div class="comune-attrazioni">
              <div class="comune-attr-label">Cosa vedere</div>
              <ul class="comune-attr-list">
                ${c.cosa_vedere.map(a=>`<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div class="comune-footer">
              <a href="${c.web}" target="_blank" class="comune-link">Sito del Comune</a>
            </div>
          </div>`).join('')}
      </div>`;
    container.querySelectorAll('.filter-pill').forEach(btn =>
      btn.addEventListener('click', () => draw(btn.dataset.key)));
    if (window.gsap) gsap.fromTo('.comune-card',{opacity:0,y:18},{opacity:1,y:0,duration:0.4,stagger:0.06});
  }
  draw('tutti');
}

// ─── PRODOTTI ─────────────────────────────────────────────────
function renderProdotti(container) {
  const filters = [
    { key:'tutti',       label:'Tutti' },
    { key:'gastronomia', label:'Gastronomia' },
    { key:'vini',        label:'Vini' },
    { key:'liquori',     label:'Liquori' },
    { key:'artigianato', label:'Artigianato' }
  ];
  const CERT_COLOR = { DOP:'#27ae60', IGP:'#2980b9', DOCG:'#8e44ad', DOC:'#16a085', PAT:'#e67e22' };

  function draw(active) {
    const list = active === 'tutti' ? PRODOTTI_DATA : PRODOTTI_DATA.filter(p => p.categoria === active);
    container.innerHTML = `
      <h2 class="tool-section-title">Prodotti Tipici Sardi</h2>
      <p class="tool-section-sub">Eccellenze enogastronomiche e artigianali dell'isola — con indicazioni su dove acquistarle</p>
      <div class="tool-filter-pills">
        ${filters.map(f => `<button class="filter-pill${f.key===active?' active':''}" data-key="${f.key}">${f.label}</button>`).join('')}
      </div>
      <p class="prodotti-artigiani-note">Per acquistare direttamente dai produttori artigianali → <button class="prodotti-artig-link" onclick="openToolSection('artigiani')">Artigiani Sardi</button></p>
      <div class="prodotti-grid">
        ${list.map(p => `
          <div class="prodotto-card glass-card">
            <div class="prodotto-head">
              <span class="prodotto-cat-badge prodotto-cat-${p.categoria}">${p.categoria}</span>
              ${p.cert ? `<span class="prodotto-cert" style="background:${CERT_COLOR[p.cert]||'#555'}">${p.cert}</span>` : ''}
            </div>
            <div class="prodotto-name">${p.name}</div>
            <div class="prodotto-zona">${p.zona}</div>
            <p class="prodotto-desc">${p.desc}</p>
            <div class="prodotto-dove"><span class="prodotto-dove-label">Dove acquistare:</span> ${p.dove}</div>
            <div class="prodotto-footer">
              <a href="${p.link}" target="_blank" class="prodotto-link">Scopri di più</a>
            </div>
          </div>`).join('')}
      </div>`;
    container.querySelectorAll('.filter-pill').forEach(btn =>
      btn.addEventListener('click', () => draw(btn.dataset.key)));
    if (window.gsap) gsap.fromTo('.prodotto-card',{opacity:0,y:18},{opacity:1,y:0,duration:0.4,stagger:0.06});
  }
  draw('tutti');
}

// ─── SENTIERI ─────────────────────────────────────────────────
function renderSentieri(container) {
  const DIFF = [
    { key:'tutti',    label:'Tutti' },
    { key:'facile',   label:'Facile' },
    { key:'media',    label:'Media' },
    { key:'difficile',label:'Difficile' },
    { key:'esperta',  label:'Esperta' }
  ];
  const DIFF_COLORS = { facile:'#32CD32', media:'#FF8C00', difficile:'#C8102E', esperta:'#8B0000' };

  function render(diff) {
    const list = diff === 'tutti' ? SENTIERI_DATA : SENTIERI_DATA.filter(s => s.difficolta === diff);
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Sentieri & Trekking</h2>
        <p class="prenot-subtitle">Percorsi CAI e naturalistici in Sardegna — difficoltà, dislivello e punti di partenza.</p>
      </div>
      <div class="tool-filter-pills">
        ${DIFF.map(d => `<button class="filter-pill${d.key===diff?' active':''}" data-diff="${d.key}">${d.label}</button>`).join('')}
      </div>
      <div class="sentieri-grid">
        ${list.map(s => {
          const color = DIFF_COLORS[s.difficolta] || '#fff';
          return `
          <div class="sentiero-card glass-card">
            <div class="sentiero-head">
              <span class="sentiero-badge" style="color:${color};border-color:${color}40;background:${color}14">${s.difficolta}</span>
              <div class="sentiero-name">${s.name}</div>
              <div class="sentiero-zona">📍 ${s.zona}</div>
            </div>
            <p class="sentiero-desc">${s.desc}</p>
            <div class="sentiero-stats">
              <div class="sentiero-stat"><span class="stat-val">${s.lunghezza} km</span><span class="stat-lbl">Lunghezza</span></div>
              <div class="sentiero-stat"><span class="stat-val">${s.dislivello}</span><span class="stat-lbl">Dislivello</span></div>
              <div class="sentiero-stat"><span class="stat-val">${s.durata}</span><span class="stat-lbl">Durata</span></div>
            </div>
            <div class="cantina-footer">
              <span class="sentiero-partenza">🚗 ${s.partenza}</span>
              ${s.web && s.web!=='#' ? `<a href="${s.web}" target="_blank" rel="noopener" class="cantina-link">Info →</a>` : ''}
            </div>
          </div>`;
        }).join('')}
        ${list.length===0 ? '<div class="no-events">Nessun sentiero trovato.</div>' : ''}
      </div>`;
    container.querySelectorAll('.filter-pill[data-diff]').forEach(btn =>
      btn.addEventListener('click', () => render(btn.dataset.diff))
    );
    gsap.fromTo('.sentiero-card', { opacity:0, y:18 }, { opacity:1, y:0, stagger:0.07, duration:0.35, ease:'power2.out' });
  }
  render('tutti');
}

// ─── RISTORANTI ───────────────────────────────────────────────
function renderRistoranti(container) {
  const TIPI = [
    { key:'tutti', label:'Tutti' },
    { key:'pesce', label:'Pesce & Mare' },
    { key:'tipico',label:'Tipico Sardo' },
    { key:'carne', label:'Carne & Griglie' }
  ];
  const FASCIA_SYM = { economico:'€', medio:'€€', alto:'€€€', lusso:'€€€€' };
  const TIPO_COLORS = { pesce:'#00BFFF', tipico:'#FFD700', carne:'#C8102E', pizza:'#FF8C00' };

  function render(tipo) {
    const list = tipo === 'tutti' ? RISTORANTI_DATA : RISTORANTI_DATA.filter(r => r.tipo === tipo);
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Ristoranti</h2>
        <p class="prenot-subtitle">Ristoranti, trattorie e agriturismi selezionati per qualità e cucina tipica sarda.</p>
      </div>
      <div class="tool-filter-pills">
        ${TIPI.map(t => `<button class="filter-pill${t.key===tipo?' active':''}" data-tipo="${t.key}">${t.label}</button>`).join('')}
      </div>
      <div class="ristoranti-grid">
        ${list.map(r => {
          const color = TIPO_COLORS[r.tipo] || '#fff';
          return `
          <div class="ristorante-card glass-card">
            <div class="risto-badges">
              <span class="risto-tipo-badge" style="color:${color};border-color:${color}40;background:${color}14">${r.tipo}</span>
              <span class="risto-fascia">${FASCIA_SYM[r.fascia]||'€'}</span>
              ${r.michelin ? '<span class="michelin-star">⭐ Michelin</span>' : ''}
            </div>
            <div class="ristorante-name">${r.name}</div>
            <div class="ristorante-city">📍 ${r.city}</div>
            <p class="ristorante-desc">${r.desc}</p>
            <div class="risto-specialita">
              ${r.specialita.map(sp => `<span class="spec-tag">${sp}</span>`).join('')}
            </div>
            <div class="cantina-footer">
              ${r.tel ? `<span class="cantina-tel">📞 ${r.tel}</span>` : ''}
              ${r.web && r.web!=='#' ? `<a href="${r.web}" target="_blank" rel="noopener" class="cantina-link">Prenota →</a>` : ''}
            </div>
          </div>`;
        }).join('')}
        ${list.length===0 ? '<div class="no-events">Nessun ristorante trovato.</div>' : ''}
      </div>`;
    container.querySelectorAll('.filter-pill[data-tipo]').forEach(btn =>
      btn.addEventListener('click', () => render(btn.dataset.tipo))
    );
    gsap.fromTo('.ristorante-card', { opacity:0, y:18 }, { opacity:1, y:0, stagger:0.07, duration:0.35, ease:'power2.out' });
  }
  render('tutti');
}

// ─── HOTEL ────────────────────────────────────────────────────
function renderHotel(container) {
  const TIPI = [
    { key:'tutti',       label:'Tutti' },
    { key:'resort',      label:'Resort' },
    { key:'hotel',       label:'Hotel' },
    { key:'boutique',    label:'Boutique' },
    { key:'agriturismo', label:'Agriturismo' }
  ];
  const FASCIA_LABELS  = { economico:'€  Budget', medio:'€€  Medio', alto:'€€€  Premium', lusso:'€€€€  Lusso' };
  const FASCIA_COLORS  = { economico:'#32CD32', medio:'#FF8C00', alto:'#00BFFF', lusso:'#FFD700' };

  function render(tipo) {
    const list = tipo === 'tutti' ? HOTEL_DATA : HOTEL_DATA.filter(h => h.tipo === tipo);
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Hotel & Alloggi</h2>
        <p class="prenot-subtitle">Hotel, resort, B&B e agriturismo — selezione curata per ogni budget e stile di viaggio.</p>
      </div>
      <div class="tool-filter-pills">
        ${TIPI.map(t => `<button class="filter-pill${t.key===tipo?' active':''}" data-tipo="${t.key}">${t.label}</button>`).join('')}
      </div>
      <div class="hotel-grid">
        ${list.map(h => {
          const fascColor = FASCIA_COLORS[h.fascia] || '#fff';
          const stars = h.stelle > 0 ? '★'.repeat(h.stelle) : '';
          return `
          <div class="hotel-card glass-card">
            <div class="hotel-badges">
              <span class="hotel-tipo-badge">${h.tipo}</span>
              ${stars ? `<span class="hotel-stelle">${stars}</span>` : ''}
              <span class="hotel-fascia" style="color:${fascColor}">${FASCIA_LABELS[h.fascia]||h.fascia}</span>
            </div>
            <div class="hotel-name">${h.name}</div>
            <div class="hotel-city">📍 ${h.city}</div>
            <p class="hotel-desc">${h.desc}</p>
            <div class="hotel-servizi">
              ${h.servizi.map(s => `<span class="servizio-tag">${s}</span>`).join('')}
            </div>
            <div class="cantina-footer">
              ${h.tel ? `<span class="cantina-tel">📞 ${h.tel}</span>` : ''}
              ${h.web && h.web!=='#' ? `<a href="${h.web}" target="_blank" rel="noopener" class="cantina-link">Sito web →</a>` : ''}
            </div>
          </div>`;
        }).join('')}
        ${list.length===0 ? '<div class="no-events">Nessun alloggio trovato.</div>' : ''}
      </div>`;
    container.querySelectorAll('.filter-pill[data-tipo]').forEach(btn =>
      btn.addEventListener('click', () => render(btn.dataset.tipo))
    );
    gsap.fromTo('.hotel-card', { opacity:0, y:18 }, { opacity:1, y:0, stagger:0.07, duration:0.35, ease:'power2.out' });
  }
  render('tutti');
}

// ─── CANTINE ──────────────────────────────────────────────────
function renderCantine(container) {
  const ZONE = [
    { key:'tutte', label:'Tutte le zone' },
    { key:'nord',  label:'Nord Sardegna' },
    { key:'centro',label:'Centro' },
    { key:'sud',   label:'Sud' },
    { key:'sulcis',label:'Sulcis' }
  ];
  const SERV_LABELS = { visita:'Visita guidata', degustazione:'Degustazione', acquisto:'Acquisto diretto', ristorante:'Ristorante', museo:'Museo interno' };

  function render(zona) {
    const list = zona === 'tutte' ? CANTINE_DATA : CANTINE_DATA.filter(c => c.zona === zona);
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Cantine & Vino</h2>
        <p class="prenot-subtitle">Cantine sarde aperte al pubblico — degustazioni, visite guidate e acquisto diretto.</p>
      </div>
      <div class="tool-filter-pills">
        ${ZONE.map(z => `<button class="filter-pill${z.key===zona?' active':''}" data-zona="${z.key}">${z.label}</button>`).join('')}
      </div>
      <div class="cantine-grid">
        ${list.map(c => `
          <div class="cantina-card glass-card">
            <div>
              <div class="cantina-name">${c.name}</div>
              <div class="cantina-city">📍 ${c.city}</div>
            </div>
            <p class="cantina-desc">${c.desc}</p>
            <div class="cantina-vitigni">
              ${c.vitigni.map(v => `<span class="vitigno-tag">${v}</span>`).join('')}
            </div>
            <div class="cantina-servizi">
              ${c.servizi.map(s => `<span class="servizio-tag">${SERV_LABELS[s]||s}</span>`).join('')}
            </div>
            <div class="cantina-footer">
              ${c.tel ? `<span class="cantina-tel">📞 ${c.tel}</span>` : ''}
              <a href="${c.web}" target="_blank" rel="noopener" class="cantina-link">Sito web →</a>
            </div>
          </div>`).join('')}
        ${list.length===0 ? '<div class="no-events">Nessuna cantina trovata.</div>' : ''}
      </div>`;

    container.querySelectorAll('.filter-pill[data-zona]').forEach(btn =>
      btn.addEventListener('click', () => render(btn.dataset.zona))
    );
    gsap.fromTo('.cantina-card', { opacity:0, y:18 }, { opacity:1, y:0, stagger:0.07, duration:0.35, ease:'power2.out' });
  }
  render('tutte');
}

// ─── MUSEI ────────────────────────────────────────────────────
function renderMusei(container) {
  const TIPI = [
    { key:'tutti',      label:'Tutti' },
    { key:'archeologia',label:'Archeologia' },
    { key:'arte',       label:'Arte' },
    { key:'etnografia', label:'Etnografia' },
    { key:'storia',     label:'Storia' },
    { key:'natura',     label:'Natura' }
  ];
  const TIPO_COLORS = { archeologia:'#FFD700', arte:'#B040FF', etnografia:'#FF8C00', storia:'#C8102E', natura:'#32CD32' };

  function render(tipo) {
    const list = tipo === 'tutti' ? MUSEI_DATA : MUSEI_DATA.filter(m => m.tipo === tipo);
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Musei & Cultura</h2>
        <p class="prenot-subtitle">Musei, siti nuragici e collezioni permanenti — orari, biglietti e percorsi tematici in Sardegna.</p>
      </div>
      <div class="tool-filter-pills">
        ${TIPI.map(t => `<button class="filter-pill${t.key===tipo?' active':''}" data-tipo="${t.key}">${t.label}</button>`).join('')}
      </div>
      <div class="musei-grid">
        ${list.map(m => {
          const color = TIPO_COLORS[m.tipo] || '#fff';
          return `
          <div class="museo-card glass-card">
            <div class="museo-head">
              <span class="museo-tipo-badge" style="color:${color};border-color:${color}40;background:${color}14">${m.tipo}</span>
              <div class="museo-name">${m.name}</div>
              <div class="museo-city">📍 ${m.city}</div>
            </div>
            <p class="museo-desc">${m.desc}</p>
            <div class="museo-info">
              <span class="museo-info-item">🕐 ${m.orari}</span>
              <span class="museo-info-item">🎫 ${m.biglietto}</span>
              <span class="museo-info-item">📌 ${m.indirizzo}</span>
            </div>
            ${m.web && m.web!=='#' ? `<a href="${m.web}" target="_blank" rel="noopener" class="cantina-link" style="margin-top:10px;display:inline-block">Sito ufficiale →</a>` : ''}
          </div>`;
        }).join('')}
        ${list.length===0 ? '<div class="no-events">Nessun museo trovato.</div>' : ''}
      </div>`;

    container.querySelectorAll('.filter-pill[data-tipo]').forEach(btn =>
      btn.addEventListener('click', () => render(btn.dataset.tipo))
    );
    gsap.fromTo('.museo-card', { opacity:0, y:18 }, { opacity:1, y:0, stagger:0.07, duration:0.35, ease:'power2.out' });
  }
  render('tutti');
}

// ─── SPIAGGE LIVE ─────────────────────────────────────────────
function renderBeaches(container) {
  // Fetch wind + wave + sea temp from Open-Meteo (free, no API key, CORS ok)
  async function fetchBeachWeather(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m,wave_height,sea_surface_temperature` +
      `&wind_speed_unit=kmh&hourly=wave_height&forecast_days=1`;
    try {
      const r = await fetch(url);
      const d = await r.json();
      const c = d.current || {};
      return {
        wind:  Math.round(c.wind_speed_10m   || 0),
        gusts: Math.round(c.wind_gusts_10m   || 0),
        dir:   Math.round(c.wind_direction_10m || 0),
        wavH:  c.wave_height != null ? parseFloat(c.wave_height).toFixed(1) : null,
        seaT:  c.sea_surface_temperature != null ? Math.round(c.sea_surface_temperature) : null
      };
    } catch {
      return null;
    }
  }

  // True if wind direction falls inside bad range [from, to]
  function isBadDirection(dir, range) {
    const [from, to] = range;
    if (from <= to) return dir >= from && dir <= to;
    return dir >= from || dir <= to; // wraps 360→0
  }

  // Evaluate beach condition based on speed + gusts + direction relative to exposure
  function evaluateCondition(wind, gusts, dir, badFrom) {
    const onshore = badFrom ? isBadDirection(dir, badFrom) : true;
    const effective = onshore ? Math.max(wind, gusts * 0.7) : wind * 0.6;
    if (effective < 10)  return { status: 'Perfetta',    statusClass: 'status-great',  label: 'Mare piatto, ideale per famiglie e bambini.' };
    if (effective < 18)  return { status: 'Ottima',      statusClass: 'status-great',  label: onshore ? 'Vento leggero, qualche piccola onda.' : 'Vento al largo, mare calmo sotto costa.' };
    if (effective < 28)  return { status: 'Buona',       statusClass: 'status-good',   label: onshore ? 'Vento moderato, onde 0.5-1m. Va bene per nuotatori esperti.' : 'Brezza costante, mare mosso al largo ma gestibile.' };
    if (effective < 40)  return { status: 'Difficile',   statusClass: 'status-warn',   label: onshore ? 'Vento forte, onde significative. Sconsigliato ai bambini.' : 'Mare formato al largo, attenzione alle correnti.' };
    return              { status: 'Sconsigliata', statusClass: 'status-bad',    label: 'Condizioni avverse. Evitare il bagno.' };
  }

  // Wind direction label
  function windDirLabel(deg) {
    const dirs = ['N','NE','E','SE','S','SO','O','NO'];
    return dirs[Math.round(deg / 45) % 8];
  }

  // Render a single beach card
  function beachCardHTML(b, w) {
    const cond = w
      ? evaluateCondition(w.wind, w.gusts, w.dir, b.badFrom)
      : { status: '—', statusClass: 'status-unknown', label: 'Dati non disponibili.' };
    const windTxt = w ? `${w.wind} km/h <span class="wind-dir">${windDirLabel(w.dir)}</span>` : '—';
    const gustTxt = w && w.gusts > w.wind + 3 ? `raffiche ${w.gusts} km/h` : '';
    const wavTxt  = w && w.wavH !== null  ? `${w.wavH} m` : '—';
    const seaTxt  = w && w.seaT !== null  ? `${w.seaT}°C` : '—';
    const barPct  = w ? Math.min(100, w.wind / 50 * 100) : 0;

    return `
      <div class="beach-card glass-card" data-beach-id="${b.name}">
        <div class="beach-photo-wrap">
          ${b.photo ? `<img src="${b.photo}" alt="${b.name}" class="beach-photo" loading="lazy" onerror="this.parentElement.classList.add('beach-photo-fallback');this.style.display='none';">` : ''}
          <div class="beach-photo-gradient"></div>
          <span class="beach-status ${cond.statusClass} beach-status-overlay">${cond.status}</span>
          ${b.photoCredit ? `<span class="beach-photo-credit">${b.photoCredit}</span>` : ''}
        </div>
        <div class="beach-body">
          <div class="beach-header">
            <h3 class="beach-name">${b.name}</h3>
          </div>
          <div class="beach-location">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><circle cx="8" cy="6" r="3"/><path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z"/></svg>
            ${b.location}
          </div>
          <div class="beach-type">${b.type}</div>
          <div class="beach-condition-label">${cond.label}</div>
          <div class="beach-stats">
            <div class="beach-stat">
              <div class="stat-label-top">Vento</div>
              <div class="stat-value">${windTxt}${gustTxt ? `<div class="stat-gusts">${gustTxt}</div>` : ''}</div>
            </div>
            <div class="beach-stat">
              <div class="stat-label-top">Onde</div>
              <div class="stat-value">${wavTxt}</div>
            </div>
            <div class="beach-stat">
              <div class="stat-label-top">Mare</div>
              <div class="stat-value">${seaTxt}</div>
            </div>
          </div>
          <div class="wind-bar">
            <div class="wind-bar-fill ${cond.statusClass}" style="width:${barPct}%"></div>
          </div>
          <div class="beach-info">
            <div class="beach-info-row"><span class="info-label">Accesso</span><span class="info-val">${b.access}</span></div>
            <div class="beach-info-row"><span class="info-label">Costo</span><span class="info-val">${b.cost}</span></div>
            ${b.prenotazione ? `<div class="beach-info-row"><span class="info-label">Prenotaz.</span><span class="info-val">${b.prenotazione}</span></div>` : ''}
          </div>
        </div>
      </div>`;
  }

  // Placeholder card while loading
  function beachCardLoading(b) {
    return `
      <div class="beach-card beach-card-loading glass-card" data-beach-id="${b.name}">
        <div class="beach-photo-wrap">
          ${b.photo ? `<img src="${b.photo}" alt="${b.name}" class="beach-photo" loading="lazy">` : ''}
          <div class="beach-photo-gradient"></div>
          <span class="beach-status status-loading beach-status-overlay">Caricamento...</span>
        </div>
        <div class="beach-body">
          <h3 class="beach-name">${b.name}</h3>
          <div class="beach-location">${b.location}</div>
          <div class="beach-skeleton"></div>
        </div>
      </div>`;
  }

  // Search among all POI beaches (from map data)
  function buildSearchResults(query) {
    if (!query || query.length < 2) return '';
    const q = query.toLowerCase();
    const allBeaches = (typeof MAP_POI !== 'undefined' ? MAP_POI : [])
      .filter(p => p.cat === 'spiaggia' && p.name.toLowerCase().includes(q))
      .slice(0, 8);
    if (!allBeaches.length) return '<p class="beach-search-empty">Nessuna spiaggia trovata.</p>';
    return `<div class="beach-search-results">
      ${allBeaches.map(p => `
        <div class="beach-search-item" data-lat="${p.lat}" data-lng="${p.lng}" data-name="${p.name}" data-desc="${p.description || ''}">
          <div class="bsi-name">${p.name}</div>
          <div class="bsi-desc">${(p.description || '').split('.')[0]}</div>
        </div>
      `).join('')}
    </div>`;
  }

  async function showSearchBeach(name, lat, lng, desc) {
    const searchResult = document.getElementById('beach-search-result-area');
    if (!searchResult) return;
    searchResult.innerHTML = `<div class="beach-search-detail-loading">Recupero dati meteo per ${name}...</div>`;
    const w = await fetchBeachWeather(lat, lng);
    const cond = w
      ? evaluateCondition(w.wind, w.gusts, w.dir, null)
      : { status: '—', statusClass: 'status-unknown', label: 'Dati non disponibili.' };
    const windTxt = w ? `${w.wind} km/h ${windDirLabel(w.dir)}` : '—';
    const gustTxt = w && w.gusts > w.wind + 3 ? ` (raffiche ${w.gusts} km/h)` : '';
    searchResult.innerHTML = `
      <div class="beach-search-detail glass-card">
        <div class="bsd-header">
          <div class="bsd-name">${name}</div>
          <span class="beach-status ${cond.statusClass}">${cond.status}</span>
        </div>
        <p class="bsd-desc">${desc || ''}</p>
        <div class="beach-condition-label">${cond.label}</div>
        <div class="beach-stats">
          <div class="beach-stat"><div class="stat-label-top">Vento</div><div class="stat-value">${windTxt}${gustTxt}</div></div>
          <div class="beach-stat"><div class="stat-label-top">Onde</div><div class="stat-value">${w && w.wavH !== null ? w.wavH + ' m' : '—'}</div></div>
          <div class="beach-stat"><div class="stat-label-top">Mare</div><div class="stat-value">${w && w.seaT !== null ? w.seaT + '°C' : '—'}</div></div>
        </div>
        <div class="wind-bar"><div class="wind-bar-fill ${cond.statusClass}" style="width:${w ? Math.min(100, w.wind/50*100) : 0}%"></div></div>
        <div class="bsd-coords">Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)} · <a href="https://www.windy.com/?${lat},${lng},11" target="_blank" rel="noopener">Apri su Windy</a></div>
      </div>`;
  }

  async function loadAllWeatherAndRender() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Spiagge Live</h2>
        <div class="beaches-meta">
          <span class="update-time" id="beaches-update-time">Aggiornato: ${timeStr}</span>
          <button id="update-beaches-btn" class="btn-glass">Aggiorna</button>
        </div>
      </div>
      <p class="section-subtitle">Dati vento e mare in tempo reale via Open-Meteo. Aggiornati ogni ora dai modelli meteorologici GFS/ECMWF.</p>

      <div class="beach-search-wrap">
        <input type="text" id="beach-search-input" class="beach-search-input" placeholder="Cerca spiaggia tra le 107 in mappa...">
        <div id="beach-search-dropdown" class="beach-search-dropdown"></div>
      </div>
      <div id="beach-search-result-area"></div>

      <div class="beaches-grid" id="beaches-main-grid">
        ${BEACHES_DATA.map(b => beachCardLoading(b)).join('')}
      </div>
    `;

    // Search input logic
    const searchInput = document.getElementById('beach-search-input');
    const searchDropdown = document.getElementById('beach-search-dropdown');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        searchDropdown.innerHTML = buildSearchResults(q);
        searchDropdown.style.display = q.length >= 2 ? 'block' : 'none';
        searchDropdown.querySelectorAll('.beach-search-item').forEach(item => {
          item.addEventListener('click', () => {
            const name = item.dataset.name;
            const lat  = parseFloat(item.dataset.lat);
            const lng  = parseFloat(item.dataset.lng);
            const desc = item.dataset.desc;
            searchInput.value = name;
            searchDropdown.style.display = 'none';
            showSearchBeach(name, lat, lng, desc);
          });
        });
      });
      document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.style.display = 'none';
        }
      }, { once: false });
    }

    // Fetch weather for all 12 curated beaches in parallel
    const weatherResults = await Promise.all(BEACHES_DATA.map(b => fetchBeachWeather(b.lat, b.lng)));
    const grid = document.getElementById('beaches-main-grid');
    if (!grid) return;

    grid.innerHTML = BEACHES_DATA.map((b, i) => beachCardHTML(b, weatherResults[i])).join('');

    gsap.fromTo('.beach-card',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.3, ease: 'power2.out' }
    );

    const updateBtn = document.getElementById('update-beaches-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        const timeEl = document.getElementById('beaches-update-time');
        if (timeEl) {
          const n = new Date();
          timeEl.textContent = `Aggiornamento in corso...`;
        }
        gsap.to('.beach-card', { opacity: 0, y: -10, stagger: 0.04, duration: 0.18,
          onComplete: () => {
            const n = new Date();
            if (timeEl) timeEl.textContent = `Aggiornato: ${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`;
            Promise.all(BEACHES_DATA.map(b => fetchBeachWeather(b.lat, b.lng))).then(results => {
              const g = document.getElementById('beaches-main-grid');
              if (g) g.innerHTML = BEACHES_DATA.map((b, i) => beachCardHTML(b, results[i])).join('');
              gsap.fromTo('.beach-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.3 });
            });
          }
        });
      });
    }
  }

  loadAllWeatherAndRender();
}

// ─── CAMPER & VAN ────────────────────────────────────────────
function renderCamper(container) {
  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Aree Sosta Camper & Van</h2>
    </div>
    <p class="section-subtitle">8 aree sosta selezionate in tutta la Sardegna. Verifica disponibilità prima di partire.</p>
    <div class="camper-grid">
      ${CAMPER_DATA.map(area => {
        const servicesHtml = area.services.map(s => {
          const info = SERVICE_ICONS[s] || { icon: '', label: s };
          return `<span class="service-badge" title="${info.label}">${info.label}</span>`;
        }).join('');
        return `
        <div class="camper-card glass-card">
          <div class="camper-header">
            <h3 class="camper-name">${area.name}</h3>
            <span class="camper-cost">${area.cost}</span>
          </div>
          <div class="camper-location">📍 ${area.city}</div>
          <div class="camper-coords">🗺️ ${area.coords}</div>
          <div class="camper-services">${servicesHtml}</div>
          <p class="camper-notes">${area.notes}</p>
        </div>`;
      }).join('')}
    </div>
  `;

  gsap.fromTo('.camper-card',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, stagger: 0.09, duration: 0.4, ease: 'power2.out' }
  );
}

// ─── SPORT & AVVENTURA ────────────────────────────────────────
function renderSports(container) {
  const levelColors = {
    'Principiante / Avanzato': '#32CD32',
    'Intermedio / Esperto': '#FF8C00',
    'Principiante / Pro': '#00BFFF',
    'Tutti i livelli': '#B040FF',
    'Intermedio': '#FFD700'
  };

  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Sport & Avventura</h2>
    </div>
    <p class="section-subtitle">Le migliori attività outdoor in Sardegna con operatori certificati e aree selezionate.</p>
    <div class="sports-grid">
      ${SPORTS_DATA.map(sport => {
        const levelColor = levelColors[sport.level] || '#fff';
        const operatorsHtml = sport.operators.map(op => `
          <div class="sport-operator">
            <strong>${op.name}</strong>
            ${op.tel ? `<a href="tel:${op.tel}" class="op-tel">${op.tel}</a>` : ''}
            ${op.web ? `<a href="https://${op.web}" target="_blank" class="op-web">${op.web}</a>` : ''}
            ${op.note ? `<span class="op-note">${op.note}</span>` : ''}
          </div>
        `).join('');
        const areasHtml = sport.areas.map(a => `<span class="area-tag">${a}</span>`).join('');
        return `
        <div class="sport-card glass-card">
          <div class="sport-header">
            <h3 class="sport-name">${sport.name}</h3>
          </div>
          <div class="sport-meta">
            <div class="sport-row">
              <span class="sport-label">Livello</span>
              <span class="sport-level" style="color:${levelColor}">${sport.level}</span>
            </div>
            <div class="sport-row">
              <span class="sport-label">Stagione</span>
              <span>${sport.season}</span>
            </div>
          </div>
          <div class="sport-operators">
            <div class="sport-label">Operatori</div>
            ${operatorsHtml}
          </div>
          <div class="sport-areas">
            <div class="sport-label">Aree migliori</div>
            <div class="areas-list">${areasHtml}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  gsap.fromTo('.sport-card',
    { opacity: 0, y: 25, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(1.2)' }
  );
}

// ─── TRASPORTI ───────────────────────────────────────────────
function renderTransport(container) {
  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Come Raggiungere la Sardegna</h2>
    </div>
    <p class="section-subtitle">Tutto quello che devi sapere su aeroporti, traghetti, bus, treni e noleggi.</p>

    <div class="transport-section">
      <h3 class="transport-title">Aeroporti</h3>
      <div class="transport-grid">
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#C8102E">
            <strong>Cagliari–Elmas (CAG)</strong>
            <span class="transport-badge">Sud</span>
          </div>
          <p>Principale aeroporto dell'isola. Compagnie: Ryanair, EasyJet, ITA Airways, Volotea, Aeroitalia, Wizzair. Destinazioni 2026: Milano, Roma, Bologna, Torino, Barcellona, Londra, Parigi, Francoforte e altri. Voli interni Aeroitalia da €29.99.</p>
          <p class="transport-note">Dal centro: Bus ARST / taxi. 7 km.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#C8102E">
            <strong>Olbia–Costa Smeralda (OLB)</strong>
            <span class="transport-badge">Nord</span>
          </div>
          <p>Porta della Costa Smeralda. Compagnie: Ryanair, EasyJet, ITA, Volotea, Aeroitalia. Novità 2026: Delta Air Lines JFK–Olbia (rotta transatlantica diretta), Siviglia, Lione. Molto trafficato luglio–agosto.</p>
          <p class="transport-note">Dal centro Olbia: 4 km. Bus, taxi, noleggio auto in aeroporto.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#C8102E">
            <strong>Alghero–Fertilia (AHO)</strong>
            <span class="transport-badge">Nord-Ovest</span>
          </div>
          <p>Aeroporto del nord-ovest, porta di Alghero e Sassari. Compagnie: Ryanair, Volotea, Aeroitalia. Destinazioni: Milano, Roma, Torino, Londra, Dublino, Manchester, Madrid. Crescita attesa 2026.</p>
          <p class="transport-note">Da Alghero: 12 km. Bus AF (€1), taxi, noleggio auto.</p>
        </div>
      </div>
    </div>

    <div class="transport-section">
      <h3 class="transport-title">Traghetti</h3>
      <div class="transport-grid">
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Genova – Porto Torres / Olbia</strong>
          </div>
          <p>Tirrenia, GNV, Moby Lines. Durata: 10-13 ore. Partenze serali (20:00-21:00), arrivo mattina. Cabin disponibili. Prezzi 2026: da €50 (ponte) a €300+ (cabina alta stagione).</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Livorno – Olbia</strong>
          </div>
          <p>Moby Lines, Corsica Sardinia Ferries. Durata: 6-7 ore (nave veloce 4-5h). Rotta molto frequentata. Da €45 (ponte bassa stagione).</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Civitavecchia – Olbia / Cagliari</strong>
          </div>
          <p>Tirrenia, Grimaldi Lines. Civitavecchia–Olbia: 7-8h, da €40. Civitavecchia–Cagliari: 15h (notturna), da €60. Partenze frequenti tutto l'anno.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Napoli – Cagliari</strong>
          </div>
          <p>Tirrenia, GNV. Durata: 16-18 ore. Rotta notturna con cabin. Ottima opzione per chi viene dal sud Italia. Da €55.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Barcellona – Porto Torres</strong>
          </div>
          <p>Grimaldi Lines. Rotta internazionale 12h. Ideale per chi viene dalla Spagna. Da €80/persona (auto inclusa da ~€130).</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#00BFFF">
            <strong>Corsica – Santa Teresa di Gallura</strong>
          </div>
          <p>Moby Lines, La Méridionale. Traghetto più breve: 50 min da Bonifacio. Perfetto per combinare Sardegna e Corsica.</p>
        </div>
      </div>
    </div>

    <div class="transport-section">
      <h3 class="transport-title">In Sardegna</h3>
      <div class="transport-grid">
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#32CD32">
            <strong>Auto a Noleggio</strong>
          </div>
          <p>Consigliato: la Sardegna si vive in auto. Disponibile in tutti e 3 gli aeroporti. Operatori: Hertz, Europcar, Avis, Sixt, Maggiore e locali (Sardauto, Autoeuropa Sardegna). Prezzi: da €25/giorno (compatta) a €80/giorno (SUV) in estate.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#32CD32">
            <strong>Moto e Scooter</strong>
          </div>
          <p>Ideali per le strade panoramiche. Scooter da €35/giorno, moto avventura fino a €150/giorno. Operatori: Sard Bike (Cagliari), Exclusive Moto (Olbia), Bike Sharing (centri urbani).</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#32CD32">
            <strong>Bus ARST</strong>
          </div>
          <p>350+ linee su tutta la Sardegna. Utile per connettere le città principali. Piano strategico 2026–2028 con nuovi mezzi. Biglietti: da €1,50 urbano. Arst.sardegna.it per orari.</p>
        </div>
        <div class="transport-card glass-card">
          <div class="transport-card-header" style="border-left-color:#32CD32">
            <strong>Treni</strong>
          </div>
          <p>Trenitalia: 4 linee principali (Cagliari–Sassari, Cagliari–Olbia, Sassari–Olbia, Cagliari–Carbonia). Lenti ma panoramici. ARST ferroviario: scartamento ridotto + Trenino Verde storico (da €10/tratta). Treninoverde.com.</p>
        </div>
      </div>
    </div>
  `;
}

// ─── ITINERARI PRONTI ────────────────────────────────────────
const ITIN_PHOTOS = {
  'itin001': 'https://commons.wikimedia.org/wiki/Special:FilePath/Costa_Smeralda_Sardinia_emerald_water.jpg?width=600',
  'itin002': 'https://commons.wikimedia.org/wiki/Special:FilePath/Su_Nuraxi_di_Barumini_aerial_view.jpg?width=600',
  'itin003': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sardinia_landscape_panorama_coast.jpg?width=600',
  'itin004': 'https://commons.wikimedia.org/wiki/Special:FilePath/Selvaggio_Blu_trekking_Sardinia_Supramonte.jpg?width=600',
  'itin005': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cala_Goloritzé_kayak_Golfo_Orosei.jpg?width=600',
  'itin006': 'https://commons.wikimedia.org/wiki/Special:FilePath/Alghero_bastions_sunset_Sardinia.jpg?width=600',
  'itin007': 'https://commons.wikimedia.org/wiki/Special:FilePath/Bosa_Castello_Malaspina_Sardinia.jpg?width=600',
  'itin008': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cagliari_Bastione_San_Remy_panorama.jpg?width=600',
  'itin009': 'https://commons.wikimedia.org/wiki/Special:FilePath/Porto_Ferro_beach_surf_winter_Sardinia.jpg?width=600',
  'itin010': 'https://commons.wikimedia.org/wiki/Special:FilePath/Tharros_columns_Oristano_Sardinia.jpg?width=600'
};

const ITINERARI_DATA = [
  {
    id: 'itin001', nome: 'Nord Sardegna in 7 giorni', tema: 'Mare + Cultura + Natura',
    durata: 7, zona: 'Nord Sardegna', stagione: 'Maggio–Ottobre', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Olbia', att: 'Arrivo, museo archeologico, Piazza Margherita' },
      { g: 2, luogo: 'Costa Smeralda', att: 'Porto Cervo, Spiaggia del Principe, Capriccioli, Romazzino' },
      { g: 3, luogo: 'Arcipelago Maddalena', att: 'Traghetto da Palau, tour barca (Spargi, Budelli, Spiaggia Rosa)' },
      { g: 4, luogo: 'San Teodoro', att: 'La Cinta (fenicotteri), Cala Brandinchi, riserva naturale' },
      { g: 5, luogo: 'Alghero', att: 'Sella & Mosca cantina, centro storico catalano, bastioni al tramonto' },
      { g: 6, luogo: 'Alghero', att: 'Grotta di Nettuno (traghetto), Porto Conte, snorkeling' },
      { g: 7, luogo: 'Stintino', att: 'La Pelosa (prenotare accesso!), Stagno di Pilo, partenza' }
    ]
  },
  {
    id: 'itin002', nome: 'Sud Sardegna in 5 giorni', tema: 'Mare cristallino + Archeologia + Gastronomia',
    durata: 5, zona: 'Sud Sardegna', stagione: 'Aprile–Ottobre', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Cagliari', att: 'Quartiere Castello, Bastione San Remy, Mercato San Benedetto, Poetto' },
      { g: 2, luogo: 'Villasimius', att: 'AMP Capo Carbonara, Spiaggia Campus, Stagno Notteri (fenicotteri)' },
      { g: 3, luogo: 'Barumini', att: 'Su Nuraxi UNESCO, Casa Zapata, Giara di Gesturi (cavalli selvatici)' },
      { g: 4, luogo: 'Pula / Chia', att: 'Spiagge di Chia, dune, Su Giudeu, Torre di Chia al tramonto' },
      { g: 5, luogo: 'Sulcis', att: 'Porto Flavia a Masua, Pan di Zucchero, Porto Pino, partenza' }
    ]
  },
  {
    id: 'itin003', nome: 'Gran Tour Sardegna in 10 giorni', tema: 'Mare, natura, cultura e borghi',
    durata: 10, zona: 'Tutta la Sardegna', stagione: 'Maggio–Giu / Set–Ott', difficolta: 'Facile-Medio',
    tappe: [
      { g: 1, luogo: 'Cagliari', att: 'Arrivo, Castello, Bastione San Remy, Poetto' },
      { g: 2, luogo: 'Villasimius + Chia', att: 'AMP Capo Carbonara mattina, spiagge Chia pomeriggio' },
      { g: 3, luogo: 'Oristano + Tharros', att: 'Tharros, spiagge del Sinis (Is Arutas, Mari Ermi)' },
      { g: 4, luogo: 'Bosa + Alghero', att: 'Castello Malaspina, SP49 panoramica costiera, arrivo Alghero' },
      { g: 5, luogo: 'Alghero + Stintino', att: 'Grotta di Nettuno mattina, La Pelosa a Stintino' },
      { g: 6, luogo: 'Palau + Maddalena', att: 'Traghetto Maddalena, tour in barca isole' },
      { g: 7, luogo: 'Costa Smeralda', att: 'Porto Cervo, spiagge, San Teodoro serata' },
      { g: 8, luogo: 'Nuoro + Cala Gonone', att: 'MAN museo, Orgosolo murales, Cala Gonone' },
      { g: 9, luogo: 'Golfo di Orosei', att: 'Tour barca Cala Luna/Cala Mariolu, Canyon Gorropu trekking' },
      { g: 10, luogo: 'Barumini + Cagliari', att: 'Su Nuraxi mattina, rientro e partenza' }
    ]
  },
  {
    id: 'itin004', nome: 'Ogliastra Est in 4 giorni', tema: 'Natura selvaggia + Trekking + Golfo di Orosei',
    durata: 4, zona: 'Ogliastra / Est Sardegna', stagione: 'Apr–Giu / Set–Ott', difficolta: 'Medio',
    tappe: [
      { g: 1, luogo: 'Arbatax / Tortolì', att: 'Arrivo, Rocce Rosse, Spiaggia di Cea, Laguna di Tortolì' },
      { g: 2, luogo: 'Cala Gonone', att: 'Tour in gommone Golfo di Orosei (Cala Luna, Cala Mariolu, Cala Biriola)' },
      { g: 3, luogo: 'Dorgali / Supramonte', att: 'Canyon di Gorropu (trekking guidato 6h), Grotta di Ispinigoli' },
      { g: 4, luogo: 'Trenino Verde', att: 'Trenino Verde Mandas-Arbatax (stagionale) oppure trekking a Tiscali' }
    ]
  },
  {
    id: 'itin005', nome: 'Percorso Enogastronomico in 5 giorni', tema: 'Vini, formaggi, pasta e tradizioni',
    durata: 5, zona: 'Barbagia + Marmilla + Campidano', stagione: 'Tutto l\'anno (ottobre per vendemmia)', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Cagliari', att: 'Mercato San Benedetto, culurgiones e bottarga, enoteca Cannonau' },
      { g: 2, luogo: 'Barumini + Marmilla', att: 'Su Nuraxi, caseifici locali (Pecorino DOP), cantina della Marmilla' },
      { g: 3, luogo: 'Nuoro + Oliena', att: 'Cantina di Oliena (Cannonau), museo del costume, Orgosolo murales' },
      { g: 4, luogo: 'Dorgali', att: 'Cantine Dorgali (Cannonau DOC), laboratorio malloreddus' },
      { g: 5, luogo: 'Bosa', att: 'Malvasia di Bosa DOCG, cantine storiche, Castello Malaspina, partenza' }
    ]
  },
  {
    id: 'itin006', nome: 'On the Road Nord-Sud in 8 giorni', tema: 'Borghi interni, cultura e paesaggi',
    durata: 8, zona: 'Asse centrale (Olbia–Cagliari)', stagione: 'Primavera e Autunno', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Olbia / Golfo Aranci', att: 'Arrivo traghetto, porto e lungomare' },
      { g: 2, luogo: 'Monti + Pattada', att: 'Architettura in granito del \'600, Vermentino DOCG, coltelli tradizionali resolzas' },
      { g: 3, luogo: 'Ozieri + Rebeccu', att: 'Museo archeologico, copulette alle mandorle, villaggio abbandonato di Rebeccu' },
      { g: 4, luogo: 'Nuoro + Mamoiada', att: 'Casa Museo Deledda, MAN arte, Museo Maschere Mediterranee' },
      { g: 5, luogo: 'Orgosolo + Atzara', att: 'Murales, canto a tenore, Mandrolisai DOC, tessitura locale' },
      { g: 6, luogo: 'Laconi + Giara di Gesturi', att: 'Museo menhir, Parco Aymerich, cavalli selvatici della Giara' },
      { g: 7, luogo: 'Barumini + San Sperate', att: 'Su Nuraxi UNESCO, murales e giardino megalitico di Sciola' },
      { g: 8, luogo: 'Cagliari', att: 'Castello, Poetto, Mercato San Benedetto, partenza' }
    ]
  },
  {
    id: 'itin007', nome: 'Route 66 Sarda — Costa Est SS125', tema: 'Costa orientale: spiagge e borghi marinari',
    durata: 5, zona: 'Costa Est (Olbia–Arbatax)', stagione: 'Giugno / Settembre', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Olbia / Porto San Paolo', att: 'AMP Tavolara, Lu Impostu, Cala Brandinchi' },
      { g: 2, luogo: 'San Teodoro + Posada', att: 'Laguna La Cinta (fenicotteri), Castello della Fava a Posada' },
      { g: 3, luogo: 'Capo Comino + Orosei', att: 'Dune bianche, faro, Oasi di Biderosa (5 calette protette)' },
      { g: 4, luogo: 'Dorgali + Cala Gonone', att: 'Nuraghe Serra Orrios, formaggi locali, tour in barca' },
      { g: 5, luogo: 'Arbatax', att: 'Rocce Rosse al tramonto, Porto Frailis, Cala Moresca, partenza' }
    ]
  },
  {
    id: 'itin008', nome: 'Romanico Oristanese in 2 giorni', tema: 'Architetture medievali + archeologia',
    durata: 2, zona: 'Oristano / Meilogu', stagione: 'Tutto l\'anno', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Oristano', att: 'Cattedrale, Museo Antiquarium Arborense, Tharros + spiagge del Sinis' },
      { g: 2, luogo: 'Meilogu', att: 'Santa Trinita di Saccargia, Nuraghe Santu Antine, Necropoli Sant\'Andrea Priu' }
    ]
  },
  {
    id: 'itin009', nome: 'Nuoro e Barbagia Letteraria in 2 giorni', tema: 'Letteratura, arte e cultura barbaricina',
    durata: 2, zona: 'Nuoro / Barbagia', stagione: 'Tutto l\'anno', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Nuoro', att: 'Casa Museo Grazia Deledda (Nobel 1926), MAN Museo Arte, Museo del Costume' },
      { g: 2, luogo: 'Orgosolo + Oliena', att: 'Murales politici, Sorgenti di Su Gologone, cantine Cannonau' }
    ]
  },
  {
    id: 'itin010', nome: 'Borghi Interni e Gennargentu in 3 giorni', tema: 'Dolci tipici, montagna, autenticità',
    durata: 3, zona: 'Barbagia / Gennargentu', stagione: 'Set–Nov / Mar–Mag', difficolta: 'Facile',
    tappe: [
      { g: 1, luogo: 'Tonara', att: 'Laboratori torrone artigianale, museo del torrone, prodotti tipici' },
      { g: 2, luogo: 'Aritzo + Desulo', att: 'Paese delle castagne, escursione Gennargentu, costumi tradizionali' },
      { g: 3, luogo: 'Mamoiada', att: 'Museo Maschere Mediterranee, Mamuthones e Issohadores, cantine locali' }
    ]
  }
];

// ─── RENDER ITINERARI ─────────────────────────────────────────
function renderItinerari(container) {
  const themeColors = {
    'Facile': '#32CD32',
    'Facile-Medio': '#FF8C00',
    'Medio': '#C8102E'
  };

  let expanded = null;

  function render() {
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Itinerari Pronti</h2>
      </div>
      <p class="section-subtitle">10 percorsi verificati — da 2 a 10 giorni, temi diversi. Clicca per vedere le tappe giorno per giorno.</p>
      <div class="itinerari-grid">
        ${ITINERARI_DATA.map(itin => {
          const isOpen = expanded === itin.id;
          const diffColor = themeColors[itin.difficolta] || '#fff';
          const tappeHtml = itin.tappe.map(t => `
            <div class="itinerary-day-row">
              <span class="itin-day-num">G${t.g}</span>
              <span class="itin-day-luogo">${t.luogo}</span>
              <span class="itin-day-att">${t.att}</span>
            </div>`).join('');
          return `
          <div class="itin-card glass-card ${isOpen ? 'itin-open' : ''}" data-id="${itin.id}">
            ${ITIN_PHOTOS[itin.id] ? `
            <div class="itin-photo-band">
              <img src="${ITIN_PHOTOS[itin.id]}" alt="${itin.nome}" loading="lazy" onerror="this.parentElement.style.display='none'">
              <div class="itin-photo-band-overlay"></div>
              <span class="itin-days-badge itin-days-badge-photo">${itin.durata} giorni</span>
            </div>` : ''}
            <div class="itin-card-header">
              <div class="itin-card-top">
                <span class="itin-badge" style="background:${diffColor}22;color:${diffColor};border-color:${diffColor}40">${itin.difficolta}</span>
                ${!ITIN_PHOTOS[itin.id] ? `<span class="itin-days-badge">${itin.durata} giorni</span>` : ''}
              </div>
              <h3 class="itin-title">${itin.nome}</h3>
              <div class="itin-meta">
                <span class="itin-tema">${itin.tema}</span>
                <span class="itin-zona">${itin.zona}</span>
              </div>
              <div class="itin-stagione">Stagione: ${itin.stagione}</div>
              <button class="itin-expand-btn">${isOpen ? 'Nascondi tappe ↑' : 'Vedi tappe ↓'}</button>
            </div>
            ${isOpen ? `<div class="itin-tappe">${tappeHtml}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
    `;

    gsap.fromTo('.itin-card',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: 'power2.out' }
    );

    container.querySelectorAll('.itin-expand-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const card = e.target.closest('.itin-card');
        const id = card.dataset.id;
        expanded = expanded === id ? null : id;
        render();
      });
    });
  }

  render();
}

// Esponi funzione globale per back button tools
window.closeToolSection = closeToolSection;

// ─── SOCIAL WALL DATA ─────────────────────────────────────────
// Post curati da account reali Instagram — foto, video e reel
const SOCIAL_WALL_DATA = [
  // @visit.sardinia
  {
    id: 1, account: '@visit.sardinia', accountName: 'Visit Sardinia',
    type: 'reel', location: 'Cala Goloritzé, Baunei (OG)',
    caption: 'Un paradiso nascosto tra le falesie del Golfo di Orosei. Cala Goloritzé, patrimonio UNESCO, raggiungibile solo a piedi o via mare. La più bella della Sardegna — senza dubbio.',
    hashtags: ['#visitSardinia', '#CalaGoloritzé', '#Sardinia', '#GolfodiOrosei', '#BeachLife'],
    likes: 18400, comments: 892, daysAgo: 2, topics: ['spiagge', 'natura'],
    gradient: 'linear-gradient(135deg, #003d6b 0%, #006b9e 50%, #00b5e2 100%)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Cala_Goloritz%C3%A9_3.JPG',
    igLink: 'https://www.instagram.com/visit.sardinia/'
  },
  {
    id: 2, account: '@visit.sardinia', accountName: 'Visit Sardinia',
    type: 'photo', location: 'La Pelosa, Stintino (SS)',
    caption: 'Acque cristalline color smeraldo, sabbia bianca e la torre aragonese del XVI secolo. La Pelosa è il biglietto da visita della Sardegna settentrionale. Prenotazione obbligatoria — i posti sono limitati.',
    hashtags: ['#LaPelosa', '#Stintino', '#Sardinia', '#MareSardo', '#VisitItaly'],
    likes: 14200, comments: 445, daysAgo: 6, topics: ['spiagge'],
    gradient: 'linear-gradient(135deg, #1a6b8a 0%, #29a8d0 50%, #a0e4f8 100%)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Beach_Della_Pelosa_%28527708116%29.jpg',
    igLink: 'https://www.instagram.com/visit.sardinia/'
  },
  // @2theisland_
  {
    id: 3, account: '@2theisland_', accountName: '2 The Island',
    type: 'reel', location: 'Costa Smeralda, Arzachena (SS)',
    caption: 'Colori che sembrano photoshoppati ma sono reali. La Costa Smeralda in bassa stagione appartiene solo a te — il mare è ancora perfetto, senza yacht e senza folla. Questo è il privilegio di chi sa scegliere quando venire.',
    hashtags: ['#CostaSmeralda', '#Sardinia', '#2theisland', '#SardiniaTravel', '#ItalyTravel'],
    likes: 9800, comments: 378, daysAgo: 4, topics: ['spiagge', 'viaggi'],
    gradient: 'linear-gradient(135deg, #003d3d 0%, #006060 50%, #00c0a0 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/2theisland_/'
  },
  {
    id: 4, account: '@2theisland_', accountName: '2 The Island',
    type: 'photo', location: 'Capo Testa, Santa Teresa Gallura (SS)',
    caption: 'Il granito scolpito dal vento di Capo Testa all\'alba. Ogni scoglio racconta millenni di Maestrale. Un posto che ridefinisce la parola "selvaggio".',
    hashtags: ['#CapoTesta', '#SantaTeresaGallura', '#Gallura', '#Sardinia', '#Granite'],
    likes: 6340, comments: 212, daysAgo: 9, topics: ['natura', 'viaggi'],
    gradient: 'linear-gradient(135deg, #1a2744 0%, #2d5986 40%, #e8a857 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/2theisland_/'
  },
  // @sardinia_reggae_festival
  {
    id: 5, account: '@sardinia_reggae_festival', accountName: 'Sardinia Reggae Festival',
    type: 'video', location: 'Budoni (SS)',
    caption: 'Edizione 2026 — lineup annunciato. Tre giorni di musica reggae sotto le stelle, spiaggia, sound system jamaicano e vibrazioni positive. Biglietti in pre-vendita disponibili.',
    hashtags: ['#SardiniaReggaeFestival', '#Reggae', '#Sardinia', '#Festival', '#Summer2026'],
    likes: 7650, comments: 534, daysAgo: 3, topics: ['musica'],
    gradient: 'linear-gradient(135deg, #1a4a00 0%, #2d8000 50%, #ffd700 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardinia_reggae_festival/'
  },
  {
    id: 6, account: '@sardinia_reggae_festival', accountName: 'Sardinia Reggae Festival',
    type: 'photo', location: 'Festival Arena, Budoni',
    caption: 'Il momento più bello — mille persone sotto il palco, onde del mare a 50 metri, musica che riempie tutto. Questo è il Sardinia Reggae Festival. Ci vediamo in agosto.',
    hashtags: ['#SardiniaReggaeFestival', '#Reggae', '#Sardinia', '#Concerts', '#VibesOnly'],
    likes: 4230, comments: 189, daysAgo: 15, topics: ['musica'],
    gradient: 'linear-gradient(135deg, #0d2600 0%, #1a4d00 50%, #ff6600 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardinia_reggae_festival/'
  },
  // @coco.sardinia
  {
    id: 7, account: '@coco.sardinia', accountName: 'Coco Sardinia',
    type: 'photo', location: 'Trattoria Sa Mandra, Alghero',
    caption: 'Culurgiones alle patate e menta, seadas al miele amaro, malloreddus al ragù di cinghiale. La cucina sarda è comfort food nell\'accezione più alta del termine. Ingredienti semplici, sapori indimenticabili.',
    hashtags: ['#CucinaSarda', '#Culurgiones', '#Sardinia', '#FoodItaly', '#TraditionalFood'],
    likes: 8920, comments: 341, daysAgo: 5, topics: ['food'],
    gradient: 'linear-gradient(135deg, #3d1400 0%, #8b3010 50%, #e8701a 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/coco.sardinia/'
  },
  {
    id: 8, account: '@coco.sardinia', accountName: 'Coco Sardinia',
    type: 'reel', location: 'Mercato di San Benedetto, Cagliari',
    caption: 'Il mercato coperto più grande d\'Italia — tre piani, prodotti locali che non esistono altrove: bottarga di muggine, ricotta di pecora fresca, mirto, sa pompia. Un\'ora qui vale più di qualsiasi guida.',
    hashtags: ['#MercatoSanBenedetto', '#Cagliari', '#Bottarga', '#Sardinia', '#FoodMarket'],
    likes: 5460, comments: 178, daysAgo: 8, topics: ['food', 'borghi'],
    gradient: 'linear-gradient(135deg, #2a1800 0%, #6b4010 50%, #d4870a 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/coco.sardinia/'
  },
  // @sardiniawildadventure
  {
    id: 9, account: '@sardiniawildadventure', accountName: 'Sardinia Wild Adventure',
    type: 'reel', location: 'Selvaggio Blu, Baunei (OG)',
    caption: 'Selvaggio Blu — il trekking più difficile e più bello d\'Italia. 7 giorni lungo la costa del Golfo di Orosei, corde e capi verso il basso, zero strade. Niente fotografie preparano a questo.',
    hashtags: ['#SelvaggioBlù', '#Sardinia', '#Trekking', '#WildAdventure', '#Hiking'],
    likes: 15800, comments: 723, daysAgo: 1, topics: ['sport', 'natura'],
    gradient: 'linear-gradient(135deg, #0a2a20 0%, #1a6040 50%, #3db87e 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardiniawildadventure/'
  },
  {
    id: 10, account: '@sardiniawildadventure', accountName: 'Sardinia Wild Adventure',
    type: 'photo', location: 'Gola di Gorroppu, Urzulei (NU)',
    caption: 'La gola più profonda d\'Europa — pareti verticali di 400 metri, il torrente Flumineddu in fondo, lecci e corbezzoli aggrappati alla roccia. Una delle esperienze naturalistiche più potenti dell\'isola.',
    hashtags: ['#Gorroppu', '#Sardinia', '#Trekking', '#Canyon', '#NatureSardinia'],
    likes: 6720, comments: 284, daysAgo: 11, topics: ['natura', 'sport'],
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #4a2a10 50%, #8b6040 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardiniawildadventure/'
  },
  // @sardiniaslackline
  {
    id: 11, account: '@sardiniaslackline', accountName: 'Sardinia Slackline',
    type: 'reel', location: 'Falesie di Domusnovas (SU)',
    caption: 'Highline tra le falesie calcaree a 90 metri d\'altezza, con vista sul mare all\'orizzonte. La Sardegna è uno degli spot di highline più incredibili d\'Europa — la roccia è perfetta e i panorami non hanno paragoni.',
    hashtags: ['#Slackline', '#Highline', '#Sardinia', '#Slacklining', '#SardiniaAdventure'],
    likes: 11200, comments: 498, daysAgo: 3, topics: ['sport'],
    gradient: 'linear-gradient(135deg, #001a3d 0%, #0040a0 50%, #00aaff 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardiniaslackline/'
  },
  {
    id: 12, account: '@sardiniaslackline', accountName: 'Sardinia Slackline',
    type: 'photo', location: 'Ogliastra, Baunei',
    caption: 'Longline sul plateau dell\'Ogliastra — 200 metri di corda, vento a 15 nodi, blu del Tirreno sotto. Il progetto "Sardinia Sky" continua, seguici.',
    hashtags: ['#Longline', '#Sardinia', '#SardiniaSlackline', '#Balancing', '#Outdoor'],
    likes: 4560, comments: 167, daysAgo: 18, topics: ['sport'],
    gradient: 'linear-gradient(135deg, #002244 0%, #004488 50%, #66aadd 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardiniaslackline/'
  },
  // @sardegna_official_
  {
    id: 13, account: '@sardegna_official_', accountName: 'Sardegna Official',
    type: 'photo', location: 'Bastioni di Alghero (SS)',
    caption: 'Alghero al tramonto — il cielo prende fuoco sopra i bastioni catalani e il mare diventa bronzo. Uno di quei momenti che non si descrivono, si vivono.',
    hashtags: ['#Alghero', '#Sardegna', '#Tramonto', '#Sunset', '#SardegnaOfficial'],
    likes: 9340, comments: 312, daysAgo: 7, topics: ['borghi', 'natura'],
    gradient: 'linear-gradient(135deg, #0a2040 0%, #c04010 60%, #ffa040 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardegna_official_/'
  },
  {
    id: 14, account: '@sardegna_official_', accountName: 'Sardegna Official',
    type: 'video', location: 'Mamoiada (NU)',
    caption: 'Carnevale di Mamoiada 2026 — i Mamuthones escono nella notte. Maschere nere di legno, campanacci, silenzio rotto solo dal ritmo pesante. Una delle tradizioni più antiche e intense d\'Europa.',
    hashtags: ['#Mamoiada', '#Mamuthones', '#CarnevaleSardo', '#Sardegna', '#Tradizioni'],
    likes: 12800, comments: 567, daysAgo: 45, topics: ['cultura'],
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #3a1a00 40%, #8b2000 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardegna_official_/'
  },
  // @sardegna_live
  {
    id: 15, account: '@sardegna_live', accountName: 'Sardegna Live',
    type: 'photo', location: 'Desulo (NU), Barbagia',
    caption: 'Autunno in Barbagia — un paese che apre le porte. Cantine, forni, laboratori artigianali. Le signore che fanno il pane carasau come 200 anni fa. Queste tradizioni sopravvivono perché qualcuno le vive ancora.',
    hashtags: ['#AutunnoinBarbagia', '#Barbagia', '#Sardegna', '#Tradizioni', '#CortesApertas'],
    likes: 5670, comments: 198, daysAgo: 60, topics: ['cultura', 'borghi'],
    gradient: 'linear-gradient(135deg, #3d2b00 0%, #7a5c1e 50%, #c4a55a 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardegna_live/'
  },
  {
    id: 16, account: '@sardegna_live', accountName: 'Sardegna Live',
    type: 'video', location: 'Cagliari',
    caption: 'Festa di Sant\'Efisio 2026 — 370 anni di storia ininterrotta. Il corteo da Cagliari a Pula: migliaia di figuranti in costume, il carro trainato dai buoi. La Sardegna che si ricorda di sé stessa.',
    hashtags: ['#SantEfisio', '#Cagliari', '#FestaSarda', '#Sardegna', '#Tradizioni'],
    likes: 8900, comments: 423, daysAgo: 55, topics: ['cultura'],
    gradient: 'linear-gradient(135deg, #1a0000 0%, #6b0000 50%, #c8102e 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/sardegna_live/'
  },
  // @lanuovasardegna
  {
    id: 17, account: '@lanuovasardegna', accountName: 'La Nuova Sardegna',
    type: 'photo', location: 'Barbagia, Nuoro',
    caption: 'I colori dell\'autunno in Barbagia — querce, lecci e cespugli si incendiano di rosso e arancio. L\'interno dell\'isola in ottobre è uno spettacolo che quasi nessun turista conosce.',
    hashtags: ['#Barbagia', '#Nuoro', '#Sardegna', '#Autunno', '#NaturaSarda'],
    likes: 3240, comments: 98, daysAgo: 55, topics: ['natura'],
    gradient: 'linear-gradient(135deg, #2d3a1e 0%, #4a6741 50%, #c04010 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/lanuovasardegna/'
  },
  {
    id: 18, account: '@lanuovasardegna', accountName: 'La Nuova Sardegna',
    type: 'photo', location: 'Sassari',
    caption: 'La Cavalcata Sarda 2026 — 3.500 figuranti da oltre 100 comuni. I costumi, i ricami, i gioielli d\'argento: l\'identità sarda che si mostra al mondo in tutta la sua complessità.',
    hashtags: ['#CavalcataSarda', '#Sassari', '#Sardegna', '#Folklore', '#CostumiSardi'],
    likes: 5120, comments: 234, daysAgo: 37, topics: ['cultura'],
    gradient: 'linear-gradient(135deg, #1a2744 0%, #c8102e 50%, #ffd700 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/lanuovasardegna/'
  },
  // @saludetrigu
  {
    id: 19, account: '@saludetrigu', accountName: 'Salude & Trigu',
    type: 'video', location: 'Bitti (NU)',
    caption: 'Tenores di Bitti — Patrimonio Immateriale UNESCO. La polifonia sarda è una delle forme vocali più antiche d\'Europa: sa boghe, sa mesu boghe, sa contra, su bassu. Quattro voci, un\'anima sola.',
    hashtags: ['#TenoresdiBitti', '#Launeddas', '#MusicaSarda', '#UNESCO', '#Sardegna'],
    likes: 21400, comments: 987, daysAgo: 12, topics: ['musica', 'cultura'],
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #4a2000 50%, #8b4500 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/saludetrigu/'
  },
  {
    id: 20, account: '@saludetrigu', accountName: 'Salude & Trigu',
    type: 'photo', location: 'Orosei (NU)',
    caption: 'Le launeddas — lo strumento a fiato più antico del Mediterraneo, 3.000 anni di storia. Il suono delle launeddas è la Sardegna che respira. Ogni nota è memoria collettiva.',
    hashtags: ['#Launeddas', '#MusicaSarda', '#Sardegna', '#Patrimonio', '#Tradizioni'],
    likes: 7830, comments: 345, daysAgo: 28, topics: ['musica', 'cultura'],
    gradient: 'linear-gradient(135deg, #2a0800 0%, #6b2000 50%, #c04010 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/saludetrigu/'
  },
  // @siviaggiare_sardegna
  {
    id: 21, account: '@siviaggiare_sardegna', accountName: 'Si Viaggiare Sardegna',
    type: 'reel', location: 'Sardegna — road trip',
    caption: 'Una settimana, 800 km, la Sardegna da nord a sud. Dal granito della Gallura al calcare dell\'Iglesias, passando per le pianure dell\'Oristanese e le montagne della Barbagia.',
    hashtags: ['#SiViaggiare', '#Sardegna', '#RoadTrip', '#Sardinia', '#ItalyRoadTrip'],
    likes: 6800, comments: 289, daysAgo: 20, topics: ['viaggi', 'natura'],
    gradient: 'linear-gradient(135deg, #003d6b 0%, #1a6b8a 50%, #3db87e 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/siviaggiare_sardegna/'
  },
  {
    id: 22, account: '@siviaggiare_sardegna', accountName: 'Si Viaggiare Sardegna',
    type: 'photo', location: 'Tharros, Laguna di Cabras (OR)',
    caption: 'Il Sinis e la laguna di Cabras — tra i resti di Tharros (fenici, romani) e le acque dove svernano i fenicotteri. Un angolo della Sardegna che quasi nessuno conosce davvero.',
    hashtags: ['#Oristano', '#Tharros', '#LagunadiCabras', '#Sardegna', '#Fenicotteri'],
    likes: 4120, comments: 156, daysAgo: 31, topics: ['natura', 'cultura'],
    gradient: 'linear-gradient(135deg, #1a3d4a 0%, #2d7a8a 50%, #f4a261 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/siviaggiare_sardegna/'
  },
  // @redvalleyfestival
  {
    id: 23, account: '@redvalleyfestival', accountName: 'Red Valley Festival',
    type: 'reel', location: 'Olbia Arena, Olbia (OT)',
    caption: 'Red Valley Festival 2026 — 13-15 agosto, Olbia. Lineup svelato. Tre notti di musica con artisti internazionali, il mare a due passi, l\'estate sarda come cornice. I biglietti stanno andando.',
    hashtags: ['#RedValleyFestival', '#Olbia', '#Sardinia', '#MusicFestival', '#RVF2026'],
    likes: 28600, comments: 1420, daysAgo: 5, topics: ['musica'],
    gradient: 'linear-gradient(135deg, #1a0000 0%, #4a0000 40%, #c8102e 80%, #ff4040 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/redvalleyfestival/'
  },
  {
    id: 24, account: '@redvalleyfestival', accountName: 'Red Valley Festival',
    type: 'photo', location: 'Olbia Arena',
    caption: 'Recap 2025 — 60.000 persone in tre giorni, artisti da 12 paesi, il tramonto che incendiava il palco ogni sera. Il Red Valley non è solo un festival: è un momento. Agosto 2026.',
    hashtags: ['#RedValleyFestival', '#Olbia', '#Sardinia', '#Festival', '#LiveMusic'],
    likes: 16800, comments: 678, daysAgo: 90, topics: ['musica'],
    gradient: 'linear-gradient(135deg, #200000 0%, #6a0000 50%, #ff2020 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/redvalleyfestival/'
  },
  // @climbing_sardinia
  {
    id: 25, account: '@climbing_sardinia', accountName: 'Climbing Sardinia',
    type: 'photo', location: 'Domusnovas, Iglesias (SU)',
    caption: 'Canyon di Domusnovas in inverno — 750 vie su calcare, temperatura ideale (10-18°C), roccia asciutta e grippy. Uno dei migliori siti di arrampicata del Mediterraneo, ancora poco frequentato.',
    hashtags: ['#ClimbingSardinia', '#Domusnovas', '#Arrampicata', '#RockClimbing', '#Sardinia'],
    likes: 9230, comments: 387, daysAgo: 14, topics: ['sport'],
    gradient: 'linear-gradient(135deg, #1a1400 0%, #4a3a00 50%, #8b7000 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/climbing_sardinia/'
  },
  {
    id: 26, account: '@climbing_sardinia', accountName: 'Climbing Sardinia',
    type: 'reel', location: 'Ogliastra, Baunei (OG)',
    caption: 'Multi-pitch sul calcare dell\'Ogliastra — 300 metri di dislivello, vista sul Golfo di Orosei, spit perfetti. La Sardegna è tra le top 5 destinazioni di arrampicata in Europa. Punto.',
    hashtags: ['#ClimbingSardinia', '#Ogliastra', '#MultiPitch', '#ClimbingLife', '#Sardinia'],
    likes: 13400, comments: 512, daysAgo: 7, topics: ['sport'],
    gradient: 'linear-gradient(135deg, #0a1a00 0%, #2a4a00 50%, #6a9a20 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/climbing_sardinia/'
  },
  // @enricotravels_insardinia
  {
    id: 27, account: '@enricotravels_insardinia', accountName: 'Enrico Travels in Sardinia',
    type: 'reel', location: 'Cala Luna, Golfo di Orosei (NU)',
    caption: 'Il Golfo di Orosei dall\'alto — 30 km di costa inaccessibile via terra, raggiungibile solo a piedi o in barca. Le cale si aprono una dopo l\'altra come pagine di un libro che non vuoi finire.',
    hashtags: ['#CalaLuna', '#GolfodiOrosei', '#Sardinia', '#AerialView', '#IslandLife'],
    likes: 19200, comments: 834, daysAgo: 8, topics: ['natura', 'spiagge'],
    gradient: 'linear-gradient(135deg, #003344 0%, #006688 50%, #00bbdd 100%)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Cala_Luna_%28Golfo_di_Orosei%29.jpg',
    igLink: 'https://www.instagram.com/enricotravels_insardinia/'
  },
  {
    id: 28, account: '@enricotravels_insardinia', accountName: 'Enrico Travels in Sardinia',
    type: 'photo', location: 'Orgosolo (NU), Barbagia',
    caption: 'I murales di Orgosolo — 150+ opere dal 1969 ad oggi. Un museo a cielo aperto che racconta la Sardegna, la resistenza, i pastori, la vita. Niente prepara alla potenza di questo posto.',
    hashtags: ['#Orgosolo', '#Murales', '#Barbagia', '#Sardinia', '#StreetArt'],
    likes: 7640, comments: 298, daysAgo: 22, topics: ['cultura', 'borghi'],
    gradient: 'linear-gradient(135deg, #1a0000 0%, #4a1a00 40%, #c8102e 70%, #1a1a1a 100%)',
    photo: null,
    igLink: 'https://www.instagram.com/enricotravels_insardinia/'
  }
];

// ─── NORD SARDEGNA DATA ────────────────────────────────────────
const NORTH_SARDINIA_DATA = [
  {
    id: 'gallura',
    nome: 'Gallura',
    tagline: 'Granito rosa, Costa Smeralda, borghi tra i lecci',
    color: '#00B4D8',
    inverno: {
      perche: 'Temperature miti (10-16°C), turismo assente, costi dimezzati. Il granito, la macchia e il mare verde hanno un fascino irripetibile fuori stagione.',
      attivita: [
        { nome: 'Surf a Porto Ferro (Bonga Surf School)', desc: 'Spot con Maestrale, onde NW 1-3m ott-mar. Bonga Surf School: lezioni da 50€, noleggio tavole 10€/h. Tel: +39 351 945 7142, bongasurfschool.it. Il Baretto: bar+eventi+vinile (tel. +39 333 327 9256).', difficolta: 'Tutti i livelli', meteo: 'Maestrale NW 15-35 nodi' },
        { nome: 'Kitesurf Porto Pollo (5 scuole)', desc: 'World-class spot. Wind Porto Pollo (+39 331 988 9133, windportopollo.com) · Windsurf Village (+39 0789 704 075) · FH Academy (fh.academy) · Porto Pollo Adventure Center (+39 0789 704016). Corsi IKO/FIV/VDWS.', difficolta: 'Intermedio/Pro', meteo: 'Maestrale o Tramontana' },
        { nome: 'Trekking Valle della Luna', desc: '4 km A/R, dislivello 200m. Canyon di granito grigio tra i ginepri. Colori autunnali spettacolari.', difficolta: 'Facile', meteo: 'Tutto il tempo fuori dall\'estate' },
        { nome: 'MTB Monte Limbara', desc: '1362m, 50+ km di sentieri. Boschi di roverella, ginepro, vista su tutta la Gallura.', difficolta: 'Medio/Difficile', meteo: 'Evitare dopo piogge abbondanti' },
        { nome: 'Birdwatching Stagno San Teodoro', desc: '400 fenicotteri rosa svernanti, grù, aironi, germani. Ottobre-aprile. Ingresso libero.', difficolta: 'Facile', meteo: 'Qualunque (alba meglio)' },
        { nome: 'Golf Pevero Club', desc: 'Campo 18 buche con vista su Golfo di Cugnana e scogliere. Aperto tutto l\'anno. Par 72.', difficolta: 'Intermedio', meteo: 'Chiuso solo durante temporali' },
        { nome: 'Diving Arcipelago Maddalena', desc: 'Visibilità 25-35m in inverno. Secca del Papa, Secca delle Tre Sorelle. Cernie, aragoste, murene.', difficolta: 'OWD+', meteo: 'Mar calmo (vento >25 nodi: vietato)' }
      ],
      eventi: [
        { nome: 'Carnevale di Tempio Pausania', periodo: 'Gen-Feb', desc: 'Il più antico del nord Sardegna. Carri allegorici, sfilate, 4 weekend di festa nel centro storico.', link: 'https://www.carnevaletempio.it' },
        { nome: 'Fuochi di Sant\'Antonio', periodo: '16-17 gennaio', desc: 'Falò notturni in tutti i paesi della Gallura. Tradizione pagana/cristiana antichissima.' },
        { nome: 'Sagra delle Fragole', periodo: 'Maggio', desc: 'Sagra a Turri e altri comuni. Fragole, vino bianco, musica folk.' }
      ],
      meteo: { gen: '8-13°C', feb: '9-14°C', mar: '10-16°C', note: 'Maestrale frequente. Piogge concentrate nov-dic. Neve su Monte Limbara (>1000m).' }
    },
    musei: [
      { nome: 'Museo Archeologico di Olbia', desc: 'GRATUITO. Isola Peddone (di fronte al centro storico). Nave romana del 259 d.C. integra, reperti nuragici e fenici. Parcheggio gratuito Molo Brin. Tel: 0789 28290 (gruppi).', orari: 'Mar–Sab 8-13 / 16-19', costo: 'Gratuito', citta: 'Olbia' },
      { nome: 'Basilica San Simplicio', desc: 'V sec. d.C. Romanico gallurese. Tomba del martire. Aperta tutto l\'anno, ingresso libero.', orari: '8-12 / 16-19', costo: 'Gratuita', citta: 'Olbia' },
      { nome: 'Compendio Garibaldino — Caprera', desc: 'Casa dove visse e morì Garibaldi (2 giugno 1882). Letto originale, giardino, tombe. Tel: +39 0789 727162. garibaldicaprera.beniculturali.it — ingressi ogni 15 min max 20 pers.', orari: 'Escluso lun, 9-20 (ult. 19:15). Memoriale: escluso mer, 10:15-19:15', costo: '10€ combinato / under 18 gratuito', citta: 'Caprera (La Maddalena)' },
      { nome: 'Siti Arch. Arzachena — GE.SE.CO.', desc: '7 siti preistorici: Li Muri (3500 a.C.), Li Lolghi, La Prisgiona, Coddu Ecchju, Malchittu, Albucciu, Moru. Prenotare: +39 333 428 2607 — gesecoarzachena.it', orari: 'Apr-Set: 9-19. Ott-Mar ridotti', costo: 'Li Muri area: 10€. Capichera area: 7€', citta: 'Arzachena' },
      { nome: 'Castello dei Doria + Mus. Intreccio', desc: 'XII sec. Vista 180° sul Tirreno. Museo dell\'Intreccio Mediterraneo (cesteria sarda e mediterranea). Tel: +39 079 601 4769, mimcastelsardo.it', orari: 'Gen-Mar/Nov-Dic: 10-17. Apr-Ott: 9-19:30', costo: '3-5€', citta: 'Castelsardo' }
    ],
    ristoranti: [
      { nome: 'Ristorante Gallura', tipo: 'Cucina gallurese tradizionale', piatti: 'Minestra di fagioli, agnello, casizolu', zona: 'Olbia centro', prezzo: '€€€' },
      { nome: 'Trattoria L\'Arcipelago', tipo: 'Pesce fresco', piatti: 'Spigola, triglie, bottarga gallurese', zona: 'La Maddalena', prezzo: '€€' },
      { nome: 'Sa Mandra ★ Guida Michelin 2025', tipo: 'Agriturismo (Miglior agriturismo Italia — Il Golosario)', piatti: 'Porcetto allo spiedo, pasta fatta a mano, formaggi propri, miele, olio bio. 35-45€ menu fisso tutto incluso.', zona: 'SP44 km 14, Alghero — Tel: +39 079 999150 · samandra.it', prezzo: '€€' },
      { nome: 'Lu Rotu', tipo: 'Agriturismo stazzo gallurese', piatti: 'Cucina gallurese tradizionale con prodotti biologici propri, tra olivastri e tafoni', zona: 'Sant\'Antonio di Gallura', prezzo: '€€' },
      { nome: 'Cantina Gallura (Tempio)', tipo: 'Enoteca + degustazione DOCG', piatti: 'Vermentino di Gallura DOCG (unica DOCG sarda), vini, degustazioni guidate. Tel: +39 079 631 241', zona: 'Via Val di Cossu 9, Tempio Pausania · cantinagallura.net', prezzo: '€€' },
      { nome: 'Phi Beach', tipo: 'Club/Ristorante su scogliera (Costa Smeralda)', piatti: 'Cucina mediterranea (Luciano\'s), DJ set tramonto, aperitivo vista mare. Booking: +39 345 288 4254.', zona: 'Baja Sardinia, Arzachena — phibeach.com', prezzo: '€€€€' }
    ]
  },
  {
    id: 'sassari',
    nome: 'Sassari & Anglona',
    tagline: 'Città universitaria, Castellsardo medievale, Asinara selvaggia',
    color: '#7B61FF',
    inverno: {
      perche: 'Sassari funziona tutto l\'anno — città viva, musei aperti, mercati. Castelsardo in nebbia è un dipinto. L\'Asinara a novembre è desertica e surreale.',
      attivita: [
        { nome: 'Parco Nazionale Asinara', desc: 'L\'isola-carcere. Tour in 4x4 con asini albini endemici, jeep, trenino, barca, diving, kayak. Operatori autorizzati: Futurismo Asinara (futurismoasinara.com), Wild Asinara Park, AsinarAvventura. Sede: +39 079 503 388 — parcoasinara.org', difficolta: 'Facile (tour guidato)', meteo: 'Aperto tutto l\'anno. Apr-Ott tutti i giorni; Nov-Mar weekend.' },
        { nome: 'Trekking Castelsardo e dintorni', desc: 'Sentiero costiero da Castelsardo a Valledoria lungo le falesie. 8 km, vista Corsica e Asinara.', difficolta: 'Facile-Medio', meteo: 'Evitare con vento forte' },
        { nome: 'Surf Platamona', desc: 'Spiaggia lunga 20 km a nord di Sassari. Onda lenta ideale per principianti. Ottobre-marzo.', difficolta: 'Principianti', meteo: 'Tramontana o Libeccio' },
        { nome: 'Arrampicata Domusnovas', desc: '750 vie su calcare. A 2h da Sassari. Inverno = stagione migliore: temperatura ideale, roccia asciutta.', difficolta: 'Principiante/Pro', meteo: 'Evitare dopo piogge' },
        { nome: 'Equitazione Anglona', desc: 'Agriturismo con percorsi a cavallo tra le colline dell\'Anglona. Settembre-maggio.', difficolta: 'Tutti i livelli', meteo: 'Qualunque tranne pioggia forte' }
      ],
      eventi: [
        { nome: 'Cavalcata Sarda', periodo: '17 maggio', desc: '3.500 figuranti in costume da 100 comuni. Una delle sfilate folkloristiche più grandi d\'Italia.', link: 'https://www.cavalcatasarda.it' },
        { nome: 'Faradda di li Candareri', periodo: '14 agosto', desc: 'Patrimonio UNESCO. Grandi candelabri di legno trasportati dai gremio medievali di Sassari.' },
        { nome: 'Mercato di Natale Sassari', periodo: 'Dicembre', desc: 'Mercatino natalizio in piazza d\'Italia. Artigianato sardo, dolci, vini.' }
      ],
      meteo: { gen: '7-12°C', feb: '8-13°C', mar: '10-16°C', note: 'Tramontana frequente. Rarissima neve in città. Clima più continentale dell\'interno.' }
    },
    musei: [
      { nome: 'Museo Nazionale G.A. Sanna', desc: 'La più importante collezione nuragica dopo Cagliari. Statuine di bronzo, ceramiche, ori.', orari: 'Mar-Dom 9-20', costo: '3€', citta: 'Sassari' },
      { nome: 'Castello dei Doria', desc: 'XII sec. Vista su 180°. Museo dell\'intreccio (cesteria), giardino pensile.', orari: '9:30-18 (est. 9:30-20)', costo: '3€', citta: 'Castelsardo' },
      { nome: 'Nuraghe Santu Antine', desc: 'Il "Re dei Nuraghi". Torre centrale alta 17m, corridoi, terrazzo. Presso Torralba.', orari: '9-tramonto', costo: '5€', citta: 'Torralba (SS)' },
      { nome: 'Santa Trinità di Saccargia', desc: 'XII sec. Romanico pisano con strisce bianche e nere. Unica nell\'isola.', orari: '9-19 (inv. 9-17)', costo: '2€', citta: 'Codrongianos (SS)' }
    ],
    ristoranti: [
      { nome: 'Ristorante Liberty', tipo: 'Cucina sassarese', piatti: 'Farinata, trenette, trattoria storica', zona: 'Sassari centro', prezzo: '€€' },
      { nome: 'La Guardiola', tipo: 'Vista mare, pesce', piatti: 'Aragosta, granchio, risotto ai frutti di mare', zona: 'Castelsardo', prezzo: '€€€' },
      { nome: 'Agriturismo Azienda Agr. La Colti', tipo: 'Agriturismo', piatti: 'Porcetto al forno, verdure dell\'orto', zona: 'Sassari provincia', prezzo: '€€' }
    ]
  },
  {
    id: 'alghero',
    nome: 'Alghero & Riviera del Corallo',
    tagline: 'Città catalano-sarda, Grotte di Nettuno, spiagge del Lazzaretto',
    color: '#F4A261',
    inverno: {
      perche: 'Alghero non si spegne mai. Il centro storico catalano è vivibile, la Vermentino è ottima, la cucina con l\'aragosta è a prezzi umani. Novembre = stagione perfetta.',
      attivita: [
        { nome: 'Surf Porto Ferro (spot principale)', desc: 'Il miglior spot surf della Sardegna in inverno. Spiaggia selvaggia, dune, pineta. Zero servizi, pura wilderness.', difficolta: 'Intermedio/Pro', meteo: 'Maestrale >20 nodi, onda NW' },
        { nome: 'Trekking Parco Porto Conte', desc: 'Parco regionale con 26 km di sentieri. Torre Nuragica, grotte, falesie sul mare. Ideale ottobre-aprile.', difficolta: 'Facile-Medio', meteo: 'Tutto l\'anno' },
        { nome: 'Grotte di Nettuno in barca', desc: 'Disponibili tutto l\'anno (meteo permettendo). In inverno nessuna fila, il mare spesso calmo al mattino.', difficolta: 'Facile', meteo: 'Vento <15 nodi in barca' },
        { nome: 'Snorkeling Area Marina Porto Conte', desc: 'Acque protette, visibilità eccellente, posidonia, cernie, saraghi. Novembre: 19°C. Muta consigliata.', difficolta: 'Principianti', meteo: 'Mar calmo' },
        { nome: 'Cantine Sella & Mosca', desc: 'La più grande tenuta vitivinicola della Sardegna. Tour + degustazione (3 percorsi) su prenotazione. Tel: +39 079 997 746 · visit@sellaemosca.com · sellaemosca.com. Enoteca: Giu-Ott 10-20, Nov-Mag 10-18.', difficolta: 'Facile', meteo: 'Tutto l\'anno' },
        { nome: 'Cicloturismo Riviera Corallo', desc: 'Pista ciclabile dal porto al Lazzaretto (8 km). Estendibile a Fertilia e Lago Baratz.', difficolta: 'Facile', meteo: 'Tutto l\'anno (evitare vento forte)' }
      ],
      eventi: [
        { nome: 'Focs de Sant Joan', periodo: '20-24 giugno', desc: 'Festa catalana del fuoco di San Giovanni. Falò, musica, balli nel centro storico.' },
        { nome: 'Capodanno ad Alghero', periodo: '31 dic – 1 gen', desc: 'Concerto in piazza, fuochi d\'artificio sui bastioni.' },
        { nome: 'Sagra del Riccio di Mare', periodo: 'Febbraio (data variabile)', desc: 'Festival del riccio di mare con degustazioni e musica al porto.' }
      ],
      meteo: { gen: '8-14°C', feb: '9-15°C', mar: '11-17°C', note: 'Clima mediterraneo tra i più miti della Sardegna. Maestrale frequente d\'inverno.' }
    },
    musei: [
      { nome: 'Nuraghe Palmavera', desc: '1600 a.C. Complesso nuragico a 10 km da Alghero. Capanne, torre, menhir con volto scolpito.', orari: '9-19 (inv. 9-17)', costo: '5€', citta: 'Alghero (loc. Palmavera)' },
      { nome: 'Necropoli di Anghelu Ruju', desc: '38 ipogei preistorici (3500 a.C.). Tomba con sculture di tori. Presso aeroporto.', orari: '9-19 (inv. 9-17)', costo: '5€ (cumulativo con Palmavera 8€)', citta: 'Alghero' },
      { nome: 'Museo del Corallo', desc: 'Storia del corallo algherese, gioielli, sculture di corallo rosso.', orari: 'Mar-Dom 10-13 / 16-19', costo: '3€', citta: 'Alghero' },
      { nome: 'Grotte di Nettuno', desc: 'Grotta marina con 654 gradini (Escala del Cabirol) o barca da Alghero.', orari: '9-19 apr-ott · 9-16 nov-mar', costo: '14€ adulti, 7€ bambini', citta: 'Capo Caccia, Alghero' }
    ],
    ristoranti: [
      { nome: 'Il Pavone', tipo: 'Cucina algherese, aragosta', piatti: 'Aragosta alla catalana, bottarga, vernaccia', zona: 'Alghero centro', prezzo: '€€€' },
      { nome: 'Trattoria La Bussola', tipo: 'Pesce fresco', piatti: 'Saraghi, dentice, zuppa di cozze', zona: 'Alghero porto', prezzo: '€€' },
      { nome: 'Sa Mandra (Agriturismo)', tipo: 'Sardo tradizionale', piatti: 'Tutto compreso — 35€ menu fisso', zona: 'Fertilia (7 km da Alghero)', prezzo: '€€' },
      { nome: 'Sella & Mosca Ristorante', tipo: 'Cantina-ristorante', piatti: 'Cucina con abbinamento vini DOC', zona: 'Alghero (cantina)', prezzo: '€€€' }
    ]
  },
  {
    id: 'logudoro',
    nome: 'Logudoro & Meilogu',
    tagline: 'Romanico pisano, nuraghi, borghi in granito — Sardegna interna autentica',
    color: '#52B788',
    inverno: {
      perche: 'Il Logudoro in inverno è la Sardegna autentica. Borghi silenziosi, chiese romaniche deserte, cantine aperte, paesaggi che sembrano altri secoli.',
      attivita: [
        { nome: 'Tour Romanico del Logudoro', desc: 'Cinque chiese in stile romanico-pisano (XII-XIII sec.): Saccargia, San Pietro di Sorres, San Michele di Salvenero, Nostra Signora di Otti.', difficolta: 'Facile (auto)', meteo: 'Tutto l\'anno' },
        { nome: 'Nuraghe Santu Antine e Torralba', desc: 'Il nuraghe più imponente dopo Barumini. Museo di Torralba adiacente.', difficolta: 'Facile', meteo: 'Tutto l\'anno' },
        { nome: 'Trekking Necropoli S\'Antine', desc: 'Necropoli domus de janas (tombe delle fate) nel bosco. Sentiero naturalistico.', difficolta: 'Facile', meteo: 'Preferibilmente asciutto' },
        { nome: 'Visite cantine del Cannonau e Vermentino', desc: 'Cantine Trexenta, Cantina di Berchidda, Cantina del Vermentino di Monti — tour e degustazioni.', difficolta: 'Facile', meteo: 'Tutto l\'anno' },
        { nome: 'Birdwatching Lago del Coghinas', desc: 'Lago artificiale con anatre, cormorani, aironi cenerini, svassi. Inverno ideale.', difficolta: 'Facile', meteo: 'Tutto l\'anno (alba e tramonto)' }
      ],
      eventi: [
        { nome: 'Autunno in Barbagia (vicino Logudoro)', periodo: 'Set-Dic', desc: 'Weekend di paese aperti: cantine, laboratori, cucine. Coinvolge anche comuni del Logudoro.' },
        { nome: 'Fuochi di Sant\'Antonio', periodo: '16-17 gennaio', desc: 'Falò notturni in tutti i paesi della regione. Distribuzione di cibo e vino.' }
      ],
      meteo: { gen: '5-11°C', feb: '6-12°C', mar: '9-15°C', note: 'Zone interne: inverni più rigidi. Neve possibile >600m. Primavere fiorite, spettacolari.' }
    },
    musei: [
      { nome: 'San Pietro di Sorres', desc: 'Abbazia benedettina su rocca a picco. XII sec. Monaci ancora presenti. Vista panoramica unica.', orari: '8-12 / 15-18', costo: 'Gratuita', citta: 'Borutta (SS)' },
      { nome: 'Santa Trinità di Saccargia', desc: 'La più bella chiesa romanica di Sardegna. Facciata a strisce bianche e nere. Affreschi bizantini.', orari: '9-19 (inv. 9-17)', costo: '2€', citta: 'Codrongianos (SS)' },
      { nome: 'Museo Civico G. Marongiu (Cabras area)', desc: 'Giganti di Mont\'e Prama — le statue preistoriche più grandi del Mediterraneo (2 metri, XI sec. a.C.).', orari: 'Mar-Dom 9-20', costo: '7€', citta: 'Cabras (OR) — vicino Logudoro' }
    ],
    ristoranti: [
      { nome: 'Agriturismo Santa Lulla', tipo: 'Cucina logudorese tradizionale', piatti: 'Farrotto, agnello, formaggio fresco', zona: 'Meilogu area', prezzo: '€€' },
      { nome: 'Ristorante da Giovanna', tipo: 'Trattoria locale', piatti: 'Malloreddus, porcetto, dolci sardi', zona: 'Ozieri', prezzo: '€' }
    ]
  }
];

// ─── RENDER SOCIAL WALL ────────────────────────────────────────
function renderSocialWall(container) {
  let activeFilter = 'all';
  let activeAccount = 'all';
  let searchQuery = '';
  let debounceTimer = null;

  const TOPICS = [
    { key: 'all', label: 'Tutti' },
    { key: 'spiagge', label: 'Spiagge' },
    { key: 'natura', label: 'Natura' },
    { key: 'sport', label: 'Sport & Avventura' },
    { key: 'food', label: 'Food & Wine' },
    { key: 'musica', label: 'Musica & Festival' },
    { key: 'cultura', label: 'Cultura' },
    { key: 'borghi', label: 'Borghi' },
    { key: 'viaggi', label: 'Viaggi' }
  ];

  const ALL_ACCOUNTS = [...new Set(SOCIAL_WALL_DATA.map(p => p.account))].sort();

  function getFiltered() {
    let posts = SOCIAL_WALL_DATA;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      posts = posts.filter(p =>
        p.caption.toLowerCase().includes(q) ||
        p.hashtags.some(h => h.toLowerCase().includes(q)) ||
        p.location.toLowerCase().includes(q) ||
        p.account.toLowerCase().includes(q) ||
        p.accountName.toLowerCase().includes(q) ||
        (p.topics || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeFilter !== 'all') {
      posts = posts.filter(p => p.topics && p.topics.includes(activeFilter));
    }
    if (activeAccount !== 'all') {
      posts = posts.filter(p => p.account === activeAccount);
    }
    return posts;
  }

  function engagement(p) { return p.likes + p.comments * 3; }

  function fmtNum(n) {
    return n >= 10000 ? Math.round(n / 1000) + 'K' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
  }

  function typeBadge(type) {
    if (type === 'reel') return '<div class="sw-type-badge sw-badge-reel"><svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9"><path d="M3 2.5a.5.5 0 01.765-.424l9 5a.5.5 0 010 .848l-9 5A.5.5 0 013 12.5v-10z"/></svg>REEL</div>';
    if (type === 'video') return '<div class="sw-type-badge sw-badge-video"><svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9"><path d="M3 2.5a.5.5 0 01.765-.424l9 5a.5.5 0 010 .848l-9 5A.5.5 0 013 12.5v-10z"/></svg>VIDEO</div>';
    return '';
  }

  function cardHtml(post, featured) {
    const maxLen = featured ? 160 : 110;
    const cap = post.caption.length > maxLen ? post.caption.slice(0, maxLen) + '…' : post.caption;
    return `
      <a class="sw-card${featured ? ' sw-card--featured' : ''}" href="${post.igLink}" target="_blank" rel="noopener">
        <div class="sw-card-img" style="background:${post.gradient}">
          ${post.photo ? `<img src="${post.photo}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
          <div class="sw-img-overlay"></div>
          ${typeBadge(post.type)}
          <div class="sw-img-loc">
            <svg viewBox="0 0 12 16" fill="currentColor" width="8" height="11"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/></svg>
            ${post.location}
          </div>
        </div>
        <div class="sw-card-body">
          <div class="sw-card-account">${post.account}</div>
          <p class="sw-card-caption">${cap}</p>
          <div class="sw-card-tags">${post.hashtags.slice(0, 3).map(h => `<span class="sw-tag">${h}</span>`).join('')}</div>
          <div class="sw-card-foot">
            <span class="sw-stat">
              <svg viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M10 16.5s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z"/></svg>
              ${fmtNum(post.likes)}
            </span>
            <span class="sw-stat">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M18 10c0 4-3.58 7-8 7a8.84 8.84 0 01-4-.95L2 18l1.14-4A6.69 6.69 0 012 10c0-4 3.58-7 8-7s8 3 8 7z"/></svg>
              ${post.comments}
            </span>
            <span class="sw-ig-cta">Vedi su Instagram →</span>
          </div>
        </div>
      </a>`;
  }

  function sectionLabel(text) {
    return `<div class="sw-section-label">
      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      ${text}
    </div>`;
  }

  function updateChips() {
    container.querySelectorAll('.sw-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.filter === activeFilter);
    });
  }

  function renderContent() {
    const posts = getFiltered();
    const sorted = [...posts].sort((a, b) => engagement(b) - engagement(a));
    const featured = sorted.slice(0, 3);
    const rest = sorted.slice(3);
    const contentEl = container.querySelector('#sw-content');
    if (!contentEl) return;

    if (posts.length === 0) {
      contentEl.innerHTML = `<div class="sw-empty">Nessun post trovato${searchQuery ? ` per "<strong>${searchQuery}</strong>"` : ''}.</div>`;
      return;
    }

    let html = '';
    if (featured.length) {
      html += sectionLabel('In evidenza');
      html += `<div class="sw-featured">${featured.map(p => cardHtml(p, true)).join('')}</div>`;
    }
    if (rest.length) {
      html += `<div class="sw-section-label sw-label-all">Tutti i post (${posts.length})</div>`;
      html += `<div class="sw-grid">${rest.map(p => cardHtml(p, false)).join('')}</div>`;
    }
    contentEl.innerHTML = html;

    gsap.fromTo(contentEl.querySelectorAll('.sw-card'),
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
    );
  }

  // Build shell (once)
  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Sardegna Live</h2>
      <p class="section-subtitle">Foto, video e reel dalle migliori pagine Instagram sulla Sardegna. Cerca un argomento o filtra per tema.</p>
    </div>
    <div class="sw-controls">
      <div class="sw-search-wrap">
        <svg class="sw-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="9" cy="9" r="6"/><path stroke-linecap="round" d="m15 15 3 3"/></svg>
        <input id="sw-search" type="text" placeholder="Cerca: spiagge, trekking, festival, @account..." autocomplete="off" spellcheck="false">
        <button class="sw-clear-btn" id="sw-clear" style="display:none">✕</button>
      </div>
      <div class="sw-chips">
        ${TOPICS.map(t => `<button class="sw-chip${activeFilter === t.key ? ' active' : ''}" data-filter="${t.key}">${t.label}</button>`).join('')}
      </div>
      <div class="sw-account-wrap">
        <select class="sw-account-sel" id="sw-account-sel">
          <option value="all">Tutti gli account (${ALL_ACCOUNTS.length})</option>
          ${ALL_ACCOUNTS.map(a => `<option value="${a}">${a}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="sw-content"></div>
  `;

  // Attach events (once)
  const searchEl = container.querySelector('#sw-search');
  const clearEl = container.querySelector('#sw-clear');
  const accountEl = container.querySelector('#sw-account-sel');

  searchEl.addEventListener('input', e => {
    searchQuery = e.target.value;
    clearEl.style.display = searchQuery ? 'flex' : 'none';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderContent, 180);
  });

  clearEl.addEventListener('click', () => {
    searchQuery = '';
    searchEl.value = '';
    clearEl.style.display = 'none';
    searchEl.focus();
    renderContent();
  });

  container.querySelectorAll('.sw-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      updateChips();
      renderContent();
    });
  });

  accountEl.addEventListener('change', e => {
    activeAccount = e.target.value;
    renderContent();
  });

  renderContent();
}

// ─── RENDER NORD SARDEGNA ─────────────────────────────────────
function renderNordSardegna(container) {
  let activeArea = 'gallura';
  let activeSeason = 'inverno';

  const seasons = [
    { key: 'inverno', label: 'Inverno', icon: '❄' },
    { key: 'musei', label: 'Musei & Cultura', icon: '🏛' },
    { key: 'ristoranti', label: 'Dove Mangiare', icon: '🍷' }
  ];

  function render() {
    const area = NORTH_SARDINIA_DATA.find(a => a.id === activeArea);
    if (!area) return;

    const inv = area.inverno;
    let contentHtml = '';

    if (activeSeason === 'inverno') {
      contentHtml = `
        <div class="nord-why-box">
          <h4>Perché venire in bassa stagione</h4>
          <p>${inv.perche}</p>
          <div class="nord-meteo-pills">
            <span>Gen: ${inv.meteo.gen}</span>
            <span>Feb: ${inv.meteo.feb}</span>
            <span>Mar: ${inv.meteo.mar}</span>
          </div>
          <p class="nord-meteo-note">${inv.meteo.note}</p>
        </div>
        <h4 class="nord-section-title">Attività consigliata</h4>
        <div class="nord-activities-grid">
          ${inv.attivita.map(att => `
            <div class="nord-activity-card glass-card">
              <div class="nord-act-name">${att.nome}</div>
              <p class="nord-act-desc">${att.desc}</p>
              <div class="nord-act-meta">
                <span class="nord-level-badge">${att.difficolta}</span>
                <span class="nord-meteo-badge">${att.meteo}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <h4 class="nord-section-title">Eventi invernali</h4>
        <div class="nord-events-list">
          ${inv.eventi.map(ev => `
            <div class="nord-event-item">
              <div class="nord-ev-head">
                <span class="nord-ev-nome">${ev.nome}</span>
                <span class="nord-ev-periodo">${ev.periodo}</span>
              </div>
              <p class="nord-ev-desc">${ev.desc}</p>
              ${ev.link ? `<a href="${ev.link}" target="_blank" class="nord-ev-link">Sito ufficiale →</a>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (activeSeason === 'musei') {
      contentHtml = `
        <div class="nord-musei-grid">
          ${area.musei.map(m => `
            <div class="nord-museo-card glass-card">
              <div class="nord-museo-name">${m.nome}</div>
              <div class="nord-museo-citta">${m.citta}</div>
              <p class="nord-museo-desc">${m.desc}</p>
              <div class="nord-museo-meta">
                <span class="nord-museo-orari">${m.orari}</span>
                <span class="nord-museo-costo">${m.costo}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (activeSeason === 'ristoranti') {
      contentHtml = `
        <div class="nord-risto-grid">
          ${area.ristoranti.map(r => `
            <div class="nord-risto-card glass-card">
              <div class="nord-risto-head">
                <span class="nord-risto-nome">${r.nome}</span>
                <span class="nord-risto-prezzo">${r.prezzo}</span>
              </div>
              <div class="nord-risto-tipo">${r.tipo}</div>
              <div class="nord-risto-piatti">${r.piatti}</div>
              <div class="nord-risto-zona">📍 ${r.zona}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Nord Sardegna</h2>
      </div>
      <p class="section-subtitle">Guida completa al nord — Gallura, Sassari, Alghero, Logudoro. Con focus su inverno e bassa stagione.</p>

      <div class="nord-area-tabs">
        ${NORTH_SARDINIA_DATA.map(a => `
          <button class="nord-area-tab ${a.id === activeArea ? 'active' : ''}"
            data-area="${a.id}" style="${a.id === activeArea ? `border-color:${a.color};color:${a.color}` : ''}">
            ${a.nome}
          </button>
        `).join('')}
      </div>

      <div class="nord-area-header" style="border-left-color:${area.color}">
        <h3 style="color:${area.color}">${area.nome}</h3>
        <p>${area.tagline}</p>
      </div>

      <div class="nord-season-tabs">
        ${seasons.map(s => `
          <button class="nord-season-tab ${s.key === activeSeason ? 'active' : ''}" data-season="${s.key}">
            ${s.label}
          </button>
        `).join('')}
      </div>

      <div class="nord-content">
        ${contentHtml}
      </div>
    `;

    gsap.fromTo('.nord-activity-card, .nord-museo-card, .nord-risto-card, .nord-event-item',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' }
    );

    container.querySelectorAll('.nord-area-tab').forEach(btn => {
      btn.addEventListener('click', e => {
        activeArea = e.target.dataset.area;
        render();
      });
    });

    container.querySelectorAll('.nord-season-tab').forEach(btn => {
      btn.addEventListener('click', e => {
        activeSeason = e.target.dataset.season;
        render();
      });
    });
  }

  render();
}

// ─── NAVIGAZIONE ──────────────────────────────────────────────
function renderNavigazione(container) {
  const PORTI = [
    { name: 'Porto Cervo Marina', zona: 'Costa Smeralda', posti: 700, pescaggio: '10m', tel: '+39 0789 905602', web: 'marinadiportocervo.com', vhf: '9/16/11', servizi: ['Carburante', 'Officina', 'WiFi', 'Ristorante', 'Electricity'] },
    { name: 'Marina Portus Karalis', zona: 'Cagliari', posti: 140, pescaggio: '10m', tel: '+39 070 653535', web: 'portuskaralis.com', vhf: '9', servizi: ['Carburante', 'Acqua', 'Electricity'] },
    { name: 'Marina di Porto Rotondo', zona: 'Costa Smeralda', posti: 350, pescaggio: '8m', tel: '+39 0789 34203', web: 'marinadiportorotondo.it', vhf: '09', servizi: ['Carburante', 'Officina', 'Docce', 'WiFi', 'Charter'] },
    { name: 'Porto Turistico Torre Grande', zona: 'Oristano', posti: 180, pescaggio: '5m', tel: '+39 0783 22189', web: 'marineoristanesi.it', vhf: '', servizi: ['Electricity', 'Acqua', 'Scarico acque'] },
    { name: 'Cala dei Sardi Marina', zona: 'Porto Rotondo', posti: 300, pescaggio: '8m', tel: '+39 0789 1980403', web: 'caladeisardi.it', vhf: '', servizi: ['Electricity', 'Acqua', 'WiFi', 'Charter'] },
    { name: 'Marina del Ponte La Maddalena', zona: 'Arcipelago Maddalena', posti: 200, pescaggio: '5m', tel: '', web: 'marinadelponte.com', vhf: '', servizi: ['Electricity', 'Acqua'] },
    { name: 'Marina di Porto Conte', zona: 'Alghero', posti: null, pescaggio: '3m', tel: '', web: '', vhf: '', servizi: ['Baia protetta', 'AMP Capo Caccia'] },
    { name: 'Marina di Villasimius', zona: 'Cagliari Sud', posti: 250, pescaggio: '6m', tel: '', web: '', vhf: '', servizi: ['Electricity', 'Noleggio gommoni', 'Tour in barca'] },
    { name: 'Porto di Cala Gonone', zona: 'Golfo di Orosei', posti: 100, pescaggio: '4m', tel: '', web: '', vhf: '', servizi: ['Escursioni', 'Noleggio gommoni', 'Traghetti cale'] },
    { name: 'Porto di Arbatax', zona: 'Ogliastra', posti: 150, pescaggio: '6m', tel: '', web: '', vhf: '', servizi: ['Traghetti Tirrenia', 'Porto commerciale'] },
  ];

  const ZONE_PROTETTE = [
    { nome: 'AMP Capo Caccia - Isola Piana', tipo: 'Area Marina Protetta', accesso: 'Accesso parzialmente limitato. Zona A: divieto assoluto. Zona B: snorkeling e immersioni autorizzate. Zona C: navigazione lenta.', tel: '+39 079 945045' },
    { nome: 'AMP Tavolara - Punta Coda Cavallo', tipo: 'Area Marina Protetta', accesso: 'Tre zone: Zona A (divieto totale), Zona B (solo attivita autorizzate), Zona C (pesca sportiva consentita). Velocita max 5 nodi.', tel: '+39 0789 32797' },
    { nome: 'AMP Capo Carbonara (Villasimius)', tipo: 'Area Marina Protetta', accesso: 'Zona A riservata a ricerca scientifica. Zona B: snorkeling e diving con autorizzazione. Zona C: navigazione consentita a velocita ridotta.', tel: '+39 070 791202' },
    { nome: 'Parco Nazionale Arcipelago Maddalena', tipo: 'Parco Marino Nazionale', accesso: 'Navigazione consentita ma con limitazioni stagionali. Alcune cale accessibili solo a piedi o a nuoto. Ancoraggio vietato in zone sensibili (praterie Posidonia).', tel: '+39 0789 790211' },
    { nome: 'Parco Nazionale Asinara', tipo: 'Parco Marino Nazionale', accesso: "Accesso all'isola solo con gite organizzate da Stintino. Navigazione nelle acque del parco consentita ma senza ancoraggio libero nel perimetro.", tel: '+39 079 503388' },
    { nome: 'Riserva Marina Isola di Mal di Ventre', tipo: 'Riserva Naturale', accesso: 'Area riservata a ricerca. Avvicinamento a meno di 200m vietato. Ancoraggio non consentito.', tel: '' },
  ];

  const ZONE_CONSIGLIATE = [
    { nome: 'Golfo di Orosei', desc: 'Uno dei tratti di costa piu belli del Mediterraneo: cale accessibili solo dal mare, acque cristalline, fondali fino a 40m. Base ideale da Cala Gonone o Santa Maria Navarrese.' },
    { nome: 'Arcipelago della Maddalena', desc: '7 isole e oltre 50 isolotti, acque smeraldo, venti costanti ideali per la vela. Base: Palau o marina La Maddalena. Uscite giornaliere anche per imbarcazioni piccole.' },
    { nome: 'Costa Smeralda', desc: 'Tra Baja Sardinia e Olbia: calette riparate, fondali sabbiosi, strutture nautiche di primo livello. Ideale luglio-agosto con vento da nord.' },
    { nome: 'Golfo di Cagliari', desc: 'Base di partenza da Portus Karalis. Rotte verso Villasimius e Capo Carbonara, fondali misti con praterie di Posidonia. Adatto anche a chi e alle prime armi.' },
    { nome: 'Costa del Sulcis', desc: "Da Portoscuso verso le isole di San Pietro e Sant'Antioco: paesaggi unici, porti tranquilli, acque poco frequentate rispetto al nord." },
    { nome: "Golfo dell'Asinara", desc: 'Da Porto Torres a Stintino, con rotte verso isola Asinara. Acque trasparenti e poco trafficate. Attenzione al Maestrale nel canalino di Sardegna.' },
  ];

  container.innerHTML = `
    <div class="tools-section-header">
      <h2>Navigazione in Sardegna</h2>
      <p class="section-subtitle">Porti, zone protette, aree di navigazione e info pratiche per chi esplora la Sardegna via mare.</p>
    </div>

    <div class="nav-tabs-wrap">
      <button class="nav-tab active" data-tab="porti">Porti e Marina</button>
      <button class="nav-tab" data-tab="protette">Zone Protette</button>
      <button class="nav-tab" data-tab="consigliate">Rotte Consigliate</button>
      <button class="nav-tab" data-tab="pratiche">Info Pratiche</button>
    </div>

    <div class="nav-tab-content" data-content="porti">
      <div class="porto-grid">
        ${PORTI.map(p => `
          <div class="porto-card glass-card">
            <div class="porto-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="1.8" width="20" height="20">
                <circle cx="12" cy="4" r="2"/><line x1="12" y1="6" x2="12" y2="20"/>
                <line x1="7" y1="9" x2="17" y2="9"/>
                <path d="M12 20 Q6 20 6 15.5" stroke-linecap="round"/>
                <path d="M12 20 Q18 20 18 15.5" stroke-linecap="round"/>
                <circle cx="6" cy="15.5" r="1.3" fill="#0066CC"/>
                <circle cx="18" cy="15.5" r="1.3" fill="#0066CC"/>
              </svg>
              <div>
                <div class="porto-name">${p.name}</div>
                <div class="porto-zona">${p.zona}</div>
              </div>
            </div>
            <div class="porto-info-row">
              ${p.posti ? `<span class="porto-badge">${p.posti} posti</span>` : ''}
              <span class="porto-badge">${p.pescaggio}</span>
              ${p.vhf ? `<span class="porto-badge">VHF ${p.vhf}</span>` : ''}
            </div>
            <div class="porto-servizi">${p.servizi.map(s => `<span class="servizio-tag">${s}</span>`).join('')}</div>
            <div class="porto-contacts">
              ${p.tel ? `<a href="tel:${p.tel}" class="porto-contact-link">${p.tel}</a>` : ''}
              ${p.web ? `<a href="https://${p.web}" target="_blank" rel="noopener" class="porto-contact-link">${p.web}</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <p class="nav-note">Verifica sempre aggiornamenti su <strong>ORMEGGI.com</strong> e il portale <strong>Autorita di Sistema Portuale del Mar di Sardegna</strong> prima di salpare.</p>
    </div>

    <div class="nav-tab-content hidden" data-content="protette">
      <div class="zone-protette-list">
        ${ZONE_PROTETTE.map(z => `
          <div class="zona-card glass-card">
            <div class="zona-header">
              <span class="zona-tipo-badge">${z.tipo}</span>
              <h3 class="zona-nome">${z.nome}</h3>
            </div>
            <p class="zona-accesso">${z.accesso}</p>
            ${z.tel ? `<div class="zona-tel">${z.tel}</div>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="nav-alert">
        <strong>Attenzione:</strong> L'ancoraggio su praterie di Posidonia e vietato in tutta Italia (art. 185 del Codice della Navigazione). La Sardegna ha estese praterie protette: usa gavitelli dove disponibili.
      </div>
    </div>

    <div class="nav-tab-content hidden" data-content="consigliate">
      <div class="rotte-list">
        ${ZONE_CONSIGLIATE.map(z => `
          <div class="rotta-card glass-card">
            <div class="rotta-dot" style="background:#0066CC"></div>
            <div>
              <div class="rotta-nome">${z.nome}</div>
              <p class="rotta-desc">${z.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="nav-tab-content hidden" data-content="pratiche">
      <div class="info-pratiche-grid">
        <div class="info-card glass-card">
          <h3>Documenti obbligatori</h3>
          <ul>
            <li>Patente nautica (obbligatoria oltre 6 miglia dalla costa o oltre 40 cv senza limite)</li>
            <li>Certificato di abilitazione dell'imbarcazione (CIN)</li>
            <li>Assicurazione RCT obbligatoria per imbarcazioni da diporto</li>
            <li>Lista equipaggio per navigazione oltre 12 miglia</li>
            <li>Dotazioni di sicurezza obbligatorie (giubbotti, razzi, estintore)</li>
          </ul>
        </div>
        <div class="info-card glass-card">
          <h3>Canali VHF utili</h3>
          <ul>
            <li><strong>Canal 16</strong> — Emergenza e chiamata internazionale (sempre in ascolto)</li>
            <li><strong>Canal 9</strong> — Marina e porto turistico</li>
            <li><strong>Canal 12</strong> — Porto commerciale e traffico marittimo</li>
            <li><strong>Canal 70</strong> — DSC (Digital Selective Calling)</li>
            <li><strong>Canal 67</strong> — Guardia Costiera italiana</li>
          </ul>
        </div>
        <div class="info-card glass-card">
          <h3>Numeri di emergenza</h3>
          <ul>
            <li><strong>1530</strong> — Guardia Costiera (emergenze in mare, gratuito)</li>
            <li><strong>118</strong> — Emergenza medica</li>
            <li><strong>112</strong> — Carabinieri</li>
            <li><strong>117</strong> — Guardia di Finanza</li>
            <li><strong>+39 070 60081</strong> — MRCC Roma (Maritime Rescue Coordination Centre)</li>
          </ul>
        </div>
        <div class="info-card glass-card">
          <h3>Venti e meteo</h3>
          <ul>
            <li><strong>Maestrale (NW):</strong> vento dominante, puo alzarsi improvvisamente nel canale di Sardegna</li>
            <li><strong>Libeccio (SW):</strong> pericoloso sulla costa ovest, evitare uscite con previsioni &gt;4 Beaufort</li>
            <li><strong>Tramontana (N):</strong> frequente nel nord, crea moto ondoso nella Costa Smeralda</li>
            <li>Fonti: <a href="https://www.windy.com" target="_blank" rel="noopener">Windy.com</a> | <a href="https://www.meteomar.it" target="_blank" rel="noopener">Meteomar.it</a></li>
          </ul>
        </div>
        <div class="info-card glass-card">
          <h3>Normative e permessi</h3>
          <ul>
            <li>Navigazione nelle AMP: richiedere autorizzazione preventiva all'ente gestore</li>
            <li>Pesca sportiva: limiti di specie e quantita, vietata nelle zone A delle AMP</li>
            <li>Immersioni subacquee: bandiera A obbligatoria, autorizzazione nelle AMP</li>
            <li>Ancoraggio notturno: verificare con la Capitaneria di porto locale</li>
          </ul>
        </div>
        <div class="info-card glass-card">
          <h3>Noleggio e charter</h3>
          <ul>
            <li>Noleggio senza patente entro 6 miglia: gommoni fino a 40 cv in quasi tutti i porti turistici</li>
            <li>Charter con skipper: disponibile da Porto Cervo, Olbia, Cagliari, Alghero</li>
            <li>Barche a vela e catamarani: Click&amp;Boat, Samboat, Navigare.it</li>
            <li>Tour guidati: Cala Gonone, Villasimius, La Maddalena</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const tabs = container.querySelectorAll('.nav-tab');
  const contents = container.querySelectorAll('.nav-tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      contents.forEach(c => {
        c.classList.toggle('hidden', c.dataset.content !== target);
      });
    });
  });
}
