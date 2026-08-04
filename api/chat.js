// Vercel serverless function — chat SardinAI potenziata da Gemini.
// La chiave Gemini è letta da process.env.GEMINI_API_KEY (mai nel codice/browser).
// Imposta la variabile su Vercel: Project Settings → Environment Variables → Production.

const MODEL = 'gemini-flash-latest'; // alias sempre aggiornato al Flash corrente

let _events = [];
try { _events = require('../assets/data/events.json'); } catch (e) { _events = []; }

function systemPrompt() {
  const eventsList = _events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => `- ${e.name} (${e.city}, ${e.date}, ${e.category})`)
    .join('\n');

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
- Usa le conoscenze reali qui sotto (eventi del calendario, strumenti del sito) come base. Per il resto, attieniti alla conoscenza geografica/culturale consolidata della Sardegna, senza dettagli inventati.

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

EVENTI NOTI (dal calendario del sito, usali quando pertinenti):
${eventsList}

RISPONDI IN JSON STRUTTURATO con questi campi:
- "reply": la risposta discorsiva, CONCISA e calorosa, nella lingua dell'utente (sintetizza; i dettagli vanno nelle cards). Puoi usare **grassetto** e *corsivo*. Niente emoji.
- "chips": SEMPRE 2-4 stringhe brevi (max ~5 parole) — proposte di risposta rapida per facilitare il passo successivo (conversazione guidata).
- "cards": 0-4 schede quando proponi luoghi/esperienze/eventi/itinerari concreti. Ogni card: "title" (nome), "meta" (una riga breve: zona, durata, prezzo o data), "desc" (1 frase), "action". "action" è una fra: "tool:calendar" | "tool:sentieri" | "tool:cantine" | "tool:musei" | "tool:ristoranti" | "tool:hotel" | "tool:itinerari" | "tool:vivere" | "tool:bandi" | "tool:galleria" | "tool:oggi" | "tool:transport" | "tool:beaches" | "tool:sports" | "tool:prodotti" | "map" | "url:https://..." — scegli lo strumento più pertinente del sito. Lascia "cards" vuoto se non hai proposte concrete.

Rispondi alla conversazione seguente.`;
}

// Schema che garantisce un JSON valido e parsabile (niente parsing fragile lato client)
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
        required: ['title'],
      },
    },
  },
  required: ['reply'],
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
