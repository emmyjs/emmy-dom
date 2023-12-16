# Example: Counter
```javascript
import { Component, launch } from 'emmy-dom';

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
            `
        });

        this.setAttribute('counter', 0);

        this.render(`
            <h2 style="${this.Style.h2}">Counter</h2>
            <p id="counter">${this.getAttribute('counter')}</p>
            <H_layout>
                <Button id='plusButton' value='+'></Button>
                <Button id='minusButton' value='-'></Button>
            </H_layout>
        `, (_) => {
            _.$('#plusButton').onclick = () => {
                _.setAttribute('counter', parseInt(_.getAttribute('counter')) + 1);
            };
            _.$('#minusButton').onclick = () => {
                _.setAttribute('counter', parseInt(_.getAttribute('counter')) - 1);
            };
        });
    }

    static get observedAttributes() {
        return ['counter'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'counter') {
            this.$('#counter').innerHTML = newValue;
        }
    }
}

launch(Counter);
```