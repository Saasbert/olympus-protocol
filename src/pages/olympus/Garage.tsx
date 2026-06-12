import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { upgradeSystems } from '../../data/upgrades'
import { usePlayerStore } from '../../store/playerStore'
import { useCoinStore } from '../../store/coinStore'
import { getNextTier, getResearchTimeMs } from '../../services/upgradeService'
import { TechTree } from './components/TechTree'
import { UpgradePanel } from './components/UpgradePanel'

export function Garage() {
  const navigate = useNavigate()
  const unlockedUpgrades = usePlayerStore(s => s.unlockedUpgrades)
  const unlockUpgrade = usePlayerStore(s => s.unlockUpgrade)
  const spendCoins = useCoinStore(s => s.spendCoins)
  const earnCoins = useCoinStore(s => s.earnCoins)

  const [selectedSystemId, setSelectedSystemId] = useState<string>('legs')
  const [researchingSystemId, setResearchingSystemId] = useState<string | null>(null)
  const [researchTier, setResearchTier] = useState(0)
  const [researchStartTime, setResearchStartTime] = useState(0)
  const [researchDuration, setResearchDuration] = useState(0)
  const [researchProgress, setResearchProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedSystem = upgradeSystems.find(s => s.id === selectedSystemId) ?? null
  const currentTier = unlockedUpgrades[selectedSystemId] ?? 0

  const handleSelectSystem = useCallback((id: string) => {
    setSelectedSystemId(id)
  }, [])

  const handleStartResearch = useCallback((systemId: string, tier: number) => {
    const system = upgradeSystems.find(s => s.id === systemId)
    if (!system) return
    const ct = unlockedUpgrades[system.id] ?? 0
    const next = getNextTier(system, ct)
    if (!next) return
    if (!spendCoins(next.cost)) return
    setResearchingSystemId(systemId)
    setResearchTier(tier)
    setResearchStartTime(Date.now())
    setResearchDuration(getResearchTimeMs(next.cost))
    setResearchProgress(0)
  }, [unlockedUpgrades, spendCoins])

  const handleCancelResearch = useCallback(() => {
    if (!researchingSystemId) return
    const system = upgradeSystems.find(s => s.id === researchingSystemId)
    if (system) {
      const ct = unlockedUpgrades[system.id] ?? 0
      const next = getNextTier(system, ct)
      if (next) {
        earnCoins(Math.floor(next.cost / 2))
      }
    }
    setResearchingSystemId(null)
    setResearchTier(0)
    setResearchProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [researchingSystemId, unlockedUpgrades, earnCoins])

  useEffect(() => {
    if (!researchingSystemId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setResearchProgress(0)
      return
    }
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - researchStartTime
      const progress = Math.min(elapsed / researchDuration, 1)
      setResearchProgress(progress)
      if (progress >= 1) {
        unlockUpgrade(researchingSystemId, researchTier)
        setResearchingSystemId(null)
        setResearchTier(0)
        setResearchProgress(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }, 100)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [researchingSystemId, researchStartTime, researchDuration, researchTier, unlockUpgrade])

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-2 shrink-0">
        <button
          onClick={() => navigate('/olympus')}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors min-h-touch font-mecha text-sm tracking-wider"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          BACK
        </button>
        <span className="text-sm font-mecha text-white/30 tracking-widest">/ GARAGE</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 px-4 pb-4 min-h-0">
        <div className="flex-[3] min-h-0 rounded-xl bg-mecha-steel/10 border border-white/5 overflow-hidden">
          <TechTree
            unlockedUpgrades={unlockedUpgrades}
            researchingSystemId={researchingSystemId}
            selectedSystemId={selectedSystemId}
            onSelectSystem={handleSelectSystem}
          />
        </div>
        <div className="flex-[2] min-h-0">
          <UpgradePanel
            system={selectedSystem}
            currentTier={currentTier}
            unlockedUpgrades={unlockedUpgrades}
            researchingSystemId={researchingSystemId}
            researchProgress={researchProgress}
            onStartResearch={handleStartResearch}
            onCancelResearch={handleCancelResearch}
          />
        </div>
      </div>
    </div>
  )
}
