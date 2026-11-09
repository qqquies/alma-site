import { Link, useParams } from 'react-router-dom'
import { getModuleById } from '../modules/registry'
import { isLessonDone } from '../lib/progress'
import LightClockSim from '../modules/relativity/LightClockSim'
import './ModulePage.css'

function ExamPanel({ module, doneCount }) {
  if (!module.exam) {
    return <p className="module-description">Контрольная готовится.</p>
  }

  if (doneCount < module.lessons.length) {
    const left = module.lessons.length - doneCount
    return (
      <p className="module-description">
        Откроется, когда будут пройдены все уроки. Осталось: {left}.
      </p>
    )
  }

  return (
    <Link to={`/modules/${module.id}/exam`} className="btn btn--primary">
      Начать итоговую работу
      <span className="btn__arrow" aria-hidden="true">
        →
      </span>
    </Link>
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

  const doneCount = module.lessons.filter((lesson) =>
    isLessonDone(module.id, lesson.id),
  ).length
  const percent = Math.round((doneCount / module.lessons.length) * 100)

  return (
    <section className="module-page">
      <Link to="/modules" className="back-link">
        ← Все модули
      </Link>

      <header className="module-head">
        <span className="kicker">Модуль 01</span>
        <h1 className="page-title">{module.title}</h1>
        <p className="module-description">{module.description}</p>

        <ul className="module-facts">
          <li>{module.lessons.length} уроков</li>
          {module.exam && <li>Итоговая работа</li>}
          <li>Оценка 2–5</li>
        </ul>

        <div
          className="module-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Прогресс модуля"
        >
          <div className="module-progress-text">
            <span>Прогресс модуля</span>
            <span>
              {doneCount} из {module.lessons.length}
            </span>
          </div>
          <div className="module-progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      </header>

      <div className="module-section-head">
        <h2 className="lessons-title">Уроки</h2>
        <p className="module-section-note">
          Лучше по порядку: каждый урок опирается на предыдущий.
        </p>
      </div>

      <ol className="lesson-list">
        {module.lessons.map((lesson, index) => {
          const isAvailable = Boolean(module.lessonComponents?.[lesson.id])
          const isDone = isAvailable && isLessonDone(module.id, lesson.id)
          const status = isDone ? 'Пройден' : isAvailable ? 'Открыт' : 'Скоро'

          return (
            <li
              key={lesson.id}
              className={`lesson-item${isDone ? ' lesson-item--done' : ''}${
                isAvailable ? '' : ' lesson-item--locked'
              }`}
            >
              <span className="lesson-num">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="lesson-body">
                {isAvailable ? (
                  <Link to={`/modules/${module.id}/${lesson.id}`}>
                    {lesson.title}
                  </Link>
                ) : (
                  <span>{lesson.title}</span>
                )}
              </div>

              <span
                className={`lesson-status${
                  isDone ? ' lesson-status--done' : ''
                }`}
              >
                {status}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="exam-panel">
        <span className="exam-kicker">Итоговая работа</span>
        <h2 className="lessons-title">Проверить себя целиком</h2>
        <p className="module-description">
          Оценка по школьной шкале 2–5. Можно пройти заново и разобрать
          ошибки.
        </p>
        <ExamPanel module={module} doneCount={doneCount} />
      </div>

      {module.id === 'relativity' && (
        <section className="module-sim">
          <h2 className="lessons-title">Попробуйте модель</h2>
          <p className="module-section-note">
            Световые часы показывают, почему время идёт по-разному в двух
            системах отсчёта.
          </p>
          <LightClockSim />
        </section>
      )}
    </section>
  )
}

export default ModulePage
