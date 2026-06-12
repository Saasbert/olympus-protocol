# Agent 03a: Garage + TechTree

## Objective

Build the Garage screen with tech tree visualization, upgrade panel, and upgrade service logic.

## Files You Own

```
src/pages/olympus/Garage.tsx
src/pages/olympus/components/TechTree.tsx
src/pages/olympus/components/TechNode.tsx
src/pages/olympus/components/UpgradePanel.tsx
src/services/upgradeService.ts
```

## Dependencies

- **Agent 05** provides game data: `src/data/upgrades.ts`, `src/data/balance.ts`, `src/data/robots.ts`
- `playerStore` from Phase 0: `ownedRobots`, `unlockedUpgrades: Record<string, number>`, `coins`
- If Agent 05 data isn't ready yet, use inline mock data matching these types:

```typescript
interface UpgradeSystem {
  id: string; name: string; icon: string
  description: string
  tiers: UpgradeTier[]
  prerequisiteSystem: string | null
  prerequisiteTier: number
}
interface UpgradeTier {
  level: number; statBonus: Partial<RobotStats>
  coinCost: number; researchTime: number
}
```

## Requirements

### Garage Screen (`Garage.tsx`)
- Two-section layout: TechTree (top 60%) + UpgradePanel (bottom 40%)
- Back button to OlympusHub sub-nav
- Responsive: stacks vertically on mobile

### TechTree (`TechTree.tsx`, `TechNode.tsx`)
- 6 system nodes arranged in a branching layout:
  - Legs (root) → Armour → Shields
  - Legs → Weapons → Targeting
  - Legs → Nano Repair → Support Units
- Drawing: CSS-only (no canvas) — use flexbox/grid with SVG or CSS lines between nodes
- Each `TechNode` shows: system icon, name, current tier
- States:
  - **Locked** (grey, prerequisite not met) — show requirement tooltip
  - **Available** (pulsing cyan border, prerequisite met but not yet researched)
  - **Researching** (animated progress ring, timer counting down)
  - **Unlocked** (full color, shows current tier level)
- Tap an Available/Unlocked node → UpgradePanel shows details

### UpgradePanel (`UpgradePanel.tsx`)
- Selected system name + icon at top
- Current tier display with stat bonuses applied
- Next tier preview (if exists): shows stat improvements, coin cost, research time
- "Research" button → validates coins via `useCoinStore.spendCoins()`
- If researching: show progress bar with remaining time
- "Cancel" button to stop research (50% coins refunded or not — up to you)
- If max tier already: "MAX LEVEL" badge

### upgradeService.ts
```typescript
export function canResearch(system: UpgradeSystem, currentTier: number, coins: number, unlockedUpgrades: Record<string, number>): boolean
export function getNextTier(system: UpgradeSystem, currentTier: number): UpgradeTier | null
export function getPrerequisiteMet(system: UpgradeSystem, unlockedUpgrades: Record<string, number>): boolean
export function applyUpgrade(system: UpgradeSystem, tier: UpgradeTier, playerStats: RobotStats): RobotStats
```

Also integrate `persistenceService` — upgrades save to localStorage via `playerStore`.

## Acceptance Criteria
- [ ] 6 system nodes visible with prerequisite connections
- [ ] Nodes show correct state (locked/available/researching/unlocked)
- [ ] Tap node → upgrade panel shows details
- [ ] Research button works: spends coins, starts timer, unlocks on completion
- [ ] Prerequisite chains enforced (can't research Shields T2 before Armour T1)
- [ ] Max tier displays correctly
- [ ] Stats stored/loaded from persistence
