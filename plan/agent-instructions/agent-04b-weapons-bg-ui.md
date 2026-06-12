# Agent 04b: Weapons + Backgrounds + UI Assets

## Objective

Generate and prepare weapon effect sprites, arena backgrounds, support unit sprites, and all UI elements.

## Files You Own

```
public/assets/weapons/*
public/assets/support/*
public/assets/backgrounds/*
public/assets/ui/*
```

## Art Style

Same as Agent 04a: pixel art, 1980s mecha aesthetic, consistent palette.

## Weapons

| Weapon Type | Frames | Size | Description |
|---|---|---|---|
| Laser beam | 3 (start, middle, end) | 32×8 | Cyan/white gradient beam |
| Precision laser | 3 | 16×4 | Thin bright yellow beam |
| Heavy laser | 3 | 48×12 | Thick orange/red beam |
| Missile | 4 (flying cycle) | 16×8 | Grey with flame trail, 2 frames of flame |
| Homing missile | 4 | 16×8 | Red variant of missile |
| Cluster missile | 3 | 24×8 | Wider, 3-projectile salvo look |
| Bullet | 2 | 8×4 | Small yellow/orange dots |
| Heavy MG bullet | 2 | 12×6 | Larger bullet |
| Artillery shell | 4 | 24×12 | Dark grey, arc trajectory |
| Heavy artillery | 4 | 32×16 | Larger shell |
| Explosion | 6 | 48×48 | Expanding circle: orange → yellow → white → fade |
| Shield hit | 3 | 32×32 | Blue/semi-transparent ripple |

## Support Units

| Unit | Frames | Size | Animations |
|---|---|---|---|
| Assault Tank | idle(4), fire(4) | 48×24 | Treads, turret |
| Defense Tank | idle(4), fire(4) | 48×24 | Different silhouette |
| Scout Drone | hover(4), fire(4) | 32×32 | Rotating wings or glow |

## Arena Backgrounds (2 variants)

### Neon City (Night)
- Far layer (2048×768): Skyline silhouette with neon lights, stars
- Near layer (2048×768): Ground-level buildings, darker, more detailed
- Colors: Dark purple sky, cyan/neon lights

### Industrial Zone (Day)
- Far layer (2048×768): Mountains with factories
- Near layer (2048×768): Industrial structures, smoke stacks
- Colors: Grey/brown sky, rust oranges

Both exported as single PNGs (not sprite sheets).

## UI Elements

| Asset | Size | Notes |
|---|---|---|
| health-bar-frame | 256×32 | Dark grey border, rounded corners |
| health-bar-fill-green | 256×32 | Bright green gradient |
| health-bar-fill-red | 256×32 | Red for opponent |
| shield-bar-fill-blue | 256×32 | Semi-transparent blue |
| icon-armour | 32×32 | Shield plate |
| icon-shields | 32×32 | Energy bubble |
| icon-weapons | 32×32 | Crossed guns |
| icon-targeting | 32×32 | Crosshair |
| icon-nano-repair | 32×32 | Wrench with spark |
| icon-legs | 32×32 | Mechanical leg |
| icon-coin | 32×32 | Gold coin with bolt |
| btn-primary | 64×32 | Cyan gradient button |
| btn-secondary | 64×32 | Dark grey button |
| joystick-base | 128×128 | Semi-transparent circle |
| joystick-knob | 48×48 | Solid circle |
| icon-192 | 192×192 | PWA app icon |
| icon-512 | 512×512 | PWA app icon |

## Naming Convention

```
public/assets/weapons/{weaponId}.png       — projectile sprite sheet
public/assets/weapons/explosion.png        — explosion sprite sheet
public/assets/support/{unitId}.png          — support unit sprite sheet
public/assets/backgrounds/{arenaId}_far.png — far layer
public/assets/backgrounds/{arenaId}_near.png — near layer
public/assets/ui/{elementName}.png          — UI element
```

## Delivery

- All assets in correct `public/assets/` subdirectories
- Sprite sheets (weapons, support units) with JSON atlas files
- Single-frame assets (backgrounds, UI) as plain PNGs
- Animation manifest for multi-frame sprites

## Acceptance Criteria
- [ ] 10+ weapon effect sprites/projectile graphics
- [ ] 2 support unit sprite sheets with animations
- [ ] 2 arena background sets (2 layers each)
- [ ] All UI elements: health bars, icons, coin, buttons, joystick, PWA icons
- [ ] Consistent pixel art style matching robot sprites
- [ ] All files in correct locations with correct naming
