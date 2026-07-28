// Vercel serverless function — endpoint eventi "live".
// Serve gli eventi curati (assets/data/events.json), arricchiti e ordinati,
// sempre relativi alla data odierna. È il punto di innesto per l'ingest
// futuro di feed ufficiali (RSS/ICS) e per gli embed oEmbed dei post IG curati.
//
// Nota: Instagram NON è aggregabile via API per account/hashtag di terzi
// (Basic Display dismessa, Graph solo account propri). La freschezza si
// costruisce con curazione + feed ufficiali, non con scraping.

const events = require('../assets/data/events.json');

const SEASON = (m) =>
  [12, 1, 2].includes(m) ? 'inverno'
  : [3, 4, 5].includes(m) ? 'primavera'
  : [6, 7, 8].includes(m) ? 'estate'
  : 'autunno';
const LOW_SEASON = [10, 11, 12, 1, 2, 3, 4];

// Punto di estensione: feed ufficiali da normalizzare in futuro.
// Es. { url, type: 'ics'|'rss', parse: (raw) => [...events] }
const FEEDS = [];

async function fetchFeeds() {
  // Placeholder: nessun feed esterno affidabile attivo per gli eventi locali
  // sardi. Quando se ne aggiungeranno (comuni/ProLoco/SardegnaOpenData),
  // qui si normalizzano e si uniscono a `events`.
  return [];
}

module.exports = async (req, res) => {
  try {
    const external = await fetchFeeds();
    const all = [...events, ...external];
    const now = Date.now();

    const enriched = all
      .map((e) => {
        const ts = new Date(e.date).getTime();
        return {
          ...e,
          season: e.season || SEASON(e.month),
          lowSeason: LOW_SEASON.includes(e.month),
          upcoming: ts >= now,
          _ts: ts,
        };
      })
      .sort((a, b) => a._ts - b._ts)
      .map(({ _ts, ...e }) => e);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      updatedAt: new Date().toISOString(),
      count: enriched.length,
      source: 'curated',
      events: enriched,
    });
  } catch (err) {
    res.status(500).json({ error: 'events_unavailable', message: String(err && err.message || err) });
  }
};
