export const ARENA_WIDTH = 4096
export const ARENA_HEIGHT = 768
export const GROUND_Y = 700
export const ROBOT_SPEED_BASE = 100
export const PROJECTILE_SPEED = 500
export const MOVE_LEFT = 'moveLeft'
export const MOVE_RIGHT = 'moveRight'
export const FIRE_LEFT_ARM = 'fireLeftArm'
export const FIRE_RIGHT_ARM = 'fireRightArm'
export const FIRE_BACK = 'fireBack'
export const ANIM_IDLE = 'idle'
export const ANIM_WALK = 'walk'
export const ANIM_HIT = 'hit'
export const ANIM_DESTROYED = 'destroyed'

export const SPRITE_KEYS = {
  ROBOT_TITAN: 'robot_titan',
  ROBOT_COLOSSUS: 'robot_colossus',
  ROBOT_VANGUARD: 'robot_vanguard',
  LASER: 'weapon_laser',
  MISSILE: 'weapon_missile',
  BULLET: 'weapon_bullet',
  EXPLOSION: 'weapon_explosion',
  TANK: 'tank_assault',
  DRONE: 'drone_scout',
} as const
