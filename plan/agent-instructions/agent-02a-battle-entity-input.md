# Agent 02a: BattleScene + Robot Entity + Input

## Objective

Build the Phaser canvas integration in React, the BattleScene, Robot entity class, and touch/keyboard input controller. This is the foundation all other Phaser agents depend on.

## Files You Own

```
src/game/index.ts
src/game/config.ts
src/game/constants.ts
src/game/scenes/BootScene.ts
src/game/scenes/PreloadScene.ts
src/game/scenes/BattleScene.ts
src/game/entities/Robot.ts
src/game/systems/InputController.ts
src/game/systems/PhysicsController.ts
src/game/ui/HealthBar.ts
src/pages/olympus/BattleArena.tsx
```

## Contract You Export (other agents depend on this)

```typescript
// Robot.ts — other agents import Robot class
class Robot extends Phaser.Physics.Arcade.Sprite {
  // Public state
  stats: RobotStats
  currentHP: number
  maxHP: number
  systems: SystemStatus[]
  weapons: [WeaponInstance | null, WeaponInstance | null, WeaponInstance | null]

  // Public methods
  moveLeft(): void
  moveRight(): void
  stopMoving(): void
  takeDamage(amount: number, system?: string): void
  fireWeapon(slot: 0 | 1 | 2): Projectile | null
  repairSystem(systemId: string): void
  getSystemHealth(systemId: string): number
  distanceTo(other: Robot): number
  playAnim(name: string): void
}

interface RobotStats {
  armour: number; shields: number; weaponDamage: number
  targeting: number; repairSpeed: number; legCapacity: number
  speed: number; hp: number
}

interface SystemStatus {
  id: string; name: string; currentHealth: number; maxHealth: number
  isDamaged: boolean
}
```

## Requirements

### Phaser → React Integration (`BattleArena.tsx`)
- On mount: create Phaser game instance with GAME_CONFIG, attach to `#phaser-container` div
- On unmount: destroy Phaser instance
- Read loadout from `useLoadoutStore` and pass to Phaser scene via scene data
- Read difficulty from state, pass to scene data
- Host canvas in full-viewport div
- Listen for battle end from Phaser via shared `battleStore.setResult()`

### BootScene
- Load minimal assets for loading bar (bar background, fill)
- Transition to PreloadScene

### PreloadScene
- Load all game assets with progress bar display
- Show "LOADING..." text
- Register all animations with Phaser's AnimationManager
- Transition to BattleScene

### BattleScene
- Create arena (wider than viewport, ARENA_WIDTH × ARENA_HEIGHT)
- Camera follows midpoint between player and opponent
- Parallax background (2 layers, scroll at different rates)
- Ground at GROUND_Y
- Spawn player robot (left side) and opponent robot (right side) from loadout data
- Game loop: update robots, check win condition
- On HP <= 0: trigger end sequence (destroy anim → 2s delay → write result to store → navigate to result screen)
- Arena bounds prevent robots leaving visible area

### Robot Entity
- Extends `Phaser.Physics.Arcade.Sprite`
- 6 systems each with own HP: armour, shields, weapons, targeting, nanoRepair, legs
- `takeDamage`: reduces shields first → armour → HP; random chance of system damage (10% per hit)
- `fireWeapon(slot)`: creates Projectile (delegated to Agent 02b's projectile system — return null placeholder for now)
- `repairSystem(systemId)`: placeholder — will be wired to RepairController
- Animation states: idle, walk, fireLeftArm, fireRightArm, fireBack, hit, destroyed
- Use colored rectangles as sprite placeholders (colored bars scaled to 64×64)
- Robot color by archetype: Titan=blue, Colossus=red, Vanguard=green

### InputController
- **Mobile:** On-screen joystick (left side, draggable circle) + 3 fire buttons (right side)
- **Desktop:** A/D or Left/Right arrows for movement, 1/2/3 for weapons, R for repair
- Both modes work simultaneously
- Joystick: Phaser Graphics drawn circle, drag to move, return to center
- Fire buttons: Phaser Graphics drawn zones

### PhysicsController
- Arcade physics collisions between robots and arena bounds
- Prevent robots from overlapping
- Ground collision

### HealthBar (Phaser UI)
- Green bar above robot, follows robot position
- Depletes as HP decreases
- Red when HP < 25%

## Acceptance Criteria
- [ ] Phaser canvas renders inside React component
- [ ] BattleScene loads with arena background (colored rectangles)
- [ ] Player robot appears left, opponent robot appears right
- [ ] Robot walks left/right with joystick and keyboard
- [ ] Robot stops at arena bounds
- [ ] Health bar above robot updates
- [ ] Camera follows midpoint
- [ ] Preload shows loading progress
