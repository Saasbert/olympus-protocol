import { useNavigate } from 'react-router-dom'

const sections = [
  { path: '/spelling', title: 'Spelling', desc: 'Practice spelling with fun challenges', icon: '📝', color: 'border-mecha-cyan' },
  { path: '/math', title: 'Math', desc: 'Sharpen your math skills', icon: '🔢', color: 'border-mecha-neon' },
  { path: '/olympus', title: 'Olympus Protocol', desc: 'Command colossal mechs in battle', icon: '⚡', color: 'border-mecha-amber' },
]

export function Home() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-6">
      <h2 className="font-mecha text-2xl text-mecha-cyan text-center">SELECT MISSION</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {sections.map((s) => (
          <button
            key={s.path}
            onClick={() => navigate(s.path)}
            className={`flex flex-col items-center gap-3 p-6 bg-mecha-steel rounded-xl border-2 ${s.color} hover:bg-white/5 transition-all active:scale-95 min-h-touch`}
          >
            <span className="text-4xl">{s.icon}</span>
            <span className="font-mecha text-lg">{s.title}</span>
            <span className="text-sm text-white/50 text-center">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
