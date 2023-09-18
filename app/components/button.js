class Button extends Component {
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

        this.render(`
            <button style="${this.Style.button}">
                ${this.getAttribute('value')}
            </button>
        `);
    }
}

launch(Button);