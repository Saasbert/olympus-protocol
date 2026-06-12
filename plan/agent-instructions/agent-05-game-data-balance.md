# Agent 05: Game Data & Balance

## Objective

Define all static game data (robots, weapons, upgrades, support units, economy balance) and implement pure-logic services for economy, persistence, and combat simulation.

## Files You Own

```
src/data/robots.ts
src/data/weapons.ts
src/data/upgrades.ts
src/data/supportUnits.ts
src/data/balance.ts
src/services/economyService.ts
src/services/persistenceService.ts
src/services/combatService.ts
```

## Requirements

### `src/data/robots.ts`

3 robots with distinct stat profiles. Export as `const robots: RobotDef[]`.

```typescript
interface RobotDef {
  id: string; name: string; description: string
  baseStats: RobotStats
  spriteKey: string; unlockCost: number
}
interface RobotStats {
  armour: number; shields: number; weaponDamage: number
  targeting: number; repairSpeed: number; legCapacity: number
  speed: number; hp: number
}
```

- **Titan:** Balanced — all stats ~70-80, unlockCost=0 (starter)
- **Colossus:** Heavy — high armour(120), shields(100), hp(700); low speed(70), weaponDamage(50)
- **Vanguard:** Agile — high speed(140), weaponDamage(90), targeting(90); low armour(50), hp(350)

### `src/data/weapons.ts`

10+ weapons across 4 categories, 3 slots.

**Lasers (3):** Light Laser (left, damage=10, weight=3), Precision Laser (right, damage=15, weight=4), Heavy Laser (back, damage=35, weight=10)
**Missiles (3):** Homing Missile (right, damage=12, weight=5), Dumb-Fire Rocket (back, damage=25, weight=8), Cluster Missile (back, damage=30, weight=12)
**Machine Guns (2):** Machine Gun (left, damage=5, weight=3), Heavy MG (left, damage=8, weight=5)
**Artillery (2):** Light Artillery (back, damage=40, weight=12), Heavy Artillery (back, damage=60, weight=18)
**Merge-only (2+):** Plasma Cannon (merge Laser+Homing), Railgun (merge Heavy Laser+Heavy Art)

Each weapon: `coinCost`, `upgradeLevels: 5`, `upgradeStatMultiplier: 0.15`, `mergeResult`/`mergeRequirements` as applicable.

### `src/data/upgrades.ts`

6 systems, each with 3-4 tiers. Prerequisites chain:
- Legs (root, no prereq) → tiers increase weight capacity
- Armour (requires Legs T1) → damage reduction
- Shields (requires Armour T1) → shield HP + regen rate
- Weapons (requires Legs T1) → weapon damage multiplier
- Targeting (requires Weapons T1) → accuracy multiplier
- Nano Repair (requires Legs T1) → repair speed
- Support Units (requires Nano Repair T1) → unlock/upgrade unit stats

### `src/data/supportUnits.ts`

2-3 units:
- Assault Tank (ground, offensive, cost=500)
- Defense Tank (ground, defensive, cost=400)
- Scout Drone (air, scout/harass, cost=600)

### `src/data/balance.ts`

```typescript
export const BALANCE = {
  startingCoins: 100,
  coinPerBattleWin: 50, coinPerBattleLoss: 15,
  difficultyMultiplier: { easy: 0.5, medium: 1.0, hard: 1.5 },
  baseRepairTime: 10, // seconds
  weaponUpgradeStatMultiplier: 0.15,
  weaponUpgradeCostMultiplier: 1.5,
  maxWeaponUpgradeLevel: 5,
  maxRobotUpgradeTier: 4,
  coinEarnRatePerSpellingWord: 5,
  coinEarnRatePerMathProblem: 10,
}
```

### `economyService.ts`
```typescript
export function canAfford(coins: number, cost: number): boolean
export function spend(coins: number, cost: number): number
export function earn(coins: number, amount: number): number
export function calculateBattleReward(won: boolean, difficulty: string): number
export function calculateUpgradeCost(baseCost: number, currentTier: number): number
```

### `persistenceService.ts`
```typescript
export function saveGameState(state: GameState): void
export function loadGameState(): GameState | null
export function resetGameState(): void
```
- localStorage with schema versioning
- Full GameState: coins, ownedWeapons, unlockedUpgrades, ownedRobots, loadout, supportUnits

### `combatService.ts`
```typescript
export function simulateBattle(playerLoadout: Loadout, opponentRobot: RobotDef, difficulty: string): BattleResult
```
- Quick approximate calculation (not real-time Phaser)
- Used for after-battle summary stats

## Acceptance Criteria
- [ ] 3 robots with balanced stat profiles
- [ ] 10+ weapons across 4 categories
- [ ] Tech tree with 6 systems, prerequisites, 3-4 tiers each
- [ ] 2-3 support units
- [ ] All services pure functions with no side effects
- [ ] Persistence saves/loads full game state with versioning
- [ ] Data files type-safe, importable by other agents
