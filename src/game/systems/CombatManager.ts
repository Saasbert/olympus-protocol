import Phaser from 'phaser'
import type { Robot } from '../entities/Robot'
import { WeaponInstance } from '../entities/Weapon'
import { Projectile } from '../entities/Projectile'
import { DamageCalculator, type HitResult } from './DamageCalculator'
import { getWeapon } from '../../data/weapons'

const DEFAULT_WEAPONS: [string, string, string] = ['pulseLaser', 'beamRifle', 'rocketPod']

export class CombatManager {
  private scene: Phaser.Scene
  private player: Robot
  private opponent: Robot
  private projectileGroup: Phaser.Physics.Arcade.Group

  readonly playerWeapons: [WeaponInstance | null, WeaponInstance | null, WeaponInstance | null]
  readonly opponentWeapons: [WeaponInstance | null, WeaponInstance | null, WeaponInstance | null]

  private aiTimer: number = 0
  private aiFireInterval: number = 2000

  constructor(scene: Phaser.Scene, player: Robot, opponent: Robot) {
    this.scene = scene
    this.player = player
    this.opponent = opponent

    this.projectileGroup = scene.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
    })

    this.playerWeapons = [null, null, null]
    this.opponentWeapons = [null, null, null]

    this.initWeapons()
    Projectile.preloadTextures(scene)
    this.setupCollisions()
  }

  private initWeapons(): void {
    const loadout = this.scene.registry.get('loadout') as
      | { robotId: string; weapons: (string | null)[] }
      | undefined

    const weaponIds = loadout?.weapons || []

    for (let i = 0; i < 3; i++) {
      const id = weaponIds[i]
      if (id) {
        const def = getWeapon(id)
        if (def) this.playerWeapons[i] = new WeaponInstance(def, i as 0 | 1 | 2)
      }
    }

    for (let i = 0; i < 3; i++) {
      if (!this.playerWeapons[i]) {
        const def = getWeapon(DEFAULT_WEAPONS[i])
        if (def) this.playerWeapons[i] = new WeaponInstance(def, i as 0 | 1 | 2)
      }
    }

    for (let i = 0; i < 3; i++) {
      const def = getWeapon(DEFAULT_WEAPONS[i])
      if (def) this.opponentWeapons[i] = new WeaponInstance(def, i as 0 | 1 | 2)
    }
  }

  private setupCollisions(): void {
    this.scene.physics.add.overlap(
      this.projectileGroup,
      this.player,
      this.onOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )

    this.scene.physics.add.overlap(
      this.projectileGroup,
      this.opponent,
      this.onOverlap as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )
  }

  private onOverlap(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
    const proj = obj1 as unknown as Projectile
    const robot = obj2 as unknown as Robot

    if (!proj.source || proj.source === robot) return
    if (!proj.isAlive()) return

    this.onProjectileHit(proj, robot)
  }

  private onProjectileHit(proj: Projectile, defender: Robot): void {
    const result = DamageCalculator.calculateHit(proj.source, defender, proj.weaponDef)

    if (!result.hit) {
      this.spawnMissEffect(proj.x, proj.y)
      proj.kill()
      return
    }

    this.applyDamageResult(defender, result)
    defender.playAnim('hit')
    this.spawnExplosion(proj.x, proj.y)
    proj.kill()
  }

  private applyDamageResult(defender: Robot, result: HitResult): void {
    const shieldSys = defender.systems.find((s) => s.id === 'shields')
    if (shieldSys && result.shieldDmg > 0) {
      shieldSys.currentHealth = Math.max(0, shieldSys.currentHealth - result.shieldDmg)
      if (shieldSys.currentHealth <= 0) shieldSys.isDamaged = true
    }

    const armourSys = defender.systems.find((s) => s.id === 'armour')
    if (armourSys && result.armourDmg > 0) {
      armourSys.currentHealth = Math.max(0, armourSys.currentHealth - result.armourDmg)
      if (armourSys.currentHealth <= 0) armourSys.isDamaged = true
    }

    defender.currentHP = Math.max(0, defender.currentHP - result.hpDmg)

    if (result.systemDmg) {
      const sys = defender.systems.find((s) => s.id === result.systemDmg!.id)
      if (sys) {
        sys.currentHealth = Math.max(0, sys.currentHealth - result.systemDmg.amount)
        if (sys.currentHealth <= 0) sys.isDamaged = true
      }
    }
  }

  fireWeapon(robot: Robot, slot: 0 | 1 | 2): boolean {
    const weapons = robot === this.player ? this.playerWeapons : this.opponentWeapons
    const weapon = weapons[slot]
    if (!weapon) return false

    if (!weapon.fire()) return false

    const target = robot === this.player ? this.opponent : this.player
    const dist = Phaser.Math.Distance.Between(robot.x, robot.y, target.x, target.y)
    if (dist > weapon.range) {
      this.spawnMissEffect(robot.x + (robot === this.player ? 40 : -40), robot.y)
      return true
    }

    robot.playAnim(slot === 0 ? 'fireLeftArm' : slot === 1 ? 'fireRightArm' : 'fireBack')

    const spawnX = robot.x + (robot === this.player ? 30 : -30)
    const spawnY = robot.y - 10

    new Projectile(this.scene, spawnX, spawnY, {
      type: weapon.type,
      damage: weapon.damage,
      source: robot,
      weaponDef: weapon.getWeaponDef(),
      target,
    })

    return true
  }

  update(delta: number): void {
    for (const w of this.playerWeapons) w?.update(delta)
    for (const w of this.opponentWeapons) w?.update(delta)

    this.aiTimer += delta
    if (this.aiTimer >= this.aiFireInterval) {
      this.aiTimer = 0
      const slot = Phaser.Math.Between(0, 2) as 0 | 1 | 2
      this.fireWeapon(this.opponent, slot)
    }
  }

  private spawnExplosion(x: number, y: number): void {
    const particles: Phaser.GameObjects.Arc[] = []
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.circle(x, y, Phaser.Math.Between(2, 5), 0xff6600, 1)
      p.setDepth(20)
      particles.push(p)
    }

    this.scene.tweens.add({
      targets: particles,
      x: {
        value: (target: Phaser.GameObjects.Arc) => (target as Phaser.GameObjects.Arc).x + Phaser.Math.Between(-40, 40),
      },
      y: {
        value: (target: Phaser.GameObjects.Arc) => (target as Phaser.GameObjects.Arc).y + Phaser.Math.Between(-40, 40),
      },
      alpha: 0,
      scale: { from: 1, to: 0.3 },
      duration: 300,
      ease: 'Power2',
      onComplete: () => particles.forEach((p) => p.destroy()),
    })
  }

  private spawnMissEffect(x: number, y: number): void {
    const text = this.scene.add.text(x, y - 10, 'MISS', {
      fontSize: '12px',
      color: '#ff6666',
      stroke: '#000000',
      strokeThickness: 2,
    })
    text.setOrigin(0.5)
    text.setDepth(25)

    this.scene.tweens.add({
      targets: text,
      y: y - 30,
      alpha: 0,
      duration: 600,
      onComplete: () => text.destroy(),
    })
  }
}
