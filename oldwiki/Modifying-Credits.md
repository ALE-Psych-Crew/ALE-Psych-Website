# Modifying Credits

The credits screen in ALE Psych is data-driven. Instead of editing source code, you define credits in a `credits.json` file.

This file lives in your mod’s root directory. The engine loads it automatically if present.

---

## File Structure

Top-level object requires a `categories` array. Each category groups developers together.

```json
{
  "categories": []
}
```

---

## Categories

Each entry in `categories` defines a group of developers.

Example:

```json
{
  "name": "My Category",
  "developers": []
}
```

### Fields

* **name** `(String)`
  Label shown in the credits menu.
* **developers** `(Array)`
  List of developer entries inside this category.

---

## Developers (Members)

Each developer entry is an object inside `developers`.

Example:

```json
{
  "name": "My Member",
  "icon": "memberIcon",
  "link": "https://example.com/",
  "description": "Collaborated on my mod as a coder",
  "color": "00FFFF"
}
```

### Fields

* **name** `(String)`
  Developer’s display name.
* **icon** `(String)`
  PNG filename (no extension) stored in `images/credits/`.
* **link** `(String)`
  URL opened when the developer is selected.
* **description** `(String)`
  Role or contribution description. Supports newlines (`\n`).
* **color** `(Hex String)`
  Background color applied when selected. Must be a 6-digit hex string without `#`.

---

## Example File

A short verision of the complete `credits.json` with multiple categories and members:

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

---

## Developer Notes

* Use consistent icon sizes (recommended 128x128 PNG) for best visual results.
* Missing icons cause the credits to fallback to a blank space.
* Always validate JSON formatting. A single error will prevent the credits from loading.
* Keep role descriptions concise. Long text wraps, but readability suffers.