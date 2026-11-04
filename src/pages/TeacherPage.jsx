import { useState } from 'react'
import TeacherTabs from '../components/TeacherTabs'
import { buildTest, DIFFICULTIES } from '../teacher/buildTest'
import TOPICS, { getTopicById } from '../teacher/topics'
import { SUBJECTS, getSubjectById } from '../teacher/subjects'
import { generateDraft, isMockMode } from '../teacher/ai'
import DraftReview from '../teacher/DraftReview'
import { TestSheet, AnswerKey } from '../teacher/TestSheet'
import './TeacherPage.css'

const PROFILE_KEY = 'alma-teacher-profile'

const DEFAULT_PROFILE = {
  school: '',
  teacher: '',
  grade: '7',
}

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
    return { ...DEFAULT_PROFILE, ...saved }
  } catch {
    return DEFAULT_PROFILE
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min))
}

function summarize(variant) {
  const counts = { basic: 0, advanced: 0, high: 0 }
  variant.items.forEach((item) => {
    counts[item.level] += 1
  })

  return `Заданий: ${variant.items.length} · Баллов: ${variant.totalPoints} · базовых ${counts.basic}, повышенных ${counts.advanced}, высоких ${counts.high}`
}

function TeacherPage() {
  const [profile, setProfile] = useState(loadProfile)
  const [settings, setSettings] = useState({
    subjectId: 'physics',
    topicId: 'kinematics',
    customSubject: '',
    topic: '',
    count: 10,
    difficultyId: 'mixed',
    variantCount: 1,
    minutes: 40,
    showKey: true,
    showSolutions: false,
    showAnswerForm: true,
  })
  const [test, setTest] = useState(null)
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subject = getSubjectById(settings.subjectId)
  const isBank = subject.source === 'bank'
  const topic = getTopicById(settings.topicId)

  // Название предмета: у «Другого предмета» его вводит учитель.
  const subjectTitle =
    subject.id === 'custom'
      ? settings.customSubject.trim() || 'Другой предмет'
      : subject.title

  // Заголовок листа. Для известных предметов — «по физике»,
  // для свободного — «по предмету „Биология“».
  const workTitle = subject.inTitle
    ? `Контрольная работа по ${subject.inTitle}`
    : `Контрольная работа по предмету «${subjectTitle}»`

  const topicTitle = isBank ? topic.title : settings.topic.trim()

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function updateProfile(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubject(value) {
    const next = getSubjectById(value)
    setSettings((prev) => ({
      ...prev,
      subjectId: value,
      topic: '',
      count: next.source === 'ai' ? Math.min(prev.count, 15) : prev.count,
    }))
    setError('')
    if (next.grade) updateProfile('grade', next.grade)
  }

  function handleTopic(value) {
    const next = getTopicById(value)
    update('topicId', value)
    if (next.grade) updateProfile('grade', next.grade)
  }

  function buildMeta() {
    return {
      school: profile.school,
      teacher: profile.teacher,
      subjectTitle,
      workTitle,
      topicTitle,
      grade: profile.grade || subject.grade,
      date: new Date().toLocaleDateString('ru-RU'),
      minutes: settings.minutes,
      showAnswerForm: settings.showAnswerForm,
      showSolutions: settings.showSolutions,
    }
  }

  function checkForm() {
    if (!isBank && !settings.topic.trim()) {
      return 'Введите тему работы — например, «Линейные уравнения».'
    }
    if (subject.id === 'custom' && !settings.customSubject.trim()) {
      return 'Введите название предмета — оно попадёт в заголовок работы.'
    }
    return ''
  }

  // Путь 1: банк Alma. Задания и ответы считаются на устройстве.
  function runBank() {
    const count = clamp(settings.count, 5, 20)
    const variantCount = clamp(settings.variantCount, 1, 2)

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))

    const built = buildTest({
      topicId: settings.topicId,
      count,
      difficultyId: settings.difficultyId,
      variantCount,
    })

    setTest({ ...built, source: 'bank' })
    setError('')
    window.scrollTo(0, 0)
  }

  // Путь 2: ИИ. Модель присылает черновик, а не готовую работу:
  // ответы проходят проверку учителем на следующем экране.
  async function runAI() {
    if (loading) return

    const problem = checkForm()
    if (problem) {
      setError(problem)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await generateDraft({
        subject: subjectTitle,
        grade: profile.grade || subject.grade,
        topic: settings.topic.trim(),
        count: clamp(settings.count, 5, 15),
        difficulty: settings.difficultyId,
        verify: true,
      })

      setDraft(result)
      setTest(null)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function submitForm(event) {
    if (event) event.preventDefault()
    if (isBank) runBank()
    else runAI()
  }

  // Учитель проверил черновик — превращаем его в обычный вариант,
  // чтобы печать работала тем же кодом, что и для банка.
  function confirmDraft() {
    if (!draft || draft.items.length === 0) return

    const totalPoints = draft.items.reduce((sum, item) => sum + item.points, 0)
    const seed = Math.floor(Math.random() * 900000) + 100000

    setTest({
      source: 'ai',
      seedBase: seed,
      variants: [{ seed, items: draft.items, totalPoints }],
    })
    setDraft(null)
    window.scrollTo(0, 0)
  }

  const meta = buildMeta()

  if (test) {
    const first = test.variants[0]

    return (
      <section>
        <div className="teacher-bar no-print">
          <button
            type="button"
            className="t-btn"
            onClick={() => {
              setTest(null)
              window.scrollTo(0, 0)
            }}
          >
            ← Изменить параметры
          </button>
          <div className="teacher-bar-actions">
            <button
              type="button"
              className="t-btn"
              onClick={() => (test.source === 'ai' ? runAI() : runBank())}
            >
              {test.source === 'ai' ? 'Сгенерировать заново' : 'Другой вариант'}
            </button>
            <button
              type="button"
              className="t-btn t-btn--primary"
              onClick={() => window.print()}
            >
              Печать / PDF
            </button>
          </div>
        </div>

        <p className="teacher-hint no-print">
          В диалоге печати выберите принтер «Сохранить как PDF» — получится
          готовый файл для распечатки. Ключ ответов идёт отдельными листами,
          его можно не печатать для учеников.
        </p>

        <p className="teacher-summary no-print">{summarize(first)}</p>

        <div className="sheet-scroll">
          {test.variants.map((variant, index) => (
            <TestSheet
              key={variant.seed}
              variant={variant}
              meta={meta}
              number={index + 1}
            />
          ))}
          {settings.showKey && <AnswerKey test={test} meta={meta} />}
        </div>
      </section>
    )
  }

  if (draft) {
    return (
      <>
        {error && <p className="teacher-error no-print">{error}</p>}
        <DraftReview
          draft={draft}
          meta={meta}
          loading={loading}
          onChange={(items) => setDraft((prev) => ({ ...prev, items }))}
          onConfirm={confirmDraft}
          onBack={() => {
            setDraft(null)
            setError('')
            window.scrollTo(0, 0)
          }}
          onRegenerate={runAI}
        />
      </>
    )
  }

  return (
    <section>
      <TeacherTabs />
      <h1 className="page-title">Для учителя</h1>
      <p className="teacher-intro">
        Конструктор контрольных работ. Выберите предмет, тему и сложность —
        Alma соберёт вариант с заданиями разного уровня, ключом ответов и
        паспортом работы, который останется только распечатать.
      </p>

      <form className="teacher-form" onSubmit={submitForm}>
        <h2 className="teacher-section">Предмет</h2>
        <div className="teacher-field teacher-field--wide">
          <span>Что проверяем</span>
          <div className="subject-grid">
            {SUBJECTS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`subject-chip${
                  settings.subjectId === item.id ? ' subject-chip--active' : ''
                }`}
                onClick={() => handleSubject(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <p className="subject-source">
            {isBank
              ? 'Банк Alma: задания и ответы считаются на устройстве. Работает без интернета.'
              : 'Черновик ИИ: модель предложит задания, вы проверите ответы перед печатью.'}
          </p>
        </div>

        <h2 className="teacher-section">Оформление работы</h2>
        <div className="teacher-grid">
          <label className="teacher-field">
            <span>Учебное заведение</span>
            <input
              type="text"
              value={profile.school}
              placeholder="МБОУ «Школа № 1»"
              onChange={(event) => updateProfile('school', event.target.value)}
            />
          </label>
          <label className="teacher-field">
            <span>Учитель</span>
            <input
              type="text"
              value={profile.teacher}
              placeholder="Иванова А. П."
              onChange={(event) => updateProfile('teacher', event.target.value)}
            />
          </label>
          <label className="teacher-field">
            <span>Класс</span>
            <input
              type="text"
              value={profile.grade}
              placeholder="8"
              onChange={(event) => updateProfile('grade', event.target.value)}
            />
          </label>
          <label className="teacher-field">
            <span>Время на работу, мин</span>
            <input
              type="number"
              min="10"
              max="120"
              value={settings.minutes}
              onChange={(event) =>
                update('minutes', clamp(event.target.value, 10, 120))
              }
            />
          </label>
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

          {isBank ? (
            <label className="teacher-field teacher-field--wide">
              <span>Тема</span>
              <select
                value={settings.topicId}
                onChange={(event) => handleTopic(event.target.value)}
              >
                {TOPICS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                    {item.grade ? ` (${item.grade} класс)` : ''}
                  </option>
                ))}
              </select>
            </label>
          ) : (
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
          )}

          <label className="teacher-field">
            <span>Заданий</span>
            <input
              type="number"
              min="5"
              max={isBank ? 20 : 15}
              value={settings.count}
              onChange={(event) =>
                update('count', clamp(event.target.value, 5, isBank ? 20 : 15))
              }
            />
          </label>
          <label className="teacher-field">
            <span>Сложность</span>
            <select
              value={settings.difficultyId}
              onChange={(event) => update('difficultyId', event.target.value)}
            >
              {DIFFICULTIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {isBank && (
            <label className="teacher-field">
              <span>Вариантов</span>
              <select
                value={settings.variantCount}
                onChange={(event) =>
                  update('variantCount', clamp(event.target.value, 1, 2))
                }
              >
                <option value="1">Один</option>
                <option value="2">Два (для соседей по парте)</option>
              </select>
            </label>
          )}
        </div>

        {!isBank && subject.examples.length > 0 && (
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

        {isBank && settings.count > 8 && settings.topicId !== 'mixed' && (
          <p className="teacher-note">
            Для работы длиннее 8 заданий лучше подойдёт «Сборная работа по всем
            темам»: в одной узкой теме типы задач начнут повторяться.
          </p>
        )}

        {!isBank && (
          <p className="teacher-note">
            ИИ присылает черновик: вы увидите каждое задание, сможете
            поправить формулировку и отметить верный ответ. Обычно генерация
            занимает 15–40 секунд.
            {isMockMode() &&
              ' Сейчас включён демонстрационный режим: задания заготовлены заранее.'}
          </p>
        )}

        <div className="teacher-checks">
          <label className="teacher-check">
            <input
              type="checkbox"
              checked={settings.showKey}
              onChange={(event) => update('showKey', event.target.checked)}
            />
            Печатать ключ ответов
          </label>
          <label className="teacher-check">
            <input
              type="checkbox"
              checked={settings.showSolutions}
              onChange={(event) =>
                update('showSolutions', event.target.checked)
              }
            />
            Пояснения в ключе
          </label>
          <label className="teacher-check">
            <input
              type="checkbox"
              checked={settings.showAnswerForm}
              onChange={(event) =>
                update('showAnswerForm', event.target.checked)
              }
            />
            Бланк ответов на листе
          </label>
        </div>

        {error && <p className="teacher-error">{error}</p>}

        <div className="teacher-actions">
          <button
            type="submit"
            className="t-btn t-btn--primary"
            disabled={loading}
          >
            {loading
              ? 'Генерирую черновик…'
              : isBank
                ? 'Собрать работу'
                : 'Сгенерировать черновик'}
          </button>
          <span className="teacher-offline">
            {isBank
              ? 'Генерация идёт на устройстве: работает без интернета, ответы считаются формулами, а не берутся из сети.'
              : 'Ключ модели хранится на сервере Alma и не попадает в браузер.'}
          </span>
        </div>
      </form>
    </section>
  )
}

export default TeacherPage
