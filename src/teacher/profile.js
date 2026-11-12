// Профиль учителя живёт в браузере. Это не аккаунт: имя школы и класс
// нужны только для шапки напечатанной работы, а не для входа на сайт.
// Один ключ localStorage на весь сайт — так учитель не теряет данные
// при переходе между контрольными и презентациями.

const PROFILE_KEY = 'alma-teacher-profile'

export const DEFAULT_PROFILE = {
  school: '',
  teacher: '',
  grade: '7',
  customSubject: '',
  lastSubjectId: '',
  subjectGrades: {},
}

export function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')

    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      return { ...DEFAULT_PROFILE }
    }

    return {
      ...DEFAULT_PROFILE,
      ...saved,
      subjectGrades:
        saved.subjectGrades &&
        typeof saved.subjectGrades === 'object' &&
        !Array.isArray(saved.subjectGrades)
          ? saved.subjectGrades
          : {},
    }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Приватный режим браузера может запрещать localStorage.
    // Профиль тогда просто не запомнится, но инструменты продолжат работать.
  }
}

// Обновление одного или нескольких полей без потери остальных.
export function updateProfile(patch) {
  const next = { ...loadProfile(), ...patch }
  saveProfile(next)
  return next
}

// Класс запоминается отдельно для каждого предмета: учитель может вести
// физику в седьмом, а алгебру — в девятом. Старые записи без карты классов
// продолжают работать через общее поле grade.
export function rememberSubject(subjectId) {
  return updateProfile({ lastSubjectId: subjectId })
}

export function getGradeForSubject(profile, subject) {
  const saved = profile?.subjectGrades?.[subject?.id]

  if (saved) return String(saved)
  if (subject?.grade) return String(subject.grade)
  if (profile?.grade) return String(profile.grade)

  return '7'
}

export function rememberGrade(subjectId, grade) {
  const profile = loadProfile()

  return updateProfile({
    grade,
    subjectGrades: {
      ...profile.subjectGrades,
      [subjectId]: grade,
    },
  })
}
