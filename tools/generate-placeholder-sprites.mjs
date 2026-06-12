import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

const FRAME = 64
const PX = 4
const GRID = 16

const OUT_DIR = path.resolve('public/assets/robots')

/**
 * Each robot type has:
 *  - colors
 *  - body plan (grid coords [gx, gy, gw, gh] for each body part)
 *  - animation frame data
 */

const ROBOTS = [
  {
    id: 'titan',
    primary: '#2266CC',
    secondary: '#4488FF',
    accent: '#FFFFFF',
    dark: '#0F2B5C',
    highlight: '#88BBFF',
    muzzle: '#FFDD44',
    body: {
      head:   [5, 1, 6, 4],
      torso:  [4, 5, 8, 6],
      lArm:   [2, 5, 2, 5],
      rArm:   [12, 5, 2, 5],
      lLeg:   [5, 11, 3, 5],
      rLeg:   [8, 11, 3, 5],
    },
  },
  {
    id: 'colossus',
    primary: '#992222',
    secondary: '#CC3333',
    accent: '#AAAAAA',
    dark: '#4D1111',
    highlight: '#DD6666',
    muzzle: '#FF8833',
    body: {
      head:   [4, 1, 8, 4],
      torso:  [3, 5, 10, 7],
      lArm:   [1, 5, 2, 6],
      rArm:   [13, 5, 2, 6],
      lLeg:   [4, 12, 4, 4],
      rLeg:   [8, 12, 4, 4],
    },
  },
  {
    id: 'vanguard',
    primary: '#228844',
    secondary: '#33CC66',
    accent: '#33CCCC',
    dark: '#114422',
    highlight: '#66DD99',
    muzzle: '#88FF44',
    body: {
      head:   [6, 1, 4, 3],
      torso:  [5, 4, 6, 7],
      lArm:   [3, 5, 2, 4],
      rArm:   [11, 5, 2, 4],
      lLeg:   [5, 11, 2, 5],
      rLeg:   [9, 11, 2, 5],
    },
  },
]

function fillPixel(ctx, gx, gy, color) {
  ctx.fillStyle = color
  ctx.fillRect(gx * PX, gy * PX, PX, PX)
}

function fillRect(ctx, gx, gy, gw, gh, color) {
  ctx.fillStyle = color
  ctx.fillRect(gx * PX, gy * PX, gw * PX, gh * PX)
}

function fillCircleBlock(ctx, cx, cy, r, color) {
  ctx.fillStyle = color
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        fillPixel(ctx, cx + dx, cy + dy, color)
      }
    }
  }
}

function drawRobot(ctx, def, opt = {}) {
  const {
    headDX = 0, headDY = 0,
    torsoDX = 0, torsoDY = 0,
    lArmDX = 0, lArmDY = 0, lArmEx = 0,
    rArmDX = 0, rArmDY = 0, rArmEx = 0,
    lLegDX = 0, lLegDY = 0,
    rLegDX = 0, rLegDY = 0,
    flash = false,
    opacity = 1,
    destroyed = 0,
  } = opt

  ctx.save()
  ctx.globalAlpha = opacity

  const b = def.body

  // --- destroyed: progressive disappearance ---
  if (destroyed >= 6) { ctx.restore(); return }

  // --- legs (behind body) ---
  if (destroyed < 3) {
    fillRect(ctx, b.lLeg[0] + lLegDX, b.lLeg[1] + lLegDY, b.lLeg[2], b.lLeg[3], def.dark)
    fillRect(ctx, b.rLeg[0] + rLegDX, b.rLeg[1] + rLegDY, b.rLeg[2], b.rLeg[3], def.dark)

    // knee joints
    fillPixel(ctx, b.lLeg[0] + lLegDX, b.lLeg[1] + lLegDY + 1, def.accent)
    fillPixel(ctx, b.rLeg[0] + rLegDX, b.rLeg[1] + rLegDY + 1, def.accent)
    // feet
    fillRect(ctx, b.lLeg[0] + lLegDX - 1, b.lLeg[1] + b.lLeg[3] + lLegDY - 1, b.lLeg[2] + 2, 2, def.secondary)
    fillRect(ctx, b.rLeg[0] + rLegDX - 1, b.rLeg[1] + b.rLeg[3] + rLegDY - 1, b.rLeg[2] + 2, 2, def.secondary)
  }

  // --- torso ---
  if (destroyed < 2) {
    fillRect(ctx, b.torso[0] + torsoDX, b.torso[1] + torsoDY, b.torso[2], b.torso[3], def.primary)

    // chest accent
    const cx = b.torso[0] + Math.floor(b.torso[2] / 2) + torsoDX
    const cy = b.torso[1] + 2 + torsoDY
    fillPixel(ctx, cx - 1, cy, def.accent)
    fillPixel(ctx, cx, cy, def.accent)
    fillPixel(ctx, cx - 1, cy + 1, def.accent)
    fillPixel(ctx, cx, cy + 1, def.accent)
    fillPixel(ctx, cx, cy + 2, def.highlight)

    // waist accent
    fillRect(ctx, b.torso[0] + 1 + torsoDX, b.torso[1] + b.torso[3] - 1 + torsoDY, b.torso[2] - 2, 1, def.dark)

    // shoulder plates
    fillRect(ctx, b.torso[0] - 1 + torsoDX, b.torso[1] + torsoDY, 1, 2, def.secondary)
    fillRect(ctx, b.torso[0] + b.torso[2] + torsoDX, b.torso[1] + torsoDY, 1, 2, def.secondary)
  }

  // --- arms (in front of body for firing) ---
  if (destroyed < 4) {
    const lLen = b.lArm[3] + lArmEx * 2
    const rLen = b.rArm[3] + rArmEx * 2

    if (lArmEx > 0) {
      fillRect(ctx, b.lArm[0] + lArmDX, b.lArm[1] + lArmDY, b.lArm[2], b.lArm[3], def.secondary)
      fillRect(ctx, b.lArm[0] + lArmDX, b.lArm[1] + lArmDY + b.lArm[3], b.lArm[2], lLen - b.lArm[3], def.secondary)

      // muzzle flash
      fillRect(ctx, b.lArm[0] + lArmDX - 1, b.lArm[1] + lArmDY + lLen, 4, 2, def.muzzle)
      fillPixel(ctx, b.lArm[0] + lArmDX, b.lArm[1] + lArmDY + lLen + 1, '#FFFFAA')
    } else {
      fillRect(ctx, b.lArm[0] + lArmDX, b.lArm[1] + lArmDY, b.lArm[2], b.lArm[3], def.secondary)
    }

    if (rArmEx > 0) {
      fillRect(ctx, b.rArm[0] + rArmDX, b.rArm[1] + rArmDY, b.rArm[2], b.rArm[3], def.secondary)
      fillRect(ctx, b.rArm[0] + rArmDX, b.rArm[1] + rArmDY + b.rArm[3], b.rArm[2], rLen - b.rArm[3], def.secondary)

      fillRect(ctx, b.rArm[0] + rArmDX - 1, b.rArm[1] + rArmDY + rLen, 4, 2, def.muzzle)
      fillPixel(ctx, b.rArm[0] + rArmDX, b.rArm[1] + rArmDY + rLen + 1, '#FFFFAA')
    } else {
      fillRect(ctx, b.rArm[0] + rArmDX, b.rArm[1] + rArmDY, b.rArm[2], b.rArm[3], def.secondary)
    }

    // elbow joints
    if (lArmEx === 0) fillPixel(ctx, b.lArm[0] + lArmDX + 1, b.lArm[1] + lArmDY + 2, def.dark)
    if (rArmEx === 0) fillPixel(ctx, b.rArm[0] + rArmDX, b.rArm[1] + rArmDY + 2, def.dark)
  }

  // --- head ---
  if (destroyed < 5) {
    fillRect(ctx, b.head[0] + headDX, b.head[1] + headDY, b.head[2], b.head[3], def.secondary)

    // visor / eyes
    if (def.id === 'vanguard') {
      // angular visor
      fillPixel(ctx, b.head[0] + 1 + headDX, b.head[1] + 1 + headDY, def.accent)
      fillPixel(ctx, b.head[0] + 2 + headDX, b.head[1] + 1 + headDY, def.accent)
      fillPixel(ctx, b.head[0] + 1 + headDX, b.head[1] + 2 + headDY, def.accent)
    } else {
      fillRect(ctx, b.head[0] + 1 + headDX, b.head[1] + 1 + headDY, b.head[2] - 2, 2, def.accent)
    }

    // antenna / fin
    if (def.id === 'titan') {
      fillPixel(ctx, b.head[0] + Math.floor(b.head[2] / 2) + headDX, b.head[1] - 1 + headDY, def.highlight)
    } else if (def.id === 'colossus') {
      fillRect(ctx, b.head[0] + 2 + headDX, b.head[1] - 1 + headDY, b.head[2] - 4, 1, def.accent)
    } else {
      fillPixel(ctx, b.head[0] + 2 + headDX, b.head[1] - 1 + headDY, def.highlight)
      fillPixel(ctx, b.head[0] + 1 + headDX, b.head[1] - 1 + headDY, def.highlight)
    }
  }

  // --- hit flash ---
  if (flash) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(0, 0, FRAME, FRAME)
  }

  // --- destroyed overlay fragments ---
  if (destroyed > 0) {
    for (let i = 0; i < destroyed * 3; i++) {
      const sx = (i * 7 + destroyed * 13) % FRAME
      const sy = (i * 11 + destroyed * 7) % FRAME
      const sw = 2 + (i % 3)
      const sh = 2 + ((i + destroyed) % 3)
      ctx.fillStyle = def.highlight
      ctx.globalAlpha = (0.6 - destroyed * 0.1) * opacity
      ctx.fillRect(sx, sy, sw * PX, sh * PX)
    }
  }

  ctx.restore()
}

function getAnimOffsets(def, animName, f, totalFrames) {
  const t = totalFrames
  const phase = t > 1 ? f / (t - 1) : 0
  const opts = {}

  switch (animName) {
    case 'idle':
      opts.torsoDY = Math.sin(f * Math.PI / 2) * 0.5
      opts.headDY = opts.torsoDY
      break

    case 'walk':
      opts.lLegDY = Math.sin(f * Math.PI / 3) * 0.8
      opts.rLegDY = -opts.lLegDY
      opts.lLegDX = Math.sin(f * Math.PI / 3) * 0.6
      opts.rLegDX = -opts.lLegDX
      opts.torsoDY = Math.abs(Math.sin(f * Math.PI / 3)) * 0.4
      opts.headDY = opts.torsoDY
      break

    case 'fireLeftArm':
      if (f < 2) opts.lArmEx = f * 1.5
      else opts.lArmEx = (4 - f) * 1.5
      opts.lArmDY = -f * 0.2
      opts.torsoDX = f < 2 ? -f * 0.3 : -(4 - f) * 0.3
      break

    case 'fireRightArm':
      if (f < 2) opts.rArmEx = f * 1.5
      else opts.rArmEx = (4 - f) * 1.5
      opts.rArmDY = -f * 0.2
      opts.torsoDX = f < 2 ? f * 0.3 : (4 - f) * 0.3
      break

    case 'fireBack': {
      // quick turn, fire behind, turn back
      const backPhase = f / (t - 1)
      opts.torsoDX = Math.sin(backPhase * Math.PI) * 3
      opts.torsoDY = Math.abs(Math.sin(backPhase * Math.PI * 2)) * 0.5
      if (f === 2) {
        opts.rArmEx = 1.5
        opts.rArmDY = -0.5
      }
      break
    }

    case 'hit':
      opts.torsoDX = -f * 0.8
      opts.torsoDY = f * 0.3
      opts.headDX = opts.torsoDX
      opts.headDY = opts.torsoDY
      opts.flash = f === 1
      break

    case 'destroyed':
      opts.destroyed = f
      opts.opacity = Math.max(0, 1 - f * 0.18)
      opts.torsoDX = f * 0.5 * (f % 2 === 0 ? 1 : -1)
      opts.torsoDY = f * 0.4
      opts.headDX = f * 0.3
      opts.headDY = -f * 0.2
      opts.lArmDX = -f * 0.6
      opts.rArmDX = f * 0.6
      break
  }

  return opts
}

const ANIMATIONS = [
  { name: 'idle', frames: 4 },
  { name: 'walk', frames: 6 },
  { name: 'fireLeftArm', frames: 4 },
  { name: 'fireRightArm', frames: 4 },
  { name: 'fireBack', frames: 4 },
  { name: 'hit', frames: 3 },
  { name: 'destroyed', frames: 6 },
]

function generate(robotDef) {
  const maxCols = Math.max(...ANIMATIONS.map(a => a.frames))
  const rows = ANIMATIONS.length
  const sheetW = maxCols * FRAME
  const sheetH = rows * FRAME

  const canvas = createCanvas(sheetW, sheetH)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, sheetW, sheetH)

  const frames = {}

  let globalIdx = 0
  for (let row = 0; row < rows; row++) {
    const anim = ANIMATIONS[row]
    for (let f = 0; f < anim.frames; f++) {
      const fx = f * FRAME
      const fy = row * FRAME

      ctx.save()
      ctx.translate(fx, fy)

      const opts = getAnimOffsets(robotDef, anim.name, f, anim.frames)
      drawRobot(ctx, robotDef, opts)

      ctx.restore()

      const frameName = `${robotDef.id}_${anim.name}_${f}`
      frames[frameName] = {
        frame: { x: fx, y: fy, w: FRAME, h: FRAME },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: FRAME, h: FRAME },
        sourceSize: { w: FRAME, h: FRAME },
        pivot: { x: 0.5, y: 0.5 },
      }

      globalIdx++
    }
  }

  const pngPath = path.join(OUT_DIR, `${robotDef.id}.png`)
  const buf = canvas.toBuffer('image/png')
  fs.writeFileSync(pngPath, buf)

  const json = {
    frames,
    meta: {
      app: 'olympus-generator',
      version: '1.0',
      image: `${robotDef.id}.png`,
      format: 'RGBA8888',
      size: { w: sheetW, h: sheetH },
      scale: '1',
    },
  }

  const jsonPath = path.join(OUT_DIR, `${robotDef.id}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2))

  console.log(`  ${robotDef.id}.png (${sheetW}x${sheetH}) + ${robotDef.id}.json (${Object.keys(frames).length} frames)`)
}

// --- main ---
console.log('Generating placeholder sprite sheets...\n')
fs.mkdirSync(OUT_DIR, { recursive: true })

for (const robot of ROBOTS) {
  generate(robot)
}

console.log('\nDone!')
