import { Link } from 'react-router-dom'
import {
  BrainCircuit,
  GraduationCap,
  MousePointerClick,
  Presentation,
  ShieldCheck,
} from 'lucide-react'
import Reveal from '../components/Reveal'
import { HeroArt, StudentArt, TeacherArt } from '../components/Illustrations'
import './HomePage.css'

const FEATURES = [
  {
    icon: MousePointerClick,
    number: '01',
    title: 'Уроки, которые можно потрогать',
    text: 'Световые часы, поезд и мяч: интерактивные модели показывают то, что сложно представить в голове.',
  },
  {
    icon: ShieldCheck,
    number: '02',
    title: 'Проверка без подглядывания',
    text: 'Во время квиза материал скрыт. Задания идут от простого к сложному, а ответы считаются по формулам.',
  },
  {
    icon: GraduationCap,
    number: '03',
    title: 'Оценка и пересдача',
    text: 'Итоговая работа оценивается по школьной шкале 2–5. Можно разобрать ошибки и пройти её заново.',
  },
  {
    icon: Presentation,
    number: '04',
    title: 'Печать и презентации',
    text: 'Работы собираются в два варианта и печатаются на A4. Презентация скачивается как редактируемый .pptx.',
  },
]

const STUDENT_POINTS = [
  'Семь уроков по теории относительности',
  'Три интерактивные модели',
  'Прогресс сохраняется в браузере',
]

const TEACHER_POINTS = [
  'Печать A4 и сохранение в PDF',
  'Физика, алгебра, русский язык',
  'Презентации в редактируемом .pptx',
]

function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <Reveal className="hero-copy">
          <span className="kicker">Цифровой школьный помощник</span>
          <h1 className="hero-title">
            Понять самому.
            <br />
            Объяснить другим.
          </h1>
          <p className="hero-lead">
            Alma помогает ученикам разбираться в сложных темах, а учителям —
            быстрее готовить проверочные и презентации. Без лишнего шума
            и без зубрёжки.
          </p>

          <div className="hero-actions">
            <Link to="/modules" className="btn btn--primary">
              Начать с уроков
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link to="/teacher" className="btn btn--ghost">
              Открыть учительскую
            </Link>
          </div>

          <ul className="hero-meta">
            <li>Бесплатно</li>
            <li>Без регистрации</li>
            <li>Работает в браузере</li>
          </ul>
        </Reveal>

        <Reveal className="hero-art-wrap" delay={120}>
          <HeroArt />
        </Reveal>
      </section>

      <Reveal as="section" className="audience" id="audience">
        <div className="section-head">
          <span className="kicker">Два входа</span>
          <h2 className="section-title">
            Ученику — разобраться. Учителю — подготовиться.
          </h2>
          <p className="section-lead">
            Один сайт, но два разных сценария. Выберите свой — или загляните
            в оба.
          </p>
        </div>

        <div className="audience-grid">
          <article className="audience-card">
            <div className="audience-art">
              <StudentArt />
            </div>
            <span className="audience-label">01 · Ученик</span>
            <h3>Разобраться в теме без спешки</h3>
            <p>
              Интерактивные уроки, где формулу можно увидеть, а не только
              прочитать. После каждого урока — короткая проверка, в конце
              модуля — итоговая работа с оценкой.
            </p>
            <ul className="check-list">
              {STUDENT_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link to="/modules" className="card-link">
              Перейти к урокам
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="audience-card audience-card--teacher">
            <span className="audience-flag">Готовые материалы</span>
            <div className="audience-art">
              <TeacherArt />
            </div>
            <span className="audience-label">02 · Учитель</span>
            <h3>Подготовить работу за вечер</h3>
            <p>
              Банк заданий по физике и генерация черновиков по любому
              предмету. Два варианта, бланк, ключ и пояснения — всё готово
              к печати.
            </p>
            <ul className="check-list">
              {TEACHER_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link to="/teacher" className="card-link card-link--strong">
              Открыть учительскую
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </Reveal>

      <Reveal as="section" className="features">
        <div className="section-head">
          <span className="kicker">Что внутри</span>
          <h2 className="section-title">
            Не обещания, а работающие инструменты
          </h2>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article className="feature-card" key={feature.number}>
                <span className="feature-top">
                  <span className="feature-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="feature-number">{feature.number}</span>
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            )
          })}
        </div>
      </Reveal>

      <Reveal as="section" className="ai-note">
        <div className="ai-note-copy">
          <span className="kicker">
            <BrainCircuit size={15} aria-hidden="true" />
            Про ИИ честно
          </span>
          <h2 className="section-title">
            ИИ готовит черновик. Решает учитель.
          </h2>
          <p>
            Модель предлагает формулировки заданий или структуру слайдов,
            но не ставит оценки и не заменяет методиста. Учитель проверяет
            каждый вопрос, ответ и факт перед уроком.
          </p>
          <p className="ai-note-small">
            Генерация по другим предметам идёт через серверный посредник Alma.
            Доступ к модели не попадает в браузер: запрос принимает Cloudflare,
            а не страница.
          </p>
        </div>

        <div className="ai-columns">
          <div className="ai-column">
            <h3>ИИ берёт на себя</h3>
            <ul>
              <li>Черновики заданий по любому предмету</li>
              <li>Структуру презентации</li>
              <li>Рутину, на которую уходит вечер</li>
            </ul>
          </div>
          <div className="ai-column ai-column--human">
            <h3>Остаётся человеку</h3>
            <ul>
              <li>Проверку фактов и ответов</li>
              <li>Сложность и объём работы</li>
              <li>Решение об оценке</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="module-preview">
        <div className="module-preview-number" aria-hidden="true">
          01
        </div>
        <div className="module-preview-copy">
          <span className="kicker">Первый модуль</span>
          <h2 className="section-title">
            Специальная теория относительности
          </h2>
          <p>
            Семь уроков о том, как Эйнштейн перевернул представления
            о времени и пространстве. С моделями, проверками и итоговой
            работой.
          </p>
          <ul className="module-meta">
            <li>7 уроков</li>
            <li>3 интерактивные модели</li>
            <li>Итоговая работа</li>
          </ul>
          <Link to="/modules/relativity" className="btn btn--ghost">
            Открыть модуль
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      <Reveal as="section" className="closing">
        <h2>Начните с одной темы.</h2>
        <p>
          Не нужно регистрироваться и что-то устанавливать. Откройте первый
          урок или соберите первую работу.
        </p>
        <div className="closing-actions">
          <Link to="/modules" className="btn btn--primary">
            Я ученик
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link to="/teacher" className="btn btn--ghost">
            Я учитель
          </Link>
        </div>
      </Reveal>

      <p className="home-motto">Не просто узнать. Понять.</p>
    </div>
  )
}

export default HomePage
