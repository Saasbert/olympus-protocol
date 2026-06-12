# Agent 02c: Support Units + CombatHUD + BattleResult

## Objective

Build support unit entities (tank, drone), the React-based Combat HUD overlay, the System Status panel, and the Battle Result screen.

## Files You Own

```
src/game/entities/Tank.ts
src/game/entities/Drone.ts
src/pages/olympus/components/CombatHUD.tsx
src/pages/olympus/components/SystemStatus.tsx
src/pages/olympus/BattleResult.tsx
src/game/ui/DamageNumber.ts
```

## Dependencies

- Agent 02a's `Robot` class, `BattleScene`, arena setup
- Agent 02b's `Projectile` class, weapons/damage system
- `loadoutStore` for equipped support units
- `battleStore` for reading result data

Key types you consume:
```typescript
interface Robot { x, y, currentHP, maxHP, systems: SystemStatus[], stats: RobotStats, isPlayer: boolean }
interface SystemStatus { id: string; name: string; currentHealth: number; maxHealth: number; isDamaged: boolean }
interface BattleResult { won: boolean; damageDealt: number; damageTaken: number; systemsRepaired: number; coinsEarned: number }
```

## Requirements

### Tank Entity (`Tank.ts`)
- Extends `Phaser.Physics.Arcade.Sprite`
- Ground unit, follows near its owner robot (offset by ~100px)
- Simple AI: if enemy robot within 300px range → fire slow projectile
- Fire rate: every 2s
- Has its own HP (200), can be destroyed
- Destroyed → fade out over 1s, then remove
- Placeholder sprite: grey rectangle 48×24

### Drone Entity (`Drone.ts`)
- Extends `Phaser.Physics.Arcade.Sprite`
- Air unit, circles above owner robot (oscillating y-offset)
- Simple AI: if enemy within range → dive toward enemy → fire → return
- Fire rate: every 3s, slightly homing projectile
- Has its own HP (100), can be destroyed
- Placeholder sprite: white rectangle 32×32

### CombatHUD (React component)
- Positioned absolutely over the Phaser canvas
- Contains:
  - Player health bar (top-left, large, with %)
  - Opponent health bar (top-right, smaller)
  - SystemStatus panel (bottom-left)
  - Weapon cooldown bars (bottom-right)
  - Nano repair progress bar (bottom-center)
- All touch-interactive elements min 44px
- Updates from Phaser state via polling or events
- Communication: Phaser writes to a Zustand-compatible bridge or a simple callback

### SystemStatus (React component)
- 6 rows, one per system: Armour, Shields, Weapons, Targeting, Nano Repair, Legs
- Each row shows: icon, name, HP bar with color (green > 70%, yellow 30-70%, red < 30%)
- Tap a system → call `repairController.startRepair(systemId)` via bridge
- Currently repairing system shows pulsing highlight and progress bar
- Only one system can be in repair at a time

### DamageNumber (Phaser UI)
- Floating number that appears at projectile impact point
- Number = damage dealt
- Floats upward and fades out over 1s
- Color: white for normal, yellow for crit, red for system damage

### BattleResult (React page)
- Full-screen overlay with:
  - "VICTORY" (gold) or "DEFEAT" (red) in large font-mecha text
  - Stats display: damage dealt, damage taken, systems repaired, coins earned
  - "Play Again" button → navigate to loadout selection
  - "Return to Menu" button → navigate to Olympus main menu
- Reads from `useBattleStore.result`

## Communication Bridge
Create a simple event emitter that React and Phaser share:
```typescript
// In a shared file or inline in BattleArena
interface HUDState {
  playerHP: number; playerMaxHP: number
  opponentHP: number; opponentMaxHP: number
  systems: SystemStatus[]
  repairProgress: number
  weaponCooldowns: [number, number, number] // 0-1 each
}

// Phaser writes to this every frame (or throttled)
// React reads from this in a useEffect with requestAnimationFrame
```

## Acceptance Criteria
- [ ] Tank spawns near player robot, fires at enemy when in range
- [ ] Drone circles above player, dives to fire
- [ ] Support units take damage and can be destroyed
- [ ] CombatHUD shows live HP for both robots
- [ ] SystemStatus shows 6 bars with correct colors
- [ ] Tapping a system triggers repair (visual feedback)
- [ ] Repair progress bar appears when repairing
- [ ] Damage numbers float on hit
- [ ] BattleResult shows correct stats post-match
