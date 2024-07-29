import { describe, it, expect } from 'vitest'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const render = require('../src/ssr')
require('../src/ssr/register')

describe('render', () => {
  it('should be defined', () => {
    expect(render).toBeDefined()
  })
  it('should return a string', async () => {
    const document = new Document()
    expect(typeof await render(document)).toBe('string')
  })
  it('should render a document', async () => {
    const document = new Document()
    expect(await render(document)).toBe('<!doctype html><html><head></head><body><script>function __ssr() {var r,s=document.currentScript,f=s.parentNode;h=f.parentNode;f.removeChild(s);h.removeChild(f);r=h.attachShadow({mode:h.getAttribute(\'mode\')||\'open\'});while(f&&f.firstChild)r.appendChild(f.firstChild);}</script></body></html>')
  })
})
