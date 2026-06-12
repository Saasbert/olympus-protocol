import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Navigation } from './components/Navigation'
import { CoinBalance } from './components/CoinBalance'
import { Home } from './pages/Home'
import { SpellingGame } from './pages/SpellingGame'
import { MathGame } from './pages/MathGame'
import { OlympusHub } from './pages/olympus/OlympusHub'

function AnimatedRoutes() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('enter')
  const prevRef = useRef(location)

  useEffect(() => {
    if (location.pathname !== prevRef.current.pathname) {
      setTransitionStage('exit')
    }
    prevRef.current = location
  }, [location])

  const handleTransitionEnd = () => {
    if (transitionStage === 'exit') {
      setDisplayLocation(location)
      setTransitionStage('enter')
    }
  }

  return (
    <div
      className={`flex-1 overflow-hidden page-transition-${transitionStage}`}
      onAnimationEnd={handleTransitionEnd}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/spelling" element={<SpellingGame />} />
        <Route path="/math" element={<MathGame />} />
        <Route path="/olympus/*" element={<OlympusHub />} />
      </Routes>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-mecha-dark flex flex-col">
        <div className="mx-auto w-full max-w-[1024px] flex flex-col h-dvh">
          <header className="flex items-center justify-between px-4 py-2 bg-mecha-steel border-b border-white/10 shrink-0">
            <h1 className="font-mecha text-lg text-mecha-cyan tracking-wider">OLYMPUS PROTOCOL</h1>
            <CoinBalance />
          </header>
          <AnimatedRoutes />
          <Navigation />
        </div>
      </div>
    </BrowserRouter>
  )
}
