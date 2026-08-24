import { useEffect, useRef, useState } from 'react'
import useAnimationFrame from '../../lib/useAnimationFrame'
import './BallTrainSim.css'

const VIEW_W = 640
const VIEW_H = 240
const GROUND_Y = 190
const TRAIN_W = 230
const TRAIN_H = 62
const TIME_ZOOM = 4

function BallTrainSim() {
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(true)
  const [trainSpeed, setTrainSpeed] = useState(20)
  const [ballSpeed, setBallSpeed] = useState(5)
  const [ballFlying, setBallFlying] = useState(false)

  const trainX = useRef(40)
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
    ballX.current = trainX.current + TRAIN_W - 48
    setBallFlying(true)
  }

  function drawLabel(ctx, text, x, y) {
    ctx.fillStyle = '#99a39d'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }

  function drawFrame() {
    const ctx = canvasRef.current.getContext('2d')

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, VIEW_W, VIEW_H)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.fillRect(0, GROUND_Y + 9, VIEW_W, 2)

    const tx = trainX.current
    const ty = GROUND_Y - TRAIN_H
    ctx.fillStyle = '#223038'
    ctx.fillRect(tx, ty, TRAIN_W, TRAIN_H)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.strokeRect(tx, ty, TRAIN_W, TRAIN_H)
    ctx.fillStyle = '#3a4a52'
    ctx.fillRect(tx + TRAIN_W - 58, ty + 13, 36, 26)
    ctx.fillRect(tx + 16, ty + 13, 150, 26)

    ctx.fillStyle = '#141a1d'
    ctx.strokeStyle = '#55625c'
    for (const wheelDx of [42, TRAIN_W - 42]) {
      ctx.beginPath()
      ctx.arc(tx + wheelDx, GROUND_Y + 2, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    const personX = tx + TRAIN_W - 40
    ctx.strokeStyle = '#c9d4cd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(personX, ty + 16, 5, 0, Math.PI * 2)
    ctx.moveTo(personX, ty + 21)
    ctx.lineTo(personX, GROUND_Y - 8)
    ctx.stroke()
    ctx.lineWidth = 1

    drawLabel(ctx, `поезд: ${trainSpeed} м/с`, tx + TRAIN_W / 2, ty - 12)

    if (ballActive.current) {
      ctx.beginPath()
      ctx.arc(ballX.current, GROUND_Y - 28, 7, 0, Math.PI * 2)
      ctx.fillStyle = '#6fcd97'
      ctx.shadowColor = '#6fcd97'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0
      drawLabel(
        ctx,
        `мяч: ${trainSpeed + ballSpeed} м/с`,
        ballX.current,
        GROUND_Y - 44,
      )
    }
  }

  useAnimationFrame((dt) => {
    const scaledDt = dt * TIME_ZOOM

    trainX.current += trainSpeed * scaledDt
    if (trainX.current > VIEW_W + 80) {
      trainX.current = -TRAIN_W - 80
      if (!ballActive.current) ballX.current = 0
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
        Картина глазами человека на платформе. Анимация ускорена, но все
        соотношения скоростей соблюдены точно.
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
