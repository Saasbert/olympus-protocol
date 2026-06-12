export type WeaponCategory = 'artillery' | 'heavy' | 'machineGun' | 'lightLaser' | 'missile'
export type WeaponSlotPosition = 'leftArm' | 'rightArm' | 'back'

export interface WeaponDefinition {
  id: string
  name: string
  category: WeaponCategory
  slot: WeaponSlotPosition
  damage: number
  cooldown: number
  range: number
  accuracy: number
}

export type WeaponDef = WeaponDefinition
export { WEAPONS as weapons }

export const WEAPONS: WeaponDefinition[] = [
  {
    id: 'howitzer',
    name: 'Howitzer',
    category: 'artillery',
    slot: 'back',
    damage: 35,
    cooldown: 3000,
    range: 600,
    accuracy: 0.7,
  },
  {
    id: 'mortar',
    name: 'Mortar',
    category: 'artillery',
    slot: 'back',
    damage: 50,
    cooldown: 4500,
    range: 700,
    accuracy: 0.5,
  },
  {
    id: 'plasmaCannon',
    name: 'Plasma Cannon',
    category: 'heavy',
    slot: 'rightArm',
    damage: 25,
    cooldown: 2000,
    range: 450,
    accuracy: 0.8,
  },
  {
    id: 'heavyLaser',
    name: 'Heavy Laser',
    category: 'heavy',
    slot: 'leftArm',
    damage: 22,
    cooldown: 1800,
    range: 500,
    accuracy: 0.85,
  },
  {
    id: 'vulcan',
    name: 'Vulcan',
    category: 'machineGun',
    slot: 'rightArm',
    damage: 8,
    cooldown: 300,
    range: 350,
    accuracy: 0.6,
  },
  {
    id: 'autoCannon',
    name: 'Auto Cannon',
    category: 'machineGun',
    slot: 'leftArm',
    damage: 10,
    cooldown: 400,
    range: 380,
    accuracy: 0.65,
  },
  {
    id: 'beamRifle',
    name: 'Beam Rifle',
    category: 'lightLaser',
    slot: 'rightArm',
    damage: 15,
    cooldown: 1000,
    range: 500,
    accuracy: 0.9,
  },
  {
    id: 'pulseLaser',
    name: 'Pulse Laser',
    category: 'lightLaser',
    slot: 'leftArm',
    damage: 12,
    cooldown: 800,
    range: 450,
    accuracy: 0.85,
  },
  {
    id: 'rocketPod',
    name: 'Rocket Pod',
    category: 'missile',
    slot: 'back',
    damage: 30,
    cooldown: 2500,
    range: 650,
    accuracy: 0.75,
  },
  {
    id: 'missileRack',
    name: 'Missile Rack',
    category: 'missile',
    slot: 'back',
    damage: 45,
    cooldown: 4000,
    range: 750,
    accuracy: 0.6,
  },
]

export function getWeapon(id: string): WeaponDefinition | undefined {
  return WEAPONS.find(w => w.id === id)
}

export function filterWeaponsByCategory(categories: WeaponCategory[]): WeaponDefinition[] {
  return WEAPONS.filter(w => categories.includes(w.category))
}
