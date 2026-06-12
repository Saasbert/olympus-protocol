import { useNavigate } from 'react-router-dom'
import { useBattleStore } from '../../store/battleStore'

export function BattleResult() {
  const result = useBattleStore((s) => s.result)
  const navigate = useNavigate()

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
        <p className="text-white/40 font-mecha text-lg">No battle data</p>
        <button
          onClick={() => navigate('/olympus')}
          className="px-6 py-3 rounded-lg bg-mecha-steel text-white/70 font-mecha text-sm hover:bg-white/10 transition-colors min-h-touch"
        >
          Return to Menu
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 animate-scale-in p-4">
      <h1
        className={`font-mecha text-5xl tracking-[0.15em] ${
          result.won ? 'text-mecha-amber drop-shadow-[0_0_20px_rgba(255,136,0,0.6)]' : 'text-mecha-crimson drop-shadow-[0_0_20px_rgba(255,34,68,0.6)]'
        }`}
      >
        {result.won ? 'VICTORY' : 'DEFEAT'}
      </h1>

      <p className="font-body text-white/30 text-sm">
        {result.won ? 'Your mech prevailed in battle.' : 'Your mech was destroyed.'}
      </p>

      <div className="grid grid-cols-2 gap-x-12 gap-y-3 bg-black/30 rounded-xl px-8 py-5 w-full max-w-sm">
        <StatRow label="Damage Dealt" value={result.damageDealt} />
        <StatRow label="Damage Taken" value={result.damageTaken} />
        <StatRow label="Systems Repaired" value={result.systemsRepaired} />
        <StatRow
          label="Coins Earned"
          value={`+${result.coinsEarned}`}
          highlight
        />
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => navigate('/olympus/loadout')}
          className="px-8 py-3 rounded-lg bg-mecha-cyan text-black font-mecha text-sm hover:brightness-110 transition-all min-h-touch shadow-[0_0_12px_rgba(0,212,255,0.4)]"
        >
          Play Again
        </button>
        <button
          onClick={() => navigate('/olympus')}
          className="px-8 py-3 rounded-lg bg-mecha-steel text-white/70 font-mecha text-sm hover:bg-white/10 transition-colors min-h-touch"
        >
          Return to Menu
        </button>
      </div>
    </div>
  )
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mecha text-white/30 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`font-mecha text-lg ${
          highlight ? 'text-mecha-neon' : 'text-white/80'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
