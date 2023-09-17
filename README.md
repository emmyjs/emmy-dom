# Emmy.js

A tiny simple frontend framework for building web applications.

## Quick Start

First clone the repository:

```bash
git clone git@github.com:eanorambuena/Emmy.js.git
```

Then, launch a development server with your favorite tool. For example, with [http-server](https://www.npmjs.com/package/http-server):

That's it! You can now start building your application.

You will see the following on your browser:

![image](https://github.com/eanorambuena/Emmy.js/assets/38821970/897ac5bb-d96e-4a59-9020-ada9dd9eb4ce)

## Examples

### Counter

#### Using independent elements

```javascript
class Counter extends Component {
    constructor() {
        super();
        this.setAttribute('counter', 0);
        this.button = document.createElement('button');
        this.button.innerHTML = '+';
        this.button.addEventListener('click', () => {
            this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
        });

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

        this.button.style = this.Style.button;

        this.render(`
            <h2 style="${this.Style.h2}">Counter</h2>
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
```

