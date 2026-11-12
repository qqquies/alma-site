import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Clock3,
  Printer,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import TeacherTabs from '../components/TeacherTabs'
import { buildTest, DIFFICULTIES } from '../teacher/buildTest'
import { getTopicById } from '../teacher/topics'
import { findSubjectById } from '../teacher/subjects'
import {
  getFirstBankTopic,
  getGradesForSubject,
  getTopicsForGrade,
} from '../teacher/curriculum'
import {
  getGradeForSubject,
  loadProfile,
  saveProfile,
} from '../teacher/profile'
import { generateDraft, isMockMode } from '../teacher/ai'
import DraftReview from '../teacher/DraftReview'
import { TestSheet, AnswerKey } from '../teacher/TestSheet'
import { loadWork, saveWork } from '../lib/lastWork'
import './TeacherPage.css'

const DEFAULT_SETTINGS = {
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
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min))
}

function numberOr(value, fallback, min, max) {
  return value === undefined || value === null
    ? fallback
    : clamp(value, min, max)
}

// Настройки последней работы. Если в браузере лежит старая или битая
// запись, недостающие поля берём из значений по умолчанию. Чужие
// настройки не подмешиваем: предмет задаётся адресом страницы.
function loadSettings(saved, subject, grade) {
  const bankTopic = subject.source === 'bank' ? getFirstBankTopic(subject.id, grade) : null
  const availableBankIds = new Set(
    getTopicsForGrade(subject.id, grade)
      .map((topic) => topic.bankId)
      .filter(Boolean),
  )
  const base = {
    ...DEFAULT_SETTINGS,
    subjectId: subject.id,
    topicId: bankTopic?.bankId || 'kinematics',
    count: subject.source === 'bank' ? 10 : 8,
    customSubject:
      subject.id === 'custom' ? loadProfile().customSubject || '' : '',
  }

  if (!saved || saved.subjectId !== subject.id) return base

  return {
    ...base,
    ...saved,
    subjectId: subject.id,
    topicId:
      saved.topicId && availableBankIds.has(saved.topicId)
        ? saved.topicId
        : base.topicId,
    count: numberOr(saved.count, base.count, 5, subject.source === 'bank' ? 20 : 15),
    variantCount: numberOr(saved.variantCount, base.variantCount, 1, 2),
    minutes: numberOr(saved.minutes, base.minutes, 10, 120),
    difficultyId: DIFFICULTIES.some((item) => item.id === saved.difficultyId)
      ? saved.difficultyId
      : base.difficultyId,
  }
}

function summarize(variant) {
  const counts = { basic: 0, advanced: 0, high: 0 }
  variant.items.forEach((item) => {
    counts[item.level] += 1
  })

  const open = variant.items.filter((item) => item.kind === 'open').length
  const openNote = open > 0 ? ` · с кратким ответом ${open}` : ''

  return `Заданий: ${variant.items.length}${openNote} · Баллов: ${variant.totalPoints} · базовых ${counts.basic}, повышенных ${counts.advanced}, высоких ${counts.high}`
}

function TeacherPage() {
  const { subjectId } = useParams()
  const subject = findSubjectById(subjectId)

  if (!subject) {
    return <Navigate to="/teacher" replace />
  }

  return <TeacherWorkbench subject={subject} />
}

function TeacherWorkbench({ subject }) {
  const [initial] = useState(() => {
    const savedWork = loadWork()
    const work =
      savedWork?.settings?.subjectId === subject.id ? savedWork : null
    const savedProfile = loadProfile()
    const profile = work?.profile
      ? {
          ...savedProfile,
          ...work.profile,
          subjectGrades: {
            ...savedProfile.subjectGrades,
            ...(work.profile.subjectGrades || {}),
          },
        }
      : savedProfile

    return { work, profile }
  })

  const [profile, setProfile] = useState(initial.profile)
  const [settings, setSettings] = useState(() =>
    loadSettings(
      initial.work?.settings,
      subject,
      getGradeForSubject(initial.profile, subject),
    ),
  )
  const [test, setTest] = useState(initial.work?.test || null)
  const [draft, setDraft] = useState(initial.work?.draft || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Последняя собранная работа живёт в браузере: учитель может закрыть
  // вкладку и вернуться к печати. Аккаунт и пароль для этого не нужны.
  useEffect(() => {
    saveWork({ settings, profile, test, draft })
  }, [settings, profile, test, draft])

  const SubjectIcon = subject.icon
  const isBank = subject.source === 'bank'
  const topic = getTopicById(settings.topicId)
  const subjectGrade = getGradeForSubject(profile, subject)
  const gradeOptions = getGradesForSubject(subject.id)
  const topicOptions = getTopicsForGrade(subject.id, subjectGrade)

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

  function handleGrade(value) {
    const next = {
      ...profile,
      grade: value,
      subjectGrades: {
        ...profile.subjectGrades,
        [subject.id]: value,
      },
    }

    setProfile(next)
    saveProfile(next)

    // В банке тема привязана к классу. Если выбранная тема в новом
    // классе недоступна, предлагаем первую подходящую.
    if (isBank) {
      const available = getTopicsForGrade(subject.id, value)
      const stillAvailable = available.some(
        (item) => item.bankId === settings.topicId,
      )

      if (!stillAvailable) {
        const first = getFirstBankTopic(subject.id, value)
        update('topicId', first?.bankId || 'mixed')
      }
    }
  }

  function chooseTopic(topicItem) {
    if (isBank) {
      if (topicItem.bankId) update('topicId', topicItem.bankId)
      return
    }

    update('topic', topicItem.title)
  }

  function buildMeta() {
    return {
      school: profile.school,
      teacher: profile.teacher,
      subjectTitle,
      workTitle,
      topicTitle,
      grade: subjectGrade || subject.grade,
      date: new Date().toLocaleDateString('ru-RU'),
      minutes: settings.minutes,
      showAnswerForm: settings.showAnswerForm,
      showSolutions: settings.showSolutions,
    }
  }

  function checkForm() {
    if (!isBank && !settings.topic.trim()) {
      return 'Выберите популярную тему или введите свою — например, «Линейные уравнения».'
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

    // Приватный режим браузера может запрещать localStorage —
    // тогда работа просто не запомнится, но соберётся как обычно.
    saveProfile(profile)

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
    saveProfile(profile)

    try {
      const result = await generateDraft({
        subject: subjectTitle,
        grade: subjectGrade || subject.grade,
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

  // Живая сводка справа от формы: учитель сразу видит,
  // что именно уйдёт в печать.
  const difficultyLabel =
    DIFFICULTIES.find((item) => item.id === settings.difficultyId)?.label || '—'

  if (test) {
    const first = test.variants[0]

    return (
      <section>
        <TeacherTabs subjectId={subject.id} />
        <div className="teacher-bar no-print">
          <button
            type="button"
            className="t-btn"
            onClick={() => {
              setTest(null)
              window.scrollTo(0, 0)
            }}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Изменить параметры
          </button>
          <div className="teacher-bar-actions">
            <button
              type="button"
              className="t-btn"
              onClick={() => (test.source === 'ai' ? runAI() : runBank())}
            >
              <RefreshCw size={15} aria-hidden="true" />
              {test.source === 'ai' ? 'Сгенерировать заново' : 'Другой вариант'}
            </button>
            <button
              type="button"
              className="t-btn t-btn--primary"
              onClick={() => window.print()}
            >
              <Printer size={15} aria-hidden="true" />
              Печать / PDF
            </button>
          </div>
        </div>

        <p className="teacher-hint no-print">
          В диалоге печати выберите принтер «Сохранить как PDF» — получится
          готовый файл для распечатки. Ключ ответов идёт отдельными листами,
          его можно не печатать для учеников. Работа сохранена в этом браузере:
          к ней можно вернуться позже и распечатать заново.
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
        <TeacherTabs subjectId={subject.id} />
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
    <section className="teacher-page">
      <TeacherTabs subjectId={subject.id} />
      <h1 className="page-title">Контрольные работы</h1>
      <p className="teacher-intro">
        <span className="teacher-subject-chip">
          <SubjectIcon size={15} aria-hidden="true" />
          {subjectTitle}
        </span>
        Выберите класс и популярную тему — Alma соберёт вариант с заданиями
        разного уровня, ключом ответов и паспортом работы, который останется
        только распечатать.
      </p>

      <form className="teacher-form" onSubmit={submitForm}>
        <h2 className="teacher-section">Тема контрольной</h2>

        <div className="teacher-field teacher-field--wide">
          <span>Класс</span>
          <div className="grade-chips" role="group" aria-label="Класс">
            {gradeOptions.map((grade) => (
              <button
                type="button"
                key={grade}
                className={`grade-chip${
                  subjectGrade === grade ? ' grade-chip--active' : ''
                }`}
                aria-pressed={subjectGrade === grade}
                onClick={() => handleGrade(grade)}
              >
                {grade} класс
              </button>
            ))}
          </div>
        </div>

        {topicOptions.length > 0 && (
          <div className="topic-picker" role="group" aria-label="Популярные темы">
            {topicOptions.map((topicItem) => {
              const selected = isBank
                ? settings.topicId === topicItem.bankId
                : settings.topic === topicItem.title

              return (
                <button
                  type="button"
                  key={topicItem.id}
                  className={`topic-card${selected ? ' topic-card--active' : ''}`}
                  aria-pressed={selected}
                  onClick={() => chooseTopic(topicItem)}
                >
                  <span className="topic-card-icon" aria-hidden="true">
                    <BookOpen size={16} />
                  </span>
                  <span>{topicItem.title}</span>
                  {topicItem.testsOnly && (
                    <span className="topic-card-note">все темы</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {!isBank && (
          <label className="teacher-field teacher-field--wide topic-custom">
            <span>Своя тема</span>
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

        <p className="subject-source">
          {isBank
            ? 'Банк Alma: задания и ответы считаются на устройстве, без интернета. Темы подобраны под выбранный класс.'
            : 'ИИ-черновик: модель предложит задания по теме, вы проверите формулировки и ответы перед печатью.'}
        </p>

        {topicOptions.length === 0 && !isBank && subject.examples.length > 0 && (
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

        {isBank && settings.count > 8 && settings.topicId !== 'mixed' && (
          <p className="teacher-note">
            Для работы длиннее 8 заданий лучше подойдёт «Сборная работа по всем
            темам»: в одной узкой теме типы задач начнут повторяться.
          </p>
        )}

        {!isBank && (
          <p className="teacher-note">
            ИИ присылает черновик: вы увидите каждое задание, сможете
            поправить формулировку и проверить ответ. В работе будут и
            тестовые задания с вариантами, и задачи с кратким ответом, где
            ученик считает сам. Обычно генерация занимает 15–40 секунд.
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
            {isBank ? (
              <ClipboardList size={16} aria-hidden="true" />
            ) : (
              <Sparkles size={16} aria-hidden="true" />
            )}
            {loading
              ? 'Генерирую черновик…'
              : isBank
                ? 'Собрать работу'
                : 'Сгенерировать черновик'}
          </button>
          <span className="teacher-offline">
            {isBank
              ? 'Генерация идёт на устройстве: работает без интернета, ответы считаются формулами, а не берутся из сети.'
              : 'Модель работает на стороне Cloudflare, доступ к ней не попадает в браузер.'}
          </span>
        </div>
      </form>

      <aside className="teacher-aside no-print" aria-label="Состав работы">
        <div className="teacher-aside-card">
          <span className="teacher-aside-label">Что будет в работе</span>
          <dl className="teacher-aside-list">
            <div>
              <dt>Предмет</dt>
              <dd>{subjectTitle}</dd>
            </div>
            <div>
              <dt>Тема</dt>
              <dd>{topicTitle || 'выберите тему'}</dd>
            </div>
            <div>
              <dt>Класс</dt>
              <dd>{subjectGrade || '—'}</dd>
            </div>
            <div>
              <dt>Заданий</dt>
              <dd>{settings.count}</dd>
            </div>
            <div>
              <dt>Сложность</dt>
              <dd>{difficultyLabel}</dd>
            </div>
            {isBank && (
              <div>
                <dt>Вариантов</dt>
                <dd>{settings.variantCount === 2 ? 'два' : 'один'}</dd>
              </div>
            )}
            <div>
              <dt>Время</dt>
              <dd>{settings.minutes} мин</dd>
            </div>
          </dl>
        </div>

        <div className="teacher-aside-card">
          <span className="teacher-aside-label">В комплекте</span>
          <ul className="teacher-aside-checks">
            <li>Лист с заданиями</li>
            {settings.showKey && <li>Ключ ответов</li>}
            {settings.showKey && settings.showSolutions && (
              <li>Пояснения к заданиям</li>
            )}
            {settings.showAnswerForm && <li>Бланк ответов</li>}
          </ul>
        </div>

        <div className="teacher-aside-card teacher-aside-card--hint">
          <span className="teacher-aside-label">Памятка</span>
          <p>
            <Clock3 size={13} aria-hidden="true" /> В диалоге печати выберите
            «Сохранить как PDF». Ключ и пояснения идут отдельными листами — их
            можно не раздавать ученикам.
          </p>
          <p>
            Последняя работа сохраняется в этом браузере. Закрыли вкладку —
            вернулись и распечатали снова, без повторной сборки.
          </p>
        </div>
      </aside>
    </section>
  )
}

export default TeacherPage
