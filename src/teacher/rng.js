// Детерминированный генератор случайных чисел (mulberry32).
// Нужен для того, чтобы один и тот же "код варианта" всегда давал
// один и тот же набор заданий: учитель может пересоздать работу.

export function makeRng(seed) {
  let state = (seed >>> 0) || 1

  function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  function int(min, max) {
    return min + Math.floor(next() * (max - min + 1))
  }

  function pick(list) {
    return list[int(0, list.length - 1)]
  }

  function shuffle(list) {
    const result = [...list]
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = int(0, i)
      const temp = result[i]
      result[i] = result[j]
      result[j] = temp
    }
    return result
  }

  return { next, int, pick, shuffle }
}
