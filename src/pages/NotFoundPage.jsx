import { Link } from 'react-router-dom'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <section className="notfound">
      <h1 className="page-title">404</h1>
      <p className="about-placeholder">
        Такой страницы нет.{' '}
        <Link to="/">Вернуться на главную</Link>
      </p>
    </section>
  )
}

export default NotFoundPage
