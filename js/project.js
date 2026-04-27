// Surya — project detail page
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 50));

function projectId() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('id')) return params.get('id');
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

function gallerySize(i, total) {
  if (total === 1) return 'span-6';
  if (total === 2) return 'span-3';
  const pat = ['span-4', 'span-2', 'span-2', 'span-4', 'span-3', 'span-3'];
  return pat[i % pat.length];
}

async function loadSite() {
  try {
    const r = await fetch('data/site.json');
    const s = await r.json();
    const p = s.profile || {};
    $('nav-name').textContent = p.name || 'Uday';
    if (s.photos && s.photos.brand) {
      document.querySelectorAll('.brand-mark').forEach(el => {
        el.innerHTML = `<img src="${esc(s.photos.brand)}" class="brand-mark-img" alt="">`;
      });
    }
  } catch (e) {}
}

async function loadProject() {
  const root = $('project-root');
  try {
    const r = await fetch('data/projects.json');
    if (!r.ok) throw new Error('Could not load projects');
    const data = await r.json();
    const list = Array.isArray(data) ? data : (data.items || []);
    const p = list.find(x => x.id === projectId());
    if (!p) throw new Error('Treasure not found');
    document.title = p.title + ' — Uday Portfolio';

    const all = p.images || [];
    const cover = all[0];
    const rest = all.slice(1);
    const tags = (p.tags || []).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');

    const meta = [];
    if (p.category) meta.push({ k: 'Category', v: p.category });
    if (p.year)     meta.push({ k: 'Year', v: p.year });
    if (p.teacher)  meta.push({ k: 'Mentor', v: p.teacher });
    meta.push({ k: 'Photos', v: String(all.length) });

    root.innerHTML = `
      <div class="project-head">
        <div>
          <div class="project-tag-row">${tags || '<span class="project-tag">TREASURE</span>'}</div>
          <h1>${esc(p.title)}</h1>
          ${p.description ? `<p class="project-blurb">${esc(p.description.split(/\n\n|\.\s/)[0]).slice(0, 240)}${p.description.length > 240 ? '…' : ''}</p>` : ''}
        </div>
        <div class="project-meta-card">
          ${meta.map(m => `<div class="project-meta-row"><span class="key">${esc(m.k)}</span><span class="val">${esc(m.v)}</span></div>`).join('')}
          ${p.link ? `<div class="project-meta-row"><span class="key">Chart</span><span class="val"><a href="${esc(p.link)}" target="_blank" rel="noopener" style="color:var(--gold-bright)">Open ↗</a></span></div>` : ''}
        </div>
      </div>

      ${cover ? `
        <div class="project-hero-img" onclick="openLightbox('${esc(cover)}')">
          <img src="${esc(cover)}" alt="${esc(p.title)}" />
        </div>` : ''}

      ${p.description ? `<div class="project-story">${esc(p.description)}</div>` : ''}

      ${rest.length ? `
        <div class="project-gallery">
          ${rest.map((img, i) => `
            <div class="pg-item ${gallerySize(i, rest.length)}" onclick="openLightbox('${esc(img)}')">
              <img src="${esc(img)}" alt="" loading="lazy" />
            </div>`).join('')}
        </div>` : ''}

      <div style="text-align:center;margin-top:30px">
        <a href="index.html#projects" class="btn-ghost-p">← More treasure</a>
      </div>
    `;
  } catch (e) {
    root.innerHTML = `<div style="text-align:center;padding:60px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius)"><h3 style="font-family:var(--font-pirate);font-size:2rem;color:var(--gold-bright);margin-bottom:8px">${esc(e.message)}</h3><p style="color:var(--text-sec)">This treasure may have washed ashore elsewhere. <a href="index.html" style="color:var(--gold-bright)">Sail home →</a></p></div>`;
  }
}

window.openLightbox = (src) => {
  $('lightbox-img').src = src;
  $('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLightbox = () => {
  $('lightbox').classList.remove('open');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

loadSite();
loadProject();
