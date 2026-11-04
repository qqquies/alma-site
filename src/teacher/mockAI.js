import { LEVELS } from './buildTest'
import { makeRng } from './rng'
import { numericAnswer } from './topics/helpers'

// Демонстрационный набор. Включается только переменной окружения
// VITE_AI_MOCK=1 при локальной разработке — в обычной сборке не работает.
// Нужен, чтобы проверять интерфейс без сервера и без ключа.

function withOptions(rng, correct, distractors) {
  const options = rng.shuffle([correct, ...distractors])
  return { options, correctIndex: options.indexOf(correct) }
}

function algebraPool(rng) {
  const items = []
  const levels = ['basic', 'basic', 'basic', 'advanced', 'advanced', 'high']

  for (let index = 0; index < 24; index += 1) {
    const level = levels[index % levels.length]
    const kind = index % 3

    if (kind === 0) {
      const a = rng.pick([2, 3, 4, 5])
      const x = rng.int(2, 9)
      const b = rng.int(1, 15)
      const c = a * x + b
      const answer = numericAnswer(x, '')

      items.push({
        level,
        text: `Решите уравнение: ${a}x + ${b} = ${c}.`,
        ...withOptions(rng, answer.correct, answer.distractors),
        explanation: `Перенесём ${b} вправо: ${a}x = ${c - b}. Разделим на ${a}: x = ${x}.`,
      })
      continue
    }

    if (kind === 1) {
      const percent = rng.pick([5, 10, 15, 20, 25])
      const base = rng.pick([80, 120, 200, 240, 300, 400])
      const value = (base * percent) / 100
      const answer = numericAnswer(value, '')

      items.push({
        level,
        text: `Найдите ${percent}% от числа ${base}.`,
        ...withOptions(rng, answer.correct, answer.distractors),
        explanation: `${percent}% — это ${percent} : 100. Значит, ${base} · ${percent} : 100 = ${value}.`,
      })
      continue
    }

    const a = rng.pick([2, 3, 4])
    const b = rng.pick([5, 6, 7])
    const correct = `${a + b}x`

    items.push({
      level,
      text: `Приведите подобные слагаемые: ${a}x + ${b}x.`,
      ...withOptions(rng, correct, [
        `${a * b}x`,
        `${a + b}x²`,
        `${b - a}x`,
      ]),
      explanation: `Коэффициенты складываются: ${a} + ${b} = ${a + b}, поэтому получается ${a + b}x.`,
    })
  }

  return items
}

const RUSSIAN = [
  {
    level: 'basic',
    text: 'Выберите слово, в котором ударение падает на первый слог.',
    options: ['торты', 'звонит', 'договор', 'красивее'],
    correctIndex: 0,
    explanation:
      'Правильно: то́рты. В словах звони́т, догово́р и краси́вее ударение падает не на первый слог.',
  },
  {
    level: 'basic',
    text: 'Укажите слово с проверяемой безударной гласной в корне.',
    options: ['вода', 'собака', 'корова', 'молоко'],
    correctIndex: 0,
    explanation:
      'В слове «вода» гласную можно проверить: во́ды. Остальные слова — с непроверяемыми гласными.',
  },
  {
    level: 'basic',
    text: 'В каком слове пишется разделительный твёрдый знак?',
    options: ['объявление', 'обезьяна', 'вьюга', 'семья'],
    correctIndex: 0,
    explanation:
      'Твёрдый знак пишется после приставки перед буквами е, ё, ю, я: объявление. В остальных словах — разделительный мягкий знак внутри корня.',
  },
  {
    level: 'advanced',
    text: 'В каком ряду во всех словах пишется удвоенная согласная «н»?',
    options: [
      'стеклянный, деревянный',
      'ветреный, серебряный',
      'кожаный, юный',
      'гусиный, оловянный',
    ],
    correctIndex: 0,
    explanation:
      'Стеклянный и деревянный — исключения с «нн». В остальных рядах есть слова с одной «н».',
  },
  {
    level: 'advanced',
    text: 'В каком предложении между подлежащим и сказуемым нужно поставить тире?',
    options: [
      'Москва — столица России.',
      'На улице тепло.',
      'Он пришёл домой поздно.',
      'Мы любим читать книги.',
    ],
    correctIndex: 0,
    explanation:
      'Подлежащее и сказуемое выражены существительными в именительном падеже — между ними ставится тире.',
  },
  {
    level: 'high',
    text: 'Укажите словосочетание со связью «согласование».',
    options: [
      'зелёная трава',
      'читать книгу',
      'очень быстро',
      'выйти из дома',
    ],
    correctIndex: 0,
    explanation:
      'При согласовании зависимое слово принимает форму главного: зелёная трава (род, число, падеж совпадают). Остальные примеры — управление и примыкание.',
  },
]

function finalize(items, count) {
  const prepared = items.slice(0, count).map((item) => ({
    ...item,
    points: LEVELS[item.level].points,
    needsCheck: false,
  }))

  const warnings = [
    'Демонстрационный режим без ИИ: показаны заранее заготовленные задания.',
  ]

  if (prepared.length < count) {
    warnings.push(
      `В демо-режиме доступно только ${prepared.length} заданий из ${count}.`,
    )
  }

  return { items: prepared, warnings }
}

export function mockDraft({ subject, count }) {
  const rng = makeRng(Math.floor(Math.random() * 1000000) + 1)

  if (subject === 'Русский язык') return finalize(RUSSIAN, count)

  return finalize(algebraPool(rng), count)
}
