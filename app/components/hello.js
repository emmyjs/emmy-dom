import { Component, launch } from '../../emmy.js';

class Hello extends Component {
    constructor() {
        super();
        this.addStyle({
            content: `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0;
            `,
            h1: `
                color: #55c2da;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 250%;
                -webkit-text-stroke: 1px black;
            `
        });

        this.render(`
            <h1 style="${this.Style.h1}">Hello ${this.getAttribute('name')}</h1>
            <slot></slot>
        `);
    }
}

launch(Hello);