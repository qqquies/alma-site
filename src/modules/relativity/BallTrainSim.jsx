import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './BallTrainSim.css'

const VIEW_W = 640
const VIEW_H = 290
const RAIL_Y = 250
const LOCO_W = 140
const LOCO_H = 44
const WAGON_W = 120
const WAGON_H = 40
const GAP = 10
const TOTAL_LEN = LOCO_W + GAP + WAGON_W
const TIME_ZOOM = 4

function BallTrainSim() {
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(true)
  const [trainSpeed, setTrainSpeed] = useState(20)
  const [ballSpeed, setBallSpeed] = useState(5)
  const [ballFlying, setBallFlying] = useState(false)

  const frontX = useRef(-TOTAL_LEN - 40)
  const ballX = useRef(0)
  const ballActive = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = VIEW_W * dpr
    canvas.height = VIEW_H * dpr
    canvas.getContext('2d').scale(dpr, dpr)
  }, [])

  function handleThrow() {
    if (ballActive.current) return
    ballActive.current = true
    ballX.current = frontX.current - 52
    setBallFlying(true)
  }

  function drawLabel(ctx, text, x, y) {
    ctx.fillStyle = '#99a39d'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }

  function drawTrain(ctx) {
    const fx = frontX.current
    const roofY = RAIL_Y - LOCO_H

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.fillRect(0, RAIL_Y + 9, VIEW_W, 2)

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
    ctx.fillRect(fx - 100, roofY + 9, 36, 18)

    ctx.strokeStyle = '#55625c'
    ctx.beginPath()
    ctx.moveTo(fx - 78, roofY)
    ctx.lineTo(fx - 88, roofY - 14)
    ctx.moveTo(fx - 98, roofY)
    ctx.lineTo(fx - 88, roofY - 14)
    ctx.moveTo(fx - 102, roofY - 14)
    ctx.lineTo(fx - 74, roofY - 14)
    ctx.stroke()

    const wx = fx - LOCO_W - GAP
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

  function drawFrame() {
    const ctx = canvasRef.current.getContext('2d')

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    drawTrain(ctx)

    ctx.fillStyle = '#20252a'
    ctx.fillRect(40, 138, 180, 14)
    ctx.fillStyle = '#181f24'
    ctx.fillRect(52, 152, 10, 96)
    ctx.fillRect(196, 152, 10, 96)

    ctx.strokeStyle = '#c9d4cd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(130, 112, 5, 0, Math.PI * 2)
    ctx.moveTo(130, 117)
    ctx.lineTo(130, 134)
    ctx.stroke()
    ctx.lineWidth = 1

    drawLabel(ctx, 'человек на платформе', 130, 94)

    if (ballActive.current) {
      ctx.beginPath()
      ctx.arc(ballX.current, RAIL_Y - 56, 7, 0, Math.PI * 2)
      ctx.fillStyle = '#6fcd97'
      ctx.shadowColor = '#6fcd97'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0
      drawLabel(
        ctx,
        `мяч: ${trainSpeed + ballSpeed} м/с`,
        Math.min(ballX.current, VIEW_W - 60),
        RAIL_Y - 74,
      )
    }
  }

  useAnimationFrame((dt) => {
    const scaledDt = dt * TIME_ZOOM

    frontX.current += trainSpeed * scaledDt
    if (frontX.current - TOTAL_LEN > VIEW_W + 60) {
      frontX.current = -60
    }

    if (ballActive.current) {
      ballX.current += (trainSpeed + ballSpeed) * scaledDt
      if (ballX.current > VIEW_W + 30) {
        ballActive.current = false
        setBallFlying(false)
      }
    }

    drawFrame()
  }, running)

  const fmt = (value) => String(value).replace('.', ',')

  return (
    <figure className="sim bt">
      <div className="sim-title">
        Картина глазами человека на платформе (он наверху, на возвышении).
        Анимация ускорена, но соотношения скоростей соблюдены точно.
      </div>
      <canvas ref={canvasRef} />
      <div className="sim-controls">
        <button
          type="button"
          className="sim-button"
          onClick={handleThrow}
          disabled={!running || ballFlying}
        >
          Бросить мяч
        </button>
        <button type="button" className="sim-button" onClick={() => setRunning(!running)}>
          {running ? 'Пауза' : 'Продолжить'}
        </button>
      </div>
      <div className="bt-sliders">
        <div className="sim-slider">
          <label htmlFor="train-speed">Скорость поезда: {trainSpeed} м/с</label>
          <input
            id="train-speed"
            type="range"
            min="5"
            max="40"
            step="5"
            value={trainSpeed}
            onChange={(event) => setTrainSpeed(parseInt(event.target.value, 10))}
          />
        </div>
        <div className="sim-slider">
          <label htmlFor="ball-speed">
            Скорость мяча в вагоне: {ballSpeed} м/с
          </label>
          <input
            id="ball-speed"
            type="range"
            min="2"
            max="15"
            step="1"
            value={ballSpeed}
            onChange={(event) => setBallSpeed(parseInt(event.target.value, 10))}
          />
        </div>
      </div>
      <p className="bt-result">
        Для человека на платформе мяч летит со скоростью{' '}
        <strong>{fmt(trainSpeed + ballSpeed)} м/с</strong> — это сумма двух
        скоростей.
      </p>
    </figure>
  )
}

export default BallTrainSim
