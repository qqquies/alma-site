import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { markLessonDone } from '../../lib/progress'
import './Quiz.css'

function gradeFor(ratio) {
  if (ratio >= 0.9) return 5
  if (ratio >= 0.75) return 4
  if (ratio >= 0.6) return 3
  return 2
}

const GRADE_MESSAGES = {
  5: 'Отлично! Материал усвоен — можно двигаться дальше.',
  4: 'Хорошо! Загляни в разбор вопросов, где ошиблись, и вперёд.',
  3: 'Удовлетворительно. Материал стоит перечитать — дальше будет опираться на него.',
  2: 'Неудовлетворительно. Пройди урок заново — без этой базы следующие уроки не понять.',
}

function Quiz({ title, questions, graded = false }) {
  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState({})
  const [checked, setChecked] = useState({})
  const location = useLocation()

  const allChecked = questions.every((question) => checked[question.id])
  const score = questions.filter(
    (question) => checked[question.id] && selected[question.id] === question.correct,
  ).length
  const ratio = questions.length > 0 ? score / questions.length : 0

  useEffect(() => {
    if (!allChecked) return
    const match = location.pathname.match(/^\/modules\/([^/]+)\/([^/]+)$/)
    if (match) {
      markLessonDone(match[1], match[2])
    }
  }, [allChecked, location.pathname])

  function choose(questionId, optionIndex) {
    if (checked[questionId]) return
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  function check(questionId) {
    if (selected[questionId] === undefined) return
    setChecked((prev) => ({ ...prev, [questionId]: true }))
  }

  function reset() {
    setSelected({})
    setChecked({})
    setStarted(false)
  }

  if (!started) {
    return (
      <section className="quiz">
        <h2>{title}</h2>
        <div className="quiz-start">
          <p>
            Впереди проверка усвоенного материала. С момента начала текст
            урока будет скрыт до самого конца — отвечай по памяти.
          </p>
          <p className="quiz-start-meta">
            Вопросов: {questions.length}
            {graded ? ' · За результат ставится оценка' : ''}
          </p>
          <button
            type="button"
            className="sim-button"
            onClick={() => setStarted(true)}
          >
            Начать проверку
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="quiz quiz--started">
      <h2>{title}</h2>
      {questions.map((question, index) => {
        const isChecked = Boolean(checked[question.id])
        const chosen = selected[question.id]
        return (
          <div className="quiz-card" key={question.id}>
            <p className="quiz-question">
              {index + 1}. {question.question}
            </p>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => {
                let cls = 'quiz-option'
                if (!isChecked && chosen === optionIndex) cls += ' selected'
                if (isChecked) {
                  if (optionIndex === question.correct) cls += ' correct'
                  else if (chosen === optionIndex) cls += ' wrong'
                  else cls += ' muted'
                }
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    className={cls}
                    disabled={isChecked}
                    onClick={() => choose(question.id, optionIndex)}
                  >
                    <span className="quiz-letter">
                      {String.fromCharCode(1040 + optionIndex)}
                    </span>
                    {option}
                  </button>
                )
              })}
            </div>
            {!isChecked ? (
              <button
                type="button"
                className="sim-button quiz-check"
                disabled={chosen === undefined}
                onClick={() => check(question.id)}
              >
                Проверить
              </button>
            ) : (
              <p
                className={`quiz-explanation${
                  chosen === question.correct ? '' : ' quiz-explanation-warn'
                }`}
              >
                {chosen === question.correct ? 'Верно! ' : 'Неверно. '}
                {question.explanation}
              </p>
            )}
          </div>
        )
      })}
      {allChecked && (
        <div className="quiz-result">
          <span>
            {graded
              ? `Результат: ${score} из ${questions.length}. Оценка: ${gradeFor(ratio)}. ${GRADE_MESSAGES[gradeFor(ratio)]}`
              : `Результат: ${score} из ${questions.length}.`}
          </span>
          <button type="button" className="sim-button" onClick={reset}>
            Пройти ещё раз
          </button>
        </div>
      )}
    </section>
  )
}

export default Quiz
