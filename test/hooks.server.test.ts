import { describe, it, expect, vitest } from 'vitest'
import { Component, FunctionalComponent } from '../src/server.ts'
import { getValues, useState, useEffect, useRef, bindHooks, Hoakable } from '../src/hooks.ts'

const isServerMock = vitest.fn(() => true)

describe('getValues', () => {
  it('should be defined', () => {
    expect(getValues).toBeDefined()
  })
  it('should return an array', () => {
    expect(getValues([])).toEqual([])
  })
  it('should return an array of values', () => {
    expect(getValues([() => 1, 2, () => 3])).toEqual([1, 2, 3])
  })
})

describe('useState', () => {
  it('should be defined', () => {
    expect(useState).toBeDefined()
  })
})

describe('useEffect', () => {
  it('should be defined', () => {
    expect(useEffect).toBeDefined()
  })
})

describe('bindHooks', () => {
  it('should be defined', () => {
    expect(bindHooks).toBeDefined()
  })
  it('should bind hooks', () => {
    class A extends Component {
      constructor() {
        super()
      }
    }
    const componentToBind = new A() as FunctionalComponent
    bindHooks(componentToBind as Hoakable)
    expect(componentToBind.useState).toBeDefined()
    expect(componentToBind.useEffect).toBeDefined()
  })
})

describe('useRef', () => {
  it('should be defined', () => {
    expect(useRef).toBeDefined()
  })
})
