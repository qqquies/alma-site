import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './LightningTrainSim.css'

const VIEW_W = 640
const VIEW_H = 400
const CENTER_X = VIEW_W / 2
const RAIL_Y = 330
const STRIKE_DIST = 210
const LEFT_X = CENTER_X - STRIKE_DIST
const RIGHT_X = CENTER_X + STRIKE_DIST
const LIGHT_SPEED = 120
const LOCO_W = 140
const LOCO_H = 44
const WAGON_W = 120
const WAGON_H = 40

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

  function radius(t) {
    return LIGHT_SPEED * t
  }

  function drawBolt(ctx, x) {
    const baseY = RAIL_Y - 30
    ctx.strokeStyle = '#6fcd97'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + 8, baseY - 62)
    ctx.lineTo(x - 4, baseY - 34)
    ctx.lineTo(x + 4, baseY - 32)
    ctx.lineTo(x - 7, baseY)
    ctx.stroke()
    ctx.lineWidth = 1
  }

  function drawTrain(ctx, trainCenter) {
    const fx = trainCenter + LOCO_W / 2
    const roofY = RAIL_Y - LOCO_H

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillStyle = '#223038'
    ctx.beginPath()
    ctx.moveTo(fx - LOCO_W, roofY + 6)
    ctx.quadraticCurveTo(fx - LOCO_W, roofY, fx - LOCO_W + 14, roofY)
    ctx.lineTo(fx - 26, roofY)
    ctx.quadraticCurveTo(fx, roofY, fx, roofY + 22)
    ctx.lineTo(fx, RAIL_Y)
    ctx.lineTo(fx - LOCO_W, RAIL_Y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#3a4a52'
    ctx.fillRect(fx - 54, roofY + 9, 36, 18)

    ctx.strokeStyle = '#55625c'
    ctx.beginPath()
    ctx.moveTo(fx - 78, roofY)
    ctx.lineTo(fx - 88, roofY - 14)
    ctx.moveTo(fx - 98, roofY)
    ctx.lineTo(fx - 88, roofY - 14)
    ctx.moveTo(fx - 102, roofY - 14)
    ctx.lineTo(fx - 74, roofY - 14)
    ctx.stroke()

    const wx = fx - LOCO_W - 10
    ctx.fillStyle = '#223038'
    ctx.fillRect(wx - WAGON_W, RAIL_Y - WAGON_H, WAGON_W, WAGON_H)
    ctx.strokeRect(wx - WAGON_W, RAIL_Y - WAGON_H, WAGON_W, WAGON_H)
    ctx.fillStyle = '#3a4a52'
    ctx.fillRect(wx - 108, RAIL_Y - WAGON_H + 11, 32, 18)
    ctx.fillRect(wx - 62, RAIL_Y - WAGON_H + 11, 32, 18)

    ctx.fillStyle = '#141a1d'
    for (const wheelDx of [fx - 34, fx - 106, wx - 30, wx - 92]) {
      ctx.beginPath()
      ctx.arc(wheelDx, RAIL_Y + 2, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    ctx.fillStyle = '#55625c'
    ctx.fillRect(fx - LOCO_W - 8, RAIL_Y - 14, 10, 4)

    ctx.fillStyle = '#c9d4cd'
    ctx.beginPath()
    ctx.arc(fx - 36, roofY + 17, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawFrame(t) {
    const ctx = canvasRef.current.getContext('2d')
    const v = vFracRef.current * LIGHT_SPEED

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    if (t > 0) {
      for (const strikeX of [LEFT_X, RIGHT_X]) {
        ctx.beginPath()
        ctx.arc(strikeX, RAIL_Y - 28, radius(t), 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(111, 205, 151, 0.45)'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.lineWidth = 1
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.fillRect(0, RAIL_Y + 9, VIEW_W, 2)

    drawBolt(ctx, LEFT_X)
    drawBolt(ctx, RIGHT_X)

    const trainCenter = CENTER_X + v * t
    drawTrain(ctx, trainCenter)

    ctx.fillStyle = '#20252a'
    ctx.beginPath()
    ctx.moveTo(CENTER_X - 120, 252)
    ctx.lineTo(CENTER_X + 120, 252)
    ctx.lineTo(CENTER_X + 100, 238)
    ctx.lineTo(CENTER_X - 100, 238)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#c9d4cd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(CENTER_X, 208, 5, 0, Math.PI * 2)
    ctx.moveTo(CENTER_X, 213)
    ctx.lineTo(CENTER_X, 230)
    ctx.moveTo(CENTER_X - 7, 221)
    ctx.lineTo(CENTER_X + 7, 221)
    ctx.moveTo(CENTER_X, 230)
    ctx.lineTo(CENTER_X - 5, 246)
    ctx.moveTo(CENTER_X, 230)
    ctx.lineTo(CENTER_X + 5, 246)
    ctx.stroke()
    ctx.lineWidth = 1

    ctx.fillStyle = '#99a39d'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('человек на платформе', CENTER_X, 192)
    ctx.fillText('пассажир', trainCenter, RAIL_Y - LOCO_H - 22)
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

  function fmtTime(value) {
    return value.toFixed(1).replace('.', ',')
  }

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
