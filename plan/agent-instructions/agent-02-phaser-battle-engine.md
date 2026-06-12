# Agent 02: Phaser Battle Engine

## Objective

Build the core combat engine in Phaser 3 — arena, robot movement, weapon system, damage model, nano repair, support units, and React overlay HUD. This is the largest and most critical workstream.

## Files You Own

```
src/game/index.ts
src/game/config.ts
src/game/constants.ts
src/game/scenes/BootScene.ts
src/game/scenes/PreloadScene.ts
src/game/scenes/BattleScene.ts
src/game/entities/Robot.ts
src/game/entities/Weapon.ts
src/game/entities/Projectile.ts
src/game/entities/Tank.ts
src/game/entities/Drone.ts
src/game/systems/CombatManager.ts
src/game/systems/DamageCalculator.ts
src/game/systems/RepairController.ts
src/game/systems/TargetingController.ts
src/game/systems/InputController.ts
src/game/systems/PhysicsController.ts
src/game/ui/HealthBar.ts
src/game/ui/CooldownIndicator.ts
src/game/ui/DamageNumber.ts
src/pages/olympus/BattleArena.tsx
src/pages/olympus/BattleResult.tsx
src/pages/olympus/components/CombatHUD.tsx
src/pages/olympus/components/SystemStatus.tsx
```

> Do NOT modify files outside this list unless coordinating with the lead.

## Dependencies

- **Phase 0** provides: store stubs (`src/store/loadoutStore.ts`, `src/store/battleStore.ts`), shared types (`RobotDef`, `WeaponDef`, etc.)
- **Placeholder assets:** Use colored rectangles as sprites until real assets arrive. Define sprite keys as constants that will be swapped later.
- `loadoutStore` contains: `selectedRobot: RobotDef`, `equippedWeapons: [WeaponDef, WeaponDef, WeaponDef]`, `opponent: RobotDef`
- `battleStore` contains: `setResult(result: BattleResult)` — called when match ends

## Detailed Requirements

### Phaser React Integration (`BattleArena.tsx`)
- Create Phaser game instance on mount, destroy on unmount
- Pass loadout config from Zustand store to Phaser scene
- Host Phaser canvas in a div that fills the viewport
- React HUD overlays on top of canvas (positioned absolutely)

### Scenes
- **BootScene:** Load minimal assets for loading bar (bar background, fill sprite). Transition to PreloadScene.
- **PreloadScene:** Load all game assets with progress bar. Display "LOADING..." text. Transition to BattleScene.
- **BattleScene:** Main combat. Set up arena, spawn robots, start combat loop.

### Arena (`BattleScene`)
- 2D side-scrolling arena (wider than viewport)
- Camera follows midpoint between two robots
- Parallax background (2 layers) — scroll at different rates
- Arena floor at bottom, invisible ceiling/walls
- Background uses placeholder colors (sky gradient, city silhouette)

### Robot Entity (`Robot.ts`)
- Extends `Phaser.Physics.Arcade.Sprite`
- Properties: `stats: RobotStats`, `currentHP: number`, `systems: SystemStatus[]`
- Each system has: `currentHealth`, `maxHealth`, `isDamaged`
- Methods: `moveLeft()`, `moveRight()`, `stopMoving()`, `fireWeapon(slot)`, `takeDamage(amount)`, `repairSystem(systemId)`, `playAnimation(name)`
- Animation states: `idle`, `walk`, `fireLeftArm`, `fireRightArm`, `fireBack`, `hit`, `shieldHit`, `destroyed`
- Collision body roughly matches sprite size

### Weapon System (`Weapon.ts`, `Projectile.ts`)
- `Weapon` is a data-driven config, not a game object
- Each robot has 3 weapon slots (leftArm, rightArm, back)
- Weapons fire on cooldown — rate determined by `fireRate`
- `Projectile` extends `Phaser.Physics.Arcade.Sprite` — created on fire, moves toward target
- Projectile types: laser (instant hit), missile (homing), bullet (straight fast), artillery (arc)
- Collision between projectile and opponent robot triggers `takeDamage`

### Damage Model (`DamageCalculator.ts`)
- When projectile hits: check shields first → if shields > 0, damage applies to shields
- If shields depleted, remaining damage applies to armour
- If armour depleted, remaining damage applies to HP
- Formula: `damageDealt = weaponDamage × accuracyMultiplier × (1 - armourResistance)`
- Random variance: ±10% on damage
- Critical hit chance: 5% for 2x damage

### Repair Controller (`RepairController.ts`)
- Player selects a system to repair via HUD buttons
- Repair takes time: `repairTime = baseTime / repairSpeedMultiplier`
- Progress shown on system status in HUD
- Only one system can be repaired at a time
- Can cancel repair and switch to another system

### Targeting Controller (`TargetingController.ts`)
- Base accuracy from weapon stat
- Multiplied by targeting system health percentage
- `finalAccuracy = weaponAccuracy × (targetingHP / targetingMaxHP)`
- Applied as a random spread when firing

### Input Controller (`InputController.ts`)
- **Mobile:** On-screen joystick (left side) + action buttons (right side): Fire LA, Fire RA, Fire Back, Repair Menu
- **Desktop:** Keyboard — A/D or Arrow keys for movement, 1/2/3 for weapon slots, R for repair
- Both input modes work simultaneously
- Joystick: Phaser-based draggable circle

### Support Units (`Tank.ts`, `Drone.ts`)
- Spawn near robot on battle start if player has them equipped
- `Tank`: ground unit, stays near robot, fires at opponent automatically
- `Drone`: air unit, circles above, fires at opponent
- Both have own HP — can be destroyed
- Simple AI: approach enemy → fire → retreat

### CombatHUD (React overlay)
- Health bar for player (top-left) and opponent (top-right)
- System status panel (bottom-left): 6 system bars with repair button
- Weapon cooldown indicators (bottom-right): 3 slots showing cooldown progress
- Nano repair progress bar
- Touch-friendly buttons (min 44px)

### SystemStatus (React component)
- Shows 6 system bars: Armour, Shields, Weapons, Targeting, Nano Repair, Legs
- Each bar shows HP percentage with color (green → yellow → red)
- Tap a system to prioritize repair (sends event to Phaser)

### BattleResult Screen
- Overlay on win/loss: "VICTORY" or "DEFEAT"
- Stats: damage dealt, damage taken, systems repaired, coins earned
- Buttons: "Return to Menu", "Play Again"

## Acceptance Criteria

- [ ] Robot moves left/right with joystick and keyboard
- [ ] 3 weapon slots fire independently with cooldowns
- [ ] Projectiles collide with opponent and deal damage
- [ ] Shields absorb damage before armour, armour before HP
- [ ] Repair system: select system, see progress, system recovers
- [ ] Targeting damage reduces accuracy visibly
- [ ] CombatHUD shows live health, system status, cooldowns
- [ ] Win/loss triggers when HP reaches 0
- [ ] BattleResult screen shows post-match stats
- [ ] Support units spawn and fight automatically
- [ ] Placeholder sprites used throughout (colored rectangles)
