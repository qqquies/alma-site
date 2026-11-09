import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import './AboutPage.css'

const PRINCIPLES = [
  {
    title: 'Сначала понять',
    text: 'Формула появляется после идеи. Модели можно крутить, ответы — проверять, ошибки — разбирать без страха получить двойку.',
  },
  {
    title: 'ИИ — черновик, не автор',
    text: 'Модель предлагает формулировки, но не ставит оценки и не публикует материалы без проверки учителя. Факты и ответы всегда проверяет человек.',
  },
  {
    title: 'Данные остаются у вас',
    text: 'Прогресс и профиль учителя хранятся в браузере. Мы не просим имя, телефон и не создаём аккаунт.',
  },
  {
    title: 'Один сайт для двоих',
    text: 'У ученика и учителя разные инструменты, но один язык: понятные объяснения, честные задания и уважение ко времени.',
  },
]

function AboutPage() {
  return (
    <div className="about">
      <Reveal as="section" className="about-hero">
        <span className="kicker">О проекте</span>
        <h1 className="about-title">Помощник, а не ещё один учебник.</h1>
        <p className="about-lead">
          Alma начиналась как маленький модуль по теории относительности.
          Теперь это цифровой школьный помощник: ученикам — понятные уроки
          и проверка, учителям — готовые работы, ключи и презентации.
        </p>
      </Reveal>

      <Reveal as="section" className="about-story">
        <div>
          <h2 className="about-subtitle">Зачем это нужно</h2>
          <p>
            Материала в интернете много, но он разрознен: объяснение в одном
            месте, задачи в другом, ключи в третьем. Учителю приходится
            собирать всё вручную, а ученику — догадываться, как проверить
            себя.
          </p>
        </div>
        <div>
          <h2 className="about-subtitle">Что делает Alma</h2>
          <p>
            Alma собирает цикл в одном месте: объяснение → практика →
            проверка → разбор. Спокойно, без геймификации ради гамификации
            и без обещаний «выучить всё за неделю».
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="about-principles">
        <span className="kicker">Принципы</span>
        <h2 className="section-title">Как мы это делаем</h2>

        <div className="principles-grid">
          {PRINCIPLES.map((principle, index) => (
            <article className="principle-card" key={principle.title}>
              <span className="principle-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="about-next">
        <div>
          <span className="kicker">Что дальше</span>
          <h2 className="section-title">
            Новые предметы, модели и сценарии для класса.
          </h2>
          <p>
            Сейчас в открытом доступе — теория относительности и
            учительские инструменты. Дальше появятся новые темы, больше
            интерактивных моделей и генерация материалов под конкретный
            класс. Если вы учитель и хотите попробовать Alma на своих
            уроках — начните с учительской.
          </p>
          <div className="about-actions">
            <Link to="/modules" className="btn btn--primary">
              Посмотреть уроки
            </Link>
            <Link to="/teacher" className="btn btn--ghost">
              Открыть учительскую
            </Link>
          </div>
        </div>

        <aside className="about-fact">
          <span className="about-fact-label">Сейчас в Alma</span>
          <ul>
            <li>
              <strong>7</strong> уроков по теории относительности
            </li>
            <li>
              <strong>3</strong> интерактивные модели
            </li>
            <li>
              <strong>2</strong> варианта каждой работы
            </li>
            <li>
              <strong>1</strong> итоговая работа с оценкой
            </li>
          </ul>
        </aside>
      </Reveal>

      <p className="about-sign">
        Alma · школьный проект · 2026
        <br />
        Не просто узнать. Понять.
      </p>
    </div>
  )
}

export default AboutPage
