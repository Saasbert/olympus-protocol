import { create } from 'zustand'

interface CoinState {
  coins: number
  earnCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
}

export const useCoinStore = create<CoinState>((set, get) => ({
  coins: 100,
  earnCoins: (amount: number) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount: number) => {
    const { coins } = get()
    if (coins < amount) return false
    set({ coins: coins - amount })
    return true
  },
}))
