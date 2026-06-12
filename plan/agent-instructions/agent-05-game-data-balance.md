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

> Do NOT modify files outside this list unless coordinating with the lead.

## Dependencies

- **Phase 0** provides: shared TypeScript interfaces (`RobotDef`, `WeaponDef`, `UpgradeDef`, `SupportUnitDef`, `RobotStats`, etc.)

## Detailed Requirements

### Data Files

#### `src/data/robots.ts`
```typescript
export const robots: RobotDef[] = [
  {
    id: 'titan',
    name: 'Titan',
    description: 'Balanced all-rounder mech. Reliable in any situation.',
    baseStats: {
      armour: 100,
      shields: 80,
      weaponDamage: 70,
      targeting: 75,
      repairSpeed: 60,
      legCapacity: 30,
      speed: 100, // pixels per second
      hp: 500,
    },
    spriteKey: 'robot_titan',
    unlockCost: 0, // starter robot
  },
  // Colossus: high armour, shields, HP; slow speed, lower weapon damage
  // Vanguard: high speed, weapon damage, targeting; low armour, HP
]
```

At least 3 robots. Titan is free/starter. Others may have unlock costs.

#### `src/data/weapons.ts`
```typescript
export const weapons: WeaponDef[] = [
  {
    id: 'machine_gun',
    name: 'Machine Gun',
    category: 'machineGun',
    slot: 'leftArm' | 'rightArm' | 'back',
    weight: 5,
    baseStats: { damage: 8, fireRate: 0.15, accuracy: 0.8 },
    upgradeLevels: 5, // max upgrade level
    spriteKey: 'weapon_machine_gun',
    coinCost: 100,
    mergeResult: 'heavy_machine_gun', // id of merge result, or null
    mergeRequirements: ['machine_gun', 'machine_gun'], // two weapon IDs
  },
  // +10 more weapons across the 4 categories
]
```

Weapon categories and target count for v1.0:
- **Lasers** (3): Light Laser, Precision Laser, Heavy Laser
- **Missile Systems** (3): Homing Missile, Dumb-Fire Rocket, Cluster Missile
- **Machine Guns** (2): Machine Gun, Heavy Machine Gun
- **Artillery** (2): Light Artillery, Heavy Artillery
- **Merge-only** (2+): Advanced variants from merging

#### `src/data/upgrades.ts`
Tech tree definition — 6 systems, each with 3+ tiers:

```typescript
export const upgradeSystems: UpgradeSystem[] = [
  {
    id: 'legs',
    name: 'Legs',
    icon: 'legs',
    description: 'Increases weapon weight capacity',
    tiers: [
      { level: 1, statBonus: { legCapacity: 5 }, coinCost: 0, researchTime: 0 }, // base
      { level: 2, statBonus: { legCapacity: 10 }, coinCost: 200, researchTime: 30 },
      { level: 3, statBonus: { legCapacity: 20 }, coinCost: 500, researchTime: 60 },
      { level: 4, statBonus: { legCapacity: 35 }, coinCost: 1000, researchTime: 120 },
    ],
    prerequisiteSystem: null, // no prerequisite for first system
  },
  // Armour, Shields, Targeting, Nano Repair, Support Units
]
```

Prerequisites example: Shields tier 2 requires Armour tier 1.

#### `src/data/supportUnits.ts`
```typescript
export const supportUnits: SupportUnitDef[] = [
  {
    id: 'assault_tank',
    name: 'Assault Tank',
    type: 'tank',
    stats: { hp: 200, damage: 15, fireRate: 1.0, speed: 50 },
    coinCost: 500,
    upgradeLevels: 3,
    spriteKey: 'tank_assault',
  },
  // +1-2 more (defense tank, attack drone, support drone)
]
```

#### `src/data/balance.ts`
```typescript
export const BALANCE = {
  // Coin economy
  startingCoins: 100,
  coinPerBattleWin: 50,
  coinPerBattleLoss: 15,
  
  // Multipliers (per opponent difficulty)
  difficultyMultiplier: { easy: 0.5, medium: 1.0, hard: 1.5 },
  
  // Repair
  baseRepairTime: 10, // seconds for full system repair at repairSpeed=1
  
  // Weapon upgrade
  weaponUpgradeStatMultiplier: 0.15, // +15% per upgrade level
  weaponUpgradeCostMultiplier: 1.5, // cost increases 1.5x per level
  
  // Limits
  maxWeaponUpgradeLevel: 5,
  maxRobotUpgradeTier: 4,
} as const;
```

### Services

#### `economyService.ts`
```typescript
// Pure functions
export function canAfford(coins: number, cost: number): boolean
export function spend(coins: number, cost: number): number // returns new balance
export function earn(coins: number, amount: number): number
export function calculateBattleReward(won: boolean, difficulty: string): number
export function calculateUpgradeCost(baseCost: number, currentTier: number): number
```

#### `persistenceService.ts`
```typescript
export function saveGameState(state: GameState): void
export function loadGameState(): GameState | null
export function resetGameState(): void
export function migrateSchemaVersion(data: unknown): GameState // handle future version bumps
```
- Uses localStorage
- GameState includes: coins, ownedWeapons[], unlockedUpgrades{}, ownedRobots[], equippedLoadout, supportUnits[]
- Schema version field for future migration

#### `combatService.ts`
```typescript
// Simulates a battle result for display (not the real-time Phaser combat)
export function simulateBattle(playerLoadout: Loadout, opponentRobot: RobotDef, difficulty: string): BattleResult
// BattleResult = { won: boolean, damageDealt: number, damageTaken: number, systemsRepaired: number, coinsEarned: number }
```

## Acceptance Criteria
- [ ] 3 robot definitions with distinct stat profiles
- [ ] 10+ weapon definitions covering all 4 categories
- [ ] Tech tree with 6 systems, each with 3-4 tiers, prerequisite chains
- [ ] 2-3 support unit definitions
- [ ] Economy balance constants defined and documented
- [ ] All services are pure functions with no side effects (except persistence)
- [ ] Persistence service saves/loads full game state from localStorage
- [ ] Data files importable and type-safe
