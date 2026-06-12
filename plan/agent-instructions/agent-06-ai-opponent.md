# Agent 06: AI Opponent

## Objective

Build the AI controller for vs AI mode — a behavior tree that controls the opponent robot with 3 difficulty levels.

## Files You Own

```
src/game/systems/AIController.ts
```

## Dependencies

- Agent 02a's `Robot` entity public API (detailed below)
- If Robot class isn't ready, build against this interface:

```typescript
interface RobotAI {
  x: number; y: number
  currentHP: number; maxHP: number
  stats: { speed: number; weaponDamage: number; targeting: number }
  systems: { id: string; currentHealth: number; maxHealth: number }[]
  weapons: { isReady: boolean; fire(): boolean; category: string }[]
  moveLeft(): void; moveRight(): void; stopMoving(): void
  fireWeapon(slot: 0 | 1 | 2): void
  repairSystem(systemId: string): void
  distanceTo(target: RobotAI): number
}
```

## Requirements

### Architecture: Behavior Tree

```
PrioritySelector
├── RepairBehavior (highest)
│   └── Sequence [CheckCriticalDamage → SelectAndRepair]
├── DefendBehavior
│   └── Sequence [CheckLowHP → Retreat]
├── AttackBehavior
│   └── Sequence [CheckWeaponsReady → CheckInRange → FireWeapons]
└── ApproachBehavior (default)
    └── MoveTowardOpponent
```

### Behaviors

**RepairBehavior:**
- Check if any system < repairThreshold (varies by difficulty)
- Priority order: Weapons > Targeting > Shields > Legs > Armour > NanoRepair
- Repair until system > 70% or interrupted by damage

**DefendBehavior:**
- When HP < 40%, retreat (move away from opponent)
- Prioritize shield repair
- Reduced weapon fire
- Exit when HP > 60%

**AttackBehavior:**
- Fire order: back (highest damage) → right arm → left arm
- Vary fire timing by difficulty (reaction delay)
- Aim correctly (direction-aware)

**ApproachBehavior:**
- Move toward opponent
- Maintain ideal mid-range distance
- Back up if too close, advance if too far

### Difficulty Levels

| Parameter | Easy | Medium | Hard |
|---|---|---|---|
| Reaction delay | 800ms | 400ms | 100ms |
| Accuracy modifier | 0.6 | 0.85 | 1.0 |
| Repair threshold | 20% | 30% | 40% |
| Weapon fire chance | 40% | 65% | 90% |
| Decision interval | 1000ms | 500ms | 250ms |
| Damage modifier | 0.7 | 1.0 | 1.3 |

### AI Loadout Selection
Before battle:
- Colossus → prefer artillery + heavy weapons
- Vanguard → prefer machine guns + light lasers
- Titan → random balanced selection

### Integration
- `AIController` instantiated by `CombatManager`
- `constructor(aiRobot: RobotAI, playerRobot: RobotAI, difficulty: string)`
- `update(delta: number)`: called every frame
- Decisions throttled by `decisionInterval`

## Acceptance Criteria
- [ ] AI moves toward opponent and maintains distance
- [ ] AI fires weapons when in range and off cooldown
- [ ] AI repairs damaged systems when health is threshold-crossed
- [ ] AI retreats when severely damaged
- [ ] 3 distinct difficulty levels
- [ ] AI picks reasonable loadout for its archetype
- [ ] No cheating — same rules as player
