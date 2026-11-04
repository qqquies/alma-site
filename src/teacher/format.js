// Числа в русской записи: запятая вместо точки, пробел между тысячами.
// Округляем до трёх знаков — школьных задач с большей точностью не бывает.

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '—'

  const rounded = Math.round(value * 1000) / 1000
  const fixed = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')

  const [intPart, fracPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')

  return fracPart ? `${grouped},${fracPart}` : grouped
}
