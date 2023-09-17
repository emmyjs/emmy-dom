class App extends Component {
    constructor() {
        super();
        this.render(`
            <Hello name="world!"></Hello>
            <p>Introducing Emmy.js</p>
            <p>A simple JS framework</p>
            <Counter/>
        `);

        this.content.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
        `;
    }
}

launch(App);