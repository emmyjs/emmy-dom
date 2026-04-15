import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './docs',
      clean: false,
      cleanOnRerun: false,
      include: ['src/**/*.ts', 'src/**/*.js'],
      thresholds: {
        lines: 85,
        functions: 75,
        branches: 85,
        statements: 85
      }
    }
  }
})
