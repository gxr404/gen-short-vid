import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['**/*.json'],
    typescript: true,
    formatters: true,
  },
  {
    rules: {
      'no-console': ['warn'],
    },
  },
)
