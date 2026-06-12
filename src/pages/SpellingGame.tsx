export function SpellingGame() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-mecha-cyan mb-4">
        <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /><path d="M4 11h4" /><path d="M16 11h4" />
      </svg>
      <h2 className="font-mecha text-xl text-mecha-cyan mb-2">Spelling Game</h2>
      <p className="text-white/50 text-center max-w-xs leading-relaxed">
        Coming soon — earn coins to spend in Olympus Protocol!
      </p>
    </div>
  )
}
