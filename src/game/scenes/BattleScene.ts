import Phaser from 'phaser'
import { ARENA_WIDTH, ARENA_HEIGHT, GROUND_Y } from '../constants'
import { Robot, type RobotArchetype } from '../entities/Robot'
import { Tank } from '../entities/Tank'
import { Drone } from '../entities/Drone'
import { InputController } from '../systems/InputController'
import { PhysicsController } from '../systems/PhysicsController'
import { AIController } from '../systems/AIController'
import { CombatManager } from '../systems/CombatManager'
import { RepairController } from '../systems/RepairController'
import { HealthBar } from '../ui/HealthBar'
import { CooldownIndicator } from '../ui/CooldownIndicator'
import { spawnDamageNumber } from '../ui/DamageNumber'
import { hudBridge } from '../HUDBridge'
import { useBattleStore } from '../../store/battleStore'

export class BattleScene extends Phaser.Scene {
  private player!: Robot
  private opponent!: Robot
  private inputController!: InputController
  private aiController!: AIController
  private combatManager!: CombatManager
  private repairController!: RepairController
  private playerHealthBar!: HealthBar
  private opponentHealthBar!: HealthBar
  private cooldownIndicator!: CooldownIndicator
  private farBg!: Phaser.GameObjects.TileSprite
  private nearBg!: Phaser.GameObjects.TileSprite
  private gameOver = false

  private playerTank: Tank | null = null
  private playerDrone: Drone | null = null
  private opponentTank: Tank | null = null
  private opponentDrone: Drone | null = null

  private playerBullets!: Phaser.Physics.Arcade.Group
  private opponentBullets!: Phaser.Physics.Arcade.Group

  private statsDamageDealt = 0
  private statsDamageTaken = 0
  private statsSystemsRepaired = 0

  constructor() {
    super({ key: 'BattleScene' })
  }

  create(): void {
    this.gameOver = false
    this.statsDamageDealt = 0
    this.statsDamageTaken = 0
    this.statsSystemsRepaired = 0

    hudBridge.reset()

    this.generateTextures()

    this.farBg = this.add.tileSprite(0, 0, ARENA_WIDTH, ARENA_HEIGHT, 'bg_far')
      .setOrigin(0, 0)
      .setDepth(0)

    this.nearBg = this.add.tileSprite(0, 0, ARENA_WIDTH, ARENA_HEIGHT, 'bg_near')
      .setOrigin(0, 0)
      .setDepth(1)

    this.add.rectangle(ARENA_WIDTH / 2, GROUND_Y, ARENA_WIDTH, 2, 0x222244).setDepth(2)

    this.physics.world.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT)

    const loadout = this.registry.get('loadout') as
      | { robotId: string; weapons: (string | null)[] }
      | undefined
    const robotId = (loadout?.robotId as RobotArchetype) || 'titan'
    const opponentId: RobotArchetype = 'colossus'

    this.player = new Robot(this, 200, GROUND_Y, robotId)
    this.opponent = new Robot(this, ARENA_WIDTH - 200, GROUND_Y, opponentId)
    this.opponent.setFlipX(true)

    this.cameras.main.setBounds(0, 0, ARENA_WIDTH, ARENA_HEIGHT)
    this.cameras.main.setZoom(1)

    this.playerHealthBar = new HealthBar(this, this.player)
    this.opponentHealthBar = new HealthBar(this, this.opponent)

    new PhysicsController(this, ARENA_WIDTH, ARENA_HEIGHT, this.player, this.opponent)

    this.inputController = new InputController(this)

    this.aiController = new AIController(this.opponent, this.player, 'medium')

    this.playerBullets = this.physics.add.group({
      defaultKey: 'tank_bullet',
      maxSize: 20,
    })

    this.opponentBullets = this.physics.add.group({
      defaultKey: 'tank_bullet',
      maxSize: 20,
    })

    this.playerTank = new Tank(this, this.player, this.opponent, this.playerBullets)
    this.playerDrone = new Drone(this, this.player, this.opponent, this.playerBullets)
    this.opponentTank = new Tank(this, this.opponent, this.player, this.opponentBullets)
    this.opponentDrone = new Drone(this, this.opponent, this.player, this.opponentBullets)

    this.setupColliders()

    this.combatManager = new CombatManager(this, this.player, this.opponent)
    this.repairController = new RepairController(this.player)
    this.cooldownIndicator = new CooldownIndicator(this, () => this.combatManager.playerWeapons)

    this.cameras.main.centerOn(ARENA_WIDTH / 2, ARENA_HEIGHT / 2)

    hudBridge.update({
      playerHP: this.player.currentHP,
      playerMaxHP: this.player.maxHP,
      opponentHP: this.opponent.currentHP,
      opponentMaxHP: this.opponent.maxHP,
      systems: this.player.systems.map((s) => ({
        id: s.id,
        name: s.name,
        currentHealth: s.currentHealth,
        maxHealth: s.maxHealth,
        isDamaged: s.isDamaged,
      })),
    })
  }

  private generateTextures(): void {
    if (!this.textures.exists('tank_sprite')) {
      const g = this.add.graphics()
      g.fillStyle(0x888888)
      g.fillRect(0, 0, 48, 24)
      g.lineStyle(1, 0xaaaaaa)
      g.strokeRect(0, 0, 48, 24)
      g.generateTexture('tank_sprite', 48, 24)
      g.destroy()
    }

    if (!this.textures.exists('drone_sprite')) {
      const g = this.add.graphics()
      g.fillStyle(0xeeeeee)
      g.fillRect(0, 0, 32, 32)
      g.lineStyle(1, 0xffffff)
      g.strokeRect(0, 0, 32, 32)
      g.generateTexture('drone_sprite', 32, 32)
      g.destroy()
    }

    if (!this.textures.exists('tank_bullet')) {
      const g = this.add.graphics()
      g.fillStyle(0xcccccc)
      g.fillRect(0, 0, 6, 4)
      g.generateTexture('tank_bullet', 6, 4)
      g.destroy()
    }

    if (!this.textures.exists('drone_bullet')) {
      const g = this.add.graphics()
      g.fillStyle(0x44aaff)
      g.fillCircle(4, 4, 4)
      g.generateTexture('drone_bullet', 8, 8)
      g.destroy()
    }
  }

  private setupColliders(): void {
    this.physics.add.overlap(
      this.playerBullets,
      this.opponent,
      this.onPlayerBulletHitOpponent as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    this.physics.add.overlap(
      this.opponentBullets,
      this.player,
      this.onOpponentBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    if (this.opponentTank) {
      this.physics.add.overlap(
        this.playerBullets,
        this.opponentTank,
        this.onPlayerBulletHitSupport as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this,
      )
    }

    if (this.opponentDrone) {
      this.physics.add.overlap(
        this.playerBullets,
        this.opponentDrone,
        this.onPlayerBulletHitSupport as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this,
      )
    }

    if (this.playerTank) {
      this.physics.add.overlap(
        this.opponentBullets,
        this.playerTank,
        this.onOpponentBulletHitSupport as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this,
      )
    }

    if (this.playerDrone) {
      this.physics.add.overlap(
        this.opponentBullets,
        this.playerDrone,
        this.onOpponentBulletHitSupport as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this,
      )
    }
  }

  private onPlayerBulletHitOpponent(
    bulletObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    _enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite
    if (!bullet.active) return
    const damage = bullet.getData('damage') as number || 10
    this.opponent.takeDamage(damage)
    this.statsDamageDealt += damage
    spawnDamageNumber(this, this.opponent.x, this.opponent.y - 30, damage)
    this.deactivateBullet(bullet)
  }

  private onOpponentBulletHitPlayer(
    bulletObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite
    if (!bullet.active) return
    const damage = bullet.getData('damage') as number || 10
    this.player.takeDamage(damage)
    this.statsDamageTaken += damage
    spawnDamageNumber(this, this.player.x, this.player.y - 30, damage, 'system')
    this.deactivateBullet(bullet)
  }

  private onPlayerBulletHitSupport(
    bulletObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    supportObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite
    const support = supportObj as Tank | Drone
    if (!bullet.active || support.destroyed) return
    const damage = bullet.getData('damage') as number || 10
    support.takeDamage(damage)
    spawnDamageNumber(this, support.x, support.y - 20, damage)
    this.deactivateBullet(bullet)
  }

  private onOpponentBulletHitSupport(
    bulletObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    supportObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ): void {
    const bullet = bulletObj as Phaser.Physics.Arcade.Sprite
    const support = supportObj as Tank | Drone
    if (!bullet.active || support.destroyed) return
    const damage = bullet.getData('damage') as number || 10
    support.takeDamage(damage)
    spawnDamageNumber(this, support.x, support.y - 20, damage)
    this.deactivateBullet(bullet)
  }

  private deactivateBullet(bullet: Phaser.Physics.Arcade.Sprite): void {
    bullet.setActive(false).setVisible(false)
    const body = bullet.body as Phaser.Physics.Arcade.Body
    body.enable = false
    body.setVelocity(0, 0)
  }

  update(_time: number, delta: number): void {
    if (this.gameOver) return

    this.inputController.update()
    this.aiController.update(delta)
    this.combatManager.update(delta)
    this.repairController.update(delta)

    if (this.inputController.isLeft) this.player.moveLeft()
    else if (this.inputController.isRight) this.player.moveRight()
    else this.player.stopMoving()

    const slot = this.inputController.consumeFireSlot()
    if (slot !== null) {
      this.combatManager.fireWeapon(this.player, slot)
    }

    this.handleRepairRequest(delta)

    this.playerHealthBar.update()
    this.opponentHealthBar.update()
    this.cooldownIndicator.update()

    this.playerTank?.update(_time, delta)
    this.playerDrone?.update(_time, delta)
    this.opponentTank?.update(_time, delta)
    this.opponentDrone?.update(_time, delta)

    this.updateBullets(delta)

    const midX = (this.player.x + this.opponent.x) / 2
    const midY = (this.player.y + this.opponent.y) / 2
    this.cameras.main.centerOn(midX, midY)

    this.farBg.tilePositionX = this.cameras.main.scrollX * 0.2
    this.nearBg.tilePositionX = this.cameras.main.scrollX * 0.5

    const cooldowns: [number, number, number] = [
      this.combatManager.playerWeapons[0]?.getCooldownProgress() ?? 0,
      this.combatManager.playerWeapons[1]?.getCooldownProgress() ?? 0,
      this.combatManager.playerWeapons[2]?.getCooldownProgress() ?? 0,
    ]

    hudBridge.update({
      playerHP: this.player.currentHP,
      playerMaxHP: this.player.maxHP,
      opponentHP: this.opponent.currentHP,
      opponentMaxHP: this.opponent.maxHP,
      systems: this.player.systems.map((s) => ({
        id: s.id,
        name: s.name,
        currentHealth: s.currentHealth,
        maxHealth: s.maxHealth,
        isDamaged: s.isDamaged,
      })),
      repairProgress: this.repairController.isActive()
        ? this.repairController.getProgress()
        : 0,
      repairingSystemId: this.repairController.getCurrentSystem(),
      weaponCooldowns: cooldowns,
    })

    if (this.opponent.currentHP <= 0) {
      this.endBattle(true)
    } else if (this.player.currentHP <= 0) {
      this.endBattle(false)
    }
  }

  private handleRepairRequest(_delta: number): void {
    const requestedSystem = hudBridge.consumeRepairRequest()

    if (requestedSystem && !this.repairController.isActive()) {
      this.repairController.startRepair(requestedSystem)
    }

    if (this.repairController.isActive() && this.repairController.getProgress() >= 1) {
      this.statsSystemsRepaired++
    }
  }

  private updateBullets(delta: number): void {
    this.homingBullets(this.playerBullets, this.opponent, delta)
    this.homingBullets(this.opponentBullets, this.player, delta)

    this.cleanupBullets(this.playerBullets)
    this.cleanupBullets(this.opponentBullets)
  }

  private homingBullets(
    group: Phaser.Physics.Arcade.Group,
    target: Robot,
    _delta: number,
  ): void {
    group.getChildren().forEach((child) => {
      const bullet = child as Phaser.Physics.Arcade.Sprite
      if (!bullet.active) return
      const isHoming = bullet.getData('homing')
      if (isHoming) {
        const body = bullet.body as Phaser.Physics.Arcade.Body
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y)
        const currentSpeed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2)
        const maxAdjust = 0.05
        const currentAngle = Math.atan2(body.velocity.y, body.velocity.x)
        const newAngle = Phaser.Math.Angle.RotateTo(currentAngle, angle, maxAdjust)
        body.setVelocity(Math.cos(newAngle) * currentSpeed, Math.sin(newAngle) * currentSpeed)
      }
    })
  }

  private cleanupBullets(group: Phaser.Physics.Arcade.Group): void {
    group.getChildren().forEach((child) => {
      const bullet = child as Phaser.Physics.Arcade.Sprite
      if (!bullet.active) return
      if (
        bullet.x < -50 ||
        bullet.x > ARENA_WIDTH + 50 ||
        bullet.y < -50 ||
        bullet.y > ARENA_HEIGHT + 50
      ) {
        this.deactivateBullet(bullet)
      }
    })
  }

  private endBattle(playerWon: boolean): void {
    this.gameOver = true
    const loser = playerWon ? this.opponent : this.player
    loser.playAnim('destroyed')

    this.time.delayedCall(2000, () => {
      useBattleStore.getState().setResult({
        won: playerWon,
        damageDealt: this.statsDamageDealt,
        damageTaken: this.statsDamageTaken,
        systemsRepaired: this.statsSystemsRepaired,
        coinsEarned: playerWon ? 100 : 10,
      })
    })
  }
}
