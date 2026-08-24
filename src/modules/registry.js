import relativity from './relativity'

export const STATUS_LABELS = {
  ready: 'Доступен',
  'in-progress': 'В разработке',
}

const MODULES = [relativity]

export function getModuleById(id) {
  return MODULES.find((module) => module.id === id)
}

export default MODULES
