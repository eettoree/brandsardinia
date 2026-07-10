/**
 * fetch-osm-pois.js
 * Scarica POI dalla Sardegna via Overpass API e li fonde con i dati esistenti.
 * Uso: node scripts/fetch-osm-pois.js
 * Output: assets/data/pois.json (aggiorna il file esistente)
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const OUT_FILE = path.join(__dirname, '../assets/data/pois.json');
const BBOX     = '38.85,8.13,41.25,9.83'; // sud,ovest,nord,est — Sardegna

// ─── QUERY OVERPASS ──────────────────────────────────────────
const QUERIES = [
  {
    cat: 'spiaggia',
    query: `[out:json][timeout:30];(node["natural"="beach"]["name"](${BBOX});way["natural"="beach"]["name"](${BBOX}););out center 100;`
  },
  {
    cat: 'attrazione',
    query: `[out:json][timeout:30];(node["tourism"="attraction"]["name"](${BBOX});node["tourism"="museum"]["name"](${BBOX});node["historic"]["name"](${BBOX});way["tourism"="attraction"]["name"](${BBOX});way["historic"]["name"](${BBOX}););out center 100;`
  },
  {
    cat: 'città',
    query: `[out:json][timeout:30];(node["place"~"city|town"]["name"](${BBOX});node["place"="village"]["name"]["population"](${BBOX}););out center 80;`
  },
  {
    cat: 'parco',
    query: `[out:json][timeout:30];(relation["boundary"="protected_area"]["name"](${BBOX});relation["leisure"="nature_reserve"]["name"](${BBOX});way["leisure"="nature_reserve"]["name"](${BBOX}););out center 60;`
  },
  {
    cat: 'hotel',
    query: `[out:json][timeout:30];(node["tourism"~"hotel|resort"]["name"](${BBOX});way["tourism"~"hotel|resort"]["name"](${BBOX}););out center 80;`
  },
  {
    cat: 'ristorante',
    query: `[out:json][timeout:30];(node["amenity"="restaurant"]["name"]["cuisine"](${BBOX});way["amenity"="restaurant"]["name"]["cuisine"](${BBOX}););out center 80;`
  },
  {
    cat: 'esperienza',
    query: `[out:json][timeout:30];(node["sport"~"diving|surfing|kitesurfing|climbing|cycling|hiking"]["name"](${BBOX});node["tourism"="camp_site"]["name"](${BBOX});node["leisure"="sports_centre"]["name"](${BBOX}););out center 60;`
  }
];

const CAT_COLORS = {
  spiaggia: '#00BFFF', città: '#8899bb', hotel: '#C8102E',
  ristorante: '#FF8C00', attrazione: '#FFD700', parco: '#32CD32', esperienza: '#B040FF'
};

// ─── HELPERS ─────────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getLatLng(el) {
  if (el.type === 'node') return { lat: el.lat, lng: el.lon };
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  return null;
}

function transformElement(el, cat) {
  const pos = getLatLng(el);
  if (!pos) return null;
  const name = el.tags && el.tags.name;
  if (!name || name.length < 3) return null;
  return {
    id:          slugify(name),
    name,
    lat:         pos.lat,
    lng:         pos.lng,
    cat,
    color:       CAT_COLORS[cat] || '#ffffff',
    description: `${name} — ${cat} in Sardegna.`,
    come:        '',
    servizi:     el.tags['service'] || el.tags['amenity'] || '',
    costo:       el.tags['fee'] ? 'A pagamento' : '',
    tel:         el.tags['phone'] || el.tags['contact:phone'] || '',
    web:         el.tags['website'] || el.tags['contact:website'] || '',
    orari:       el.tags['opening_hours'] || '',
    osm_id:      `${el.type}/${el.id}`
  };
}

function isTooClose(a, b) {
  return Math.abs(a.lat - b.lat) < 0.003 &&
         Math.abs(a.lng - b.lng) < 0.004 &&
         a.cat === b.cat;
}

// ─── MAIN ────────────────────────────────────────────────────
async function main() {
  // Carica i POI esistenti
  let existing = [];
  if (fs.existsSync(OUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    console.log(`Existing POIs: ${existing.length}`);
  }

  const existingIds = new Set(existing.map(p => p.id));
  let added = 0;
  const result = [...existing];

  for (const q of QUERIES) {
    process.stdout.write(`Fetching ${q.cat}... `);
    try {
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q.query)}`;
      const data = await fetchUrl(url);
      let catAdded = 0;

      for (const el of (data.elements || [])) {
        const poi = transformElement(el, q.cat);
        if (!poi) continue;
        if (existingIds.has(poi.id)) continue;
        if (result.some(e => isTooClose(e, poi))) continue;
        result.push(poi);
        existingIds.add(poi.id);
        catAdded++;
        added++;
      }

      // Piccola pausa per non sovraccaricare Overpass
      await new Promise(r => setTimeout(r, 1200));
      console.log(`+${catAdded} nuovi`);
    } catch (err) {
      console.log(`ERRORE: ${err.message}`);
    }
  }

  // Rimuove il campo osm_id prima di salvare (non serve nel frontend)
  result.forEach(p => delete p.osm_id);

  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nSalvati ${result.length} POI totali (+${added} nuovi) in ${OUT_FILE}`);
}

main().catch(err => { console.error(err); process.exit(1); });
