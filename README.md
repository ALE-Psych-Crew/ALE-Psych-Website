# ALE Psych Website

the github repo for the **ALE Psych [Rewritten]** engine Website, showcasing downloads, community mods, and scripting resources. The site is designed for GitHub Pages and uses only HTML, CSS, and vanilla JavaScript—no build step required.

## Contents
- **Home (`index.html`)** - Hero download links, feature carousel (`js/features.js`), and community entry points.
- **Downloads (`downloads/`)** - Direct nightly links for Windows, Android, and Linux plus release and safety notes.
- **Mods (`mods/`)** - mod gallery populated from `js/mods-data.js` with category and handling (`js/mods.js`).
- **Scripts (`scripts/`)** - Links to GitHub Topics and Discord channels for sharing Lua/HScript tooling.
- **Redirect shims** - `downloads.html`, `mods.html`, and `scripts.html` point old URLs to the new folder paths.
- **Shared assets** - Styles in `css/`, imagery and icons in `assets/`, and shared behavior in `js/`.

## Local development
The project is a plain static site. Any static server works; two easy options:

```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node.js (if installed)
npx serve
```

Then open `http://localhost:8000` (or the port reported by your server). Relative links between sections will function locally.

## Editing data-driven sections
- **Feature carousel** - Update the `FEATURES` array in `js/features.js` to change titles, descriptions, or imagery.
- **Mods gallery** - Add or edit entries in `js/mods-data.js`; each `slug` corresponds to a folder in `assets/images/mods/` and supports categories such as `featured`, `original`, `port`, `tools`, and `upcoming`.
- **Community links** - Update buttons and icons directly in the relevant HTML files; shared SVGs live in `assets/svg/`.

## Deployment
The repo is configured for GitHub Pages. Commit/PR changes to the default branch and the site will update on the next publish. No additional build or deployment steps are required.

## Contributing
1. Fork the repository and create a feature branch.
2. Make changes to the static assets or data files listed above.
3. Test locally with a simple static server.
4. Open a pull request describing what changed and any testing performed.
