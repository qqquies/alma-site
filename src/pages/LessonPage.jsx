import { Link, useParams } from 'react-router-dom'
import { getModuleById } from '../modules/registry'
import '../components/lesson/lesson.css'

function LessonPage() {
  const { moduleId, lessonId } = useParams()
  const module = getModuleById(moduleId)
  const lessonMeta = module?.lessons.find((lesson) => lesson.id === lessonId)

  if (!module || !lessonMeta) {
    return (
      <section>
        <h1 className="page-title">Урок не найден</h1>
        <p className="lesson-lead">
          <Link to="/modules">Вернуться к списку модулей</Link>
        </p>
      </section>
    )
  }

  const LessonBody = module.lessonComponents?.[lessonId]

  return (
    <article className="lesson">
      <nav className="breadcrumbs">
        <Link to="/modules">Модули</Link>
        <span> / </span>
        <Link to={`/modules/${module.id}`}>{module.title}</Link>
      </nav>
      <h1 className="page-title">{lessonMeta.title}</h1>

      {LessonBody ? (
        <LessonBody />
      ) : (
        <p className="lesson-lead">Этот урок скоро появится.</p>
      )}
    </article>
  )
}

export default LessonPage
