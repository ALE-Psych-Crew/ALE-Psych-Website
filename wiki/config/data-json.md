---
title: data.json Configuration
desc: Control boot flow, window settings, and save data behavior through data.json.
author: Malloy
lastUpdated: 2025-11-21
---

# data.json Configuration

ALE Psych reads `mods/<mod-name>/data.json` at launch to override engine defaults. Only define the keys your mod needs; unspecified values fall back to built-in defaults.

## Example File

Path: `mods/<mod-name>/data.json`

```json
{
  "developerMode": true,
  "mobileDebug": false,
  "scriptsHotReloading": true,
  "verbose": true,
  "allowDebugPrint": true,

  "initialState": "TitleState",
  "freeplayState": "FreeplayState",
  "storyMenuState": "StoryMenuState",
  "masterEditorState": "MasterEditorState",
  "mainMenuState": "MainMenuState",

  "pauseSubState": "PauseSubState",
  "gameOverScreen": "GameOverSubState",
  "transition": "FadeTransition",

  "loadDefaultWeeks": true,

  "title": "My ALE Psych Mod",
  "icon": "custom_icon",

  "width": 1280,
  "height": 720,

  "bpm": 120,
  "discordID": "123456789012345678",
  "modID": "my-unique-mod-id"
}
```

## Supported Keys

### Development and Debug

- **`developerMode`** (Bool, default: `false`): Enables dev tooling, hot reload, and debug helpers.
- **`mobileDebug`** (Bool, default: `false`): Requires `developerMode = true`; simulates touch controls on desktop.
- **`scriptsHotReloading`** (Bool, default: `false`): Auto-reloads Lua scripts in dev mode on desktop.
- **`verbose`** (Bool, default: `false`): Emits extra engine logs; avoid for production builds.
- **`allowDebugPrint`** (Bool, default: `true`): Sends logs to the in-game Debug Print window when present.

### Menu Flow

- **`initialState`** (String, default: `"TitleState"`): Boot entry point.
- **`freeplayState`**, **`storyMenuState`**, **`masterEditorState`**, **`mainMenuState`**: Menu and editor destinations.
- **`loadDefaultWeeks`** (Bool, default: `true`): Set to false to exclude vanilla Story/Freeplay weeks.

### Substates

- **`pauseSubState`** (String, default: `"PauseSubState"`)
- **`gameOverScreen`** (String, default: `"GameOverSubState"`)
- **`transition`** (String, default: `"FadeTransition"`): Must inherit from `MusicBeatSubstate`.

### Window and Presentation

- **`title`** (String, default: `"Friday Night Funkin': ALE Psych"`)
- **`icon`** (String, default: `"appIcon"`): PNG only; omit the extension.
- **`width`**, **`height`** (Int): Window resolution in pixels.
- **`bpm`** (Float, default: `102.0`): Default global BPM for menus and transitions.

### Integration

- **`discordID`** (String, default: `"1309982575368077416"`): Discord Rich Presence application ID.

### Save Data and Mod Identity

- **`modID`** (String, optional): Namespaces save files to `AlejoGDOfficial/ALEPsych/<modID>/` so saves remain stable even if the mod folder is renamed. Omit or set to `null` for default behavior.
