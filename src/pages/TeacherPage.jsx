import { useState } from 'react'
import { buildTest, DIFFICULTIES } from '../teacher/buildTest'
import TOPICS, { getTopicById } from '../teacher/topics'
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
    topicId: 'kinematics',
    count: 10,
    difficultyId: 'mixed',
    variantCount: 1,
    minutes: 40,
    showKey: true,
    showSolutions: false,
    showAnswerForm: true,
  })
  const [test, setTest] = useState(null)

  const topic = getTopicById(settings.topicId)

  function update(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function updateProfile(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  function handleTopic(value) {
    const next = getTopicById(value)
    update('topicId', value)
    if (next.grade) updateProfile('grade', next.grade)
  }

  function generate(event) {
    if (event) event.preventDefault()

    const count = clamp(settings.count, 5, 20)
    const variantCount = clamp(settings.variantCount, 1, 2)

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))

    setTest(
      buildTest({
        topicId: settings.topicId,
        count,
        difficultyId: settings.difficultyId,
        variantCount,
      }),
    )

    window.scrollTo(0, 0)
  }

  const meta = {
    school: profile.school,
    teacher: profile.teacher,
    topicTitle: topic.title,
    grade: profile.grade || topic.grade,
    date: new Date().toLocaleDateString('ru-RU'),
    minutes: settings.minutes,
    showAnswerForm: settings.showAnswerForm,
    showSolutions: settings.showSolutions,
  }

  if (test) {
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
            <button type="button" className="t-btn" onClick={() => generate()}>
              Другой вариант
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

        <p className="teacher-summary no-print">{summarize(test.variants[0])}</p>

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

  return (
    <section>
      <h1 className="page-title">Для учителя</h1>
      <p className="teacher-intro">
        Конструктор контрольных работ. Выберите тему и сложность — Alma соберёт
        вариант с заданиями разного уровня, ключом ответов и паспортом работы,
        который останется только распечатать.
      </p>

      <form className="teacher-form" onSubmit={generate}>
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
          <label className="teacher-field">
            <span>Заданий</span>
            <input
              type="number"
              min="5"
              max="20"
              value={settings.count}
              onChange={(event) =>
                update('count', clamp(event.target.value, 5, 20))
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
        </div>

        {settings.count > 8 && settings.topicId !== 'mixed' && (
          <p className="teacher-note">
            Для работы длиннее 8 заданий лучше подойдёт «Сборная работа по всем
            темам»: в одной узкой теме типы задач начнут повторяться.
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

        <div className="teacher-actions">
          <button type="submit" className="t-btn t-btn--primary">
            Собрать работу
          </button>
          <span className="teacher-offline">
            Генерация идёт на устройстве: работает без интернета, ответы
            считаются формулами, а не берутся из сети.
          </span>
        </div>
      </form>
    </section>
  )
}

export default TeacherPage
