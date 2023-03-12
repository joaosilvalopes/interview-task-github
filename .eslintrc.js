/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["unused-imports"],
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node", "@remix-run/eslint-config/jest-testing-library"],
  rules: {
    "testing-library/prefer-screen-queries": "off",
    "testing-library/prefer-user-event": "off",
    "unused-imports/no-unused-imports": "error"
  }
};
