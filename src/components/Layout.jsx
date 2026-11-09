import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'
import ThemeToggle from './ThemeToggle'
import './Layout.css'

const NAV_ITEMS = [
  { label: 'Главная', to: '/', end: true },
  { label: 'Уроки', to: '/modules' },
  { label: 'О проекте', to: '/about' },
]

// Шапка сайта: логотип, основная навигация, тема и заметная
// кнопка учительской. На узких экранах меню собирается в панель.
function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <a href="#content" className="skip-link">
        Перейти к содержанию
      </a>

      <header className="header no-print">
        <div className="container header-inner">
          <Link
            to="/"
            className="logo"
            aria-label="Alma — на главную"
            onClick={() => setMenuOpen(false)}
          >
            <LogoMark size={30} />
            <span className="logo-text">
              <span className="logo-word">Alma</span>
              <span className="logo-tag">школьный помощник</span>
            </span>
          </Link>

          <nav
            className={menuOpen ? 'nav nav--open' : 'nav'}
            aria-label="Основная навигация"
            onClick={() => setMenuOpen(false)}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/teacher"
              className={({ isActive }) =>
                `nav-teacher${isActive ? ' active' : ''}`
              }
            >
              Для учителя
            </NavLink>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <Link to="/teacher" className="teacher-link">
              <span className="teacher-link-dot" aria-hidden="true" />
              Для учителя
            </Link>
            <button
              type="button"
              className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main className="main" id="content">
        {children}
      </main>

      <footer className="footer no-print">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <LogoMark size={24} />
              Alma
            </Link>
            <p>
              Цифровой школьный помощник для учеников и учителей. Понятные
              уроки, честные проверочные и материалы, которые не стыдно
              распечатать.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Навигация в подвале">
            <Link to="/modules">Уроки</Link>
            <Link to="/teacher">Для учителя</Link>
            <Link to="/about">О проекте</Link>
          </nav>

          <p className="footer-note">
            Школьный проект · 2026
            <br />
            Сделано для тех, кому важно понять.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
