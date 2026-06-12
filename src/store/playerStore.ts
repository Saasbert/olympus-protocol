import { create } from 'zustand'

interface OwnedWeapon {
  id: string
  level: number
}

interface PlayerState {
  ownedRobots: string[]
  ownedWeapons: OwnedWeapon[]
  unlockedUpgrades: Record<string, number>
  equippedSupportUnits: string[]
  addWeapon: (weaponId: string) => void
  upgradeWeapon: (weaponId: string) => void
  removeWeapon: (weaponId: string) => void
  unlockUpgrade: (systemId: string, tier: number) => void
  addRobot: (robotId: string) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  ownedRobots: ['titan'],
  ownedWeapons: [],
  unlockedUpgrades: {},
  equippedSupportUnits: [],
  addWeapon: (weaponId) =>
    set((state) => ({ ownedWeapons: [...state.ownedWeapons, { id: weaponId, level: 1 }] })),
  upgradeWeapon: (weaponId) =>
    set((state) => ({
      ownedWeapons: state.ownedWeapons.map((w) =>
        w.id === weaponId ? { ...w, level: w.level + 1 } : w
      ),
    })),
  removeWeapon: (weaponId) =>
    set((state) => ({ ownedWeapons: state.ownedWeapons.filter((w) => w.id !== weaponId) })),
  unlockUpgrade: (systemId, tier) =>
    set((state) => ({ unlockedUpgrades: { ...state.unlockedUpgrades, [systemId]: tier } })),
  addRobot: (robotId) =>
    set((state) => ({ ownedRobots: [...state.ownedRobots, robotId] })),
}))
