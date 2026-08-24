import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <section className="hero">
      <h1>Сложные идеи науки — понятно.</h1>
      <p className="hero-sub">
        Alma — виртуальное пространство получения образования для тех,
        кому мало школьной программы.
      </p>
      <Link to="/modules" className="hero-cta">
        Перейти к модулям
      </Link>
    </section>
  )
}

export default HomePage
