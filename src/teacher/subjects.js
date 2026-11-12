// Предметы Alma. source определяет, откуда берутся задания:
//   bank — авторский банк (работает без интернета, ответы считаются формулами)
//   ai   — черновик от модели (нужен серверный посредник, ответы проверяет учитель)
// inTitle — форма для заголовка листа: «Контрольная работа по ...».
// icon — минималистичная иконка Lucide (лицензия ISC, источники в docs/ИСТОЧНИКИ.md).
// examples — подсказки тем, чтобы учителю было проще сформулировать запрос.

import {
  Atom,
  BookMarked,
  BookOpen,
  FlaskConical,
  Globe2,
  Landmark,
  Languages,
  Leaf,
  Monitor,
  Scale,
  Shapes,
  Sigma,
  Triangle,
} from 'lucide-react'

export const SUBJECTS = [
  {
    id: 'physics',
    title: 'Физика',
    inTitle: 'физике',
    source: 'bank',
    grade: '7',
    icon: Atom,
    examples: [
      'Скорость и ускорение',
      'Сила и движение',
      'Электрический ток',
      'Свет и оптика',
    ],
  },
  {
    id: 'algebra',
    title: 'Алгебра',
    inTitle: 'алгебре',
    source: 'ai',
    grade: '8',
    icon: Sigma,
    examples: [
      'Линейные уравнения',
      'Формулы сокращённого умножения',
      'Квадратные корни',
      'Арифметическая прогрессия',
    ],
  },
  {
    id: 'geometry',
    title: 'Геометрия',
    inTitle: 'геометрии',
    source: 'ai',
    grade: '8',
    icon: Triangle,
    examples: [
      'Признаки равенства треугольников',
      'Теорема Пифагора',
      'Подобие фигур',
      'Векторы на плоскости',
    ],
  },
  {
    id: 'russian',
    title: 'Русский язык',
    inTitle: 'русскому языку',
    source: 'ai',
    grade: '7',
    icon: BookOpen,
    examples: [
      'Правописание приставок',
      'Н и НН в прилагательных',
      'Обособленные члены предложения',
      'Сложноподчинённое предложение',
    ],
  },
  {
    id: 'literature',
    title: 'Литература',
    inTitle: 'литературе',
    source: 'ai',
    grade: '8',
    icon: BookMarked,
    examples: [
      'Русские народные сказки',
      'Басни И. А. Крылова',
      'А. С. Пушкин: лирика',
      'Литература XX века',
    ],
  },
  {
    id: 'history',
    title: 'История',
    inTitle: 'истории',
    source: 'ai',
    grade: '8',
    icon: Landmark,
    examples: [
      'Древний мир',
      'История Средних веков',
      'Россия в XIX веке',
      'Великая Отечественная война',
    ],
  },
  {
    id: 'social',
    title: 'Обществознание',
    inTitle: 'обществознанию',
    source: 'ai',
    grade: '8',
    icon: Scale,
    examples: [
      'Человек и общество',
      'Сфера духовной культуры',
      'Экономика семьи',
      'Права и обязанности гражданина',
    ],
  },
  {
    id: 'geography',
    title: 'География',
    inTitle: 'географии',
    source: 'ai',
    grade: '8',
    icon: Globe2,
    examples: [
      'Земля и её оболочки',
      'Географическая карта',
      'Материки и океаны',
      'Природа России',
    ],
  },
  {
    id: 'biology',
    title: 'Биология',
    inTitle: 'биологии',
    source: 'ai',
    grade: '8',
    icon: Leaf,
    examples: [
      'Строение клетки',
      'Растения и грибы',
      'Животные',
      'Человек и его здоровье',
    ],
  },
  {
    id: 'chemistry',
    title: 'Химия',
    inTitle: 'химии',
    source: 'ai',
    grade: '8',
    icon: FlaskConical,
    examples: [
      'Первоначальные химические понятия',
      'Кислород и водород',
      'Растворы',
      'Периодический закон',
    ],
  },
  {
    id: 'informatics',
    title: 'Информатика',
    inTitle: 'информатике',
    source: 'ai',
    grade: '8',
    icon: Monitor,
    examples: [
      'Алгоритмы и исполнители',
      'Информация и данные',
      'Электронные таблицы',
      'Основы программирования',
    ],
  },
  {
    id: 'english',
    title: 'Английский язык',
    inTitle: 'английскому языку',
    source: 'ai',
    grade: '7',
    icon: Languages,
    examples: [
      'Present Simple',
      'Past Simple',
      'Степени сравнения прилагательных',
      'Условные предложения',
    ],
  },
  {
    id: 'custom',
    title: 'Другой предмет',
    inTitle: '',
    source: 'ai',
    grade: '',
    icon: Shapes,
    examples: [
      'Строение клетки',
      'Великие географические открытия',
      'Глаголы to be и to have',
    ],
  },
]

export function findSubjectById(id) {
  return SUBJECTS.find((subject) => subject.id === id) || null
}

export function getSubjectById(id) {
  return findSubjectById(id) || SUBJECTS[0]
}
