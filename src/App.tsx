import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { CoinBalance } from './components/CoinBalance'
import { Home } from './pages/Home'
import { SpellingGame } from './pages/SpellingGame'
import { MathGame } from './pages/MathGame'
import { OlympusHub } from './pages/olympus/OlympusHub'

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-mecha-dark">
        <header className="flex items-center justify-between px-4 py-2 bg-mecha-steel border-b border-white/10">
          <h1 className="font-mecha text-lg text-mecha-cyan">OLYMPUS PROTOCOL</h1>
          <CoinBalance />
        </header>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spelling" element={<SpellingGame />} />
            <Route path="/math" element={<MathGame />} />
            <Route path="/olympus/*" element={<OlympusHub />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </BrowserRouter>
  )
}
