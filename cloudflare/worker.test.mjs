import test from 'node:test'
import assert from 'node:assert/strict'
import worker from './worker.js'

const ORIGIN = 'https://alma-edu.ru'

function envWith(response) {
  return {
    AI: {
      async run() {
        return { response }
      },
    },
  }
}

function draft(items) {
  return JSON.stringify({ items })
}

function slideDraft(slides) {
  return JSON.stringify({ slides })
}

function post(body, headers = {}) {
  return new Request('https://alma-ai.example.workers.dev/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: ORIGIN,
      'CF-Connecting-IP': `test-${Math.random()}`,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

async function call(request, env) {
  const response = await worker.fetch(request, env)
  const text = await response.text()
  let data = null

  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }

  return { response, data }
}

test('GET returns a health check', async () => {
  const request = new Request('https://alma-ai.example.workers.dev/')
  const { response, data } = await call(request, {})

  assert.equal(response.status, 200)
  assert.equal(data.ok, true)
  assert.equal(data.backend, 'workers-ai')
  assert.match(data.model, /llama-3\.3-70b/)
})

test('OPTIONS returns CORS headers for an allowed origin', async () => {
  const request = new Request('https://alma-ai.example.workers.dev/', {
    method: 'OPTIONS',
    headers: { Origin: ORIGIN },
  })
  const response = await worker.fetch(request, {})

  assert.equal(response.status, 204)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN)
  assert.match(
    response.headers.get('Access-Control-Allow-Methods'),
    /POST/,
  )
})

test('a foreign origin is rejected', async () => {
  const { response, data } = await call(
    post(
      { subject: 'Алгебра', topic: 'Уравнения', count: 5 },
      { Origin: 'https://evil.example' },
    ),
    envWith(draft([])),
  )

  assert.equal(response.status, 403)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null)
  assert.match(data.error, /не имеет доступа/)
})

test('a test draft is normalized and sorted by level', async () => {
  const { response, data } = await call(
    post({
      subject: 'Алгебра',
      grade: '8',
      topic: 'Линейные уравнения',
      count: 2,
      difficulty: 'mixed',
    }),
    envWith(
      draft([
        {
          text: 'Сложное задание',
          options: ['1', '2', '3', '4'],
          correctIndex: 2,
          explanation: 'Потому что.',
          level: 'high',
          check: 'ok',
        },
        {
          text: 'Простое задание',
          options: ['5', '6', '7', '8'],
          correctIndex: '1',
          explanation: 'Проверка.',
          level: 'basic',
          check: 'mismatch',
        },
      ]),
    ),
  )

  assert.equal(response.status, 200)
  assert.equal(data.items.length, 2)
  assert.equal(data.items[0].level, 'basic')
  assert.equal(data.items[0].correctIndex, 1)
  assert.equal(data.items[0].check, 'mismatch')
  assert.equal(data.items[1].level, 'high')
})

test('items with the wrong number of options are dropped', async () => {
  const { response, data } = await call(
    post({ subject: 'Алгебра', topic: 'Корни', count: 5 }),
    envWith(
      draft([
        {
          text: 'Хорошее задание',
          options: ['1', '2', '3', '4'],
          correctIndex: 0,
          level: 'basic',
        },
        {
          text: 'Плохое задание',
          options: ['1', '2', '3'],
          correctIndex: 0,
          level: 'basic',
        },
      ]),
    ),
  )

  assert.equal(response.status, 200)
  assert.equal(data.items.length, 1)
  assert.equal(data.items[0].text, 'Хорошее задание')
})

test('a draft with no valid items returns 502', async () => {
  const { response, data } = await call(
    post({ subject: 'Алгебра', topic: 'Корни', count: 5 }),
    envWith(draft([{ text: 'Битая задача', options: ['1'], correctIndex: 9 }])),
  )

  assert.equal(response.status, 502)
  assert.match(data.error, /неизвестном формате/)
})

test('a presentation draft is normalized', async () => {
  const { response, data } = await call(
    post({
      kind: 'presentation',
      subject: 'Алгебра',
      grade: '8',
      topic: 'Квадратные корни',
      count: 2,
    }),
    envWith(
      slideDraft([
        { title: 'Квадратные корни', bullets: [], note: 'Титул.' },
        {
          title: 'Свойства',
          bullets: ['Первое', 'Второе', ''],
          note: 'Объяснение.',
        },
      ]),
    ),
  )

  assert.equal(response.status, 200)
  assert.equal(data.slides.length, 2)
  assert.deepEqual(data.slides[1].bullets, ['Первое', 'Второе'])
})

test('missing subject or topic returns 400', async () => {
  const { response, data } = await call(
    post({ subject: '', topic: '' }),
    envWith(draft([])),
  )

  assert.equal(response.status, 400)
  assert.match(data.error, /предмет и тему/)
})

test('invalid JSON returns 400', async () => {
  const { response, data } = await call(post('{not json'), envWith(draft([])))

  assert.equal(response.status, 400)
  assert.match(data.error, /Некорректный JSON/)
})

test('a non-POST method returns 405', async () => {
  const request = new Request('https://alma-ai.example.workers.dev/', {
    method: 'PUT',
    headers: { Origin: ORIGIN },
  })
  const { response, data } = await call(request, {})

  assert.equal(response.status, 405)
  assert.match(data.error, /POST/)
})

test('markdown fences and prose around JSON are tolerated', async () => {
  const fenced = [
    'Вот результат:',
    '```json',
    draft([
      {
        text: 'Задание',
        options: ['1', '2', '3', '4'],
        correctIndex: 0,
        level: 'basic',
      },
    ]),
    '```',
  ].join('\n')

  const { response, data } = await call(
    post({ subject: 'Физика', topic: 'Скорость', count: 1 }),
    envWith(fenced),
  )

  assert.equal(response.status, 200)
  assert.equal(data.items.length, 1)
})

test('the optional OpenRouter path is used when a key is set', async () => {
  const originalFetch = globalThis.fetch
  let calledUrl = ''

  globalThis.fetch = async (url) => {
    calledUrl = String(url)
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: draft([
                {
                  text: 'Задание из OpenRouter',
                  options: ['1', '2', '3', '4'],
                  correctIndex: 3,
                  level: 'advanced',
                },
              ]),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const { response, data } = await call(
      post({ subject: 'Алгебра', topic: 'Прогрессия', count: 1 }),
      {
        OPENROUTER_API_KEY: 'test-key',
        OPENROUTER_MODEL: 'test/model',
      },
    )

    assert.equal(response.status, 200)
    assert.equal(data.items[0].text, 'Задание из OpenRouter')
    assert.match(calledUrl, /openrouter\.ai/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
