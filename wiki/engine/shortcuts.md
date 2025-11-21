---
title: Engine Shortcuts
desc: Keyboard shortcuts for development, debugging, and editor tools.
author: Malloy
lastUpdated: 2025-11-21
---

ALE Psych includes context-sensitive keyboard shortcuts. Many require developer mode, and all can be rebound through `ClientPrefs.controls`, `Controls.json`, or the Options menu.

## Shortcut List

### `Ctrl + Shift + M`

- **Context:** Any state except during gameplay
- **Action:** Opens the Mods Menu
- **Notes:** Swap installed mods without restarting. Disabled in gameplay or stripped builds.

### `Ctrl + Shift + N`

- **Context:** Any state except during gameplay
- **Action:** Fully resets the engine
- **Notes:** Returns the game to the `initialState` from `data.json`; clears scripts, tweens, audio, Discord RPC, and reloads the game loop.

### `F2` (Windows only)

- **Context:** Anywhere
- **Action:** Opens the native Windows console
- **Notes:** Useful for real-time debugging. The console stays open until exit.

### `F3`

- **Context:** Anywhere
- **Action:** Cycles the debug overlay
- **Notes:** Toggles FPS-only, full debug stats, or hidden using `assets/data/debug.json`.

### `7` (in Gameplay, developer mode only)

- **Context:** During gameplay
- **Action:** Opens the Chart Editor
- **Notes:** Only when not paused or in cutscenes; developer mode must be enabled.

### `8` (in Gameplay, developer mode only)

- **Context:** During gameplay
- **Action:** Opens the Character Editor
- **Notes:** Shares the same restrictions as the Chart Editor.

### `7` (in Main Menu, developer mode only)

- **Context:** Main Menu
- **Action:** Opens the Master Editor state
- **Notes:** Loads the state defined in `data.json` as `masterEditorState`.

### `R` or `F5`

- **Context:** During gameplay
- **Action:** Restarts the current song
- **Notes:** Instant reload in developer mode; otherwise follows normal fail and retry behavior.

## Keybinds

If you remap these actions, they still trigger the same logic; only the keys change.
