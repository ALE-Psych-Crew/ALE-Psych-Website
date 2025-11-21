// /js/mods.js
(function () {
  const grid = document.getElementById('modsGrid');
  const empty = document.getElementById('emptyState');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const PLACEHOLDER_BANNER = '../assets/images/engine-branding/brandpitcure.png';
  const BANNER_EXTS = ['png', 'jpg', 'jpeg', 'webp'];

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
        img.src = `./${slug}/modbanner.${ext}`;
      } else {
        img.src = PLACEHOLDER_BANNER;
        img.onerror = null;
      }
    }

    img.onerror = tryNext;
    tryNext();
    return img;
  }

  function buildBadges(cats) {
    const map = [
      ['featured', 'Featured'],
      ['original', 'Original'],
      ['port', 'Port'],
      ['tools', 'Tool'],
      ['upcoming', 'Upcoming'],
      // WIP removed
    ];
    const wrap = document.createElement('div');
    wrap.className = 'badges';
    map.forEach(([key, label]) => {
      if (cats.includes(key)) {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = label;
        wrap.appendChild(span);
      }
    });
    return wrap;
  }

  function buildCardContent(slug, name, desc, author, cats) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(makeBannerImg(slug, name));

    const body = document.createElement('div');
    body.className = 'mod-body';

    const title = document.createElement('h3');
    title.className = 'mod-title';
    title.textContent = name;

    const description = document.createElement('p');
    description.className = 'mod-desc';
    description.textContent = desc;

    const meta = document.createElement('div');
    meta.className = 'mod-meta';
    const authorEl = document.createElement('span');
    authorEl.className = 'mod-team';
    authorEl.textContent = author;
    const actions = document.createElement('div');
    actions.className = 'mod-actions';
    meta.appendChild(authorEl);
    meta.appendChild(actions);

    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(meta);
    body.appendChild(buildBadges(cats));

    fragment.appendChild(body);
    return fragment;
  }

  function renderCard(slug, meta, cats) {
    const categories = Array.isArray(cats) ? cats : [];
    const name = (meta && (meta.ModName || meta.name)) || slug;
    const desc = (meta && (meta['Mod Description'] || meta.description || meta.desc)) || '';
    const author =
      (meta && (meta.author || meta.teamname || meta.developer || meta.authorName || meta.creator)) || 'Unknown';
    const link = (meta && (meta.link || meta.homepage || meta.url)) || '';
    const hasLink = Boolean(link);

    const el = document.createElement(hasLink ? 'a' : 'article');
    if (hasLink) {
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener';
      el.className = 'mod-card mod-card-link';
      el.setAttribute('aria-label', `${name} - open mod page`);
    } else {
      el.className = 'mod-card';
    }
    el.dataset.cats = categories.join(',');

    el.appendChild(buildCardContent(slug, name, desc, author, categories));
    return el;
  }

  async function fetchMeta(slug) {
    const url = `./${slug}/modmetadata.json?ts=${Date.now()}`;
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
