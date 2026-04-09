const Comment = require('./Comment')
const DocumentFragment = require('./DocumentFragment')
const Element = require('./Element')
const NodeFilter = require('./NodeFilter')
const Text = require('./Text')

const { find, nodeName } = require('../util')

const createElement = document.createElement.bind(document)

function getWhatToShowForNode(node) {
  if (!node) return 0
  if (node.nodeName === '#document') return NodeFilter.SHOW_DOCUMENT

  switch (node.nodeType) {
  case Node.COMMENT_NODE:
    return NodeFilter.SHOW_COMMENT
  case Node.DOCUMENT_FRAGMENT_NODE:
    return NodeFilter.SHOW_DOCUMENT_FRAGMENT
  case Node.ELEMENT_NODE:
    return NodeFilter.SHOW_ELEMENT
  case Node.TEXT_NODE:
    return NodeFilter.SHOW_TEXT
  default:
    return 0
  }
}

function shouldShowNode(node, whatToShow) {
  if (whatToShow == null || whatToShow === NodeFilter.SHOW_ALL) {
    return true
  }

  const nodeFlag = getWhatToShowForNode(node)
  return nodeFlag !== 0 && (whatToShow & nodeFlag) !== 0
}

function applyNodeFilter(node, filter) {
  if (!filter) {
    return NodeFilter.FILTER_ACCEPT
  }

  if (typeof filter === 'function') {
    return filter(node)
  }

  if (typeof filter.acceptNode === 'function') {
    return filter.acceptNode(node)
  }

  return NodeFilter.FILTER_ACCEPT
}

class Document extends Element {
  constructor() {
    super()

    this.body = this.createElement('body')
    this.documentElement = this.createElement('html')
    this.head = this.createElement('head')
    this.nodeName = '#document'

    this.appendChild(this.documentElement)
    this.documentElement.appendChild(this.head)
    this.documentElement.appendChild(this.body)

    // Custom configuration options.
    this.ssr = {
      scriptBase: process.cwd()
    }
  }

  createComment(nodeValue = '') {
    const comment = new Comment()
    comment.nodeValue = nodeValue
    return comment
  }

  createDocumentFragment() {
    return new DocumentFragment()
  }

  createElement(name) {
    const Ctor = window.customElements.get(name)
    return Ctor ? new Ctor() : createElement(name)
  }

  createEvent(name) {
    return new window[name]()
  }

  createTextNode(nodeValue = '') {
    const text = new Text()
    text.nodeValue = nodeValue
    return text
  }

  createTreeWalker(
    root,
    whatToShow = NodeFilter.SHOW_ALL,
    filter = { acceptNode: () => NodeFilter.FILTER_ACCEPT }
  ) {
    // Use an array so we don't have to use recursion.
    const stack = [root]
    return {
      currentNode: null,
      nextNode() {
        while (stack.length) {
          const next = stack.shift()
          const result = applyNodeFilter(next, filter)

          if (result !== NodeFilter.FILTER_REJECT) {
            // We do this in *document order*, so descendents of earlier parents
            // need to get visited first.
            stack.unshift(...next.childNodes)
          }

          if (result === NodeFilter.FILTER_ACCEPT && shouldShowNode(next, whatToShow)) {
            this.currentNode = next
            return this.currentNode
          }
        }

        this.currentNode = null
        return null
      }
    }
  }

  // TODO use a hash to speed this up.
  getElementById(id) {
    return find(document, node => node.id === id, { one: true })
  }

  getElementsByClassName(className) {
    return find(document, node => node.classList.contains(className))
  }

  getElementsByTagName(tagName) {
    tagName = tagName.toUpperCase()
    return find(document, node => node.nodeName === tagName)
  }

  importNode(node, deep) {
    const { parentNode } = node
    if (parentNode) {
      parentNode.removeChild(node)
    }
    if (!deep) {
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild)
      }
    }
    return node
  }
}

module.exports = Document
