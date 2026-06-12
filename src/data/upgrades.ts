export interface UpgradeTierDef {
  tier: number
  name: string
  description: string
  cost: number
  effect: number
}

export interface Prerequisite {
  systemId: string
  minTier: number
}

export interface UpgradeSystemDef {
  id: string
  name: string
  description: string
  prerequisite: Prerequisite | null
  tiers: UpgradeTierDef[]
}

export const upgradeSystems: UpgradeSystemDef[] = [
  {
    id: 'legs',
    name: 'Legs',
    description: 'Hydraulic leg actuators that increase weight capacity for heavier weapon loads.',
    prerequisite: null,
    tiers: [
      { tier: 1, name: 'Reinforced Joints', description: '+20% weight capacity', cost: 50, effect: 0.2 },
      { tier: 2, name: 'Hydraulic Boost', description: '+40% weight capacity', cost: 100, effect: 0.4 },
      { tier: 3, name: 'Titan Frame', description: '+60% weight capacity', cost: 200, effect: 0.6 },
      { tier: 4, name: 'Mega-Stabilizers', description: '+100% weight capacity', cost: 350, effect: 1.0 },
    ],
  },
  {
    id: 'armour',
    name: 'Armour',
    description: 'Composite plating that reduces incoming damage from all sources.',
    prerequisite: { systemId: 'legs', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Steel Plating', description: '+10% damage reduction', cost: 75, effect: 0.1 },
      { tier: 2, name: 'Ceramic Composite', description: '+20% damage reduction', cost: 150, effect: 0.2 },
      { tier: 3, name: 'Reactive Mesh', description: '+35% damage reduction', cost: 300, effect: 0.35 },
    ],
  },
  {
    id: 'shields',
    name: 'Shields',
    description: 'Energy shield generators that absorb damage before it reaches the hull.',
    prerequisite: { systemId: 'armour', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Basic Barrier', description: '+50 shield HP', cost: 100, effect: 50 },
      { tier: 2, name: 'Double Layer', description: '+100 shield HP + regen', cost: 200, effect: 100 },
      { tier: 3, name: 'Overcharged Field', description: '+200 shield HP + fast regen', cost: 400, effect: 200 },
    ],
  },
  {
    id: 'weapons',
    name: 'Weapons',
    description: 'Weapon targeting computers and damage amplifiers for all equipped armaments.',
    prerequisite: { systemId: 'legs', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Aiming Assist', description: '+10% weapon damage', cost: 60, effect: 0.1 },
      { tier: 2, name: 'Gyro Stabilizer', description: '+20% weapon damage', cost: 120, effect: 0.2 },
      { tier: 3, name: 'Power Link', description: '+35% weapon damage', cost: 240, effect: 0.35 },
      { tier: 4, name: 'Overclock Core', description: '+50% weapon damage', cost: 400, effect: 0.5 },
    ],
  },
  {
    id: 'targeting',
    name: 'Targeting',
    description: 'Advanced sensor suites that improve accuracy and critical hit chance.',
    prerequisite: { systemId: 'weapons', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Lidar Scanner', description: '+10% accuracy', cost: 80, effect: 0.1 },
      { tier: 2, name: 'Thermal Optics', description: '+20% accuracy', cost: 160, effect: 0.2 },
      { tier: 3, name: 'Predictive AI', description: '+35% accuracy', cost: 320, effect: 0.35 },
    ],
  },
  {
    id: 'nano_repair',
    name: 'Nano Repair',
    description: 'Nanite swarms that continuously repair hull damage during and after combat.',
    prerequisite: { systemId: 'legs', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Repair Nanites', description: '+1 HP/s regen', cost: 70, effect: 1 },
      { tier: 2, name: 'Swarm Amplifier', description: '+2 HP/s regen', cost: 140, effect: 2 },
      { tier: 3, name: 'Forge Core', description: '+4 HP/s regen', cost: 280, effect: 4 },
    ],
  },
  {
    id: 'support_units',
    name: 'Support Units',
    description: 'Deployable autonomous units that fight alongside the mech in battle.',
    prerequisite: { systemId: 'nano_repair', minTier: 1 },
    tiers: [
      { tier: 1, name: 'Deployment Bay', description: 'Unlock support slot', cost: 150, effect: 1 },
      { tier: 2, name: 'Reinforced Chassis', description: '+25% unit stats', cost: 300, effect: 0.25 },
      { tier: 3, name: 'AI Uplink', description: '+50% unit stats', cost: 500, effect: 0.5 },
    ],
  },
]
