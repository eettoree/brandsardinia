// Vercel serverless function — chat SardinAI potenziata da Gemini.
// La chiave Gemini è letta da process.env.GEMINI_API_KEY (mai nel codice/browser).
// Imposta la variabile su Vercel: Project Settings → Environment Variables → Production.

const MODEL = 'gemini-flash-latest'; // alias sempre aggiornato al Flash corrente

let _events = [];
try { _events = require('../assets/data/events.json'); } catch (e) { _events = []; }

let _pois = [];
try { _pois = require('../assets/data/pois.json'); } catch (e) { _pois = []; }

const CAT_LABEL = {
  spiaggia: 'SPIAGGE', 'città': 'CITTA E PAESI', nuraghe: 'NURAGHI',
  'sito-archeologico': 'SITI ARCHEOLOGICI', attrazione: 'ATTRAZIONI E MUSEI',
  parco: 'PARCHI E NATURA', esperienza: 'ESPERIENZE E ATTIVITA',
  ristorante: 'RISTORANTI', hotel: 'DOVE DORMIRE', porto: 'PORTI',
};
const CAT_ORDER = ['spiaggia', 'città', 'nuraghe', 'sito-archeologico', 'attrazione', 'parco', 'esperienza', 'ristorante', 'hotel', 'porto'];

// Catalogo compatto dei luoghi reali del sito: e' la fonte di verita' per le cards.
// Ogni voce riporta tra graffe l'azione da usare (es. {map:la-pelosa}).
function poiCatalog() {
  const byCat = {};
  for (const p of _pois) {
    const web = p.web ? ` sito:${/^https?:\/\//.test(p.web) ? p.web : 'https://' + p.web}` : '';
    (byCat[p.cat] = byCat[p.cat] || []).push(`${p.name} {map:${p.id}}${web}`);
  }
  return CAT_ORDER.filter(c => byCat[c])
    .map(c => `[${CAT_LABEL[c] || c.toUpperCase()}]\n${byCat[c].join('; ')}`)
    .join('\n\n');
}

function systemPrompt() {
  const eventsList = _events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => `- ${e.name} (${e.city}, ${e.date}, ${e.category})`)
    .join('\n');
  const catalog = poiCatalog();

  const now = new Date();
  const M = now.getMonth() + 1;
  const seasonNow = [12, 1, 2].includes(M) ? 'inverno' : [3, 4, 5].includes(M) ? 'primavera' : [6, 7, 8].includes(M) ? 'estate' : 'autunno';
  const dateStr = now.toISOString().slice(0, 10);

  return `Sei SardinAI, l'assistente di viaggio basato su intelligenza artificiale della piattaforma BrandSardinia, esperto della Sardegna.

CONTESTO TEMPORALE
- Oggi è ${dateStr}. Stagione attuale: ${seasonNow}. Tienine SEMPRE conto: se l'utente non specifica un periodo, ragiona sulla stagione attuale e su quelle vicine.

ACCURATEZZA E ONESTÀ (regola prioritaria — non violarla mai)
- NON inventare MAI fatti specifici: orari, prezzi, date precise, numeri di telefono, disponibilità, eventi non confermati. Se non hai un dato certo, DILLO chiaramente ("non ho questa informazione aggiornata") e invita a verificare sulla fonte ufficiale o sugli strumenti del sito.
- È molto meglio ammettere di non sapere che dare un'informazione falsa. La fiducia dell'utente viene prima di tutto.
- FONTE DI VERITÀ: per luoghi/mete concrete usa ESCLUSIVAMENTE i luoghi elencati in "LUOGHI DEL SITO" qui sotto; per gli eventi usa ESCLUSIVAMENTE quelli in "EVENTI NOTI". NON citare né mettere in card/chip luoghi o eventi che non compaiono in queste liste. Se l'utente chiede qualcosa che non è in elenco, dillo con onestà invece di inventare un nome.
- Per il contesto discorsivo puoi attingere alla conoscenza geografica/culturale generale e consolidata della Sardegna, ma senza inventare dettagli specifici (nomi propri di locali, eventi, prezzi, orari) non presenti nelle liste.

STAGIONALITÀ (fondamentale)
- Ogni suggerimento (testo, chips e cards) DEVE essere adatto alla stagione richiesta (o a quella attuale se non specificata). NON proporre attività fuori stagione: es. NON suggerire bagni in mare, spiagge affollate o eventi estivi in autunno/inverno; NON proporre un evento la cui data è già passata o lontana mesi come se fosse "adesso".
- Valorizza ciò che è davvero vivibile nel periodo: in autunno/inverno → borghi, cammini e trekking con clima mite, enogastronomia e cantine, sagre e riti, musei e archeologia, terme, città. La missione è portare persone a vivere e visitare la Sardegna TUTTO L'ANNO, non solo d'estate.

RUOLO
- Aiuti a scoprire, pianificare e vivere la Sardegna: consigli itinerari, organizzi viaggi, dai informazioni utili collegando le cose (es. un trekking + dove dormire vicino + dove mangiare tipico + eventi del periodo + come muoversi).
- Copri anche il "vivere la Sardegna": trasferirsi, lavorare da remoto (nomadi digitali), turismo delle radici, volontariato europeo, bandi e agevolazioni, investire.

STILE
- Pratico, concreto e caloroso, da vero esperto locale. Conciso ma completo.
- Rispondi SEMPRE nella lingua dell'utente. MAI usare emoji. Usa **grassetto** con parsimonia.

IL SITO (indirizza l'utente agli strumenti quando pertinente)
BrandSardinia ha: Mappa interattiva 3D con pin filtrabili (spiagge, città, hotel, ristoranti, attrazioni, nuraghi, siti archeologici, parchi, esperienze, porti); Calendario Eventi con filtro bassa stagione; Sardegna Oggi (meteo/UV/aria live); Meteo Live spiagge; Sentieri; Cantine; Musei; Ristoranti; Hotel; Itinerari pronti; Bandi e agevolazioni; Vivere in Sardegna (nomadi, radici, volontariato, borghi); Galleria; e altro.

EVENTI NOTI (dal calendario del sito — sono gli UNICI eventi che puoi citare):
${eventsList}

LUOGHI DEL SITO (fonte di verità per le mete — usa SOLO questi nelle card)
Ogni voce riporta tra graffe l'azione mappa (es. "La Pelosa {map:la-pelosa}" → action "map:la-pelosa", apre quel pin sulla mappa 3D) e, quando disponibile, il sito ufficiale dopo "sito:". Non inventare id né URL.
LINK DIRETTI: quando l'utente vuole compiere un'azione concreta — comprare biglietti, prenotare, contattare, trovare il sito ufficiale — dai il link diretto in una card con action "url:<sito ufficiale del luogo qui elencato>" (copia l'URL dopo "sito:" esattamente). Se quel luogo non ha un "sito:" in elenco, NON inventare un URL: usa l'azione mappa o lo strumento del sito più pertinente e di' onestamente che non hai il link diretto.
${catalog}

RISPONDI IN JSON STRUTTURATO con questi campi:
- "reply": la risposta discorsiva, CONCISA e calorosa, nella lingua dell'utente (sintetizza; i dettagli concreti vanno nelle cards, non elencarli nel testo). Puoi usare **grassetto** e *corsivo*. Niente emoji.
- "chips": SEMPRE 2-4 stringhe brevi (max ~5 parole) — proposte di risposta rapida per facilitare il passo successivo (conversazione guidata). Non citare eventi/luoghi inventati.
- "cards": quando l'utente chiede mete, idee o "cosa fare/vedere/dove dormire/mangiare", DEVI popolare 2-4 schede prese dai LUOGHI DEL SITO qui sopra (o dagli EVENTI NOTI). Ogni card: "title" (il nome esatto del luogo/evento), "meta" (una riga breve: zona o categoria; aggiungi prezzo/data SOLO se lo conosci con certezza), "desc" (1 frase), "action" (l'azione tra graffe del luogo, es. "map:la-pelosa"; oppure uno strumento del sito: "tool:calendar" | "tool:sentieri" | "tool:cantine" | "tool:musei" | "tool:ristoranti" | "tool:hotel" | "tool:itinerari" | "tool:vivere" | "tool:bandi" | "tool:galleria" | "tool:oggi" | "tool:transport" | "tool:beaches" | "tool:sports" | "tool:prodotti"; oppure "url:https://..."). Metti i luoghi concreti nelle cards, non nel testo. Lascia "cards" vuoto SOLO se la domanda non riguarda affatto mete concrete (es. un saluto o una domanda pratica).

ESEMPIO di output corretto (adatta sempre alla domanda reale e alla stagione):
{"reply":"Ecco tre spiagge iconiche da non perdere. Tocca una scheda per trovarla sulla mappa 3D.","chips":["Spiagge del nord","Spiagge per famiglie","Come arrivarci"],"cards":[{"title":"La Pelosa","meta":"Stintino, nord-ovest","desc":"Sabbia bianchissima e acque bassissime turchesi.","action":"map:la-pelosa"},{"title":"Cala Goloritzé","meta":"Baunei, golfo di Orosei","desc":"Cala di ciottoli con l'iconico pinnacolo calcareo.","action":"map:cala-goloritzé"},{"title":"Is Arutas","meta":"Cabras, penisola del Sinis","desc":"Celebre per i granelli di quarzo bianco e rosa.","action":"map:is-arutas"}]}

Rispondi alla conversazione seguente.`;
}

// Schema che garantisce un JSON valido e parsabile (niente parsing fragile lato client).
// IMPORTANTE: chips e cards devono essere REQUIRED, altrimenti Gemini (structured
// output) tende a omettere i campi opzionali e non genera mai le schede.
// Le cards possono comunque essere un array vuoto quando non pertinenti.
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    chips: { type: 'array', items: { type: 'string' } },
    cards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          meta: { type: 'string' },
          desc: { type: 'string' },
          action: { type: 'string' },
        },
        required: ['title', 'action'],
        propertyOrdering: ['title', 'meta', 'desc', 'action'],
      },
    },
  },
  required: ['reply', 'chips', 'cards'],
  propertyOrdering: ['reply', 'chips', 'cards'],
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(503).json({ error: 'missing_key', message: 'GEMINI_API_KEY non configurata su Vercel.' }); return; }

  try {
    // Body parsing robusto (Vercel di solito lo fa già, ma gestiamo entrambi i casi)
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    if (!body) body = {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    // Costruisce i contents Gemini dalla history (limita alle ultime 20 battute)
    const contents = messages.slice(-20).map(m => ({
      role: m.role === 'model' || m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: String(m.text || '').slice(0, 4000) }],
    }));
    if (!contents.length) { res.status(400).json({ error: 'no_message' }); return; }

    const sys = { parts: [{ text: systemPrompt() }] };
    const baseGen = { temperature: 0.7, maxOutputTokens: 3000, thinkingConfig: { thinkingLevel: 'low' } };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

    const generate = async (gen) => {
      const rr = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction: sys, contents, generationConfig: gen }),
      });
      return { ok: rr.ok, status: rr.status, data: await rr.json() };
    };

    // 1) Output strutturato (JSON garantito valido con reply/chips/cards)
    let { ok, status, data } = await generate({ ...baseGen, responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA });
    // 2) Rete di sicurezza: se lo schema viene rifiutato (400), riprova in testo semplice
    if (!ok && status === 400) {
      ({ ok, status, data } = await generate(baseGen));
    }
    if (!ok) {
      res.status(502).json({ error: 'gemini_error', code: data && data.error && data.error.code, message: data && data.error && data.error.message });
      return;
    }

    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const raw = parts ? parts.map(p => p.text || '').join('').trim() : '';
    if (!raw) { res.status(502).json({ error: 'empty_reply' }); return; }

    // Parsing robusto: se l'output è JSON con "reply" (da schema o da prompt),
    // estrai reply/chips/cards; altrimenti trattalo come testo semplice.
    let reply = raw, chips = [], cards = [];
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && typeof obj.reply === 'string') {
        reply = obj.reply.trim() || raw;
        if (Array.isArray(obj.chips)) chips = obj.chips.filter(c => typeof c === 'string' && c.trim()).slice(0, 4);
        if (Array.isArray(obj.cards)) cards = obj.cards.filter(c => c && c.title).slice(0, 4);
      }
    } catch (e) { /* non è JSON: testo semplice */ }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ reply, chips, cards });
  } catch (err) {
    res.status(500).json({ error: 'chat_unavailable', message: String(err && err.message || err) });
  }
};

// Esposti solo per test locali (non usati in produzione dall'handler).
module.exports.systemPrompt = systemPrompt;
module.exports.RESPONSE_SCHEMA = RESPONSE_SCHEMA;
module.exports.MODEL = MODEL;
