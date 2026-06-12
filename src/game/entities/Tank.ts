import Phaser from 'phaser'
import { GROUND_Y } from '../constants'
import type { Robot } from './Robot'

const TANK_HP = 200
const FIRE_RATE = 2000
const RANGE = 300
const FOLLOW_OFFSET = 100
const SPEED = 60
const BULLET_SPEED = 250

export class Tank extends Phaser.Physics.Arcade.Sprite {
  owner: Robot
  enemy: Robot
  hp: number
  maxHp: number
  destroyed = false
  private fireTimer = 0
  private bullets: Phaser.Physics.Arcade.Group
  constructor(scene: Phaser.Scene, owner: Robot, enemy: Robot, bullets: Phaser.Physics.Arcade.Group) {
    const x = owner.x - FOLLOW_OFFSET
    const y = GROUND_Y
    super(scene, x, y, 'tank_sprite')

    if (!scene.textures.exists('tank_sprite')) {
      Tank.generateTexture(scene)
    }

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.owner = owner
    this.enemy = enemy
    this.hp = TANK_HP
    this.maxHp = TANK_HP
    this.bullets = bullets

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(48, 24)
    body.setCollideWorldBounds(true)

    this.setDepth(8)
  }

  private static generateTexture(scene: Phaser.Scene): void {
    const g = scene.add.graphics()
    g.fillStyle(0x888888)
    g.fillRect(0, 0, 48, 24)
    g.lineStyle(1, 0xaaaaaa)
    g.strokeRect(0, 0, 48, 24)
    g.fillStyle(0x666666)
    g.fillRect(10, 4, 28, 16)
    g.generateTexture('tank_sprite', 48, 24)
    g.destroy()
  }

  takeDamage(amount: number): void {
    if (this.destroyed) return
    this.hp = Math.max(0, this.hp - amount)
    this.setTint(0xff4444)
    this.scene.time.delayedCall(100, () => {
      if (!this.destroyed) this.clearTint()
    })
    if (this.hp <= 0) this.die()
  }

  private die(): void {
    this.destroyed = true
    if (this.body) (this.body as Phaser.Physics.Arcade.Body).enable = false
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.destroy(),
    })
  }

  update(_time: number, delta: number): void {
    if (this.destroyed || !this.active) return

    const body = this.body as Phaser.Physics.Arcade.Body
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.owner.x, this.owner.y)

    if (dist > FOLLOW_OFFSET + 30) {
      const dir = this.owner.x > this.x ? 1 : -1
      body.setVelocityX(dir * SPEED)
    } else {
      body.setVelocityX(0)
    }

    this.fireTimer += delta
    if (this.fireTimer >= FIRE_RATE) {
      const enemyDist = Phaser.Math.Distance.Between(this.x, this.y, this.enemy.x, this.enemy.y)
      if (enemyDist <= RANGE) {
        this.fireTimer = 0
        this.fire()
      }
    }
  }

  private fire(): void {
    const bullet = this.bullets.get(this.x, this.y - 4, 'tank_bullet') as Phaser.Physics.Arcade.Sprite | null
    if (!bullet) return

    if (!this.scene.textures.exists('tank_bullet')) {
      const g = this.scene.add.graphics()
      g.fillStyle(0xcccccc)
      g.fillRect(0, 0, 6, 4)
      g.generateTexture('tank_bullet', 6, 4)
      g.destroy()
    }
    bullet.setTexture('tank_bullet')
    bullet.setActive(true).setVisible(true)
    bullet.setDepth(12)
    const body = bullet.body as Phaser.Physics.Arcade.Body
    body.enable = true
    body.setSize(6, 4)

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y)
    body.setVelocity(Math.cos(angle) * BULLET_SPEED, Math.sin(angle) * BULLET_SPEED)
    bullet.setData('damage', 15)
    bullet.setData('owner', 'player')
  }
}
