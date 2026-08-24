import ClassicalCrisisLesson from './lessons/ClassicalCrisisLesson'

const relativityModule = {
  id: 'relativity',
  title: 'Специальная теория относительности',
  description: 'Первый интерактивный модуль сайта.',
  status: 'in-progress',
  lessons: [
    { id: 'classical-crisis', title: 'Почему классическая картина мира перестала работать' },
    { id: 'reference-frames', title: 'Системы отсчёта' },
    { id: 'postulates', title: 'Постулаты специальной теории относительности' },
    { id: 'simultaneity', title: 'Относительность одновременности' },
    { id: 'time-dilation', title: 'Замедление времени' },
    { id: 'length-contraction', title: 'Сокращение длины' },
    { id: 'mass-energy', title: 'Масса и энергия: E = mc²' },
  ],
  lessonComponents: {
    'classical-crisis': ClassicalCrisisLesson,
  },
}

export default relativityModule
