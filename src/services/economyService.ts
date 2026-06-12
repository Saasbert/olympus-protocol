import { BALANCE } from '@/data/balance'

export function canAfford(coins: number, cost: number): boolean {
  return coins >= cost
}

export function spend(coins: number, cost: number): number {
  return coins - cost
}

export function earn(coins: number, amount: number): number {
  return coins + amount
}

export function calculateBattleReward(won: boolean, difficulty: string): number {
  const base = won ? BALANCE.coinPerBattleWin : BALANCE.coinPerBattleLoss
  const multiplier = BALANCE.difficultyMultiplier[difficulty as keyof typeof BALANCE.difficultyMultiplier] ?? 1.0
  return Math.round(base * multiplier)
}

export function calculateUpgradeCost(baseCost: number, currentTier: number): number {
  return Math.round(baseCost * Math.pow(BALANCE.weaponUpgradeCostMultiplier, currentTier))
}
