---
title: options.json
desc: Define custom option categories and settings for the ALE Psych Options menu.
author: Malloy
lastUpdated: 2025-11-21
---

# options.json

Use `options.json` to add buttons, sliders, and menus to the Options screen without editing engine code.

## File Location

Place the file at:

```
mods/<YourModFolder>/options.json
```

If you want base settings plus your additions, copy `assets/options.json` into your mod and extend it.

## File Structure

`options.json` is organized by categories. Each category contains a list of options.

```json
{
  "categories": [
    {
      "name": "Menu Title",
      "options": [ { "name": "Setting Name", ... } ]
    }
  ]
}
```

### Category Fields

- `name`: Title shown in the menu.
- `options`: Array of option entries.

### Common Option Fields

- `name`: Display name.
- `description`: Text shown at the bottom when selected.
- `type`: Option type.
- `initialValue`: Default value.
- `platform` (optional): Restrict to `"desktop"` or `"mobile"`.

## Option Types

### On/Off Toggle (`bool`)

```json
{ "type": "bool", "variable": "flashWarning", "initialValue": false }
```

### Whole Number Slider (`integer`)

```json
{ "type": "integer", "variable": "framerate", "min": 30, "max": 240, "change": 1, "initialValue": 60 }
```

### Decimal Slider (`float`)

```json
{ "type": "float", "variable": "noteScale", "min": 0.5, "max": 1.5, "change": 0.05, "decimals": 2, "initialValue": 1.0 }
```

### Choose from a List (`string`)

```json
{ "type": "string", "variable": "laneColor", "strings": ["Classic", "Pastel", "Contrast"], "initialValue": "Classic" }
```

### Open a New Menu (`state` or `substate`)

```json
{ "type": "state", "path": "PracticeMenuState", "scripted": true }
```

```json
{ "type": "substate", "path": "GraphicsPresetSubState", "scripted": false, "platform": "desktop" }
```

- Use `scripted: true` to load a script file from your mod.
- Use `scripted: false` to load a menu implemented in Haxe.

## Troubleshooting

- **Setting does not appear:** Confirm the file has a `categories` array and each option includes the required fields.
- **Value does nothing:** Your code must read and apply the setting; the engine does not automatically wire behavior.
- **Wrong platform:** Use lowercase `"desktop"` or `"mobile"`.

## Full Example

```json
{
    "categories": [
        {
            "name": "Miscellaneous",
            "options": [
                {
                    "name": "Controls",
                    "description": "Adjust the delay for the game audio.",
                    "type": "substate",
                    "path": "ControlsSubState",
                    "platform": "desktop",
                    "scripted": true
                },
                {
                    "name": "Note Offset",
                    "description": "Adjust the delay for the game audio.",
                    "type": "state",
                    "path": "NoteOffsetState",
                    "scripted": true
                },
                {
                    "name": "Reset Options",
                    "description": "Restore Default Settings",
                    "type": "substate",
                    "path": "ResetOptionsSubState",
                    "scripted": true
                }
            ]
        },
        {
            "name": "Graphics",
            "options": [
                {
                    "name": "Low Quality",
                    "description": "If checked, disables some background details, decreases loading times and improves performance.",
                    "variable": "lowQuality",
                    "type": "bool",
                    "initialValue": false
                },
                {
                    "name": "Anti-Aliasing",
                    "description": "If unchecked, disables anti-aliasing, increases performance at the cost of sharper visuals.",
                    "variable": "antialiasing",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "Shaders",
                    "description": "If unchecked, disables shaders. It's used for some visual effects, and also CPU intensive for weaker PCs.",
                    "variable": "shaders",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "GPU Caching",
                    "description": "If checked, allows the GPU to be used for caching textures, decreasing RAM usage. Don't turn this on if you have a low-end graphics card.",
                    "variable": "cacheOnGPU",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "Framerate",
                    "description": "Pretty self explanatory, isn't it?",
                    "variable": "framerate",
                    "type": "integer",
                    "min": 30,
                    "max": 240,
                    "change": 1,
                    "initialValue": 60
                }
            ]
        },
        {
            "name": "Visuals and UI",
            "options": [
                {
                    "name": "Note Splash Opacity",
                    "description": "How much transparent should the Note Splashes be.",
                    "variable": "splashAlpha",
                    "type": "integer",
                    "min": 0,
                    "max": 100,
                    "change": 1,
                    "initialValue": 60
                },
                {
                    "name": "Flashing Lights",
                    "description": "Uncheck this if you're sensitive to flashing lights!",
                    "variable": "flashing",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "Check for Updates",
                    "description": "Turn this on to check for updates when you start the game.",
                    "variable": "checkForUpdates",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "Discord Rich Presence",
                    "description": "Uncheck this to prevent accidental leaks; it hides the application from your playing status on Discord.",
                    "variable": "discordRPC",
                    "type": "bool",
                    "initialValue": true
                }
            ]
        },
        {
            "name": "Gameplay",
            "options": [
                {
                    "name": "Downscroll",
                    "description": "If checked, notes go down instead of up.",
                    "variable": "downScroll",
                    "type": "bool",
                    "initialValue": false
                },
                {
                    "name": "Ghost Tapping",
                    "description": "If checked, you won't get misses from pressing keys while there are no notes able to hit.",
                    "variable": "ghostTapping",
                    "type": "bool",
                    "initialValue": true
                },
                {
                    "name": "Disable Reset Button",
                    "description": "If checked, pressing Reset won't do anything.",
                    "variable": "noReset",
                    "type": "bool",
                    "initialValue": false
                },
                {
                    "name": "Botplay",
                    "description": "If checked, the game will play itself; scores are not saved and the player can still fail if logic allows it.",
                    "variable": "botplay",
                    "type": "bool",
                    "initialValue": false
                },
                {
                    "name": "Practice Mode",
                    "description": "If checked, the game disables dying; scores are not saved.",
                    "variable": "practice",
                    "type": "bool",
                    "initialValue": false
                }
            ]
        }
    ]
}
```
