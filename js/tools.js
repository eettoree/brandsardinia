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
    photoCredit: 'Mentnafunangann / CC BY-SA 3.0'
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
    photoCredit: 'David Blaikie / CC BY 2.0'
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
    photoCredit: 'Alessandro Mangione / CC BY-SA 4.0'
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
    photoCredit: 'Ökologix / CC0 Public Domain'
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
    photoCredit: 'Vid Pogacnik / CC BY-SA 4.0'
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
    photoCredit: 'Wikimedia / CC BY-SA'
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
    photoCredit: 'ManuelM / Public Domain'
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
    photoCredit: 'Marrabbio2 / CC BY-SA 3.0'
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
    photoCredit: 'ilaria / CC BY 2.0'
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
    photoCredit: 'Ramon Espiña Fernandez / CC BY-SA 3.0'
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
    photoCredit: 'Muzzudan / CC BY-SA 4.0'
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
    photoCredit: 'Tom Rolvag / CC BY-SA 3.0'
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
      else if (name === 'meteo')        renderComingSoon(contentArea, 'Meteo Sardegna', 'Previsioni aggiornate per le zone principali — mare, vento e temperature costa per costa.');
      else if (name === 'sentieri')     renderComingSoon(contentArea, 'Sentieri & Trekking', 'Percorsi CAI e naturalistici con difficoltà, dislivello, durata e collegamento alla mappa interattiva.');
      else if (name === 'cantine')      renderComingSoon(contentArea, 'Cantine & Vino', 'Cantine sarde aperte al pubblico — degustazioni, visite guidate e acquisto diretto in cantina.');
      else if (name === 'prodotti')     renderComingSoon(contentArea, 'Prodotti Tipici', 'Catalogo prodotti sardi — cibo, tessuti, ceramiche e artigianato locale con link acquisto diretto.');
      else if (name === 'artigiani')    renderComingSoon(contentArea, 'Artigiani', 'Maestri artigiani locali con bottega, specialità e contatti — scopri chi produce cosa e dove.');
      else if (name === 'comuni')       renderComingSoon(contentArea, 'Comuni della Sardegna', 'Schede per ogni comune: servizi, uffici, spiagge vicine, eventi e punti d\'interesse.');
      else if (name === 'guide')        renderComingSoon(contentArea, 'Guide Turistiche', 'Guide certificate per zona, lingua e specialità — prenota la tua esperienza personalizzata.');
      else if (name === 'musei')        renderComingSoon(contentArea, 'Musei & Cultura', 'Musei, siti nuragici e collezioni permanenti — orari, biglietti e percorsi tematici.');
      else if (name === 'ristoranti')   renderComingSoon(contentArea, 'Ristoranti', 'Ristoranti, trattorie e locali selezionati per qualità e cucina tradizionale sarda.');
      else if (name === 'hotel')        renderComingSoon(contentArea, 'Hotel & Alloggi', 'Hotel, B&B, agriturismo e ville — confronta disponibilità e prenota al miglior prezzo.');
      else if (name === 'pacchetti')    renderComingSoon(contentArea, 'Pacchetti Viaggio', 'Pacchetti completi con volo, hotel e esperienze — tutto organizzato, tutto in un click.');

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
  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  let currentView   = 'list';
  let currentFilter = 0;
  let calYear       = 2026;
  let calMonth      = new Date().getMonth() + 1;

  function buildListHTML(filter) {
    const events = filter === 0 ? EVENTS_DATA : EVENTS_DATA.filter(e => e.month === filter);
    return `
      <div class="events-grid">
        ${events.map(ev => {
          const date     = new Date(ev.date);
          const catColor = CAT_COLORS[ev.category] || '#fff';
          return `
          <div class="event-card glass-card">
            <div class="event-date-box" style="border-color:${catColor}">
              <span class="event-day">${date.getDate()}</span>
              <span class="event-month">${MONTH_NAMES[date.getMonth() + 1].substring(0,3).toUpperCase()}</span>
            </div>
            <div class="event-body">
              <div class="event-category" style="color:${catColor}">${ev.category.toUpperCase()}</div>
              <h3 class="event-name">${ev.name}</h3>
              <div class="event-location">📍 ${ev.city}</div>
              <p class="event-desc">${ev.description}</p>
              ${ev.link ? `<a href="${ev.link}" target="_blank" class="event-link">Scopri di più →</a>` : ''}
            </div>
          </div>`;
        }).join('')}
        ${events.length === 0 ? '<div class="no-events">Nessun evento in questo mese.</div>' : ''}
      </div>`;
  }

  function buildCalendarHTML(year, month) {
    const monthEvents = EVENTS_DATA.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
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
            return `<div class="cal-event-chip" style="border-left:3px solid ${color};background:${color}1a" title="${ev.name} — ${ev.city}">
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

  function buildMonthOptions(filter) {
    return MONTH_NAMES.map((m, i) => i === 0
      ? `<option value="0">Tutti i mesi</option>`
      : `<option value="${i}" ${filter === i ? 'selected' : ''}>${m}</option>`
    ).join('');
  }

  function render() {
    const isCal = currentView === 'calendar';
    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Calendario Eventi Sardegna</h2>
        <div class="tools-filter">
          <div class="view-toggle">
            <div class="view-toggle-indicator ${isCal ? 'right' : ''}"></div>
            <button class="view-toggle-btn ${!isCal ? 'active' : ''}" data-view="list">Elenco</button>
            <button class="view-toggle-btn ${isCal ? 'active' : ''}" data-view="calendar">Calendario</button>
          </div>
          ${!isCal ? `<select id="month-filter" class="glass-select">${buildMonthOptions(currentFilter)}</select>` : ''}
        </div>
      </div>
      ${isCal ? buildCalendarHTML(calYear, calMonth) : buildListHTML(currentFilter)}
    `;

    // Toggle listener
    container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        if (currentView === 'calendar' && currentFilter > 0) calMonth = currentFilter;
        render();
        gsap.fromTo('.cal-grid-container, .events-grid',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      });
    });

    // Month dropdown (list view only)
    const sel = document.getElementById('month-filter');
    if (sel) sel.addEventListener('change', () => {
      currentFilter = parseInt(sel.value);
      render();
    });

    // Calendar prev/next
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      calMonth--; if (calMonth < 1) { calMonth = 12; calYear--; }
      render();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      calMonth++; if (calMonth > 12) { calMonth = 1; calYear++; }
      render();
    });

    // Animazione card lista
    if (currentView === 'list') {
      gsap.fromTo('.event-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: 'power2.out' }
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
        { text: 'Viator — Sardinia Tours', url: 'https://www.viator.com/Sardinia/d23207-ttd' },
        { text: 'GetYourGuide — Sardinia', url: 'https://www.getyourguide.it/sardinia-l946/' },
        { text: 'Airbnb Esperienze — Sardegna', url: 'https://www.airbnb.it/experiences' }
      ]
    },
    {
      label: 'Traghetti & Trasporti',
      desc: 'Traghetti, voli, noleggio auto e bus per raggiungere e muoversi in Sardegna',
      links: [
        { text: 'Traghetti.com — Sardegna', url: 'https://www.traghetti.com/sardegna/' },
        { text: 'Rentalcars — Noleggio Sardegna', url: 'https://www.rentalcars.com/it/search/?dropOffCountry=IT&country=Italy' },
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
    { name: 'TicketOne', desc: 'Concerti, spettacoli ed eventi in Sardegna', url: 'https://www.ticketone.it/search/?q=sardegna', label: 'Cerca eventi' },
    { name: 'VivaTicket', desc: 'Biglietti per sagre, festival e manifestazioni locali', url: 'https://www.vivaticket.com/?srch=sardegna', label: 'Cerca eventi' },
    { name: 'Eventbrite', desc: 'Conferenze, workshop ed eventi culturali', url: 'https://www.eventbrite.it/d/italy--sardinia/events/', label: 'Esplora' },
    { name: 'Musei.it', desc: 'Biglietti musei statali e siti archeologici', url: 'https://www.musei.it/sardegna', label: 'Prenota visita' },
    { name: 'Skytix', desc: 'Parchi, attrazioni e esperienze outdoor', url: 'https://www.skytix.it', label: 'Scopri' },
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

// ─── SPIAGGE LIVE ─────────────────────────────────────────────
function renderBeaches(container) {
  function generateBeachData() {
    return BEACHES_DATA.map(beach => {
      const wind = Math.floor(Math.random() * 40 + 3);
      const wavH = (Math.random() * 1.5).toFixed(1);
      const temp = Math.floor(Math.random() * 8 + 22);
      let status, statusClass;
      if (wind < 15) {
        status = 'Ottima';
        statusClass = 'status-great';
      } else if (wind < 25) {
        status = 'Buona';
        statusClass = 'status-good';
      } else {
        status = 'Sconsigliata';
        statusClass = 'status-bad';
      }
      return { ...beach, wind, wavH, temp, status, statusClass };
    });
  }

  function render() {
    const data = generateBeachData();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    container.innerHTML = `
      <div class="tools-section-header">
        <h2>Spiagge Live</h2>
        <div class="beaches-meta">
          <span class="update-time">Aggiornato: ${timeStr}</span>
          <button id="update-beaches-btn" class="btn-glass">Aggiorna</button>
        </div>
      </div>
      <p class="section-subtitle">Dati simulati in tempo reale. Vento: &lt;15 km/h ottima · 15-25 buona · &gt;25 sconsigliata.</p>
      <div class="beaches-grid">
        ${data.map(b => `
          <div class="beach-card glass-card">
            <div class="beach-photo-wrap">
              ${b.photo
                ? `<img src="${b.photo}" alt="${b.name}" class="beach-photo" loading="lazy" onerror="this.parentElement.classList.add('beach-photo-fallback');this.style.display='none';">`
                : ''}
              <div class="beach-photo-gradient"></div>
              <span class="beach-status ${b.statusClass} beach-status-overlay">${b.status}</span>
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
              <div class="beach-stats">
                <div class="beach-stat">
                  <div class="stat-label-top">Vento</div>
                  <div class="stat-value">${b.wind} km/h</div>
                </div>
                <div class="beach-stat">
                  <div class="stat-label-top">Onde</div>
                  <div class="stat-value">${b.wavH} m</div>
                </div>
                <div class="beach-stat">
                  <div class="stat-label-top">Acqua</div>
                  <div class="stat-value">${b.temp}°C</div>
                </div>
              </div>
              <div class="wind-bar">
                <div class="wind-bar-fill ${b.statusClass}" style="width:${Math.min(100, b.wind / 40 * 100)}%"></div>
              </div>
              <div class="beach-info">
                <div class="beach-info-row"><span class="info-label">Accesso</span><span class="info-val">${b.access}</span></div>
                <div class="beach-info-row"><span class="info-label">Costo</span><span class="info-val">${b.cost}</span></div>
                ${b.prenotazione ? `<div class="beach-info-row"><span class="info-label">Prenotaz.</span><span class="info-val">${b.prenotazione}</span></div>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    gsap.fromTo('.beach-card',
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.35, ease: 'power2.out' }
    );

    const updateBtn = document.getElementById('update-beaches-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        gsap.to('.beach-card', { opacity: 0, y: -10, stagger: 0.05, duration: 0.2,
          onComplete: render
        });
      });
    }
  }

  render();
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
