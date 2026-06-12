import type { Robot } from '../entities/Robot'

export class TargetingController {
  static getAccuracyMultiplier(robot: Robot): number {
    return robot.getSystemHealth('targeting') / Math.max(1, robot.stats.targeting)
  }
}
