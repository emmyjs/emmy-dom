import { describe, it, expect } from "vitest";
import { Component, LightComponent, useState } from "../dist/index.js";
import { HTMLElement } from "happy-dom";

function awaitDidMount(componentName) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (document.querySelector(componentName).didMount) {
                clearInterval(interval);
                resolve(true);
            }
        }, 100);
    });
}

// @vitest-environment happy-dom

describe("emmy", () => {
    it("should work", () => {
        expect(1).toBe(1);
    });
});

describe("Component", () => {
    it("should be defined", () => {
        expect(Component).toBeDefined();
    });
    it("should have a render method", () => {
        expect(new Component().render).toBeDefined();
    });
    it("should have a connectedCallback method", () => {
        expect(new Component().connectedCallback).toBeDefined();
    });
    it("should have a querySelector method", () => {
        expect(new Component().querySelector).toBeDefined();
    });
    it("should have a addStyle method", () => {
        expect(new Component().addStyle).toBeDefined();
    });
    it("should have a behave method", () => {
        expect(new Component().behave).toBeDefined();
    });
    it("should have a Style property", () => {
        expect(new Component().Style).toBeDefined();
    });
    it("should have a contentGenerator property", () => {
        expect(new Component().contentGenerator).toBeDefined();
    });
    it("should have a callback property", () => {
        expect(new Component().callback).toBeDefined();
    });
    it("addStyle method should add a style", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                    this.addStyle({
                        this: {
                            'background-color': 'red'
                        }
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').Style['this'];
        })()).toBe('background-color: red;');
    });
    it("addStyle method should add a React style", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                    this.addStyle({
                        this: {
                            backgroundColor: 'red'
                        }
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').Style['this'];
        })()).toBe('background-color: red;');
    });
    it("behave method should set the is attribute", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                    this.behave('div');
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').getAttribute('is');
        })()).toBe('div');
    });
    it("querySelector method should return an HTMLElement", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').querySelector('div');
        })()).toBeInstanceOf(HTMLElement);
    });
    it("should render", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.didMount = false;
                    this.render('<div></div>', (component) => {
                        component.didMount = true;
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            awaitDidMount('emmy-a');
            return document.querySelector('emmy-a').querySelector('div');
        })()).toBeDefined();
    });
});

describe("LightComponent", () => {
    it("should be defined", () => {
        expect(LightComponent).toBeDefined();
    });
    it("should have a render method", () => {
        expect(new LightComponent().render).toBeDefined();
    });
    it("should have a connectedCallback method", () => {
        expect(new LightComponent().connectedCallback).toBeDefined();
    });
    it("should have a querySelector method", () => {
        expect(new LightComponent().querySelector).toBeDefined();
    });
    it("should have a addStyle method", () => {
        expect(new LightComponent().addStyle).toBeDefined();
    });
    it("should have a behave method", () => {
        expect(new LightComponent().behave).toBeDefined();
    });
    it("should have a Style property", () => {
        expect(new LightComponent().Style).toBeDefined();
    });
    it("should have a contentGenerator property", () => {
        expect(new LightComponent().contentGenerator).toBeDefined();
    });
    it("should have a callback property", () => {
        expect(new LightComponent().callback).toBeDefined();
    });
    it("addStyle method should add a style", () => {
        expect((() => {
            class A extends LightComponent {
                constructor() {
                    super();
                    this.render(() => '<div></div>');
                    this.addStyle({
                        this: {
                            'background-color': 'red'
                        }
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').Style['this'];
        })()).toBe('background-color: red;');
    });
    it("addStyle method should add a React style", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                    this.addStyle({
                        this: {
                            backgroundColor: 'red'
                        }
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').Style['this'];
        })()).toBe('background-color: red;');
    });
    it("behave method should set the is attribute", () => {
        expect((() => {
            class A extends LightComponent {
                constructor() {
                    super();
                    this.render(() => '<div></div>');
                    this.behave('div');
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').getAttribute('is');
        })()).toBe('div');
    });
    it("querySelector method should return an HTMLElement", () => {
        expect((() => {
            class A extends LightComponent {
                constructor() {
                    super();
                    this.didMount = false;
                    this.render('<div></div>', (component) => {
                        component.didMount = true;
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            awaitDidMount('emmy-a');
            return document.querySelector('emmy-a').querySelector('div');
        })()).toBeInstanceOf(HTMLElement);
    });
    it("should render", () => {
        expect((() => {
            class A extends LightComponent {
                constructor() {
                    super();
                    this.didMount = false;
                    this.render('<div></div>', (component) => {
                        component.didMount = true;
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            awaitDidMount('emmy-a');
            return document.querySelector('emmy-a').querySelector('div');
        })()).toBeDefined();
    });
});

describe("useState", () => {
    it("should be defined", () => {
        expect(useState).toBeDefined();
    });
    it("should return a state", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    const [state, setState] = useState(0);
                    this.render('<div></div>', () => {
                        this.setAttribute('state', state());
                    });
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').getAttribute('state');
        })()).toBe("0");
    });
    it("should update a state", () => {
        expect((() => {
            class A extends Component {
                constructor() {
                    super();
                    this.render('<div></div>');
                    const [state, setState] = useState(0);
                    setState(1);
                    this.setAttribute('state', state());
                }
            }
            customElements.define('emmy-a', A);
            document.body.innerHTML = '<emmy-a></emmy-a>';
            return document.querySelector('emmy-a').getAttribute('state');
        })()).toBe("1");
    });
});
