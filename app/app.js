class App extends Component {
    constructor() {
        super();
        this.render(`
            <Hello name="world!">Introducing Emmy<br/></Hello>
            A simple JS framework
            <Hello name="OpenSourceUC"></Hello>
            <Counter/>
        `);
    }
}

launch(App);