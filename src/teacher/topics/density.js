import { formatNumber } from '../format'
import { numericAnswer } from './helpers'

// Плотность и масса тела. Плотности взяты реальные, поэтому
// задача "определи вещество" имеет физический смысл.

const MATERIALS = [
  { name: 'алюминий', gen: 'алюминия', rho: 2.7 },
  { name: 'сталь', gen: 'стали', rho: 7.8 },
  { name: 'медь', gen: 'меди', rho: 8.9 },
  { name: 'свинец', gen: 'свинца', rho: 11.3 },
]

export default {
  id: 'density',
  title: 'Плотность вещества',
  grade: '7',
  generators: [
    {
      id: 'rho',
      level: 'basic',
      build(rng) {
        const material = rng.pick(MATERIALS)
        const volume = rng.pick([100, 150, 200, 250, 300, 400, 500])
        const mass = Math.round(material.rho * volume)

        return {
          text: `Тело объёмом ${formatNumber(volume)} см³ имеет массу ${formatNumber(mass)} г. Чему равна плотность вещества?`,
          ...numericAnswer(material.rho, 'г/см³', [volume / mass]),
          explanation: `ρ = m : V = ${formatNumber(mass)} : ${formatNumber(volume)} = ${formatNumber(material.rho)} г/см³.`,
        }
      },
    },
    {
      id: 'mass',
      level: 'basic',
      build(rng) {
        const material = rng.pick(MATERIALS)
        const volume = rng.pick([100, 200, 250, 300, 400])
        const mass = Math.round(material.rho * volume)

        return {
          text: `Плотность вещества равна ${formatNumber(material.rho)} г/см³. Какова масса тела объёмом ${formatNumber(volume)} см³?`,
          ...numericAnswer(mass, 'г', [volume / material.rho]),
          explanation: `m = ρ · V = ${formatNumber(material.rho)} · ${formatNumber(volume)} = ${formatNumber(mass)} г.`,
        }
      },
    },
    {
      id: 'volume',
      level: 'basic',
      build(rng) {
        const material = rng.pick(MATERIALS)
        const volume = rng.pick([100, 200, 250, 300, 500])
        const mass = Math.round(material.rho * volume)

        return {
          text: `Тело массой ${formatNumber(mass)} г сделано из вещества с плотностью ${formatNumber(material.rho)} г/см³. Каков его объём?`,
          ...numericAnswer(volume, 'см³', [mass * material.rho]),
          explanation: `V = m : ρ = ${formatNumber(mass)} : ${formatNumber(material.rho)} = ${formatNumber(volume)} см³.`,
        }
      },
    },
    {
      id: 'identify',
      level: 'advanced',
      build(rng) {
        const material = rng.pick(MATERIALS)
        const volume = rng.pick([100, 150, 200, 250])
        const mass = Math.round(material.rho * volume)
        const others = MATERIALS.filter((item) => item.name !== material.name).map(
          (item) => item.name,
        )

        return {
          text: `Образец объёмом ${formatNumber(volume)} см³ имеет массу ${formatNumber(mass)} г. Какое это вещество? Плотности: алюминий — 2,7 г/см³, сталь — 7,8 г/см³, медь — 8,9 г/см³, свинец — 11,3 г/см³.`,
          correct: material.name,
          distractors: others,
          explanation: `Сначала найдём плотность: ρ = ${formatNumber(mass)} : ${formatNumber(volume)} = ${formatNumber(material.rho)} г/см³. По таблице это ${material.name}.`,
        }
      },
    },
    {
      id: 'hollow',
      level: 'high',
      build(rng) {
        const [rho, mass, outer] = rng.pick([
          [7.8, 780, 150],
          [2.7, 540, 250],
          [2.7, 810, 400],
          [8.9, 890, 200],
          [7.8, 1560, 250],
          [2.7, 1350, 600],
        ])
        const metalVolume = mass / rho
        const cavity = outer - metalVolume

        return {
          text: `Шар объёмом ${formatNumber(outer)} см³ имеет массу ${formatNumber(mass)} г. Он сделан из вещества плотностью ${formatNumber(rho)} г/см³ и имеет внутри полость. Чему равен объём полости?`,
          ...numericAnswer(cavity, 'см³', [outer, metalVolume]),
          explanation: `Объём самого металла: V = m : ρ = ${formatNumber(mass)} : ${formatNumber(rho)} = ${formatNumber(metalVolume)} см³. Полость занимает остальное: ${formatNumber(outer)} − ${formatNumber(metalVolume)} = ${formatNumber(cavity)} см³.`,
        }
      },
    },
    {
      id: 'units',
      level: 'basic',
      build(rng) {
        const [rho, kg] = rng.pick([
          [2.7, 2700],
          [7.8, 7800],
          [8.9, 8900],
          [11.3, 11300],
          [0.8, 800],
        ])

        return {
          text: `Плотность вещества равна ${formatNumber(rho)} г/см³. Выразите её в килограммах на кубический метр.`,
          ...numericAnswer(kg, 'кг/м³', [rho]),
          explanation: `1 г/см³ = 1000 кг/м³, поэтому ${formatNumber(rho)} г/см³ = ${formatNumber(kg)} кг/м³.`,
        }
      },
    },
    {
      id: 'volume-table',
      level: 'advanced',
      build(rng) {
        const material = rng.pick(MATERIALS)
        const volume = rng.pick([100, 200, 250, 300, 400])
        const mass = Math.round(material.rho * volume)

        return {
          text: `Из ${material.gen} изготовлена деталь массой ${formatNumber(mass)} г. Плотность ${material.gen} равна ${formatNumber(material.rho)} г/см³. Каков объём детали?`,
          ...numericAnswer(volume, 'см³', [mass * material.rho]),
          explanation: `V = m : ρ = ${formatNumber(mass)} : ${formatNumber(material.rho)} = ${formatNumber(volume)} см³.`,
        }
      },
    },
  ],
}
