import Phaser from 'phaser'

const JCX = 120
const JCY = 600
const JR = 60
const THRESHOLD = 20

const FIRE_BUTTONS = [
  { cx: 900, cy: 600 },
  { cx: 780, cy: 520 },
  { cx: 920, cy: 480 },
]

export class InputController {
  private scene: Phaser.Scene
  private keys: {
    A: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
    LEFT: Phaser.Input.Keyboard.Key
    RIGHT: Phaser.Input.Keyboard.Key
    ONE: Phaser.Input.Keyboard.Key
    TWO: Phaser.Input.Keyboard.Key
    THREE: Phaser.Input.Keyboard.Key
    R: Phaser.Input.Keyboard.Key
  }

  private _left = false
  private _right = false
  private _fireSlot: 0 | 1 | 2 | null = null
  private _repair = false

  private joystickActive = false
  private knobX = 0
  private knobY = 0
  private joyLeft = false
  private joyRight = false

  private joystickBaseGfx: Phaser.GameObjects.Graphics
  private joystickKnobGfx: Phaser.GameObjects.Graphics
  private fireBtnGfx: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    const kb = scene.input.keyboard!
    this.keys = {
      A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      LEFT: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      RIGHT: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      ONE: kb.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      TWO: kb.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      THREE: kb.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      R: kb.addKey(Phaser.Input.Keyboard.KeyCodes.R),
    }

    this.joystickBaseGfx = scene.add.graphics().setDepth(30)
    this.joystickKnobGfx = scene.add.graphics().setDepth(31)
    this.fireBtnGfx = scene.add.graphics().setDepth(30)

    this.drawJoystick()
    this.drawFireButtons()
    this.setupPointer()
  }

  private setupPointer(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const jDist = Phaser.Math.Distance.Between(pointer.x, pointer.y, JCX, JCY)
      if (jDist < JR + 20) {
        this.joystickActive = true
        return
      }
      for (let i = 0; i < FIRE_BUTTONS.length; i++) {
        const b = FIRE_BUTTONS[i]
        if (Phaser.Math.Distance.Between(pointer.x, pointer.y, b.cx, b.cy) < 40) {
          this._fireSlot = i as 0 | 1 | 2
          return
        }
      }
    })

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.joystickActive) return
      this.knobX = pointer.x - JCX
      this.knobY = pointer.y - JCY
      const dist = Math.sqrt(this.knobX * this.knobX + this.knobY * this.knobY)
      if (dist > JR) {
        this.knobX = (this.knobX / dist) * JR
        this.knobY = (this.knobY / dist) * JR
      }
      this.joyLeft = this.knobX < -THRESHOLD
      this.joyRight = this.knobX > THRESHOLD
    })

    this.scene.input.on('pointerup', () => {
      this.joystickActive = false
      this.knobX = 0
      this.knobY = 0
      this.joyLeft = false
      this.joyRight = false
    })
  }

  private drawJoystick(): void {
    this.joystickBaseGfx.clear()
    this.joystickBaseGfx.fillStyle(0xffffff, 0.15)
    this.joystickBaseGfx.fillCircle(JCX, JCY, JR)
    this.joystickBaseGfx.lineStyle(2, 0xffffff, 0.4)
    this.joystickBaseGfx.strokeCircle(JCX, JCY, JR)

    this.joystickKnobGfx.clear()
    this.joystickKnobGfx.fillStyle(0xffffff, 0.5)
    this.joystickKnobGfx.fillCircle(JCX + this.knobX, JCY + this.knobY, 20)
  }

  private drawFireButtons(): void {
    this.fireBtnGfx.clear()
    for (let i = 0; i < FIRE_BUTTONS.length; i++) {
      const b = FIRE_BUTTONS[i]
      this.fireBtnGfx.fillStyle(0xff3333, 0.3)
      this.fireBtnGfx.fillCircle(b.cx, b.cy, 35)
      this.fireBtnGfx.lineStyle(2, 0xff3333, 0.6)
      this.fireBtnGfx.strokeCircle(b.cx, b.cy, 35)
    }
  }

  update(): void {
    const kbLeft = this.keys.A.isDown || this.keys.LEFT.isDown
    const kbRight = this.keys.D.isDown || this.keys.RIGHT.isDown

    this._left = kbLeft || this.joyLeft
    this._right = kbRight || this.joyRight

    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) this._fireSlot = 0
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) this._fireSlot = 1
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) this._fireSlot = 2
    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) this._repair = true

    this.drawJoystick()
  }

  get isLeft(): boolean {
    return this._left
  }

  get isRight(): boolean {
    return this._right
  }

  consumeFireSlot(): 0 | 1 | 2 | null {
    const slot = this._fireSlot
    this._fireSlot = null
    return slot
  }

  consumeRepair(): boolean {
    const val = this._repair
    this._repair = false
    return val
  }

  destroy(): void {
    this.joystickBaseGfx.destroy()
    this.joystickKnobGfx.destroy()
    this.fireBtnGfx.destroy()
  }
}
