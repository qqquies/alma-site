import { LEVELS } from './buildTest'

// Клиент серверного посредника. Доступ к модели живёт ТОЛЬКО на сервере:
// в браузер он не попадает никогда.
const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || '/api/generate.php'
const MOCK = import.meta.env.VITE_AI_MOCK === '1'

// Модель может думать дольше, чем обычный запрос. Даём ей минуту
// с небольшим запасом, но не держим ученика у бесконечного спиннера.
const REQUEST_TIMEOUT = 75000

// Заготовки для локальной проверки интерфейса подгружаются отдельным
// модулем и только при VITE_AI_MOCK=1. В обычной сборке эта ветка
// вырезается, поэтому демонстрационные задания не попадают в бандл.
async function loadMock() {
  return import('./mockAI')
}

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
    const answer = String(raw?.answer ?? '')
      .trim()
      .replace(/^ответ\s*[:：]\s*/i, '')
      .replace(/\s+/g, ' ')
      .slice(0, 120)

    const wantsOpen =
      raw?.kind === 'open' ||
      (raw?.kind !== 'choice' && !Array.isArray(raw?.options) && answer.length > 0)

    if (wantsOpen) {
      if (text.length === 0 || answer.length === 0) return

      items.push({
        kind: 'open',
        text,
        answer,
        explanation,
        level,
        points: LEVELS[level].points,
        needsCheck: raw?.check === 'mismatch',
      })
      return
    }

    const valid =
      text.length > 0 &&
      options.length === 4 &&
      new Set(options).size === 4 &&
      Number.isInteger(correctIndex) &&
      correctIndex >= 0 &&
      correctIndex <= 3

    if (!valid) return

    items.push({
      kind: 'choice',
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

// Один общий запрос к генератору: таймаут, понятные ошибки и разбор ответа.
// Так и задания, и презентации ведут себя одинаково.
async function postToAI(body, fallbackMessage) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  function request() {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  }

  let response

  try {
    try {
      response = await request()
    } catch (error) {
      if (error.name === 'AbortError') throw error

      // Сетевая ошибка часто оказывается случайной: DNS, Wi-Fi или
      // кратковременный сбой прокси. Одна быстрая повторная попытка
      // спасает урок, но не превращается в бесконечный спиннер.
      response = await request()
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Генерация заняла больше минуты. Попробуйте ещё раз или соберите работу из банка Alma.',
      )
    }

    throw new Error(fallbackMessage)
  } finally {
    clearTimeout(timer)
  }

  const data = await response.json().catch(() => null)

  if (response.status === 404) {
    throw new Error(
      'ИИ-генератор не подключён к этой сборке. Соберите работу из банка Alma.',
    )
  }

  if (response.status === 429) {
    throw new Error(
      data?.error ||
        'Лимит генераций исчерпан. Попробуйте позже или соберите работу из банка Alma.',
    )
  }

  if (!response.ok || !data) {
    throw new Error(data?.error || fallbackMessage)
  }

  if (data.error) throw new Error(data.error)

  return data
}

export async function generateDraft(params) {
  if (MOCK) {
    const { mockDraft } = await loadMock()
    return mockDraft(params)
  }

  const data = await postToAI(
    params,
    'Не удалось связаться с сервером генерации. Проверьте интернет и попробуйте ещё раз — или соберите работу из банка Alma.',
  )

  const result = normalize(data)
  if (result.items.length === 0) {
    throw new Error('Модель не вернула ни одного корректного задания. Попробуйте ещё раз.')
  }

  return result
}

// ---------- Презентации ----------

// Слайд считается корректным, если у него есть заголовок, а пункты —
// непустые строки. Всё остальное отбрасываем до показа учителю.
function normalizePresentation(payload) {
  const rawSlides = Array.isArray(payload?.slides) ? payload.slides : []
  const warnings = []
  const slides = []

  rawSlides.forEach((raw) => {
    const title = String(raw?.title ?? '').trim()
    const bullets = Array.isArray(raw?.bullets)
      ? raw.bullets
          .map((bullet) => String(bullet).trim())
          .filter((bullet) => bullet.length > 0)
          .slice(0, 6)
      : []
    const note = String(raw?.note ?? '').trim()

    if (title.length === 0) return

    slides.push({ title, bullets, note })
  })

  const dropped = rawSlides.length - slides.length
  if (dropped > 0) {
    warnings.push(
      `Отброшено слайдов с пустым заголовком: ${dropped}. Попробуйте сгенерировать ещё раз.`,
    )
  }

  return { slides, warnings }
}

export async function generatePresentation(params) {
  if (MOCK) {
    const { mockPresentation } = await loadMock()
    return mockPresentation(params)
  }

  const data = await postToAI(
    { ...params, kind: 'presentation' },
    'Не удалось связаться с сервером генерации презентации. Попробуйте ещё раз.',
  )

  const result = normalizePresentation(data)
  if (result.slides.length === 0) {
    throw new Error('Модель не вернула ни одного корректного слайда. Попробуйте ещё раз.')
  }

  return result
}
