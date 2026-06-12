import type { UpgradeSystemDef } from '../../../data/upgrades'
import type { NodeState } from '../../../services/upgradeService'

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  legs: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 4v10M8 4v18M16 4v18M4 22h16" />
    </svg>
  ),
  armour: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7z" />
    </svg>
  ),
  weapons: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 18L18 6M7 5l12 12M12 2v20" />
    </svg>
  ),
  targeting: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  ),
  nano_repair: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  support_units: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="8" height="8" rx="1" />
      <rect x="14" y="2" width="8" height="8" rx="1" />
      <rect x="8" y="14" width="8" height="8" rx="1" />
    </svg>
  ),
}

const STATE_STYLES: Record<NodeState, { border: string; glow: string; opacity: string }> = {
  locked: { border: 'border-white/10', glow: '', opacity: 'opacity-40' },
  available: { border: 'border-mecha-cyan', glow: 'shadow-[0_0_8px_#00d4ff] animate-pulse-cyan', opacity: 'opacity-100' },
  researching: { border: 'border-mecha-amber', glow: 'shadow-[0_0_8px_#ff8800]', opacity: 'opacity-100' },
  unlocked: { border: 'border-mecha-neon', glow: 'shadow-[0_0_6px_#00ff88]', opacity: 'opacity-100' },
}

interface TechNodeProps {
  system: UpgradeSystemDef
  currentTier: number
  state: NodeState
  isSelected: boolean
  onSelect: () => void
}

export function TechNode({ system, currentTier, state, isSelected, onSelect }: TechNodeProps) {
  const icon = SYSTEM_ICONS[system.id] ?? <span className="text-lg">?</span>
  const styles = STATE_STYLES[state]
  const maxed = currentTier >= system.tiers.length

  return (
    <button
      onClick={onSelect}
      className={`
        group relative flex flex-col items-center gap-1 w-[120px] py-3 px-2 rounded-xl border-2
        transition-all duration-200 min-h-touch min-w-touch
        ${styles.border} ${styles.opacity}
        ${styles.glow}
        ${isSelected ? 'bg-white/15 ring-2 ring-white/30' : 'bg-mecha-steel/40 hover:bg-mecha-steel/60'}
        ${state === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {state === 'researching' && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-mecha-amber/10 to-transparent animate-pulse" />
        </div>
      )}

      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full
        ${state === 'unlocked' ? 'bg-mecha-neon/20 text-mecha-neon' : ''}
        ${state === 'available' ? 'bg-mecha-cyan/20 text-mecha-cyan' : ''}
        ${state === 'researching' ? 'bg-mecha-amber/20 text-mecha-amber' : ''}
        ${state === 'locked' ? 'bg-white/5 text-white/30' : ''}
      `}>
        {state === 'researching' ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
          </svg>
        ) : icon}
      </div>

      <span className={`text-[11px] font-mecha tracking-wider text-center leading-tight
        ${state === 'unlocked' ? 'text-mecha-neon' : ''}
        ${state === 'available' ? 'text-mecha-cyan' : ''}
        ${state === 'researching' ? 'text-mecha-amber' : ''}
        ${state === 'locked' ? 'text-white/30' : ''}
      `}>
        {system.name}
      </span>

      <div className="flex items-center gap-1">
        {Array.from({ length: system.tiers.length }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300
              ${i < currentTier
                ? 'bg-mecha-neon shadow-[0_0_4px_#00ff88]'
                : i === currentTier && state === 'researching'
                  ? 'bg-mecha-amber animate-pulse'
                  : 'bg-white/20'
              }`}
          />
        ))}
      </div>

      {maxed && (
        <span className="text-[9px] font-mecha text-mecha-neon/60 tracking-wider">MAXED</span>
      )}

      {state === 'locked' && system.prerequisite && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100
          pointer-events-none bg-black/90 text-[10px] text-white/80 px-2 py-1 rounded whitespace-nowrap z-20
          transition-opacity duration-200">
          Need {system.prerequisite.systemId} T{system.prerequisite.minTier}
        </div>
      )}
    </button>
  )
}
