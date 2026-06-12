export type SupportUnitType = 'ground' | 'air'
export type SupportUnitRole = 'offensive' | 'defensive' | 'scout'

export interface SupportUnitStats {
  hp: number
  damage: number
  speed: number
  armour: number
}

export interface SupportUnitDef {
  id: string
  name: string
  description: string
  type: SupportUnitType
  role: SupportUnitRole
  cost: number
  stats: SupportUnitStats
}

export const supportUnits: SupportUnitDef[] = [
  {
    id: 'assault_tank',
    name: 'Assault Tank',
    description: 'Heavy ground tank with potent cannons. Excels at pushing the front line.',
    type: 'ground',
    role: 'offensive',
    cost: 500,
    stats: {
      hp: 300,
      damage: 15,
      speed: 80,
      armour: 40,
    },
  },
  {
    id: 'defense_tank',
    name: 'Defense Tank',
    description: 'Armoured ground unit built to absorb fire and protect the mech.',
    type: 'ground',
    role: 'defensive',
    cost: 400,
    stats: {
      hp: 500,
      damage: 8,
      speed: 60,
      armour: 70,
    },
  },
  {
    id: 'scout_drone',
    name: 'Scout Drone',
    description: 'Fast aerial unit that harasses opponents and provides targeting data.',
    type: 'air',
    role: 'scout',
    cost: 600,
    stats: {
      hp: 200,
      damage: 10,
      speed: 140,
      armour: 20,
    },
  },
]
