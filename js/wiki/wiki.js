(function() {
  const root = document.documentElement;
  const header = document.getElementById('mainHeader');
  const headerToggle = document.getElementById('headerToggle');

  const setHeaderOffset = () => {
    if (!header || !root) return;
    const headerHeight = Math.round(header.getBoundingClientRect().height);
    root.style.setProperty('--wiki-header-offset', `${headerHeight}px`);
  };

  setHeaderOffset();

  if (headerToggle) {
    headerToggle.addEventListener('click', () => {
      setTimeout(setHeaderOffset, 210);
    });
  }

  window.addEventListener('resize', setHeaderOffset);

  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated && lastUpdated.dataset.time) {
    const date = new Date(lastUpdated.dataset.time);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (!isNaN(diffDays)) {
      lastUpdated.textContent = diffDays === 0 ? 'today' : `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  }

  const sidebar = document.getElementById('wikiSidebar');
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  if (sidebar && mobileToggle) {
    const applyState = expanded => {
      sidebar.classList.toggle('collapsed', !expanded);
      mobileToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      mobileToggle.setAttribute('aria-label', expanded ? 'Hide wiki menu' : 'Show wiki menu');
    };

    const syncForViewport = () => {
      const isMobile = window.innerWidth < 980;
      if (!isMobile) {
        mobileToggle.dataset.userToggled = '';
        applyState(true);
        return;
      }

      if (!mobileToggle.dataset.userToggled) {
        applyState(false);
      }
    };

    mobileToggle.addEventListener('click', () => {
      const willExpand = sidebar.classList.contains('collapsed');
      mobileToggle.dataset.userToggled = 'true';
      applyState(willExpand);
    });

    window.addEventListener('resize', syncForViewport);
    syncForViewport();
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
