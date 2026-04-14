import { describe, it, expect, vitest } from 'vitest'
import { renderToString, renderFunctionToString, hydrateScript } from '../src/server.ts'
import { FunctionalComponent } from '../src/index.ts'

describe('renderToString', () => {
  it('throws an error if no component is provided', async () => {
    await expect(renderToString(undefined as any)).rejects.toThrow("Cannot render: the provided 'app' component is undefined.");
  });
  
  it('renders a proper subclass of FunctionalComponent', async () => {
    function App() {
      return '<p>Test</p>'
    }
    const html = await renderToString(App as any);
    expect(html).toContain('<p>Test</p>');
    expect(html).toContain('emmy-app');
  });
});

describe('hydrateScript', () => {
  it('generates an import block for object generator', () => {
    const result = hydrateScript({ func: () => '', path: './myPath.js' } as any, 'myComponent')
    expect(result).toContain("import { myComponent as _myComponent } from './myPath.js'")
  })
});

describe('renderFunctionToString', () => {
  it('renders function toString', () => {
    function MyFun() { return 'foo'; }
    const result = renderFunctionToString(MyFun as any);
    expect(typeof result).toBe('string');
  });
});
