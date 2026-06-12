# Agent 04a: Robot Sprite Generation

## Objective

Generate, clean up, and prepare all robot sprite sheets for the 3 v1.0 robot types. Output as PNG sprite sheets + JSON atlas files ready for Phaser.

## Files You Own

```
public/assets/robots/*
```

## Art Style

| Aspect | Spec |
|---|---|
| Style | Pixel art, 1980s anime mecha (Robotech / Transformers) |
| Palette | Industrial: dark steel blues, warm oranges for energy |
| Resolution | 64×64 per animation frame |
| Frames | 4-8 per animation sequence |
| Output | PNG + JSON atlas (Phaser-compatible format) |

## Robots (3 types for v1.0)

### Titan (Balanced)
- Colors: Blue/grey/white
- Design: Medium build, humanoid proportions
- Animations: idle(4), walk(6), fireLeftArm(4), fireRightArm(4), fireBack(4), hit(3), destroyed(6)

### Colossus (Heavy)
- Colors: Dark red/grey
- Design: Bulky, broad shoulders, thick legs
- Animations: same set as Titan

### Vanguard (Agile)
- Colors: Green/teal
- Design: Slim, angular, streamlined
- Animations: same set

## Generation Pipeline

1. **AI prompts** (Midjourney / DALL-E):
   ```
   pixel art sprite sheet, 1980s anime mecha robot, 64x64 per frame,
   [robot type descriptor], [colors], industrial angular design,
   8 frames per animation, spritesheet layout, top-down side view
   ```

2. **Cleanup** in Aseprite:
   - Crop to consistent 64×64 frames
   - Remove artifacts
   - Standardize palette
   - Arrange in spritesheet rows (one row per animation)

3. **Atlas packing**:
   - Use Aseprite's built-in sprite sheet export or TexturePacker
   - Output: `{robotId}.png` + `{robotId}.json`
   - JSON format: Phaser-compatible (TexturePacker JSONHash or Phaser multi-atlas)

## Naming Convention

```
public/assets/robots/titan.png
public/assets/robots/titan.json
public/assets/robots/colossus.png
public/assets/robots/colossus.json
public/assets/robots/vanguard.png
public/assets/robots/vanguard.json
```

## Delivery

Provide:
- 3 PNG sprite sheets + 3 JSON atlas files
- Animation manifest listing frame names per robot:
  ```typescript
  { robotId: 'titan', animations: { idle: [0,1,2,3], walk: [4,5,6,7,8,9], ... } }
  ```

## Acceptance Criteria
- [ ] 3 complete robot sprite sheets with all required animations
- [ ] Each sprite 64×64, consistent across all frames
- [ ] JSON atlas files correctly reference all frames
- [ ] Style matches 1980s mecha anime aesthetic
- [ ] Animations recognizable (walk, fire, hit, destroyed)
