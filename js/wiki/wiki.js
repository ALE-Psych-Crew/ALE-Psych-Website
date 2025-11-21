(function() {
  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated && lastUpdated.dataset.time) {
    const date = new Date(lastUpdated.dataset.time);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (!isNaN(diffDays)) {
      lastUpdated.textContent = diffDays === 0 ? 'today' : `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  }

  const sidebar = document.querySelector('.wiki-sidebar');
  const toggle = document.getElementById('sidebarToggle');
  if (sidebar && toggle) {
    const update = () => {
      const shouldCollapse = window.innerWidth < 900;
      sidebar.classList.toggle('collapsed', shouldCollapse && sidebar.classList.contains('collapsed'));
      toggle.setAttribute('aria-expanded', !sidebar.classList.contains('collapsed'));
    };

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', !sidebar.classList.contains('collapsed'));
    });

    window.addEventListener('resize', update);
    update();
  }
})();
