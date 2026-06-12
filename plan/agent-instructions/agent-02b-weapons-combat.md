# Agent 02b: Weapon System + Projectiles + Damage + Repair + Targeting

## Objective

Build the weapon system (3-slot firing with cooldowns), projectile entities, damage calculator, repair controller, and targeting system. Depends on Agent 02a's Robot entity.

## Files You Own

```
src/game/entities/Weapon.ts
src/game/entities/Projectile.ts
src/game/systems/CombatManager.ts
src/game/systems/DamageCalculator.ts
src/game/systems/RepairController.ts
src/game/systems/TargetingController.ts
src/game/ui/CooldownIndicator.ts
```

## Dependencies

- Agent 02a's `Robot` class (import from `../entities/Robot`)
- Robot public API: `takeDamage(amount, system?)`, `systems: SystemStatus[]`, `currentHP`, `maxHP`, `stats`
- `RobotStats` and `SystemStatus` types
- Weapon data from `src/data/weapons.ts` (Agent 05 delivers this — if not available, use inline mock data matching the same interface)

```typescript
interface WeaponDef {
  id: string; name: string; category: 'laser' | 'missile' | 'machineGun' | 'artillery'
  slot: 'leftArm' | 'rightArm' | 'back'; weight: number
  baseStats: { damage: number; fireRate: number; accuracy: number }
  spriteKey: string
}
```

## Requirements

### Weapon Class (`Weapon.ts`)
- Data-driven config object wrapping a `WeaponDef`
- Tracks cooldown state: `isReady: boolean`, `cooldownTimer: number`
- `update(delta)`: decrement cooldown
- `fire()`: returns true if fired, false if on cooldown; resets cooldown to `fireRate`
- Three instances per robot (leftArm, rightArm, back)

### Projectile Entity (`Projectile.ts`)
- Extends `Phaser.Physics.Arcade.Sprite`
- Types: laser (instant line), missile (slow homing), bullet (straight fast), artillery (arc)
- `constructor(scene, x, y, config)`: creates projectile with correct sprite and physics
- `update()`: movement per type
- Homing missiles: slight rotation toward target position each frame
- Property: `damage: number`, `source: Robot`
- Auto-destroy on: collision with robot, out of bounds, timeout (3s)

### CombatManager (`CombatManager.ts`)
- Orchestrates combat: called each frame from BattleScene
- Holds refs to player robot, opponent robot, projectile group
- `update(delta)`: spawns projectiles when robot fires, runs collision checks
- Collision: Phaser overlap between projectile group and opponent robot → call `takeDamage` + spawn explosion effect
- Notifies DamageCalculator with hit details

### DamageCalculator (`DamageCalculator.ts`)
- `calculateHit(attacker: Robot, defender: Robot, weapon: WeaponDef): HitResult`
- Formula:
  - `baseDamage = weapon.baseStats.damage × random(0.9, 1.1)`
  - `accuracyMod = weapon.baseStats.accuracy × (defender.getSystemHealth('targeting') / defender.stats.targeting)`
  - Miss check: if `random() > accuracyMod` → return `{ hit: false }`
  - Shield layer: if defender shields > 0, `shieldDamage = min(baseDamage × 0.7, defender.shields)`, remainder passes to armour
  - Armour layer: `armourDamage = min(remaining × 0.8, defender.armour)` (armour absorbs 20%)
  - HP: rest goes to HP
  - System damage: 10% chance to deal 5% damage to a random system
- Returns: `{ hit: true, shieldDmg, armourDmg, hpDmg, systemDmg: { id, amount } | null }`

### RepairController (`RepairController.ts`)
- Player selects system to repair (receives event from HUD or keyboard R)
- `startRepair(systemId)`: begins repair on that system
- `update(delta)`: ticks repair progress
- `getProgress(): number` — 0 to 1
- Formula: `repairTime = 5s / robot.stats.repairSpeed * (robot.getSystemHealth('nanoRepair') / 100)`
- Only one system at a time
- Can cancel and switch
- On complete: system HP restored to full

### TargetingController (`TargetingController.ts`)
- `getAccuracyMultiplier(robot: Robot): number`
- `robot.getSystemHealth('targeting') / robot.stats.targeting`
- Used by DamageCalculator

### CooldownIndicator (Phaser UI)
- 3 small bars below robot or in fixed HUD position
- Each shows cooldown status for one weapon slot
- Fills from empty to full as cooldown progresses

## Acceptance Criteria
- [ ] 3 weapons fire independently with cooldowns
- [ ] Projectiles travel across arena and collide with target
- [ ] Damage applies: shields → armour → HP with correct formulas
- [ ] Missing shots when accuracy < 1.0
- [ ] Repair system: start/cancel/complete cycle works
- [ ] Cooldown indicators show weapon readiness
- [ ] Explosion effect on hit
- [ ] Homing missiles curve toward target
