# Olympus Protocol — Game Design Specification

**Designed by:** Rob & Pearce  
**Version:** 0.1 — Initial Draft

---

## Overview

Olympus Protocol is a 2D side-scrolling one-on-one mech fighter PWA game. Players command colossal skyscraper-sized robots in head-to-head combat, supported by drones and tanks. The aesthetic draws from 1980s anime mecha (Robotech, Transformers) — angular, industrial, epic in scale. Players are the gods of Olympus commanding their titans below.

The game exists as a section within a larger PWA app that also hosts an educational spelling and math game. Coins earned in the educational games are spent in Olympus Protocol's upgrade systems.

---

## Platform

- **Type:** Progressive Web App (PWA)
- **Integration:** Single unified PWA app with multiple sections (educational games + Olympus Protocol)
- **Coin system:** Shared cross-section economy — coins earned in spelling/math flow directly into Olympus Protocol
- **Target devices:** iPad and mobile (touch-first design), desktop supported

---

## Game Modes

| Mode | Description |
|---|---|
| **vs AI** | Single player against AI-controlled opponent robot |
| **vs Human** | Two human players on separate devices (local/online) |

Both modes are accessible from the main menu as two distinct buttons.

---

## Core Combat Mechanics

### Arena
- 2D side-scrolling arena
- Robots move left and right only (classic fighting game movement)
- Robots are colossal — skyscraper scale — with environmental context to reinforce scale

### Win Condition
- Standard health depletion — reduce opponent's HP to zero to win

### Robot Systems
Each robot has the following independent systems, each with its own health/status:

| System | Function |
|---|---|
| **Armour** | Primary damage absorption layer |
| **Shields** | Secondary protective layer — may regenerate over time |
| **Weapons** | Offensive capability (see Weapon Loadout) |
| **Targeting System** | Determines weapon accuracy — if damaged, weapons still fire but with reduced accuracy |
| **Nano Repair System** | Repairs damaged systems over time (see Nano Repair) |
| **Legs** | Structural — determines total weapon weight capacity |
| **Support Units** | Drones and tanks (see Support Units) |

### Damage Model
- Individual systems can be damaged independently
- Damaging the targeting system reduces weapon accuracy without disabling the robot entirely
- Armour and shields are separate layers — shields should be depleted before armour takes full damage
- Overall robot HP is the win condition metric

---

## Nano Repair System

- Robots have an onboard nano repair system that repairs damaged sub-systems during combat
- **Player-controlled:** The player manually selects which system to prioritise for repair (shields, armour, targeting, weapons, etc.)
- Repair takes time — the higher the upgrade level, the faster repairs complete
- Strategic prioritisation is a core in-combat decision

**Upgradeable via:** Garage / Tech Tree

---

## Weapon System

### Weapon Slots
Each robot has three weapon slots:

| Slot | Type | Examples |
|---|---|---|
| **Left Arm** | Light weapon | Machine gun, light laser |
| **Right Arm** | Light weapon | Missile rack, precision laser |
| **Back** | Heavy weapon | Artillery, heavy missile system |

### Weapon Categories
- **Lasers** — various types and power levels
- **Missile Systems** — multiple variants (homing, dumb-fire, cluster)
- **Machine Guns** — rapid fire, lower damage
- **Artillery** — heavy back-slot weapon, high damage, slower fire rate

### Weight Limit
- Each weapon has a weight value
- Each robot has a total weight capacity determined by **leg upgrade level**
- Players cannot equip a loadout that exceeds their weight limit
- Upgrading legs increases weight capacity, enabling heavier weapons or more weapons

### Targeting System
- Weapon accuracy is tied to the robot's targeting system health
- Damaged targeting = reduced accuracy, but weapons still fire
- Targeting system can be repaired via the nano repair system

### Loadout Selection
- Players choose their three weapons **before** entering battle
- Loadout cannot be changed mid-fight
- Loadout choices are constrained by weight limit and unlocked/upgraded weapons

---

## Support Units

Support units are optional companion units that assist the robot during battle. They are not always present — they must be purchased and deployed.

| Type | Description |
|---|---|
| **Tanks** | Ground-based units that provide defensive support, act as drones |
| **Air Drones** | Flying units that provide aerial support or offensive capability |

- Support units can be upgraded
- They function as semi-autonomous defenders/attackers around the robot
- Purchasing and upgrading support units is done in the Garage

---

## Upgrade & Progression Systems

### Currency
- **Coins** earned by completing spelling and math challenges in the educational section of the app
- Coins are spent across two upgrade systems: the **Garage** and the **Armory**

---

### The Garage (Tech Tree)

The Garage is the strategic meta-layer between fights. Players research and unlock upgrades before they can apply them.

**Upgradeable Systems:**
- Legs (weight capacity)
- Armour (damage absorption)
- Shields (strength, regeneration rate)
- Targeting System (accuracy level)
- Nano Repair System (repair speed)
- Support Units (drones and tanks — unlock, upgrade)

**Tech Tree mechanic:**
- Advanced upgrades are not immediately available
- Players must first research prerequisite tech upgrades to unlock higher tiers
- This prevents players from jumping straight to max-level equipment

---

### The Armory (Weapon Crafting)

The Armory is where players manage, craft, and upgrade their weapons.

**Key mechanics:**
- **Produce** new weapons using coins
- **Upgrade** existing weapons to improve their stats (damage, fire rate, accuracy)
- **Merge** two weapons to unlock new abilities or a more advanced weapon variant
- Merging is the primary method for unlocking advanced weapon capabilities
- Weapons have weight values that affect loadout options

---

## Robot Roster

- Multiple robot types available to choose from
- Each robot has a unique base stat profile
- New robots can potentially be unlocked via coins/progression
- All robots share the same upgrade systems (loadout, garage, armory)

---

## Economy Summary

```
Educational Game (Spelling / Math)
        ↓ earn coins
        ↓
Olympus Protocol Economy
    ├── Garage → Tech research, system upgrades, support units
    └── Armory → Weapon production, upgrades, merging
```

---

## Section Navigation (App Structure)

The PWA contains multiple sections accessible from a main navigation:

1. **Spelling Game** (existing)
2. **Math Game** (existing)
3. **Olympus Protocol** (new)
   - Main Menu (vs AI / vs Human)
   - Garage
   - Armory
   - Battle Arena

Coin balance is persistent and visible across all sections.

---

## Tech Stack

### Framework
- **Game Engine:** Phaser 3 — purpose-built JavaScript 2D game framework, handles sprites, physics, animation, and real-time combat mechanics natively in the browser
- **UI Shell:** React — wraps the Phaser game canvas and handles all non-combat screens (menus, garage, armory, coin balance, navigation between app sections)
- **App Type:** PWA — installable on iPad and mobile, works offline, no app store required

### Architecture Overview
```
React PWA Shell
  ├── Educational Section (Spelling + Math games)
  ├── Coin Store (shared state across sections)
  └── Olympus Protocol Section
        ├── React UI (menus, garage, armory, loadout)
        └── Phaser Canvas (live combat arena)
```

### Graphics Pipeline

**Generation**
- Use AI image generation tools (Midjourney, DALL-E, or similar) to generate robot concept art, sprite sheets, weapon visuals, drone/tank art, and backgrounds
- Prompt style: 1980s mecha anime, Robotech/Transformers aesthetic, industrial, angular, pixel art or clean vector style recommended for game use
- Pixel art is strongly recommended — it scales cleanly across screen sizes, suits the retro mecha aesthetic, and is easier to rig for animation than complex painterly art

**Cleanup & Preparation**
- Raw AI output will need cleanup — use an image editor (Aseprite for pixel art, Photoshop/Affinity for higher-res) to standardise frame sizes and remove artefacts
- All animation frames must be the same dimensions
- Export as PNG sprite sheets with an accompanying JSON metadata file describing frame positions and animation sequences

**Loading into Phaser**
- Phaser loads sprite sheets as a PNG + JSON atlas pair
- Animations are defined in code using Phaser's Animation Manager, referencing named frame sequences
- Example animation types needed per robot: idle, walk left/right, fire arm weapon, fire back weapon, take damage, shield hit, destroyed

### Asset Types Required
| Asset | Format | Notes |
|---|---|---|
| Robot sprites | PNG sprite sheet + JSON | Per robot, multiple animation states |
| Weapon effects | PNG / spritesheet | Laser beams, missile trails, explosions |
| Drone / tank sprites | PNG sprite sheet + JSON | Support unit animations |
| Arena backgrounds | PNG | Layered parallax recommended |
| UI elements | PNG / SVG | Health bars, system status indicators |

---

## Open Questions / TBD

- Coin earn rates in educational games (balance TBD)
- Coin costs for upgrades (balance TBD)
- Number of robot types in initial release
- Online vs local multiplayer for vs Human mode
- AI difficulty levels
- Number of weapon types per category at launch
- Shield regeneration mechanic detail (passive regen vs activated?)
- Support unit control mechanic (fully auto vs player-directed?)

---


