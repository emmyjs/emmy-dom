const { walk } = require('./register/util')

const shadowRootScript = '<script>function __ssr() {var r,s=document.currentScript,f=s.parentNode;h=f.parentNode;f.removeChild(s);h.removeChild(f);r=h.attachShadow({mode:h.getAttribute(\'mode\')||\'open\'});while(f&&f.firstChild)r.appendChild(f.firstChild);}</script>'
const shadowRootScriptCall = '<script>__ssr()</script>'

const defaultResolver = node => yup => setTimeout(() => yup(node))

function stringify(node) {
  let str = ''

  if (node.nodeName === '#document') {
    node = node.documentElement
    str += '<!doctype html>'
  }

  if (node.nodeName === '#text') {
    return node.textContent
  }

  // Expansión recursiva de custom elements estáticos en todo el árbol
  const expandStatic = (n) => {
    const ctor = n.constructor
    if (ctor && ctor.static === true) {
      // Ejecutar connectedCallback si existe
      if (typeof n.connectedCallback === 'function') {
        try { n.connectedCallback() } catch (e) {}
      }
      // Si tras connectedCallback los childNodes están vacíos y hay generador, ejecutarlo
      if ((!n.childNodes || n.childNodes.length === 0) && typeof n.render === 'function') {
        try {
          const html = n.render()
          if (typeof html === 'string' && html.length > 0) {
            n.childNodes = [ { nodeName: '#text', textContent: html } ]
          }
        } catch (e) {}
      }
    }
    // Recursivo para hijos
    if (n.childNodes && n.childNodes.length > 0) {
      n.childNodes.forEach(expandStatic)
    }
  }
  expandStatic(node)

  str += `<${node.localName}${(node.attributes || [])
    .map(a => ` ${a.name}="${a.value}"`)
    .join('')}>`

  if (node.nodeName === 'BODY') {
    str += shadowRootScript
  }

  if (node.shadowRoot) {
    str += `<shadowroot>${node.shadowRoot.childNodes
      .map(stringify)
      .join('')}${shadowRootScriptCall}</shadowroot>`
  }

  if (node.childNodes) {
    str += node.childNodes.map(stringify).join('')
  }

  str += `</${node.localName}>`

  return str
}

const render = (node = document, resolver = defaultResolver) => {
  node.connectedCallback && node.connectedCallback()
  return new Promise(resolver(node)).then(root => {
    const str = stringify(root)
    root.disconnectedCallback && root.disconnectedCallback()
    return str
  })
}

module.exports = render
