import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  FileText,
  GraduationCap,
  Presentation,
  ShieldCheck,
} from 'lucide-react'
import { SUBJECTS, findSubjectById } from '../teacher/subjects'
import { loadProfile, rememberSubject, updateProfile } from '../teacher/profile'
import './TeacherPage.css'
import './TeacherHomePage.css'

function TeacherHomePage() {
  const navigate = useNavigate()
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState(
    () => loadProfile().customSubject || '',
  )
  const [customError, setCustomError] = useState('')

  function openSubject(subject) {
    if (subject.id === 'custom') {
      setCustomOpen(true)
      setCustomError('')
      return
    }

    rememberSubject(subject.id)
    navigate(`/teacher/${subject.id}`)
  }

  function openCustomSubject(event) {
    event.preventDefault()

    const name = customName.trim()

    if (!name) {
      setCustomError('Напишите название предмета — оно попадёт в работу.')
      return
    }

    updateProfile({
      customSubject: name,
      lastSubjectId: 'custom',
    })
    navigate('/teacher/custom')
  }

  const customSubject = findSubjectById('custom')
  const CustomIcon = customSubject?.icon

  return (
    <section className="teacher-home">
      <div className="teacher-home-head">
        <span className="kicker">
          <GraduationCap size={15} aria-hidden="true" />
          Учительская Alma
        </span>
        <h1 className="teacher-home-title">
          Здравствуйте! Какой предмет вы преподаёте?
        </h1>
        <p className="teacher-home-lead">
          Выберите предмет — откроются контрольные работы и презентации.
          Всё бесплатно, без регистрации и паролей. Выбор запомнится
          в этом браузере.
        </p>
      </div>

      <div className="subject-picker" role="group" aria-label="Выберите предмет">
        {SUBJECTS.map((subject) => {
          const Icon = subject.icon

          return (
            <button
              type="button"
              key={subject.id}
              className={`subject-pick-card${
                subject.id === 'custom' ? ' subject-pick-card--custom' : ''
              }`}
              onClick={() => openSubject(subject)}
            >
              <span className="subject-pick-icon" aria-hidden="true">
                <Icon size={24} strokeWidth={1.7} />
              </span>
              <span className="subject-pick-title">{subject.title}</span>
              <span className="subject-pick-meta">
                {subject.source === 'bank'
                  ? 'Банк Alma'
                  : subject.id === 'custom'
                    ? 'Свободная тема'
                    : 'ИИ-черновик'}
              </span>
              <ChevronRight
                className="subject-pick-arrow"
                size={17}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      {customOpen && (
        <form className="custom-subject-form" onSubmit={openCustomSubject}>
          <span className="custom-subject-icon" aria-hidden="true">
            {CustomIcon && <CustomIcon size={22} />}
          </span>
          <label className="custom-subject-field">
            <span>Как называется предмет?</span>
            <input
              type="text"
              value={customName}
              placeholder="Например, «Биология»"
              autoFocus
              onChange={(event) => {
                setCustomName(event.target.value)
                setCustomError('')
              }}
            />
          </label>
          <div className="custom-subject-actions">
            <button type="submit" className="t-btn t-btn--primary">
              Продолжить
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="t-btn"
              onClick={() => {
                setCustomOpen(false)
                setCustomError('')
              }}
            >
              Отмена
            </button>
          </div>
          {customError && <p className="teacher-error">{customError}</p>}
        </form>
      )}

      <div className="teacher-home-facts">
        <span>
          <FileText size={15} aria-hidden="true" />
          Работы на A4 с ключом
        </span>
        <span>
          <Presentation size={15} aria-hidden="true" />
          Презентации в .pptx
        </span>
        <span>
          <ShieldCheck size={15} aria-hidden="true" />
          ИИ готовит черновик
        </span>
      </div>
    </section>
  )
}

export default TeacherHomePage
