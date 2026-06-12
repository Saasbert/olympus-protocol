interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: 'green' | 'yellow' | 'red' | 'blue'
  className?: string
}

const colorMap = {
  green: 'bg-mecha-neon',
  yellow: 'bg-mecha-amber',
  red: 'bg-mecha-crimson',
  blue: 'bg-mecha-cyan',
}

export function ProgressBar({ value, max, label, color = 'green', className = '' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-white/60 w-16 shrink-0">{label}</span>}
      <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-white/40 w-12 text-right tabular-nums">{Math.round(pct)}%</span>
    </div>
  )
}
