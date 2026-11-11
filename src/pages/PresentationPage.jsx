import { useEffect, useState } from 'react'
import TeacherTabs from '../components/TeacherTabs'
import { SUBJECTS, getSubjectById } from '../teacher/subjects'
import { generatePresentation, isMockMode } from '../teacher/ai'
import { downloadPresentation } from '../teacher/presentation'
import PresentationReview from '../teacher/PresentationReview'
import {
  loadPresentationWork,
  savePresentationWork,
} from '../lib/lastWork'
import './TeacherPage.css'
import './PresentationPage.css'

const PROFILE_KEY = 'alma-teacher-profile'

const DEFAULT_SETTINGS = {
  subjectId: 'algebra',
  customSubject: '',
  topic: '',
  count: 8,
  grade: '',
}

function loadGrade() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
    return typeof saved.grade === 'string' ? saved.grade : ''
  } catch {
    return ''
  }
}

function saveGrade(grade) {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...saved, grade }))
  } catch {
    // Приватный режим браузера может запрещать localStorage — не мешаем работе.
  }
}

// Настройки последнего черновика. Если запись старая или битая,
// недостающие поля берём из значений по умолчанию.
function loadSettings(saved) {
  const base = {
    ...DEFAULT_SETTINGS,
    grade: loadGrade() || '8',
  }

  if (!saved || typeof saved !== 'object') return base

  const subject = getSubjectById(saved.subjectId)

  return {
    ...base,
    ...saved,
    subjectId: subject.id,
    count:
      saved.count === undefined || saved.count === null
        ? base.count
        : clamp(saved.count, 4, 12),
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min))
}

function PresentationPage() {
  const [restored] = useState(loadPresentationWork)
  const [settings, setSettings] = useState(() =>
    loadSettings(restored?.settings),
  )
  const [draft, setDraft] = useState(restored?.draft || null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  // Черновик презентации живёт в браузере: можно закрыть страницу,
  // вернуться и скачать .pptx без повторной генерации.
  useEffect(() => {
    savePresentationWork({ settings, draft })
  }, [settings, draft])

  const subject = getSubjectById(settings.subjectId)

  const subjectTitle =
    subject.id === 'custom'
      ? settings.customSubject.trim() || 'Другой предмет'
      : subject.title

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubject(value) {
    const next = getSubjectById(value)
    setSettings((prev) => ({
      ...prev,
      subjectId: value,
      topic: '',
      grade: next.grade || prev.grade,
    }))
    setError('')
  }

  async function runAI() {
    if (loading) return

    if (!settings.topic.trim()) {
      setError('Введите тему презентации — например, «Линейные уравнения».')
      return
    }

    if (subject.id === 'custom' && !settings.customSubject.trim()) {
      setError('Введите название предмета — оно попадёт на титульный слайд.')
      return
    }

    setLoading(true)
    setError('')
    saveGrade(settings.grade)

    try {
      const result = await generatePresentation({
        subject: subjectTitle,
        grade: settings.grade,
        topic: settings.topic.trim(),
        count: clamp(settings.count, 4, 12),
      })

      setDraft(result)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function download(slides) {
    if (downloading) return

    setDownloading(true)
    setError('')

    try {
      await downloadPresentation({
        meta: {
          subjectTitle,
          topicTitle: settings.topic.trim(),
          grade: settings.grade,
          date: new Date().toLocaleDateString('ru-RU'),
        },
        slides,
      })
    } catch {
      setError(
        'Не удалось собрать файл. Проверьте, что браузер разрешает скачивание, и попробуйте ещё раз.',
      )
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section>
      <TeacherTabs />

      {draft ? (
        <PresentationReview
          draft={draft}
          meta={{
            subjectTitle,
            topicTitle: settings.topic.trim(),
            grade: settings.grade,
          }}
          error={error}
          loading={loading}
          downloading={downloading}
          onChange={(slides) => setDraft((prev) => ({ ...prev, slides }))}
          onBack={() => {
            setDraft(null)
            setError('')
            window.scrollTo(0, 0)
          }}
          onRegenerate={runAI}
          onDownload={download}
        />
      ) : (
        <>
          <h1 className="page-title">Презентация к уроку</h1>
          <p className="teacher-intro">
            Alma соберёт черновик презентации по любой теме. Слайды можно
            отредактировать здесь, а затем скачать готовый файл{' '}
            <strong>.pptx</strong> — он откроется в PowerPoint, Keynote или
            «Р7-Офис», и текст в нём останется редактируемым.
          </p>

          <form
            className="teacher-form"
            onSubmit={(event) => {
              event.preventDefault()
              runAI()
            }}
          >
            <h2 className="teacher-section">Предмет</h2>
            <div className="teacher-field teacher-field--wide">
              <span>По какому предмету</span>
              <div className="subject-grid">
                {SUBJECTS.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`subject-chip${
                      settings.subjectId === item.id
                        ? ' subject-chip--active'
                        : ''
                    }`}
                    onClick={() => handleSubject(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="teacher-section">Содержание</h2>
            <div className="teacher-grid">
              {subject.id === 'custom' && (
                <label className="teacher-field">
                  <span>Название предмета</span>
                  <input
                    type="text"
                    value={settings.customSubject}
                    placeholder="Биология"
                    onChange={(event) =>
                      update('customSubject', event.target.value)
                    }
                  />
                </label>
              )}

              <label className="teacher-field teacher-field--wide">
                <span>Тема</span>
                <input
                  type="text"
                  value={settings.topic}
                  placeholder={
                    subject.examples[0]
                      ? `Например, «${subject.examples[0]}»`
                      : 'Например, «Строение клетки»'
                  }
                  onChange={(event) => update('topic', event.target.value)}
                />
              </label>

              <label className="teacher-field">
                <span>Класс</span>
                <input
                  type="text"
                  value={settings.grade}
                  placeholder="8"
                  onChange={(event) => update('grade', event.target.value)}
                />
              </label>

              <label className="teacher-field">
                <span>Слайдов</span>
                <input
                  type="number"
                  min="4"
                  max="12"
                  value={settings.count}
                  onChange={(event) =>
                    update('count', clamp(event.target.value, 4, 12))
                  }
                />
              </label>
            </div>

            {subject.examples.length > 0 && (
              <div className="topic-hints">
                <span>Примеры тем:</span>
                {subject.examples.map((example) => (
                  <button
                    type="button"
                    key={example}
                    className="topic-hint"
                    onClick={() => update('topic', example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}

            <p className="teacher-note">
              ИИ присылает черновик: вы проверите заголовки, пункты и заметки
              перед скачиванием. Обычно генерация занимает 15–40 секунд.
              Черновик сохранится в этом браузере — можно закрыть страницу
              и вернуться к скачиванию позже.
              {isMockMode() &&
                ' Сейчас включён демонстрационный режим: структура настоящая, содержание шаблонное.'}
            </p>

            {error && <p className="teacher-error">{error}</p>}

            <div className="teacher-actions">
              <button
                type="submit"
                className="t-btn t-btn--primary"
                disabled={loading}
              >
                {loading ? 'Генерирую презентацию…' : 'Сгенерировать презентацию'}
              </button>
              <span className="teacher-offline">
                Модель работает на стороне Cloudflare, доступ к ней не попадает в браузер.
              </span>
            </div>
          </form>
        </>
      )}
    </section>
  )
}

export default PresentationPage
