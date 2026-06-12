# Agent 03b: Armory + Loadout Selection

## Objective

Build the Armory screen (weapon produce/upgrade/merge) and the Loadout Selection screen (robot picker + weapon slots + weight validation).

## Files You Own

```
src/pages/olympus/Armory.tsx
src/pages/olympus/LoadoutSelection.tsx
src/pages/olympus/components/WeaponCard.tsx
src/pages/olympus/components/WeaponSlot.tsx
src/pages/olympus/components/RobotSelector.tsx
src/pages/olympus/components/WeightIndicator.tsx
```

## Dependencies

- **Agent 05** provides game data: `src/data/weapons.ts`, `src/data/robots.ts`, `src/data/balance.ts`
- `playerStore`: `ownedWeapons: OwnedWeapon[]`, `ownedRobots: string[]`, `coins`
- `loadoutStore`: `selectedRobot`, `equippedWeapons[3]`, `setRobot()`, `setWeapon()`
- If Agent 05 data isn't ready, use inline mock data matching types:

```typescript
interface WeaponDef {
  id: string; name: string; category: string
  slot: 'leftArm' | 'rightArm' | 'back'; weight: number
  baseStats: { damage: number; fireRate: number; accuracy: number }
  upgradeLevels: number; coinCost: number; spriteKey: string
  mergeResult?: string; mergeRequirements?: [string, string]
}
interface OwnedWeapon { id: string; level: number }
```

## Requirements

### Armory Screen (`Armory.tsx`)
- Three tabs: **Produce** | **Upgrade** | **Merge**
- Tab bar at top
- Content area shows weapons grid (2-3 columns)
- Empty state: "No weapons yet! Craft some in the Produce tab."

### WeaponCard (`WeaponCard.tsx`)
- Shows: weapon name, category badge color-coded (Laser=cyan, Missile=red, MachineGun=amber, Artillery=orange), stats (damage/fire rate/accuracy), weight, level
- Owned weapons have full opacity, unowned are greyed
- Selected weapon has highlighted border
- Tap to select (context-sensitive action based on current tab)

### Produce Tab
- List all craftable weapons from `weapons.ts`
- Each card shows: name, stats preview, coin cost
- "Produce" button → call `playerStore.addWeapon(id)` + `coinStore.spendCoins(cost)`
- Greyed if insufficient coins
- Already owned weapons show "OWNED" badge

### Upgrade Tab
- Shows only owned weapons
- Select weapon → shows current stats → next level stats preview
- "Upgrade" button → call `playerStore.upgradeWeapon(id)` + `coinStore.spendCoins(cost)`
- Cost formula: `baseCost × upgradeCostMultiplier^currentLevel` from balance.ts
- Max level: show "MAX LEVEL" badge, disable upgrade

### Merge Tab
- Select two owned weapons of the same category
- Merge result preview card shown when both selected
- "Merge" button → consume both weapons → add result weapon to inventory
- Validation: same category, both owned, result not already owned
- Merge results defined by `weapon.mergeResult` and `weapon.mergeRequirements`

### LoadoutSelection (`LoadoutSelection.tsx`)
- **Robot Selector:** Horizontal scrollable row of owned robots, tap to select (highlighted border), shows name + archetype
- **Weapon Slots:** 3 large slots labeled "Left Arm", "Right Arm", "Back"
  - Each shows equipped weapon card or "Empty" placeholder
  - Tap slot → opens weapon picker modal (filters by compatible slot)
  - Weapon picker shows owned weapons filtered by slot compatibility
- **Weight Indicator:** `WeightIndicator` component below slots
- **Enter Battle button:** disabled until: robot selected, all 3 slots filled, weight ≤ capacity
- On enter: save to `useLoadoutStore`, navigate to `/olympus/battle`

### WeightIndicator
- Horizontal bar, fill = current / max
- Color: green < 70%, yellow 70-90%, red > 90%
- Numeric: "24.5 / 30.0 tons"
- Max capacity from `legCapacity` (base stat + upgrade bonuses)
- Weight from sum of equipped weapons

## Styling
- Dark industrial theme: dark grey backgrounds, cyan accents for active/owned
- All buttons/tappable areas min 44px
- Responsive: single column on mobile, 2-3 column grid on iPad

## Acceptance Criteria
- [ ] Armory shows 3 tabs with correct content
- [ ] Crafting weapon spends coins and adds to inventory
- [ ] Upgrading weapon spends coins and increases level/stats
- [ ] Merging two weapons consumes them and creates new variant
- [ ] Loadout selection: robot picker works
- [ ] Weapon slots allow pick from owned weapons filtered by slot
- [ ] Weight indicator shows correct fill/color
- [ ] Cannot enter battle with invalid loadout
- [ ] All state persists via playerStore → persistenceService
