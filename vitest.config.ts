import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 1_000_000_000,
  },
})
