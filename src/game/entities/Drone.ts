import Phaser from 'phaser'
import type { Robot } from './Robot'

const DRONE_HP = 100
const FIRE_RATE = 3000
const RANGE = 350
const CIRCLE_RADIUS_X = 80
const CIRCLE_RADIUS_Y = 40
const CIRCLE_SPEED = 0.002
const DIVE_SPEED = 200
const DIVE_RANGE = 250
const BULLET_SPEED = 350

type UnitState = 'circling' | 'diving' | 'returning'

export class Drone extends Phaser.Physics.Arcade.Sprite {
  owner: Robot
  enemy: Robot
  hp: number
  maxHp: number
  destroyed = false
  private fireTimer = 0
  private circleAngle = 0
  private unitState: UnitState = 'circling'
  private baseX = 0
  private baseY = 0
  private bullets: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene, owner: Robot, enemy: Robot, bullets: Phaser.Physics.Arcade.Group) {
    const x = owner.x - 60
    const y = owner.y - 80
    super(scene, x, y, 'drone_sprite')

    if (!scene.textures.exists('drone_sprite')) {
      Drone.generateTexture(scene)
    }

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.owner = owner
    this.enemy = enemy
    this.hp = DRONE_HP
    this.maxHp = DRONE_HP
    this.bullets = bullets
    this.baseX = x
    this.baseY = y

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(32, 32)
    body.setCollideWorldBounds(true)

    this.setDepth(11)
  }

  private static generateTexture(scene: Phaser.Scene): void {
    const g = scene.add.graphics()
    g.fillStyle(0xeeeeee)
    g.fillRect(0, 0, 32, 32)
    g.lineStyle(1, 0xffffff)
    g.strokeRect(0, 0, 32, 32)
    g.fillStyle(0xaaaaff)
    g.fillRect(4, 4, 24, 24)
    g.generateTexture('drone_sprite', 32, 32)
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

    this.baseX = this.owner.x

    const enemyDist = Phaser.Math.Distance.Between(this.x, this.y, this.enemy.x, this.enemy.y)

    switch (this.unitState) {
      case 'circling': {
        this.circleAngle += CIRCLE_SPEED * delta
        const tx = this.baseX + Math.cos(this.circleAngle) * CIRCLE_RADIUS_X
        const ty = this.baseY + Math.abs(Math.sin(this.circleAngle)) * -CIRCLE_RADIUS_Y
        const body = this.body as Phaser.Physics.Arcade.Body
        const dx = tx - this.x
        const dy = ty - this.y
        body.setVelocity(dx * 3, dy * 3)

        this.fireTimer += delta
        if (enemyDist <= RANGE && this.fireTimer >= FIRE_RATE) {
          this.unitState = 'diving'
          this.fireTimer = 0
        }
        break
      }
      case 'diving': {
        const body = this.body as Phaser.Physics.Arcade.Body
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y)
        body.setVelocity(Math.cos(angle) * DIVE_SPEED, Math.sin(angle) * DIVE_SPEED)

        if (enemyDist <= DIVE_RANGE) {
          this.fire()
          this.unitState = 'returning'
        }
        break
      }
      case 'returning': {
        const tx = this.baseX + Math.cos(this.circleAngle) * CIRCLE_RADIUS_X
        const ty = this.baseY + CIRCLE_RADIUS_Y * -1
        const body = this.body as Phaser.Physics.Arcade.Body
        const dx = tx - this.x
        const dy = ty - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        body.setVelocity(dx * 3, dy * 3)
        if (dist < 50) {
          this.unitState = 'circling'
          body.setVelocity(0, 0)
        }
        break
      }
    }
  }

  private fire(): void {
    const bullet = this.bullets.get(this.x, this.y, 'drone_bullet') as Phaser.Physics.Arcade.Sprite | null
    if (!bullet) return

    if (!this.scene.textures.exists('drone_bullet')) {
      const g = this.scene.add.graphics()
      g.fillStyle(0x44aaff)
      g.fillCircle(4, 4, 4)
      g.generateTexture('drone_bullet', 8, 8)
      g.destroy()
    }
    bullet.setTexture('drone_bullet')
    bullet.setActive(true).setVisible(true)
    bullet.setDepth(12)
    const body = bullet.body as Phaser.Physics.Arcade.Body
    body.enable = true
    body.setSize(8, 8)

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y)
    body.setVelocity(Math.cos(angle) * BULLET_SPEED, Math.sin(angle) * BULLET_SPEED)
    bullet.setData('damage', 10)
    bullet.setData('owner', 'player')
    bullet.setData('homing', true)
    bullet.setData('enemy', this.enemy)
  }
}
