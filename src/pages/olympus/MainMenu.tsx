import { useNavigate } from 'react-router-dom'

export function MainMenu() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <h2 className="font-mecha text-3xl text-mecha-cyan text-center">OLYMPUS PROTOCOL</h2>
      <p className="text-white/50 text-center max-w-md text-sm">
        Command skyscraper-sized mechs in head-to-head combat. Choose your Titan and descend into the arena.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/olympus/loadout')}
          className="w-full py-4 bg-mecha-cyan text-black font-mecha text-lg rounded-xl hover:bg-mecha-cyan/80 transition-all active:scale-95"
        >
          VS AI
        </button>
        <button
          disabled
          className="w-full py-4 bg-mecha-steel text-white/30 font-mecha text-lg rounded-xl border border-white/10 cursor-not-allowed"
        >
          VS HUMAN (Coming Soon)
        </button>
      </div>
    </div>
  )
}
