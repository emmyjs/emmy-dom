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
  get nodeName() {
    return '#document'
  }

  constructor() {
    super()

    this.body = this.createElement('body')
    this.documentElement = this.createElement('html')
    this.head = this.createElement('head')

    this.appendChild(this.documentElement)
    this.documentElement.appendChild(this.head)
    this.documentElement.appendChild(this.body)

    // Custom configuration options.
    this.ssr = {
      scriptBase: process.cwd()
    }

    // Cache hash map for fast getElementById lookups.
    this._idIndex = new Map()
    this._idIndexDirty = true
    this._markIdIndexDirty = () => {
      this._idIndexDirty = true
    }

    // Any add/remove/attribute mutation invalidates the ID index.
    addEventListener('__MutationObserver', this._markIdIndexDirty)
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
    if (Ctor) {
      const elem = new Ctor()
      elem._nodeName = name.toUpperCase()
      return elem
    }
    return createElement(name)
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
    if (!root || typeof root !== 'object' || !('childNodes' in root)) {
      throw new TypeError('Failed to execute "createTreeWalker": invalid root node')
    }

    // Use an array so we don't have to use recursion.
    const stack = [root]
    return {
      currentNode: null,
      nextNode() {
        while (stack.length) {
          const next = stack.shift()
          const nodeIncluded = shouldShowNode(next, whatToShow)
          const result = nodeIncluded
            ? applyNodeFilter(next, filter)
            : NodeFilter.FILTER_SKIP

          if (result !== NodeFilter.FILTER_REJECT && next?.childNodes) {
            // We do this in *document order*, so descendents of earlier parents
            // need to get visited first.
            stack.unshift(...next.childNodes)
          }

          if (nodeIncluded && result === NodeFilter.FILTER_ACCEPT) {
            this.currentNode = next
            return this.currentNode
          }
        }

        this.currentNode = null
        return null
      }
    }
  }

  _rebuildIdIndex() {
    const idIndex = new Map()
    const tree = this.createTreeWalker(this, NodeFilter.SHOW_ELEMENT)

    while (tree.nextNode()) {
      const node = tree.currentNode
      if (node.id && !idIndex.has(node.id)) {
        idIndex.set(node.id, node)
      }
    }

    this._idIndex = idIndex
    this._idIndexDirty = false
  }

  getElementById(id) {
    if (this._idIndexDirty) {
      this._rebuildIdIndex()
    }

    return this._idIndex.get(id) || null
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
