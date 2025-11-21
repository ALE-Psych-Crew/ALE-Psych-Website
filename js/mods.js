// /js/mods.js
(function () {
  const grid = document.getElementById('modsGrid');
  const empty = document.getElementById('emptyState');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const PLACEHOLDER_BANNER = 'assets/images/engine-branding/brandpitcure.png';
  const BANNER_EXTS = ['png', 'jpg', 'jpeg', 'webp']; // try in order

  function skeleton() {
    const el = document.createElement('article');
    el.className = 'mod-card';
    el.innerHTML = `
      <div class="mod-banner skeleton" style="aspect-ratio:16/9"></div>
      <div class="mod-body">
        <div class="skeleton" style="height:18px;width:60%;border-radius:6px;margin:.2em 0 .6em"></div>
        <div class="skeleton" style="height:12px;width:95%;border-radius:6px;margin:.3em 0"></div>
        <div class="skeleton" style="height:12px;width:70%;border-radius:6px;margin:.3em 0 .8em"></div>
        <div class="skeleton" style="height:12px;width:40%;border-radius:6px;margin:.3em 0"></div>
      </div>`;
    return el;
  }

  function makeBannerImg(slug, name) {
    const img = document.createElement('img');
    img.className = 'mod-banner';
    img.alt = `${name} banner`;
    let i = 0;

    function tryNext() {
      if (i < BANNER_EXTS.length) {
        const ext = BANNER_EXTS[i++];
        img.src = `mods/${slug}/modbanner.${ext}`;
      } else {
        img.src = PLACEHOLDER_BANNER;
        img.onerror = null;
      }
    }

    img.onerror = tryNext;
    tryNext();
    return img;
  }

  function buildCardContent(slug, name, desc, author, cats) {
    const wrap = document.createElement('div');
    const banner = makeBannerImg(slug, name);
    wrap.appendChild(banner);

    const body = document.createElement('div');
    body.className = 'mod-body';
    body.innerHTML = `
      <h3 class="mod-title">${name}</h3>
      <p class="mod-desc">${desc}</p>
      <div class="mod-meta">
        <span class="mod-team">${author}</span>
        <div class="mod-actions"></div>
      </div>
      <div class="badges">
        ${cats.includes('featured') ? `<span class="badge">Featured</span>` : ``}
        ${cats.includes('upcoming') ? `<span class="badge">Upcoming</span>` : ``}
      </div>
    `;
    wrap.appendChild(body);
    return wrap;
  }

  function renderCard(slug, meta, cats) {
    const name = (meta && (meta.ModName || meta.name)) || slug;
    const desc = (meta && (meta['Mod Description'] || meta.description || meta.desc)) || '';
    const author = (meta && (meta.author || meta.teamname || meta.developer || meta.authorName)) || 'Unknown';
    const link = (meta && (meta.link || meta.homepage || meta.url)) || '';

    const hasLink = Boolean(link);
    const el = document.createElement(hasLink ? 'a' : 'article');
    if (hasLink) {
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener';
      el.className = 'mod-card mod-card-link';
      el.setAttribute('aria-label', `${name} — open mod page`);
    } else {
      el.className = 'mod-card';
    }
    el.dataset.cats = (cats || []).join(',');

    const content = buildCardContent(slug, name, desc, author, cats);
    el.appendChild(content);
    return el;
  }

  async function fetchMeta(slug) {
    const url = `mods/${slug}/modmetadata.json?ts=${Date.now()}`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[mods] Failed to fetch/parse ${url}:`, e);
      return null;
    }
  }

  async function load() {
    if (!grid) return;
    grid.setAttribute('aria-busy', 'true');
    (MOD_FOLDERS || []).forEach(() => grid.appendChild(skeleton()));

    const items = await Promise.all(
      (MOD_FOLDERS || []).map(async ({ slug, categories = [] }) => {
        const meta = await fetchMeta(slug);
        return { slug, cats: categories, meta };
      })
    );

    grid.innerHTML = '';
    items.forEach(({ slug, cats, meta }) => grid.appendChild(renderCard(slug, meta, cats)));
    grid.removeAttribute('aria-busy');
    applyFilter(currentFilter);
  }

  let currentFilter = 'all';
  function applyFilter(filter) {
    currentFilter = filter;
    const cards = Array.from(grid.querySelectorAll('.mod-card'));
    let visible = 0;
    cards.forEach((card) => {
      const cats = (card.dataset.cats || '').split(',').filter(Boolean);
      const show = filter === 'all' ? true : cats.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
    filterBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.filter === filter));
  }

  filterBtns.forEach((btn) => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  if (Array.isArray(MOD_FOLDERS)) load();
})();
