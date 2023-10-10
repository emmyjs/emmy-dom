const processGenerator = (generator) => {
    let processedGenerator = generator.replace(/<\/?[^>]+>/g, match => {
        let element = match.slice(0, -1);
        if (/^[A-Z]/.test(match.slice(1, -1))) {
            let name = element.split(' ')[0].slice(1);
            let attributes = element.split(' ').slice(1);
            return `<emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        else if (/^[A-Z]/.test(match.slice(2, -2))) {
            let name = element.split(' ')[0].slice(2);
            let attributes = element.split(' ').slice(1);
            return `</emmy-${name.toLowerCase()} ${attributes.join(' ')}>`;
        }
        return match;
    });
    return processedGenerator;
}

const parseCSS = (cssString) => {
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

const createInlineStyle = (cssString) => {
    const styleObj = parseCSS(cssString);
    let inlineStyle = '';
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            inlineStyle += `${property}: ${styleObj[property]}; `;
        }
    }
    return inlineStyle.trim();
}

const vanillaElement = (element) => {
    if (/^[A-Z]/.test(element)) {
        element = 'emmy-' + element.toLowerCase();
    }
    return element;
}


class EmmyComponent extends HTMLElement {
    addStyle(style) {
        for (const [element, elementStyle] of Object.entries(style)) {
            this.Style[element] = createInlineStyle(elementStyle);
            if (element == 'this') {
                this.setAttribute('style', this.Style[element]);
            }
        }
    }

    behave(element) {
        this.setAttribute('is', element);
    }

    connectedCallback() {
        throw new Error('EmmyComponent must be extended');
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
}


class Component extends EmmyComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.callback = (_) => {};
        this.Style = {};
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback(this);
    }

    $(selector) {
        return this.shadowRoot.querySelector(vanillaElement(selector));
    }
}


class LightComponent extends EmmyComponent {
    constructor() {
        super();
        this.callback = (_) => {};
        this.Style = {};
    }

    connectedCallback() {
        this.innerHTML = processGenerator(this.contentGenerator(this));
        this.callback(this);
    }

    $(selector) {
        return this.querySelector(vanillaElement(selector));
    }
}


class Route extends LightComponent {
    static routes = {};
    constructor() {
        super();

        this.render(``, (THIS) => {
            const componentName = "emmy-" + THIS.getAttribute('to').toLowerCase();
            const path = (THIS.getAttribute('href') === '/') ? '/root' : THIS.getAttribute('href');
            Route.routes[path] = `<${componentName}></${componentName}>`;
        });
    }
}


class Router extends LightComponent {
    constructor() {
        super();
        this.behave('div');
        this.setAttribute('class', 'flex flex-col justify-center items-center space-y-3 text-center w-full h-full');

        this.routes = Route.routes;

        this.handleLocation = () => {
            const path = window.location.pathname;
            const html = (path === '/' ? this.routes['/root'] : this.routes[path])
                || this.routes['/404'] || '<h1>404</h1>';
            if (this.innerHTML !== html) this.innerHTML = html;
        }

        window.route = (event) => {
        event.preventDefault();
        if (window.location.pathname === event.target.href) return;
            window.history.pushState({}, '', event.target.href);
            this.handleLocation();
        }

        window.onpopstate = this.handleLocation;

        this.render(``, () => {
            this.handleLocation();
        });
    }
}

const launch = (component, name) => {
    if (name === undefined) name = component.name;
    customElements.define('emmy-' + name.toLowerCase(), component);
}

launch(Route, 'Route');
launch(Router, 'Router');

export { Component, LightComponent, Route, Router, launch };
