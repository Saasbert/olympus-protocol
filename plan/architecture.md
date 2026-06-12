# Olympus Protocol — Architecture

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Game Engine | Phaser 3.80+ | Purpose-built 2D browser game engine; handles sprites, physics, animation, real-time combat natively |
| UI Shell | React 18 + TypeScript | Wraps Phaser canvas; manages all non-combat screens (menus, garage, armory, nav) |
| Build Tool | Vite 5+ | Fast HMR, PWA plugin, TypeScript support out of the box |
| PWA | vite-plugin-pwa | Service worker generation, manifest, offline support, installability |
| State Management | Zustand | Lightweight shared store for coin balance, player inventory, game state across React and Phaser |
| Styling | Tailwind CSS v4 | Utility-first CSS for React UI; rapid iteration |
| Networking (future) | WebSocket / Colyseus | For vs Human online mode (out of scope for v1.0) |
| Assets | PNG sprite sheets + JSON atlas | Phaser-native format; AI-generated pixel art cleaned in Aseprite |

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PWA Shell (React)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Spelling  │  │   Math   │  │ Olympus Protocol  │  │
│  │   Game    │  │   Game   │  │    Section        │  │
│  └──────────┘  └──────────┘  │  ┌──────────────┐ │  │
│                               │  │ React UI     │ │  │
│                               │  │ (Menu,       │ │  │
│                               │  │  Garage,     │ │  │
│                               │  │  Armory)     │ │  │
│                               │  └──────┬───────┘ │  │
│                               │         │          │  │
│                               │  ┌──────▼───────┐ │  │
│                               │  │ Phaser       │ │  │
│                               │  │ Canvas       │  │  │
│                               │  │ (Combat      │ │  │
│                               │  │  Arena)      │ │  │
│                               │  └──────────────┘ │  │
│                               └──────────────────┘  │
│  ┌──────────────────────────────────────────────┐   │
│  │         Zustand Shared Store                  │   │
│  │  (coins, inventory, upgrades, loadout)        │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Data Flow

1. **Coin Economy:** Educational games → Zustand store → Olympus (Garage/Armory spends)
2. **Loadout Flow:** Armory (craft weapons) → Garage (upgrade systems) → Loadout selection → Battle Arena
3. **Battle State:** React passes selected loadout/robot to Phaser via scene registry/Zustand bridge → Phaser runs combat → result written back to store
4. **Persistence:** Zustand store persisted to localStorage for offline PWA support

## React ↔ Phaser Bridge

- Phaser game instance is created inside a React component (`BattleArena.tsx`) using a ref to mount the canvas
- Communication via a shared Zustand store accessible from both React and Phaser
- Phaser reads pre-battle config (robot, loadout, opponent) from store before scene starts
- Phaser writes battle result (win/loss, damage dealt, coins earned) back to store on end

## Component Tree (Olympus Section)

```
OlympusHub
├── MainMenu (vs AI / vs Human buttons)
├── Garage
│   ├── TechTree (upgrade research visualization)
│   └── SystemUpgradePanel
├── Armory
│   ├── WeaponList
│   ├── WeaponCrafting
│   ├── WeaponUpgrade
│   └── WeaponMerge
├── LoadoutSelection
│   ├── RobotSelector
│   ├── WeaponSlotSelector (x3)
│   └── WeightIndicator
└── BattleArena
    ├── PhaserCanvas (Phaser game instance)
    ├── HUD (React overlay: health bars, system status)
    └── BattleResult (win/loss screen)
```

## Key Design Decisions

- **Phaser for combat only** — no Phaser UI scene managers; all menus are React
- **Zustand as single source of truth** — both React and Phaser read/write to same store
- **Sprite sheets as PNG+JSON atlases** — Phaser's native texture packer format
- **Pixel art aesthetic** — scales cleanly across devices, suits retro mecha theme, easier to animate
- **Touch-first controls** — on-screen joystick + buttons for mobile; keyboard support for desktop
