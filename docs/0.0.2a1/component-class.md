# Component class
The `Component` class is the base class for all ShadowDOM components. It provides a set of methods and properties that are common to all components.

## Properties
It has all the properties of the `HTMLElement` class, plus the following:
### `this.content`
The `content` property is a reference to a `div` element that is used to hold the main content of the component.
### `this.Style`
The `Style` property is an object that holds the inline styles for the component. It is used to add styles to the component. It is an object with the following structure:
```javascript
this.Style = {
    this: "display: flex; flex-direction: column; align-items: center;"
};
```

It can also be used to add styles to the component's shadow DOM. See the [addStyle](#addstyle) method for more information.

## Methods
### `this.render(content, callback)`
The `render` method is used to render the component's content. It takes two arguments:
1. `content`: The content to be rendered as a string.
2. `callback`: A function that is called after the content is rendered.
```javascript
this.render(`
    <h2>${this.getAttribute('counter')}</h2>
    <button>+</button>
    <button>-</button>
`, () => {
    let buttons = this.content.querySelectorAll('button');
    buttons[0].addEventListener('click', () => {
        this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
    });
    buttons[1].addEventListener('click', () => {
        this.setAttribute('counter', parseInt(this.getAttribute('counter')) - 1);
    });
});
```

### `this.addStyle(styles)`
The `addStyle` method is used to add styles to the component. It takes an object as an argument and adds the styles to the component's `Style` property. It is used like this:
```javascript
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
    h2: `
        color: #55c2da;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        cursor: pointer;
        -webkit-text-stroke: 1px black;
        text-align: center;
    `
});
```

### `this.behave(element)`
The `behave` method is used to add `is` attributes to the component's root element. It takes an element as an argument and adds the `is` attribute to it. It is used like this:
```javascript
this.behave('section');
```