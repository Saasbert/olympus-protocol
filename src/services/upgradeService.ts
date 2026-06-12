import type { UpgradeSystemDef, UpgradeTierDef } from '../data/upgrades'

export type NodeState = 'locked' | 'available' | 'researching' | 'unlocked'

export function getResearchTimeMs(cost: number): number {
  return Math.max(3000, Math.min(15000, cost * 40))
}

export function getPrerequisiteMet(
  system: UpgradeSystemDef,
  unlockedUpgrades: Record<string, number>,
): boolean {
  if (!system.prerequisite) return true
  return (unlockedUpgrades[system.prerequisite.systemId] ?? 0) >= system.prerequisite.minTier
}

export function getNextTier(
  system: UpgradeSystemDef,
  currentTier: number,
): UpgradeTierDef | null {
  return system.tiers.find(t => t.tier === currentTier + 1) ?? null
}

export function canResearch(
  system: UpgradeSystemDef,
  currentTier: number,
  coins: number,
  unlockedUpgrades: Record<string, number>,
): boolean {
  if (!getPrerequisiteMet(system, unlockedUpgrades)) return false
  if (currentTier >= system.tiers.length) return false
  const next = getNextTier(system, currentTier)
  if (!next) return false
  return coins >= next.cost
}

export function getNodeState(
  system: UpgradeSystemDef,
  unlockedUpgrades: Record<string, number>,
  researchingSystemId: string | null,
): NodeState {
  const currentTier = unlockedUpgrades[system.id] ?? 0
  if (researchingSystemId === system.id) return 'researching'
  if (currentTier > 0) return 'unlocked'
  if (!getPrerequisiteMet(system, unlockedUpgrades)) return 'locked'
  return 'available'
}

export function getEffectDescription(systemId: string, effect: number): string {
  switch (systemId) {
    case 'legs':
      return `Speed ×${(1 + effect).toFixed(1)}`
    case 'armour':
      return `Armour ×${(1 + effect).toFixed(1)}`
    case 'shields':
      return `+${effect} Shield HP`
    case 'weapons':
      return `Damage ×${(1 + effect).toFixed(1)}`
    case 'targeting':
      return `+${Math.round(effect * 100)}% Accuracy`
    case 'nano_repair':
      return `+${effect} HP/s Regen`
    case 'support_units':
      return effect >= 1 ? `Slot +${effect}` : `Unit Stats ×${(1 + effect).toFixed(1)}`
    default:
      return ''
  }
}
