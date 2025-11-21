---
title: credits.json
desc: Build data-driven credits screens by listing categories and developers.
author: Malloy
lastUpdated: 2025-11-21
---

The credits screen is data-driven. Provide a `credits.json` in your mod root and ALE Psych will load it automatically.

## File Structure

Top-level object with a `categories` array. Each category groups developers.

```json
{
  "categories": []
}
```

### Categories

Each category object defines a group:

```json
{
  "name": "My Category",
  "developers": []
}
```

- **`name`**: Label shown in the credits menu.
- **`developers`**: Array of developer entries.

### Developers

Each developer entry is an object inside `developers`:

```json
{
  "name": "My Member",
  "icon": "memberIcon",
  "link": "https://example.com/",
  "description": "Collaborated on my mod as a coder",
  "color": "00FFFF"
}
```

- **`name`**: Display name.
- **`icon`**: PNG filename (no extension) stored in `images/credits/`.
- **`link`**: URL opened when selected.
- **`description`**: Role or contribution. Supports newlines (`\n`).
- **`color`**: 6-digit hex string without `#` for background when selected.

## Example File

```json
{
  "categories": [
    {
      "name": "ALE Psych Crew",
      "developers": [
        {
          "name": "AlejoGDOfficial",
          "icon": "alejo",
          "link": "https://www.youtube.com/@alejogdofficial",
          "description": "Director and Lead Programmer",
          "color": "5457B0"
        },
        {
          "name": "Kriptel",
          "icon": "kriptel",
          "link": "https://www.youtube.com/@kriptel_pro",
          "description": "Collaborated on the Implementation of RuleScript\nProgrammed some Macros",
          "color": "731D1D"
        }
      ]
    },
    {
      "name": "Funkin' Crew",
      "developers": [
        {
          "name": "ninjamuffin99",
          "icon": "ninjamuffin99",
          "link": "https://twitter.com/ninja_muffin99",
          "description": "Programmer of Friday Night Funkin'",
          "color": "CF2D2D"
        },
        {
          "name": "PhantomArcade",
          "icon": "phantomarcade",
          "link": "https://twitter.com/PhantomArcade3K",
          "description": "Animator of Friday Night Funkin'",
          "color": "FADC45"
        }
      ]
    }
  ]
}
```

## Developer Notes

- Use consistent icon sizes (recommend 128x128 PNG) for best results.
- Missing icons leave blank space.
- Validate JSON formatting; errors prevent credits from loading.
- Keep descriptions concise for readability.
