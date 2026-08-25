const STORAGE_KEY = 'alma-progress'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function isLessonDone(moduleId, lessonId) {
  return Boolean(getProgress()[`${moduleId}/${lessonId}`])
}

export function markLessonDone(moduleId, lessonId) {
  const progress = getProgress()
  progress[`${moduleId}/${lessonId}`] = true
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}
