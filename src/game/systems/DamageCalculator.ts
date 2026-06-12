import type { Robot } from '../entities/Robot'
import type { WeaponDef } from '../../data/weapons'
import { TargetingController } from './TargetingController'

export interface HitResult {
  hit: boolean
  shieldDmg: number
  armourDmg: number
  hpDmg: number
  systemDmg: { id: string; amount: number } | null
}

export class DamageCalculator {
  static calculateHit(attacker: Robot, defender: Robot, weapon: WeaponDef): HitResult {
    const baseDamage = weapon.damage * (0.9 + Math.random() * 0.2)

    const accuracyMod = Math.min(
      1,
      weapon.accuracy * TargetingController.getAccuracyMultiplier(attacker)
    )
    if (Math.random() > accuracyMod) {
      return { hit: false, shieldDmg: 0, armourDmg: 0, hpDmg: 0, systemDmg: null }
    }

    let remaining = baseDamage

    const shieldSys = defender.systems.find((s) => s.id === 'shields')
    let shieldDmg = 0
    if (shieldSys && shieldSys.currentHealth > 0) {
      shieldDmg = Math.min(remaining * 0.7, shieldSys.currentHealth)
      remaining -= shieldDmg
    }

    const armourSys = defender.systems.find((s) => s.id === 'armour')
    let armourDmg = 0
    if (armourSys && armourSys.currentHealth > 0) {
      armourDmg = Math.min(remaining * 0.8, armourSys.currentHealth)
      remaining -= armourDmg
    }

    const hpDmg = Math.max(0, remaining)

    let systemDmg: { id: string; amount: number } | null = null
    if (Math.random() < 0.1) {
      const idx = Math.floor(Math.random() * defender.systems.length)
      const sys = defender.systems[idx]
      if (sys) {
        systemDmg = { id: sys.id, amount: Math.ceil(sys.maxHealth * 0.05) }
      }
    }

    return { hit: true, shieldDmg, armourDmg, hpDmg, systemDmg }
  }
}
