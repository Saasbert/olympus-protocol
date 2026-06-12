import { useCoinStore } from '../../../store/coinStore'
import { getNextTier, getPrerequisiteMet, getResearchTimeMs, getEffectDescription } from '../../../services/upgradeService'
import type { UpgradeSystemDef } from '../../../data/upgrades'

interface UpgradePanelProps {
  system: UpgradeSystemDef | null
  currentTier: number
  unlockedUpgrades: Record<string, number>
  researchingSystemId: string | null
  researchProgress: number
  onStartResearch: (systemId: string, tier: number) => void
  onCancelResearch: () => void
}

function formatTime(ms: number): string {
  const s = Math.ceil(ms / 1000)
  return `${s}s`
}

export function UpgradePanel({
  system,
  currentTier,
  unlockedUpgrades,
  researchingSystemId,
  researchProgress,
  onStartResearch,
  onCancelResearch,
}: UpgradePanelProps) {
  const coins = useCoinStore(s => s.coins)

  if (!system) {
    return (
      <div className="flex items-center justify-center h-full rounded-xl bg-mecha-steel/20 border border-white/5">
        <p className="text-white/30 font-body text-sm">Select an upgrade node</p>
      </div>
    )
  }

  const isResearching = researchingSystemId === system.id
  const nextTier = getNextTier(system, currentTier)
  const isMaxTier = nextTier === null
  const prereqMet = getPrerequisiteMet(system, unlockedUpgrades)
  const canAfford = nextTier ? coins >= nextTier.cost : false
  const canResearch = prereqMet && !isMaxTier && canAfford && !isResearching
  const researchingThis = researchingSystemId === system.id

  const currentTierData = system.tiers.find(t => t.tier === currentTier)

  return (
    <div className="h-full rounded-xl bg-mecha-steel/20 border border-white/5 p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-mecha-cyan/20 text-mecha-cyan shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {system.id === 'legs' && <path d="M12 4v10M8 4v18M16 4v18M4 22h16" />}
            {system.id === 'armour' && <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7z" />}
            {system.id === 'weapons' && <><path d="M6 18L18 6M7 5l12 12M12 2v20" /></>}
            {system.id === 'targeting' && <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" fill="currentColor" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></>}
            {system.id === 'nano_repair' && <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />}
            {system.id === 'support_units' && <><rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="8" y="14" width="8" height="8" rx="1" /></>}
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-mecha text-white tracking-wide">{system.name}</h2>
          <p className="text-[11px] font-body text-white/50">{system.description}</p>
        </div>
      </div>

      {!prereqMet && system.prerequisite && (
        <div className="px-3 py-2 rounded-lg bg-mecha-crimson/10 border border-mecha-crimson/30 text-mecha-crimson text-xs font-body">
          Requires {system.prerequisite.systemId} Tier {system.prerequisite.minTier}
        </div>
      )}

      {currentTierData && (
        <div className="px-3 py-2 rounded-lg bg-mecha-neon/5 border border-mecha-neon/20">
          <span className="text-[10px] font-mecha text-mecha-neon/60 uppercase tracking-wider">Current — Tier {currentTierData.tier}</span>
          <p className="text-sm font-body text-mecha-neon mt-0.5">{currentTierData.name}</p>
          <p className="text-xs font-body text-white/60">{getEffectDescription(system.id, currentTierData.effect)}</p>
        </div>
      )}

      {isMaxTier && (
        <div className="flex items-center justify-center py-3 rounded-lg bg-mecha-neon/10 border border-mecha-neon/30">
          <span className="text-sm font-mecha text-mecha-neon tracking-wider">MAX LEVEL</span>
        </div>
      )}

      {nextTier && !isResearching && (
        <div className="px-3 py-2 rounded-lg bg-mecha-cyan/5 border border-mecha-cyan/20">
          <span className="text-[10px] font-mecha text-mecha-cyan/60 uppercase tracking-wider">
            Next — Tier {nextTier.tier}
          </span>
          <p className="text-sm font-body text-mecha-cyan mt-0.5">{nextTier.name}</p>
          <p className="text-xs font-body text-white/60">{getEffectDescription(system.id, nextTier.effect)}</p>
          <div className="flex gap-4 mt-1.5 text-xs font-body text-white/50">
            <span>Cost: <span className={`${canAfford ? 'text-mecha-neon' : 'text-mecha-crimson'}`}>{nextTier.cost}¢</span></span>
            <span>Time: {formatTime(getResearchTimeMs(nextTier.cost))}</span>
          </div>
        </div>
      )}

      {researchingThis && (
        <div className="px-3 py-3 rounded-lg bg-mecha-amber/10 border border-mecha-amber/30">
          <span className="text-[10px] font-mecha text-mecha-amber uppercase tracking-wider">Researching...</span>
          <div className="mt-2 h-3 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mecha-amber to-mecha-amber/60 rounded-full transition-all duration-200"
              style={{ width: `${researchProgress * 100}%` }}
            />
          </div>
          <span className="text-xs font-body text-mecha-amber/70 mt-1 block">
            {Math.round(researchProgress * 100)}%
          </span>
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-2">
        {!isMaxTier && !researchingThis && (
          <button
            onClick={() => nextTier && onStartResearch(system.id, nextTier.tier)}
            disabled={!canResearch}
            className={`
              flex-1 py-3 rounded-xl font-mecha text-sm tracking-wider transition-all min-h-touch
              ${canResearch
                ? 'bg-mecha-cyan text-black hover:bg-mecha-cyan/90 shadow-[0_0_8px_#00d4ff60] active:scale-[0.98]'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            {!prereqMet ? 'LOCKED' : !canAfford ? 'NOT ENOUGH ¢' : 'RESEARCH'}
          </button>
        )}

        {researchingThis && (
          <button
            onClick={onCancelResearch}
            className="flex-1 py-3 rounded-xl font-mecha text-sm tracking-wider transition-all min-h-touch
              bg-mecha-crimson/20 text-mecha-crimson border border-mecha-crimson/30 hover:bg-mecha-crimson/30"
          >
            CANCEL (50% refund)
          </button>
        )}
      </div>
    </div>
  )
}
