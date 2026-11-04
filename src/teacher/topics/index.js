import kinematics from './kinematics'
import density from './density'
import newton from './newton'
import pressure from './pressure'
import work from './work'
import ohm from './ohm'
import relativity from './relativity'

const TOPICS = [kinematics, density, newton, pressure, work, ohm, relativity]

// Сборная работа: банк заданий из всех тем сразу. Нужна, когда учителю
// требуется длинный вариант — иначе задачи одной узкой темы повторяются.
const MIXED = {
  id: 'mixed',
  title: 'Сборная работа по всем темам',
  grade: '',
  generators: TOPICS.flatMap((topic) => topic.generators),
}

export const TOPIC_OPTIONS = [...TOPICS, MIXED]

export function getTopicById(id) {
  return TOPIC_OPTIONS.find((topic) => topic.id === id) || TOPICS[0]
}

export default TOPIC_OPTIONS
