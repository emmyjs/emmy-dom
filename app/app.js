import { Component, launch } from '../emmy.js';

class App extends Component {
    constructor() {
        super();
        this.addStyle({
            this: `
                display: flex;
                flex-direction: column;
                align-items: center;
            `,
            strong: `
                color: #f00;
            `
        });

        this.render(`
            <Hello name="world!"></Hello>
            <p>Introducing <strong>Emmy.js</strong></p>
            <p>A tiny simple frontend framework</p>
            <Counter></Counter>
            <Github></Github>
        `);
    }
}

launch(App);