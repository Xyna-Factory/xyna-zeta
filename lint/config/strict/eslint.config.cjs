const baseConfig = require('../base/eslint.config.cjs');

const combinedConfig = {
  ...baseConfig,
  rules: {
    // --------------------------------------------------------------------------------------------------------------------------------
    // typescript supported rules |
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#supported-rules
    // --------------------------------------------------------------------------------------------------------------------------------
    // "@typescript-eslint/adjacent-overload-signatures": "warn", // recommended
    // "@typescript-eslint/explicit-member-accessibility": ["warn", { "accessibility": "explicit" }], // nur einmal definiert
    // "@typescript-eslint/no-floating-promises": "error", // recommended
    // "@typescript-eslint/no-inferrable-types": "warn", // recommended
    // "@typescript-eslint/no-this-alias": "error", // recommended
    // "@typescript-eslint/unbound-method": ["error", { "ignoreStatic": true }], // recommended

    // --------------------------------------------------------------------------------------------------------------------------------
    // typescript extension rules |
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#extension-rules
    // --------------------------------------------------------------------------------------------------------------------------------
    "no-multi-spaces": "error",
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    "comma-spacing": ["warn", { "before": false, "after": true }],
    "indent": "off", // switch off default indent
    // Entferne die nicht vorhandene Regel und verwende die allgemeine `indent`-Regel
    // "@typescript-eslint/indent": ["warn", 4, {
    //   "ignoredNodes": ["Identifier"],
    //   "SwitchCase": 1
    // }],
    // "@typescript-eslint/keyword-spacing": "warn",
    // "@typescript-eslint/space-before-function-paren": ["warn", "never"],
    // "@typescript-eslint/space-infix-ops": "warn",

    // --------------------------------------------------------------------------------------------------------------------------------
    // best practices | https://eslint.org/docs/rules/#best-practices
    // --------------------------------------------------------------------------------------------------------------------------------
    "curly": "error",
    "no-else-return": ["error", { "allowElseIf": false }],
    "no-useless-concat": "warn",
    "yoda": ["warn", "never", { "exceptRange": true }],

    // --------------------------------------------------------------------------------------------------------------------------------
    // stylistic issues | https://eslint.org/docs/rules/#stylistic-issues
    // --------------------------------------------------------------------------------------------------------------------------------
    "block-spacing": "warn",
    "comma-style": "warn",
    "eol-last": "warn",
    "no-whitespace-before-property": "warn",
    "operator-assignment": "warn",
    "space-before-blocks": "warn",
    "space-in-parens": "warn",
    "space-unary-ops": "warn",
    "switch-colon-spacing": "warn",

    // --------------------------------------------------------------------------------------------------------------------------------
    // es6 | https://eslint.org/docs/rules/#ecmascript-6
    // --------------------------------------------------------------------------------------------------------------------------------
    "arrow-body-style": "warn",
    "arrow-parens": ["warn", "as-needed"],
    "arrow-spacing": "warn",
    "rest-spread-spacing": "warn",
    "template-curly-spacing": "warn",

    "brace-style": [2, "1tbs"],
  },
}

module.exports = combinedConfig;
