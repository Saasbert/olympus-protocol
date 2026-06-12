import { useNavigate } from 'react-router-dom'

const sections = [
  {
    path: '/spelling',
    title: 'Spelling',
    desc: 'Practice spelling with fun challenges and earn coins',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /><path d="M4 11h4" /><path d="M16 11h4" />
      </svg>
    ),
    borderColor: 'border-mecha-cyan',
    iconColor: 'text-mecha-cyan',
  },
  {
    path: '/math',
    title: 'Math',
    desc: 'Sharpen your math skills in fast-paced challenges',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    ),
    borderColor: 'border-mecha-neon',
    iconColor: 'text-mecha-neon',
  },
  {
    path: '/olympus',
    title: 'Olympus Protocol',
    desc: 'Command colossal mechs in tactical battles',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    borderColor: 'border-mecha-amber',
    iconColor: 'text-mecha-amber',
  },
]

export function Home() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-8 animate-fade-in">
      <div className="text-center">
        <h2 className="font-mecha text-2xl text-mecha-cyan tracking-widest">SELECT MISSION</h2>
        <p className="text-white/30 text-sm mt-1">Choose a game mode to begin</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {sections.map((s) => (
          <button
            key={s.path}
            onClick={() => navigate(s.path)}
            className={`flex flex-col items-center gap-4 p-6 bg-mecha-steel rounded-xl border-2 ${s.borderColor} hover:bg-white/[0.04] transition-all active:scale-[0.97] min-h-touch group`}
          >
            <span className={`${s.iconColor} group-hover:scale-110 transition-transform duration-200`}>
              {s.icon}
            </span>
            <span className="font-mecha text-lg text-white group-hover:text-mecha-cyan transition-colors">{s.title}</span>
            <span className="text-sm text-white/40 text-center leading-relaxed">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
