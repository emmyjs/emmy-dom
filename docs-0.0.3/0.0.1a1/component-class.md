# Component class
The `Component` class is the base class for all components. It provides a set of methods and properties that are common to all components.

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
### `this.render(content)`
The `render` method is used to render the component's content. It takes a string as an argument and renders it inside the component's `content` div. It is used like this:
```javascript
this.render(`
    <h2 style="${this.Style.h2}">Counter</h2>
    <p id="counter">${this.getAttribute('counter')}</p>
`);
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
It also supports style objects.
```javascript
this.addStyle({
    this: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    h2: {
        color: '#55c2da',
        borderRadius: '50%',
        width: '3rem',
        height: '3rem',
        cursor: 'pointer',
        WebkitTextStroke: '1px black',
        textAlign: 'center'
    }
});
```
### `this.newButton(content, callback)`
The `newButton` method is used to create a new button. It takes two arguments: the content of the button and a callback function that is called when the button is clicked. It is used like this:
```javascript
this.newButton('+', () => {
    this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
});
```

### `button.applyStyle()`
The `applyStyle` method is used to apply the styles that were added to the component using the `addStyle` method. It is used like this:
```javascript
let button = this.newButton('+', () => {
    this.setAttribute('counter', parseInt(this.getAttribute('counter')) + 1);
})
button.applyStyle();
```