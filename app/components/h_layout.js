import { Component, launch } from '../../emmy.js';

class H_layout extends Component {
    constructor() {
        super();
        this.addStyle({
            this: `
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-evenly;
            `
        });

        this.render(`
            <slot></slot>
        `);
    }
}

launch(H_layout);