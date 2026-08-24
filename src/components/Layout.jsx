import './Layout.css'

const NAV_ITEMS = [
  { label: 'Главная', href: '#' },
  { label: 'Модули', href: '#' },
  { label: 'О проекте', href: '#' },
]

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo">
            Alma
          </a>
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
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
