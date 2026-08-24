import { Link, NavLink } from 'react-router-dom'
import './Layout.css'

const NAV_ITEMS = [
  { label: 'Главная', to: '/' },
  { label: 'Модули', to: '/modules' },
  { label: 'О проекте', to: '/about' },
]

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            Alma
          </Link>
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="container">
          Школьный научно-практический проект · 2026
        </div>
      </footer>
    </div>
  )
}

export default Layout
