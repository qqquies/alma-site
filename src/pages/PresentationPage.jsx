import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  Bot,
  BrainCircuit,
  Download,
  FileText,
  PencilRuler,
  Presentation,
  Send,
  UserRound,
} from 'lucide-react'
import TeacherTabs from '../components/TeacherTabs'
import { findSubjectById } from '../teacher/subjects'
import { getGradesForSubject, getTopicsForGrade } from '../teacher/curriculum'
import {
  getGradeForSubject,
  loadProfile,
  rememberGrade,
  updateProfile,
} from '../teacher/profile'
import { generatePresentation, isMockMode } from '../teacher/ai'
import { downloadPresentation } from '../teacher/presentation'
import PresentationReview from '../teacher/PresentationReview'
import {
  loadPresentationWork,
  savePresentationWork,
} from '../lib/lastWork'
import './TeacherPage.css'
import './PresentationChat.css'
import './PresentationPage.css'

const DEFAULT_SETTINGS = {
  subjectId: 'algebra',
  customSubject: '',
  topic: '',
  count: 8,
  grade: '8',
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min))
}

function loadSettings(saved, subject, grade) {
  const base = {
    ...DEFAULT_SETTINGS,
    subjectId: subject.id,
    customSubject:
      subject.id === 'custom' ? loadProfile().customSubject || '' : '',
    grade,
  }

  if (!saved || saved.subjectId !== subject.id) return base

  return {
    ...base,
    ...saved,
    subjectId: subject.id,
    count:
      saved.count === undefined || saved.count === null
        ? base.count
        : clamp(saved.count, 4, 12),
    grade: saved.grade || grade,
    topic: typeof saved.topic === 'string' ? saved.topic : '',
  }
}

// Разбираем свободный запрос учителя: тему, класс и число слайдов.
// Если тема в кавычках — берём её целиком. Иначе аккуратно убираем
// служебные слова вроде «сделай презентацию по теме».
function parsePrompt(raw, fallbackGrade, fallbackCount) {
  const text = raw.trim()
  const gradeMatch = /(\d{1,2})\s*(?:класс[а-яё]*|кл\.?)/i.exec(text)
  const countMatch = /(\d{1,2})\s*слайд[а-яё]*/i.exec(text)
  const quoted = /[«"„]([^»"“]+)[»"“]/.exec(text)

  let topic = quoted ? quoted[1] : text

  if (!quoted) {
    topic = topic
      .replace(/^(?:пожалуйста[,\s]+)?(?:сделай|создай|подготовь|сгенерируй)\s+(?:мне\s+)?/i, '')
      .replace(/^(?:мне\s+)?(?:нужна|нужен|нужно)\s+/i, '')
      .replace(/^презентаци[а-яё]*\s*/i, '')
      .replace(/^(?:по\s+теме|на\s+тему|про|об|о)\s+/i, '')
      .replace(/\s+(?:для\s+)?\d{1,2}\s*(?:класс[а-яё]*|кл\.?)/gi, ' ')
      .replace(/\s+(?:на\s+)?\d{1,2}\s*слайд[а-яё]*/gi, ' ')
      .replace(/[.,;:!?]+$/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  topic = topic.replace(/^[\s,;:—–-]+|[\s,;:—–-]+$/g, '').slice(0, 120)

  if (/^(?:по\s+теме|на\s+тему|про|о|об|тема|урок|презентаци[а-яё]*)$/i.test(topic)) {
    topic = ''
  }

  return {
    topic,
    grade: gradeMatch?.[1] || fallbackGrade,
    count: countMatch ? Number(countMatch[1]) : fallbackCount,
  }
}

function promptFor(topic, grade, count) {
  return `Сделай презентацию по теме «${topic}»${
    grade ? ` для ${grade} класса` : ''
  }, ${count} слайдов.`
}

function greeting(subjectTitle) {
  return {
    id: 'greeting',
    role: 'ai',
    text: `Здравствуйте! Я Llama 3.3 70B — модель, которая помогает Alma. Напишите тему по предмету «${subjectTitle}» и класс: я соберу структуру слайдов и отдам готовый .pptx. Перед скачиванием презентацию можно проверить и поправить.`,
  }
}

function restoredMessages(restored) {
  const topic = restored.settings?.topic || 'Тема урока'
  const grade = restored.settings?.grade || ''
  const slides = restored.draft.slides

  return [
    {
      id: 'restored-teacher',
      role: 'teacher',
      text: promptFor(topic, grade, slides.length),
    },
    {
      id: 'restored-ai',
      role: 'ai',
      text: `Ваша презентация по теме «${topic}» готова.`,
      slides,
      warnings: restored.draft.warnings || [],
      topic,
      grade,
    },
  ]
}

function fileName(subjectTitle, topic) {
  const base = `Alma-${subjectTitle}-${topic}`
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

  return `${base || 'Alma-prezentaciya'}.pptx`
}

let messageCounter = 0

function nextMessageId(prefix) {
  messageCounter += 1
  return `${prefix}-${Date.now()}-${messageCounter}`
}

function PresentationPage() {
  const { subjectId } = useParams()
  const subject = findSubjectById(subjectId)

  if (!subject) {
    return <Navigate to="/teacher" replace />
  }

  return <PresentationChat subject={subject} />
}

function PresentationChat({ subject }) {
  const [initial] = useState(() => {
    const profile = loadProfile()
    const grade = getGradeForSubject(profile, subject)
    const saved = loadPresentationWork()
    const restored =
      saved?.settings?.subjectId === subject.id ? saved : null

    return {
      grade,
      restored,
      settings: loadSettings(restored?.settings, subject, grade),
    }
  })

  const [settings, setSettings] = useState(initial.settings)
  const [messages, setMessages] = useState(() => {
    if (!initial.restored) {
      return [greeting(
        subject.id === 'custom'
          ? initial.settings.customSubject.trim() || 'Другой предмет'
          : subject.title,
      )]
    }

    return [greeting(
      subject.id === 'custom'
        ? initial.settings.customSubject.trim() || 'Другой предмет'
        : subject.title,
    ), ...restoredMessages(initial.restored)]
  })
  const [active, setActive] = useState(() => {
    if (!initial.restored) return null

    const topic = initial.restored.settings?.topic || 'Тема урока'
    const grade = initial.restored.settings?.grade || initial.grade

    return {
      id: 'restored-ai',
      slides: initial.restored.draft.slides,
      warnings: initial.restored.draft.warnings || [],
      topic,
      grade,
    }
  })
  const [reviewOpen, setReviewOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const logRef = useRef(null)

  const subjectTitle =
    subject.id === 'custom'
      ? settings.customSubject.trim() || 'Другой предмет'
      : subject.title

  const gradeOptions = getGradesForSubject(subject.id)
  const topicOptions = getTopicsForGrade(
    subject.id,
    settings.grade,
    'presentation',
  )
  const suggestions =
    topicOptions.length > 0
      ? topicOptions.map((topic) => topic.title)
      : subject.examples

  useEffect(() => {
    if (!active) return

    savePresentationWork({
      settings: {
        subjectId: subject.id,
        customSubject: settings.customSubject,
        topic: active.topic,
        grade: active.grade,
        count: active.slides.length,
      },
      draft: {
        slides: active.slides,
        warnings: active.warnings,
      },
    })
  }, [active, settings.customSubject, subject.id])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, loading, error, reviewOpen])

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function handleGrade(value) {
    update('grade', value)
    rememberGrade(subject.id, value)
  }

  function applySuggestion(title) {
    setPrompt(promptFor(title, settings.grade, settings.count))
    setError('')
  }

  async function downloadSlides(slides, meta) {
    if (downloading) return

    setDownloading(true)
    setError('')

    try {
      await downloadPresentation({
        meta: {
          subjectTitle,
          topicTitle: meta.topic,
          grade: meta.grade,
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

  async function sendPrompt(event) {
    event.preventDefault()
    if (loading) return

    const raw = prompt.trim()
    if (!raw) {
      setError('Напишите тему презентации — например, «Квадратные уравнения».')
      return
    }

    if (subject.id === 'custom' && !settings.customSubject.trim()) {
      setError('Введите название предмета — оно попадёт на титульный слайд.')
      return
    }

    const parsed = parsePrompt(raw, settings.grade, settings.count)

    if (!parsed.topic) {
      setError('В запросе не хватает темы. Например: «Сделай презентацию по теме „Фотосинтез“ для 6 класса».')
      return
    }

    const grade = parsed.grade
    const count = clamp(parsed.count, 4, 12)

    const teacherMessage = {
      id: nextMessageId('teacher'),
      role: 'teacher',
      text: raw,
    }

    setMessages((prev) => [...prev, teacherMessage])
    setPrompt('')
    setSettings((prev) => ({
      ...prev,
      topic: parsed.topic,
      grade,
      count,
    }))
    setError('')
    setLoading(true)

    if (grade !== settings.grade) rememberGrade(subject.id, grade)
    if (subject.id === 'custom') {
      updateProfile({ customSubject: settings.customSubject.trim() })
    }

    try {
      const result = await generatePresentation({
        subject: subjectTitle,
        grade,
        topic: parsed.topic,
        count,
      })

      const aiMessage = {
        id: nextMessageId('ai'),
        role: 'ai',
        text: `Ваша презентация по теме «${parsed.topic}» готова.`,
        slides: result.slides,
        warnings: result.warnings,
        topic: parsed.topic,
        grade,
      }

      setMessages((prev) => [...prev, aiMessage])
      setActive({
        id: aiMessage.id,
        slides: result.slides,
        warnings: result.warnings,
        topic: parsed.topic,
        grade,
      })
      setReviewOpen(false)
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId('error'),
          role: 'ai',
          kind: 'error',
          text: err.message,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function startReview(message) {
    if (!message.slides) return

    setActive({
      id: message.id,
      slides: message.slides,
      warnings: message.warnings || [],
      topic: message.topic,
      grade: message.grade,
    })
    setReviewOpen(true)
    setError('')
    window.scrollTo(0, 0)
  }

  function updateActiveSlides(slides) {
    if (!active) return

    setActive((prev) => (prev ? { ...prev, slides } : prev))
    setMessages((prev) =>
      prev.map((message) =>
        message.id === active.id ? { ...message, slides } : message,
      ),
    )
  }

  async function regenerateActive() {
    if (!active || loading) return

    setLoading(true)
    setError('')

    try {
      const result = await generatePresentation({
        subject: subjectTitle,
        grade: active.grade,
        topic: active.topic,
        count: active.slides.length,
      })

      setActive((prev) =>
        prev
          ? { ...prev, slides: result.slides, warnings: result.warnings }
          : prev,
      )
      setMessages((prev) =>
        prev.map((message) =>
          message.id === active.id
            ? {
                ...message,
                slides: result.slides,
                warnings: result.warnings,
              }
            : message,
        ),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (reviewOpen && active) {
    return (
      <section className="pres-page">
        <TeacherTabs subjectId={subject.id} />
        <PresentationReview
          draft={{ slides: active.slides, warnings: active.warnings }}
          meta={{
            subjectTitle,
            topicTitle: active.topic,
            grade: active.grade,
          }}
          error={error}
          loading={loading}
          downloading={downloading}
          onChange={updateActiveSlides}
          onBack={() => {
            setReviewOpen(false)
            setError('')
            window.scrollTo(0, 0)
          }}
          onRegenerate={regenerateActive}
          onDownload={(slides) => downloadSlides(slides, active)}
        />
      </section>
    )
  }

  return (
    <section className="pres-page">
      <TeacherTabs subjectId={subject.id} />

      <div className="pres-chat-head">
        <span className="kicker">
          <Presentation size={15} aria-hidden="true" />
          {subjectTitle}
        </span>
        <h1 className="page-title">Презентация к уроку</h1>
        <p className="teacher-intro">
          Опишите тему в чате — Llama 3.3 70B соберёт структуру слайдов.
          Проверьте текст, поправьте формулировки и скачайте готовый файл{' '}
          <strong>.pptx</strong>. Модель работает через Cloudflare Workers AI,
          доступ к ней не попадает в браузер.
        </p>
      </div>

      <div className="pres-chat-shell">
        <div className="pres-chat-top">
          <span className="pres-chat-avatar" aria-hidden="true">
            <Bot size={19} />
          </span>
          <div className="pres-chat-person">
            <strong>Llama 3.3 70B</strong>
            <span>ИИ-помощник Alma</span>
          </div>
          <span className="pres-chat-status">на связи</span>
        </div>

        <div
          className="pres-chat-log"
          ref={logRef}
          aria-live="polite"
          aria-label="Переписка с ИИ"
        >
          {messages.map((message) => {
            const isTeacher = message.role === 'teacher'
            const isError = message.kind === 'error'

            return (
              <div
                className={`pres-msg pres-msg--${message.role}`}
                key={message.id}
              >
                <span className="pres-msg-avatar" aria-hidden="true">
                  {isTeacher ? (
                    <UserRound size={16} />
                  ) : isError ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </span>
                <div
                  className={`pres-bubble${
                    isError ? ' pres-bubble--error' : ''
                  }`}
                >
                  {!isTeacher && (
                    <span className="pres-msg-author">
                      {isError ? 'Alma' : 'Llama 3.3 70B'}
                    </span>
                  )}
                  {isTeacher && (
                    <span className="pres-msg-author">Вы</span>
                  )}
                  <p className="pres-msg-text">{message.text}</p>

                  {message.warnings?.map((warning) => (
                    <p className="pres-warning" key={warning}>
                      {warning}
                    </p>
                  ))}

                  {message.slides && (
                    <div className="pres-file">
                      <span className="pres-file-icon" aria-hidden="true">
                        <FileText size={18} />
                      </span>
                      <span className="pres-file-info">
                        <strong>{fileName(subjectTitle, message.topic)}</strong>
                        <span>
                          {message.slides.length}{' '}
                          {message.slides.length === 1 ? 'слайд' : 'слайдов'} ·
                          PPTX
                        </span>
                      </span>
                      <span className="pres-file-actions">
                        <button
                          type="button"
                          className="pres-file-btn pres-file-btn--primary"
                          disabled={downloading}
                          onClick={() => downloadSlides(message.slides, message)}
                        >
                          <Download size={14} aria-hidden="true" />
                          {downloading ? 'Собираю…' : 'Скачать .pptx'}
                        </button>
                        <button
                          type="button"
                          className="pres-file-btn"
                          onClick={() => startReview(message)}
                        >
                          <PencilRuler size={14} aria-hidden="true" />
                          Проверить
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {loading && (
            <div className="pres-msg pres-msg--ai pres-msg--typing">
              <span className="pres-msg-avatar" aria-hidden="true">
                <Bot size={16} />
              </span>
              <div className="pres-bubble">
                <span className="pres-msg-author">Llama 3.3 70B</span>
                <span className="pres-typing" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pres-typing-text">Собираю слайды…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="pres-msg pres-msg--ai">
              <span className="pres-msg-avatar" aria-hidden="true">
                <AlertCircle size={16} />
              </span>
              <div className="pres-bubble pres-bubble--error">
                <span className="pres-msg-author">Alma</span>
                <p className="pres-msg-text">{error}</p>
              </div>
            </div>
          )}
        </div>

        <form className="pres-composer" onSubmit={sendPrompt}>
          <div className="pres-composer-top">
            <label className="pres-composer-field">
              Класс
              <select
                value={settings.grade}
                onChange={(event) => handleGrade(event.target.value)}
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </label>

            <label className="pres-composer-field">
              Слайдов
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

            {subject.id === 'custom' && (
              <label className="pres-composer-field pres-composer-field--wide">
                Предмет
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

            <span className="pres-model-badge">
              <BrainCircuit size={14} aria-hidden="true" />
              Llama 3.3 70B
            </span>
          </div>

          <div className="pres-composer-row">
            <textarea
              value={prompt}
              rows={2}
              placeholder="Например: «Сделай презентацию по теме „Квадратные уравнения“ для 8 класса, 8 слайдов»"
              onChange={(event) => {
                setPrompt(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendPrompt(event)
                }
              }}
            />
            <button
              type="submit"
              className="pres-send"
              disabled={loading}
              aria-label="Отправить запрос"
            >
              <Send size={19} aria-hidden="true" />
              <span>Отправить</span>
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="pres-composer-hints">
              <span>Популярные темы:</span>
              {suggestions.slice(0, 6).map((title) => (
                <button
                  type="button"
                  key={title}
                  className="pres-hint"
                  onClick={() => applySuggestion(title)}
                >
                  {title}
                </button>
              ))}
            </div>
          )}

          <p className="pres-composer-note">
            Enter — отправить, Shift+Enter — новая строка. ИИ присылает
            черновик: проверьте факты и формулировки перед уроком.
            {isMockMode() &&
              ' Сейчас включён демонстрационный режим: структура настоящая, содержание шаблонное.'}
          </p>
        </form>
      </div>
    </section>
  )
}

export default PresentationPage
