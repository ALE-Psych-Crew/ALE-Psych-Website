# Mod Options Guide

This guide explains how to make your own settings using a file called `options.json`. You can add buttons, sliders, or menus to the Options screen without changing any engine code.

---

## Where to Put Your File

Save your `options.json` in this folder:

```
mods/<YourModFolder>/options.json
```

If your mod is active, the game will use your version instead of the one in the base game. If you still want the default settings, copy the `assets/options.json` file and add your stuff to it.

---

## What the File Looks Like

Your file is made of "categories," and each category has a list of settings.

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

### Making a Category

A category is like a section in the settings menu. It needs:

* `name`: The title shown in the menu
* `options`: The settings in that category

Example:

```json
{
  "name": "Audio",
  "options": [
    {
      "name": "Music",
      "description": "Turn music on or off",
      "type": "bool",
      "variable": "musicOn",
      "initialValue": true
    }
  ]
}
```

---

## Types of Settings

All settings need:

* `name`: What it's called
* `description`: Shows at the bottom when you pick it
* `type`: What kind of setting it is
* `initialValue`: What the setting starts as
* `platform`: (optional) Only shows on "desktop" or "mobile"

### On/Off Toggle (`bool`)

```json
{
  "type": "bool",
  "variable": "flashWarning",
  "initialValue": false
}
```

### Whole Number Slider (`integer`)

```json
{
  "type": "integer",
  "variable": "framerate",
  "min": 30,
  "max": 240,
  "change": 1,
  "initialValue": 60
}
```

### Decimal Slider (`float`)

```json
{
  "type": "float",
  "variable": "noteScale",
  "min": 0.5,
  "max": 1.5,
  "change": 0.05,
  "decimals": 2,
  "initialValue": 1.0
}
```

### Choose from a List (`string`)

```json
{
  "type": "string",
  "variable": "laneColor",
  "strings": ["Classic", "Pastel", "Contrast"],
  "initialValue": "Classic"
}
```

### Open a New Menu (`state` or `substate`)

```json
{
  "type": "state",
  "path": "PracticeMenuState",
  "scripted": true
}
```

```json
{
  "type": "substate",
  "path": "GraphicsPresetSubState",
  "scripted": false,
  "platform": "desktop"
}
```

* Use `scripted: true` to load a script file from your mod.
* Use `scripted: false` to load a menu made with Haxe.

---

## Fixing Problems

* **Setting doesn’t show up?**

  * Make sure your file has a `categories` array and each option has all the needed info.

* **Value doesn’t do anything?**

  * Your code must **read the setting and use it**. The game won’t do that for you.

* **Wrong platform?**

  * The platform must be written as `"desktop"` or `"mobile"`, all lowercase.

---

## Full Example File

Here’s a complete working file you can use as a base:

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
                    "description": "If checked, allows the GPU to be used for caching textures, decreasing RAM usage. Don't turn this on if you have a shitty Graphics Card.",
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
                    "description": "Uncheck this to prevent accidental leaks, it will hide the Application from your \"Playing\" box on Discord.",
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
                    "description": "If checked, notes go Down instead of Up, simple enough.",
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
                    "description": "If checked, the game will basically play itself (This will not prevent the player from dying and will not save the score).",
                    "variable": "botplay",
                    "type": "bool",
                    "initialValue": false
                },
                {
                    "name": "Practice Mode",
                    "description": "If checked, the game will disable the possibility of dying (This will not save your score).",
                    "variable": "practice",
                    "type": "bool",
                    "initialValue": false
                }
            ]
        }
    ]
}
```
