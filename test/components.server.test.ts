import { describe, it, expect } from 'vitest'
import { Component, LightComponent, FunctionalComponent } from '../src/server.ts'

describe('Component', () => {
  it('should be defined', () => {
    expect(Component).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new Component().render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new Component().connectedCallback).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new Component().addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new Component().Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new Component().contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new Component().callback).toBeDefined()
  })
})

describe('LightComponent', () => {
  it('should be defined', () => {
    expect(LightComponent).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new LightComponent().render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new LightComponent().connectedCallback).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new LightComponent().addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new LightComponent().Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new LightComponent().contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new LightComponent().callback).toBeDefined()
  })
})

describe('FunctionalComponent', () => {
  it('should be defined', () => {
    expect(FunctionalComponent).toBeDefined()
  })
  it('should have a render method', () => {
    expect(new FunctionalComponent(() => '').render).toBeDefined()
  })
  it('should have a connectedCallback method', () => {
    expect(new FunctionalComponent(() => '').connectedCallback).toBeDefined()
  })
  it('should have a addStyle method', () => {
    expect(new FunctionalComponent(() => '').addStyle).toBeDefined()
  })
  it('should have a Style property', () => {
    expect(new FunctionalComponent(() => '').Style).toBeDefined()
  })
  it('should have a contentGenerator property', () => {
    expect(new FunctionalComponent(() => '').contentGenerator).toBeDefined()
  })
  it('should have a callback property', () => {
    expect(new FunctionalComponent(() => '').callback).toBeDefined()
  })
})
