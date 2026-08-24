import { Link } from 'react-router-dom'
import MODULES, { STATUS_LABELS } from '../modules/registry'
import './ModulesPage.css'

function ModulesPage() {
  return (
    <section>
      <h1 className="page-title">Модули</h1>
      <div className="modules-grid">
        {MODULES.map((module) => (
          <Link
            key={module.id}
            to={`/modules/${module.id}`}
            className="module-card"
          >
            <span className="badge">{STATUS_LABELS[module.status]}</span>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ModulesPage
