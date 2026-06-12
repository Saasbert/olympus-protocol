import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/spelling', label: 'Spelling', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /><path d="M4 11h4" /><path d="M16 11h4" />
    </svg>
  ) },
  { to: '/math', label: 'Math', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ) },
  { to: '/olympus', label: 'Olympus', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ) },
]

export function Navigation() {
  return (
    <nav className="flex items-center justify-around bg-mecha-steel border-t border-white/10 py-1 shrink-0">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/olympus'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 min-w-touch min-h-touch rounded-lg transition-colors ${
              isActive ? 'text-mecha-cyan' : 'text-white/40 hover:text-white/70'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-mecha-cyan' : 'text-white/40'}`}>
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
