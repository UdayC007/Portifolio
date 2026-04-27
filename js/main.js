// Uday — public site (server-backed)
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 50));

  const burger = $('nav-burger');
  const navLinks = $('nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href');
      if (target.length < 2) return;
      const t = document.querySelector(target);
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  function watchReveals() { document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el)); }
  watchReveals();

  loadSite();
  loadProjects();

  async function loadSite() {
    try {
      const r = await fetch('data/site.json');
      const s = await r.json();
      const p = s.profile || {};
      const c = s.contact || {};

      const fullName = p.name || 'Uday';

      if ($('hero-name'))    $('hero-name').textContent = fullName;
      if ($('hero-title'))   $('hero-title').textContent = p.title || 'UI/UX Designer';
      if ($('hero-college')) $('hero-college').textContent = p.college || '';
      if ($('hero-tagline') && p.tagline) {
        $('hero-tagline').innerHTML = `<em>"${esc(p.tagline)}"</em>`;
      }

      $('nav-name').textContent = fullName;
      $('footer-name').textContent = `⚓ Captain ${fullName} © ${new Date().getFullYear()}`;
      document.title = `${fullName} — ${p.title || 'Designer'}`;

      if ($('about-name'))    $('about-name').textContent = fullName;
      if ($('about-rank'))    $('about-rank').textContent = p.title || '';
      if ($('about-college')) $('about-college').textContent = p.college || '';
      if ($('about-year'))    $('about-year').textContent = (p.year || '') + ' — B.Des';
      if ($('about-bio'))     $('about-bio').textContent = p.bio || '';
      if ($('personal-touch')) $('personal-touch').textContent = p.personalTouch || '—';
      if ($('goals-text'))     $('goals-text').textContent = p.goals || '—';

      const photos = s.photos || {};
      if (photos.hero) {
        const h = $('hero-portrait-photo');
        if (h) { h.innerHTML = `<img src="${esc(photos.hero)}" alt="">`; h.classList.add('has-photo'); }
      }
      if (photos.about) {
        const a = $('about-portrait');
        if (a) { a.innerHTML = `<img src="${esc(photos.about)}" alt="">`; a.classList.add('has-photo'); }
      }
      if (photos.brand) {
        document.querySelectorAll('.brand-mark').forEach(el => {
          el.innerHTML = `<img src="${esc(photos.brand)}" class="brand-mark-img" alt="">`;
        });
      }

      const subs = s.subjects || [];
      const sg = $('subject-grid');
      if (sg) {
        sg.innerHTML = subs.length
          ? subs.map(sub => `
              <div class="subject-card reveal">
                ${sub.code ? `<div class="subject-code">${esc(sub.code)}</div>` : ''}
                <div class="subject-name">${esc(sub.name)}</div>
                <div class="subject-faculty ${sub.faculty ? '' : 'empty'}">${esc(sub.faculty) || 'First mate to be assigned'}</div>
              </div>`).join('')
          : `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;font-style:italic">No charts yet — set sail from the admin panel.</p>`;
      }

      const skills = s.skills || [];
      const sk = $('skills-grid');
      if (sk) {
        const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
        sk.innerHTML = (skills.length ? skills : []).map((skn, i) => `
          <div class="skill-card reveal">
            <div class="skill-rank">${esc(skn.rank || roman[i] || '?')}</div>
            <h4>${esc(skn.name)}</h4>
            <p>${esc(skn.level ? 'Skill level: ' + skn.level + '%' : '')}</p>
          </div>`).join('') || '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;font-style:italic">No weapons in the arsenal yet.</p>';
      }

      const links = [];
      if (c.email)     links.push({ icon: '📧', label: 'Pigeon Post',   value: c.email,                              href: 'mailto:' + c.email });
      if (c.instagram) links.push({ icon: '📸', label: "Ship's Gallery", value: '@' + c.instagram,                    href: 'https://instagram.com/' + c.instagram });
      if (c.twitter)   links.push({ icon: '🦜', label: 'Parrot Post',   value: '@' + c.twitter,                       href: 'https://twitter.com/' + c.twitter });
      if (c.linkedin)  links.push({ icon: '🔗', label: 'Trade Routes',  value: c.linkedin.replace(/^https?:\/\//, ''), href: c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin });
      const ml = $('msg-links');
      if (ml) ml.innerHTML = links.map(l => `
        <a href="${esc(l.href)}" target="_blank" rel="noopener" class="bottle-link">
          <span class="bl-icon">${l.icon}</span>
          <span class="bl-label">${esc(l.label)}</span>
          <span class="bl-value">${esc(l.value)}</span>
        </a>`).join('') || '<p style="color:var(--text-muted);font-style:italic">No bottles in the water yet — add socials in the admin panel.</p>';

      watchReveals();
    } catch (e) { console.error('loadSite failed', e); }
  }

  async function loadProjects() {
    try {
      const r = await fetch('data/projects.json');
      const _d = await r.json();
      const projects = Array.isArray(_d) ? _d : (_d.items || []);
      const grid = $('projects-grid');
      const empty = $('no-projects');
      if (!projects.length) { grid.style.display = 'none'; empty.style.display = ''; return; }
      grid.style.display = ''; empty.style.display = 'none';
      grid.innerHTML = projects.map(p => {
        const cover = p.images && p.images[0];
        const thumb = cover
          ? `<img src="${esc(cover)}" alt="${esc(p.title)}">`
          : `<div class="project-thumb-placeholder" style="background:${esc(p.color || '#d4a843')}">${esc((p.title || '?').charAt(0))}</div>`;
        const tags = (p.tags || []).slice(0, 3).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
        const photos = (p.images || []).length;
        const photosBadge = photos > 1 ? `<span class="project-tag">${photos} pieces</span>` : '';
        return `
          <a class="project-card reveal" href="project.html?id=${p.id}">
            <div class="project-thumb">${thumb}</div>
            <div class="project-body">
              <div class="project-tags">${tags}${photosBadge}</div>
              <h3 class="project-title">${esc(p.title)}</h3>
              <p class="project-desc">${esc((p.description || '').slice(0, 130))}${(p.description || '').length > 130 ? '…' : ''}</p>
              <span class="project-link">Open the chest →</span>
            </div>
          </a>`;
      }).join('');
      watchReveals();
    } catch (e) {
      $('projects-grid').innerHTML = `<p style="color:var(--red-flag);font-style:italic">Couldn't haul in the treasure: ${esc(e.message)}</p>`;
    }
  }
});
