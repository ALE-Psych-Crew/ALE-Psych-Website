(function(){
  const grid = document.getElementById('modsGrid');
  const empty = document.getElementById('emptyState');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const PLACEHOLDER_BANNER = 'assets/images/engine-branding/brandpitcure.png';

  function skeleton(){
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

  function cardInnerHTML(slug, name, desc, team, cats){
    const banner = `mods/${slug}/modbanner.png`;
    return `
      <img class="mod-banner" src="${banner}" alt="${name} banner" onerror="this.src='${PLACEHOLDER_BANNER}'">
      <div class="mod-body">
        <h3 class="mod-title">${name}</h3>
        <p class="mod-desc">${desc}</p>
        <div class="mod-meta">
          <span class="mod-team">${team}</span>
          <div class="mod-actions"></div>
        </div>
        <div class="badges">
          ${cats.includes('featured') ? `<span class="badge">Featured</span>` : ``}
          ${cats.includes('upcoming') ? `<span class="badge">Upcoming</span>` : ``}
        </div>
      </div>`;
  }

  function renderCard(slug, meta, cats){
    const name = meta?.ModName || slug;
    const desc = meta?.["Mod Description"] || meta?.Description || "";
    const team = meta?.teamname || meta?.developer || meta?.author || "Unknown";

    const link = meta?.link || meta?.homepage || meta?.url || "";
    let el;

    if (link) {
      el = document.createElement('a');
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener';
      el.className = 'mod-card mod-card-link';
      el.setAttribute('aria-label', `${name} — open mod page`);
    } else {
      el = document.createElement('article');
      el.className = 'mod-card';
    }

    el.dataset.cats = (cats||[]).join(',');
    el.innerHTML = cardInnerHTML(slug, name, desc, team, cats);
    return el;
  }

  async function fetchMeta(slug){
    try{
      const res = await fetch(`mods/${slug}/modmetadata.json?ts=${Date.now()}`, { cache: 'no-store' });
      if(!res.ok) throw new Error('bad status');
      return await res.json();
    }catch{
      return { ModName: slug, "Mod Description": "", teamname: "Unknown" };
    }
  }

  async function load(){
    grid.setAttribute('aria-busy','true');
    (MOD_FOLDERS||[]).forEach(()=>grid.appendChild(skeleton()));
    const items = await Promise.all(
      (MOD_FOLDERS||[]).map(async ({slug, categories=[]}) => {
        const meta = await fetchMeta(slug);
        return { slug, cats: categories, meta };
      })
    );
    grid.innerHTML = '';
    items.forEach(({slug, cats, meta}) => grid.appendChild(renderCard(slug, meta, cats)));
    grid.removeAttribute('aria-busy');
    applyFilter(currentFilter);
  }

  let currentFilter = 'all';
  function applyFilter(filter){
    currentFilter = filter;
    const cards = Array.from(grid.querySelectorAll('.mod-card'));
    let visible = 0;
    cards.forEach(card => {
      const cats = (card.dataset.cats||'').split(',').filter(Boolean);
      const show = filter === 'all' ? true : cats.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    empty.hidden = visible !== 0;
    filterBtns.forEach(b => b.classList.toggle('is-active', b.dataset.filter === filter));
  }

  filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  if (Array.isArray(MOD_FOLDERS)) load();
})();