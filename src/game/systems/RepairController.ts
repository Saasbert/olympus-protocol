import type { Robot } from '../entities/Robot'

export class RepairController {
  private robot: Robot
  private currentSystemId: string | null = null
  private progress: number = 0
  private repairDuration: number = 0
  private isRepairing: boolean = false

  constructor(robot: Robot) {
    this.robot = robot
  }

  startRepair(systemId: string): void {
    const system = this.robot.systems.find((s) => s.id === systemId)
    if (!system || system.currentHealth >= system.maxHealth) return

    this.currentSystemId = systemId
    this.progress = 0
    this.isRepairing = true

    const nanoHealth = this.robot.getSystemHealth('nanoRepair')
    this.repairDuration = (5000 / Math.max(1, this.robot.stats.repairSpeed)) * (nanoHealth / 100)
  }

  cancelRepair(): void {
    this.currentSystemId = null
    this.progress = 0
    this.isRepairing = false
  }

  update(delta: number): void {
    if (!this.isRepairing || !this.currentSystemId) return

    this.progress += delta / this.repairDuration

    if (this.progress >= 1) {
      this.progress = 1
      const system = this.robot.systems.find((s) => s.id === this.currentSystemId)
      if (system) {
        system.currentHealth = system.maxHealth
        system.isDamaged = false
      }
      this.isRepairing = false
      this.currentSystemId = null
    }
  }

  getProgress(): number {
    return this.progress
  }

  getCurrentSystem(): string | null {
    return this.currentSystemId
  }

  isActive(): boolean {
    return this.isRepairing
  }
}
