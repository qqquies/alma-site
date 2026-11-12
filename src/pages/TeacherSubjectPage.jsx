import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ClipboardList,
  Download,
  FileText,
  Presentation,
} from 'lucide-react'
import { findSubjectById } from '../teacher/subjects'
import { getGradeForSubject, loadProfile } from '../teacher/profile'
import './TeacherPage.css'
import './TeacherSubjectPage.css'

function TeacherSubjectPage() {
  const { subjectId } = useParams()
  const subject = findSubjectById(subjectId)

  if (!subject) {
    return <Navigate to="/teacher" replace />
  }

  const profile = loadProfile()
  const grade = getGradeForSubject(profile, subject)
  const SubjectIcon = subject.icon
  const subjectTitle =
    subject.id === 'custom'
      ? profile.customSubject.trim() || 'Другой предмет'
      : subject.title
  const heading =
    subject.id === 'custom'
      ? `Что подготовим по предмету «${subjectTitle}»?`
      : `Что подготовим по ${subject.inTitle}?`

  return (
    <section className="teacher-subject">
      <Link to="/teacher" className="teacher-subject-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Сменить предмет
      </Link>

      <div className="teacher-subject-head">
        <span className="teacher-subject-icon" aria-hidden="true">
          <SubjectIcon size={30} strokeWidth={1.6} />
        </span>
        <div>
          <span className="kicker">{subjectTitle}</span>
          <h1 className="teacher-subject-title">{heading}</h1>
          <p className="teacher-subject-lead">
            Два инструмента для урока. Класс сейчас — {grade}. Его можно
            поменять внутри: темы и задания подстроятся под выбранный класс.
          </p>
        </div>
      </div>

      <div className="tool-grid">
        <Link to={`/teacher/${subject.id}/tests`} className="tool-card">
          <span className="tool-card-top">
            <span className="tool-card-icon tool-card-icon--test" aria-hidden="true">
              <ClipboardList size={24} />
            </span>
            <span className="tool-card-index">01</span>
          </span>
          <h2>Контрольные работы</h2>
          <p>
            {subject.source === 'bank'
              ? 'Соберите вариант из банка Alma: задания и ответы считаются на устройстве, без интернета.'
              : 'Опишите тему — ИИ предложит черновик. Вы проверите формулировки и ответы, а затем распечатаете работу.'}
          </p>
          <span className="tool-tags">
            <span className="tool-tag">
              <FileText size={13} aria-hidden="true" />
              A4
            </span>
            {subject.source === 'bank' ? (
              <span className="tool-tag">Два варианта</span>
            ) : (
              <span className="tool-tag">Проверка ИИ</span>
            )}
            <span className="tool-tag">Ключ</span>
          </span>
          <span className="tool-open">
            Собрать работу
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </Link>

        <Link
          to={`/teacher/${subject.id}/presentation`}
          className="tool-card tool-card--presentation"
        >
          <span className="tool-card-top">
            <span className="tool-card-icon tool-card-icon--pres" aria-hidden="true">
              <Presentation size={24} />
            </span>
            <span className="tool-card-index">02</span>
          </span>
          <h2>Презентации</h2>
          <p>
            Напишите тему в чате — Llama 3.3 70B соберёт структуру слайдов.
            Проверьте текст и скачайте готовый файл .pptx, который
            открывается в PowerPoint и «Р7-Офис».
          </p>
          <span className="tool-tags">
            <span className="tool-tag">Чат с ИИ</span>
            <span className="tool-tag">Редактор слайдов</span>
            <span className="tool-tag">
              <Download size={13} aria-hidden="true" />
              .pptx
            </span>
          </span>
          <span className="tool-open">
            Открыть чат
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </Link>
      </div>

      <aside className="ai-reason">
        <span className="ai-reason-icon" aria-hidden="true">
          <BrainCircuit size={24} />
        </span>
        <div>
          <h2>Почему Llama 3.3 70B</h2>
          <p>
            Модель работает через Cloudflare Workers AI: отдельный ключ
            не нужен, есть бесплатный дневной лимит, а 70 миллиардов
            параметров хватает для русского текста и структуры урока.
            Ответ всё равно проверяет учитель.
          </p>
          <Link to="/about" className="ai-reason-link">
            Как Alma использует ИИ
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </section>
  )
}

export default TeacherSubjectPage
