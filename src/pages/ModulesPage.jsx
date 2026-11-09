import { Link } from 'react-router-dom'
import MODULES, { STATUS_LABELS } from '../modules/registry'
import Reveal from '../components/Reveal'
import './ModulesPage.css'

function ModulesPage() {
  return (
    <div className="modules-page">
      <Reveal as="section" className="modules-head">
        <span className="kicker">Уроки</span>
        <h1 className="page-title">Начните с одной темы.</h1>
        <p className="section-lead">
          Короткие уроки, интерактивные модели и проверка после каждого шага.
          Материал открывается постепенно — не нужно знать всё заранее.
        </p>
      </Reveal>

      <div className="modules-grid">
        {MODULES.map((module, index) => (
          <Reveal
            as={Link}
            key={module.id}
            to={`/modules/${module.id}`}
            className="module-card"
            delay={index * 80}
          >
            <div className="module-card-top">
              <span className="module-card-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="badge">{STATUS_LABELS[module.status]}</span>
            </div>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <ul className="module-card-meta">
              <li>{module.lessons.length} уроков</li>
              <li>3 модели</li>
              {module.exam && <li>Итоговая работа</li>}
            </ul>
            <span className="module-card-link">
              Открыть модуль
              <span aria-hidden="true">→</span>
            </span>
          </Reveal>
        ))}

        <Reveal as="article" className="module-card module-card--soon" delay={80}>
          <div className="module-card-top">
            <span className="module-card-index">02</span>
            <span className="badge badge--muted">В работе</span>
          </div>
          <h2>Новые темы</h2>
          <p>
            Алгебра, русский язык и другие предметы постепенно появляются
            в уроках. Пока по ним можно собрать проверочную работу
            в учительской.
          </p>
          <ul className="module-card-meta">
            <li>Алгебра</li>
            <li>Русский язык</li>
            <li>Другие предметы</li>
          </ul>
          <Link to="/teacher" className="module-card-link">
            Собрать работу
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </div>
  )
}

export default ModulesPage
