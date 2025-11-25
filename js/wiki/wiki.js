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

  const enhanceCodeBlocks = () => {
    const blocks = document.querySelectorAll('.wiki-article pre > code');
    blocks.forEach(code => {
      const pre = code.parentElement;
      if (!pre || pre.dataset.enhanced === 'true') return;

      const wrapper = document.createElement('div');
      wrapper.className = 'wiki-code-block';
      pre.dataset.enhanced = 'true';

      const langClass = Array.from(code.classList || []).find(cls => cls.startsWith('language-'));
      const language = langClass ? langClass.replace('language-', '').toUpperCase() : 'TEXT';

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const label = document.createElement('span');
      label.className = 'code-language';
      label.textContent = language;
      label.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(label);

      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'copy-code';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');

      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          copyButton.textContent = 'Copied!';
        } catch (err) {
          copyButton.textContent = 'Error';
        } finally {
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 1400);
        }
      });

      wrapper.appendChild(copyButton);
    });
  };

  enhanceCodeBlocks();
})();
