import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export function useServer() {
  require('./ssr/register')
}

export const render = require('./ssr')
