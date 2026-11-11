// Последняя работа учителя хранится прямо в браузере. Так задумано:
// в школе компьютер закреплён за кабинетом и стоит там годами, а аккаунты
// и пароли только добавляют проблем. Если браузер запрещает localStorage,
// сайт продолжает работать — просто без сохранения.

const WORK_KEY = 'alma-last-work'
const PRESENTATION_KEY = 'alma-last-presentation'

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Переполнение квоты или приватный режим — молча пропускаем.
  }
}

function isChoiceItem(item) {
  return Boolean(
    Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.options.every((option) => typeof option === 'string') &&
      Number.isInteger(item.correctIndex) &&
      item.correctIndex >= 0 &&
      item.correctIndex <= 3 &&
      typeof item.points === 'number' &&
      typeof item.explanation === 'string',
  )
}

function isOpenItem(item) {
  return Boolean(
    item.kind === 'open' &&
      typeof item.answer === 'string' &&
      item.answer.trim().length > 0 &&
      typeof item.points === 'number' &&
      typeof item.explanation === 'string',
  )
}

function isItem(item) {
  return Boolean(
    item &&
      typeof item.text === 'string' &&
      (isChoiceItem(item) || isOpenItem(item)),
  )
}

function isVariant(variant) {
  return Boolean(
    variant &&
      Number.isInteger(variant.seed) &&
      typeof variant.totalPoints === 'number' &&
      Array.isArray(variant.items) &&
      variant.items.length > 0 &&
      variant.items.every(isItem),
  )
}

function isSlide(slide) {
  return Boolean(
    slide &&
      typeof slide.title === 'string' &&
      Array.isArray(slide.bullets) &&
      slide.bullets.every((bullet) => typeof bullet === 'string') &&
      typeof slide.note === 'string',
  )
}

export function loadWork() {
  const saved = read(WORK_KEY)
  if (!saved || typeof saved !== 'object') return null

  const test =
    saved.test &&
    Number.isInteger(saved.test.seedBase) &&
    Array.isArray(saved.test.variants) &&
    saved.test.variants.length > 0 &&
    saved.test.variants.every(isVariant)
      ? saved.test
      : null

  const draft =
    saved.draft &&
    Array.isArray(saved.draft.items) &&
    saved.draft.items.length > 0 &&
    saved.draft.items.every(isItem)
      ? {
          items: saved.draft.items,
          warnings: Array.isArray(saved.draft.warnings)
            ? saved.draft.warnings
            : [],
        }
      : null

  if (!test && !draft) return null

  return {
    settings: saved.settings || null,
    profile: saved.profile || null,
    test,
    draft,
  }
}

export function saveWork({ settings, profile, test, draft }) {
  if (!test && !draft) return

  write(WORK_KEY, {
    settings,
    profile,
    test: test
      ? {
          source: test.source,
          seedBase: test.seedBase,
          variants: test.variants,
        }
      : null,
    draft: draft || null,
  })
}

export function loadPresentationWork() {
  const saved = read(PRESENTATION_KEY)
  if (!saved || typeof saved !== 'object') return null

  const slides = saved.draft?.slides
  if (!Array.isArray(slides) || slides.length === 0) return null
  if (!slides.every(isSlide)) return null

  return {
    settings: saved.settings || null,
    draft: {
      slides,
      warnings: Array.isArray(saved.draft.warnings)
        ? saved.draft.warnings
        : [],
    },
  }
}

export function savePresentationWork({ settings, draft }) {
  if (!draft || !Array.isArray(draft.slides) || draft.slides.length === 0) return
  write(PRESENTATION_KEY, { settings, draft })
}
