# ALE Psych Keyboard Shortcuts

ALE Psych includes built-in keyboard shortcuts for development, debugging, and editor tools. These shortcuts are **context-sensitive** and some require developer mode to function.

You can rebind these keys through `ClientPrefs.controls`, `Controls.json`, or the Options Menu, but the logic behind them stays the same.

----------

## Shortcut List

### `Ctrl + Shift + M`

**Context:** Any state except during gameplay  
**Action:** Opens the Mods Menu  
**Notes:** Lets you swap between installed mods without restarting. Disabled if you're currently in gameplay or using a stripped mod build.

----------

### `Ctrl + Shift + N`

**Context:** Any state except during gameplay  
**Action:** Fully resets the engine  
**Notes:** Returns the game to the initial state defined in `data.json`. Clears scripts, tweens, audio, Discord RPC, and reloads the game loop.

----------

### `F2` (Windows only)

**Context:** Anywhere  
**Action:** Opens the native Windows console  
**Notes:** Useful for real-time debugging. Console stays open until the game exits.

----------

### `F3`

**Context:** Anywhere  
**Action:** Cycles the debug overlay  
**Notes:** Switches between FPS-only, full debug stats, or hiding the overlay entirely. Uses data from `assets/data/debug.json`.

----------

### `7` (in Gameplay, developer mode only)

**Context:** During gameplay  
**Action:** Opens the Chart Editor  
**Notes:** Only works when not paused or in cutscenes. Developer mode must be enabled.

----------

### `8` (in Gameplay, developer mode only)

**Context:** During gameplay  
**Action:** Opens the Character Editor  
**Notes:** Shares the same restrictions as the Chart Editor.

----------

### `7` (in Main Menu, developer mode only)

**Context:** Main Menu  
**Action:** Opens the Master Editor state  
**Notes:** Loads the state defined in `data.json` as `masterEditorState`.

----------

### `R` or `F5`

**Context:** During gameplay  
**Action:** Restarts the current song  
**Notes:** In developer mode, reloads instantly. Otherwise, triggers a normal fail + retry sequence depending on settings.

----------

## Keybinds

If you've remapped any of these actions in `controls.json` or Options Menu, they'll still trigger the same logic, just with your custom keys instead of the defaults listed above.
