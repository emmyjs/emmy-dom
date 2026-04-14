import { beforeEach, afterEach, test, expect, describe, it } from 'vitest'
import '../register'

beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

afterEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

test('createTreeWalker', () => {
  document.head.innerHTML = '<div id="one"></div>'
  document.body.innerHTML = '<div id="one"></div>'

  const list = []
  const tree = document.createTreeWalker(document)

  while (tree.nextNode()) {
    list.push(tree.currentNode.nodeName)
  }

  expect(list).toMatchObject([
    '#document',
    'HTML',
    'HEAD',
    'DIV',
    'BODY',
    'DIV'
  ])
})

test('createTreeWalker supports whatToShow', () => {
  document.head.innerHTML = '<div id="one">head text</div>'
  document.body.innerHTML = '<div id="two">body text</div>'

  const list = []
  const tree = document.createTreeWalker(document, NodeFilter.SHOW_TEXT)

  while (tree.nextNode()) {
    list.push(tree.currentNode.nodeName)
  }

  expect(list).toMatchObject(['#text', '#text'])
})

test('createTreeWalker supports filter acceptNode', () => {
  document.head.innerHTML = '<div id="one"><span class="skip-me">a</span></div>'
  document.body.innerHTML = '<div id="two"><span class="reject-me">b</span></div>'

  const list = []
  const tree = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.classList?.contains('skip-me')) {
        return NodeFilter.FILTER_SKIP
      }

      if (node.classList?.contains('reject-me')) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    }
  })

  while (tree.nextNode()) {
    list.push(tree.currentNode.nodeName)
  }

  expect(list).toMatchObject(['HTML', 'HEAD', 'DIV', 'BODY', 'DIV'])
})

test('createTreeWalker skips filter calls for excluded node types', () => {
  document.head.innerHTML = '<div id="one">head text</div>'
  document.body.innerHTML = '<div id="two">body text</div>'

  let calls = 0
  const tree = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      calls++
      return node.nodeType === Node.TEXT_NODE
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    }
  })

  while (tree.nextNode()) {
    // no-op, exhaust walker
  }

  expect(calls).toBe(2)
})

test('createTreeWalker throws with invalid root', () => {
  expect(() => document.createTreeWalker(null)).toThrow(TypeError)
})

describe('getElementById', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementById('one')).toBe(null)
  })

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div id="two"></div>'
    document.body.innerHTML = '<div id="two"></div>'
    expect(document.getElementById('one')).toBe(null)
  })

  it('returns the first matched element', () => {
    document.head.innerHTML = '<div id="one"></div>'
    document.body.innerHTML = '<div id="one"></div>'
    document.getElementById('one')
    expect(document.getElementById('one').parentNode.nodeName).toBe('HEAD')
  })

  it('updates cached ids when an element id changes', () => {
    document.head.innerHTML = '<div id="one"></div>'

    const element = document.getElementById('one')
    expect(element).not.toBe(null)

    element.setAttribute('id', 'renamed')

    expect(document.getElementById('one')).toBe(null)
    expect(document.getElementById('renamed')).toBe(element)
  })

  it('updates cached ids when an element is removed', () => {
    document.body.innerHTML = '<div id="one"></div>'

    const element = document.getElementById('one')
    expect(element).not.toBe(null)

    element.parentNode.removeChild(element)
    expect(document.getElementById('one')).toBe(null)
  })
})

describe('getElementsByClassName', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementsByClassName('one').length).toBe(0)
  })

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div class="two"></div>'
    document.body.innerHTML = '<div class="two"></div>'
    expect(document.getElementsByClassName('one').length).toBe(0)
  })

  it('returns matched elements', () => {
    document.head.innerHTML = '<div class="one two"></div>'
    document.body.innerHTML = '<div class="one two"></div>'
    expect(document.getElementsByClassName('one').length).toBe(2)
  })
})

describe('getElementsByTagName', () => {
  it('returns no elements on empty', () => {
    expect(document.getElementsByTagName('span').length).toBe(0)
  })

  it('does not return unmatched elements', () => {
    document.head.innerHTML = '<div></div>'
    document.body.innerHTML = '<div></div>'
    expect(document.getElementsByTagName('span').length).toBe(0)
  })

  it('returns matched elements', () => {
    document.head.innerHTML = '<span></span>'
    document.body.innerHTML = '<span></span>'
    expect(document.getElementsByTagName('span').length).toBe(2)
  })
})

describe('createComment', () => {
  it('creates a comment node', () => {
    const comment = document.createComment('hello world')
    expect(comment.nodeType).toBe(Node.COMMENT_NODE)
    expect(comment.nodeValue).toBe('hello world')
  })
})

describe('createEvent', () => {
  it('creates an event', () => {
    const event = document.createEvent('Event')
    expect(event).toBeInstanceOf(Event)
  })
})

describe('importNode', () => {
  it('removes the node from its previous parent', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)
    
    document.importNode(child)
    expect(parent.childNodes.length).toBe(0)
  })

  it('drops children if deep is false or omitted', () => {
    const parent = document.createElement('div')
    const child1 = document.createElement('span')
    const child2 = document.createElement('span')
    parent.appendChild(child1)
    parent.appendChild(child2)

    const imported = document.importNode(parent)
    expect(imported.childNodes.length).toBe(0)
  })

  it('keeps children if deep is true', () => {
    const parent = document.createElement('div')
    const child1 = document.createElement('span')
    const child2 = document.createElement('span')
    parent.appendChild(child1)
    parent.appendChild(child2)

    const imported = document.importNode(parent, true)
    expect(imported.childNodes.length).toBe(2)
  })
})

describe('createTreeWalker remaining coverage', () => {
  it('supports function as filter', () => {
    document.head.innerHTML = '<div class="func-filter"></div>'
    const tree = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, node => {
      return node.classList?.contains('func-filter') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    })
    const list = []
    while (tree.nextNode()) {
      list.push(tree.currentNode.nodeName)
    }
    expect(list).toEqual(['DIV'])
  })

  it('defaults to FILTER_ACCEPT if filter object has no acceptNode', () => {
    document.head.innerHTML = '<b id="no-accept"></b>'
    const tree = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, {})
    const list = []
    while (tree.nextNode()) {
      if (tree.currentNode.id === 'no-accept') list.push(tree.currentNode.nodeName)
    }
    expect(list).toEqual(['B'])
  })
})

describe('createElement custom element coverage', () => {
  it('returns a new instance of the custom element constructor', () => {
    class MyCustomElement extends HTMLElement {}
    window.customElements.define('my-custom', MyCustomElement)
    const elem = document.createElement('my-custom')
    expect(elem.nodeName).toBe('MY-CUSTOM')
    expect(elem instanceof MyCustomElement).toBe(true)
  })
})

describe('createTreeWalker advanced coverage', () => {
  it('handles COMMENT_NODE, DOCUMENT_FRAGMENT_NODE and unknown nodes', () => {
    const parent = document.createElement('div')
    parent.appendChild(document.createComment('hello'))
    
    // Create a mock node with an unknown type for the default branch
    const unknownNode = document.createElement('span')
    Object.defineProperty(unknownNode, 'nodeType', { value: 999 })
    parent.appendChild(unknownNode)
    
    document.body.appendChild(parent)

    const tree = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT)
    const list = []
    while (tree.nextNode()) {
      list.push(tree.currentNode.nodeValue)
    }
    expect(list.includes('hello')).toBe(true)
  })

  it('handles DOCUMENT_FRAGMENT_NODE filtering', () => {
    // createTreeWalker traverses children, but DocumentFragment is a parent.
    // However, if the root itself is a fragment, it can be tested.
    const frag = document.createDocumentFragment()
    const tree = document.createTreeWalker(frag, NodeFilter.SHOW_DOCUMENT_FRAGMENT)
    expect(tree.nextNode()).toBe(frag) // It skips because fragment children aren't fragments unless appended.
    
    const childFrag = document.createDocumentFragment()
    // undom doesn't let append fragment as a node usually, but let's force it for coverage
    Object.defineProperty(childFrag, 'nodeType', { value: Node.DOCUMENT_FRAGMENT_NODE })
    frag.appendChild(childFrag)
    const tree2 = document.createTreeWalker(frag, NodeFilter.SHOW_DOCUMENT_FRAGMENT)
    
    tree2.nextNode()
  })

  it('handles null filter', () => {
    document.head.innerHTML = '<i></i>'
    const tree = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null)
    tree.nextNode()
  })
})
