class Counter extends Component {
    constructor() {
        super();
        this.addStyle({
            this: `
                display: flex;
                flex-direction: column;
                align-items: center;
            `,
            content: `
                display: flex;
                flex-direction: column;
                align-items: center;
            `,
            h2: `
                color: #55c2da;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 200%;
                -webkit-text-stroke: 1px black;
            `,
            button: `
                padding: auto;
                border: 1px solid black;
                background-color: #55c2da;
                color: white;
                font-size: 2rem;
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
                cursor: pointer;
                -webkit-text-stroke: 1px black;
                text-align: center;
            `
        });

        this.setAttribute('counter', 0);

        this.render(`
            <h2 style="${this.Style.h2}">Counter</h2>
            <p id="counter">${this.getAttribute('counter')}</p>
        `);

        this.newButton('+', () => {
            this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
        }).applyStyle();
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