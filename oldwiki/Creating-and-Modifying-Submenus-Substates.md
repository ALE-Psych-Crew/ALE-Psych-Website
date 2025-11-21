# Creating and Modifying Submenus/Substates

ALE Psych lets you create new submenus (substates) or override existing ones without touching the engine source. Substates are used for overlays like pause screens, game over, and transitions.

HScript supports both creation and modification. Lua supports creation only, but there is a workaround to overwrite existing substates.

---

## HScript

### Creating a Submenu

Add a `.hx` script under `scripts/substates/`. The filename is used as the submenu’s identifier.

Example:

```
mods/modName/scripts/substates/MySubMenu.hx
```

### Modifying a Submenu

To override a built-in submenu:

1. Locate the script in `assets/scripts/substates`.
2. Copy it into your mod’s `scripts/substates/`.
3. Edit the copy. The engine loads your version instead of the default.

Tip: The FPS counter shows the active submenu name for quick reference.

### Accessing a Submenu

Call `CoolUtil.openSubState`:

```haxe
CoolUtil.openSubState(new CustomSubState('ScriptName'));
```

---

## Lua

### Creating a Submenu

Place a `.lua` script under `scripts/substates/`.

Example:

```
mods/modName/scripts/substates/MySubMenu.lua
```

### Modifying a Submenu

Direct modification is not supported since the base substates are written in HScript.
**Workaround:** you can overwrite substates in Lua by creating an empty `.hx` file with the same name as the base submenu and then adding your `.lua` script. Both will run together, giving Lua control.

### Accessing a Submenu

Call `openSubState`:

```lua
openSubState('funkin.substates.CustomSubState', {'ScriptName'})
```

---

## Developer Notes

* Substates run on top of the active state. The parent state is paused until the submenu closes.
* Use `close()` in HScript or `closeSubState()` in Lua to exit back to the parent state.
* Keep logic efficient. Both the substate and the parent state update while the substate is active.