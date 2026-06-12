# Agent 03: Garage & Armory UI

## Objective

Build all non-combat Olympus React screens: Garage (tech tree upgrades), Armory (weapon crafting/upgrade/merge), and Loadout Selection (pre-battle equipment).

## Files You Own

```
src/pages/olympus/Garage.tsx
src/pages/olympus/Armory.tsx
src/pages/olympus/LoadoutSelection.tsx
src/pages/olympus/components/TechTree.tsx
src/pages/olympus/components/TechNode.tsx
src/pages/olympus/components/UpgradePanel.tsx
src/pages/olympus/components/WeaponCard.tsx
src/pages/olympus/components/WeaponSlot.tsx
src/pages/olympus/components/RobotSelector.tsx
src/pages/olympus/components/WeightIndicator.tsx
src/services/upgradeService.ts
```

> Do NOT modify files outside this list unless coordinating with the lead.

## Dependencies

- **Phase 0** provides: store stubs (`src/store/playerStore.ts`, `src/store/loadoutStore.ts`), shared types
- **Agent 05** provides game data files (`src/data/robots.ts`, `src/data/weapons.ts`, `src/data/upgrades.ts`, `src/data/supportUnits.ts`, `src/data/balance.ts`) — these should be delivered early in Phase 1
- `playerStore` contains: `coins: number`, `ownedWeapons: WeaponDef[]`, `unlockedUpgrades: Record<string, number>`, `ownedRobots: string[]`, `equippedSupportUnits: string[]`
- `loadoutStore` contains: `selectedRobot: RobotDef | null`, `equippedWeapons: (WeaponDef | null)[]`, `setRobot()`, `setWeapon(slot, weapon)`

## Detailed Requirements

### Garage Screen (`Garage.tsx`)
- Full-screen scrollable view
- **Tech Tree** section (top 60%): Visual tree showing 6 upgrade systems
- **Upgrade Panel** section (bottom 40%): Detail panel for selected system
- Back button to OlympusHub sub-nav

### Tech Tree (`TechTree.tsx`, `TechNode.tsx`)
- 6 system nodes arranged in a tree/grid layout:
  - Legs → Armour → Shields → Targeting → Nano Repair → Support Units
- Each node shows: system name, current tier, next tier preview
- **States:** Locked (grey) → Available to research (pulsing) → Researching (progress bar) → Unlocked (full color)
- Prerequisites shown via connecting lines between nodes
- Tap a node to select it → UpgradePanel opens

### Upgrade Panel (`UpgradePanel.tsx`)
- Shows selected system details: name, current level, next level stats
- List of tiers with: level number, stat improvement, coin cost, research time
- "Research" button → spends coins, starts research timer
- After research completes → system upgrades apply
- Use `upgradeService.ts` for logic

### Armory Screen (`Armory.tsx`)
- Three tabs: **Produce** | **Upgrade** | **Merge**
- Tab bar at top, content below
- Grid/list of owned weapons as `WeaponCard` components

### Weapon Card (`WeaponCard.tsx`)
- Shows: weapon icon/name, category badge, damage, fire rate, accuracy, weight
- Shows current level/upgrade level
- Tap to select (highlighted border)
- Context-sensitive actions based on current tab

### Produce Tab
- List of all craftable weapons (from `weapons.ts`)
- Each shows: name, stats, coin cost
- "Produce" button → spends coins → weapon added to inventory
- Grayed out if insufficient coins

### Upgrade Tab
- Select owned weapon → shows upgrade options
- Upgrade increases damage/fire rate/accuracy by fixed % per level
- Shows: current stats → next level stats, coin cost
- "Upgrade" button → spends coins → weapon stats increase

### Merge Tab
- Select two owned weapons of same category → merge result preview
- Merge produces a new advanced weapon variant (defined in data)
- Shows: weapon A + weapon B → resulting weapon C
- "Merge" button → consumes both weapons → new weapon added to inventory
- Validation: same category, both owned, not already merged

### Loadout Selection (`LoadoutSelection.tsx`)
- **Robot Selector:** Horizontal scroll of owned robots, tap to select
- **Weapon Slots:** 3 slots (Left Arm, Right Arm, Back) — each shows equipped weapon or "Empty"
- **Weight Indicator:** Shows current total weight / max capacity (from leg level)
- "Confirm Loadout" button → saves to `loadoutStore` → navigates to BattleArena
- Validation: robot selected, all 3 weapons equipped, weight within limit

### Weight Indicator (`WeightIndicator.tsx`)
- Horizontal bar with fill
- Green < 70%, yellow 70-90%, red > 90%
- Numeric display: "24.5 / 30.0 tons"

## Styling
- Dark industrial theme — dark greys, steel blues, neon accent (cyan/green for friendly, red for enemy)
- Robot/mecha aesthetic: angular borders, heavy fonts (use Google Fonts or system), metallic gradients
- All components responsive for iPad (1024×768) down to mobile (375×667)
- Touch-friendly: all buttons/tappable areas min 44px

## Acceptance Criteria
- [ ] Garage shows tech tree with 6 systems, each with multiple tiers
- [ ] Researching an upgrade spends coins and unlocks the next tier after a timer
- [ ] Armory shows owned weapons, can produce new ones with coins
- [ ] Upgrading weapon spends coins and improves stats
- [ ] Merging two weapons consumes them and creates a new advanced variant
- [ ] Loadout selection: pick robot, equip 3 weapons, weight validation
- [ ] All persistent data saves/loads from localStorage via persistenceService
- [ ] Full flow: Garage upgrade → Armory craft → Loadout select → ready for battle
