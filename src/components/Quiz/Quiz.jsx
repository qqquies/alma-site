import { useState } from 'react'
import './Quiz.css'

function Quiz({ title, questions }) {
  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState({})
  const [checked, setChecked] = useState({})

  const allChecked = questions.every((question) => checked[question.id])
  const score = questions.filter(
    (question) => checked[question.id] && selected[question.id] === question.correct,
  ).length

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
          Результат: {score} из {questions.length}.
          <button type="button" className="sim-button" onClick={reset}>
            Пройти ещё раз
          </button>
        </div>
      )}
    </section>
  )
}

export default Quiz
