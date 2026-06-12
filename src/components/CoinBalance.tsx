import { useEffect, useRef, useState } from 'react'
import { useCoinStore } from '../store/coinStore'

export function CoinBalance() {
  const coins = useCoinStore((s) => s.coins)
  const [animating, setAnimating] = useState(false)
  const prevRef = useRef(coins)

  useEffect(() => {
    if (prevRef.current !== coins) {
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 400)
      prevRef.current = coins
      return () => clearTimeout(timer)
    }
  }, [coins])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-full">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-mecha-amber shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12" /><path d="M9 9c0-1.5 1.5-2 3-2s3 .5 3 2-1.5 2-3 2-3 .5-3 2 1.5 2 3 2 3-.5 3-2" />
      </svg>
      <span
        className={`font-mecha text-sm text-mecha-amber tabular-nums transition-all duration-300 ${
          animating ? 'scale-125 text-yellow-300' : 'scale-100'
        }`}
      >
        {coins.toLocaleString()}
      </span>
    </div>
  )
}
