import { Link, useParams } from 'react-router-dom'
import { getModuleById } from '../modules/registry'
import { isLessonDone } from '../lib/progress'
import Quiz from '../components/Quiz/Quiz'
import '../components/lesson/lesson.css'

function ModuleExamPage() {
  const { moduleId } = useParams()
  const module = getModuleById(moduleId)

  if (!module || !module.exam) {
    return (
      <section>
        <h1 className="page-title">Контрольная не найдена</h1>
        <p className="module-description">
          <Link to="/modules">Вернуться к списку модулей</Link>
        </p>
      </section>
    )
  }

  const doneLessons = module.lessons.filter((lesson) =>
    isLessonDone(module.id, lesson.id),
  )
  const unlocked = doneLessons.length === module.lessons.length

  return (
    <section className="lesson">
      <nav className="breadcrumbs">
        <Link to="/modules">Модули</Link>
        <span> / </span>
        <Link to={`/modules/${module.id}`}>{module.title}</Link>
      </nav>
      <h1 className="page-title">Итоговая контрольная</h1>

      {!unlocked ? (
        <div className="exam-locked">
          <p>
            Контрольная откроется, когда будут пройдены все уроки модуля.
            Прогресс: {doneLessons.length} из {module.lessons.length}.
          </p>
          <ul>
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                {isLessonDone(module.id, lesson.id) ? '✓ ' : '— '}
                <Link to={`/modules/${module.id}/${lesson.id}`}>
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p className="lesson-lead">
            Все уроки модуля пройдены. Впереди контрольная из{' '}
            {module.exam.questions.length} вопросов по всему материалу — от
            Ньютоновского сложения скоростей до E = mc². За результат
            ставится оценка: от «5» за 90% и выше до «2», если стоит
            вернуться к урокам.
          </p>
          <Quiz
            title="Итоговая контрольная модуля"
            questions={module.exam.questions}
            graded
          />
        </>
      )}
    </section>
  )
}

export default ModuleExamPage
