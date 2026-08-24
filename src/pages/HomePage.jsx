import './HomePage.css'

function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Сложные идеи науки — понятно.</h1>
        <p className="hero-sub">
          Alma — виртуальное пространство получения образования для тех,
          кому мало школьной программы.
        </p>
      </section>

      <section>
        <h2 className="section-title">Модули</h2>
        <article className="module-card">
          <span className="badge">В разработке</span>
          <h3>Специальная теория относительности</h3>
          <p>Первый интерактивный модуль сайта.</p>
        </article>
      </section>
    </>
  )
}

export default HomePage
