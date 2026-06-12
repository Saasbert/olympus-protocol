interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: 'green' | 'yellow' | 'red' | 'blue'
  className?: string
  showLabel?: boolean
}

const colorMap = {
  green: 'bg-mecha-neon',
  yellow: 'bg-mecha-amber',
  red: 'bg-mecha-crimson',
  blue: 'bg-mecha-cyan',
}

const glowMap = {
  green: 'shadow-[0_0_6px_#00ff88]',
  yellow: 'shadow-[0_0_6px_#ff8800]',
  red: 'shadow-[0_0_6px_#ff2244]',
  blue: 'shadow-[0_0_6px_#00d4ff]',
}

export function ProgressBar({ value, max, label, color = 'green', className = '', showLabel = true }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-white/60 w-16 shrink-0 font-medium">{label}</span>}
      <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[color]} ${pct > 0 && pct < 100 ? glowMap[color] : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-white/40 w-12 text-right tabular-nums font-mono">{Math.round(pct)}%</span>
      )}
    </div>
  )
}
