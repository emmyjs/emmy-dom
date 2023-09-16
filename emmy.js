const processGenerator = (generator) => {
    let processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        if (/^[A-Z]/.test(match.slice(1, -1))) {
          return `<emmy-${match.slice(1, -1)}>`;
        }
        return match;
      });
    return processedGenerator;
}

Object.prototype.onChange = (node, callback) => {
    // From https://medium.com/@e1016/javascript-reactivo-2-7ec886b4292a
    let originalValue = this[node]
    Object.defineProperty(this, node, {
        get: () => {
            return originalValue;
        },
        set: (newValue) => {
            console.log(newValue, '·', originalValue);
            callback(newValue, originalValue || undefined);
            originalValue = newValue;
        }
    })
}

class Component extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        this.content = document.createElement('div');
        shadow.appendChild(this.content);
    }

    connectedCallback() {
        this.content.innerHTML = this.contentGenerator(this);
    }

    render(generator) {
        if (typeof generator !== 'function') {
            this.contentGenerator = () => processGenerator(generator);
        }
        else {
            this.contentGenerator = generator;
        }
    }
}

const launch = (component) => {
    customElements.define('emmy-' + component.name.toLowerCase(), component)
}