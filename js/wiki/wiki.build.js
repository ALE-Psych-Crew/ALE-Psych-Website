const fs = require('fs');
const path = require('path');

function loadMatter() {
  try {
    return require('gray-matter');
  } catch (err) {
    return {
      default: function(str) {
        const lines = str.split(/\r?\n/);
        if (lines[0] !== '---') return { data: {}, content: str };
        let dataLines = [];
        let i = 1;
        for (; i < lines.length; i++) {
          if (lines[i] === '---') break;
          dataLines.push(lines[i]);
        }
        const data = {};
        dataLines.forEach(line => {
          const [key, ...rest] = line.split(':');
          if (!key) return;
          data[key.trim()] = rest.join(':').trim();
        });
        const content = lines.slice(i + 1).join('\n');
        return { data, content };
      }
    };
  }
}

function loadRemarkable() {
  try {
    return require('remarkable');
  } catch (err) {
    class Remarkable {
      constructor() {}
      render(md) {
        const lines = md.split(/\r?\n/);
        let html = '';
        let inCode = false;
        let inList = false;
        let codeBuffer = [];
        lines.forEach(line => {
          if (line.startsWith('```')) {
            if (inCode) {
              html += `<pre><code>${codeBuffer.join('\n')}</code></pre>`;
              codeBuffer = [];
              inCode = false;
            } else {
              inCode = true;
            }
            return;
          }
          if (inCode) {
            codeBuffer.push(line);
            return;
          }
          const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
          if (headingMatch) {
            if (inList) {
              html += '</ul>';
              inList = false;
            }
            const level = headingMatch[1].length;
            const text = headingMatch[2];
            const id = slugify(text);
            html += `<h${level} id="${id}">${escapeHtml(text)}</h${level}>`;
            return;
          }
          if (line.trim().startsWith('- ')) {
            if (!inList) {
              html += '<ul>';
              inList = true;
            }
            html += `<li>${escapeHtml(line.trim().slice(2))}</li>`;
            return;
          }
          if (line.trim() === '') {
            if (inList) {
              html += '</ul>';
              inList = false;
            }
            return;
          }
          if (inList) {
            html += '</ul>';
            inList = false;
          }
          html += `<p>${convertInline(line)}</p>`;
        });
        if (inList) html += '</ul>';
        return html;
      }
    }
    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function convertInline(line) {
      return escapeHtml(line)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    }
    return { Remarkable };
  }
}

const matter = loadMatter();
const { Remarkable } = loadRemarkable();

const ROOT = path.resolve(__dirname, '..', '..');
const SRC_DIR = path.join(ROOT, 'wiki');
const OUT_DIR = path.join(ROOT, 'wiki');
const TEMPLATE_PATH = path.join(__dirname, 'wiki.html');

const wikiTree = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'wiki.json'), 'utf8'));
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

function fixPath(p) {
  return p.replace(/\\/g, '/');
}

function fixHtmlRefs(html) {
  return html.replace(/href="([^":#][^"\s]*?)\.md(#[^"]*)?"/g, (_match, link, hash = '') => {
    return `href="${link}.html${hash}"`;
  });
}

function parseTemplate(str, data) {
  return str.replace(/{{\s*([^}]+)\s*}}/g, (_match, expr) => {
    const parts = expr.trim().split(/\s+/);
    const key = parts[0];
    if (typeof data[key] === 'function') {
      const args = parts.slice(1).map(p => data[p] ?? p);
      return data[key](...args);
    }
    return data[key] !== undefined ? data[key] : '';
  });
}

function parseHtml(html) {
  return { toString: () => html };
}

function htmlToString(obj) {
  return typeof obj === 'string' ? obj : obj.toString();
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function buildSidebar(nodes, activeSlug, basePrefix) {
  const walk = (items) => {
    let html = '<ul class="wiki-nav">';
    for (const item of items) {
      const [slug, label, children] = item;
      const isActive = slug === activeSlug;
      const url = slug === 'index' ? `${basePrefix}wiki/` : `${basePrefix}wiki/${fixPath(slug)}.html`;
      html += `<li><a href="${url}"${isActive ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
      if (Array.isArray(children)) {
        html += '<ul>';
        html += walk(children).replace('<ul class="wiki-nav">', '').replace(/<\/ul>$/, '');
        html += '</ul>';
      }
      html += '</li>';
    }
    html += '</ul>';
    return html;
  };
  return walk(nodes);
}

function renderMarkdown(mdInstance, content) {
  const html = mdInstance.render(content);
  return fixHtmlRefs(html);
}

function isoDate(value) {
  const d = new Date(value);
  return !isNaN(d) ? d.toISOString() : '';
}

function shortDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function prepareMarkdown() {
  const md = new Remarkable('commonmark', { html: true, breaks: true });
  if (md.renderer && md.renderer.rules) {
    const headingOpen = md.renderer.rules.heading_open;
    md.renderer.rules.heading_open = function(tokens, idx, ...rest) {
      const title = tokens[idx + 1]?.content || '';
      tokens[idx].attrs = tokens[idx].attrs || [];
      tokens[idx].attrs.push(['id', slugify(title)]);
      if (headingOpen) {
        return headingOpen.call(this, tokens, idx, ...rest);
      }
      return Remarkable.prototype.renderToken ? Remarkable.prototype.renderToken.call(this, tokens, idx, ...rest) : `<h${tokens[idx].hLevel}>`;
    };
  }
  return md;
}

function buildPage(slug) {
  const mdPath = path.join(SRC_DIR, `${slug}.md`);
  const raw = fs.readFileSync(mdPath, 'utf8');
  const parsed = (matter.default || matter)(raw);
  const data = parsed.data || {};
  const content = parsed.content || '';

  const md = prepareMarkdown();
  const htmlContent = renderMarkdown(md, content);

  const depth = slug.split('/').length;
  const basePrefix = '../'.repeat(depth);

  const sidebar = buildSidebar(wikiTree, slug, basePrefix);
  const baseTitle = data.title || 'Untitled';
  const pageTitle = `${baseTitle} - ALE Psych Wiki`;
  const desc = data.desc || baseTitle;
  const canonicalPath = slug === 'index' ? 'wiki/' : `wiki/${fixPath(slug)}.html`;
  const canonical = `https://ale-psych-crew.github.io/ALE-Psych-Website/${canonicalPath}`;
  const socialImage = 'https://files.catbox.moe/6jqidi.png';
  const socialAlt = `ALE Psych [Rewritten] - ${baseTitle}`;

  const filled = parseTemplate(template, {
    title: baseTitle,
    pageTitle,
    desc,
    canonical,
    socialImage,
    socialAlt,
    author: data.author || 'ALE Psych Crew',
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    content: htmlContent,
    sidebar,
    url: fixPath(slug),
    base: basePrefix,
    giscusID: data.giscusID || slug,
    isoDate,
    shortDate
  });

  const shell = parseHtml(filled);
  const outPath = path.join(OUT_DIR, `${slug}.html`);
  ensureDir(outPath);
  fs.writeFileSync(outPath, htmlToString(shell));
  console.log(`Built ${outPath}`);
}

function copyMedia() {
  const mediaSrc = path.join(SRC_DIR, 'media');
  const mediaDest = path.join(OUT_DIR, 'media');
  if (!fs.existsSync(mediaSrc)) return;
  fs.mkdirSync(mediaDest, { recursive: true });
  const entries = fs.readdirSync(mediaSrc, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(mediaSrc, entry.name);
    const destPath = path.join(mediaDest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function collectSlugs(nodes) {
  let slugs = [];
  for (const item of nodes) {
    const [slug, _label, children] = item;
    slugs.push(slug);
    if (Array.isArray(children)) slugs = slugs.concat(collectSlugs(children));
  }
  return slugs;
}

function main() {
  const slugs = collectSlugs(wikiTree);
  slugs.forEach(buildPage);
  copyMedia();
}

main();
