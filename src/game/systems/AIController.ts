import { type RobotAI } from '../entities/Robot'
import {
  type WeaponCategory,
  filterWeaponsByCategory,
} from '../../data/weapons'
import { type RobotArchetype } from '../../data/robots'

enum BehaviorStatus {
  Success,
  Failure,
  Running,
}

interface BehaviorNode {
  execute(): BehaviorStatus
  reset(): void
}

interface DifficultyConfig {
  reactionDelay: number
  accuracyModifier: number
  repairThreshold: number
  weaponFireChance: number
  decisionInterval: number
  damageModifier: number
}

const DIFFICULTY: Record<string, DifficultyConfig> = {
  easy: {
    reactionDelay: 800,
    accuracyModifier: 0.6,
    repairThreshold: 0.2,
    weaponFireChance: 0.4,
    decisionInterval: 1000,
    damageModifier: 0.7,
  },
  medium: {
    reactionDelay: 400,
    accuracyModifier: 0.85,
    repairThreshold: 0.3,
    weaponFireChance: 0.65,
    decisionInterval: 500,
    damageModifier: 1.0,
  },
  hard: {
    reactionDelay: 100,
    accuracyModifier: 1.0,
    repairThreshold: 0.4,
    weaponFireChance: 0.9,
    decisionInterval: 250,
    damageModifier: 1.3,
  },
}

class PrioritySelector implements BehaviorNode {
  private children: BehaviorNode[]

  constructor(children: BehaviorNode[]) {
    this.children = children
  }

  execute(): BehaviorStatus {
    for (const child of this.children) {
      const status = child.execute()
      if (status !== BehaviorStatus.Failure) {
        return status
      }
    }
    return BehaviorStatus.Failure
  }

  reset(): void {
    for (const child of this.children) {
      child.reset()
    }
  }
}

class Sequence implements BehaviorNode {
  private children: BehaviorNode[]
  private index: number = 0

  constructor(children: BehaviorNode[]) {
    this.children = children
  }

  execute(): BehaviorStatus {
    while (this.index < this.children.length) {
      const status = this.children[this.index].execute()
      if (status === BehaviorStatus.Running) {
        return BehaviorStatus.Running
      }
      if (status === BehaviorStatus.Failure) {
        this.reset()
        return BehaviorStatus.Failure
      }
      this.index++
    }
    this.reset()
    return BehaviorStatus.Success
  }

  reset(): void {
    this.index = 0
    for (const child of this.children) {
      child.reset()
    }
  }
}

class CheckCriticalDamage implements BehaviorNode {
  private ai: RobotAI
  private config: DifficultyConfig
  private wasRepairing: boolean = false

  constructor(ai: RobotAI, config: DifficultyConfig) {
    this.ai = ai
    this.config = config
  }

  execute(): BehaviorStatus {
    const anyBelowThreshold = this.ai.systems.some(
      s => s.currentHealth / s.maxHealth < this.config.repairThreshold,
    )
    if (anyBelowThreshold) {
      this.wasRepairing = true
      return BehaviorStatus.Success
    }
    if (this.wasRepairing) {
      const anyBelowFull = this.ai.systems.some(
        s => s.currentHealth / s.maxHealth < 0.7,
      )
      if (anyBelowFull) {
        return BehaviorStatus.Success
      }
    }
    this.wasRepairing = false
    return BehaviorStatus.Failure
  }

  reset(): void {
    this.wasRepairing = false
  }
}

class SelectAndRepair implements BehaviorNode {
  private ai: RobotAI
  private repairPriority: string[] = [
    'weapons',
    'targeting',
    'shields',
    'legs',
    'armour',
    'nanoRepair',
  ]

  constructor(ai: RobotAI) {
    this.ai = ai
  }

  execute(): BehaviorStatus {
    const damagedSystems = this.repairPriority
      .map(id => this.ai.systems.find(s => s.id === id))
      .filter(
        (s): s is NonNullable<typeof s> =>
          s !== undefined && s.currentHealth / s.maxHealth < 0.7,
      )

    if (damagedSystems.length === 0) {
      return BehaviorStatus.Failure
    }

    this.ai.repairSystem(damagedSystems[0].id)
    return BehaviorStatus.Running
  }

  reset(): void {}
}

class CheckLowHP implements BehaviorNode {
  private ai: RobotAI

  constructor(ai: RobotAI) {
    this.ai = ai
  }

  execute(): BehaviorStatus {
    return this.ai.currentHP / this.ai.maxHP < 0.4
      ? BehaviorStatus.Success
      : BehaviorStatus.Failure
  }

  reset(): void {}
}

class Retreat implements BehaviorNode {
  private ai: RobotAI
  private opponent: RobotAI

  constructor(ai: RobotAI, opponent: RobotAI) {
    this.ai = ai
    this.opponent = opponent
  }

  execute(): BehaviorStatus {
    if (this.ai.currentHP / this.ai.maxHP > 0.6) {
      return BehaviorStatus.Failure
    }

    if (this.opponent.x < this.ai.x) {
      this.ai.moveRight()
    } else {
      this.ai.moveLeft()
    }

    const shields = this.ai.systems.find(s => s.id === 'shields')
    if (shields && shields.currentHealth / shields.maxHealth < 0.7) {
      this.ai.repairSystem('shields')
    }

    return BehaviorStatus.Running
  }

  reset(): void {}
}

class CheckWeaponsReady implements BehaviorNode {
  private ai: RobotAI

  constructor(ai: RobotAI) {
    this.ai = ai
  }

  execute(): BehaviorStatus {
    return this.ai.weapons.some(w => w !== null && w.isReady)
      ? BehaviorStatus.Success
      : BehaviorStatus.Failure
  }

  reset(): void {}
}

class CheckInRange implements BehaviorNode {
  private ai: RobotAI
  private opponent: RobotAI

  constructor(ai: RobotAI, opponent: RobotAI) {
    this.ai = ai
    this.opponent = opponent
  }

  execute(): BehaviorStatus {
    const dist = this.ai.distanceTo(this.opponent)
    return dist < 600 ? BehaviorStatus.Success : BehaviorStatus.Failure
  }

  reset(): void {}
}

class FireWeapons implements BehaviorNode {
  private ai: RobotAI
  private config: DifficultyConfig
  private fireOrder: [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2] = [2, 1, 0]

  constructor(ai: RobotAI, _opponent: RobotAI, config: DifficultyConfig) {
    this.ai = ai
    this.config = config
  }

  execute(): BehaviorStatus {
    if (Math.random() > this.config.weaponFireChance) {
      return BehaviorStatus.Failure
    }

    for (const slot of this.fireOrder) {
      if (this.ai.weapons[slot]?.isReady) {
        if (Math.random() > this.config.accuracyModifier) {
          continue
        }
        this.ai.fireWeapon(slot)
        return BehaviorStatus.Success
      }
    }

    return BehaviorStatus.Failure
  }

  reset(): void {}
}

class MoveTowardOpponent implements BehaviorNode {
  private ai: RobotAI
  private opponent: RobotAI
  private idealRange: number = 400
  private tolerance: number = 100

  constructor(ai: RobotAI, opponent: RobotAI) {
    this.ai = ai
    this.opponent = opponent
  }

  execute(): BehaviorStatus {
    const dist = this.ai.distanceTo(this.opponent)

    if (dist > this.idealRange + this.tolerance) {
      if (this.opponent.x < this.ai.x) {
        this.ai.moveLeft()
      } else {
        this.ai.moveRight()
      }
    } else if (dist < this.idealRange - this.tolerance) {
      if (this.opponent.x < this.ai.x) {
        this.ai.moveRight()
      } else {
        this.ai.moveLeft()
      }
    } else {
      this.ai.stopMoving()
    }

    return BehaviorStatus.Running
  }

  reset(): void {}
}

export function selectLoadout(archetype: RobotArchetype): string[] {
  const categoryMap: Record<RobotArchetype, WeaponCategory[]> = {
    colossus: ['artillery', 'heavy'],
    vanguard: ['machineGun', 'lightLaser'],
    titan: ['artillery', 'heavy', 'machineGun', 'lightLaser', 'missile'],
  }

  const categories = categoryMap[archetype]
  const pool = filterWeaponsByCategory(categories)

  if (pool.length === 0) {
    return []
  }

  const backSlot = pool.filter(w => w.slot === 'back')
  const rightArmSlot = pool.filter(w => w.slot === 'rightArm')
  const leftArmSlot = pool.filter(w => w.slot === 'leftArm')

  const pick = <T>(arr: T[]): T | undefined =>
    arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined

  const selected: string[] = []

  const back = pick(backSlot)
  if (back) selected.push(back.id)

  const right = pick(rightArmSlot)
  if (right) selected.push(right.id)

  const left = pick(leftArmSlot)
  if (left) selected.push(left.id)

  return selected
}

export class AIController {
  private config: DifficultyConfig
  private behaviorTree: PrioritySelector
  private elapsed: number = 0
  private reactionTimer: number = 0
  private hasFiredFirstShot: boolean = false

  constructor(
    aiRobot: RobotAI,
    opponent: RobotAI,
    difficulty: string,
  ) {
    this.config =
      DIFFICULTY[difficulty] ?? DIFFICULTY.medium

    this.behaviorTree = new PrioritySelector([
      new Sequence([
        new CheckCriticalDamage(aiRobot, this.config),
        new SelectAndRepair(aiRobot),
      ]),
      new Sequence([
        new CheckLowHP(aiRobot),
        new Retreat(aiRobot, opponent),
      ]),
      new Sequence([
        new CheckWeaponsReady(aiRobot),
        new CheckInRange(aiRobot, opponent),
        new FireWeapons(aiRobot, opponent, this.config),
      ]),
      new MoveTowardOpponent(aiRobot, opponent),
    ])
  }

  update(delta: number): void {
    this.elapsed += delta

    if (!this.hasFiredFirstShot) {
      this.reactionTimer += delta
      if (this.reactionTimer < this.config.reactionDelay) {
        return
      }
      this.hasFiredFirstShot = true
      this.elapsed = 0
      this.behaviorTree.execute()
      return
    }

    if (this.elapsed >= this.config.decisionInterval) {
      this.elapsed = 0
      this.behaviorTree.execute()
    }
  }

  getDifficultyConfig(): DifficultyConfig {
    return { ...this.config }
  }
}
