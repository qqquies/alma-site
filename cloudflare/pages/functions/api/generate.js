// Pages Functions — резервный адрес для ИИ, если workers.dev недоступен
// из школьной сети. Код один и тот же: вызов идёт в cloudflare/worker.js.
import { handleRequest } from '../../../worker.js'

export const onRequest = ({ request, env }) => handleRequest(request, env)
