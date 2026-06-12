import Phaser from 'phaser'
import type { Robot } from '../entities/Robot'

const BAR_WIDTH = 50
const BAR_HEIGHT = 6
const Y_OFFSET = -50

export class HealthBar {
  private bar: Phaser.GameObjects.Graphics
  private robot: Robot

  constructor(scene: Phaser.Scene, robot: Robot) {
    this.bar = scene.add.graphics().setDepth(20)
    this.robot = robot
    this.update()
  }

  update(): void {
    this.bar.clear()

    const x = this.robot.x - BAR_WIDTH / 2
    const y = this.robot.y + Y_OFFSET
    const hpRatio = this.robot.currentHP / this.robot.maxHP
    const fillWidth = BAR_WIDTH * Math.max(0, hpRatio)
    const color = hpRatio > 0.25 ? 0x33ff33 : 0xff3333

    this.bar.fillStyle(0x333333, 0.8)
    this.bar.fillRect(x, y, BAR_WIDTH, BAR_HEIGHT)

    this.bar.fillStyle(color, 1)
    this.bar.fillRect(x, y, fillWidth, BAR_HEIGHT)

    this.bar.lineStyle(1, 0xffffff, 0.5)
    this.bar.strokeRect(x, y, BAR_WIDTH, BAR_HEIGHT)
  }

  destroy(): void {
    this.bar.destroy()
  }
}
