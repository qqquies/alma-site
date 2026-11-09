import { useEffect, useState } from 'react'

const STORAGE_KEY = 'alma-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage может быть недоступен в приватном режиме.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// Тема хранится в localStorage и применяется к <html data-theme="...">.
// Начальное значение до первой отрисовки выставляет маленький скрипт
// в index.html, чтобы страница не мигала белым.
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ничего страшного: тема просто не запомнится.
    }

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f7f5ef' : '#171a1d')
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme }
}
