import { BALANCE } from '@/data/balance'
import { robots } from '@/data/robots'
import { weapons } from '@/data/weapons'
import type { RobotDef } from '@/data/robots'
import type { WeaponDef } from '@/data/weapons'
import { calculateBattleReward } from '@/services/economyService'

export interface Loadout {
  robotId: string
  weaponIds: string[]
}

export interface BattleResult {
  won: boolean
  damageDealt: number
  damageTaken: number
  systemsRepaired: number
  coinsEarned: number
}

export function simulateBattle(
  playerLoadout: Loadout,
  opponentRobot: RobotDef,
  difficulty: string,
): BattleResult {
  const playerRobot = robots.find((r) => r.id === playerLoadout.robotId)
  if (!playerRobot) {
    return { won: false, damageDealt: 0, damageTaken: 0, systemsRepaired: 0, coinsEarned: 0 }
  }

  const playerWeapons: WeaponDef[] = playerLoadout.weaponIds
    .map((id) => weapons.find((w) => w.id === id))
    .filter((w): w is WeaponDef => w !== undefined)

  const playerPower =
    playerRobot.baseStats.hp * 0.3 +
    (playerRobot.baseStats.armour + playerRobot.baseStats.shields) * 0.2 +
    playerRobot.baseStats.weaponDamage * 0.25 +
    playerWeapons.reduce((sum, w) => sum + w.damage, 0) * 0.25 +
    playerRobot.baseStats.speed * 0.1

  const opponentPower =
    opponentRobot.baseStats.hp * 0.3 +
    (opponentRobot.baseStats.armour + opponentRobot.baseStats.shields) * 0.2 +
    opponentRobot.baseStats.weaponDamage * 0.45 +
    opponentRobot.baseStats.speed * 0.1

  const difficultyMultiplier = BALANCE.difficultyMultiplier[difficulty as keyof typeof BALANCE.difficultyMultiplier] ?? 1.0
  const effectiveOpponentPower = opponentPower * difficultyMultiplier

  const totalPower = playerPower + effectiveOpponentPower
  const winChance = totalPower > 0 ? playerPower / totalPower : 0.5
  const won = Math.random() < winChance

  const damageDealt = Math.round(playerPower * (0.5 + Math.random() * 0.5))
  const damageTaken = Math.round(effectiveOpponentPower * (0.3 + Math.random() * 0.4))
  const systemsRepaired = Math.floor(Math.random() * 4)
  const coinsEarned = calculateBattleReward(won, difficulty)

  return { won, damageDealt, damageTaken, systemsRepaired, coinsEarned }
}
