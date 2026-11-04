import { formatNumber } from '../format'
import { choiceAnswer, numericAnswer } from './helpers'

// Давление твёрдых тел и жидкостей.

export default {
  id: 'pressure',
  title: 'Давление твёрдых тел и жидкостей',
  grade: '7',
  generators: [
    {
      id: 'pressure-force-area',
      level: 'basic',
      build(rng) {
        const force = rng.pick([100, 200, 300, 400, 500, 600, 800])
        const area = rng.pick([0.2, 0.25, 0.5, 1, 2])
        const pressure = force / area

        return {
          text: `На площадь ${formatNumber(area)} м² действует сила ${force} Н. Какое давление создаёт эта сила?`,
          ...numericAnswer(pressure, 'Па'),
          explanation: `p = F : S = ${force} : ${formatNumber(area)} = ${pressure} Па.`,
        }
      },
    },
    {
      id: 'force-from-pressure',
      level: 'basic',
      build(rng) {
        const pressure = rng.pick([200, 400, 500, 1000])
        const area = rng.pick([0.2, 0.5, 1, 2])
        const force = pressure * area

        return {
          text: `Давление равно ${pressure} Па, площадь опоры — ${formatNumber(area)} м². Какая сила действует на эту площадь?`,
          ...numericAnswer(force, 'Н'),
          explanation: `F = p · S = ${pressure} · ${formatNumber(area)} = ${force} Н.`,
        }
      },
    },
    {
      id: 'square-centimeters',
      level: 'advanced',
      build(rng) {
        const [force, areaCm] = rng.pick([
          [600, 100],
          [300, 150],
          [900, 300],
          [600, 150],
          [300, 100],
        ])
        const area = areaCm / 10000
        const pressure = force / area

        return {
          text: `Тело действует на пол с силой ${force} Н. Площадь опоры равна ${areaCm} см². Какое давление оказывает тело?`,
          ...numericAnswer(pressure, 'Па', [force / areaCm]),
          explanation: `Сначала переведём площадь: ${areaCm} см² = ${areaCm} : 10 000 = ${formatNumber(area)} м². Затем p = F : S = ${force} : ${formatNumber(area)} = ${pressure} Па. Ошибка «${force / areaCm} Па» получается, если забыть перевести квадратные сантиметры в квадратные метры.`,
        }
      },
    },
    {
      id: 'liquid-pressure',
      level: 'advanced',
      build(rng) {
        const depth = rng.pick([2, 3, 4, 5, 6, 10])
        const pressure = (1000 * 10 * depth) / 1000

        return {
          text: `Найдите давление воды на глубине ${depth} м. Плотность воды 1000 кг/м³, g = 10 Н/кг. Ответ дайте в килопаскалях.`,
          ...numericAnswer(pressure, 'кПа', [depth]),
          explanation: `p = ρ·g·h = 1000 · 10 · ${depth} = ${pressure * 1000} Па = ${pressure} кПа.`,
        }
      },
    },
    {
      id: 'depth',
      level: 'high',
      build(rng) {
        const pressureKpa = rng.pick([50, 100, 150, 200])
        const depth = pressureKpa / 10

        return {
          text: `На какой глубине в воде давление равно ${pressureKpa} кПа? Плотность воды 1000 кг/м³, g = 10 Н/кг.`,
          ...numericAnswer(depth, 'м'),
          explanation: `Из формулы p = ρ·g·h выразим глубину: h = p : (ρ·g) = ${pressureKpa * 1000} : (1000 · 10) = ${depth} м.`,
        }
      },
    },
    {
      id: 'pressure-mass',
      level: 'basic',
      build(rng) {
        const mass = rng.pick([40, 50, 60, 80, 100])
        const area = rng.pick([0.2, 0.25, 0.5, 1])
        const force = mass * 10
        const pressure = force / area

        return {
          text: `Тело массой ${mass} кг стоит на опоре площадью ${formatNumber(area)} м². Какое давление оно оказывает? g = 10 Н/кг.`,
          ...numericAnswer(pressure, 'Па', [mass / area]),
          explanation: `Сила давления равна весу тела: F = m·g = ${mass} · 10 = ${force} Н. Тогда p = F : S = ${force} : ${formatNumber(area)} = ${pressure} Па.`,
        }
      },
    },
    {
      id: 'pressure-concept',
      level: 'basic',
      build() {
        return {
          text: 'Почему человек на лыжах проваливается в рыхлый снег меньше, чем без лыж?',
          ...choiceAnswer('площадь опоры больше, поэтому давление на снег меньше', [
            'масса человека на лыжах уменьшается',
            'сила давления на снег увеличивается',
            'плотность снега под лыжами уменьшается',
          ]),
          explanation:
            'Сила давления (вес человека) не меняется, но она распределяется по большей площади: p = F : S. Чем больше площадь, тем меньше давление.',
        }
      },
    },
    {
      id: 'pressure-sharp',
      level: 'basic',
      build(rng) {
        const factor = rng.pick([2, 3, 4, 5])

        return {
          text: `Во сколько раз уменьшится давление, если при той же силе площадь опоры увеличить в ${factor} раза?`,
          ...choiceAnswer(`в ${factor} раза`, [
            `в ${factor * factor} раз`,
            'давление не изменится',
            `в ${factor} раза увеличится`,
          ]),
          explanation: `Давление обратно пропорционально площади: p = F : S. Если площадь выросла в ${factor} раза, давление во столько же раз уменьшится.`,
        }
      },
    },
  ],
}
