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
import { describe, it, expect } from 'vitest'
import { getExports } from '../src/server.js'

describe('getExports', () => {
    it('discovers functional component exports from JS files recursively', async () => {
        const exports = await getExports('tmp/test-exports');
        expect(exports).toBeDefined();
        
        expect(exports.MyFakeComponent).toBeDefined();
        expect(typeof exports.MyFakeComponent.func).toBe('function');
        expect(exports.MyFakeComponent.path).toContain('fake-component.js');

        expect(exports.NestedComp).toBeDefined();
        expect(exports.NestedComp.path).toContain('nested');

        expect(exports.MyFakeClass).toBeUndefined(); // Class should be ignored
        expect(exports.DefaultComp).toBeUndefined(); // default should be ignored
        expect(exports.TypeDef).toBeUndefined(); // .d.ts should be ignored
    });
});
import { describe, it, expect, vi } from 'vitest'
import { createConfig } from '../src/server.js'
import { readFileSync, rmSync, existsSync } from 'fs'

describe('createConfig', () => {
    it('creates built HTML files based on configuration', async () => {
        // Clean out path if exists
        if (existsSync('tmp/test-exports/output.html')) rmSync('tmp/test-exports/output.html');

        const consoleSpy = vi.spyOn(console, 'log')

        function App() {
            return '<p>Test App</p>'
        }

        await createConfig({
            dependencies: 'import "foo"',
            app: App,
            paths: {
               '/': 'tmp/test-exports/output.html' // output file
            },
            source: 'tmp/test-exports', // reads the components we defined here earlier
            template: 'tmp/test-exports/template.html'
        });

        expect(existsSync('tmp/test-exports/output.html')).toBe(true);
        const outputHtml = readFileSync('tmp/test-exports/output.html', 'utf-8');
        
        // Assert output contains hydration of the components
        expect(outputHtml).toContain('emmy-app');
        expect(outputHtml).toContain('import "foo"');
        expect(outputHtml).toContain('load(');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('> Building app in'));
    });
});
