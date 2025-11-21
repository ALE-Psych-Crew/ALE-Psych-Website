# Adding Songs

Songs in ALE Psych are stored differently from Psych.  
Instead of using separate `data` and `songs` folders, only the `songs` folder is used.  

## Folder Structure

Each song must follow this format inside your mod:

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
- Place all charts (`.json` files) inside the `charts` folder.  
- Place instrumental and vocal tracks in the `song` folder.  
- Place Haxe or Lua scripts in the `scripts` folder.  
- Song folder names are case sensitive.  
