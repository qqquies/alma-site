import { LEVELS } from './buildTest'

const LETTERS = ['А', 'Б', 'В', 'Г']

// Экран проверки черновика. ИИ пишет черновик, но автором остаётся
// учитель: здесь можно поправить формулировку, переставить верный ответ
// или выбросить задание целиком.
function DraftReview({
  draft,
  onChange,
  onConfirm,
  onBack,
  onRegenerate,
  loading,
  meta,
}) {
  const items = draft.items

  function patch(index, changes) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...changes } : item)))
  }

  function remove(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  const ready =
    items.length > 0 &&
    items.every(
      (item) =>
        item.text.trim().length > 0 &&
        item.options.every((option) => option.trim().length > 0),
    )

  const totalPoints = items.reduce((sum, item) => sum + item.points, 0)

  return (
    <section>
      <div className="teacher-bar no-print">
        <button type="button" className="t-btn" onClick={onBack}>
          ← Изменить параметры
        </button>
        <div className="teacher-bar-actions">
          <button
            type="button"
            className="t-btn"
            onClick={onRegenerate}
            disabled={loading}
          >
            {loading ? 'Генерирую…' : 'Другой черновик'}
          </button>
          <button
            type="button"
            className="t-btn t-btn--primary"
            onClick={onConfirm}
            disabled={!ready || loading}
          >
            К печати
          </button>
        </div>
      </div>

      <div className="draft-head no-print">
        <h1 className="page-title">Проверка черновика</h1>
        <p className="teacher-intro">
          Это черновик, а не готовая работа. Прочитайте формулировки,
          отметьте верный ответ в каждом задании и удалите то, что не
          подходит. Только после этого нажмите «К печати».
        </p>
        <p className="draft-summary">
          {meta.subjectTitle} · {meta.grade ? `${meta.grade} класс` : 'класс не указан'} ·{' '}
          {meta.topicTitle}
          <br />
          Заданий: {items.length} · Баллов: {totalPoints}
        </p>
        {draft.warnings.map((warning) => (
          <p className="draft-note" key={warning}>
            {warning}
          </p>
        ))}
      </div>

      <div className="draft-list no-print">
        {items.map((item, index) => (
          <article className="draft-card" key={index}>
            <div className="draft-card-head">
              <span className="draft-num">{index + 1}</span>
              <span className={`draft-level draft-level--${item.level}`}>
                {LEVELS[item.level].label} · {item.points} б.
              </span>
              {item.needsCheck && (
                <span className="draft-warn">проверить ответ</span>
              )}
              <button
                type="button"
                className="draft-remove"
                onClick={() => remove(index)}
              >
                Удалить
              </button>
            </div>

            <textarea
              className="draft-text"
              value={item.text}
              rows={2}
              onChange={(event) => patch(index, { text: event.target.value })}
            />

            <div className="draft-options">
              {item.options.map((option, optionIndex) => (
                <div
                  className={`draft-option${
                    item.correctIndex === optionIndex
                      ? ' draft-option--correct'
                      : ''
                  }`}
                  key={optionIndex}
                >
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={item.correctIndex === optionIndex}
                    onChange={() => patch(index, { correctIndex: optionIndex })}
                    aria-label={`Верный ответ: ${LETTERS[optionIndex]}`}
                  />
                  <span className="draft-letter">{LETTERS[optionIndex]}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(event) => {
                      const options = [...item.options]
                      options[optionIndex] = event.target.value
                      patch(index, { options })
                    }}
                  />
                </div>
              ))}
            </div>

            <input
              className="draft-explanation"
              type="text"
              value={item.explanation}
              placeholder="Пояснение к ответу (печатается в ключе)"
              onChange={(event) =>
                patch(index, { explanation: event.target.value })
              }
            />
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="teacher-error no-print">
          Все задания удалены. Вернитесь назад и сгенерируйте черновик заново.
        </p>
      )}
    </section>
  )
}

export default DraftReview
