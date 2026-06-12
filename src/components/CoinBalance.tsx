import { useCoinStore } from '../store/coinStore'

export function CoinBalance() {
  const coins = useCoinStore((s) => s.coins)
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-full">
      <span className="text-lg">🪙</span>
      <span className="font-mecha text-sm text-mecha-amber tabular-nums">{coins.toLocaleString()}</span>
    </div>
  )
}
