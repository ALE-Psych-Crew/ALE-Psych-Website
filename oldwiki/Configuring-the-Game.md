# Configuring the Game – `data.json`

ALE Psych supports runtime configuration via a `data.json` file located in the root of your mod folder:

```
mods/<mod-name>/data.json
```

This file is read at launch and overrides several engine-level defaults. It allows mods to control boot states, UI flow, debug behavior, save data, and window configuration **without modifying the engine source code**.

Keys you don’t define will fall back to their internal defaults. To reduce breakage across engine updates, only define what your mod needs.

---

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

---

## Supported Keys

### Development and Debug

These options control editor tools, hot-reloading, and debug output.

* **`developerMode`** `(Bool, default: false)`
  Enables developer tooling:

  * In-game editors and editor shortcuts
  * Hot reload systems
  * Debug helpers

* **`mobileDebug`** `(Bool, default: false)`
  Requires `developerMode = true`.
  Simulates touch controls on desktop for mobile UI testing.

* **`scriptsHotReloading`** `(Bool, default: false)`
  Reloads Lua scripts automatically during dev mode. Desktop only.

* **`verbose`** `(Bool, default: false)`
  Outputs extra engine-level logs. Not recommended for production builds.

* **`allowDebugPrint`** `(Bool, default: true)`
  Sends logs to the in-game **Debug Print** window if present.

---

### Menu Flow

Controls which state classes the engine uses for menus and transitions.

* **`initialState`** `(String, default: "TitleState")`
  Boot entry point.

* **`freeplayState`**, **`storyMenuState`**, **`masterEditorState`**, **`mainMenuState`**
  Menu destinations and editor navigation handlers.

* **`loadDefaultWeeks`** `(Bool, default: true)`
  If false, vanilla Story/Freeplay weeks are excluded. Use for full conversions.

---

### Substates

Define in-game behaviors like pause menus, game over screens, and transitions.

* **`pauseSubState`** `(String, default: "PauseSubState")`
* **`gameOverScreen`** `(String, default: "GameOverSubState")`
* **`transition`** `(String, default: "FadeTransition")`
  Must inherit from `MusicBeatSubstate`.

---

### Window and Presentation

Controls how the game window appears and functions.

* **`title`** `(String, default: "Friday Night Funkin': ALE Psych")`

* **`icon`** `(String, default: "appIcon")`
  PNG only. Do not include extension in the config.

* **`width`**, **`height`** `(Int)`
  Set window resolution in pixels.

* **`bpm`** `(Float, default: 102.0)`
  Default global BPM (menus, transitions, etc.)

---

### Integration

* **`discordID`** `(String, default: "1309982575368077416")`
  Used for Discord Rich Presence.

---

### Save Data and Mod Identity

* **`modID` (NEW)** `(String, optional)`
  Unique identifier for your mod, used to namespace save files.

  **Purpose**:
  When `modID` is set, save data is stored in:

  ```
  AlejoGDOfficial/ALEPsych/<modID>/
  ```

  instead of relying solely on the mod folder name.

  **Benefits**:

  * Keeps saves stable even if users rename the mod folder
  * Allows unique save spaces for standalone builds (no mods folder needed)
  * Prevents save conflicts between different mods

  **Usage**:
  Add this key alongside others like `title` or `discordID`:

  ```json
  "modID": "your-unique-identifier"
  ```

  Leave it out or set to `null` if you don’t need isolated saves or want the default save path behavior.