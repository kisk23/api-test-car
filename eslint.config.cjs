// eslint.config.cjs
const tsParser = require("@typescript-eslint/parser")
const tsPlugin = require("@typescript-eslint/eslint-plugin")

module.exports = [
  { ignores: ["node_modules/**", "dist/**"] },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      // <- require the parser module, not a string
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      // add more rules here
    }
  }
]
