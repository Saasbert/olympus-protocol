import Phaser from 'phaser'
import type { WeaponInstance } from '../entities/Weapon'

const BAR_W = 40
const BAR_H = 8
const GAP = 6
const X = 20
const Y = 20

export class CooldownIndicator {
  private gfx: Phaser.GameObjects.Graphics
  private weapons: () => (WeaponInstance | null)[]

  constructor(scene: Phaser.Scene, weaponsFn: () => (WeaponInstance | null)[]) {
    this.gfx = scene.add.graphics().setDepth(50).setScrollFactor(0)
    this.weapons = weaponsFn
    this.update()
  }

  update(): void {
    this.gfx.clear()

    const weapons = this.weapons()

    for (let i = 0; i < 3; i++) {
      const wx = X + i * (BAR_W + GAP)
      const wy = Y

      this.gfx.fillStyle(0x333333, 0.8)
      this.gfx.fillRect(wx, wy, BAR_W, BAR_H)

      const w = weapons[i]
      if (w) {
        const prog = w.getCooldownProgress()
        const fillW = BAR_W * prog
        const color = w.isReady ? 0x33ff33 : 0xff9933

        this.gfx.fillStyle(color, 1)
        this.gfx.fillRect(wx, wy, fillW, BAR_H)

        this.gfx.lineStyle(1, 0xffffff, 0.4)
        this.gfx.strokeRect(wx, wy, BAR_W, BAR_H)
      }
    }
  }

  destroy(): void {
    this.gfx.destroy()
  }
}
