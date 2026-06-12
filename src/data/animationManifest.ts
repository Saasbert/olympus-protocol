import Phaser from 'phaser'

export interface AnimationDef {
  frames: number
  frameRate: number
  repeat?: number
}

export interface RobotAnimations {
  idle: AnimationDef
  walk: AnimationDef
  fireLeftArm: AnimationDef
  fireRightArm: AnimationDef
  fireBack: AnimationDef
  hit: AnimationDef
  destroyed: AnimationDef
}

export interface RobotManifestEntry {
  id: string
  spriteKey: string
  atlasKey: string
  animations: RobotAnimations
}

export const ROBOT_ANIMATIONS: Record<string, RobotManifestEntry> = {
  titan: {
    id: 'titan',
    spriteKey: 'robot_titan',
    atlasKey: 'titan',
    animations: {
      idle:        { frames: 4, frameRate: 4, repeat: -1 },
      walk:        { frames: 6, frameRate: 8, repeat: -1 },
      fireLeftArm: { frames: 4, frameRate: 10, repeat: 0 },
      fireRightArm:{ frames: 4, frameRate: 10, repeat: 0 },
      fireBack:    { frames: 4, frameRate: 10, repeat: 0 },
      hit:         { frames: 3, frameRate: 8, repeat: 0 },
      destroyed:   { frames: 6, frameRate: 6, repeat: 0 },
    },
  },
  colossus: {
    id: 'colossus',
    spriteKey: 'robot_colossus',
    atlasKey: 'colossus',
    animations: {
      idle:        { frames: 4, frameRate: 4, repeat: -1 },
      walk:        { frames: 6, frameRate: 7, repeat: -1 },
      fireLeftArm: { frames: 4, frameRate: 9, repeat: 0 },
      fireRightArm:{ frames: 4, frameRate: 9, repeat: 0 },
      fireBack:    { frames: 4, frameRate: 9, repeat: 0 },
      hit:         { frames: 3, frameRate: 8, repeat: 0 },
      destroyed:   { frames: 6, frameRate: 6, repeat: 0 },
    },
  },
  vanguard: {
    id: 'vanguard',
    spriteKey: 'robot_vanguard',
    atlasKey: 'vanguard',
    animations: {
      idle:        { frames: 4, frameRate: 5, repeat: -1 },
      walk:        { frames: 6, frameRate: 10, repeat: -1 },
      fireLeftArm: { frames: 4, frameRate: 12, repeat: 0 },
      fireRightArm:{ frames: 4, frameRate: 12, repeat: 0 },
      fireBack:    { frames: 4, frameRate: 12, repeat: 0 },
      hit:         { frames: 3, frameRate: 8, repeat: 0 },
      destroyed:   { frames: 6, frameRate: 6, repeat: 0 },
    },
  },
}

export function getFrameNames(robotId: string, animation: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${robotId}_${animation}_${i}`)
}

export function registerAnimations(scene: Phaser.Scene): void {
  for (const entry of Object.values(ROBOT_ANIMATIONS)) {
    for (const [animName, animDef] of Object.entries(entry.animations)) {
      scene.anims.create({
        key: `${entry.id}_${animName}`,
        frames: scene.anims.generateFrameNames(entry.atlasKey, {
          prefix: `${entry.id}_${animName}_`,
          start: 0,
          end: animDef.frames - 1,
        }),
        frameRate: animDef.frameRate,
        repeat: animDef.repeat ?? -1,
      })
    }
  }
}
