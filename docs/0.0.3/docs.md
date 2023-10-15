# emmy-dom
Emmy.js is a JavaScript library for building user interfaces. It is inspired by React.js and Astro

## Functional Components
You can use functional components to create components without classes. Functional components are just functions that return a string of HTML code or a function that returns a string of HTML code. The following example shows how to create a functional component:
```javascript
import { load } from "emmy-dom";

function HelloWorld() {
  return `<h1>Hello World!</h1>`;
}

load(HelloWorld, 'HelloWorld');
```

## Page Components
You can use page components to create components that are rendered only once, from a html file. The following example shows how to create a page component:
```html
<!-- home.html -->
<h1>Hello World!</h1>
```

```javascript
import { load } from "emmy-dom";

load('/home.html', 'Home');
```

## Class Components
You can use class components to create components with classes. The following example shows how to create a class component:

### Light Components
```javascript
import { LightComponent, launch } from "emmy-dom";

class HelloWorld extends LightComponent {
  constructor() {
    super();
    this.render(`<h1>Hello World!</h1>`);
  }
}

launch(HelloWorld, 'HelloWorld');
```

### Shadow Components
```javascript
import { Component, launch } from "emmy-dom";

class HelloWorld extends Component {
  constructor() {
    super();
    this.render(`<h1>Hello World!</h1>`);
  }
}

launch(HelloWorld, 'HelloWorld');
```

## Emmy Hooks
Emmy Hooks are inspired by React Hooks. You can use them to add state to your functional components without manually managing the `state` property. 

### useState
```javascript
import { load } from "emmy-dom";

function Counter() {
  const [count, setCount] = this.useState(0);

  this.callback = () => {
    this.querySelector('#increment').addEventListener('click', () => {
      setCount(count() + 1);
    });
  }

  return () => `<div>
    <h1>Count: ${count()}</h1>
    <button id="increment">+</button>
  </div>`;
}

load(Counter, 'Counter');
```

### useEffect
```javascript
import { load } from "emmy-dom";

function Counter() {
  const [count, setCount] = useState(0);

  this.callback = () => {
    this.querySelector('#increment').addEventListener('click', () => {
      setCount(count() + 1);
    });
  }

  this.useEffect(() => {
    console.log('Count changed to', count());
  }, [count]);

  return () => `<div>
    <h1>Count: ${count()}</h1>
    <button id="increment">+</button>
  </div>`;
}

load(Counter, 'Counter');
```

## Emmy Router
Emmy Router is inspired by React Router. You can use it to create a single page application. The following example shows how to create a single page application with Emmy Router:
```javascript
import { load, Router, Route } from "emmy-dom";

load('/home.html', 'Home');
load('/about.html', 'About');

function App() {
  return () => `
    <div>
      <Route path="/" component="Home" />
      <Route path="/about" component="About" />
      <Router></Router>
    </div>
  `;
}

load(App, 'App');
```

## Why Functional Components?
Functional components are easier to write than class components. For example, the following class component:
```javascript
import { LightComponent, launch } from "emmy-dom";

class OldCounter extends LightComponent {
  constructor() {
    super();

    this.setAttribute('counter', 0);
    this.setAttribute('word', "a");

    this.render(/*html*/`
      <div class="flex flex-col justify-center items-center space-y-3 text-center w-full h-full">
        <h1 class="text-3xl font-bold">Counter</h1>
        <h3 class="text-3xl font-bold" id="counter">${this.getAttribute('counter')}</h3>
        <h3 class="text-3xl font-bold" id="word">${this.getAttribute('word')}</h3>
        <button id="plusButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Increment
        </button>
        <button id="wordButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Word Change
        </button>
      </div>

    `, (THIS) => {
      THIS.$('#plusButton').onclick = () => {
        THIS.setAttribute('counter', parseInt(THIS.getAttribute('counter')) + 1);
      };
      THIS.$('#wordButton').onclick = () => {
        THIS.setAttribute('word', "a" + THIS.getAttribute('word'));
      };
    });
  }

  static get observedAttributes() {
    return ['counter', 'word'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'counter') {
      this.$('#counter').innerHTML = newValue;
    }
    else if (name === 'word') {
      this.$('#word').innerHTML = newValue;
    }
  }
}

launch(OldCounter, 'OldCounter');
```
can be written as the following functional component:
```javascript
import { load } from "emmy-dom";

function Counter () {
  const [count, setCount] = this.useState(0);
  const [word, setWord] = this.useState("a");

  this.callback = () => {
    const handleClick = () => setCount(count() + 1);
    this.querySelector('#plusButton')
      .addEventListener('click', handleClick);

    const handleWord = () => setWord("a" + word());
    this.querySelector('#wordButton')
      .addEventListener('click', handleWord);
  };

  return () => /*html*/`
    <div class="flex flex-col justify-center items-center space-y-3 text-center w-full h-full">
      <h1 class="text-3xl font-bold">Counter</h1>
      <h3 class="text-3xl font-bold">${count()}</h3>
      <h3 class="text-3xl font-bold">${word()}</h3>
      <button id="plusButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Increment
      </button>
      <button id="wordButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Word Change
      </button>
    </div>
  `;
}

load(Counter, 'Counter');
```