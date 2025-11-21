---
title: Adding Songs
desc: Required folder layout and notes for packaging songs in ALE Psych mods.
author: Malloy
lastUpdated: 2025-11-21
---

ALE Psych stores song content only in the `songs` folder. Keep charts, audio, and scripts together inside your mod so the engine can load them without extra data directories.

## Folder Structure

Place each song inside your mod at `mods/<mod-name>/songs/<SongName>/` with this layout:

```
mods/
└─ modName/
   └─ songs/
      └─ SongName/
         ├─ charts/
         │  ├─ easy.json
         │  ├─ normal.json
         │  └─ hard.json
         ├─ song/
         │  ├─ Inst.ogg
         │  └─ Voices.ogg
         └─ scripts/
            ├─ haxeScript0.hx
            ├─ haxeScript1.hx
            ├─ luaScript0.lua
            └─ luaScript1.lua
```

## Notes

- Keep all difficulty charts inside `charts`.
- Put instrumental and vocal audio in `song`.
- Place Lua or HScript files in `scripts`.
- Folder names are case sensitive, so match chart references exactly.
