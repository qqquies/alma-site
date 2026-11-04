import { formatNumber } from '../format'

// Собирает варианты ответа для вычислительной задачи.
// Главный ответ считается формулой, а "неверные" берутся из типичных
// ошибок: забыл разделить, перепутал операцию, не перевёл единицы.
export function numericAnswer(value, unit, extraValues = []) {
  const suffix = unit ? ` ${unit}` : ''
  const correct = `${formatNumber(value)}${suffix}`
  const seen = new Set([formatNumber(value)])
  const distractors = []

  function tryAdd(raw) {
    if (distractors.length >= 3) return
    if (!Number.isFinite(raw) || raw <= 0) return

    const text = formatNumber(raw)
    if (seen.has(text)) return

    seen.add(text)
    distractors.push(`${text}${suffix}`)
  }

  const candidates = [...extraValues, value * 2, value / 2, value * 3, value / 4]
  candidates.forEach(tryAdd)

  return { correct, distractors }
}

// Вариант ответа для качественного вопроса: правильная формулировка
// плюс три правдоподобные ловушки.
export function choiceAnswer(correct, wrong) {
  return { correct, distractors: wrong.slice(0, 3) }
}
