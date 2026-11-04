import { formatNumber } from '../format'
import { numericAnswer } from './helpers'

// Второй закон Ньютона и равнодействующая сила.

export default {
  id: 'newton',
  title: 'Сила и второй закон Ньютона',
  grade: '9',
  generators: [
    {
      id: 'force',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([2, 3, 4, 5, 6, 8, 10])
        const acceleration = rng.pick([2, 3, 4, 5])
        const force = mass * acceleration

        return {
          text: `Тело массой ${mass} кг движется с ускорением ${acceleration} м/с². Какая сила действует на тело?`,
          ...numericAnswer(force, 'Н'),
          explanation: `F = m · a = ${mass} · ${acceleration} = ${force} Н.`,
        }
      },
    },
    {
      id: 'acceleration',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([2, 4, 5, 8, 10])
        const acceleration = rng.pick([2, 3, 4, 5])
        const force = mass * acceleration

        return {
          text: `На тело массой ${mass} кг действует сила ${force} Н. Чему равно ускорение тела?`,
          ...numericAnswer(acceleration, 'м/с²'),
          explanation: `a = F : m = ${force} : ${mass} = ${acceleration} м/с².`,
        }
      },
    },
    {
      id: 'mass',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([2, 3, 4, 5, 6, 8])
        const acceleration = rng.pick([2, 3, 4, 5])
        const force = mass * acceleration

        return {
          text: `Под действием силы ${force} Н тело движется с ускорением ${acceleration} м/с². Какова масса тела?`,
          ...numericAnswer(mass, 'кг'),
          explanation: `m = F : a = ${force} : ${acceleration} = ${mass} кг.`,
        }
      },
    },
    {
      id: 'resultant',
      level: 'advanced',
      build(rng) {
        const mass = rng.pick([2, 4, 5])
        const force1 = rng.pick([10, 12, 15, 20])
        const force2 = rng.pick([4, 6, 8])
        const acceleration = (force1 + force2) / mass

        return {
          text: `На тело массой ${mass} кг действуют две силы ${force1} Н и ${force2} Н, направленные в одну сторону. Чему равно ускорение тела?`,
          ...numericAnswer(acceleration, 'м/с²', [
            Math.abs(force1 - force2) / mass,
            force1 + force2,
          ]),
          explanation: `Силы направлены в одну сторону, значит равнодействующая равна их сумме: R = ${force1} + ${force2} = ${force1 + force2} Н. Тогда a = R : m = ${force1 + force2} : ${mass} = ${formatNumber(acceleration)} м/с².`,
        }
      },
    },
    {
      id: 'speed-after-force',
      level: 'high',
      build(rng) {
        const mass = rng.pick([2, 4, 5, 10])
        const force = rng.pick([10, 12, 20, 25])
        const time = rng.pick([2, 3, 4, 5])
        const acceleration = force / mass
        const speed = acceleration * time

        return {
          text: `Тело массой ${mass} кг покоилось. На него в течение ${time} с действует сила ${force} Н. Какую скорость приобретёт тело?`,
          ...numericAnswer(speed, 'м/с', [force * time, acceleration]),
          explanation: `Сначала найдём ускорение: a = F : m = ${force} : ${mass} = ${formatNumber(acceleration)} м/с². Скорость из состояния покоя: v = a · t = ${formatNumber(acceleration)} · ${time} = ${formatNumber(speed)} м/с.`,
        }
      },
    },
    {
      id: 'weight',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([2, 3, 5, 8, 10, 20])
        const weight = mass * 10

        return {
          text: `Чему равен вес тела массой ${mass} кг? g = 10 Н/кг.`,
          ...numericAnswer(weight, 'Н', [mass]),
          explanation: `P = m · g = ${mass} · 10 = ${weight} Н.`,
        }
      },
    },
  ],
}
