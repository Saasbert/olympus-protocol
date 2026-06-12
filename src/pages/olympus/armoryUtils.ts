import type { WeaponDefinition, WeaponCategory } from '../../data/weapons'
import { BALANCE } from '../../data/balance'

export const CATEGORY_WEIGHTS: Record<WeaponCategory, number> = {
  artillery: 10,
  heavy: 7,
  machineGun: 4,
  lightLaser: 3,
  missile: 6,
}

export function getWeaponWeight(w: WeaponDefinition): number {
  return CATEGORY_WEIGHTS[w.category] + Math.round(w.damage / 10)
}

export function getWeaponBaseCost(w: WeaponDefinition): number {
  return Math.round(w.damage * 2.5)
}

export function getUpgradeCost(baseCost: number, currentLevel: number): number {
  return Math.round(baseCost * Math.pow(BALANCE.weaponUpgradeCostMultiplier, currentLevel))
}

export function getStatsAtLevel(w: WeaponDefinition, level: number) {
  const mult = 1 + (level - 1) * BALANCE.weaponUpgradeStatMultiplier
  return {
    damage: Math.round(w.damage * mult),
    cooldown: Math.round(w.cooldown / mult),
    range: Math.round(w.range * mult),
    accuracy: Math.min(0.99, +(w.accuracy * mult).toFixed(2)),
  }
}

export function getLegCapacity(robotId: string): number {
  return robotId === 'colossus' ? 45 :
         robotId === 'titan' ? 35 :
         robotId === 'vanguard' ? 28 :
         30
}

export interface MergeRecipe {
  inputCategory: WeaponCategory
  input1: string
  input2: string
  result: WeaponDefinition
}

export const MERGE_RECIPES: MergeRecipe[] = [
  {
    inputCategory: 'artillery',
    input1: 'howitzer',
    input2: 'mortar',
    result: {
      id: 'siegeCannon',
      name: 'Siege Cannon',
      category: 'artillery',
      slot: 'back',
      damage: 70,
      cooldown: 5000,
      range: 800,
      accuracy: 0.6,
    },
  },
  {
    inputCategory: 'machineGun',
    input1: 'vulcan',
    input2: 'autoCannon',
    result: {
      id: 'gatlingCannon',
      name: 'Gatling Cannon',
      category: 'machineGun',
      slot: 'leftArm',
      damage: 14,
      cooldown: 250,
      range: 400,
      accuracy: 0.7,
    },
  },
  {
    inputCategory: 'lightLaser',
    input1: 'beamRifle',
    input2: 'pulseLaser',
    result: {
      id: 'dualLaser',
      name: 'Dual Laser',
      category: 'lightLaser',
      slot: 'rightArm',
      damage: 22,
      cooldown: 900,
      range: 550,
      accuracy: 0.92,
    },
  },
  {
    inputCategory: 'missile',
    input1: 'rocketPod',
    input2: 'missileRack',
    result: {
      id: 'swarmLauncher',
      name: 'Swarm Launcher',
      category: 'missile',
      slot: 'back',
      damage: 60,
      cooldown: 3500,
      range: 800,
      accuracy: 0.7,
    },
  },
  {
    inputCategory: 'heavy',
    input1: 'plasmaCannon',
    input2: 'heavyLaser',
    result: {
      id: 'fusionCannon',
      name: 'Fusion Cannon',
      category: 'heavy',
      slot: 'rightArm',
      damage: 40,
      cooldown: 2500,
      range: 550,
      accuracy: 0.88,
    },
  },
]

export function findMergeRecipe(a: string, b: string): MergeRecipe | undefined {
  return MERGE_RECIPES.find(
    (r) =>
      (r.input1 === a && r.input2 === b) || (r.input1 === b && r.input2 === a)
  )
}
