import { create } from 'zustand'

interface LoadoutState {
  selectedRobot: string | null
  equippedWeapons: (string | null)[] // [leftArm, rightArm, back]
  setRobot: (robotId: string) => void
  setWeapon: (slot: number, weaponId: string | null) => void
  clear: () => void
}

export const useLoadoutStore = create<LoadoutState>((set) => ({
  selectedRobot: null,
  equippedWeapons: [null, null, null],
  setRobot: (robotId) => set({ selectedRobot: robotId }),
  setWeapon: (slot, weaponId) =>
    set((state) => {
      const weapons = [...state.equippedWeapons]
      weapons[slot] = weaponId
      return { equippedWeapons: weapons }
    }),
  clear: () => set({ selectedRobot: null, equippedWeapons: [null, null, null] }),
}))
