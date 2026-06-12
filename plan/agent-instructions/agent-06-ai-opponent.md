# Agent 06: AI Opponent

## Objective

Build the AI controller for vs AI mode — a behavior tree that controls the enemy robot in combat. Multiple difficulty levels.

## Files You Own

```
src/game/systems/AIController.ts
```

> Do NOT modify files outside this list unless coordinating with the lead.

## Dependencies

- **Phase 0** provides: shared types (`RobotDef`, `WeaponDef`, `RobotStats`, `SystemStatus`)
- **Agent 02** provides: `Robot` entity class public API (methods like `moveLeft()`, `moveRight()`, `fireWeapon(slot)`, `repairSystem(id)`, and properties like `stats`, `currentHP`, `systems`)
- Coordinate with Agent 02 to get exact Robot API — define a minimal interface that your AI consumes

Expected Robot API (confirm with Agent 02 lead):
```typescript
interface RobotAPI {
  // Position
  x: number;
  y: number;
  
  // Status
  currentHP: number;
  maxHP: number;
  systems: SystemStatus[]; // { id: string, currentHealth: number, maxHealth: number }
  weapons: WeaponDef[];
  
  // Actions
  moveLeft(): void;
  moveRight(): void;
  stopMoving(): void;
  fireWeapon(slot: 'leftArm' | 'rightArm' | 'back'): void;
  repairSystem(systemId: string): void;
  
  // Queries
  distanceTo(target: RobotAPI): number;
  isWeaponReady(slot: string): boolean;
}
```

## Detailed Requirements

### AI Controller Architecture

Use a simple **behavior tree** with the following structure:

```
Selector (Priority)
├── RepairBehavior (highest priority — if systems badly damaged)
│   └── Sequence
│       ├── CheckDamagedSystems → returns true if any system < 30%
│       └── SelectAndRepair → pick most critical system, start repair
├── DefendBehavior (high priority — if taking heavy damage)
│   └── Sequence
│       ├── CheckUnderFire → returns true if HP < 40%
│       └── Retreat → move away from opponent, pause firing
├── AttackBehavior (medium priority — if weapons are ready)
│   └── Sequence
│       ├── CheckWeaponsReady → any weapon off cooldown?
│       ├── CheckInRange → within optimal range?
│       └── FireWeapons → fire available weapons
└── ApproachBehavior (default — move toward opponent)
    └── Sequence
        └── MoveTowardOpponent → advance
```

### Difficulty Levels

| Parameter | Easy | Medium | Hard |
|---|---|---|---|
| Reaction delay | 800ms | 400ms | 100ms |
| Accuracy modifier | 0.6 | 0.85 | 1.0 |
| Repair threshold | 20% HP | 30% HP | 40% HP |
| Weapon fire chance | 40% | 65% | 90% |
| Decision interval | 1000ms | 500ms | 250ms |
| Damage modifier | 0.7 | 1.0 | 1.3 |

### Behavior Details

**RepairBehavior:**
- Check all systems, find the one with lowest health percentage
- If any system < repairThreshold, start repairing it
- Priority order: Weapons > Targeting > Shields > Legs > Armour > Nano Repair (repair system itself is lowest)
- Stay in repair mode until system > 70% or interrupted by incoming damage threshold

**DefendBehavior:**
- When HP drops below 40%, retreat (move away from opponent)
- If shields are damaged, prioritize shield repair
- Reduced weapon fire while retreating
- Exit defense mode when HP > 60%

**AttackBehavior:**
- Check which weapons are off cooldown and in range
- Fire order: back weapon (highest damage) → right arm → left arm
- Aim toward player robot (direction-aware)
- Vary fire timing by difficulty (reaction delay)

**ApproachBehavior:**
- Move toward the opponent
- Maintain ideal firing range (mid-distance)
- If opponent is too close, back up slightly
- If opponent is too far, advance

### Target Selection
- AI targets a random player system when firing (for now)
- Could be enhanced in future to target specific systems strategically

### AI Loadout Selection
When preparing for a match (called before battle starts):
- Randomly select 1 weapon from each slot from available pool
- Prefer weapons that match the AI robot's archetype:
  - Colossus (heavy): prefer artillery + heavy weapons
  - Vanguard (agile): prefer machine guns + light lasers
  - Titan (balanced): random selection

### Integration
- `AIController` is instantiated by `CombatManager` with a reference to the AI's `Robot` entity and the player's `Robot` entity
- `AIController.update(delta)` is called every frame from `BattleScene.update()`
- AI should respect game tick timing — decisions throttled by `decisionInterval`

## Acceptance Criteria
- [ ] AI moves toward opponent and maintains distance
- [ ] AI fires weapons when in range and off cooldown
- [ ] AI repairs damaged systems when health is low
- [ ] AI retreats when severely damaged
- [ ] 3 difficulty levels with distinct behavior
- [ ] AI picks a reasonable loadout before battle
- [ ] AI behavior is deterministic enough to test but varied enough to feel organic
- [ ] No AI cheating (same rules as player — cooldowns, weight limits, etc.)
