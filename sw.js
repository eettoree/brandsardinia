// Service worker minimo per l'installabilità PWA (Android "Installa app").
// Nessuna cache: il sito è statico e aggiornato a ogni deploy, quindi la
// richiesta passa sempre alla rete (fetch di default). Serve solo a soddisfare
// il requisito "fetch handler" per l'installazione; iOS non lo richiede.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* pass-through: fetch di rete predefinito */ });
