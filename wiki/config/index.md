---
title: Configuration Overview
desc: Entry point for runtime configuration files used by ALE Psych mods.
author: Malloy
lastUpdated: 2025-11-21
---

ALE Psych reads several JSON files from a mod folder to control boot flow, options, credits, and debugging overlays. These pages summarize each file format and how the engine consumes them.

## Key Files

- `data.json` for boot states, window defaults, and save namespaces.
- `options.json` for custom option categories and settings.
- `credits.json` for building the credits menu without changing source code.
- `debug.json` for adding debug overlay panels.

Load the files from your active mod folder to override the defaults in `assets/`.
