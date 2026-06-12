import type { WeaponDef } from '../../data/weapons'

export type ProjectileType = 'laser' | 'missile' | 'bullet' | 'artillery'

export function categoryToProjectileType(category: string): ProjectileType {
  switch (category) {
    case 'lightLaser': return 'laser'
    case 'missile': return 'missile'
    case 'artillery': return 'artillery'
    default: return 'bullet'
  }
}

export function slotPositionToIndex(slot: 'leftArm' | 'rightArm' | 'back'): 0 | 1 | 2 {
  if (slot === 'leftArm') return 0
  if (slot === 'rightArm') return 1
  return 2
}

export class WeaponInstance {
  readonly id: string
  readonly name: string
  readonly damage: number
  readonly fireRate: number
  readonly type: ProjectileType
  readonly slot: 0 | 1 | 2
  readonly range: number
  readonly accuracy: number
  readonly category: string

  isReady: boolean = true

  private cooldownTimer: number = 0
  private def: WeaponDef

  constructor(def: WeaponDef, slot: 0 | 1 | 2) {
    this.def = def
    this.id = def.id
    this.name = def.name
    this.damage = def.damage
    this.fireRate = def.cooldown
    this.type = categoryToProjectileType(def.category)
    this.slot = slot
    this.range = def.range
    this.accuracy = def.accuracy
    this.category = def.category
  }

  update(delta: number): void {
    if (!this.isReady) {
      this.cooldownTimer -= delta
      if (this.cooldownTimer <= 0) {
        this.cooldownTimer = 0
        this.isReady = true
      }
    }
  }

  fire(): boolean {
    if (!this.isReady) return false
    this.isReady = false
    this.cooldownTimer = this.def.cooldown
    return true
  }

  getCooldownProgress(): number {
    if (this.isReady) return 1
    return 1 - Math.max(0, this.cooldownTimer / this.def.cooldown)
  }

  getWeaponDef(): WeaponDef {
    return this.def
  }
}
