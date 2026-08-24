import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './LightClockSim.css'

const VIEW_W = 420
const VIEW_H = 320
const MIRROR_TOP = 70
const MIRROR_BOTTOM = 250
const MIRROR_HALF_W = 60
const CLOCK_X = VIEW_W / 2
const PHOTON_SPEED = 260
const PHOTON_R = 6

function LightClockSim() {
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(true)
  const [reflections, setReflections] = useState(0)

  const photonY = useRef(MIRROR_TOP)
  const direction = useRef(1)
  const countRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = VIEW_W * dpr
    canvas.height = VIEW_H * dpr
    canvas.getContext('2d').scale(dpr, dpr)
  }, [])

  function drawFrame() {
    const ctx = canvasRef.current.getContext('2d')

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    ctx.fillStyle = '#8fa39a'
    ctx.fillRect(CLOCK_X - MIRROR_HALF_W, MIRROR_TOP - 3, MIRROR_HALF_W * 2, 6)
    ctx.fillRect(CLOCK_X - MIRROR_HALF_W, MIRROR_BOTTOM - 3, MIRROR_HALF_W * 2, 6)

    ctx.beginPath()
    ctx.arc(CLOCK_X, photonY.current, PHOTON_R, 0, Math.PI * 2)
    ctx.fillStyle = '#6fcd97'
    ctx.shadowColor = '#6fcd97'
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.shadowBlur = 0
  }

  useAnimationFrame((dt) => {
    photonY.current += direction.current * PHOTON_SPEED * dt

    if (photonY.current >= MIRROR_BOTTOM) {
      photonY.current = MIRROR_BOTTOM
      direction.current = -1
      countRef.current += 1
      setReflections(countRef.current)
    } else if (photonY.current <= MIRROR_TOP) {
      photonY.current = MIRROR_TOP
      direction.current = 1
      countRef.current += 1
      setReflections(countRef.current)
    }

    drawFrame()
  }, running)

  return (
    <figure className="sim">
      <div className="sim-title">Часы в системе отсчёта наблюдателя</div>
      <canvas ref={canvasRef} />
      <div className="sim-controls">
        <button type="button" className="sim-button" onClick={() => setRunning(!running)}>
          {running ? 'Пауза' : 'Продолжить'}
        </button>
        <span className="sim-counter">Отражений: {reflections}</span>
      </div>
      <figcaption className="sim-note">
        Модель схематична: размеры и скорость света условны.
      </figcaption>
    </figure>
  )
}

export default LightClockSim
