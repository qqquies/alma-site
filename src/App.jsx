import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ModulesPage from './pages/ModulesPage'
import ModulePage from './pages/ModulePage'
import ModuleExamPage from './pages/ModuleExamPage'
import LessonPage from './pages/LessonPage'
import TeacherHomePage from './pages/TeacherHomePage'
import TeacherSubjectPage from './pages/TeacherSubjectPage'
import TeacherPage from './pages/TeacherPage'
import PresentationPage from './pages/PresentationPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/teacher" element={<TeacherHomePage />} />
        <Route
          path="/teacher/presentation"
          element={<Navigate to="/teacher/physics/presentation" replace />}
        />
        <Route path="/teacher/:subjectId" element={<TeacherSubjectPage />} />
        <Route path="/teacher/:subjectId/tests" element={<TeacherPage />} />
        <Route
          path="/teacher/:subjectId/presentation"
          element={<PresentationPage />}
        />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/modules/:moduleId/exam" element={<ModuleExamPage />} />
        <Route path="/modules/:moduleId/:lessonId" element={<LessonPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
