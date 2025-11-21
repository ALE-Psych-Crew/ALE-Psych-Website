---
title: debug.json
desc: Configure on-screen debug panels and labels through debug.json.
author: Malloy
lastUpdated: 2025-11-21
---

The engine initializes its debug overlay on boot. It always shows built-in FPS, Conductor info, and Flixel stats, then appends any panels defined in `debug.json`.

## Load Order

Place a custom file at `mods/<your-mod>/debug.json` to override the fallback at `assets/debug.json`. To disable all custom panels but keep defaults, set an empty `fields` array.

## File Structure

`debug.json` contains a top-level object with a `fields` array. Each entry is a panel represented as an array of label objects stacked vertically.

Label objects support:

- `lines` (required): Array of snippets joined to form the label text; each snippet declares a `type`.
- `size` (optional, Int, default `15`): Font size.
- `color` (optional, string or int): CSS-style string (e.g. `"#FF0000"`) or ARGB integer.
- `offset` (optional, Float): Extra vertical spacing above and below the label.

## Supported Line Types

### `text`

- Inserts a static string.
- Requires `value`.

```json
{ "type": "text", "value": "Health: " }
```

### `variable`

- Resolves a value from a static class every frame.
- Requires `path` (full class name) and `variable` (public static or instance field; dot paths allowed).
- If the class or variable does not exist, the unresolved string is printed for debugging instead of crashing.

```json
{ "type": "variable", "path": "funkin.states.PlayState", "variable": "instance.health" }
```

## Runtime Behavior

- Debug labels update every frame and the stack resizes to the longest label width.
- Toggle the overlay with the key bound to **"FPS Counter"** (default `F3`): first press FPS-only, second press full panel view, third press hidden.

## Example debug.json

Create a custom panel titled "Gameplay" with dynamic labels for health and song name:

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

## Notes

- Add as many panels as needed; each is an array inside `fields`.
- The `variable` type can read any globally accessible Haxe class, including utilities you provide.
- Real-time updates make this useful for monitoring gameplay data such as health, difficulty, or note accuracy.
