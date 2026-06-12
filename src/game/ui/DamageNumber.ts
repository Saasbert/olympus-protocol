import Phaser from 'phaser'

const COLORS: Record<string, number> = {
  normal: 0xffffff,
  crit: 0xffff00,
  system: 0xff4444,
}

export function spawnDamageNumber(
  scene: Phaser.Scene,
  x: number,
  y: number,
  amount: number,
  type: 'normal' | 'crit' | 'system' = 'normal',
): Phaser.GameObjects.Text {
  const color = COLORS[type]
  const size = type === 'crit' ? '20px' : '16px'
  const text = scene.add
    .text(x, y, `${Math.round(amount)}`, {
      fontSize: size,
      fontFamily: 'Orbitron, monospace',
      color: `#${color.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 3,
    })
    .setOrigin(0.5)
    .setDepth(50)

  scene.tweens.add({
    targets: text,
    y: y - 60,
    alpha: 0,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => text.destroy(),
  })

  return text
}
