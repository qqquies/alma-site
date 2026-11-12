import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Presentation } from 'lucide-react'
import './TeacherTabs.css'

// Переключатель между двумя инструментами выбранного предмета.
// end нужен для раздела контрольных, иначе вкладка остаётся активной
// и на странице презентаций.
function TeacherTabs({ subjectId }) {
  const tabs = [
    {
      to: `/teacher/${subjectId}/tests`,
      label: 'Контрольные',
      icon: ClipboardList,
      end: true,
    },
    {
      to: `/teacher/${subjectId}/presentation`,
      label: 'Презентации',
      icon: Presentation,
    },
  ]

  return (
    <nav className="teacher-tabs no-print" aria-label="Инструменты учителя">
      {tabs.map((tab) => {
        const Icon = tab.icon

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              isActive ? 'teacher-tab teacher-tab--active' : 'teacher-tab'
            }
          >
            <Icon size={15} aria-hidden="true" />
            {tab.label}
          </NavLink>
        )
      })}

      <Link to="/teacher" className="teacher-tab teacher-tab--back">
        <ArrowLeft size={15} aria-hidden="true" />
        Другой предмет
      </Link>
    </nav>
  )
}

export default TeacherTabs
