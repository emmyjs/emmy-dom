import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './docs',
      cleanOnRerun: false,
      include: ['src/**/*.ts', 'src/**/*.js'],
      thresholds: {
        lines: 80,
        functions: 70,
        branches: 75,
        statements: 80
      }
    }
  }
})
