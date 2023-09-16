class Counter extends Component {
    constructor() {
        super();
        this.setAttribute('counter', 0);
        this.button = document.createElement('button');
        this.button.innerHTML = '+';
        this.button.addEventListener('click', () => {
            this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
        });

        this.render(`
            <h2>Counter</h2>
            <p id="counter">${this.getAttribute('counter')}</p>
        `);
        this.shadowRoot.appendChild(this.button);
    }

    static get observedAttributes() {
        return ['counter'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'counter') {
            this.content.querySelector('#counter').innerHTML = newValue;
        }
    }
}

launch(Counter);