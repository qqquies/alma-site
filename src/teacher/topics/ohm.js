import { formatNumber } from '../format'
import { numericAnswer } from './helpers'

// Электричество: закон Ома, соединения проводников, мощность.

export default {
  id: 'ohm',
  title: 'Электричество: закон Ома',
  grade: '8',
  generators: [
    {
      id: 'current',
      level: 'basic',
      build(rng) {
        const voltage = rng.pick([6, 12, 24, 36, 48])
        const resistance = rng.pick([2, 3, 4, 6, 12])
        const current = voltage / resistance

        return {
          text: `К проводнику сопротивлением ${resistance} Ом приложено напряжение ${voltage} В. Какова сила тока?`,
          ...numericAnswer(current, 'А'),
          explanation: `I = U : R = ${voltage} : ${resistance} = ${formatNumber(current)} А.`,
        }
      },
    },
    {
      id: 'voltage',
      level: 'basic',
      build(rng) {
        const current = rng.pick([1, 2, 3, 4, 5])
        const resistance = rng.pick([2, 4, 5, 6, 10])
        const voltage = current * resistance

        return {
          text: `Через проводник сопротивлением ${resistance} Ом течёт ток ${current} А. Каково напряжение на проводнике?`,
          ...numericAnswer(voltage, 'В'),
          explanation: `U = I · R = ${current} · ${resistance} = ${voltage} В.`,
        }
      },
    },
    {
      id: 'resistance',
      level: 'basic',
      build(rng) {
        const current = rng.pick([1, 2, 3, 4, 5])
        const resistance = rng.pick([2, 4, 5, 6, 10])
        const voltage = current * resistance

        return {
          text: `При напряжении ${voltage} В сила тока в проводнике равна ${current} А. Чему равно сопротивление?`,
          ...numericAnswer(resistance, 'Ом'),
          explanation: `R = U : I = ${voltage} : ${current} = ${resistance} Ом.`,
        }
      },
    },
    {
      id: 'series',
      level: 'advanced',
      build(rng) {
        const first = rng.pick([2, 4, 6, 8, 10])
        const second = rng.pick([3, 5, 6, 10, 12])
        const total = first + second

        return {
          text: `Два проводника сопротивлениями ${first} Ом и ${second} Ом соединены последовательно. Чему равно общее сопротивление?`,
          ...numericAnswer(total, 'Ом', [(first * second) / (first + second)]),
          explanation: `При последовательном соединении сопротивления складываются: R = ${first} + ${second} = ${total} Ом.`,
        }
      },
    },
    {
      id: 'parallel',
      level: 'high',
      build(rng) {
        const [first, second, total] = rng.pick([
          [6, 3, 2],
          [4, 4, 2],
          [12, 6, 4],
          [10, 15, 6],
          [20, 5, 4],
          [3, 6, 2],
        ])

        return {
          text: `Два проводника сопротивлениями ${first} Ом и ${second} Ом соединены параллельно. Чему равно общее сопротивление участка?`,
          ...numericAnswer(total, 'Ом', [first + second, first * second]),
          explanation: `При параллельном соединении 1/R = 1/R₁ + 1/R₂, откуда R = R₁·R₂ : (R₁ + R₂) = ${first}·${second} : (${first} + ${second}) = ${total} Ом. Обрати внимание: общее сопротивление меньше самого маленького из двух.`,
        }
      },
    },
    {
      id: 'power',
      level: 'high',
      build(rng) {
        const voltage = rng.pick([120, 220, 36])
        const current = rng.pick([1, 2, 5])
        const power = voltage * current

        return {
          text: `Через лампу при напряжении ${voltage} В течёт ток ${current} А. Какую мощность потребляет лампа?`,
          ...numericAnswer(power, 'Вт'),
          explanation: `P = U · I = ${voltage} · ${current} = ${power} Вт.`,
        }
      },
    },
    {
      id: 'charge',
      level: 'basic',
      build(rng) {
        const current = rng.pick([1, 2, 3, 4, 5])
        const time = rng.pick([10, 20, 30, 60])
        const charge = current * time

        return {
          text: `Через проводник течёт ток ${current} А. Какой заряд пройдёт через его сечение за ${time} с?`,
          ...numericAnswer(charge, 'Кл', [current / time]),
          explanation: `q = I · t = ${current} · ${time} = ${charge} Кл.`,
        }
      },
    },
    {
      id: 'series-voltage',
      level: 'advanced',
      build(rng) {
        const current = rng.pick([1, 2, 3])
        const first = rng.pick([2, 4, 5, 6])
        const second = rng.pick([3, 5, 8, 10])
        const voltage = current * (first + second)

        return {
          text: `Два проводника сопротивлениями ${first} Ом и ${second} Ом соединены последовательно. Сила тока в цепи равна ${current} А. Каково общее напряжение на участке?`,
          ...numericAnswer(voltage, 'В', [current * first, current * second]),
          explanation: `Общее сопротивление: ${first} + ${second} = ${first + second} Ом. Тогда U = I·R = ${current} · ${first + second} = ${voltage} В.`,
        }
      },
    },
  ],
}
