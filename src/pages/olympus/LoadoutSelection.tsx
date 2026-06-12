import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWeapon } from '../../data/weapons'
import { getRobot } from '../../data/robots'
import { useLoadoutStore } from '../../store/loadoutStore'
import { RobotSelector } from './components/RobotSelector'
import { WeaponSlot } from './components/WeaponSlot'
import { WeightIndicator } from './components/WeightIndicator'
import { getWeaponWeight, getLegCapacity } from './armoryUtils'

export function LoadoutSelection() {
  const navigate = useNavigate()
  const { selectedRobot, equippedWeapons, setRobot, setWeapon } = useLoadoutStore()

  const legCapacity = selectedRobot ? getLegCapacity(selectedRobot) : 0

  const totalWeight = useMemo(() => {
    return equippedWeapons.reduce((sum, id) => {
      if (!id) return sum
      const def = getWeapon(id)
      return sum + (def ? getWeaponWeight(def) : 0)
    }, 0)
  }, [equippedWeapons])

  const allSlotsFilled = equippedWeapons.every((s) => s !== null)
  const withinCapacity = totalWeight <= legCapacity
  const canEnter = selectedRobot !== null && allSlotsFilled && withinCapacity

  const handleEnterBattle = () => {
    if (!canEnter) return
    navigate('/olympus/battle')
  }

  const robotDef = selectedRobot ? getRobot(selectedRobot) : null

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <RobotSelector selectedRobotId={selectedRobot} onSelect={setRobot} />

      {selectedRobot && robotDef && (
        <div className="bg-mecha-steel/30 border border-white/5 rounded-xl px-3 py-2 flex items-center gap-3">
          <span className="text-xs text-white/40 font-mecha">CAPACITY</span>
          <span className="text-sm font-mono text-white/70">{legCapacity.toFixed(1)} t</span>
          <span className="text-xs text-white/20">|</span>
          <span className="text-xs text-white/40 font-mecha">ARCHETYPE</span>
          <span className="text-sm font-mono text-white/70 uppercase">{robotDef.archetype}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {([0, 1, 2] as const).map((slotIndex) => (
          <WeaponSlot
            key={slotIndex}
            slotIndex={slotIndex}
            equippedWeaponId={equippedWeapons[slotIndex]}
            onEquip={(_, id) => setWeapon(slotIndex, id)}
            onUnequip={() => setWeapon(slotIndex, null)}
          />
        ))}
      </div>

      <WeightIndicator current={totalWeight} max={legCapacity} />

      <div className="mt-auto pt-2">
        <button
          onClick={handleEnterBattle}
          disabled={!canEnter}
          className={`
            w-full py-4 rounded-xl font-mecha text-base transition-all min-h-touch
            ${canEnter
              ? 'bg-mecha-cyan text-black hover:bg-mecha-cyan/80 active:scale-[0.97] shadow-[0_0_12px_#00d4ff40]'
              : 'bg-mecha-steel text-white/20 border border-white/10 cursor-not-allowed'
            }
          `}
        >
          {!selectedRobot
            ? 'Select a Mech'
            : !allSlotsFilled
              ? 'Equip All Weapons'
              : !withinCapacity
                ? `Overweight (${totalWeight.toFixed(1)} / ${legCapacity.toFixed(1)} t)`
                : 'ENTER BATTLE'}
        </button>
      </div>
    </div>
  )
}
