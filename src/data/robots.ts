export type RobotArchetype = 'colossus' | 'vanguard' | 'titan'

export interface RobotSystemDef {
  id: string
  maxHealth: number
}

export interface RobotDefinition {
  id: string
  name: string
  archetype: RobotArchetype
  baseStats: {
    speed: number
    hp: number
    armour: number
    shields: number
    weaponDamage: number
    targeting: number
  }
  systems: RobotSystemDef[]
}

export type RobotDef = RobotDefinition
export { ROBOTS as robots }

export const ROBOTS: RobotDefinition[] = [
  {
    id: 'colossus',
    name: 'Colossus',
    archetype: 'colossus',
    baseStats: {
      speed: 60,
      hp: 200,
      armour: 120,
      shields: 80,
      weaponDamage: 15,
      targeting: 6,
    },
    systems: [
      { id: 'legs', maxHealth: 100 },
      { id: 'armour', maxHealth: 120 },
      { id: 'shields', maxHealth: 80 },
      { id: 'targeting', maxHealth: 60 },
      { id: 'weapons', maxHealth: 100 },
      { id: 'nanoRepair', maxHealth: 50 },
    ],
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    archetype: 'vanguard',
    baseStats: {
      speed: 100,
      hp: 140,
      armour: 90,
      shields: 100,
      weaponDamage: 10,
      targeting: 10,
    },
    systems: [
      { id: 'legs', maxHealth: 80 },
      { id: 'armour', maxHealth: 90 },
      { id: 'shields', maxHealth: 100 },
      { id: 'targeting', maxHealth: 80 },
      { id: 'weapons', maxHealth: 80 },
      { id: 'nanoRepair', maxHealth: 50 },
    ],
  },
  {
    id: 'titan',
    name: 'Titan',
    archetype: 'titan',
    baseStats: {
      speed: 80,
      hp: 170,
      armour: 110,
      shields: 90,
      weaponDamage: 13,
      targeting: 8,
    },
    systems: [
      { id: 'legs', maxHealth: 90 },
      { id: 'armour', maxHealth: 110 },
      { id: 'shields', maxHealth: 90 },
      { id: 'targeting', maxHealth: 70 },
      { id: 'weapons', maxHealth: 90 },
      { id: 'nanoRepair', maxHealth: 50 },
    ],
  },
]

export function getRobot(id: string): RobotDefinition | undefined {
  return ROBOTS.find(r => r.id === id)
}
