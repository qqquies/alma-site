import { Link, useParams } from 'react-router-dom'
import { getModuleById } from '../modules/registry'
import './ModulePage.css'

function ModulePage() {
  const { moduleId } = useParams()
  const module = getModuleById(moduleId)

  if (!module) {
    return (
      <section>
        <h1 className="page-title">Модуль не найден</h1>
        <p className="module-description">
          <Link to="/modules">Вернуться к списку модулей</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <Link to="/modules" className="back-link">
        ← Все модули
      </Link>
      <h1 className="page-title">{module.title}</h1>
      <p className="module-description">{module.description}</p>

      <h2 className="lessons-title">Уроки</h2>
      <ol className="lesson-list">
        {module.lessons.map((lesson) => (
          <li key={lesson.id} className="lesson-item">
            <span>{lesson.title}</span>
            <span className="badge">Скоро</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ModulePage
