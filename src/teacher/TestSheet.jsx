import { gradeScale } from './buildTest'

const LETTERS = ['А', 'Б', 'В', 'Г']

// Один вариант работы — ровно один лист А4 (плюс бланк ответов).
export function TestSheet({ variant, meta, number }) {
  const scale = gradeScale(variant.totalPoints)

  return (
    <article className="sheet">
      <div className="sheet-head">
        <span>{meta.school || '________________________________'}</span>
        <span>{meta.date}</span>
      </div>

      <h1 className="sheet-title">Контрольная работа по физике</h1>
      <p className="sheet-topic">Тема: «{meta.topicTitle}»</p>

      <div className="sheet-row">
        <span>Класс: {meta.grade}</span>
        <span>Учитель: {meta.teacher || '______________________'}</span>
        <span className="sheet-variant">Вариант {number}</span>
      </div>

      <p className="sheet-field">
        Фамилия, имя: __________________________________________
      </p>

      <table className="sheet-passport">
        <tbody>
          <tr>
            <td>Заданий</td>
            <td>{variant.items.length}</td>
            <td>Время</td>
            <td>{meta.minutes} мин</td>
            <td>Максимум</td>
            <td>{variant.totalPoints} б.</td>
          </tr>
        </tbody>
      </table>

      <p className="sheet-scale">
        Шкала оценивания: «5» — от {scale.five} б., «4» — от {scale.four} б.,
        «3» — от {scale.three} б.
      </p>

      <p className="sheet-instruction">
        <strong>Инструкция.</strong> В каждом задании выберите один верный
        ответ. Букву ответа запишите в бланк в конце работы. Задания разного
        уровня оцениваются разным числом баллов.
      </p>

      <ol className="sheet-tasks">
        {variant.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <p className="sheet-task-text">
              {item.text}{' '}
              <span className="sheet-points">({item.points} б.)</span>
            </p>
            <ul className="sheet-options">
              {item.options.map((option, optionIndex) => (
                <li key={optionIndex}>
                  <span className="sheet-letter">{LETTERS[optionIndex]})</span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {meta.showAnswerForm && (
        <div className="sheet-answers">
          <p className="sheet-answers-title">Бланк ответов</p>
          <ol className="sheet-answer-grid">
            {variant.items.map((_, itemIndex) => (
              <li key={itemIndex}>
                <span>{itemIndex + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="sheet-foot">Alma · код варианта {variant.seed}</p>
    </article>
  )
}

// Ключ ответов печатается отдельными листами — чтобы его можно было
// не показывать ученикам.
export function AnswerKey({ test, meta }) {
  return (
    <article className="sheet">
      <h1 className="sheet-title">Ключ ответов</h1>
      <p className="sheet-topic">
        {meta.topicTitle} · {meta.grade} класс
      </p>

      {test.variants.map((variant, variantIndex) => {
        const scale = gradeScale(variant.totalPoints)

        return (
          <div className="key-block" key={variant.seed}>
            <h2>Вариант {variantIndex + 1}</h2>
            <p className="sheet-scale">
              Максимум {variant.totalPoints} б. · «5» — от {scale.five} б.,
              «4» — от {scale.four} б., «3» — от {scale.three} б.
            </p>

            <table className="key-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Ответ</th>
                  <th>Балл</th>
                  {meta.showSolutions && <th>Пояснение</th>}
                </tr>
              </thead>
              <tbody>
                {variant.items.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td>{itemIndex + 1}</td>
                    <td className="key-answer">{LETTERS[item.correctIndex]}</td>
                    <td>{item.points}</td>
                    {meta.showSolutions && <td>{item.explanation}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}

      <p className="sheet-foot">Alma · код варианта {test.seedBase}</p>
    </article>
  )
}
