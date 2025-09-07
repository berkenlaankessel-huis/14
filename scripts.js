// === VUL HIER JOUW DATA IN ===
const IMAGES = [
  // Zet hier je bestandsnamen/URLs, vb.:
  // 'fotos/voorgevel.jpeg',
  // 'fotos/living.jpeg',
  // Of als ze naast index.html staan:
  "WhatsApp Image 2025-09-07 at 13.40.38.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.03.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.06.jpeg",
];

const VIDEO_URL = ""; // bv. 'https://www.youtube.com/embed/xxxxxxxx'

const DOCUMENTS = [
  // { name: 'EPC Certificaat – B (Ref. 20250906-0003677153-RES-1)', url: 'documents/epc.pdf' },
  // { name: 'Stedenbouwkundige vergunning – ontvangen', url: 'documents/stedenbouw.pdf' },
];
// === EINDE CONFIG ===

// Footer jaar
document.getElementById('year').textContent = new Date().getFullYear();

// === Banner/slider i.p.v. galerij ===
const galleryHost = document.getElementById('gallery');
const galleryEmpty = document.getElementById('gallery-empty');

if (IMAGES.length === 0) {
  // geen foto’s → placeholder laten staan
} else {
  // vervang de galerij door één banner/slider
  galleryEmpty.classList.add('hide');
  galleryHost.className = ''; // reset grid-styling
  galleryHost.innerHTML = `
    <div class="banner" id="banner">
      <img id="bannerImg" alt="Foto" />
      <button class="banner-btn prev" aria-label="Vorige">&#10094;</button>
      <button class="banner-btn next" aria-label="Volgende">&#10095;</button>
      <div class="banner-dots" id="bannerDots"></div>
    </div>
  `;

  const imgEl = document.getElementById('bannerImg');
  const dotsEl = document.getElementById('bannerDots');

  let index = 0;
  const INTERVAL_MS = 4000;   // wisselsnelheid
  let timer = null;

  // dots maken
  dotsEl.innerHTML = IMAGES.map((_, i) => `<button class="dot" data-i="${i}" aria-label="Ga naar slide ${i+1}"></button>`).join('');
  const dotButtons = Array.from(dotsEl.querySelectorAll('.dot'));

  function show(i, instant=false) {
    index = (i + IMAGES.length) % IMAGES.length;
    // fade
    if (!instant) imgEl.classList.add('fade');
    imgEl.onload = () => imgEl.classList.remove('fade');
    imgEl.src = IMAGES[index];
    dotButtons.forEach((b, k) => b.classList.toggle('active', k === index));
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  // knoppen
  document.querySelector('.banner-btn.next').addEventListener('click', () => { next(); restart(); });
  document.querySelector('.banner-btn.prev').addEventListener('click', () => { prev(); restart(); });

  // dots click
  dotButtons.forEach(b => b.addEventListener('click', (e) => {
    const i = Number(e.currentTarget.getAttribute('data-i'));
    show(i); restart();
  }));

  function start() {
    timer = setInterval(next, INTERVAL_MS);
  }
  function stop() {
    clearInterval(timer); timer = null;
  }
  function restart() { stop(); start(); }

  // pauzeer op hover/touch
  const banner = document.getElementById('banner');
  banner.addEventListener('mouseenter', stop);
  banner.addEventListener('mouseleave', start);
  banner.addEventListener('touchstart', stop, { passive:true });
  banner.addEventListener('touchend', start, { passive:true });

  show(0, true);
  start();
}

// === Video ===
const frame = document.getElementById('tourFrame');
const videoWrap = document.getElementById('videoWrap');
const videoEmpty = document.getElementById('videoEmpty');
if (VIDEO_URL) {
  frame.src = VIDEO_URL;
  videoEmpty.classList.add('hide');
  videoWrap.classList.remove('hide');
} else {
  videoWrap.classList.add('hide');
  videoEmpty.classList.remove('hide');
}

// === Tabs ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    document.getElementById('tab-details').classList.toggle('hide', tab !== 'details');
    document.getElementById('tab-documenten').classList.toggle('hide', tab !== 'documenten');
  });
});

// === Documenten ===
const docsList = document.getElementById('docsList');
if (DOCUMENTS.length === 0) {
  docsList.innerHTML = '<div class="placeholder">Nog geen documenten toegevoegd. Voeg items toe in <code>scripts.js</code> → <b>DOCUMENTS</b>.</div>';
} else {
  docsList.innerHTML = DOCUMENTS.map(d => `
    <div class="doc-row">
      <div>📄 ${d.name}</div>
      <a class="btn" href="${d.url}" download>Download</a>
    </div>
  `).join('');
}
