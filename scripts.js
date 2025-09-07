// === VUL HIER JOUW DATA IN ===
const IMAGES = [
  // Voorbeeld: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
];

const VIDEO_URL = ""; // bv. 'https://www.youtube.com/embed/xxxxxxxx'

const DOCUMENTS = [
  // { name: 'EPC Certificaat – B (Ref. 20250906-0003677153-RES-1)', url: 'documents/epc.pdf' },
  // { name: 'Stedenbouwkundige vergunning – ontvangen', url: 'documents/stedenbouw.pdf' },
  // { name: 'Kadastrale Gegevens', url: 'documents/kadastraal.pdf' },
  // { name: 'Elektrische keuring (status: niet gespecificeerd)', url: 'documents/keuring.pdf' },
];
// === EINDE CONFIG ===

// Footer jaar
document.getElementById('year').textContent = new Date().getFullYear();

// Galerij + modal
const gallery = document.getElementById('gallery');
const galleryEmpty = document.getElementById('gallery-empty');
function openModal(src){
  const m = document.getElementById('modal');
  const img = document.getElementById('modalImg');
  img.src = src;
  m.classList.add('open');
  m.addEventListener('click', () => m.classList.remove('open'), { once: true });
}
if (IMAGES.length > 0) {
  galleryEmpty.classList.add('hide');
  IMAGES.forEach((src, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'aspect-4-3';
    const img = document.createElement('img');
    img.src = src + (src.includes('unsplash') ? '?auto=format&fit=crop&w=1080&q=80' : '');
    img.alt = `Foto ${i+1}`;
    img.addEventListener('click', () => openModal(src));
    wrap.appendChild(img);
    gallery.appendChild(wrap);
  });
}

// Video
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

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    document.getElementById('tab-details').classList.toggle('hide', tab !== 'details');
    document.getElementById('tab-documenten').classList.toggle('hide', tab !== 'documenten');
  });
});

// Documenten
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
