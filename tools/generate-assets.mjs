import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { createCanvas, loadImage } from 'canvas'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = {
  WEAPONS: join(ROOT, 'public/assets/weapons'),
  SUPPORT: join(ROOT, 'public/assets/support'),
  BG: join(ROOT, 'public/assets/backgrounds'),
  UI: join(ROOT, 'public/assets/ui'),
}
Object.values(OUT).forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }) })

function rgba(r, g, b, a = 255) { return [r, g, b, a] }
function lerp(a, b, t) { return a + (b - a) * t }
function lerpC(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t), lerp(c1[3]||255, c2[3]||255, t)] }

// ---------- sprite sheet builder ----------
function buildSheet(frames, frameW, frameH, drawer) {
  const cols = Math.min(frames, 8)
  const rows = Math.ceil(frames / cols)
  const w = cols * frameW, h = rows * frameH
  const c = createCanvas(w, h)
  const ctx = c.getContext('2d')
  for (let i = 0; i < frames; i++) {
    const x = (i % cols) * frameW, y = Math.floor(i / cols) * frameH
    ctx.save(); ctx.translate(x, y)
    drawer(ctx, frameW, frameH, i, frames)
    ctx.restore()
  }
  return c.toBuffer('image/png')
}

// ---------- WEAPONS ----------
const weapons = [
  {
    id: 'laser-beam',
    frames: 3, fw: 32, fh: 8,
    draw(ctx, w, h, i) {
      const t = i / 2
      const bright = rgba(200, 240, 255), mid = rgba(0, 200, 255), dark = rgba(0, 100, 180)
      const start = w * 0.1, end = w * 0.9
      for (let x = 0; x < w; x++) {
        const p = x / w
        let color
        if (i === 0) color = lerpC(dark, mid, p)
        else if (i === 1) color = lerpC(mid, bright, p)
        else color = lerpC(bright, rgba(255,255,255), p)
        for (let y = 0; y < h; y++) {
          const dist = Math.abs(y - h/2)
          if (dist < h * 0.3) ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},1)`
          else if (dist < h * 0.45) ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.4)`
          else continue
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  },
  {
    id: 'precision-laser',
    frames: 3, fw: 16, fh: 4,
    draw(ctx, w, h, i) {
      for (let x = 0; x < w; x++) {
        const p = x / w
        const c = lerpC(rgba(255, 200, 50), rgba(255, 255, 200), p + i * 0.2)
        if (Math.abs(x - w/2) < w * 0.4 || i === 1) {
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`
          ctx.fillRect(x, 0, 1, h)
        }
      }
    }
  },
  {
    id: 'heavy-laser',
    frames: 3, fw: 48, fh: 12,
    draw(ctx, w, h, i) {
      for (let x = 0; x < w; x++) {
        const p = x / w
        const c = i === 0 ? lerpC(rgba(200,50,0), rgba(255,100,0), p) :
                  i === 1 ? lerpC(rgba(255,100,0), rgba(255,200,50), p) :
                            lerpC(rgba(255,200,50), rgba(255,255,200), p)
        const half = h / 2
        for (let y = 0; y < h; y++) {
          const dist = Math.abs(y - half) / half
          const alpha = dist < 0.4 ? 1 : dist < 0.7 ? 0.5 : 0
          if (alpha > 0) {
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
    }
  },
  {
    id: 'missile',
    frames: 4, fw: 16, fh: 8,
    draw(ctx, w, h, i) {
      const body = rgba(180, 180, 190), nose = rgba(220, 100, 50), dark = rgba(100,100,110)
      for (let x = 0; x < w; x++) {
        const p = x / w
        let col
        if (p < 0.2) col = nose
        else if (p < 0.85) col = body
        else col = dark
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2, thick = x < w*0.15 ? 1 : x < w*0.85 ? h*0.35 : h*0.2
        for (let y = 0; y < h; y++) {
          if (Math.abs(y - half) < thick) ctx.fillRect(x, y, 1, 1)
        }
      }
      // flame trail
      if (i >= 2) {
        const flameLen = i === 2 ? 4 : 6
        for (let f = 1; f <= flameLen; f++) {
          const px = w - f, fl = rgba(255, map(f,1,flameLen,200,50), map(f,1,flameLen,100,0), 0)
          ctx.fillStyle = `rgba(${fl[0]},${fl[1]},${fl[2]},${map(f,1,flameLen,0.8,0.2)})`
          ctx.fillRect(px, Math.floor(h/2)-1, 1, 2)
        }
      }
    }
  },
  {
    id: 'homing-missile',
    frames: 4, fw: 16, fh: 8,
    draw(ctx, w, h, i) {
      const body = rgba(200, 60, 60), nose = rgba(255, 150, 50)
      for (let x = 0; x < w; x++) {
        const p = x / w
        const col = p < 0.2 ? nose : body
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2, thick = x < w*0.15 ? 1 : h*0.35
        for (let y = 0; y < h; y++) {
          if (Math.abs(y - half) < thick) ctx.fillRect(x, y, 1, 1)
        }
      }
      if (i >= 2) {
        for (let f = 1; f <= (i===2?4:6); f++) {
          const px = w - f
          ctx.fillStyle = `rgba(${255-map(f,1,6,0,150)},${map(f,1,6,80,0)},0,${map(f,1,6,0.8,0.2)})`
          ctx.fillRect(px, Math.floor(h/2)-1, 1, 2)
        }
      }
    }
  },
  {
    id: 'cluster-missile',
    frames: 3, fw: 24, fh: 8,
    draw(ctx, w, h, i) {
      const offsets = [-3, 0, 3]
      offsets.forEach((off, idx) => {
        const bx = w/2 + off * 2, by = h/2 + off
        const col = idx === 1 ? rgba(180,180,190) : rgba(200,60,60)
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        ctx.fillRect(bx-3, by-1, 6, 2)
      })
      if (i >= 1) {
        offsets.forEach(off => {
          const bx = w - 4, by = h/2 + off
          ctx.fillStyle = `rgba(255,${map(i,1,2,150,50)},0,${map(i,1,2,0.6,0.3)})`
          ctx.fillRect(bx-1, by-1, 2, 2)
        })
      }
    }
  },
  {
    id: 'bullet',
    frames: 2, fw: 8, fh: 4,
    draw(ctx, w, h, i) {
      const bright = rgba(255, 220, 50), dim = rgba(255, 180, 0)
      for (let x = 0; x < w; x++) {
        const p = x / w
        const col = lerpC(bright, dim, p)
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2
        for (let y = 0; y < h; y++) {
          if (Math.abs(y - half) < (p < 0.3 ? 1 : 0.6)) ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  },
  {
    id: 'heavy-mg-bullet',
    frames: 2, fw: 12, fh: 6,
    draw(ctx, w, h, i) {
      const outer = rgba(255, 200, 50), inner = rgba(255, 255, 200)
      for (let x = 0; x < w; x++) {
        const p = x / w
        const col = lerpC(outer, inner, p)
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2
        for (let y = 0; y < h; y++) {
          const dist = Math.abs(y - half) / half
          if (dist < 0.6) ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  },
  {
    id: 'artillery-shell',
    frames: 4, fw: 24, fh: 12,
    draw(ctx, w, h, i) {
      const body = rgba(70, 70, 80), tip = rgba(120, 120, 130)
      for (let x = 0; x < w; x++) {
        const p = x / w
        const col = p < 0.15 ? tip : body
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2, thick = p < 0.15 ? 1.5 : p < 0.8 ? h*0.35 : h*0.2
        for (let y = 0; y < h; y++) {
          if (Math.abs(y - half) < thick) ctx.fillRect(x, y, 1, 1)
        }
      }
      if (i >= 2) {
        for (let f = 1; f <= (i===2?3:5); f++) {
          const px = w - f
          ctx.fillStyle = `rgba(${200+f*10},${150-f*20},0,${map(f,1,5,0.7,0.1)})`
          ctx.fillRect(px, Math.floor(h/2)-1, 1, 2)
        }
      }
    }
  },
  {
    id: 'heavy-artillery',
    frames: 4, fw: 32, fh: 16,
    draw(ctx, w, h, i) {
      const body = rgba(50, 50, 55), tip = rgba(90, 90, 100), band = rgba(180, 120, 40)
      for (let x = 0; x < w; x++) {
        const p = x / w
        let col
        if (p < 0.12) col = tip
        else if (p > 0.4 && p < 0.45) col = band
        else col = body
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`
        const half = h/2, thick = p < 0.1 ? 2 : p < 0.85 ? h*0.35 : h*0.2
        for (let y = 0; y < h; y++) {
          if (Math.abs(y - half) < thick) ctx.fillRect(x, y, 1, 1)
        }
      }
      if (i >= 2) {
        for (let f = 1; f <= (i===2?4:7); f++) {
          const px = w - f
          ctx.fillStyle = `rgba(${255-f*8},${150-f*15},0,${map(f,1,7,0.8,0.1)})`
          ctx.fillRect(px, Math.floor(h/2)-1, 1, 2)
        }
      }
    }
  },
]

function map(v, a, b, c, d) { return c + (v-a)/(b-a) * (d-c) }

// explosion
function drawExplosion(ctx, w, h, i, total) {
  const t = i / (total - 1)
  const r = w / 2
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const dx = x - w/2, dy = y - h/2
      const dist = Math.sqrt(dx*dx + dy*dy) / r
      const ring = Math.abs(dist - t * 0.9)
      if (ring < 0.08 + t * 0.05) {
        const alpha = ring < 0.04 ? 1 : map(ring, 0.04, 0.13, 1, 0)
        let col
        if (t < 0.3) col = [255, map(t,0,0.3,100,200), 0]
        else if (t < 0.6) col = [255, 255, map(t,0.3,0.6,0,200)]
        else col = [255, 255, map(t,0.6,1,255,100)]
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`
        ctx.fillRect(x, y, 1, 1)
      }
      // inner glow
      if (dist < t * 0.3 && i < total - 1) {
        const innerAlpha = map(dist, 0, t*0.3, 0.6, 0) * (1 - t)
        ctx.fillStyle = `rgba(255,255,200,${innerAlpha})`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}

function drawShieldHit(ctx, w, h, i, total) {
  const t = i / (total - 1)
  const r = w / 2
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const dx = x - w/2, dy = y - h/2
      const dist = Math.sqrt(dx*dx + dy*dy) / r
      const ring = Math.abs(dist - (0.3 + t * 0.4))
      if (ring < 0.06) {
        const alpha = map(ring, 0, 0.06, 0.6, 0) * (1 - t * 0.3)
        ctx.fillStyle = `rgba(0, 150, 255, ${alpha})`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}

// ---------- SUPPORT UNITS ----------
function drawTank(ctx, w, h, i, total, variant) {
  const bodyCol = variant === 'assault' ? rgba(80,90,70) : rgba(70,80,100)
  const turretCol = variant === 'assault' ? rgba(100,120,80) : rgba(90,100,130)
  const trackCol = rgba(50,50,50)
  const isFire = i >= 4
  const frame = isFire ? i - 4 : i

  // tracks
  ctx.fillStyle = `rgba(${trackCol[0]},${trackCol[1]},${trackCol[2]},1)`
  ctx.fillRect(4, 3, w-8, 4)
  ctx.fillRect(4, h-7, w-8, 4)
  // track detail / treads
  for (let tx = 6; tx < w-6; tx += 3) {
    const treadP = (tx + frame * 2) % 6
    if (treadP < 3) {
      ctx.fillStyle = 'rgba(40,40,40,1)'
      ctx.fillRect(tx, 4, 2, 2)
      ctx.fillRect(tx, h-6, 2, 2)
    }
  }
  // body
  ctx.fillStyle = `rgba(${bodyCol[0]},${bodyCol[1]},${bodyCol[2]},1)`
  ctx.fillRect(6, 7, w-16, h-14)
  // turret
  ctx.fillStyle = `rgba(${turretCol[0]},${turretCol[1]},${turretCol[2]},1)`
  ctx.fillRect(Math.floor(w/2)-4, 5, 10, 6)
  // barrel
  const barrelLen = isFire ? w/2+2 : w/2
  ctx.fillStyle = `rgba(60,60,60,1)`
  ctx.fillRect(w-4, 7, barrelLen - (w-4), 2)
  // muzzle flash on fire
  if (isFire) {
    ctx.fillStyle = `rgba(255,200,50,${map(frame,0,3,0.8,0.1)})`
    ctx.fillRect(w-2 + 4, 6, 4, 4)
  }
}

function drawDrone(ctx, w, h, i, total) {
  const isFire = i >= 4
  const frame = isFire ? i - 4 : i

  // body
  ctx.fillStyle = 'rgba(100, 160, 200, 1)'
  ctx.beginPath()
  ctx.ellipse(w/2, h/2, 6, 4, 0, 0, Math.PI*2)
  ctx.fill()

  // rotor arms (rotating)
  const angles = [0, Math.PI/2, Math.PI, Math.PI*1.5]
  const rotorR = 10 + frame * 0.5
  ctx.strokeStyle = 'rgba(80,80,80,0.8)'
  ctx.lineWidth = 1
  angles.forEach(a => {
    const ang = a + frame * 0.3
    const ex = w/2 + Math.cos(ang) * rotorR
    const ey = h/2 + Math.sin(ang) * rotorR
    ctx.beginPath()
    ctx.moveTo(w/2, h/2)
    ctx.lineTo(ex, ey)
    ctx.stroke()
    // rotor disc
    ctx.fillStyle = 'rgba(150,200,230,0.3)'
    ctx.beginPath()
    ctx.ellipse(ex, ey, 4, 1.5, ang, 0, Math.PI*2)
    ctx.fill()
  })

  // glow
  if (isFire) {
    ctx.fillStyle = `rgba(255,100,50,${map(frame,0,3,0.6,0)})`
    ctx.beginPath()
    ctx.arc(w/2, h/2, 3+frame, 0, Math.PI*2)
    ctx.fill()
  }
}

// ---------- BACKGROUNDS ----------
function drawNeonCity(ctx, w, h) {
  // sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
  skyGrad.addColorStop(0, '#0a0a2e')
  skyGrad.addColorStop(0.5, '#1a0a3e')
  skyGrad.addColorStop(1, '#0a0a1a')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)

  // stars
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 50) % w, sy = (i * 97 + 30) % (h * 0.4)
    const bright = 100 + (i * 37) % 156
    ctx.fillStyle = `rgba(${bright},${bright},255,${0.3 + (i%5)*0.15})`
    ctx.fillRect(sx, sy, 1 + i%2, 1 + i%2)
  }

  // far buildings
  ctx.fillStyle = '#0d0d2a'
  const bldgs = [
    [20, 200], [80, 280], [150, 220], [230, 350], [310, 260],
    [400, 190], [470, 310], [550, 240], [630, 330], [710, 210],
    [790, 290], [870, 250], [950, 360], [1030, 200], [1110, 280],
    [1200, 230], [1280, 340], [1360, 210], [1440, 300], [1520, 260],
    [1600, 350], [1700, 220], [1780, 310], [1860, 240], [1940, 330],
    [2020, 200]
  ]
  bldgs.forEach(([bx, bh]) => {
    const bw = 40 + (bx * 7) % 40
    ctx.fillRect(bx, h - bh, bw, bh)
  })

  // neon windows
  const neonColors = ['#00ffff', '#ff00ff', '#00ff88', '#ff6600', '#ffff00']
  bldgs.forEach(([bx, bh], idx) => {
    const bw = 40 + (bx * 7) % 40
    const col = neonColors[idx % neonColors.length]
    ctx.fillStyle = col + '40'
    for (let wy = h - bh + 8; wy < h - 5; wy += 12) {
      for (let wx = bx + 4; wx < bx + bw - 4; wx += 8) {
        if ((wx * 7 + wy * 13) % 5 > 1) {
          const alpha = 0.2 + ((wx * 3 + wy * 7) % 4) * 0.15
          ctx.globalAlpha = alpha
          ctx.fillRect(wx, wy, 3, 5)
          ctx.globalAlpha = 1
        }
      }
    }
  })

  // ground
  ctx.fillStyle = '#0a0a15'
  ctx.fillRect(0, h-15, w, 15)
  // ground neon line
  ctx.fillStyle = '#00ffff40'
  ctx.fillRect(0, h-15, w, 1)

  // moon
  ctx.fillStyle = '#ffffff15'
  ctx.beginPath()
  ctx.arc(w-80, 60, 25, 0, Math.PI*2)
  ctx.fill()
}

function drawIndustrial(ctx, w, h) {
  // sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
  skyGrad.addColorStop(0, '#4a4a3a')
  skyGrad.addColorStop(0.4, '#6a5a3a')
  skyGrad.addColorStop(0.7, '#8a7a5a')
  skyGrad.addColorStop(1, '#3a3a2a')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)

  // distant mountains
  ctx.fillStyle = '#3a3a2a'
  ctx.beginPath()
  ctx.moveTo(0, h * 0.6)
  for (let x = 0; x <= w; x += 40) {
    const y = h * 0.45 + Math.sin(x * 0.003) * 60 + Math.sin(x * 0.007) * 30
    ctx.lineTo(x, y)
  }
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.fill()

  // factories
  const factories = [
    { x: 50, w: 120, h: 180 },
    { x: 300, w: 200, h: 250 },
    { x: 650, w: 160, h: 200 },
    { x: 950, w: 220, h: 280 },
    { x: 1300, w: 180, h: 220 },
    { x: 1600, w: 250, h: 300 },
    { x: 1950, w: 140, h: 200 },
  ]
  factories.forEach(f => {
    const fh = Math.min(f.h, h-30)
    ctx.fillStyle = '#4a3a2a'
    ctx.fillRect(f.x, h-fh, f.w, fh)
    // smoke stacks
    for (let s = 0; s < 3; s++) {
      const sx = f.x + 20 + s * 45
      const sh = 30 + (s * 15)
      ctx.fillStyle = '#3a2a1a'
      ctx.fillRect(sx, h-fh-sh, 8, sh)
      // smoke
      for (let p = 0; p < 8; p++) {
        const age = (p + s * 3) % 8
        const px = sx + Math.sin(age * 0.8) * (age * 3)
        const py = h-fh-sh - age * 6
        ctx.fillStyle = `rgba(80,70,60,${0.3 - age * 0.03})`
        ctx.fillRect(px, py, age*2, age*2)
      }
    }
    // windows
    ctx.fillStyle = '#8a7a4a60'
    for (let wy = h-fh+15; wy < h-20; wy += 18) {
      for (let wx = f.x+10; wx < f.x+f.w-10; wx += 14) {
        ctx.fillRect(wx, wy, 6, 8)
      }
    }
  })

  // ground
  ctx.fillStyle = '#2a2a1a'
  ctx.fillRect(0, h-20, w, 20)
  ctx.fillStyle = '#5a4a2a'
  ctx.fillRect(0, h-20, w, 1)
}

// ---------- UI ----------
function drawHealthBarFrame(ctx, w, h) {
  ctx.fillStyle = '#1a1a2a'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#3a3a5a'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w-2, h-2)
  ctx.strokeStyle = '#5a5a7a'
  ctx.lineWidth = 1
  ctx.strokeRect(3, 3, w-6, h-6)
}

function drawHealthBarFill(ctx, w, h, color) {
  const grad = ctx.createLinearGradient(0, 0, w, 0)
  if (color === 'green') {
    grad.addColorStop(0, '#00aa44')
    grad.addColorStop(0.5, '#00dd66')
    grad.addColorStop(1, '#00aa44')
  } else if (color === 'red') {
    grad.addColorStop(0, '#aa0000')
    grad.addColorStop(0.5, '#dd2222')
    grad.addColorStop(1, '#aa0000')
  } else {
    grad.addColorStop(0, '#0044aa')
    grad.addColorStop(0.5, '#0066dd')
    grad.addColorStop(1, '#0044aa')
  }
  ctx.fillStyle = grad
  ctx.fillRect(2, 2, w-4, h-4)
}

function drawIcon(ctx, w, h, type) {
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = '#00ccff'
  ctx.lineWidth = 2
  ctx.fillStyle = '#00ccff40'

  switch (type) {
    case 'armour': {
      // shield plate shape
      ctx.beginPath()
      ctx.moveTo(w/2, 4)
      ctx.lineTo(w-4, h*0.3)
      ctx.lineTo(w*0.7, h-4)
      ctx.lineTo(w*0.3, h-4)
      ctx.lineTo(4, h*0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'shields': {
      // energy bubble
      ctx.beginPath()
      ctx.arc(w/2, h/2, w*0.35, 0, Math.PI*2)
      ctx.fill()
      ctx.stroke()
      // inner highlight
      ctx.beginPath()
      ctx.arc(w*0.38, h*0.38, 4, 0, Math.PI*2)
      ctx.fillStyle = '#ffffff40'
      ctx.fill()
      break
    }
    case 'weapons': {
      // crossed guns
      const cx = w/2, cy = h/2
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(cx-8, cy-2); ctx.lineTo(cx-3, cy-2)
      ctx.lineTo(cx-3, cy+8); ctx.lineTo(cx+3, cy+8)
      ctx.lineTo(cx+3, cy-2); ctx.lineTo(cx+8, cy-2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx+2, cy-8); ctx.lineTo(cx+2, cy-3)
      ctx.lineTo(cx-8, cy-3); ctx.lineTo(cx-8, cy+3)
      ctx.lineTo(cx+2, cy+3); ctx.lineTo(cx+2, cy+8)
      ctx.stroke()
      break
    }
    case 'targeting': {
      // crosshair
      ctx.beginPath()
      ctx.arc(w/2, h/2, 8, 0, Math.PI*2)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w/2, 4); ctx.lineTo(w/2, h-4)
      ctx.moveTo(4, h/2); ctx.lineTo(w-4, h/2)
      ctx.stroke()
      ctx.strokeStyle = '#ff4444'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(w/2, h/2, 2, 0, Math.PI*2)
      ctx.stroke()
      break
    }
    case 'nano-repair': {
      // wrench
      ctx.strokeStyle = '#00ccff'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(11, 21, 8, Math.PI*1.2, Math.PI*1.8)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(10, 12)
      ctx.lineTo(18, 4)
      ctx.lineTo(26, 12)
      ctx.stroke()
      // spark
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.arc(22, 8, 2, 0, Math.PI*2)
      ctx.fill()
      ctx.fillStyle = '#ff8800'
      ctx.beginPath()
      ctx.arc(25, 6, 1.5, 0, Math.PI*2)
      ctx.fill()
      break
    }
    case 'legs': {
      // mechanical leg
      ctx.strokeStyle = '#00ccff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(16, 6)
      ctx.lineTo(10, 18)
      ctx.lineTo(16, 26)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(16, 14)
      ctx.lineTo(24, 18)
      ctx.lineTo(20, 26)
      ctx.stroke()
      // joints
      ctx.fillStyle = '#00ccff40'
      ctx.beginPath()
      ctx.arc(16, 6, 3, 0, Math.PI*2)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(10, 18, 2.5, 0, Math.PI*2)
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'coin': {
      // gold coin
      ctx.fillStyle = '#ffcc00'
      ctx.beginPath()
      ctx.arc(w/2, h/2, 12, 0, Math.PI*2)
      ctx.fill()
      ctx.strokeStyle = '#aa8800'
      ctx.lineWidth = 2
      ctx.stroke()
      // bolt
      ctx.fillStyle = '#886600'
      ctx.beginPath()
      ctx.moveTo(w/2, h/2-6)
      ctx.lineTo(w/2-3, h/2+1)
      ctx.lineTo(w/2+1, h/2+1)
      ctx.lineTo(w/2-2, h/2+7)
      ctx.lineTo(w/2+4, h/2-1)
      ctx.lineTo(w/2-1, h/2-1)
      ctx.closePath()
      ctx.fill()
      break
    }
  }
}

function drawButton(ctx, w, h, variant) {
  if (variant === 'primary') {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#00aadd')
    grad.addColorStop(0.5, '#0088cc')
    grad.addColorStop(1, '#0066aa')
    ctx.fillStyle = grad
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#3a3a4a')
    grad.addColorStop(0.5, '#2a2a3a')
    grad.addColorStop(1, '#1a1a2a')
    ctx.fillStyle = grad
  }
  ctx.beginPath()
  ctx.roundRect(2, 2, w-4, h-4, 4)
  ctx.fill()
  ctx.strokeStyle = variant === 'primary' ? '#00ddff' : '#5a5a7a'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawJoystick(ctx, w, h, isBase) {
  if (isBase) {
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.arc(w/2, h/2, w/2-2, 0, Math.PI*2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()
    // cross lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.beginPath()
    ctx.moveTo(w/2, 4); ctx.lineTo(w/2, h-4)
    ctx.moveTo(4, h/2); ctx.lineTo(w-4, h/2)
    ctx.stroke()
  } else {
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2)
    grad.addColorStop(0, 'rgba(100,180,255,0.6)')
    grad.addColorStop(0.6, 'rgba(60,120,200,0.5)')
    grad.addColorStop(1, 'rgba(30,60,120,0.3)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(w/2, h/2, w/2-2, 0, Math.PI*2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(100,180,255,0.4)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

function drawPwaIcon(ctx, w, h) {
  const d = Math.min(w, h)
  const cx = w/2, cy = h/2
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, d/2)
  grad.addColorStop(0, '#1a0a3e')
  grad.addColorStop(0.5, '#0a0a2e')
  grad.addColorStop(1, '#050515')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // outer hex border
  ctx.strokeStyle = '#00ccff'
  ctx.lineWidth = d * 0.02
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI / 3) - Math.PI / 2
    const px = cx + d * 0.42 * Math.cos(angle)
    const py = cy + d * 0.42 * Math.sin(angle)
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()

  // inner hex
  ctx.strokeStyle = '#ff00ff80'
  ctx.lineWidth = d * 0.015
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI / 3) - Math.PI / 2
    const px = cx + d * 0.28 * Math.cos(angle)
    const py = cy + d * 0.28 * Math.sin(angle)
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()

  // letter O
  ctx.fillStyle = '#00ccff'
  ctx.font = `bold ${d * 0.45}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('O', cx, cy + 2)
}

// ---------- MAIN ----------
async function main() {
  const manifest = { weapons: {}, support: {}, backgrounds: {}, ui: {} }

  // --- WEAPONS ---
  for (const w of weapons) {
    const buf = buildSheet(w.frames, w.fw, w.fh, w.draw)
    const path = join(OUT.WEAPONS, `${w.id}.png`)
    writeFileSync(path, buf)
    const cols = Math.min(w.frames, 8)
    const rows = Math.ceil(w.frames / cols)
    manifest.weapons[w.id] = {
      path: `assets/weapons/${w.id}.png`,
      frames: w.frames,
      frameWidth: w.fw,
      frameHeight: w.fh,
      cols, rows,
      totalWidth: cols * w.fw,
      totalHeight: rows * w.fh,
    }
    console.log(`  ✓ ${w.id}.png (${w.frames}f × ${w.fw}×${w.fh})`)
  }

  // explosion
  const expBuf = buildSheet(6, 48, 48, drawExplosion)
  writeFileSync(join(OUT.WEAPONS, 'explosion.png'), expBuf)
  manifest.weapons.explosion = {
    path: 'assets/weapons/explosion.png',
    frames: 6, frameWidth: 48, frameHeight: 48, cols: 6, rows: 1,
    totalWidth: 288, totalHeight: 48,
  }
  console.log('  ✓ explosion.png (6f × 48×48)')

  // shield hit
  const shieldBuf = buildSheet(3, 32, 32, drawShieldHit)
  writeFileSync(join(OUT.WEAPONS, 'shield-hit.png'), shieldBuf)
  manifest.weapons['shield-hit'] = {
    path: 'assets/weapons/shield-hit.png',
    frames: 3, frameWidth: 32, frameHeight: 32, cols: 3, rows: 1,
    totalWidth: 96, totalHeight: 32,
  }
  console.log('  ✓ shield-hit.png (3f × 32×32)')

  // --- SUPPORT UNITS ---
  // Assault Tank: idle(4) + fire(4)
  const tankAssaultBuf = buildSheet(8, 48, 24, (ctx, w, h, i, t) => drawTank(ctx, w, h, i, t, 'assault'))
  writeFileSync(join(OUT.SUPPORT, 'assault-tank.png'), tankAssaultBuf)
  manifest.support['assault-tank'] = {
    path: 'assets/support/assault-tank.png',
    frames: 8, frameWidth: 48, frameHeight: 24, cols: 8, rows: 1,
    totalWidth: 384, totalHeight: 24,
    animations: { idle: [0,3], fire: [4,7] }
  }
  console.log('  ✓ assault-tank.png (8f × 48×24)')

  const tankDefenseBuf = buildSheet(8, 48, 24, (ctx, w, h, i, t) => drawTank(ctx, w, h, i, t, 'defense'))
  writeFileSync(join(OUT.SUPPORT, 'defense-tank.png'), tankDefenseBuf)
  manifest.support['defense-tank'] = {
    path: 'assets/support/defense-tank.png',
    frames: 8, frameWidth: 48, frameHeight: 24, cols: 8, rows: 1,
    totalWidth: 384, totalHeight: 24,
    animations: { idle: [0,3], fire: [4,7] }
  }
  console.log('  ✓ defense-tank.png (8f × 48×24)')

  // Scout Drone: hover(4) + fire(4)
  const droneBuf = buildSheet(8, 32, 32, drawDrone)
  writeFileSync(join(OUT.SUPPORT, 'scout-drone.png'), droneBuf)
  manifest.support['scout-drone'] = {
    path: 'assets/support/scout-drone.png',
    frames: 8, frameWidth: 32, frameHeight: 32, cols: 8, rows: 1,
    totalWidth: 256, totalHeight: 32,
    animations: { hover: [0,3], fire: [4,7] }
  }
  console.log('  ✓ scout-drone.png (8f × 32×32)')

  // --- BACKGROUNDS ---
  const bgW = 2048, bgH = 768

  const neonCityFar = createCanvas(bgW, bgH)
  drawNeonCity(neonCityFar.getContext('2d'), bgW, bgH)
  writeFileSync(join(OUT.BG, 'neon-city_far.png'), neonCityFar.toBuffer('image/png'))
  manifest.backgrounds['neon-city_far'] = { path: 'assets/backgrounds/neon-city_far.png', width: bgW, height: bgH }
  console.log('  ✓ neon-city_far.png (2048×768)')

  const neonCityNear = createCanvas(bgW, bgH)
  const ncnCtx = neonCityNear.getContext('2d')
  drawNeonCity(ncnCtx, bgW, bgH)
  ncnCtx.fillStyle = '#00000060'
  ncnCtx.fillRect(0, 0, bgW, bgH)
  // add near buildings
  const nearBldgs = [[100,300],[400,400],[800,350],[1200,420],[1600,380],[1900,340]]
  ncnCtx.fillStyle = '#0a0a15'
  nearBldgs.forEach(([bx, bh]) => {
    ncnCtx.fillRect(bx, bgH-bh, 60 + (bx%30), bh)
    ncnCtx.fillStyle = '#00ffff15'
    for (let wy = bgH-bh+12; wy < bgH-8; wy += 14) {
      for (let wx = bx+6; wx < bx+50; wx += 10) {
        ncnCtx.fillStyle = `rgba(0,255,255,${0.05 + (wx*wy)%3 * 0.05})`
        ncnCtx.fillRect(wx, wy, 4, 6)
      }
    }
    ncnCtx.fillStyle = '#0a0a15'
  })
  writeFileSync(join(OUT.BG, 'neon-city_near.png'), neonCityNear.toBuffer('image/png'))
  manifest.backgrounds['neon-city_near'] = { path: 'assets/backgrounds/neon-city_near.png', width: bgW, height: bgH }
  console.log('  ✓ neon-city_near.png (2048×768)')

  const industrialFar = createCanvas(bgW, bgH)
  drawIndustrial(industrialFar.getContext('2d'), bgW, bgH)
  writeFileSync(join(OUT.BG, 'industrial_far.png'), industrialFar.toBuffer('image/png'))
  manifest.backgrounds['industrial_far'] = { path: 'assets/backgrounds/industrial_far.png', width: bgW, height: bgH }
  console.log('  ✓ industrial_far.png (2048×768)')

  const industrialNear = createCanvas(bgW, bgH)
  const inCtx = industrialNear.getContext('2d')
  drawIndustrial(inCtx, bgW, bgH)
  inCtx.fillStyle = '#00000040'
  inCtx.fillRect(0, 0, bgW, bgH)
  const nearFactories = [[50,200],[500,280],[1000,240],[1500,300]]
  inCtx.fillStyle = '#2a2a1a'
  nearFactories.forEach(([bx, bh]) => {
    inCtx.fillRect(bx, bgH-bh, 80 + (bx%20), bh)
    for (let s = 0; s < 2; s++) {
      inCtx.fillStyle = '#1a1a0a'
      inCtx.fillRect(bx+15+s*30, bgH-bh-20, 6, 20)
      inCtx.fillStyle = `rgba(200,150,50,${0.05 + s * 0.03})`
      inCtx.fillRect(bx+14+s*30, bgH-bh-22, 8, 2)
    }
  })
  writeFileSync(join(OUT.BG, 'industrial_near.png'), industrialNear.toBuffer('image/png'))
  manifest.backgrounds['industrial_near'] = { path: 'assets/backgrounds/industrial_near.png', width: bgW, height: bgH }
  console.log('  ✓ industrial_near.png (2048×768)')

  // --- UI ---
  // health bars
  const uiItems = [
    { id: 'health-bar-frame', w: 256, h: 32, draw: (c,w,h) => drawHealthBarFrame(c,w,h) },
    { id: 'health-bar-fill-green', w: 256, h: 32, draw: (c,w,h) => drawHealthBarFill(c,w,h,'green') },
    { id: 'health-bar-fill-red', w: 256, h: 32, draw: (c,w,h) => drawHealthBarFill(c,w,h,'red') },
    { id: 'shield-bar-fill-blue', w: 256, h: 32, draw: (c,w,h) => drawHealthBarFill(c,w,h,'blue') },
  ]

  const iconDefs = ['armour', 'shields', 'weapons', 'targeting', 'nano-repair', 'legs', 'coin']
  iconDefs.forEach(id => {
    uiItems.push({ id: `icon-${id}`, w: 32, h: 32, draw: (c,w,h) => drawIcon(c,w,h,id) })
  })

  uiItems.push({ id: 'btn-primary', w: 64, h: 32, draw: (c,w,h) => drawButton(c,w,h,'primary') })
  uiItems.push({ id: 'btn-secondary', w: 64, h: 32, draw: (c,w,h) => drawButton(c,w,h,'secondary') })
  uiItems.push({ id: 'joystick-base', w: 128, h: 128, draw: (c,w,h) => drawJoystick(c,w,h,true) })
  uiItems.push({ id: 'joystick-knob', w: 48, h: 48, draw: (c,w,h) => drawJoystick(c,w,h,false) })

  for (const item of uiItems) {
    const c = createCanvas(item.w, item.h)
    const ctx = c.getContext('2d')
    item.draw(ctx, item.w, item.h)
    const buf = c.toBuffer('image/png')
    writeFileSync(join(OUT.UI, `${item.id}.png`), buf)
    manifest.ui[item.id] = { path: `assets/ui/${item.id}.png`, width: item.w, height: item.h }
    console.log(`  ✓ ${item.id}.png (${item.w}×${item.h})`)
  }

  // PWA icons
  for (const size of [192, 512]) {
    const c = createCanvas(size, size)
    const ctx = c.getContext('2d')
    drawPwaIcon(ctx, size, size)
    const buf = c.toBuffer('image/png')
    writeFileSync(join(OUT.UI, `icon-${size}.png`), buf)
    manifest.ui[`icon-${size}`] = { path: `assets/ui/icon-${size}.png`, width: size, height: size }
    console.log(`  ✓ icon-${size}.png (${size}×${size})`)
  }

  // --- MANIFEST ---
  const manifestPath = join(ROOT, 'src/data/assetManifest.ts')
  mkdirSync(dirname(manifestPath), { recursive: true })
  const manifestContent = `// Auto-generated by tools/generate-assets.mjs
export interface AssetFrame {
  frame: number
  x: number
  y: number
  w: number
  h: number
}

export interface SpriteSheetAsset {
  path: string
  frames: number
  frameWidth: number
  frameHeight: number
  cols: number
  rows: number
  totalWidth: number
  totalHeight: number
  animations?: Record<string, [number, number]>
}

export interface ImageAsset {
  path: string
  width: number
  height: number
}

export interface AssetManifest {
  weapons: Record<string, SpriteSheetAsset>
  support: Record<string, SpriteSheetAsset>
  backgrounds: Record<string, ImageAsset>
  ui: Record<string, ImageAsset>
}

export const assetManifest: AssetManifest = ${JSON.stringify(manifest, null, 2)}
`
  writeFileSync(manifestPath, manifestContent)
  console.log(`\n  ✓ assetManifest.ts written`)
  console.log('\n✅ All assets generated successfully!')
}

main().catch(e => { console.error(e); process.exit(1) })
