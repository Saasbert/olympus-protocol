export const BALANCE = {
  startingCoins: 100,
  coinPerBattleWin: 50,
  coinPerBattleLoss: 15,
  difficultyMultiplier: { easy: 0.5, medium: 1.0, hard: 1.5 },
  baseRepairTime: 10,
  weaponUpgradeStatMultiplier: 0.15,
  weaponUpgradeCostMultiplier: 1.5,
  maxWeaponUpgradeLevel: 5,
  maxRobotUpgradeTier: 4,
  coinEarnRatePerSpellingWord: 5,
  coinEarnRatePerMathProblem: 10,
} as const
