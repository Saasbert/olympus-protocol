import type { WeaponDefinition, WeaponCategory } from '../../../data/weapons'

const CATEGORY_BADGES: Record<WeaponCategory, { label: string; color: string; bg: string }> = {
  artillery: { label: 'ARTILLERY', color: 'text-mecha-amber', bg: 'bg-mecha-amber/20' },
  heavy: { label: 'HEAVY', color: 'text-mecha-cyan', bg: 'bg-mecha-cyan/20' },
  machineGun: { label: 'MG', color: 'text-mecha-amber', bg: 'bg-mecha-amber/20' },
  lightLaser: { label: 'LASER', color: 'text-mecha-cyan', bg: 'bg-mecha-cyan/20' },
  missile: { label: 'MISSILE', color: 'text-mecha-crimson', bg: 'bg-mecha-crimson/20' },
}

interface WeaponCardProps {
  weapon: WeaponDefinition
  level?: number
  owned?: boolean
  selected?: boolean
  greyed?: boolean
  showCost?: boolean
  cost?: number
  weight?: number
  actionLabel?: string
  actionDisabled?: boolean
  onAction?: () => void
  onSelect?: () => void
  compact?: boolean
}

export function WeaponCard({
  weapon,
  level = 1,
  owned = true,
  selected = false,
  greyed = false,
  showCost = false,
  cost = 0,
  weight = 0,
  actionLabel,
  actionDisabled = false,
  onAction,
  onSelect,
  compact = false,
}: WeaponCardProps) {
  const badge = CATEGORY_BADGES[weapon.category]

  return (
    <button
      onClick={onSelect}
      className={`
        relative flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all
        ${greyed ? 'opacity-40' : ''}
        ${selected
          ? 'border-mecha-cyan bg-mecha-cyan/10 shadow-[0_0_8px_#00d4ff40]'
          : 'border-white/10 bg-mecha-steel/60 hover:border-white/25'
        }
        min-h-touch
      `}
      disabled={greyed}
    >
      {owned && level > 1 && (
        <span className="absolute top-2 right-2 text-[10px] font-mecha text-mecha-neon bg-mecha-neon/10 px-1.5 py-0.5 rounded">
          Lv.{level}
        </span>
      )}
      {!owned && (
        <span className="absolute top-2 right-2 text-[10px] font-mecha text-white/40 bg-black/40 px-1.5 py-0.5 rounded">
          LOCKED
        </span>
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-mecha px-2 py-0.5 rounded ${badge.bg} ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-xs text-white/40">·</span>
        <span className="text-xs text-white/40 capitalize">{weapon.slot.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>

      <span className="font-mecha text-sm text-white truncate leading-tight">{weapon.name}</span>

      {!compact && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1">
          <StatRow label="DMG" value={weapon.damage} />
          <StatRow label="COOLDOWN" value={`${weapon.cooldown}ms`} />
          <StatRow label="RNG" value={weapon.range} />
          <StatRow label="ACC" value={`${Math.round(weapon.accuracy * 100)}%`} />
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[11px] text-white/30 font-mono">{weight.toFixed(1)}t</span>
        {showCost && (
          <span className="text-[11px] font-mecha text-mecha-amber">Ꜧ {cost}</span>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.() }}
          disabled={actionDisabled}
          className={`
            mt-2 w-full py-2 rounded-lg text-xs font-mecha transition-all
            min-h-touch
            ${actionDisabled
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-mecha-cyan text-black hover:bg-mecha-cyan/80 active:scale-[0.97]'
            }
          `}
        >
          {actionLabel}
        </button>
      )}
    </button>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/30 font-mono">{label}</span>
      <span className="text-[11px] text-white/70 font-mono tabular-nums">{value}</span>
    </div>
  )
}
