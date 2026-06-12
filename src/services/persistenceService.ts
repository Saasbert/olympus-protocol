const STORAGE_KEY = 'olympus-game-state'
const SCHEMA_VERSION = 1

interface OwnedWeapon {
  id: string
  level: number
}

export interface GameState {
  version: number
  coins: number
  ownedRobots: string[]
  ownedWeapons: OwnedWeapon[]
  unlockedUpgrades: Record<string, number>
  selectedRobot: string | null
  equippedWeapons: (string | null)[]
  equippedSupportUnits: string[]
}

function createDefaultState(): GameState {
  return {
    version: SCHEMA_VERSION,
    coins: 100,
    ownedRobots: ['titan'],
    ownedWeapons: [],
    unlockedUpgrades: {},
    selectedRobot: 'titan',
    equippedWeapons: [null, null, null],
    equippedSupportUnits: [],
  }
}

export function saveGameState(state: Omit<GameState, 'version'>): void {
  const data: GameState = { ...state, version: SCHEMA_VERSION }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.warn('Failed to save game state to localStorage')
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as GameState
    if (typeof data.version !== 'number' || data.version !== SCHEMA_VERSION) {
      resetGameState()
      return null
    }
    return data
  } catch {
    return null
  }
}

export function resetGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.warn('Failed to reset game state in localStorage')
  }
}

export function getDefaultGameState(): GameState {
  return createDefaultState()
}
