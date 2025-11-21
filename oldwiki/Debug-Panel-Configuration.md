# Debug Panel Configuration

## Purpose and Load Order

The engine initializes the on-screen debug overlay each time the game boots. It always creates the default panels FPS, Conductor info, and Flixel stats, and then appends any custom panels defined in `debug.json`.

Custom debug panels are loaded using `Paths.json("debug")`, so any file located at:

```
mods/<your-mod>/debug.json
```

will override the default fallback at:

```
assets/debug.json
```

To only use the built-in panels, provide an empty `fields` array in your mod’s copy of `debug.json`.

---

## File Structure

A valid `debug.json` file contains a single top-level object with a `fields` array. Each item in the array represents one additional panel. Panels are stacked vertically underneath the default Flixel panel.

Each panel is an array of label objects. Each label uses the `DebugFieldText` structure and supports the following properties:

* **`lines`** (required):
  A list of snippets that are joined together to build the label's text. Each snippet must declare a `type`.

* **`size`** (optional `Int`, default `15`):
  Font size for the label.

* **`color`** (optional string or int):
  Label color. Can be:

  * CSS-style string (e.g. `"#FF0000"`)
  * Integer in ARGB format
  * Passed to `FlxColor.fromString()` if using a string

* **`offset`** (optional `Float`):
  Extra vertical spacing above and below the label.

---

## Supported Line Types

Each entry in the `lines` array must include a `type`. Two types are supported:

### `text`

* Inserts a static string.
* **Required key:** `value`

```json
{ "type": "text", "value": "Health: " }
```

---

### `variable`

* Dynamically resolves a value from a static class.
* Evaluates every frame, keeping the overlay in sync with the game state.
* **Required keys:**

  * `path`: Full class name (e.g., `funkin.states.PlayState`)
  * `variable`: Public static or instance field (supports dot paths)

If the class or variable doesn’t exist, the engine prints the unresolved string instead of crashing — useful for debugging path issues.

```json
{ "type": "variable", "path": "funkin.states.PlayState", "variable": "instance.health" }
```

---

## Runtime Behavior

* All debug labels are updated every frame.
* The panel stack resizes to match the longest label width.
* The overlay is toggled by pressing the key bound to **"FPS Counter"** (default: `F3`).

  * First press: FPS-only
  * Second press: full panel view
  * Third press: hidden

---

## Example `debug.json`

The example below creates a custom panel titled “Gameplay” with two dynamic labels showing the player’s health and the currently loaded song name.

Place this at `mods/<your-mod>/debug.json`:

```json
{
  "fields": [
    [
      {
        "lines": [
          { "type": "text", "value": "Gameplay" }
        ],
        "size": 18,
        "color": "#80FF80"
      },
      {
        "lines": [
          { "type": "text", "value": "Health: " },
          { "type": "variable", "path": "funkin.states.PlayState", "variable": "instance.health" }
        ]
      },
      {
        "lines": [
          { "type": "text", "value": "Song: " },
          { "type": "variable", "path": "funkin.states.PlayState", "variable": "SONG.song" }
        ],
        "offset": 6
      }
    ]
  ]
}
```

---

## Notes

* You can define as many panels as you need. Each one is an array of labels inside the `fields` list.
* The `variable` type works with any globally accessible Haxe class, including your own tools, utilities, or registries.
* Labels update in real-time, which makes this system ideal for monitoring health, difficulty, note accuracy, or any other game data.

