---
title: Custom Events
desc: Add charted or runtime events with Lua or HScript plus Chart Editor docs.
author: Malloy
lastUpdated: 2025-11-21
---


ALE Psych loads custom events from your mod’s `events/` folder. Provide either Lua or HScript logic for each event and optionally include a `.txt` description for the Chart Editor dropdown.

## Directory Structure

Place scripts and descriptions under `mods/<your-mod>/events/`:

```
mods/
  your-mod/
    events/
      MyEvent.lua     ← Lua version (choose Lua or HScript)
      MyEvent.hx      ← HScript version (choose Lua or HScript)
      MyEvent.txt     ← Description shown in the Chart Editor
```

Use one script language per event name. The engine loads the matching script for each unique event in the chart.

## Chart Editor Descriptions

`.txt` files in the `events/` folder are paired with the matching event name. Describe what the event does and how Value 1 and Value 2 are used so chart authors can choose correctly.

## Available Callbacks

When an event script matches the charted event name, the engine calls:

### `onEventPushed(name, value1, value2, strumTime)`

- Runs once per charted event after it is added to the timeline.
- Use this to precache assets or set up context.

### `eventEarlyTrigger(name, value1, value2, strumTime)`

- Called before gameplay starts.
- Return a number of milliseconds to trigger the event earlier; return `0` or `null` for default timing.

### `onEvent(name, value1, value2, strumTime)`

- Called during gameplay when the event triggers.
- Implement the main effect logic here.

Value 1 and Value 2 are passed in as strings; convert them as needed inside your script.

## Lua Example

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

-- Fire an event manually
triggerEvent('MyEvent', '1.5', '0.25')
```

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

// Fire an event manually
PlayState.instance.triggerEvent('MyEvent', '1.0', '0.5', Conductor.songPosition);
```

## Summary

- Store event scripts in `events/` and match filenames to the charted event names.
- Use either Lua or HScript for logic and optional `.txt` files for Chart Editor guidance.
- Trigger events from charts or by calling the event helpers at runtime.
