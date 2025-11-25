(() => {
  const MOBILE_BREAKPOINT = 720;
  const header = document.getElementById('mainHeader');
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('headerToggle');

  if (!header || !nav || !toggle) return;

  const setExpanded = expanded => {
    if (expanded) {
      header.classList.add('nav-open');
      header.classList.remove('nav-collapsed');
    } else {
      header.classList.remove('nav-open');
      header.classList.add('nav-collapsed');
    }
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  const syncForViewport = () => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    header.classList.toggle('nav-collapsible', isMobile);
    if (!isMobile) {
      header.classList.remove('nav-collapsed');
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      nav.style.removeProperty('max-height');
      return;
    }
    if (!header.classList.contains('nav-open')) {
      setExpanded(false);
    }
  };

  toggle.addEventListener('click', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    const isOpen = header.classList.toggle('nav-open');
    header.classList.toggle('nav-collapsed', !isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  window.addEventListener('resize', syncForViewport);
  syncForViewport();
})();
