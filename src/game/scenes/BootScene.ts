import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  create(): void {
    const fill = this.make.graphics({})
    fill.fillStyle(0x33ff33, 1)
    fill.fillRect(0, 0, 398, 28)
    fill.generateTexture('bar_fill', 398, 28)
    fill.destroy()

    const bg = this.make.graphics({})
    bg.fillStyle(0x444444, 1)
    bg.fillRect(0, 0, 400, 30)
    bg.generateTexture('bar_bg', 400, 30)
    bg.destroy()

    this.scene.start('PreloadScene')
  }
}
