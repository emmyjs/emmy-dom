const processGenerator = (generator) => {
    let processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        if (/^[A-Z]/.test(match.slice(1, -1))) {
          return `<emmy-${match.slice(1, -1)}>`;
        }
        return match;
      });
    return processedGenerator;
}

function parseCSS(cssString) {
    if (typeof cssString !== 'string') {
        return cssString;
    }
    const styleObj = {};
    cssString.split(';').forEach((declaration) => {
        const [property, value] = declaration.split(':');
        if (property && value) {
            styleObj[property.trim()] = value.trim();
        }
    });
    return styleObj;
}

function createInlineStyle(cssString) {
    const styleObj = parseCSS(cssString);
    let inlineStyle = '';
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            inlineStyle += `${property}: ${styleObj[property]}; `;
        }
    }
    return inlineStyle.trim();
}

class Component extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        this.content = document.createElement('div');
        shadow.appendChild(this.content);
        this.Style = {
            this: `
                display: flex;
                flex-direction: column;
                align-items: center;
            `
        }
    }

    connectedCallback() {
        this.content.innerHTML = this.contentGenerator(this);
        this.content.setAttribute('class', this.constructor.name.toLowerCase() + '-content');
    }

    render(generator) {
        if (typeof generator !== 'function') {
            this.contentGenerator = () => processGenerator(generator);
        }
        else {
            this.contentGenerator = generator;
        }
    }

    addStyle(style) {
        for (const [element, elementStyle] of Object.entries(style)) {
            this.Style[element] = createInlineStyle(elementStyle);
            if (element == 'content') {
                this.content.setAttribute('style', this.Style[element]);
            }
            else if (element == 'this') {
                this.setAttribute('style', this.Style[element]);
            }
        }
    }

    newButton(text, callback) {
        let button = document.createElement('button');
        button.innerHTML = text;
        button.addEventListener('click', callback);
        this.shadowRoot.appendChild(button);
        button.applyStyle = () => {
            button.style = this.Style.button;
        }
        return button;
    }
}

const launch = (component) => {
    customElements.define('emmy-' + component.name.toLowerCase(), component)
}