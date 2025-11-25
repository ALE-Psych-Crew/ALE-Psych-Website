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
const WIKI_JSON = path.join(SRC_DIR, 'wiki.json');

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
      return Remarkable.prototype.renderToken
        ? Remarkable.prototype.renderToken.call(this, tokens, idx, ...rest)
        : `<h${tokens[idx].hLevel}>`;
    };
  }
  return md;
}

function renderMarkdown(mdInstance, content) {
  const html = mdInstance.render(content);
  return fixHtmlRefs(html);
}

function findMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function humanize(str) {
  return str.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function readPage(mdPath) {
  const raw = fs.readFileSync(mdPath, 'utf8');
  const parsed = (matter.default || matter)(raw);
  const data = parsed.data || {};
  const content = parsed.content || '';
  const slug = fixPath(path.relative(SRC_DIR, mdPath)).replace(/\.md$/i, '');
  const title = data.title || humanize(path.basename(slug));
  const desc = data.desc || title;
  return {
    mdPath,
    htmlPath: path.join(OUT_DIR, `${slug}.html`),
    slug,
    title,
    desc,
    author: data.author || 'ALE Psych Crew',
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    content,
    giscusID: data.giscusID || slug
  };
}

function buildSidebarTree(pages) {
  const root = { children: [] };
  const ensureNode = (parent, name) => {
    let node = parent.children.find(c => c.name === name);
    if (!node) {
      node = { name, title: humanize(name), slug: null, children: [] };
      parent.children.push(node);
    }
    return node;
  };

  pages.forEach(page => {
    const parts = page.slug.split('/');
    let current = root;
    parts.forEach((part, idx) => {
      current = ensureNode(current, part);
      if (idx === parts.length - 1) {
        current.slug = page.slug;
        current.title = page.title;
      }
    });
  });

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.slug === 'index') return -1;
      if (b.slug === 'index') return 1;
      return a.title.localeCompare(b.title);
    });
    nodes.forEach(node => sortNodes(node.children));
  };

  sortNodes(root.children);
  return root.children;
}

function buildSidebar(nodes, activeSlug, basePrefix) {
  const walk = (items) => {
    let html = '<ul class="wiki-nav">';
    for (const item of items) {
      const hasPage = Boolean(item.slug);
      const url = hasPage ? (item.slug === 'index' ? `${basePrefix}wiki/` : `${basePrefix}wiki/${fixPath(item.slug)}.html`) : '#';
      const isActive = hasPage && item.slug === activeSlug;
      const label = item.title || humanize(item.name);
      html += '<li>';
      if (hasPage) {
        html += `<a href="${url}"${isActive ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
      } else {
        html += `<span class="wiki-nav-label">${label}</span>`;
      }
      if (item.children && item.children.length) {
        html += '<ul>';
        html += walk(item.children).replace('<ul class="wiki-nav">', '').replace(/<\/ul>$/, '');
        html += '</ul>';
      }
      html += '</li>';
    }
    html += '</ul>';
    return html;
  };
  return walk(nodes);
}

function buildPage(page, sidebarTree) {
  const md = prepareMarkdown();
  const htmlContent = renderMarkdown(md, page.content);
  const depth = page.slug.split('/').length - 1;
  const basePrefix = '../'.repeat(depth + 1);
  const sidebar = buildSidebar(sidebarTree, page.slug, basePrefix);
  const canonicalPath = page.slug === 'index' ? 'wiki/' : `wiki/${fixPath(page.slug)}.html`;
  const canonical = `https://ale-psych-crew.github.io/ALE-Psych-Website/${canonicalPath}`;
  const socialImage = 'https://files.catbox.moe/6jqidi.png';
  const socialAlt = `ALE Psych [Rewritten] - ${page.title}`;

  const filled = parseTemplate(template, {
    title: page.title,
    pageTitle: `${page.title} - ALE Psych Wiki`,
    desc: page.desc,
    canonical,
    socialImage,
    socialAlt,
    author: page.author,
    lastUpdated: page.lastUpdated,
    content: htmlContent,
    sidebar,
    url: fixPath(page.slug),
    base: basePrefix,
    giscusID: page.giscusID,
    isoDate,
    shortDate
  });

  const shell = parseHtml(filled);
  ensureDir(page.htmlPath);
  fs.writeFileSync(page.htmlPath, htmlToString(shell));
  console.log(`Built ${page.htmlPath}`);
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

function writeWikiJson(pages) {
  const entries = pages.map(page => ({
    source: fixPath(path.relative(ROOT, page.mdPath)),
    html: fixPath(path.relative(ROOT, page.htmlPath)),
    slug: fixPath(page.slug),
    title: page.title,
    lastUpdated: isoDate(page.lastUpdated)
  }));
  fs.writeFileSync(WIKI_JSON, JSON.stringify(entries, null, 2));
  console.log(`Wrote ${WIKI_JSON}`);
}

function main() {
  const mdFiles = findMarkdownFiles(SRC_DIR);
  const pages = mdFiles.map(readPage).sort((a, b) => {
    if (a.slug === 'index') return -1;
    if (b.slug === 'index') return 1;
    return a.slug.localeCompare(b.slug);
  });

  writeWikiJson(pages);

  const sidebarTree = buildSidebarTree(pages);
  pages.forEach(page => buildPage(page, sidebarTree));
  copyMedia();
}

main();
