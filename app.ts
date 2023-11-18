import { load, build } from './src/server.ts';

function counter() {
  const [count, setCount] = this.useState(0);
  this.useEffect(() => {
    this.querySelector('#add').addEventListener('click', () => {
      setCount(count() + 1);
    });
  }, ['didMount']);

  this.useEffect(() => {
    this.querySelector('div').innerText = count();
  }, [count]);

  return /*html*/`
    <div>${count()}</div>
    <button id='add'>+</button>
  `;
}

export const Counter = load(counter, 'Counter');

function app() {
  this.className = 'home'
  return /*html*/`
    <div>hello world</div>
    <Counter />
  `;
}

export const App = load(app, 'App');

function index() {
  return /*html*/`<App />`;
}

export const Index = load(index, 'Index');

build(Index, { index, app, counter });
