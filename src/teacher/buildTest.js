import { makeRng } from './rng'
import { getTopicById } from './topics'

// Сборка варианта: берём генераторы нужного уровня, следим,
// чтобы задания не повторялись, и перемешиваем варианты ответа.

export const LEVELS = {
  basic: { label: 'Базовый', points: 1 },
  advanced: { label: 'Повышенный', points: 2 },
  high: { label: 'Высокий', points: 3 },
}

export const DIFFICULTIES = [
  { id: 'basic', label: 'Базовый', mix: { basic: 1 } },
  {
    id: 'mixed',
    label: 'Смешанный',
    mix: { basic: 0.5, advanced: 0.35, high: 0.15 },
  },
  {
    id: 'advanced',
    label: 'Повышенный',
    mix: { basic: 0.2, advanced: 0.45, high: 0.35 },
  },
]

const LEVEL_ORDER = ['basic', 'advanced', 'high']

function quotaFor(count, mix) {
  const rows = Object.entries(mix).map(([level, share]) => ({
    level,
    whole: Math.floor(share * count),
    remainder: share * count - Math.floor(share * count),
  }))

  let left = count - rows.reduce((sum, row) => sum + row.whole, 0)
  const byRemainder = [...rows].sort((a, b) => b.remainder - a.remainder)

  let index = 0
  while (left > 0) {
    byRemainder[index % byRemainder.length].whole += 1
    index += 1
    left -= 1
  }

  return Object.fromEntries(rows.map((row) => [row.level, row.whole]))
}

function buildVariant(topic, { count, difficultyId, seed }) {
  const rng = makeRng(seed)
  const difficulty =
    DIFFICULTIES.find((item) => item.id === difficultyId) || DIFFICULTIES[1]
  const quota = quotaFor(count, difficulty.mix)
  const used = new Set()
  const items = []

  LEVEL_ORDER.forEach((level) => {
    const need = quota[level] || 0
    if (need === 0) return

    let pool = topic.generators.filter((generator) => generator.level === level)
    if (pool.length === 0) pool = topic.generators

    let order = rng.shuffle(pool)
    let cursor = 0

    for (let i = 0; i < need; i += 1) {
      let draft = null

      for (let attempt = 0; attempt < 40; attempt += 1) {
        if (cursor >= order.length) {
          cursor = 0
          order = rng.shuffle(pool)
        }

        const generator = order[cursor]
        cursor += 1
        const candidate = generator.build(rng)

        if (
          candidate &&
          candidate.distractors.length === 3 &&
          !used.has(candidate.text)
        ) {
          draft = candidate
          break
        }
      }

      if (!draft) return

      used.add(draft.text)
      const options = rng.shuffle([draft.correct, ...draft.distractors])

      items.push({
        level,
        points: LEVELS[level].points,
        text: draft.text,
        options,
        correctIndex: options.indexOf(draft.correct),
        explanation: draft.explanation,
      })
    }
  })

  // Если заданий выбранного уровня не хватило (например, учитель просит
  // 20 задач по узкой теме), добираем из остальных уровней.
  if (items.length < count) {
    let guard = 0

    while (items.length < count && guard < 500) {
      guard += 1
      const generator = rng.pick(topic.generators)
      const candidate = generator.build(rng)

      if (
        !candidate ||
        candidate.distractors.length !== 3 ||
        used.has(candidate.text)
      ) {
        continue
      }

      used.add(candidate.text)
      const options = rng.shuffle([candidate.correct, ...candidate.distractors])

      items.push({
        level: generator.level,
        points: LEVELS[generator.level].points,
        text: candidate.text,
        options,
        correctIndex: options.indexOf(candidate.correct),
        explanation: candidate.explanation,
      })
    }
  }

  // Сохраняем порядок «от простого к сложному».
  items.sort(
    (first, second) =>
      LEVEL_ORDER.indexOf(first.level) - LEVEL_ORDER.indexOf(second.level),
  )

  const totalPoints = items.reduce((sum, item) => sum + item.points, 0)

  return { seed, items, totalPoints }
}

export function buildTest({
  topicId,
  count = 10,
  difficultyId = 'mixed',
  variantCount = 1,
  seedBase,
}) {
  const topic = getTopicById(topicId)
  const base = (seedBase ?? Math.floor(Math.random() * 900000) + 100000) >>> 0

  const variants = Array.from({ length: variantCount }, (_, index) =>
    buildVariant(topic, {
      count,
      difficultyId,
      seed: (base + index * 7919) >>> 0,
    }),
  )

  return { topic, seedBase: base, variants }
}

// Пороги оценок. Считаем от максимального балла, а не от числа
// заданий: задания разного уровня весят по-разному.
export function gradeScale(totalPoints) {
  return {
    five: Math.ceil(totalPoints * 0.85),
    four: Math.ceil(totalPoints * 0.7),
    three: Math.ceil(totalPoints * 0.5),
  }
}
