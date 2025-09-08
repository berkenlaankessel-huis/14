// === JOUW DATA ===
// Zet de .jpeg-bestanden in dezelfde map als index.html
const IMAGES = [
  "WhatsApp Image 2025-09-07 at 13.51.24.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.27.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.06.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.03.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.06 (1).jpeg",

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

  "WhatsApp Image 2025-09-07 at 13.52.26 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.52.26 (2).jpeg",
  "WhatsApp Image 2025-09-07 at 13.52.26.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.51 (1).jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.51.jpeg",
  "WhatsApp Image 2025-09-07 at 13.51.50.jpeg"
];

const VIDEO_URL = "https://www.youtube.com/embed/830jJZiPLtY";

const DOCUMENTS = [
  // { name: 'EPC – Label B (ref. 20250906-0003677153-RES-1)', url: 'documents/epc.pdf' },
];
// === EINDE DATA ===

// ===== Helper: veilige URL voor bestandsnamen met spaties/() =====
const toURL = (p) => encodeURI(p);

// ===== Footer jaar =====
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// ===== Galerij als banner-slider =====
const galleryHost = document.getElementById('gallery');
const galleryEmpty = document.getElementById('gallery-empty');

function renderBanner() {
  if (galleryEmpty) galleryEmpty.classList.add('hide');
  if (!galleryHost) return;
  galleryHost.innerHTML = `
    <div class="banner" id="banner">
      <img id="bannerImg" alt="Foto" />
      <button class="banner-btn prev" aria-label="Vorige">&#10094;</button>
      <button class="banner-btn next" aria-label="Volgende">&#10095;</button>
      <div class="banner-dots" id="bannerDots"></div>
    </div>
  `;
}

function preloadAndInit(list) {
  if (!list || list.length === 0 || !galleryHost) {
    if (galleryEmpty) galleryEmpty.classList.remove('hide');
    return;
  }
  const valid = [];
  let done = 0;

  list.forEach(src => {
    const im = new Image();
    im.onload = () => { valid.push(src); finish(); };
    im.onerror = finish; // sla over bij fout
    im.referrerPolicy = "no-referrer";
    im.src = toURL(src);
  });

  function finish() {
    done++;
    if (done === list.length) {
      if (!valid.length) {
        if (galleryEmpty) galleryEmpty.classList.remove('hide');
        return;
      }
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

  if (!imgEl || !dotsEl || !nextBtn || !prevBtn) return;

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
    imgEl.src = toURL(list[index]);
    dotButtons.forEach((b, k) => b.classList.toggle('active', k === index));
  }
  function next(){ show(index + 1); }
  function prev(){ show(index - 1); }
  function start(){ stop(); timer = setInterval(next, INTERVAL_MS); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  nextBtn.addEventListener('click', () => { next(); start(); });
  prevBtn.addEventListener('click', () => { prev(); start(); });
  dotButtons.forEach(b => b.addEventListener('click', (e) => {
    const i = Number(e.currentTarget.getAttribute('data-i'));
    show(i); start();
  }));

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {
    imgEl.style.cursor = 'zoom-in';
    imgEl.addEventListener('click', () => {
      lightboxImg.src = toURL(list[index]);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightboxClose.click();
    });
  }

  show(0, true);
  start();
}

// Start galerij
if (Array.isArray(IMAGES) && IMAGES.length) {
  preloadAndInit(IMAGES);
} else if (galleryEmpty) {
  galleryEmpty.classList.remove('hide');
}

// ===== Video =====
const frame = document.getElementById('tourFrame');
const videoWrap = document.getElementById('videoWrap');
const videoEmpty = document.getElementById('videoEmpty');

if (frame && videoWrap && videoEmpty) {
  if (typeof VIDEO_URL === 'string' && VIDEO_URL.trim()) {
    frame.src = VIDEO_URL.trim();
    videoEmpty.classList.add('hide');
    videoWrap.classList.remove('hide');
    videoEmpty.style.display = 'none';
    videoWrap.style.display = '';
  } else {
    videoWrap.classList.add('hide');
    videoEmpty.classList.remove('hide');
    videoWrap.style.display = 'none';
    videoEmpty.style.display = '';
  }
}

// ===== Tabs (details / documenten / biedingen) =====
(() => {
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels  = Array.from(document.querySelectorAll('.tab-content'));

  function showTab(name) {
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    tabPanels.forEach(p => {
      const isTarget = p.id === `tab-${name}`;
      p.style.display = isTarget ? '' : 'none';
      p.classList.toggle('hide', !isTarget);
    });
  }

  tabButtons.forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
  showTab('details');
})();

// ===== Documenten =====
(() => {
  const docsList = document.getElementById('docsList');
  if (!docsList) return;

  if (!Array.isArray(DOCUMENTS) || DOCUMENTS.length === 0) {
    docsList.innerHTML =
      '<div class="placeholder">Nog geen documenten toegevoegd. Voeg items toe in <code>scripts.js</code> → <b>DOCUMENTS</b>.</div>';
    return;
  }

  docsList.innerHTML = DOCUMENTS.map(d => `
    <div class="doc-row">
      <div>📄 ${d.name}</div>
      <a class="btn" href="${toURL(d.url)}" target="_blank" rel="noopener">Download</a>
    </div>
  `).join('');
})();
