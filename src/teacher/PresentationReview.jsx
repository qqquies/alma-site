// Проверка презентации перед скачиванием.
// Как и с контрольной, ИИ присылает черновик: учитель правит текст,
// убирает лишние слайды и только потом собирает .pptx.

function PresentationReview({
  draft,
  meta,
  onChange,
  onBack,
  onRegenerate,
  onDownload,
  error,
  loading,
  downloading,
}) {
  const slides = draft.slides

  function patch(index, changes) {
    onChange(
      slides.map((slide, i) => (i === index ? { ...slide, ...changes } : slide)),
    )
  }

  function remove(index) {
    onChange(slides.filter((_, i) => i !== index))
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= slides.length) return

    const next = [...slides]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    onChange(next)
  }

  function addSlide() {
    onChange([
      ...slides,
      { title: 'Новый слайд', bullets: ['Первый пункт'], note: '' },
    ])
  }

  // Пустые строки в поле пунктов не печатаем, но и не мешаем их набирать.
  function cleanSlides() {
    return slides.map((slide) => ({
      ...slide,
      bullets: slide.bullets.map((bullet) => bullet.trim()).filter(Boolean),
    }))
  }

  const ready = slides.length > 0 && slides.every((s) => s.title.trim().length > 0)

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
            disabled={loading || downloading}
          >
            {loading ? 'Генерирую…' : 'Другой черновик'}
          </button>
          <button
            type="button"
            className="t-btn t-btn--primary"
            onClick={() => onDownload(cleanSlides())}
            disabled={!ready || loading || downloading}
          >
            {downloading ? 'Собираю файл…' : 'Скачать .pptx'}
          </button>
        </div>
      </div>

      <div className="pres-head no-print">
        <h1 className="page-title">Проверка презентации</h1>
        <p className="teacher-intro">
          Слайды останутся редактируемыми в PowerPoint: текст, списки и
          оформление можно менять как обычную презентацию. Проверьте
          формулировки и факты перед скачиванием.
        </p>
        <p className="draft-summary">
          {meta.subjectTitle} ·{' '}
          {meta.grade ? `${meta.grade} класс` : 'класс не указан'} ·{' '}
          {meta.topicTitle}
          <br />
          Слайдов: {slides.length}
        </p>
        {draft.warnings.map((warning) => (
          <p className="draft-note" key={warning}>
            {warning}
          </p>
        ))}
        {error && <p className="teacher-error">{error}</p>}
      </div>

      <div className="pres-preview-grid no-print">
        {slides.map((slide, index) => (
          <article
            className={`pres-preview${
              index === 0 ? ' pres-preview--title' : ''
            }`}
            key={`${index}-${slide.title}`}
          >
            <span className="pres-preview-kicker">
              {index === 0
                ? 'Alma · школьный проект'
                : `${meta.subjectTitle}${
                    meta.grade ? ` · ${meta.grade} класс` : ''
                  }`}
            </span>
            <h3>{slide.title}</h3>
            {index === 0 ? (
              <p className="pres-preview-sub">
                {meta.subjectTitle}
                {meta.grade ? ` · ${meta.grade} класс` : ''}
              </p>
            ) : (
              slide.bullets.filter((bullet) => bullet.trim()).length > 0 && (
                <ul>
                  {slide.bullets
                    .filter((bullet) => bullet.trim())
                    .map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                </ul>
              )
            )}
            <span className="pres-preview-num">{index + 1}</span>
          </article>
        ))}
      </div>

      <div className="draft-list no-print">
        {slides.map((slide, index) => (
          <article className="draft-card pres-card" key={index}>
            <div className="draft-card-head">
              <span className="draft-num">{index + 1}</span>
              <span className="draft-level">
                {slide.bullets.filter((bullet) => bullet.trim()).length} п.
              </span>
              <div className="pres-card-actions">
                <button
                  type="button"
                  className="pres-move"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Выше"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="pres-move"
                  onClick={() => move(index, 1)}
                  disabled={index === slides.length - 1}
                  aria-label="Ниже"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="draft-remove"
                  onClick={() => remove(index)}
                >
                  Удалить
                </button>
              </div>
            </div>

            <input
              className="pres-title-input"
              type="text"
              value={slide.title}
              placeholder="Заголовок слайда"
              onChange={(event) => patch(index, { title: event.target.value })}
            />

            <textarea
              className="draft-text"
              rows={Math.max(3, slide.bullets.length + 1)}
              value={slide.bullets.join('\n')}
              placeholder={
                index === 0
                  ? 'Титульный слайд — пункты можно не заполнять'
                  : 'Один пункт на строку'
              }
              onChange={(event) =>
                patch(index, { bullets: event.target.value.split('\n') })
              }
            />

            <input
              className="draft-explanation"
              type="text"
              value={slide.note}
              placeholder="Заметка для учителя (не видна на слайде)"
              onChange={(event) => patch(index, { note: event.target.value })}
            />
          </article>
        ))}
      </div>

      <div className="teacher-actions no-print">
        <button type="button" className="t-btn" onClick={addSlide}>
          + Добавить слайд
        </button>
      </div>

      {slides.length === 0 && (
        <p className="teacher-error no-print">
          Все слайды удалены. Вернитесь назад и сгенерируйте презентацию заново.
        </p>
      )}
    </section>
  )
}

export default PresentationReview
