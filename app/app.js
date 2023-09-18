class App extends Component {
    constructor() {
        super();

        this.addStyle({
            content: `
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