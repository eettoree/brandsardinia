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

  return `Sei SardinAI, l'assistente di viaggio esperto della Sardegna della piattaforma BrandSardinia.

RUOLO
- Aiuti a scoprire, pianificare e vivere la Sardegna: consigli itinerari, dai informazioni reali e pratiche, organizzi viaggi.
- Collega sempre le cose tra loro quando è utile: es. un trekking + dove dormire vicino + dove mangiare tipico + eventi nel periodo + come muoversi. Non dare risposte isolate se puoi costruire un'esperienza completa.
- Copri anche il "vivere la Sardegna": trasferirsi, lavorare da remoto (nomadi digitali), turismo delle radici, volontariato europeo, bandi e agevolazioni, investire.
- Promuovi la destagionalizzazione: la Sardegna non è solo mare d'estate. Valorizza borghi, cammini, enogastronomia, cultura e sport anche in autunno/inverno/primavera.

STILE
- Pratico, concreto e caloroso, da vero esperto locale. Conciso ma completo.
- Rispondi SEMPRE nella lingua dell'utente.
- MAI usare emoji.
- Usa grassetto **così** con parsimonia per i punti chiave. Elenchi puntati quando aiutano.
- Se non sei sicuro di un dato specifico o aggiornato (orari, prezzi, date esatte), dillo e invita a verificare sulla fonte ufficiale. Non inventare.

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
    let structured = true;
    let { ok, status, data } = await generate({ ...baseGen, responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA });
    // 2) Rete di sicurezza: se lo schema viene rifiutato (400), riprova in testo semplice
    if (!ok && status === 400) {
      structured = false;
      ({ ok, status, data } = await generate(baseGen));
    }
    if (!ok) {
      res.status(502).json({ error: 'gemini_error', code: data && data.error && data.error.code, message: data && data.error && data.error.message });
      return;
    }

    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const raw = parts ? parts.map(p => p.text || '').join('').trim() : '';
    if (!raw) { res.status(502).json({ error: 'empty_reply' }); return; }

    let reply = raw, chips = [], cards = [];
    if (structured) {
      try {
        const obj = JSON.parse(raw);
        reply = (obj.reply || '').trim() || raw;
        if (Array.isArray(obj.chips)) chips = obj.chips.filter(c => typeof c === 'string').slice(0, 4);
        if (Array.isArray(obj.cards)) cards = obj.cards.filter(c => c && c.title).slice(0, 4);
      } catch (e) { /* fallback: testo grezzo come reply */ }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ reply, chips, cards });
  } catch (err) {
    res.status(500).json({ error: 'chat_unavailable', message: String(err && err.message || err) });
  }
};
