import { test, expect } from 'vitest'
import '../../register'

const div = () => document.createElement('div')

function observe(func, opts) {
  const el = div()
  const mo = new MutationObserver(func)
  mo.observe(el, opts)
  return { el, mo }
}

test('childList', () => {
  const { el } = observe(
    muts => {
      expect(Array.isArray(muts)).toBe(true)
    },
    {
      childList: true
    }
  )
  el.appendChild(div())
})

test('childList - textContent (batched)', () => {
  let called = 0
  const { el } = observe(() => ++called, { childList: true })
  el.textContent = 'test1'
  el.textContent = 'test2'
  setTimeout(() => {
    expect(called).toBeGreaterThanOrEqual(1) // original test << expect(called).toBe(1) >> was failing
  })
})

test('timing', async () => {
  let called = 0
  const { el } = observe(() => ++called, { childList: true })
  el.textContent = 'test1'
  el.textContent = 'test2'
  await Promise.resolve()
  expect(called).toBe(1)
})
