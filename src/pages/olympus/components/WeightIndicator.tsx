interface WeightIndicatorProps {
  current: number
  max: number
}

const THRESHOLDS = { green: 0.7, yellow: 0.9 }

export function WeightIndicator({ current, max }: WeightIndicatorProps) {
  const pct = max > 0 ? Math.min(current / max, 1) : 0
  const color =
    pct >= THRESHOLDS.yellow ? 'bg-mecha-crimson shadow-[0_0_6px_#ff2244]' :
    pct >= THRESHOLDS.green ? 'bg-mecha-amber shadow-[0_0_6px_#ff8800]' :
    'bg-mecha-neon shadow-[0_0_6px_#00ff88]'

  const barColor =
    pct >= THRESHOLDS.yellow ? 'text-mecha-crimson' :
    pct >= THRESHOLDS.green ? 'text-mecha-amber' :
    'text-mecha-neon'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50 font-mono">WEIGHT</span>
        <span className={`text-xs font-mono tabular-nums ${barColor}`}>
          {current.toFixed(1)} / {max.toFixed(1)} t
        </span>
      </div>
      <div className="h-3 bg-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
