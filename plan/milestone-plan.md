# Olympus Protocol — v1.0 Milestone Plan

## Goal

Ship a playable v1.0 of Olympus Protocol in minimum calendar time using parallel agents.

## Approach

- **Sequential only where necessary** (Phase 0 shared foundations)
- **Maximum parallelism** (Phase 1: 6 agents working simultaneously)
- **Integration in waves** (Phase 2: sequential integration passes)
- **v1.0 scope:** vs AI mode only, 3 robots, 10+ weapons, full Garage + Armory, single arena, local play

---

## Phase 0: Foundation (2-4 hours)

| Step | What | Who |
|---|---|---|
| 0.1 | Scaffold Vite + React + TS + Tailwind + Phaser project | Lead |
| 0.2 | Install all dependencies, configure path aliases | Lead |
| 0.3 | Define all shared TypeScript interfaces | Lead |
| 0.4 | Create Zustand store stubs with type definitions | Lead |
| 0.5 | Set up PWA plugin config | Lead |
| 0.6 | Create full directory structure (empty files as placeholders) | Lead |
| 0.7 | Push to GitHub (saasbert account) | Lead |
| **Done when:** Repo ready, types defined, all agents can start concurrently | |

---

## Phase 1: Parallel Build (2-3 days parallel)

### Workstream A — PWA Shell & Navigation (4-6 hours)

| Step | What |
|---|---|
| A.1 | App shell layout, responsive grid |
| A.2 | Bottom tab navigation (Spelling, Math, Olympus) |
| A.3 | Coin balance header component |
| A.4 | Home page with section cards |
| A.5 | OlympusHub sub-navigation |
| A.6 | Stub pages for Spelling/Math |
| A.7 | PWA manifest + offline handling |
| A.8 | Touch navigation gestures |

### Workstream B — Phaser Battle Engine (12-16 hours, largest workstream)

| Step | What |
|---|---|
| B.1 | Phaser game factory + config, React integration in BattleArena |
| B.2 | BootScene + PreloadScene with loading bar |
| B.3 | BattleScene scaffold (arena background, camera follow) |
| B.4 | Robot entity with movement (left/right, idle) |
| B.5 | InputController (touch joystick + keyboard) |
| B.6 | Weapon system — 3-slot firing with cooldowns |
| B.7 | Projectile entities + collision detection |
| B.8 | DamageCalculator — armour/shields/HP layers |
| B.9 | RepairController — system repair menu |
| B.10 | TargetingController — accuracy modifier |
| B.11 | Support unit entities (tank + drone AI) |
| B.12 | CombatHUD (React overlay) — health, systems, repair |
| B.13 | BattleResult screen — win/loss summary |
| B.14 | PhysicsController — arena bounds |

### Workstream C — Garage & Armory (8-10 hours)

| Step | What |
|---|---|
| C.1 | Garage screen layout |
| C.2 | TechTree component (visual tree with nodes) |
| C.3 | TechNode component (locked/researching/unlocked states) |
| C.4 | UpgradePanel component (select tier, see cost, purchase) |
| C.5 | upgradeService logic |
| C.6 | Armory screen layout |
| C.7 | WeaponCard component (stats display) |
| C.8 | Weapon crafting flow (select → pay → produce) |
| C.9 | Weapon upgrade flow (select → pay → upgrade) |
| C.10 | Weapon merge flow (select 2 → merge → new weapon) |
| C.11 | LoadoutSelection screen |
| C.12 | RobotSelector component |
| C.13 | WeaponSlot components (x3, with drop targets) |
| C.14 | WeightIndicator component |

### Workstream D — Asset Pipeline (6-8 hours, can overlap with coding)

| Step | What |
|---|---|
| D.1 | Generate AI prompts for robot pixel art (3 robots) |
| D.2 | Generate robot sprites, clean up in Aseprite |
| D.3 | Generate weapon effect sprites (laser, missile, bullet, explosion) |
| D.4 | Generate support unit sprites (tank, drone) |
| D.5 | Generate arena backgrounds (2-3 variants, 2 layers) |
| D.6 | Generate UI elements (health bars, icons, buttons) |
| D.7 | Create sprite atlases (PNG + JSON) using TexturePacker |
| D.8 | Define Phaser animation configs per sprite sheet |

### Workstream E — Game Data & Balance (4-6 hours, fastest workstream)

| Step | What |
|---|---|
| E.1 | Define 3 robot stat profiles (balanced, heavy, agile) |
| E.2 | Define 10-12 weapons across 4 categories |
| E.3 | Define tech tree structure (6 systems × 3+ tiers) |
| E.4 | Define support unit stats (2-3 units) |
| E.5 | Economy balance constants (coin earn rates, costs) |
| E.6 | economyService — purchase validation |
| E.7 | persistenceService — localStorage save/load |
| E.8 | combatService — result simulation |

### Workstream F — AI Opponent (4-6 hours, after B entity interfaces)

| Step | What |
|---|---|
| F.1 | AI behavior tree framework |
| F.2 | Idle/approach behavior |
| F.3 | Attack behavior (weapon selection, firing) |
| F.4 | Defend behavior (retreat, shield priority) |
| F.5 | Repair behavior (prioritize damaged systems) |
| F.6 | Difficulty tuning (Easy/Medium/Hard) |
| F.7 | AI loadout selection |

---

## Phase 2: Integration & Polish (2-3 days)

| Wave | What | Involves |
|---|---|---|
| 2.1 | **Data → UI integration:** Wire game data into Garage/Armory UI | Agent 03 + 05 |
| 2.2 | **Loadout → Battle integration:** Pass loadout from React to Phaser | Agent 02 + 03 |
| 2.3 | **AI → Battle integration:** AI opponent fights player | Agent 02 + 06 |
| 2.4 | **Assets → Game integration:** Replace placeholders with real sprites | Agent 02 + 04 |
| 2.5 | **Full economy loop:** Coins → Garage/Armory → Battle → Coins | All agents |
| 2.6 | **Polish:** Responsive fixes, touch tuning, visual consistency | Lead |
| 2.7 | **PWA testing:** Install, offline, performance on iPad/mobile | Lead |

---

## v1.0 Definition of Done

| Criteria | Status |
|---|---|
| Player can select a robot and loadout | ✓ |
| Player can enter vs AI battle | ✓ |
| Player can move, fire weapons, repair systems | ✓ |
| AI opponent fights back with basic strategy | ✓ |
| Health depletion wins/loses the match | ✓ |
| Post-battle result screen with coins earned | ✓ |
| Garage tech tree works: research → unlock → apply upgrades | ✓ |
| Armory crafting/upgrade/merge works | ✓ |
| Coins persist across sessions (localStorage) | ✓ |
| Full UI navigable on iPad touch | ✓ |
| PWA installable and runs offline | ✓ |
