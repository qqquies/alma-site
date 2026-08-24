import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './LightClockSim.css'

const VIEW_W = 640
const VIEW_H = 300
const MIRROR_TOP = 70
const MIRROR_BOTTOM = 250
const SPAN = MIRROR_BOTTOM - MIRROR_TOP
const MIRROR_HALF_W = 50
const REST_X = 120
const MOV_START_X = 250
const MOV_WRAP_X = VIEW_W - 50
const PHOTON_SPEED = 260
const HALF_TICK = SPAN / PHOTON_SPEED
const TRAIL_MAX = 500

function LightClockSim() {
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(true)
  const [beta, setBeta] = useState(0.6)
  const [restCount, setRestCount] = useState(0)
  const [movCount, setMovCount] = useState(0)

  const restY = useRef(MIRROR_TOP)
  const restDir = useRef(1)
  const restCountRef = useRef(0)
  const movPhase = useRef(0)
  const movDir = useRef(1)
  const movX = useRef(MOV_START_X)
  const movCountRef = useRef(0)
  const trail = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = VIEW_W * dpr
    canvas.height = VIEW_H * dpr
    canvas.getContext('2d').scale(dpr, dpr)
  }, [])

  function handleBetaChange(event) {
    setBeta(parseFloat(event.target.value))
    trail.current = []
  }

  function handleReset() {
    restY.current = MIRROR_TOP
    restDir.current = 1
    restCountRef.current = 0
    movPhase.current = 0
    movDir.current = 1
    movX.current = MOV_START_X
    movCountRef.current = 0
    trail.current = []
    setRestCount(0)
    setMovCount(0)
  }

  function drawMirrors(ctx, x) {
    ctx.fillStyle = '#8fa39a'
    ctx.fillRect(x - MIRROR_HALF_W, MIRROR_TOP - 3, MIRROR_HALF_W * 2, 6)
    ctx.fillRect(x - MIRROR_HALF_W, MIRROR_BOTTOM - 3, MIRROR_HALF_W * 2, 6)
  }

  function drawPhoton(ctx, x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#6fcd97'
    ctx.shadowColor = '#6fcd97'
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.shadowBlur = 0
  }

  function drawFrame(movY) {
    const ctx = canvasRef.current.getContext('2d')

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    if (trail.current.length > 1) {
      ctx.beginPath()
      ctx.moveTo(trail.current[0].x, trail.current[0].y)
      for (const point of trail.current) {
        ctx.lineTo(point.x, point.y)
      }
      ctx.strokeStyle = 'rgba(63, 174, 118, 0.35)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    drawMirrors(ctx, REST_X)
    drawMirrors(ctx, movX.current)
    drawPhoton(ctx, REST_X, restY.current)
    drawPhoton(ctx, movX.current, movY)

    ctx.fillStyle = '#99a39d'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Покоится', REST_X, VIEW_H - 12)
    ctx.fillText('Движется →', movX.current, VIEW_H - 12)
  }

  useAnimationFrame((dt) => {
    const gamma = 1 / Math.sqrt(1 - beta * beta)
    const tau = gamma * HALF_TICK

    restY.current += restDir.current * PHOTON_SPEED * dt
    if (restY.current >= MIRROR_BOTTOM) {
      restY.current = MIRROR_BOTTOM
      restDir.current = -1
      restCountRef.current += 1
      setRestCount(restCountRef.current)
    } else if (restY.current <= MIRROR_TOP) {
      restY.current = MIRROR_TOP
      restDir.current = 1
      restCountRef.current += 1
      setRestCount(restCountRef.current)
    }

    movPhase.current += dt
    if (movPhase.current >= tau) {
      movPhase.current -= tau
      movDir.current *= -1
      movCountRef.current += 1
      setMovCount(movCountRef.current)
    }
    const p = Math.min(movPhase.current / tau, 1)
    const movY =
      movDir.current > 0 ? MIRROR_TOP + p * SPAN : MIRROR_BOTTOM - p * SPAN

    movX.current += beta * PHOTON_SPEED * dt
    if (movX.current > MOV_WRAP_X) {
      movX.current = MOV_START_X
      trail.current = []
    }

    trail.current.push({ x: movX.current, y: movY })
    if (trail.current.length > TRAIL_MAX) trail.current.shift()

    drawFrame(movY)
  }, running)

  const fmt = (value) => value.toFixed(2).replace('.', ',')
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  return (
    <figure className="sim">
      <div className="sim-title">
        Наблюдаем из системы отсчёта, где левые часы покоятся. Скорость света
        в модели условна.
      </div>
      <canvas ref={canvasRef} />
      <div className="sim-controls">
        <button type="button" className="sim-button" onClick={() => setRunning(!running)}>
          {running ? 'Пауза' : 'Продолжить'}
        </button>
        <button type="button" className="sim-button" onClick={handleReset}>
          Сброс
        </button>
      </div>
      <div className="sim-slider">
        <label htmlFor="speed-range">
          Скорость движущихся часов: v = {fmt(beta)}·c
        </label>
        <input
          id="speed-range"
          type="range"
          min="0"
          max="0.95"
          step="0.05"
          value={beta}
          onChange={handleBetaChange}
        />
      </div>
      <div className="sim-stats">
        <span>Отражений (покой): {restCount}</span>
        <span>Отражений (движение): {movCount}</span>
        <span className="sim-gamma">γ = {fmt(gamma)}</span>
      </div>
    </figure>
  )
}

export default LightClockSim
