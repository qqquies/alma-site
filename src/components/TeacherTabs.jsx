import { NavLink } from 'react-router-dom'
import './TeacherTabs.css'

const TABS = [
  { to: '/teacher', label: 'Контрольные работы', end: true },
  { to: '/teacher/presentation', label: 'Презентации' },
]

// Переключатель между двумя инструментами учителя.
// end нужен для /teacher, иначе вкладка остаётся активной и на /teacher/presentation.
function TeacherTabs() {
  return (
    <nav className="teacher-tabs no-print" aria-label="Инструменты учителя">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            isActive ? 'teacher-tab teacher-tab--active' : 'teacher-tab'
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default TeacherTabs
