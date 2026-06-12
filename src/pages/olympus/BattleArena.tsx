import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGame } from '../../game/index'
import { useLoadoutStore } from '../../store/loadoutStore'
import { useBattleStore } from '../../store/battleStore'
import { hudBridge } from '../../game/HUDBridge'
import { CombatHUD } from './components/CombatHUD'

export function BattleArena() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<ReturnType<typeof createGame> | null>(null)
  const loadout = useLoadoutStore()
  const result = useBattleStore((s) => s.result)
  const navigate = useNavigate()

  useEffect(() => {
    hudBridge.reset()
    useBattleStore.getState().clearResult()

    const game = createGame({
      robotId: loadout.selectedRobot || 'titan',
      weapons: loadout.equippedWeapons,
    })
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    if (result) navigate('/olympus/result')
  }, [result, navigate])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} id="phaser-container" className="w-full h-full" />
      <CombatHUD />
    </div>
  )
}
