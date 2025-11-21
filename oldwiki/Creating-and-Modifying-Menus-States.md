# Creating and Modifying Menus/States

ALE Psych allows developers to create new menus or override existing ones without modifying the engine source. This system supports both **HScript** and **Lua**, though capabilities differ between them.

Use HScript when you need full control, including modifying base menus. Use Lua when you only need to add custom menus.

---

## HScript

### Creating a Menu

Create a new `.hx` script under `scripts/states/`. The filename becomes the menu’s identifier.

Example:

```
mods/modName/scripts/states/MyMenu.hx
```

### Modifying a Menu

To override a default menu:

1. Find the script in `assets/scripts/states`.
2. Copy it into your mod’s `scripts/states/`.
3. Edit the copy. The engine will use your version instead of the default.

Tip: If you don’t know which menu is active, enable the FPS counter. It shows the current state name.

### Accessing a Menu

Use `CoolUtil.switchState` to load a menu:

```haxe
CoolUtil.switchState(new CustomState('ScriptName'));
```

---

## Lua

### Creating a Menu

Like HScript, place the `.lua` script in `scripts/states/`.

Example:

```
mods/modName/scripts/states/MyMenu.lua
```

### Modifying a Menu

Direct modification is not supported since the base menus are written in HScript.
**Workaround:** you can overwrite menus in Lua by creating an empty `.hx` file with the same name as the base menu and then adding your `.lua` script. Both will run together.

### Accessing a Menu

Use the Lua `switchState` function:

```lua
switchState('funkin.states.CustomState', {'ScriptName'})
```

---

## Notes

* **HScript** = create and modify menus
* **Lua** = create menus only, but menus can be overwritten with the `.hx` + `.lua` method

---