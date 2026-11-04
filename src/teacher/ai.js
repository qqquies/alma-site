import { LEVELS } from './buildTest'
import { mockDraft } from './mockAI'

// Клиент серверного посредника. Ключ модели живёт ТОЛЬКО на сервере:
// в браузер он не попадает никогда.
const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || '/api/generate.php'
const MOCK = import.meta.env.VITE_AI_MOCK === '1'

export function isMockMode() {
  return MOCK
}

// Приводим ответ модели к тому же виду, что и задания банка.
// Всё, что не прошло проверку формата, отбрасываем — лучше меньше
// заданий, чем битая вёрстка в напечатанной работе.
function normalize(payload) {
  const rawItems = Array.isArray(payload?.items) ? payload.items : []
  const warnings = []
  const items = []

  rawItems.forEach((raw) => {
    const text = String(raw?.text ?? '').trim()
    const options = Array.isArray(raw?.options)
      ? raw.options.map((option) => String(option).trim())
      : []
    const correctIndex = Number(raw?.correctIndex)
    const explanation = String(raw?.explanation ?? '').trim()
    const level = LEVELS[raw?.level] ? raw.level : 'basic'

    const valid =
      text.length > 0 &&
      options.length === 4 &&
      new Set(options).size === 4 &&
      Number.isInteger(correctIndex) &&
      correctIndex >= 0 &&
      correctIndex <= 3

    if (!valid) return

    items.push({
      text,
      options,
      correctIndex,
      explanation,
      level,
      points: LEVELS[level].points,
      needsCheck: raw?.check === 'mismatch',
    })
  })

  const dropped = rawItems.length - items.length
  if (dropped > 0) {
    warnings.push(
      `Отброшено заданий с некорректным форматом: ${dropped}. Попробуйте сгенерировать ещё раз.`,
    )
  }

  const mismatched = items.filter((item) => item.needsCheck).length
  if (mismatched > 0) {
    warnings.push(
      `${mismatched} заданий не прошли самопроверку — они отмечены и требуют вашего внимания.`,
    )
  }

  return { items, warnings }
}

export async function generateDraft(params) {
  if (MOCK) return mockDraft(params)

  let response

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
  } catch {
    throw new Error(
      'Сервер генерации недоступен. Проверьте интернет или соберите работу из банка Alma.',
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok || !data) {
    throw new Error(
      data?.error ||
        'Сервер не смог собрать черновик. Попробуйте позже или используйте банк Alma.',
    )
  }

  if (data.error) throw new Error(data.error)

  const result = normalize(data)
  if (result.items.length === 0) {
    throw new Error('Модель не вернула ни одного корректного задания. Попробуйте ещё раз.')
  }

  return result
}
