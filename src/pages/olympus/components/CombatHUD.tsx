import { useState, useEffect, useCallback } from 'react'
import { hudBridge, type SystemStatusData } from '../../../game/HUDBridge'
import { SystemStatus } from './SystemStatus'

interface LocalHUDState {
  playerHP: number
  playerMaxHP: number
  opponentHP: number
  opponentMaxHP: number
  systems: SystemStatusData[]
  repairProgress: number
  repairingSystemId: string | null
  weaponCooldowns: [number, number, number]
}

function HealthBar({
  label,
  hp,
  maxHP,
  large,
  align,
}: {
  label: string
  hp: number
  maxHP: number
  large?: boolean
  align: 'left' | 'right'
}) {
  const ratio = maxHP > 0 ? hp / maxHP : 0
  const pct = Math.round(ratio * 100)
  const color =
    ratio > 0.5 ? 'bg-mecha-neon' : ratio > 0.25 ? 'bg-mecha-amber' : 'bg-mecha-crimson'

  return (
    <div
      className={`flex flex-col gap-0.5 ${align === 'right' ? 'items-end' : 'items-start'}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-mecha text-white/60 text-xs">{label}</span>
        <span
          className={`font-mecha ${large ? 'text-base' : 'text-xs'} ${color.replace('bg-', 'text-')}`}
        >
          {pct}%
        </span>
      </div>
      <div
        className={`bg-black/60 rounded overflow-hidden ${large ? 'h-5 w-52' : 'h-3 w-32'}`}
      >
        <div
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="text-[10px] font-body text-white/30">
        {Math.round(hp)} / {maxHP}
      </span>
    </div>
  )
}

function CooldownBar({ label, value, index }: { label: string; value: number; index: number }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] font-mono text-white/40 w-8 text-right">{index + 1}</span>
      <div className="flex-1 h-3 bg-black/60 rounded overflow-hidden">
        <div
          className="h-full bg-mecha-cyan transition-all duration-150"
          style={{ width: `${(1 - value) * 100}%` }}
        />
      </div>
      <span className="text-[9px] font-body text-white/30 w-10">{label}</span>
    </div>
  )
}

export function CombatHUD() {
  const [hud, setHUD] = useState<LocalHUDState>({
    playerHP: 100,
    playerMaxHP: 100,
    opponentHP: 100,
    opponentMaxHP: 100,
    systems: [],
    repairProgress: 0,
    repairingSystemId: null,
    weaponCooldowns: [0, 0, 0],
  })

  useEffect(() => {
    let rafId: number

    const poll = () => {
      const s = hudBridge.state
      setHUD({
        playerHP: s.playerHP,
        playerMaxHP: s.playerMaxHP,
        opponentHP: s.opponentHP,
        opponentMaxHP: s.opponentMaxHP,
        systems: s.systems,
        repairProgress: s.repairProgress,
        repairingSystemId: s.repairingSystemId,
        weaponCooldowns: s.weaponCooldowns,
      })
      rafId = requestAnimationFrame(poll)
    }

    rafId = requestAnimationFrame(poll)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleRepair = useCallback((systemId: string) => {
    hudBridge.requestRepair(systemId)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-3 left-3 pointer-events-auto">
        <HealthBar label="PLAYER" hp={hud.playerHP} maxHP={hud.playerMaxHP} large align="left" />
      </div>

      <div className="absolute top-3 right-3 pointer-events-auto">
        <HealthBar label="OPPONENT" hp={hud.opponentHP} maxHP={hud.opponentMaxHP} align="right" />
      </div>

      <div className="absolute bottom-3 left-3 w-56 pointer-events-auto">
        <SystemStatus
          systems={hud.systems}
          repairingSystemId={hud.repairingSystemId}
          repairProgress={hud.repairProgress}
          onRepair={handleRepair}
        />
      </div>

      <div className="absolute bottom-3 right-3 w-36 pointer-events-auto space-y-1">
        <h3 className="text-[10px] font-mecha text-white/40 uppercase tracking-wider text-right">
          Weapons
        </h3>
        <CooldownBar label="W1" value={hud.weaponCooldowns[0]} index={0} />
        <CooldownBar label="W2" value={hud.weaponCooldowns[1]} index={1} />
        <CooldownBar label="W3" value={hud.weaponCooldowns[2]} index={2} />
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 pointer-events-auto">
        {hud.repairingSystemId && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mecha text-mecha-cyan animate-pulse">
              REPAIRING...
            </span>
            <div className="w-full h-2 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-mecha-cyan transition-all duration-150"
                style={{ width: `${hud.repairProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
