import Phaser from 'phaser'
import type { Robot } from '../entities/Robot'
import { GROUND_Y } from '../constants'

export class PhysicsController {
  constructor(
    scene: Phaser.Scene,
    arenaWidth: number,
    arenaHeight: number,
    player: Robot,
    opponent: Robot,
  ) {
    scene.physics.world.setBounds(0, 0, arenaWidth, arenaHeight)

    const pBody = player.body as Phaser.Physics.Arcade.Body
    const oBody = opponent.body as Phaser.Physics.Arcade.Body
    pBody.setCollideWorldBounds(true)
    oBody.setCollideWorldBounds(true)

    scene.physics.add.collider(player, opponent)

    const ground = scene.add.rectangle(
      arenaWidth / 2,
      GROUND_Y + 2,
      arenaWidth,
      4,
      0x333333,
    )
    scene.physics.add.existing(ground, true)
    scene.physics.add.collider(player, ground)
    scene.physics.add.collider(opponent, ground)
  }
}
