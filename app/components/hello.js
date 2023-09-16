class Hello extends Component {
    constructor() {
        super();
        this.render(`
            <h2>Hello ${this.getAttribute('name')}</h2> <slot></slot> 
        `);
    }
}

launch(Hello);