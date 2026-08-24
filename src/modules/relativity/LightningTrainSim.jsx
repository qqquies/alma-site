import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './LightningTrainSim.css'

const VIEW_W = 640
const VIEW_H = 330
const CENTER_X = VIEW_W / 2
const RAIL_Y = 262
const STRIKE_DIST = 210
const LEFT_X = CENTER_X - STRIKE_DIST
const RIGHT_X = CENTER_X + STRIKE_DIST
const LIGHT_SPEED = 120
const TRAIN_W = 230
const TRAIN_H = 52

function LightningTrainSim() {
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [vFrac, setVFrac] = useState(0.35)
  const [events, setEvents] = useState([])

  const timeRef = useRef(0)
  const flagsRef = useRef({ passRight: false, passLeft: false, platBoth: false })
  const vFracRef = useRef(vFrac)

  useEffect(() => {
    vFracRef.current = vFrac
  }, [vFrac])

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = VIEW_W * dpr
    canvas.height = VIEW_H * dpr
    canvas.getContext('2d').scale(dpr, dpr)
  }, [])

  function handleStart() {
    timeRef.current = 0
    flagsRef.current = { passRight: false, passLeft: false, platBoth: false }
    setEvents([])
    setPhase('running')
  }

  function drawStickman(ctx, x, feetY) {
    ctx.strokeStyle = '#c9d4cd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, feetY - 34, 5, 0, Math.PI * 2)
    ctx.moveTo(x, feetY - 29)
    ctx.lineTo(x, feetY - 12)
    ctx.moveTo(x - 7, feetY - 22)
    ctx.lineTo(x + 7, feetY - 22)
    ctx.moveTo(x, feetY - 12)
    ctx.lineTo(x - 5, feetY)
    ctx.moveTo(x, feetY - 12)
    ctx.lineTo(x + 5, feetY)
    ctx.stroke()
    ctx.lineWidth = 1
  }

  function drawBolt(ctx, x, topY) {
    ctx.strokeStyle = '#6fcd97'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + 6, topY)
    ctx.lineTo(x - 3, topY + 12)
    ctx.lineTo(x + 3, topY + 13)
    ctx.lineTo(x - 5, topY + 26)
    ctx.stroke()
    ctx.lineWidth = 1
  }

  function drawFrame(t) {
    const ctx = canvasRef.current.getContext('2d')
    const v = vFracRef.current * LIGHT_SPEED

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.fillRect(0, RAIL_Y + 9, VIEW_W, 2)

    const radius = LIGHT_SPEED * t

    if (t > 0) {
      for (const strikeX of [LEFT_X, RIGHT_X]) {
        ctx.beginPath()
        ctx.arc(strikeX, RAIL_Y - 40, radius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(111, 205, 151, 0.45)'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.lineWidth = 1
    }

    drawBolt(ctx, LEFT_X, RAIL_Y - 80)
    drawBolt(ctx, RIGHT_X, RAIL_Y - 80)

    ctx.fillStyle = '#20252a'
    ctx.fillRect(CENTER_X - 55, RAIL_Y, 110, 10)

    const trainCenter = CENTER_X + v * t
    const tx = trainCenter - TRAIN_W / 2
    const ty = RAIL_Y - TRAIN_H
    ctx.fillStyle = '#223038'
    ctx.fillRect(tx, ty, TRAIN_W, TRAIN_H)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.strokeRect(tx, ty, TRAIN_W, TRAIN_H)
    ctx.fillStyle = '#3a4a52'
    for (let i = 0; i < 4; i += 1) {
      ctx.fillRect(tx + 14 + i * 54, ty + 11, 38, 22)
    }
    ctx.fillStyle = '#141a1d'
    ctx.strokeStyle = '#55625c'
    for (const wheelDx of [40, TRAIN_W - 40]) {
      ctx.beginPath()
      ctx.arc(tx + wheelDx, RAIL_Y + 2, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    drawStickman(ctx, trainCenter, ty + TRAIN_H - 4)
    drawStickman(ctx, CENTER_X, RAIL_Y - 10)

    ctx.fillStyle = '#99a39d'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('пассажир', trainCenter, ty - 8)
    ctx.fillText('наблюдатель', CENTER_X, RAIL_Y + 30)

    return { trainCenter }
  }

  useAnimationFrame(
    (dt) => {
      timeRef.current += dt
      const t = timeRef.current
      const v = vFracRef.current * LIGHT_SPEED
      const flags = flagsRef.current

      drawFrame(t)

      const passengerX = CENTER_X + v * t
      const distRight = Math.abs(RIGHT_X - passengerX)
      const distLeft = Math.abs(passengerX - LEFT_X)
      const newEvents = []

      if (!flags.passRight && distRight <= radius(t)) {
        flags.passRight = true
        newEvents.push({
          id: 'pass-right',
          label: `Правая вспышка достигла пассажира (${fmtTime(t)} с)`,
        })
      }
      if (!flags.platBoth && radius(t) >= STRIKE_DIST) {
        flags.platBoth = true
        newEvents.push({
          id: 'plat-both',
          label: `Обе вспышки достигли человека на платформе одновременно (${fmtTime(t)} с)`,
        })
      }
      if (!flags.passLeft && distLeft <= radius(t)) {
        flags.passLeft = true
        newEvents.push({
          id: 'pass-left',
          label: `Левая вспышка достигла пассажира (${fmtTime(t)} с)`,
        })
      }

      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents])
      }

      if (flags.passRight && flags.platBoth && flags.passLeft) {
        setPhase('done')
      }
    },
    phase === 'running',
  )

  function radius(t) {
    return LIGHT_SPEED * t
  }

  const fmtTime = (value) => value.toFixed(1).replace('.', ',')
  const percent = Math.round(vFrac * 100)

  return (
    <figure className="sim lt">
      <div className="sim-title">
        Наблюдение со стороны платформы. Обе вспышки распространяются с
        одинаковой скоростью во все стороны. Скорости в модели преувеличены:
        настоящий поезд так двигаться не может.
      </div>
      <canvas ref={canvasRef} />
      <div className="sim-controls">
        <button
          type="button"
          className="sim-button"
          onClick={handleStart}
          disabled={phase === 'running'}
        >
          {phase === 'done' ? 'Повторить опыт' : 'Запустить опыт'}
        </button>
      </div>
      <div className="sim-slider">
        <label htmlFor="lt-speed">
          Скорость поезда: {percent}% от скорости света (в масштабе модели)
        </label>
        <input
          id="lt-speed"
          type="range"
          min="0.15"
          max="0.45"
          step="0.05"
          value={vFrac}
          disabled={phase === 'running'}
          onChange={(event) => setVFrac(parseFloat(event.target.value))}
        />
      </div>
      <div className="lt-log">
        {events.map((event) => (
          <div key={event.id} className="lt-log-item">
            {event.label}
          </div>
        ))}
        {phase === 'done' && (
          <p className="lt-conclusion">
            Человек на платформе получил обе вспышки в один момент, а
            пассажир — правую заметно раньше левой. И оба видели честную
            картину: свет летел к каждому с одинаковой скоростью.
          </p>
        )}
      </div>
    </figure>
  )
}

export default LightningTrainSim
