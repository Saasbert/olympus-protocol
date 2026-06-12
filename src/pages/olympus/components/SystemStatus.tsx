import { type SystemStatusData } from '../../../game/HUDBridge'

interface Props {
  systems: SystemStatusData[]
  repairingSystemId: string | null
  repairProgress: number
  onRepair: (systemId: string) => void
}

const SYSTEM_ICONS: Record<string, string> = {
  armour: '🛡',
  shields: '⚡',
  weapons: '⚔',
  targeting: '🎯',
  nanoRepair: '🔧',
  legs: '🦿',
}

function barColor(ratio: number): string {
  if (ratio > 0.7) return 'bg-mecha-neon'
  if (ratio > 0.3) return 'bg-mecha-amber'
  return 'bg-mecha-crimson'
}

export function SystemStatus({ systems, repairingSystemId, repairProgress, onRepair }: Props) {
  if (systems.length === 0) return null

  return (
    <div className="w-full space-y-1">
      <h3 className="text-[10px] font-mecha text-white/40 uppercase tracking-wider mb-1 ml-0.5">
        Systems
      </h3>
      {systems.map((sys) => {
        const ratio = sys.maxHealth > 0 ? sys.currentHealth / sys.maxHealth : 0
        const isRepairing = repairingSystemId === sys.id
        return (
          <button
            key={sys.id}
            onClick={() => onRepair(sys.id)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-black/40 hover:bg-black/60 transition-colors min-h-touch"
          >
            <span className="text-sm w-5 text-center shrink-0">{SYSTEM_ICONS[sys.id] ?? '?'}</span>
            <span className="text-[11px] font-body text-white/70 w-20 text-left truncate shrink-0">
              {sys.name}
            </span>
            <div className="flex-1 h-3 bg-black/60 rounded overflow-hidden relative">
              <div
                className={`h-full ${barColor(ratio)} transition-all duration-300`}
                style={{ width: `${ratio * 100}%` }}
              />
              {isRepairing && (
                <div
                  className="absolute inset-0 bg-white/20 animate-pulse"
                  style={{
                    width: `${repairProgress * 100}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
