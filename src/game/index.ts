import Phaser from 'phaser'
import { GAME_CONFIG } from './config'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { BattleScene } from './scenes/BattleScene'

export interface GameLoadout {
  robotId: string
  weapons: (string | null)[]
}

export function createGame(loadout: GameLoadout): Phaser.Game {
  const game = new Phaser.Game({
    ...GAME_CONFIG,
    scene: [BootScene, PreloadScene, BattleScene],
    callbacks: {
      postBoot: (g) => {
        g.registry.set('loadout', loadout)
      },
    },
  })
  return game
}
