import Phaser from 'phaser'
import type { Robot } from './Robot'
import { ARENA_WIDTH, ARENA_HEIGHT } from '../constants'
import type { ProjectileType } from './Weapon'
import type { WeaponDef } from '../../data/weapons'

export interface ProjectileConfig {
  type: ProjectileType
  damage: number
  source: Robot
  weaponDef: WeaponDef
  target?: Robot
  speed?: number
}

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly damage: number
  readonly source: Robot
  readonly projectileType: ProjectileType
  readonly weaponDef: WeaponDef

  private target: Robot | null
  private alive: boolean = true
  private lifeTimer: number = 3000

  constructor(scene: Phaser.Scene, x: number, y: number, config: ProjectileConfig) {
    ensureTexture(scene, config.type)

    super(scene, x, y, textureKey(config.type))

    this.damage = config.damage
    this.source = config.source
    this.projectileType = config.type
    this.weaponDef = config.weaponDef
    this.target = config.target || null

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setCircle(Math.max(this.width, this.height) / 2)

    const speed = config.speed ?? projectileSpeed(config.type)

    if (config.target) {
      const angle = Phaser.Math.Angle.Between(x, y, config.target.x, config.target.y)
      this.setRotation(angle)
      body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    } else if (config.source.x < ARENA_WIDTH / 2) {
      body.setVelocity(speed, 0)
    } else {
      body.setVelocity(-speed, 0)
    }

    if (config.type === 'artillery') {
      body.setAllowGravity(true)
      body.setGravityY(250)
    }

    this.setDepth(15)
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)

    if (!this.alive) return

    this.lifeTimer -= delta
    if (this.lifeTimer <= 0) {
      this.kill()
      return
    }

    if (this.projectileType === 'missile' && this.target?.active) {
      const targetAngle = Phaser.Math.Angle.Between(
        this.x, this.y,
        this.target.x, this.target.y
      )
      const newAngle = Phaser.Math.Angle.RotateTo(
        this.rotation,
        targetAngle,
        0.04
      )
      this.setRotation(newAngle)
      const body = this.body as Phaser.Physics.Arcade.Body
      const speed = body.speed || 280
      body.setVelocity(
        Math.cos(newAngle) * speed,
        Math.sin(newAngle) * speed
      )
    }

    if (
      this.x < -200 || this.x > ARENA_WIDTH + 200 ||
      this.y < -200 || this.y > ARENA_HEIGHT + 200
    ) {
      this.kill()
    }
  }

  isAlive(): boolean {
    return this.alive
  }

  kill(): void {
    if (!this.alive) return
    this.alive = false
    this.destroy()
  }

  static preloadTextures(scene: Phaser.Scene): void {
    const types: ProjectileType[] = ['laser', 'missile', 'bullet', 'artillery']
    for (const t of types) ensureTexture(scene, t)
  }
}

function textureKey(type: ProjectileType): string {
  return `proj_${type}`
}

function ensureTexture(scene: Phaser.Scene, type: ProjectileType): void {
  const key = textureKey(type)
  if (scene.textures.exists(key)) return

  const g = scene.add.graphics()

  switch (type) {
    case 'laser':
      g.fillStyle(0xff3333)
      g.fillRect(0, 0, 16, 3)
      g.generateTexture(key, 16, 3)
      break
    case 'missile':
      g.fillStyle(0xff9900)
      g.fillTriangle(0, 4, 10, 0, 10, 8)
      g.generateTexture(key, 10, 8)
      break
    case 'bullet':
      g.fillStyle(0xffff00)
      g.fillCircle(3, 3, 3)
      g.generateTexture(key, 6, 6)
      break
    case 'artillery':
      g.fillStyle(0xff6600)
      g.fillCircle(4, 4, 4)
      g.generateTexture(key, 8, 8)
      break
  }

  g.destroy()
}

function projectileSpeed(type: ProjectileType): number {
  switch (type) {
    case 'laser': return 1200
    case 'missile': return 280
    case 'bullet': return 650
    case 'artillery': return 380
  }
}
