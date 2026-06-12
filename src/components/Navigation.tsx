import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/spelling', label: 'Spelling', icon: '📝' },
  { to: '/math', label: 'Math', icon: '🔢' },
  { to: '/olympus', label: 'Olympus', icon: '⚡' },
]

export function Navigation() {
  return (
    <nav className="flex items-center justify-around bg-mecha-steel border-t border-white/10 py-1">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 min-h-touch min-w-touch rounded-lg transition-colors ${
              isActive ? 'text-mecha-cyan' : 'text-white/50'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
