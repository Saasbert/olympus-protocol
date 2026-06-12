# Agent 04: Asset Pipeline

## Objective

Generate, clean, and prepare all visual assets for the game: robot sprites, weapon effects, support units, arenas, and UI elements. Output as PNG sprite sheets + JSON atlases ready for Phaser.

## Files You Own

```
public/assets/robots/*
public/assets/weapons/*
public/assets/support/*
public/assets/backgrounds/*
public/assets/ui/*
```

> Do NOT modify code files. Update `public/assets/` only.

## Dependencies

- None on other agents — can start immediately
- Refer to `src/game/constants.ts` for expected sprite key names and animation frame counts (coordinate with Agent 02 lead)

## Art Style Guide

| Aspect | Spec |
|---|---|
| Style | Pixel art, 1980s anime mecha (Robotech / Transformers aesthetic) |
| Palette | Industrial — dark steel blues, warm oranges/yellows for fire, neon cyan/green for energy shields |
| Resolution | 64×64 per frame for robots, 32×32 for weapons/projectiles, 16×16 for UI icons |
| Animation | 4-8 frames per animation sequence |
| Output | PNG sprite sheet + JSON atlas (TexturePacker format or Phaser-compatible) |

## Assets Required

### Robots (3 types for v1.0)

| Robot | Archetype | Colors | Animations Needed |
|---|---|---|---|
| **Titan** | Balanced — all-rounder | Blue/grey/white | idle(4), walk(6), fireLeftArm(4), fireRightArm(4), fireBack(4), hit(3), destroyed(6) |
| **Colossus** | Heavy — high armour, slow | Dark red/grey | Same animation set |
| **Vanguard** | Agile — fast, lower armour | Green/teal | Same animation set |

Each animation: 64×64 frames, laid out in a single row per animation on the sprite sheet, or packed via TexturePacker.

### Weapon Effects

| Weapon Type | Frames | Size | Notes |
|---|---|---|---|
| Laser beam (straight) | 3 (start, middle, end) | 32×8 | Cyan/white gradient |
| Laser beam (precision) | 3 | 16×4 | Thin, bright yellow |
| Missile | 4 (flying animation) | 16×8 | Small projectile with flame trail |
| Homing missile | 4 | 16×8 | Same as missile, different color (red vs grey) |
| Cluster missile | 3 | 24×8 | Wider, with separation effect |
| Bullet (machine gun) | 2 | 8×4 | Small yellow dots |
| Artillery shell | 4 | 24×12 | Arc trajectory, larger |
| Explosion | 6 | 48×48 | Expanding orange/yellow/white |
| Shield hit effect | 3 | 32×32 | Blue ripple |

### Support Units

| Unit | Frames | Size | Animations |
|---|---|---|---|
| Tank | 4 (idle), 4 (fire) | 48×24 | Treads visible |
| Drone | 4 (hover), 4 (fire) | 32×32 | Rotating wings or glow |

### Arena Backgrounds

| Layer | Content | Size | Notes |
|---|---|---|---|
| Far layer | Sky with mountains/city silhouette | 2048×768 | Slow parallax scroll |
| Near layer | Ground-level buildings/structures | 2048×768 | Faster parallax |
| Overlay | Atmospheric effects (dust, smoke) | 2048×768 | Subtle, optional |

2 arena variants for v1.0: "Neon City" (night, cyberpunk) and "Industrial Zone" (day, factory)

### UI Elements

| Asset | Size | Notes |
|---|---|---|
| Health bar frame | 256×32 | Dark grey border with inner fill area |
| Health bar fill (green) | 256×32 | Used as tiled sprite or mask |
| Health bar fill (red) | 256×32 | For opponent |
| Shield bar fill (blue) | 256×32 | Semi-transparent blue |
| System icon — Armour | 32×32 | Shield plate icon |
| System icon — Shields | 32×32 | Energy bubble icon |
| System icon — Weapons | 32×32 | Crossed guns |
| System icon — Targeting | 32×32 | Crosshair |
| System icon — Nano Repair | 32×32 | Wrench/spark |
| System icon — Legs | 32×32 | Leg/treads |
| Coin icon | 32×32 | Gold coin |
| Button background | 64×32 | Rounded rect, metallic |
| Joystick base | 128×128 | Semi-transparent circle |
| Joystick knob | 48×48 | Smaller circle |

## Tooling Recommendations

- **Generation:** Midjourney / DALL-E 3 with prompts like: "pixel art sprite sheet, 1980s anime mecha robot, 64x64 per frame, walk cycle, idle, firing, [color] armor, angular industrial design, 8 frames per animation, spritesheet layout"
- **Cleanup:** Aseprite (best for pixel art) or Photoshop/Affinity
- **Atlas packing:** Free TexturePacker or Aseprite export
- **Animation JSON:** Phaser expects either TexturePacker JSON (Hash) or Phaser multi-atlas format

## Asset Naming Convention

```
robots/{robotId}_{animationName}.png      — sprite sheet
robots/{robotId}_{animationName}.json     — atlas data
weapons/{weaponId}.png                     — projectile sprite
weapons/explosion.png                      — explosion sprite sheet
support/{unitId}_{animationName}.png       — support unit sprite
backgrounds/{arenaId}_far.png              — far parallax layer
backgrounds/{arenaId}_near.png             — near parallax layer
ui/{elementName}.png                       — UI element
```

## Delivery

Place all assets in `public/assets/` following the structure above. Provide a manifest/README listing all files, their intended sprite keys, and animation frame definitions so Agent 02 can wire them into `PreloadScene.ts`.

## Acceptance Criteria
- [ ] 3 complete robot sprite sheets with all required animations
- [ ] 10+ weapon effect sprites/projectile graphics
- [ ] 2+ support unit sprite sheets
- [ ] 2 arena background sets (2 layers each)
- [ ] All UI elements: health bars, system icons, coin icon, buttons, joystick
- [ ] All sprites in PNG format with matching JSON atlas files
- [ ] All asset keys documented for Phaser import
