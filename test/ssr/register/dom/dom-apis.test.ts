import { describe, it, expect } from 'vitest'
import '../../../../src/ssr/register'

describe('Basic DOM Stubs Coverage', () => {
  it('History stub pushState coverage', () => {
    window.history.pushState({}, '', '/test')
    expect(window.history.length).toBeGreaterThan(0)
    window.history.replaceState({}, '', '/test2')
    window.history.back()
    window.history.forward()
    window.history.go(-1)
  })

  it('Event stub methods', () => {
    const ev = document.createEvent('Event')
    ev.initEvent('click', true, true)
    expect(ev.bubbles).toBe(true)
    expect(ev.type).toBe('click')

    ev.initCustomEvent('custom', false, false, { id: 1 })
    expect(ev.detail.id).toBe(1)
  })

  it('Navigator stub', () => {
    expect(navigator.userAgent).toMatch(/Node/)
  })

  it('CSSStyleSheet stub rules', () => {
    const sheet = new CSSStyleSheet(document.createElement('style'))
    const i = sheet.insertRule('body { color: red; }', 0)
    expect(i).toBe(0)
    expect(sheet.cssRules.length).toBe(1)
    sheet.deleteRule(0)
    expect(sheet.cssRules.length).toBe(0)
  })
})
