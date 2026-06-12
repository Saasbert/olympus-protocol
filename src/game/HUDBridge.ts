export interface SystemStatusData {
  id: string
  name: string
  currentHealth: number
  maxHealth: number
  isDamaged: boolean
}

export interface HUDState {
  playerHP: number
  playerMaxHP: number
  opponentHP: number
  opponentMaxHP: number
  systems: SystemStatusData[]
  repairProgress: number
  repairingSystemId: string | null
  weaponCooldowns: [number, number, number]
}

class HUDStateManager {
  private _state: HUDState = {
    playerHP: 100,
    playerMaxHP: 100,
    opponentHP: 100,
    opponentMaxHP: 100,
    systems: [],
    repairProgress: 0,
    repairingSystemId: null,
    weaponCooldowns: [0, 0, 0],
  }

  private _repairRequest: string | null = null

  get state(): Readonly<HUDState> {
    return this._state
  }

  update(partial: Partial<HUDState>): void {
    Object.assign(this._state, partial)
  }

  reset(): void {
    this._state = {
      playerHP: 100,
      playerMaxHP: 100,
      opponentHP: 100,
      opponentMaxHP: 100,
      systems: [],
      repairProgress: 0,
      repairingSystemId: null,
      weaponCooldowns: [0, 0, 0],
    }
    this._repairRequest = null
  }

  requestRepair(systemId: string): void {
    this._repairRequest = systemId
  }

  consumeRepairRequest(): string | null {
    const req = this._repairRequest
    this._repairRequest = null
    return req
  }
}

export const hudBridge = new HUDStateManager()
