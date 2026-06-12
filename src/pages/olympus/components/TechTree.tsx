import { useRef, useEffect, useState, useCallback } from 'react'
import { upgradeSystems } from '../../../data/upgrades'
import { getNodeState } from '../../../services/upgradeService'
import type { UpgradeSystemDef } from '../../../data/upgrades'
import { TechNode } from './TechNode'

interface Connector {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface TechTreeProps {
  unlockedUpgrades: Record<string, number>
  researchingSystemId: string | null
  selectedSystemId: string | null
  onSelectSystem: (id: string) => void
}

function systemById(id: string): UpgradeSystemDef | undefined {
  return upgradeSystems.find(s => s.id === id)
}

const CONNECTIONS: [string, string][] = [
  ['legs', 'armour'],
  ['legs', 'weapons'],
  ['legs', 'nano_repair'],
  ['armour', 'shields'],
  ['weapons', 'targeting'],
  ['nano_repair', 'support_units'],
]

export function TechTree({ unlockedUpgrades, researchingSystemId, selectedSystemId, onSelectSystem }: TechTreeProps) {
  const treeRef = useRef<HTMLDivElement>(null)
  const [connectors, setConnectors] = useState<Connector[]>([])

  const measure = useCallback(() => {
    const container = treeRef.current
    if (!container) return
    const cr = container.getBoundingClientRect()
    const result: Connector[] = []
    for (const [fromId, toId] of CONNECTIONS) {
      const fromEl = container.querySelector<HTMLElement>(`[data-node-id="${fromId}"]`)
      const toEl = container.querySelector<HTMLElement>(`[data-node-id="${toId}"]`)
      if (fromEl && toEl) {
        const fr = fromEl.getBoundingClientRect()
        const tr = toEl.getBoundingClientRect()
        result.push({
          x1: fr.left + fr.width / 2 - cr.left,
          y1: fr.top + fr.height / 2 - cr.top,
          x2: tr.left + tr.width / 2 - cr.left,
          y2: tr.top + tr.height / 2 - cr.top,
        })
      }
    }
    setConnectors(result)
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (treeRef.current) ro.observe(treeRef.current)
    return () => ro.disconnect()
  }, [measure])

  return (
    <div ref={treeRef} className="relative flex flex-col items-center gap-8 py-6 px-4 h-full overflow-y-auto no-scrollbar">
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
        {connectors.map((c, i) => (
          <g key={i}>
            <line
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#00d4ff" strokeWidth={1.5} strokeOpacity={0.25}
            />
          </g>
        ))}
      </svg>

      <div data-node-id="legs" className="z-10">
        {systemById('legs') && (
          <TechNode
            system={systemById('legs')!}
            currentTier={unlockedUpgrades.legs ?? 0}
            state={getNodeState(systemById('legs')!, unlockedUpgrades, researchingSystemId)}
            isSelected={selectedSystemId === 'legs'}
            onSelect={() => onSelectSystem('legs')}
          />
        )}
      </div>

      <div className="flex justify-around w-full max-w-xl z-10 gap-2">
        {['armour', 'weapons', 'nano_repair'].map(id => (
          <div key={id} data-node-id={id}>
            {systemById(id) && (
              <TechNode
                system={systemById(id)!}
                currentTier={unlockedUpgrades[id] ?? 0}
                state={getNodeState(systemById(id)!, unlockedUpgrades, researchingSystemId)}
                isSelected={selectedSystemId === id}
                onSelect={() => onSelectSystem(id)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-around w-full max-w-xl z-10 gap-2">
        {['shields', 'targeting', 'support_units'].map(id => (
          <div key={id} data-node-id={id}>
            {systemById(id) && (
              <TechNode
                system={systemById(id)!}
                currentTier={unlockedUpgrades[id] ?? 0}
                state={getNodeState(systemById(id)!, unlockedUpgrades, researchingSystemId)}
                isSelected={selectedSystemId === id}
                onSelect={() => onSelectSystem(id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
