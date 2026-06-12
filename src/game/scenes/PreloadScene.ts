import Phaser from 'phaser'

const ARCHETYPES = [
  { id: 'titan', color: 0x3355ff, dark: 0x2244cc },
  { id: 'colossus', color: 0xff3333, dark: 0xcc2222 },
  { id: 'vanguard', color: 0x33ff55, dark: 0x22cc44 },
]

export class PreloadScene extends Phaser.Scene {
  private loadProgress = 0

  constructor() {
    super({ key: 'PreloadScene' })
  }

  create(): void {
    const cx = this.cameras.main.centerX
    const cy = this.cameras.main.centerY

    this.add.text(cx, cy - 40, 'LOADING...', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5)

    const barBg = this.add.graphics()
    barBg.fillStyle(0x444444, 1)
    barBg.fillRect(cx - 200, cy - 5, 400, 30)

    const barFill = this.add.graphics()

    this.generateTextures()
    this.registerAnimations()

    const timer = this.time.addEvent({
      delay: 20,
      repeat: 15,
      callback: () => {
        this.loadProgress += 1 / 16
        const p = Math.min(this.loadProgress, 1)

        barFill.clear()
        barFill.fillStyle(0x33ff33, 1)
        barFill.fillRect(cx - 199, cy - 4, 398 * p, 28)

        if (p >= 1) {
          timer.destroy()
          this.time.delayedCall(200, () => {
            this.scene.start('BattleScene')
          })
        }
      },
    })
  }

  private generateTextures(): void {
    for (const arch of ARCHETYPES) {
      let g = this.add.graphics()
      g.fillStyle(arch.color, 1)
      g.fillRect(0, 0, 64, 64)
      g.fillStyle(arch.dark, 1)
      g.fillRect(16, 4, 32, 20)
      g.generateTexture(arch.id, 64, 64)
      g.destroy()

      g = this.add.graphics()
      g.fillStyle(arch.color, 1)
      g.fillRect(0, 0, 64, 64)
      g.fillStyle(0xff0000, 0.4)
      g.fillRect(0, 0, 64, 64)
      g.generateTexture(`${arch.id}_hit`, 64, 64)
      g.destroy()

      g = this.add.graphics()
      g.fillStyle(0x444444, 1)
      g.fillRect(0, 0, 64, 64)
      g.lineStyle(2, 0x333333, 1)
      g.strokeRect(4, 4, 56, 56)
      g.generateTexture(`${arch.id}_destroyed`, 64, 64)
      g.destroy()
    }

    let g = this.add.graphics()
    g.fillStyle(0xff4444, 1)
    g.fillRect(0, 0, 4, 20)
    g.generateTexture('weapon_laser', 4, 20)
    g.destroy()

    g = this.add.graphics()
    g.fillStyle(0xffff44, 1)
    g.fillRect(0, 0, 8, 16)
    g.fillStyle(0xff8800, 1)
    g.fillTriangle(4, 0, 0, 6, 8, 6)
    g.generateTexture('weapon_missile', 8, 16)
    g.destroy()

    g = this.add.graphics()
    g.fillStyle(0xffffff, 1)
    g.fillCircle(3, 3, 3)
    g.generateTexture('weapon_bullet', 6, 6)
    g.destroy()

    g = this.add.graphics()
    g.fillStyle(0xff6600, 1)
    g.fillCircle(16, 16, 16)
    g.fillStyle(0xffff00, 0.7)
    g.fillCircle(16, 16, 8)
    g.generateTexture('weapon_explosion', 32, 32)
    g.destroy()

    g = this.add.graphics()
    g.fillStyle(0x0a0a2e, 1)
    g.fillRect(0, 0, 128, 128)
    g.fillStyle(0xffffff, 0.3)
    for (let i = 0; i < 25; i++) {
      g.fillCircle(Math.random() * 128, Math.random() * 128, Math.random() * 1.5 + 0.5)
    }
    g.generateTexture('bg_far', 128, 128)
    g.destroy()

    g = this.add.graphics()
    g.fillStyle(0x0f0f1a, 1)
    g.fillRect(0, 0, 128, 128)
    g.fillStyle(0x1a1a2e, 1)
    g.fillRect(10, 50, 30, 78)
    g.fillRect(50, 30, 25, 98)
    g.fillRect(85, 60, 35, 68)
    g.generateTexture('bg_near', 128, 128)
    g.destroy()
  }

  private registerAnimations(): void {
    for (const arch of ARCHETYPES) {
      this.anims.create({
        key: `${arch.id}_idle`,
        frames: [{ key: arch.id }],
        frameRate: 1,
        repeat: -1,
      })
      this.anims.create({
        key: `${arch.id}_walk`,
        frames: [{ key: arch.id }],
        frameRate: 6,
        repeat: -1,
      })
      this.anims.create({
        key: `${arch.id}_fireLeftArm`,
        frames: [{ key: arch.id }, { key: `${arch.id}_hit` }],
        frameRate: 6,
        repeat: 0,
      })
      this.anims.create({
        key: `${arch.id}_fireRightArm`,
        frames: [{ key: arch.id }, { key: `${arch.id}_hit` }],
        frameRate: 6,
        repeat: 0,
      })
      this.anims.create({
        key: `${arch.id}_fireBack`,
        frames: [{ key: arch.id }, { key: `${arch.id}_hit` }],
        frameRate: 6,
        repeat: 0,
      })
      this.anims.create({
        key: `${arch.id}_hit`,
        frames: [{ key: `${arch.id}_hit` }],
        frameRate: 1,
        repeat: 0,
      })
      this.anims.create({
        key: `${arch.id}_destroyed`,
        frames: [{ key: `${arch.id}_destroyed` }],
        frameRate: 1,
        repeat: 0,
      })
    }
  }
}
