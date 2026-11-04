import { formatNumber } from '../format'
import { numericAnswer } from './helpers'

// Механика: равномерное движение. Все числа подобраны так,
// чтобы ответ получался целым и красивым.

export default {
  id: 'kinematics',
  title: 'Механика: скорость, путь, время',
  grade: '7',
  generators: [
    {
      id: 'speed',
      level: 'basic',
      build(rng) {
        const t = rng.pick([4, 5, 6, 8, 10, 12])
        const v = rng.pick([5, 6, 8, 10, 12, 15, 20])
        const s = v * t

        return {
          text: `Тело движется равномерно и за ${t} с проходит расстояние ${s} м. Чему равна скорость тела?`,
          ...numericAnswer(v, 'м/с'),
          explanation: `v = s : t = ${s} : ${t} = ${v} м/с.`,
        }
      },
    },
    {
      id: 'distance',
      level: 'basic',
      build(rng) {
        const v = rng.pick([4, 6, 8, 10, 12, 15])
        const t = rng.pick([5, 8, 10, 12, 15, 20])
        const s = v * t

        return {
          text: `Велосипедист едет со скоростью ${v} м/с. Какое расстояние он проедет за ${t} с?`,
          ...numericAnswer(s, 'м'),
          explanation: `s = v · t = ${v} · ${t} = ${s} м.`,
        }
      },
    },
    {
      id: 'time',
      level: 'basic',
      build(rng) {
        const v = rng.pick([4, 5, 8, 10, 12, 15])
        const t = rng.pick([4, 6, 8, 10, 12])
        const s = v * t

        return {
          text: `Расстояние ${s} м тело проходит со скоростью ${v} м/с. Сколько времени это занимает?`,
          ...numericAnswer(t, 'с'),
          explanation: `t = s : v = ${s} : ${v} = ${t} с.`,
        }
      },
    },
    {
      id: 'kmh-to-ms',
      level: 'basic',
      build(rng) {
        const kmh = rng.pick([36, 54, 72, 90, 108])
        const v = kmh / 3.6

        return {
          text: `Скорость автомобиля равна ${kmh} км/ч. Выразите эту скорость в метрах в секунду.`,
          ...numericAnswer(v, 'м/с', [kmh]),
          explanation: `1 км/ч = 1000 м : 3600 с = 1/3,6 м/с, поэтому ${kmh} : 3,6 = ${v} м/с.`,
        }
      },
    },
    {
      id: 'average-speed',
      level: 'advanced',
      build(rng) {
        const [v1, v2] = rng.pick([
          [60, 40],
          [80, 20],
          [30, 20],
          [60, 20],
          [90, 30],
        ])
        const v = (2 * v1 * v2) / (v1 + v2)

        return {
          text: `Первую половину пути автомобиль проехал со скоростью ${v1} км/ч, а вторую — со скоростью ${v2} км/ч. Чему равна средняя скорость на всём пути?`,
          ...numericAnswer(v, 'км/ч', [(v1 + v2) / 2, v1 + v2]),
          explanation: `Средняя скорость — это весь путь, делённый на всё время, а не среднее арифметическое скоростей. Для двух равных участков v = 2·v₁·v₂ : (v₁ + v₂) = 2·${v1}·${v2} : (${v1} + ${v2}) = ${v} км/ч. Среднее арифметическое (${(v1 + v2) / 2} км/ч) — типичная ошибка.`,
        }
      },
    },
    {
      id: 'train-bridge',
      level: 'high',
      build(rng) {
        const [train, bridge, v] = rng.pick([
          [200, 400, 20],
          [100, 500, 20],
          [150, 350, 25],
          [250, 250, 25],
          [100, 300, 20],
          [200, 300, 10],
          [150, 450, 15],
          [100, 200, 15],
        ])
        const t = (train + bridge) / v

        return {
          text: `Поезд длиной ${train} м движется со скоростью ${v} м/с. За какое время он полностью пройдёт мост длиной ${bridge} м?`,
          ...numericAnswer(t, 'с', [bridge / v, train / v]),
          explanation: `Поезд считается прошедшим мост, когда его хвост покинул мост. Значит, пройти нужно длину моста плюс длину самого поезда: (${bridge} + ${train}) : ${v} = ${t} с. Ответ ${formatNumber(bridge / v)} с — это время прохождения только моста, без учёта длины поезда.`,
        }
      },
    },
    {
      id: 'speed-kmh',
      level: 'basic',
      build(rng) {
        const v = rng.pick([40, 50, 60, 70, 80, 90])
        const t = rng.pick([2, 3, 4, 5])
        const s = v * t

        return {
          text: `Поезд движется со скоростью ${v} км/ч. Какой путь он пройдёт за ${t} ч?`,
          ...numericAnswer(s, 'км'),
          explanation: `s = v · t = ${v} · ${t} = ${s} км.`,
        }
      },
    },
    {
      id: 'average-two-parts',
      level: 'advanced',
      build(rng) {
        const [v1, t1, v2, t2] = rng.pick([
          [60, 2, 90, 1],
          [40, 3, 60, 2],
          [50, 2, 80, 3],
          [30, 4, 50, 1],
        ])
        const distance = v1 * t1 + v2 * t2
        const time = t1 + t2
        const v = distance / time

        return {
          text: `Автомобиль ехал ${t1} ч со скоростью ${v1} км/ч, а затем ${t2} ч со скоростью ${v2} км/ч. Чему равна средняя скорость на всём пути?`,
          ...numericAnswer(v, 'км/ч', [(v1 + v2) / 2]),
          explanation: `Весь путь: ${v1}·${t1} + ${v2}·${t2} = ${distance} км. Всё время: ${t1} + ${t2} = ${time} ч. Средняя скорость: ${distance} : ${time} = ${v} км/ч.`,
        }
      },
    },
  ],
}
