# Custom Event Tutorial

This guide explains how **ALE Psych** handles custom events defined in mod folders, how to document them for the Chart Editor, and how to hook into them using Lua or HScript/RuleScript at runtime.

---

## Directory Structure

Custom event scripts go inside the `events/` folder of your mod:

```
mods/
  your-mod/
    events/
      MyEvent.lua     ← Lua version (ONLY CHOOSE ONE)
      MyEvent.hx      ← HScript version (ONLY CHOOSE ONE)
      MyEvent.txt     ← Description for the Chart Editor
```


* **`.lua` or `.hx`**: Script containing callbacks for the event logic (use one or the other).
* **`.txt`**: Optional text file that provides documentation in the Chart Editor.

The engine scans the current song's event list during `PlayState` creation and loads a script from `events/<eventName>` for each unique custom event name. The script filename must exactly match the event name used in the chart.

---

## Chart Editor Descriptions

To help chart authors, the engine reads any `.txt` files in the `events/` folder of the active mod and pairs them with the matching event name.

Each `.txt` file should briefly describe:

* What the event does
* What Value 1 and Value 2 are used for

These descriptions show up in the Chart Editor dropdown when selecting events.

---

## Available Callbacks

If a script matches an event name used in the chart, the engine will call these functions when appropriate:

### `onEventPushed(name, value1, value2, strumTime)`

* Runs once per charted event, after it's added to the timeline.
* Use this to **precache assets** or set up runtime context.
* No return value.

---

### `eventEarlyTrigger(name, value1, value2, strumTime)`

* Called before gameplay starts.
* Use it to make the event trigger early.
* **Return** the number of milliseconds to trigger early.
* Return `0` or `null` to use the default timing.

---

### `onEvent(name, value1, value2, strumTime)`

* Called during gameplay when the event is triggered.
* Use this for your main effect logic.
* No return value.

---

## Value 1 and Value 2

These values are passed as **strings**, exactly as stored in the chart. Your script is responsible for interpreting them. 

---

## Lua Script Example

```lua
function onEventPushed(name, value1, value2, strumTime)
    if name == 'MyEvent' then
        precacheImage('my-event/effect')
    end
end

function eventEarlyTrigger(name, value1, value2, strumTime)
    if name == 'MyEvent' and value1 == 'fast' then
        return 150
    end
    return 0
end

function onEvent(name, value1, value2, strumTime)
    if name ~= 'MyEvent' then return end

    local speed = tonumber(value1) or 1
    local duration = tonumber(value2) or 0.5

    cameraFlash('game', 'FFFFFF', duration)
    setProperty('songSpeed', speed)
end
```

You can also call:

```lua
triggerEvent(name, value1, value2)
```

to fire custom or built-in events manually from any Lua script.

---

## HScript Example

```haxe
import funkin.states.PlayState;
import flixel.FlxG;
import flixel.util.FlxColor;

function onEventPushed(name:String, value1:String, value2:String, strumTime:Float) {
    if (name == 'MyEvent') {
        precacheImage('my-event/effect');
    }
}

function eventEarlyTrigger(name:String, value1:String, value2:String, strumTime:Float) {
    if (name == 'MyEvent' && value1 == 'fast') return 150;
    return 0;
}

function onEvent(name:String, value1:String, value2:String, strumTime:Float) {
    if (name != 'MyEvent') return;

    var speed = Std.parseFloat(value1);
    if (Math.isNaN(speed)) speed = 1;

    var duration = Std.parseFloat(value2);
    if (Math.isNaN(duration)) duration = 0.5;

    FlxG.camera.flash(FlxColor.WHITE, duration);
    PlayState.instance.songSpeed = speed;
}
```

To fire custom events manually from HScript:

```haxe
PlayState.instance.triggerEvent("MyEvent", "1.5", "0.25", Conductor.songPosition);
```

---

## Triggering Events in Code

Custom events don’t need to be charted, you can trigger them programmatically at runtime.

### In Lua:

```lua
triggerEvent("MyEvent", "1.0", "0.5")
```

### In HScript:

```haxe
PlayState.instance.triggerEvent("MyEvent", "1.0", "0.5", Conductor.songPosition);
```

These calls reuse the same pipeline as charted events, so your event script’s `onEvent()` will run as if it had been triggered by a note.

---

## Summary

* Custom events are stored in `events/` and matched by filename.
* You can use Lua **or** HScript for event logic.
* Use `.txt` files for Chart Editor descriptions.
* Events can be triggered manually or from charts.
* Always handle `Value 1` and `Value 2` as strings and convert as needed.

This system allows you to centralize mod behavior and design reusable gameplay events without modifying engine source code.
