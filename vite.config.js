import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './docs',
      include: ['src/ssr/register/dom/Document.js', 'src/index.ts', 'src/hooks.ts'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85
      }
    }
  }
})
