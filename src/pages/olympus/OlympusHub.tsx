import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { MainMenu } from './MainMenu'
import { Garage } from './Garage'
import { Armory } from './Armory'
import { LoadoutSelection } from './LoadoutSelection'
import { BattleArena } from './BattleArena'
import { BattleResult } from './BattleResult'

const subTabs = [
  { path: '/olympus', label: 'Menu', exact: true },
  { path: '/olympus/garage', label: 'Garage' },
  { path: '/olympus/armory', label: 'Armory' },
]

export function OlympusHub() {
  const navigate = useNavigate()
  const location = useLocation()

  const isInBattle = location.pathname === '/olympus/battle' || location.pathname === '/olympus/result'

  if (isInBattle) {
    return (
      <div className="h-full animate-fade-in">
        <Routes>
          <Route path="battle" element={<BattleArena />} />
          <Route path="result" element={<BattleResult />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <nav className="flex gap-2 px-4 py-2 bg-black/20 shrink-0">
        {subTabs.map((tab) => {
          const active = tab.exact ? location.pathname === tab.path : location.pathname.startsWith(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-h-touch ${
                active
                  ? 'bg-mecha-cyan text-black shadow-[0_0_8px_#00d4ff]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Routes>
          <Route index element={<MainMenu />} />
          <Route path="garage" element={<Garage />} />
          <Route path="armory" element={<Armory />} />
          <Route path="loadout" element={<LoadoutSelection />} />
          <Route path="battle" element={<BattleArena />} />
          <Route path="result" element={<BattleResult />} />
        </Routes>
      </div>
    </div>
  )
}
