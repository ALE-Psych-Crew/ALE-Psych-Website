---
title: Menu Scripting
desc: Create or override ALE Psych menu states using HScript or Lua.
author: Malloy
lastUpdated: 2025-11-21
---

Create new menus or replace existing ones without touching engine source. ALE Psych supports **HScript** for full control and **Lua** for creating scripted menus.

## HScript

### Creating a Menu

Add a `.hx` script to `scripts/states/`. The filename becomes the menu identifier.

```
mods/modName/scripts/states/MyMenu.hx
```

### Modifying a Menu

1. Copy the desired menu from `assets/scripts/states` into your mod’s `scripts/states/`.
2. Edit the copy; the engine prefers your version.
3. Enable the FPS counter to see the current state name while testing.

### Accessing a Menu

Use `CoolUtil.switchState` to load a scripted state:

```haxe
CoolUtil.switchState(new CustomState('ScriptName'));
```

## Lua

### Creating a Menu

Place a `.lua` script in `scripts/states/` to register a new menu:

```
mods/modName/scripts/states/MyMenu.lua
```

### Modifying a Menu

Base menus are HScript-only. To override them with Lua, create an empty `.hx` file with the same name and add your Lua script; both will execute together.

### Accessing a Menu

Use the Lua helper to switch states:

```lua
switchState('funkin.states.CustomState', {'ScriptName'})
```

## Notes

- HScript can create and modify menus; Lua creates menus and can piggyback on the empty `.hx` override trick.
- Keep filenames consistent; the engine resolves states by script name.
