import { useState } from 'react'
import { getWeapon, type WeaponDefinition } from '../../../data/weapons'
import { usePlayerStore } from '../../../store/playerStore'
import { Modal } from '../../../components/Modal'
import { getWeaponWeight } from '../armoryUtils'

const SLOT_LABELS = ['Left Arm', 'Right Arm', 'Back'] as const

interface WeaponSlotProps {
  slotIndex: number
  equippedWeaponId: string | null
  onEquip: (slotIndex: number, weaponId: string) => void
  onUnequip: (slotIndex: number) => void
}

export function WeaponSlot({ slotIndex, equippedWeaponId, onEquip, onUnequip }: WeaponSlotProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const ownedWeapons = usePlayerStore((s) => s.ownedWeapons)

  const label = SLOT_LABELS[slotIndex]
  const equipped = equippedWeaponId ? getWeapon(equippedWeaponId) : null

  const compatible = ownedWeapons
    .map((ow) => ({ ...ow, def: getWeapon(ow.id) }))
    .filter((ow): ow is { id: string; level: number; def: WeaponDefinition } => {
      if (!ow.def) return false
      if (ow.def.slot === 'back' && slotIndex === 2) return true
      if (ow.def.slot === 'leftArm' && slotIndex === 0) return true
      if (ow.def.slot === 'rightArm' && slotIndex === 1) return true
      return false
    })
    .filter((ow) => !(ow.id === equippedWeaponId && slotIndex !== -1))

  return (
    <>
      <button
        onClick={() => setPickerOpen(true)}
        className="flex flex-col gap-2 p-3 rounded-xl border border-white/10 bg-mecha-steel/40 min-h-touch w-full transition-all hover:border-white/25 active:scale-[0.98]"
      >
        <span className="text-[10px] font-mecha text-white/40 tracking-wider">{label}</span>
        {equipped ? (
          <div className="flex flex-col gap-0.5 text-left">
            <span className="font-mecha text-sm text-white">{equipped.name}</span>
            <span className="text-[10px] text-white/40 font-mono">
              {getWeaponWeight(equipped).toFixed(1)}t · DMG {equipped.damage}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/20">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
            <span className="text-sm text-white/30">Equip Weapon</span>
          </div>
        )}
        {equipped && (
          <button
            onClick={(e) => { e.stopPropagation(); onUnequip(slotIndex) }}
            className="self-end text-[10px] text-white/30 hover:text-mecha-crimson font-mecha min-h-[24px]"
          >
            REMOVE
          </button>
        )}
      </button>

      <Modal open={pickerOpen} title={`Select ${label} Weapon`} onClose={() => setPickerOpen(false)}>
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          {compatible.length === 0 && (
            <p className="text-sm text-white/30 py-4 text-center">No compatible weapons in inventory.</p>
          )}
          {compatible.map((ow) => (
            <button
              key={ow.id}
              onClick={() => { onEquip(slotIndex, ow.id); setPickerOpen(false) }}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all min-h-touch
                ${ow.id === equippedWeaponId
                  ? 'border-mecha-cyan bg-mecha-cyan/10'
                  : 'border-white/10 bg-mecha-steel/60 hover:border-white/25'
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <span className="font-mecha text-sm text-white block truncate">{ow.def.name}</span>
                <span className="text-[10px] text-white/40 font-mono">
                  Lv.{ow.level} · {ow.def.category} · {getWeaponWeight(ow.def).toFixed(1)}t
                </span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">
                DMG {ow.def.damage}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}
