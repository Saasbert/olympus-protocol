import { getRobot, type RobotArchetype } from '../../../data/robots'
import { usePlayerStore } from '../../../store/playerStore'

const ARCHETYPE_COLORS: Record<RobotArchetype, string> = {
  colossus: 'text-mecha-cyan border-mecha-cyan',
  vanguard: 'text-mecha-neon border-mecha-neon',
  titan: 'text-mecha-amber border-mecha-amber',
}

interface RobotSelectorProps {
  selectedRobotId: string | null
  onSelect: (robotId: string) => void
}

export function RobotSelector({ selectedRobotId, onSelect }: RobotSelectorProps) {
  const ownedRobots = usePlayerStore((s) => s.ownedRobots)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-white/50 font-mecha tracking-wider">SELECT MECH</span>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {ownedRobots.length === 0 && (
          <p className="text-sm text-white/30 py-4">No mechs available. Visit the Garage.</p>
        )}
        {ownedRobots.map((id) => {
          const def = getRobot(id)
          if (!def) return null
          const active = selectedRobotId === id
          const accent = ARCHETYPE_COLORS[def.archetype]
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`
                flex flex-col items-center justify-center gap-1.5 shrink-0
                w-[120px] h-[88px] rounded-xl border-2 transition-all
                min-h-touch min-w-touch
                ${active
                  ? `${accent} bg-white/10 shadow-[0_0_10px_#00d4ff30]`
                  : 'border-white/10 bg-mecha-steel/40 hover:border-white/30'
                }
              `}
            >
              <span className={`font-mecha text-sm ${active ? 'text-white' : 'text-white/60'}`}>
                {def.name}
              </span>
              <span className={`text-[10px] uppercase tracking-wider ${active ? '' : 'text-white/30'}`}>
                {def.archetype}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
