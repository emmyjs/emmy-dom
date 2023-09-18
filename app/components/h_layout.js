class H_layout extends Component {
    constructor() {
        super();
        this.addStyle({
            this: {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            },
            content: {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                'justify-content': 'space-evenly'
            }
        });

        this.render(`
            <slot></slot>
        `);
    }
}

launch(H_layout);