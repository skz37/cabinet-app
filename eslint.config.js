// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig, // formatting is Prettier's job: turn off rules that conflict with it
  {
    ignores: ['dist/*', '.expo/*', 'mobile-mock-api/_generator/*', 'uniwind-types.d.ts'],
  },
]);
