const Node = require('./Node')

// Split out Element into a common base since this shouldn't be
// inheriting all of it.
const DocumentFragment = class extends Node {
  get nodeName() {
    return '#document-fragment'
  }
  get nodeType() {
    return Node.DOCUMENT_FRAGMENT_NODE
  }
}

module.exports = DocumentFragment
