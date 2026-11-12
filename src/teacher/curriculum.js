// Популярные темы по предметам и классам.
//
// Это не программа и не учебный план: список нужен как быстрый выбор,
// чтобы учителю не пришлось придумывать формулировку с нуля. Тему всегда
// можно ввести текстом — каталог только подсказывает.
//
// bankId связывает тему с генераторами авторского банка Alma. Если поле
// не задано, тему собирает ИИ и присылает черновик на проверку.

export const GRADES = ['5', '6', '7', '8', '9', '10', '11']

export const TOPIC_CATALOG = {
  physics: [
    {
      id: 'kinematics',
      title: 'Скорость, путь и время',
      grades: ['7'],
      bankId: 'kinematics',
    },
    {
      id: 'density',
      title: 'Плотность вещества',
      grades: ['7'],
      bankId: 'density',
    },
    {
      id: 'pressure',
      title: 'Давление твёрдых тел, жидкостей и газов',
      grades: ['7'],
      bankId: 'pressure',
    },
    {
      id: 'work',
      title: 'Работа, мощность, КПД',
      grades: ['7'],
      bankId: 'work',
    },
    {
      id: 'ohm',
      title: 'Электрический ток: закон Ома',
      grades: ['8'],
      bankId: 'ohm',
    },
    {
      id: 'newton',
      title: 'Законы Ньютона',
      grades: ['9'],
      bankId: 'newton',
    },
    {
      id: 'relativity',
      title: 'Основы специальной теории относительности',
      grades: ['9', '10', '11'],
      bankId: 'relativity',
    },
    {
      id: 'physics-mixed',
      title: 'Сборная работа по всем темам',
      grades: ['7', '8', '9', '10', '11'],
      bankId: 'mixed',
      testsOnly: true,
    },
  ],
  algebra: [
    {
      id: 'natural',
      title: 'Натуральные числа и действия с ними',
      grades: ['5', '6'],
    },
    {
      id: 'fractions',
      title: 'Обыкновенные дроби и проценты',
      grades: ['5', '6'],
    },
    {
      id: 'equations',
      title: 'Уравнения и буквенные выражения',
      grades: ['6', '7'],
    },
    {
      id: 'linear',
      title: 'Линейные уравнения',
      grades: ['7'],
    },
    {
      id: 'powers',
      title: 'Степени и одночлены',
      grades: ['7'],
    },
    {
      id: 'formulas',
      title: 'Формулы сокращённого умножения',
      grades: ['7', '8'],
    },
    {
      id: 'roots',
      title: 'Квадратные корни и квадратные уравнения',
      grades: ['8'],
    },
    {
      id: 'inequalities',
      title: 'Неравенства и системы неравенств',
      grades: ['8', '9'],
    },
    {
      id: 'functions',
      title: 'Функции, прогрессии и системы уравнений',
      grades: ['9'],
    },
    {
      id: 'logarithms',
      title: 'Логарифмы и показательные уравнения',
      grades: ['10', '11'],
    },
    {
      id: 'trigonometry',
      title: 'Тригонометрия',
      grades: ['10', '11'],
    },
    {
      id: 'derivative',
      title: 'Производная и её применение',
      grades: ['10', '11'],
    },
  ],
  geometry: [
    {
      id: 'triangles',
      title: 'Треугольники и их свойства',
      grades: ['7'],
    },
    {
      id: 'parallel',
      title: 'Параллельные прямые',
      grades: ['7'],
    },
    {
      id: 'quadrilaterals',
      title: 'Четырёхугольники',
      grades: ['8'],
    },
    {
      id: 'pythagoras',
      title: 'Теорема Пифагора и площади фигур',
      grades: ['8'],
    },
    {
      id: 'similarity',
      title: 'Подобие треугольников',
      grades: ['8', '9'],
    },
    {
      id: 'circle',
      title: 'Окружность и её свойства',
      grades: ['9'],
    },
    {
      id: 'vectors',
      title: 'Векторы на плоскости',
      grades: ['9'],
    },
    {
      id: 'stereometry',
      title: 'Стереометрия: прямые и плоскости в пространстве',
      grades: ['10', '11'],
    },
    {
      id: 'solids',
      title: 'Многогранники и тела вращения',
      grades: ['10', '11'],
    },
  ],
  russian: [
    {
      id: 'spelling',
      title: 'Орфография: проверяемые и непроверяемые гласные',
      grades: ['5', '6'],
    },
    {
      id: 'morphology',
      title: 'Части речи и морфологический разбор',
      grades: ['5', '6', '7'],
    },
    {
      id: 'participles',
      title: 'Причастия и деепричастия',
      grades: ['7'],
    },
    {
      id: 'adverbs',
      title: 'Наречия и служебные части речи',
      grades: ['7'],
    },
    {
      id: 'one-part',
      title: 'Односоставные предложения',
      grades: ['8'],
    },
    {
      id: 'detached',
      title: 'Обособленные члены предложения',
      grades: ['8'],
    },
    {
      id: 'complex',
      title: 'Сложносочинённые и сложноподчинённые предложения',
      grades: ['9'],
    },
    {
      id: 'compression',
      title: 'Сжатое изложение',
      grades: ['9'],
    },
    {
      id: 'orthoepy',
      title: 'Орфоэпия и нормы литературного языка',
      grades: ['10', '11'],
    },
    {
      id: 'punctuation',
      title: 'Пунктуация в сложном предложении',
      grades: ['10', '11'],
    },
  ],
  literature: [
    {
      id: 'folklore',
      title: 'Русские народные сказки и былины',
      grades: ['5', '6'],
    },
    {
      id: 'fables',
      title: 'Басни и литературные сказки',
      grades: ['5', '6'],
    },
    {
      id: 'pushkin',
      title: 'А. С. Пушкин: лирика и проза',
      grades: ['6', '7'],
    },
    {
      id: 'lermontov',
      title: 'М. Ю. Лермонтов',
      grades: ['7', '8'],
    },
    {
      id: 'gogol',
      title: 'Н. В. Гоголь',
      grades: ['8'],
    },
    {
      id: 'xx-century',
      title: 'Русская литература XX века',
      grades: ['9'],
    },
    {
      id: 'war-literature',
      title: 'Великая Отечественная война в литературе',
      grades: ['9', '10', '11'],
    },
    {
      id: 'novel',
      title: 'Русский роман XIX века',
      grades: ['10'],
    },
    {
      id: 'silver-age',
      title: 'Поэзия Серебряного века',
      grades: ['11'],
    },
    {
      id: 'modern-literature',
      title: 'Литература конца XX — начала XXI века',
      grades: ['11'],
    },
  ],
  history: [
    {
      id: 'ancient',
      title: 'Древний мир',
      grades: ['5'],
    },
    {
      id: 'middle-ages',
      title: 'История Средних веков',
      grades: ['6'],
    },
    {
      id: 'moscow-state',
      title: 'Россия в XVI–XVII веках',
      grades: ['7'],
    },
    {
      id: 'new-time',
      title: 'Новое время: XVIII век',
      grades: ['7', '8'],
    },
    {
      id: 'russia-xix',
      title: 'Россия в XIX веке',
      grades: ['8', '9'],
    },
    {
      id: 'world-xx',
      title: 'Мир в первой половине XX века',
      grades: ['9', '10'],
    },
    {
      id: 'great-patriotic-war',
      title: 'Великая Отечественная война',
      grades: ['9', '10', '11'],
    },
    {
      id: 'russia-xx-xxi',
      title: 'Россия в XX–XXI веках',
      grades: ['10', '11'],
    },
  ],
  social: [
    {
      id: 'human-society',
      title: 'Человек и общество',
      grades: ['6', '7'],
    },
    {
      id: 'spiritual-culture',
      title: 'Сфера духовной культуры',
      grades: ['6', '7', '8'],
    },
    {
      id: 'economy',
      title: 'Экономика',
      grades: ['8', '9'],
    },
    {
      id: 'social-relations',
      title: 'Социальные отношения',
      grades: ['8', '9'],
    },
    {
      id: 'politics',
      title: 'Политика и государство',
      grades: ['9', '10', '11'],
    },
    {
      id: 'law',
      title: 'Право и права человека',
      grades: ['9', '10', '11'],
    },
    {
      id: 'modern-society',
      title: 'Современное общество',
      grades: ['10', '11'],
    },
  ],
  geography: [
    {
      id: 'earth-shells',
      title: 'Земля и её оболочки',
      grades: ['5', '6'],
    },
    {
      id: 'map',
      title: 'Географическая карта',
      grades: ['5', '6'],
    },
    {
      id: 'continents',
      title: 'Материки и океаны',
      grades: ['7'],
    },
    {
      id: 'russia-nature',
      title: 'Природа России',
      grades: ['8'],
    },
    {
      id: 'russia-economy',
      title: 'Хозяйство России',
      grades: ['9'],
    },
    {
      id: 'world-economy',
      title: 'Мировое хозяйство',
      grades: ['10', '11'],
    },
    {
      id: 'world-regions',
      title: 'Регионы мира',
      grades: ['10', '11'],
    },
  ],
  biology: [
    {
      id: 'biology-science',
      title: 'Биология как наука',
      grades: ['5'],
    },
    {
      id: 'living-organisms',
      title: 'Живые организмы',
      grades: ['5', '6'],
    },
    {
      id: 'plants-fungi',
      title: 'Растения и грибы',
      grades: ['6'],
    },
    {
      id: 'animals',
      title: 'Животные',
      grades: ['7'],
    },
    {
      id: 'human-health',
      title: 'Человек и его здоровье',
      grades: ['8'],
    },
    {
      id: 'cell-genetics',
      title: 'Клетка и основы генетики',
      grades: ['9'],
    },
    {
      id: 'evolution',
      title: 'Эволюция органического мира',
      grades: ['10', '11'],
    },
    {
      id: 'ecosystems',
      title: 'Экосистемы и биосфера',
      grades: ['10', '11'],
    },
  ],
  chemistry: [
    {
      id: 'chemistry-basics',
      title: 'Первоначальные химические понятия',
      grades: ['8'],
    },
    {
      id: 'oxygen-hydrogen',
      title: 'Кислород, водород и вода',
      grades: ['8'],
    },
    {
      id: 'solutions',
      title: 'Растворы и реакции ионного обмена',
      grades: ['8', '9'],
    },
    {
      id: 'periodic-law',
      title: 'Периодический закон и строение атома',
      grades: ['9'],
    },
    {
      id: 'electrolytes',
      title: 'Электролитическая диссоциация',
      grades: ['9'],
    },
    {
      id: 'organic',
      title: 'Органическая химия',
      grades: ['10', '11'],
    },
    {
      id: 'chemistry-life',
      title: 'Химия и жизнь',
      grades: ['10', '11'],
    },
  ],
  informatics: [
    {
      id: 'algorithms',
      title: 'Алгоритмы и исполнители',
      grades: ['5', '6'],
    },
    {
      id: 'information',
      title: 'Информация и данные',
      grades: ['7'],
    },
    {
      id: 'text-editor',
      title: 'Текстовый редактор',
      grades: ['7'],
    },
    {
      id: 'algorithmization',
      title: 'Основы алгоритмизации',
      grades: ['8'],
    },
    {
      id: 'spreadsheets',
      title: 'Электронные таблицы',
      grades: ['8', '9'],
    },
    {
      id: 'modeling',
      title: 'Моделирование',
      grades: ['9'],
    },
    {
      id: 'programming',
      title: 'Программирование',
      grades: ['9', '10', '11'],
    },
    {
      id: 'databases',
      title: 'Базы данных',
      grades: ['10', '11'],
    },
    {
      id: 'web',
      title: 'Веб-технологии',
      grades: ['10', '11'],
    },
  ],
  english: [
    {
      id: 'present-simple',
      title: 'Present Simple и рассказ о себе',
      grades: ['5'],
    },
    {
      id: 'family-school',
      title: 'Семья, школа и хобби',
      grades: ['5'],
    },
    {
      id: 'past-simple',
      title: 'Past Simple',
      grades: ['6'],
    },
    {
      id: 'plurals',
      title: 'Множественное число и артикли',
      grades: ['6'],
    },
    {
      id: 'present-perfect',
      title: 'Present Perfect',
      grades: ['7'],
    },
    {
      id: 'comparatives',
      title: 'Степени сравнения прилагательных',
      grades: ['7'],
    },
    {
      id: 'conditionals',
      title: 'Условные предложения',
      grades: ['8'],
    },
    {
      id: 'passive',
      title: 'Пассивный залог',
      grades: ['8'],
    },
    {
      id: 'reported-speech',
      title: 'Косвенная речь',
      grades: ['9'],
    },
    {
      id: 'phrasal-verbs',
      title: 'Фразовые глаголы',
      grades: ['9'],
    },
    {
      id: 'tenses-review',
      title: 'Времена глагола: повторение',
      grades: ['10', '11'],
    },
    {
      id: 'writing',
      title: 'Письменная речь и эссе',
      grades: ['10', '11'],
    },
  ],
}

function catalogFor(subjectId) {
  return TOPIC_CATALOG[subjectId] || []
}

// Для предмета показываем только те классы, для которых есть темы.
// Физика, например, начинается с седьмого класса, а не с пятого.
export function getGradesForSubject(subjectId) {
  const grades = new Set(catalogFor(subjectId).flatMap((topic) => topic.grades))
  const available = GRADES.filter((grade) => grades.has(grade))

  return available.length > 0 ? available : GRADES
}

export function getTopicsForGrade(subjectId, grade, mode = 'tests') {
  return catalogFor(subjectId).filter((topic) => {
    if (mode === 'presentation' && topic.testsOnly) return false
    if (!grade) return true

    return topic.grades.includes(String(grade))
  })
}

export function getFirstBankTopic(subjectId, grade) {
  const topics = getTopicsForGrade(subjectId, grade)

  return (
    topics.find((topic) => topic.bankId && topic.bankId !== 'mixed') ||
    topics.find((topic) => topic.bankId) ||
    null
  )
}
