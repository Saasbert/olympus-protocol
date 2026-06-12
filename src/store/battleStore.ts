import { create } from 'zustand'

interface BattleResult {
  won: boolean
  damageDealt: number
  damageTaken: number
  systemsRepaired: number
  coinsEarned: number
}

interface BattleState {
  result: BattleResult | null
  isInBattle: boolean
  setResult: (result: BattleResult) => void
  setInBattle: (inBattle: boolean) => void
  clearResult: () => void
}

export const useBattleStore = create<BattleState>((set) => ({
  result: null,
  isInBattle: false,
  setResult: (result) => set({ result, isInBattle: false }),
  setInBattle: (inBattle) => set({ isInBattle: inBattle }),
  clearResult: () => set({ result: null }),
}))
