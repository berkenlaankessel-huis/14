// === JOUW DATA ===
// In jouw repo staan de foto's in de root; gebruik exacte bestandsnamen.
// (Als je later een mapje gebruikt, bv. 'fotos/', zet dat pad voor elk item.)
const IMAGES = [
  // --- EERST: jouw gewenste 5 ---
  "WhatsApp Image 2025-09-07 at 13.51.24.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.27.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.06.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.03.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.06 (1).jpeg",

  // --- DAN: de overige (behalve 26/51/50 varianten) ---
  "WhatsApp Image 2025-09-07 at 13.51.08.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.09.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.12.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.13 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.13.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.14.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.15.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.16 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.16.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.18.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.21.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.29.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.35.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.39.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.40.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.41 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.41.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.42 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.42.jpeg",
  "WhatsApp Image 2025-09-07 at 13.40.38.jpeg",

  // --- LAATSTE: alle 26 / 51 / 50 bestanden ---
  "WhatsApp Image 2025-09-07 at 13.52.26 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.52.26 (2).jpeg",
  "WhatsApp Image 2025-09-07 at 13.52.26.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.51 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.51.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.50.jpeg"
];

const VIDEO_URL = ""; // bv. 'https://www.youtube.com/embed/xxxxxxxx'

const DOCUMENTS = [
  // { name: 'EPC Certificaat – B (Ref. 20250906-0003677153-RES-1)', url: 'documents/epc.pdf' },
  // { name: 'Stedenbouwkundige vergunning – ontvangen', url: 'documents/stedenbouw.pdf' },
];
// === EINDE DATA ===


// Footer jaar
document.getElementById('year').textContent = new Date().getFullYear();


// ---------- Banner i.p.v. grid ----------
const galleryHost = document.getElementById('gallery');
const galleryEmpty = document.getElementById('gallery-empty');

// Render container (banner + knoppen + dots)
function renderBanner() {
  galleryEmpty.classList.add('hide');
  galleryHost.className = ''; // reset grid styling
  galleryHost.innerHTML = `
    <div class="banner" id="banner">
      <img id="bannerImg" alt="Foto" />
      <button class="banner-btn prev" aria-label="Vorige">&#10094;</button>
      <button class="banner-btn next" aria-label="Volgende">&#10095;</button>
      <div class="banner-dots" id="bannerDots"></div>
    </div>
  `;

  // Lightbox HTML dynamisch toevoegen als die nog niet bestaat
  if (!document.getElementById('lightbox')) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.innerHTML = `
      <span class="lightbox-close" id="lightboxClose">&times;</span>
      <img id="lightboxImg" src="" alt="Foto in groot formaat" />
    `;
    document.body.appendChild(lb);
  }
}

// Preload & filter ongeldige paden (zodat slider nooit vastloopt)
function preloadAndInit(list) {
  if (!list || list.length === 0) return;
  const valid = [];
  let done = 0;

  list.forEach(src => {
    const im = new Image();
    im.onload = () => { valid.push(src); finish(); };
    im.onerror = () => { finish(); }; // sla over als hij niet laadt (naam/path fout)
    im.src = src;
  });

  function finish() {
    done++;
    if (done === list.length) {
      if (valid.length === 0) return;
      renderBanner();
      initSlider(valid);
    }
  }
}

function initSlider(list) {
  const imgEl = document.getElementById('bannerImg');
  const dotsEl = document.getElementById('bannerDots');
  const nextBtn = document.querySelector('.banner-btn.next');
  const prevBtn = document.querySelector('.banner-btn.prev');

  dotsEl.innerHTML = list.map((_, i) =>
    `<button class="dot" data-i="${i}" aria-label="Slide ${i+1}"></button>`
  ).join('');
  const dotButtons = Array.from(dotsEl.querySelectorAll('.dot'));

  let index = 0;
  const INTERVAL_MS = 4000;
  let timer = null;

  function show(i, instant=false) {
    index = (i + list.length) % list.length;
    if (!instant) imgEl.classList.add('is-fading');
    imgEl.onload = () => imgEl.classList.remove('is-fading');
    imgEl.src = list[index];
    dotButtons.forEach((b, k) => b.classList.toggle('active', k === index));
  }
  function next(){ show(index + 1); }
  function prev(){ show(index - 1); }
  function start(){ timer = setInterval(next, INTERVAL_MS); }
  function stop(){ clearInterval(timer); timer = null; }
  function restart(){ stop(); start(); }

  nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn.addEventListener('click', () => { prev(); restart(); });
  dotButtons.forEach(b => b.addEventListener('click', (e) => {
    const i = Number(e.currentTarget.getAttribute('data-i'));
    show(i); restart();
  }));

  // === Lightbox functionaliteit ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  imgEl.style.cursor = 'zoom-in';
  imgEl.addEventListener('click', () => {
    lightboxImg.src = list[index];
    lightbox.classList.add('active');
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  show(0, true);
  start();
}

if (IMAGES.length === 0) {
  // laat placeholder staan
} else {
  preloadAndInit(IMAGES);
}


// ---------- Video ----------
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


// ---------- Tabs ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    document.getElementById('tab-details').classList.toggle('hide', tab !== 'details');
    document.getElementById('tab-documenten').classList.toggle('hide', tab !== 'documenten');
  });
});


// ---------- Documenten ----------
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
