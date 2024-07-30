import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('../../src/ssr/register')
