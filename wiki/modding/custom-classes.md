---
title: Custom Classes
desc: Define reusable classes and modules in RuleScript using HScript.
author: Malloy
lastUpdated: 2025-11-21
---

RuleScript with HScript lets you create reusable classes and modules without modifying the ALE Psych source. Organize custom code under `scripts/classes/` just like Haxe packages.

## Creating a Class

Place class files in `scripts/classes/` using package folders when needed:

```
mods/modName/scripts/classes/pack/MyClass.hx
```

This mirrors how a Haxe project structures `source/` files.

## Extending Other Classes

You can extend:

- Classes listed in `Extensible.hx` from the scripting API.
- Other custom classes you define.

Import the target class before extending it.

```haxe
import scripting.haxe.ScriptSprite;

class MySprite extends ScriptSprite {
    public function new() {
        super();
        trace('This is My Custom Sprite');
    }
}
```

## Accessing a Custom Class

Import and use your class in HScript like a normal Haxe project:

```haxe
import pack.MyClass;
```

Create instances or call static methods after importing.

## Developer Notes

- Keep gameplay logic in states or substates; keep reusable pieces in classes.
- Match folder structure to package names (`scripts/classes/foo/Bar.hx` → `import foo.Bar`).
- Only extensible classes interact safely with the engine internals.
