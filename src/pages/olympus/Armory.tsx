import { useState } from 'react'
import { getWeapon, WEAPONS } from '../../data/weapons'
import { usePlayerStore } from '../../store/playerStore'
import { useCoinStore } from '../../store/coinStore'
import { WeaponCard } from './components/WeaponCard'
import {
  getWeaponWeight,
  getWeaponBaseCost,
  getUpgradeCost,
  getStatsAtLevel,
  findMergeRecipe,
} from './armoryUtils'
import { BALANCE } from '../../data/balance'

type Tab = 'produce' | 'upgrade' | 'merge'

export function Armory() {
  const [activeTab, setActiveTab] = useState<Tab>('produce')
  const [upgradeSelection, setUpgradeSelection] = useState<string | null>(null)
  const [mergeSelections, setMergeSelections] = useState<number[]>([])

  const ownedWeapons = usePlayerStore((s) => s.ownedWeapons)
  const addWeapon = usePlayerStore((s) => s.addWeapon)
  const upgradeWeapon = usePlayerStore((s) => s.upgradeWeapon)
  const removeWeapon = usePlayerStore((s) => s.removeWeapon)
  const coins = useCoinStore((s) => s.coins)
  const spendCoins = useCoinStore((s) => s.spendCoins)

  const isOwned = (id: string) => ownedWeapons.some((ow) => ow.id === id)
  const getOwned = (id: string) => ownedWeapons.find((ow) => ow.id === id)

  const handleProduce = (id: string) => {
    const def = getWeapon(id)
    if (!def) return
    const cost = getWeaponBaseCost(def)
    if (spendCoins(cost)) {
      addWeapon(id)
    }
  }

  const handleUpgrade = () => {
    if (!upgradeSelection) return
    const owned = getOwned(upgradeSelection)
    if (!owned || owned.level >= BALANCE.maxWeaponUpgradeLevel) return
    const def = getWeapon(upgradeSelection)
    if (!def) return
    const cost = getUpgradeCost(getWeaponBaseCost(def), owned.level)
    if (spendCoins(cost)) {
      upgradeWeapon(upgradeSelection)
      setUpgradeSelection(null)
    }
  }

  const toggleMergeSelection = (index: number) => {
    setMergeSelections((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index)
      if (prev.length < 2) return [...prev, index]
      return [prev[1], index]
    })
  }

  const handleMerge = () => {
    if (mergeSelections.length !== 2) return
    const a = ownedWeapons[mergeSelections[0]]
    const b = ownedWeapons[mergeSelections[1]]
    if (!a || !b) return
    const defA = getWeapon(a.id)
    const defB = getWeapon(b.id)
    if (!defA || !defB || defA.category !== defB.category) return
    const recipe = findMergeRecipe(a.id, b.id)
    if (!recipe) return
    if (isOwned(recipe.result.id)) return

    removeWeapon(a.id)
    removeWeapon(b.id)
    addWeapon(recipe.result.id)
    setMergeSelections([])
  }

  const canAfford = (cost: number) => coins >= cost

  return (
    <div className="flex flex-col h-full">
      <TabBar active={activeTab} onSwitch={setActiveTab} />
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {activeTab === 'produce' && (
          <ProduceTab
            weapons={WEAPONS}
            ownedWeapons={ownedWeapons}
            canAfford={canAfford}
            getWeight={getWeaponWeight}
            getCost={getWeaponBaseCost}
            onProduce={handleProduce}
          />
        )}
        {activeTab === 'upgrade' && (
          <UpgradeTab
            ownedWeapons={ownedWeapons}
            selection={upgradeSelection}
            onSelect={setUpgradeSelection}
            onUpgrade={handleUpgrade}
            canAfford={canAfford}
            getOwned={getOwned}
          />
        )}
        {activeTab === 'merge' && (
          <MergeTab
            ownedWeapons={ownedWeapons}
            selections={mergeSelections}
            onToggle={toggleMergeSelection}
            onMerge={handleMerge}
            isOwned={isOwned}
          />
        )}
      </div>
    </div>
  )
}

function TabBar({ active, onSwitch }: { active: Tab; onSwitch: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'produce', label: 'Produce' },
    { key: 'upgrade', label: 'Upgrade' },
    { key: 'merge', label: 'Merge' },
  ]
  return (
    <div className="flex gap-2 px-4 py-2 bg-black/20 shrink-0 border-b border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onSwitch(tab.key)}
          className={`px-5 py-2 rounded-lg text-sm font-mecha transition-all min-h-touch ${
            active === tab.key
              ? 'bg-mecha-cyan text-black shadow-[0_0_8px_#00d4ff]'
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function ProduceTab({
  weapons,
  ownedWeapons,
  canAfford,
  getWeight,
  getCost,
  onProduce,
}: {
  weapons: typeof WEAPONS
  ownedWeapons: { id: string; level: number }[]
  canAfford: (c: number) => boolean
  getWeight: (w: (typeof WEAPONS)[number]) => number
  getCost: (w: (typeof WEAPONS)[number]) => number
  onProduce: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {weapons.map((w) => {
        const owned = ownedWeapons.some((ow) => ow.id === w.id)
        const cost = getCost(w)
        return (
          <WeaponCard
            key={w.id}
            weapon={w}
            owned={owned}
            greyed={owned || !canAfford(cost)}
            showCost
            cost={cost}
            weight={getWeight(w)}
            actionLabel={owned ? 'OWNED' : 'Produce'}
            actionDisabled={owned || !canAfford(cost)}
            onAction={owned ? undefined : () => onProduce(w.id)}
          />
        )
      })}
    </div>
  )
}

function UpgradeTab({
  ownedWeapons,
  selection,
  onSelect,
  onUpgrade,
  canAfford,
  getOwned,
}: {
  ownedWeapons: { id: string; level: number }[]
  selection: string | null
  onSelect: (id: string | null) => void
  onUpgrade: () => void
  canAfford: (c: number) => boolean
  getOwned: (id: string) => { id: string; level: number } | undefined
}) {
  if (ownedWeapons.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-white/30 font-mecha text-sm">No weapons yet! Craft some in the Produce tab.</p>
      </div>
    )
  }

  const grouped = ownedWeapons
    .map((ow) => ({ ...ow, def: getWeapon(ow.id) }))
    .filter((ow) => ow.def)

  const selectedOwned = selection ? getOwned(selection) : null
  const selectedDef = selection ? getWeapon(selection) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {grouped.map((ow) => {
          if (!ow.def) return null
          const active = ow.id === selection
          const atMax = ow.level >= BALANCE.maxWeaponUpgradeLevel
          const cost = getUpgradeCost(getWeaponBaseCost(ow.def), ow.level)
          return (
            <WeaponCard
              key={`${ow.id}-${ow.level}`}
              weapon={ow.def}
              level={ow.level}
              owned
              selected={active}
              weight={getWeaponWeight(ow.def)}
              onSelect={() => onSelect(active ? null : ow.id)}
              actionLabel={atMax ? 'MAX LEVEL' : `Upgrade Ꜧ${cost}`}
              actionDisabled={atMax || !canAfford(cost) || !active}
              onAction={active ? onUpgrade : undefined}
            />
          )
        })}
      </div>

      {selectedDef && selectedOwned && selectedOwned.level < BALANCE.maxWeaponUpgradeLevel && (
        <div className="bg-mecha-steel/40 border border-white/10 rounded-xl p-4">
          <h3 className="font-mecha text-sm text-mecha-cyan mb-3">Upgrade Preview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <UpgradeStat label="Damage" before={selectedDef.damage} after={getStatsAtLevel(selectedDef, selectedOwned.level + 1).damage} />
            <UpgradeStat label="Cooldown" before={`${selectedDef.cooldown}ms`} after={`${getStatsAtLevel(selectedDef, selectedOwned.level + 1).cooldown}ms`} />
            <UpgradeStat label="Range" before={selectedDef.range} after={getStatsAtLevel(selectedDef, selectedOwned.level + 1).range} />
            <UpgradeStat label="Accuracy" before={`${Math.round(selectedDef.accuracy * 100)}%`} after={`${Math.round(getStatsAtLevel(selectedDef, selectedOwned.level + 1).accuracy * 100)}%`} />
          </div>
        </div>
      )}
    </div>
  )
}

function UpgradeStat({ label, before, after }: { label: string; before: string | number; after: string | number }) {
  return (
    <div>
      <span className="text-[10px] text-white/30 font-mono block">{label}</span>
      <span className="text-sm font-mono text-white/50 line-through">{before}</span>
      <span className="text-sm font-mono text-mecha-neon ml-2">{after}</span>
    </div>
  )
}

function MergeTab({
  ownedWeapons,
  selections,
  onToggle,
  onMerge,
  isOwned,
}: {
  ownedWeapons: { id: string; level: number }[]
  selections: number[]
  onToggle: (index: number) => void
  onMerge: () => void
  isOwned: (id: string) => boolean
}) {
  if (ownedWeapons.length < 2) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-white/30 font-mecha text-sm">Own at least two weapons of the same category to merge.</p>
      </div>
    )
  }

  const grouped = ownedWeapons
    .map((ow, i) => ({ ...ow, index: i, def: getWeapon(ow.id) }))
    .filter((ow) => ow.def)

  const selA = selections.length > 0 ? grouped.find((g) => g.index === selections[0]) : null
  const selB = selections.length > 1 ? grouped.find((g) => g.index === selections[1]) : null

  const canMerge =
    selA &&
    selB &&
    selA.def &&
    selB.def &&
    selA.def.category === selB.def.category &&
    selA.index !== selB.index &&
    (() => {
      const recipe = findMergeRecipe(selA.id, selB.id)
      return !!recipe && !isOwned(recipe.result.id)
    })()

  const mergeRecipe =
    selA && selB ? findMergeRecipe(selA.id, selB.id) : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {grouped.map((ow) => {
          if (!ow.def) return null
          const idx = selections.indexOf(ow.index)
          return (
            <WeaponCard
              key={`${ow.id}-${ow.index}`}
              weapon={ow.def}
              level={ow.level}
              owned
              selected={idx !== -1}
              weight={getWeaponWeight(ow.def)}
              onSelect={() => onToggle(ow.index)}
            />
          )
        })}
      </div>

      {mergeRecipe && (
        <div className="bg-mecha-steel/40 border border-white/10 rounded-xl p-4">
          <h3 className="font-mecha text-sm text-mecha-cyan mb-2">Merge Result</h3>
          <WeaponCard
            weapon={mergeRecipe.result}
            level={1}
            owned
            weight={getWeaponWeight(mergeRecipe.result)}
            compact
          />
          <button
            onClick={onMerge}
            disabled={!canMerge}
            className={`
              mt-3 w-full py-3 rounded-xl text-sm font-mecha transition-all min-h-touch
              ${canMerge
                ? 'bg-mecha-cyan text-black hover:bg-mecha-cyan/80 active:scale-[0.97]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            Merge & Consume
          </button>
        </div>
      )}

      {selA && selB && !mergeRecipe && (
        <p className="text-xs text-white/30 text-center">
          Selected weapons cannot be merged. Choose two of the same category that form a valid pair.
        </p>
      )}
    </div>
  )
}
