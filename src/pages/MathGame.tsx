export function MathGame() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-mecha-neon mb-4">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
      </svg>
      <h2 className="font-mecha text-xl text-mecha-neon mb-2">Math Game</h2>
      <p className="text-white/50 text-center max-w-xs leading-relaxed">
        Coming soon — earn coins to spend in Olympus Protocol!
      </p>
    </div>
  )
}
