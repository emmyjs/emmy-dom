const processGenerator = (generator) => {
    let processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        if (/^[A-Z]/.test(match.slice(1, -1))) {
            let element = match.slice(0, -1);
            let name = element.split(' ')[0].slice(1);
            let attributes = element.split(' ').slice(1);
            return `<emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        else if (/^[A-Z]/.test(match.slice(2, -2))) {
            let element = match.slice(0, -1);
            let name = element.split(' ')[0].slice(2);
            let attributes = element.split(' ').slice(1);
            return `</emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
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
        this.attachShadow({ mode: 'open' });
        this.content = document.createElement('div');
        this.Style = {
            this: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }
        }
        this.callback = (_) => {};
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.content);
        this.content.innerHTML = processGenerator(this.contentGenerator(this));
        this.content.setAttribute('class', this.constructor.name.toLowerCase() + '-content');
        this.callback(this);
    }

    render(generator, callback) {
        if (typeof generator !== 'function') {
            this.contentGenerator = () => generator;
        }
        else {
            this.contentGenerator = generator;
        }
        if (callback && typeof callback === 'function') {
            this.callback = callback;
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

    $(selector) {
        if (/^[A-Z]/.test(selector)) {
            selector = 'emmy-' + selector.toLowerCase();
        }
        return this.content.querySelector(selector);
    }
}

const launch = (component) => {
    customElements.define('emmy-' + component.name.toLowerCase(), component)
}