import Phaser from 'phaser'

export type RobotArchetype = 'titan' | 'colossus' | 'vanguard'

export interface RobotStats {
  armour: number
  shields: number
  weaponDamage: number
  targeting: number
  repairSpeed: number
  legCapacity: number
  speed: number
  hp: number
}

export interface SystemStatus {
  id: string
  name: string
  currentHealth: number
  maxHealth: number
  isDamaged: boolean
}

export interface WeaponInstance {
  id: string
  name: string
  damage: number
  fireRate: number
  type: 'laser' | 'missile' | 'bullet'
  slot: 0 | 1 | 2
  range: number
  isReady: boolean
}

export interface Projectile {
  x: number
  y: number
  velocityX: number
  velocityY: number
  damage: number
}

const STATS_BY_ARCHETYPE: Record<RobotArchetype, RobotStats> = {
  titan: { armour: 5, shields: 8, weaponDamage: 4, targeting: 6, repairSpeed: 3, legCapacity: 4, speed: 80, hp: 150 },
  colossus: { armour: 8, shields: 5, weaponDamage: 6, targeting: 4, repairSpeed: 2, legCapacity: 3, speed: 60, hp: 200 },
  vanguard: { armour: 3, shields: 4, weaponDamage: 5, targeting: 7, repairSpeed: 5, legCapacity: 6, speed: 100, hp: 120 },
}

const SYSTEM_DEFS: { id: string; name: string }[] = [
  { id: 'armour', name: 'Armour Plating' },
  { id: 'shields', name: 'Shield Generator' },
  { id: 'weapons', name: 'Weapon Systems' },
  { id: 'targeting', name: 'Targeting Array' },
  { id: 'nanoRepair', name: 'Nano-Repair Bay' },
  { id: 'legs', name: 'Leg Actuators' },
]

export type RobotAI = Robot

export class Robot extends Phaser.Physics.Arcade.Sprite {
  readonly archetype: RobotArchetype
  stats: RobotStats
  currentHP: number
  maxHP: number
  systems: SystemStatus[]
  weapons: [WeaponInstance | null, WeaponInstance | null, WeaponInstance | null] = [null, null, null]

  constructor(scene: Phaser.Scene, x: number, y: number, archetype: RobotArchetype, stats?: Partial<RobotStats>) {
    super(scene, x, y, archetype)
    this.archetype = archetype
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(48, 56)
    body.setOffset(8, 4)

    this.stats = { ...STATS_BY_ARCHETYPE[archetype], ...stats }
    this.maxHP = this.stats.hp
    this.currentHP = this.maxHP

    this.systems = SYSTEM_DEFS.map((def) => ({
      id: def.id,
      name: def.name,
      currentHealth: 100,
      maxHealth: 100,
      isDamaged: false,
    }))

    this.setDepth(10)
  }

  moveLeft(): void {
    this.setVelocityX(-this.stats.speed)
    this.setFlipX(true)
    this.playAnim('walk')
  }

  moveRight(): void {
    this.setVelocityX(this.stats.speed)
    this.setFlipX(false)
    this.playAnim('walk')
  }

  stopMoving(): void {
    this.setVelocityX(0)
    this.playAnim('idle')
  }

  takeDamage(amount: number, _system?: string): void {
    let remaining = amount

    const shieldsSys = this.systems.find((s) => s.id === 'shields')
    if (shieldsSys && shieldsSys.currentHealth > 0) {
      const absorbed = Math.min(remaining, shieldsSys.currentHealth)
      shieldsSys.currentHealth -= absorbed
      remaining -= absorbed
      if (shieldsSys.currentHealth <= 0) shieldsSys.isDamaged = true
    }

    if (remaining > 0) {
      const armourSys = this.systems.find((s) => s.id === 'armour')
      if (armourSys && armourSys.currentHealth > 0) {
        const absorbed = Math.min(remaining, armourSys.currentHealth)
        armourSys.currentHealth -= absorbed
        remaining -= absorbed
        if (armourSys.currentHealth <= 0) armourSys.isDamaged = true
      }
    }

    if (remaining > 0) {
      this.currentHP = Math.max(0, this.currentHP - remaining)
    }

    if (Math.random() < 0.1) {
      const idx = Phaser.Math.Between(0, this.systems.length - 1)
      const sys = this.systems[idx]
      if (sys) {
        sys.currentHealth = Math.max(0, sys.currentHealth - 25)
        if (sys.currentHealth <= 0) sys.isDamaged = true
      }
    }

    this.playAnim('hit')
  }

  fireWeapon(slot: 0 | 1 | 2): Projectile | null {
    const weapon = this.weapons[slot]
    if (!weapon) return null
    const animName = slot === 0 ? 'fireLeftArm' : slot === 1 ? 'fireRightArm' : 'fireBack'
    this.playAnim(animName)
    return null
  }

  repairSystem(systemId: string): void {
    const system = this.systems.find((s) => s.id === systemId)
    if (!system || system.currentHealth >= system.maxHealth) return
    system.currentHealth = Math.min(system.maxHealth, system.currentHealth + this.stats.repairSpeed * 10)
    if (system.currentHealth >= system.maxHealth) system.isDamaged = false
  }

  getSystemHealth(systemId: string): number {
    const system = this.systems.find((s) => s.id === systemId)
    return system ? system.currentHealth : 0
  }

  distanceTo(other: Robot): number {
    return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y)
  }

  playAnim(name: string): void {
    if (!this.anims) return
    const key = `${this.archetype}_${name}`
    if (this.anims.currentAnim?.key !== key) {
      this.play(key)
    }
  }
}
