import { Link } from 'react-router-dom'
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
        <Link to="/modules" className="hero-cta">
          Перейти к модулям
        </Link>
      </section>

      <section className="info">
        <article className="info-card">
          <h3>Что такое Alma?</h3>
          <p>
            <span className="text-accent">Alma</span> — это интерактивная
            образовательная среда, где сложные идеи современной науки можно
            изучать самостоятельно: через объяснения, визуализации и
            небольшие эксперименты.
          </p>
        </article>

        <article className="info-card">
          <h3>Зачем это нужно?</h3>
          <p>
            Школьная программа даёт фундамент, но далеко не всегда оставляет
            время на темы, которые находятся за её пределами. Alma создана
            для тех, кому хочется разобраться глубже: не просто запомнить
            формулу, а понять,{' '}
            <span className="text-accent">почему всё устроено именно так</span>.
          </p>
        </article>

        <article className="info-card">
          <h3>Для кого?</h3>
          <p>
            Для школьников, которым интересно заглянуть за пределы привычного
            курса математики и физики. Предварительные знания важны, но
            гораздо важнее <span className="text-accent">любопытство</span>:
            материал начинается с интуитивного объяснения и постепенно
            приводит к более строгому пониманию.
          </p>
        </article>
      </section>

      <p className="motto">Не просто узнать. Понять.</p>
    </>
  )
}

export default HomePage
