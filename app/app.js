class App extends Component {
    constructor() {
        super();
        this.render(`
            <Hello name="world!"></Hello>
            <p>Introducing Emmy.js</p>
            <p>A tiny simple frontend framework</p>
            <Counter/>
        `);

        this.addStyle({
            content: `
                display: flex;
                flex-direction: column;
                align-items: center;
            `
        });
    }
}

launch(App);