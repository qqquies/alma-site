import { numericAnswer } from './helpers'

// Механическая работа, мощность и КПД.

export default {
  id: 'work',
  title: 'Работа, мощность, КПД',
  grade: '7',
  generators: [
    {
      id: 'work-force',
      level: 'basic',
      build(rng) {
        const force = rng.pick([20, 40, 50, 60, 80, 100])
        const distance = rng.pick([2, 4, 5, 8, 10, 12])
        const work = force * distance

        return {
          text: `Тело перемещают на ${distance} м, прикладывая силу ${force} Н по направлению движения. Какая работа совершается?`,
          ...numericAnswer(work, 'Дж'),
          explanation: `A = F · s = ${force} · ${distance} = ${work} Дж.`,
        }
      },
    },
    {
      id: 'power',
      level: 'basic',
      build(rng) {
        const work = rng.pick([600, 900, 1200, 1800, 2400])
        const time = rng.pick([10, 20, 30, 60])
        const power = work / time

        return {
          text: `За ${time} с совершена работа ${work} Дж. Чему равна мощность?`,
          ...numericAnswer(power, 'Вт'),
          explanation: `N = A : t = ${work} : ${time} = ${power} Вт.`,
        }
      },
    },
    {
      id: 'work-lifting',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([2, 5, 10, 20, 25])
        const height = rng.pick([2, 4, 5, 8, 10])
        const work = mass * 10 * height

        return {
          text: `Груз массой ${mass} кг поднимают на высоту ${height} м. Какая работа совершается? g = 10 Н/кг.`,
          ...numericAnswer(work, 'Дж'),
          explanation: `A = m·g·h = ${mass} · 10 · ${height} = ${work} Дж.`,
        }
      },
    },
    {
      id: 'power-minutes',
      level: 'advanced',
      build(rng) {
        const work = rng.pick([12000, 18000, 24000, 36000])
        const minutes = rng.pick([2, 5, 10])
        const power = work / (minutes * 60)

        return {
          text: `Двигатель совершает работу ${work} Дж за ${minutes} мин. Какова его мощность?`,
          ...numericAnswer(power, 'Вт', [work / minutes]),
          explanation: `Переведём время в секунды: ${minutes} мин = ${minutes * 60} с. Тогда N = ${work} : ${minutes * 60} = ${power} Вт. Ответ ${work / minutes} Вт получается, если забыть перевести минуты в секунды.`,
        }
      },
    },
    {
      id: 'efficiency',
      level: 'high',
      build(rng) {
        const [mass, height, spent, efficiency] = rng.pick([
          [200, 10, 25000, 80],
          [100, 5, 6250, 80],
          [400, 5, 40000, 50],
          [50, 8, 8000, 50],
          [300, 10, 40000, 75],
        ])
        const useful = mass * 10 * height

        return {
          text: `Подъёмный кран поднимает груз массой ${mass} кг на высоту ${height} м, затрачивая ${spent} Дж энергии. Каков КПД крана? g = 10 Н/кг.`,
          ...numericAnswer(efficiency, '%', [useful / 1000, spent / useful * 100]),
          explanation: `Полезная работа: A₁ = m·g·h = ${mass} · 10 · ${height} = ${useful} Дж. КПД = A₁ : A₂ · 100% = ${useful} : ${spent} · 100% = ${efficiency}%.`,
        }
      },
    },
    {
      id: 'power-force-speed',
      level: 'basic',
      build(rng) {
        const force = rng.pick([20, 40, 50, 60, 100])
        const speed = rng.pick([2, 3, 4, 5])
        const power = force * speed

        return {
          text: `Тело движется со скоростью ${speed} м/с под действием силы ${force} Н, направленной по движению. Какую мощность развивает эта сила?`,
          ...numericAnswer(power, 'Вт'),
          explanation: `N = F · v = ${force} · ${speed} = ${power} Вт.`,
        }
      },
    },
    {
      id: 'time-from-power',
      level: 'advanced',
      build(rng) {
        const work = rng.pick([6000, 9000, 12000, 18000])
        const power = rng.pick([100, 150, 200, 300])
        const time = work / power

        return {
          text: `Двигатель мощностью ${power} Вт должен совершить работу ${work} Дж. Сколько времени ему для этого потребуется?`,
          ...numericAnswer(time, 'с', [work * power]),
          explanation: `Из формулы N = A : t выразим время: t = A : N = ${work} : ${power} = ${time} с.`,
        }
      },
    },
  ],
}
