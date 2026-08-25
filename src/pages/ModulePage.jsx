import { Link, useParams } from 'react-router-dom'
import { getModuleById } from '../modules/registry'
import { isLessonDone } from '../lib/progress'
import LightClockSim from '../modules/relativity/LightClockSim'
import './ModulePage.css'

function ExamPanel({ module }) {
  const doneCount = module.lessons.filter((lesson) =>
    isLessonDone(module.id, lesson.id),
  ).length
  const unlocked =
    module.exam && doneCount === module.lessons.length

  if (!module.exam) {
    return <p className="module-description">Контрольная готовится.</p>
  }

  if (!unlocked) {
    return (
      <p className="module-description">
        Откроется после всех уроков. Пройдено: {doneCount} из{' '}
        {module.lessons.length}.
      </p>
    )
  }

  return (
    <p className="module-description">
      <Link to={`/modules/${module.id}/exam`} className="exam-link">
        Начать итоговую контрольную →
      </Link>
    </p>
  )
}

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
        {module.lessons.map((lesson) => {
          const isAvailable = Boolean(module.lessonComponents?.[lesson.id])
          const isDone = isAvailable && isLessonDone(module.id, lesson.id)
          return (
            <li key={lesson.id} className={`lesson-item${isAvailable ? ' available' : ''}`}>
              {isAvailable ? (
                <Link to={`/modules/${module.id}/${lesson.id}`}>
                  {isDone ? '✓ ' : ''}
                  {lesson.title}
                </Link>
              ) : (
                <span>{lesson.title}</span>
              )}
              <span className="badge">
                {isDone ? 'Пройден' : isAvailable ? 'Открыт' : 'Скоро'}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="exam-panel">
        <h2 className="lessons-title">Итоговая контрольная</h2>
        <ExamPanel module={module} />
      </div>

      {module.id === 'relativity' && (
        <>
          <h2 className="lessons-title">Интерактивная модель (прототип)</h2>
          <LightClockSim />
        </>
      )}
    </section>
  )
}

export default ModulePage
