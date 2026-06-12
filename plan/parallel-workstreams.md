# Parallel Workstreams for v1.0

## Strategy

We minimize lead time by defining **shared interfaces first** (data types, store shapes, event contracts), then running all workstreams in parallel with clear boundaries. Each agent owns files/folders and does not touch others'.

## Phase 0: Foundation (Sequential, 1 agent, ~1 session)

Sets up shared types, interfaces, and tooling that all agents depend on.

| Task | Output |
|---|---|
| Initialize Vite + React + TS + Tailwind + Phaser project | `package.json`, configs |
| Install dependencies | `node_modules/`, lockfile |
| Set up `@/` path alias | `tsconfig.json`, `vite.config.ts` |
| Define all TypeScript interfaces (robot, weapon, upgrade, support unit, battle state) | `src/types/` (or inline in data files) |
| Define Zustand store shapes (coin, player, loadout, battle) | `src/store/*.ts` (stubs with types, no logic) |
| Set up PWA manifest + service worker config | `vite.config.ts` plugin config |
| Create directory structure | All folders from codebase-structure.md |

**Shared Type Interfaces (must be defined before parallel work begins):**

```typescript
// Core types that all agents reference
interface RobotDef { id: string; name: string; baseStats: RobotStats; spriteKey: string; }
interface RobotStats { armour: number; shields: number; weaponDamage: number; targeting: number; repairSpeed: number; legCapacity: number; }
interface WeaponDef { id: string; name: string; category: 'laser' | 'missile' | 'machineGun' | 'artillery'; slot: 'leftArm' | 'rightArm' | 'back'; weight: number; damage: number; fireRate: number; accuracy: number; spriteKey: string; }
interface UpgradeDef { id: string; name: string; system: keyof RobotStats; tiers: UpgradeTier[]; }
interface SupportUnitDef { id: string; name: string; type: 'tank' | 'drone'; stats: SupportStats; }
// Store shapes defined in src/store/*.ts
```

## Phase 1: Parallel Workstreams (5 agents, simultaneous)

### Workstream A: PWA Shell & Navigation (Agent 01)
**Owner file area:** `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/components/*`, `src/pages/Home.tsx`, `src/pages/SpellingGame.tsx`, `src/pages/MathGame.tsx`, `src/pages/olympus/OlympusHub.tsx`

**Dependencies:** Phase 0 store stubs, shared types

**Deliverables:**
- App shell with tab navigation (Spelling, Math, Olympus)
- Coin balance display in header
- Responsive layout (iPad/mobile/desktop)
- Stub pages for Spelling/Math games
- OlympusHub section wrapper with sub-nav (Menu, Garage, Armory)
- PWA manifest + offline fallback page
- Touch-friendly nav gestures

**Testable independently:** Yes — full navigation works with placeholder pages

---

### Workstream B: Phaser Battle Engine (Agent 02)
**Owner file area:** `src/game/*`, `src/pages/olympus/BattleArena.tsx`, `src/pages/olympus/BattleResult.tsx`, `src/pages/olympus/components/CombatHUD.tsx`, `src/pages/olympus/components/SystemStatus.tsx`

**Dependencies:** Phase 0 store stubs, shared types, placeholder sprites (colored rectangles)

**Deliverables:**
- Phaser canvas integration in React (`BattleArena.tsx`)
- `BootScene` + `PreloadScene` with loading bar
- `BattleScene` — side-scrolling arena with basic movement
- `Robot` entity — walk left/right, idle, fire animations
- `Weapon` system — 3 slot firing with cooldowns
- `Projectile` entities — lasers, missiles, bullets
- `DamageCalculator` — armour > shields > HP damage flow
- `RepairController` — player-selected system repair
- `TargetingController` — accuracy modifier
- `InputController` — touch joystick + buttons, keyboard support
- `PhysicsController` — arena bounds, collision detection
- `CombatHUD` (React overlay) — health bars, system status, repair buttons
- `BattleResult` — win/loss screen with coins earned

**Testable independently:** Yes — use placeholder rectangles for sprites, hardcoded robot stats

---

### Workstream C: Garage & Armory UI (Agent 03)
**Owner file area:** `src/pages/olympus/Garage.tsx`, `src/pages/olympus/Armory.tsx`, `src/pages/olympus/LoadoutSelection.tsx`, `src/pages/olympus/components/TechTree.tsx`, `src/pages/olympus/components/TechNode.tsx`, `src/pages/olympus/components/UpgradePanel.tsx`, `src/pages/olympus/components/WeaponCard.tsx`, `src/pages/olympus/components/WeaponSlot.tsx`, `src/pages/olympus/components/RobotSelector.tsx`, `src/pages/olympus/components/WeightIndicator.tsx`, `src/services/upgradeService.ts`

**Dependencies:** Phase 0 store stubs, shared types, game data files

**Deliverables:**
- Garage screen with tech tree visualization (React + CSS grid/flexbox)
- Tech tree nodes: locked → researchable → unlocked states
- Upgrade panel — select system, view tiers, spend coins
- Armory screen with weapon grid
- Weapon crafting — select weapon, pay coins, produce
- Weapon upgrade — select owned weapon, pay coins, upgrade stats
- Weapon merge — select two weapons, merge into new variant
- Loadout selection — robot picker + 3 weapon slots + weight indicator
- Validation: weight limit, slot compatibility, owned weapons only

**Testable independently:** Yes — full UI with mock data from `src/data/`

---

### Workstream D: Asset Pipeline (Agent 04)
**Owner file area:** `public/assets/*`

**Dependencies:** None (can start immediately)

**Deliverables:**
- AI-generated robot sprite sheets (3+ robot types, pixel art style)
- AI-generated weapon sprites (laser beams, missile trails, explosions)
- AI-generated support unit sprites (tank, drone)
- AI-generated arena backgrounds (2-3 variants, 2-layer parallax)
- AI-generated UI elements (health bar frames, system icons, buttons)
- All exported as PNG sprite sheets + JSON atlas files
- `src/game/scenes/PreloadScene.ts` asset manifest updated
- Animation definitions per robot (idle, walk, fire, hit, destroyed)

**Testable independently:** Partial — visual inspection of sprites; animation testing requires Phaser scene

---

### Workstream E: Game Data & Balance (Agent 05)
**Owner file area:** `src/data/*`, `src/services/economyService.ts`, `src/services/persistenceService.ts`, `src/services/combatService.ts`

**Dependencies:** Phase 0 shared types

**Deliverables:**
- `src/data/robots.ts` — 3+ robot definitions with unique stat profiles
- `src/data/weapons.ts` — 10+ weapon definitions across 4 categories
- `src/data/upgrades.ts` — Tech tree structure, 3+ tiers per system, costs
- `src/data/supportUnits.ts` — 2-3 support unit definitions
- `src/data/balance.ts` — Economy constants (coin earn rates, costs)
- `economyService.ts` — Purchase validation, coin spend/earn logic
- `persistenceService.ts` — localStorage save/load with schema versioning
- `combatService.ts` — Simulated combat result (for after-battle summary)

**Testable independently:** Yes — pure data + service logic, unit-testable

---

### Workstream F: AI Opponent (Agent 06)
**Owner file area:** `src/game/systems/AIController.ts`

**Dependencies:** Phase 0 shared types, Phase 1 Workstream B entities (Robot, Weapon interfaces)

**Deliverables:**
- Basic AI behavior tree:
  - **Idle:** approach opponent
  - **Attack:** fire weapons when in range
  - **Defend:** retreat or shield when taking damage
  - **Repair:** prioritize nano repair when systems damaged
- AI difficulty levels (Easy / Medium / Hard) via tunable parameters
- AI loadout selection (random from available weapons)
- AI targets player systems (random or strategic)

**Testable independently:** Yes — can be tested headless against BattleScene mock

## Integration Sequence

After all Phase 1 workstreams complete:

1. **Integration pass 1:** Wire store data through Garage/Armory → Loadout → Battle (Agent 02 + 03 handoff)
2. **Integration pass 2:** Connect AI opponent to BattleScene (Agent 02 + 06 handoff)
3. **Integration pass 3:** Replace placeholder sprites with real assets (Agent 02 + 04 handoff)
4. **Integration pass 4:** End-to-end testing: coin earn → spend in Garage/Armory → battle → earn coins
5. **Polish pass:** Performance, touch responsiveness, visual consistency, PWA testing

## Dependency Graph

```
Phase 0 (Foundation)
    │
    ├──▶ Workstream A (PWA Shell) ─── no deps on other phase 1 agents
    ├──▶ Workstream B (Phaser Engine) ─── needs placeholder assets
    ├──▶ Workstream C (Garage/Armory) ─── needs game data from E
    ├──▶ Workstream D (Assets) ─── no deps on code
    ├──▶ Workstream E (Game Data) ─── no deps on other phase 1 agents
    └──▶ Workstream F (AI) ─── needs entity interfaces from B
```

**Key insight:** Workstream C depends on Workstream E's data files, but E is fast (pure data) so C can start after E delivers. Workstream F depends on B's entity interfaces, which are defined in Phase 0 shared types.

## Parallel Agent Coordination

| Handoff | From | To | Interface |
|---|---|---|---|
| Store shapes | Phase 0 | All | `src/store/*.ts` type definitions |
| Game data | Agent 05 | Agent 03 | `src/data/*.ts` exports |
| Robot entity class | Agent 02 | Agent 06 | Robot class public API |
| Sprite keys | Agent 04 | Agent 02 | Asset paths in `public/assets/` |
| Loadout store | Agent 03 | Agent 02 | Zustand `loadoutStore` |
| Battle result | Agent 02 | Agent 01 | Zustand `battleStore` |
