# Creating Custom Modules/Classes

ALE Psych supports creating custom classes and modules through **RuleScript** with HScript. This system lets you define reusable objects, sprites, or logic modules without modifying engine source code.

For deeper details on RuleScript internals, see the [[Library Repository](https://github.com/Kriptel/RuleScript/tree/dev)](https://github.com/Kriptel/RuleScript/tree/dev).

---

## Creating a Class

Custom classes live in `scripts/classes/`. Treat this as the equivalent of the `source/` folder in a full Haxe project.

Example:

```
mods/modName/scripts/classes/pack/MyClass.hx
```

This structure lets you organize code by packages. In the example above, `pack` is the package name.

---

## Extending Other Classes

You can only extend:

* Classes listed in [`[Extensible.hx](https://github.com/ALE-Psych-Crew/ALE-Psych/blob/main/source/scripting/haxe/Extensible.hx)`](https://github.com/ALE-Psych-Crew/ALE-Psych/blob/main/source/scripting/haxe/Extensible.hx)
* Other custom classes you define

When extending, import the target class before use.

Example:

```haxe
import scripting.haxe.ScriptSprite;

class MySprite extends ScriptSprite
{
    public function new()
    {
        super();
        trace('This is My Custom Sprite');
    }
}
```

This approach is useful for building custom objects that can be spawned and managed like built-in engine objects.

---

## Accessing a Custom Class

In HScript, you access your class with a normal `import`.

Example:

```haxe
import pack.MyClass;
```

After importing, you can create instances or call static methods like in a regular Haxe project.

---

## Developer Notes

* Keep classes modular. Put gameplay logic in states or substates, and reusable components in classes.
* Namespaces matter. Match folder structure to package imports (`scripts/classes/foo/Bar.hx` → `import foo.Bar`).
* Extensible classes are designed to interact with the engine safely. Extending non-extensible internals will not work.
