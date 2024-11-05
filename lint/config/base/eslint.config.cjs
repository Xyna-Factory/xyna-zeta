const baseConfig = require('../eslint.config.cjs');

const combinedConfig = {
    ...baseConfig,
    rules: {
        "zeta/xo": "error",

        // --------------------------------------------------------------------------------------------------------------------------------
        // angular functionality | https://github.com/angular-eslint/angular-eslint#functionality
        // --------------------------------------------------------------------------------------------------------------------------------
        "@angular-eslint/contextual-decorator": "error",
        "@angular-eslint/contextual-lifecycle": "error",
        "@angular-eslint/no-lifecycle-call": "error",
        "@angular-eslint/no-output-native": "warn",
        "@angular-eslint/use-lifecycle-interface": "error",
        "@angular-eslint/component-class-suffix": "error",
        "@angular-eslint/directive-class-suffix": "error",
        "@angular-eslint/no-output-on-prefix": "warn",
        "@angular-eslint/prefer-output-readonly": "warn",
        "@angular-eslint/use-pipe-transform-interface": "error",

        // --------------------------------------------------------------------------------------------------------------------------------
        // typescript supported rules |
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#supported-rules
        // --------------------------------------------------------------------------------------------------------------------------------
        //"@typescript-eslint/adjacent-overload-signatures": "warn",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/ban-types": ["error", { "types": { "Function": false, "Object": false, "object": false } }], // recommended
        //"@typescript-eslint/explicit-member-accessibility": ["warn", {"accessibility": "no-public"}], // strict
        //"@typescript-eslint/explicit-module-boundary-types": "error",                          impractical
        //"@typescript-eslint/member-delimiter-style": ["warn", {"multiline": {"delimiter": "semi", "requireLast": true}, "singleline": {"delimiter": "semi", "requireLast": false}}], // strict
        "@typescript-eslint/no-empty-interface": "error",
        //"@typescript-eslint/no-explicit-any": "error",                     
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        //"@typescript-eslint/no-floating-promises": "error",                           
        "@typescript-eslint/no-for-in-array": "error",
        //"@typescript-eslint/no-inferrable-types": "warn",                             
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        //"@typescript-eslint/no-this-alias": "error",                                  
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-unnecessary-qualifier": "warn",
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        //"@typescript-eslint/no-unsafe-assignment": "error",                                
        //"@typescript-eslint/no-unsafe-call": "error",                                    
        //"@typescript-eslint/no-unsafe-member-access": "error",                           
        //"@typescript-eslint/no-unsafe-return": "error",                            
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/prefer-regexp-exec": "error",
        //"@typescript-eslint/restrict-plus-operands": "error",                    
        //"@typescript-eslint/restrict-template-expressions": "error",         
        "@typescript-eslint/triple-slash-reference": "error",
        //"@typescript-eslint/type-annotation-spacing": "warn",                             
        //"@typescript-eslint/unbound-method": ["error", {"ignoreStatic": true}],          
        "@typescript-eslint/unified-signatures": "warn",

        // --------------------------------------------------------------------------------------------------------------------------------
        // typescript extension rules |
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#extension-rules
        // --------------------------------------------------------------------------------------------------------------------------------
        //"@typescript-eslint/comma-dangle": "warn",                                   
        //"@typescript-eslint/comma-spacing": "warn",                            
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/dot-notation": "error",
        //"@typescript-eslint/indent": "warn",                                       
        //"@typescript-eslint/keyword-spacing": "warn",                               
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-dupe-class-members": "error",
        //"@typescript-eslint/no-empty-function": "error",                        
        "@typescript-eslint/no-extra-semi": "error",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/no-redeclare": ["warn"],
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-unused-vars": ["warn", { "args": "none" }],
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/quotes": ["warn", "single"],
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/semi": "error",
        //"@typescript-eslint/space-before-function-paren": ["warn", "never"],                    
        //"@typescript-eslint/space-infix-ops": "warn",                                                           

        // --------------------------------------------------------------------------------------------------------------------------------
        // import rules | https://github.com/import-js/eslint-plugin-import
        // --------------------------------------------------------------------------------------------------------------------------------
        "import/no-duplicates": ["error", { "considerQueryString": true }],

        // --------------------------------------------------------------------------------------------------------------------------------
        // possible errors | https://eslint.org/docs/rules/#possible-errors
        // --------------------------------------------------------------------------------------------------------------------------------
        "for-direction": "error",
        "getter-return": "error",
        "no-async-promise-executor": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": "error",
        "no-console": ["warn", { "allow": ["log", "warn", "error"] }],
        "no-constant-condition": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-dupe-args": "error",
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-empty": "error",
        "no-empty-character-class": "error",
        "no-ex-assign": "error",
        "no-extra-boolean-cast": "error",
        //"no-extra-semi": "error",                                                                     //              extended
        "no-func-assign": "error",
        "no-import-assign": "error",
        "no-inner-declarations": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-misleading-character-class": "error",
        "no-obj-calls": "error",
        "no-prototype-builtins": "error",
        "no-regex-spaces": "error",
        "no-setter-return": "error",
        "no-sparse-arrays": "error",
        "no-unexpected-multiline": "error",
        "no-unreachable": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unsafe-optional-chaining": ["error", { "disallowArithmeticOperators": true }],
        "use-isnan": "error",
        "valid-typeof": "error",

        // --------------------------------------------------------------------------------------------------------------------------------
        // best practices | https://eslint.org/docs/rules/#best-practices
        // --------------------------------------------------------------------------------------------------------------------------------
        "array-callback-return": "error",
        "block-scoped-var": "error",
        //"curly": "error",                                                                             //              strict
        "default-case-last": "error",
        //"default-param-last": "error",                                                                //              extended
        //"dot-notation": "error",                                                                      //              extended
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        "guard-for-in": "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-constructor-return": "error",
        //"no-else-return": ["error", {"allowElseIf": false}],                                          //              strict
        //"no-empty-function": "error",                                                                 //              extended
        "no-empty-pattern": "error",
        "no-eval": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-fallthrough": "warn",
        "no-global-assign": "error",
        //"no-implied-eval": "error",                                                                   //              extended
        "no-loop-func": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal": "error",
        "no-proto": "error",
        //"no-redeclare": "warn",                                                                extended
        //"require-await": "error",                                                                     //              extended
        "no-script-url": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        //"no-throw-literal": "error",                                                                  //              extended
        "no-unmodified-loop-condition": "error",
        //"no-unused-expressions": "error",                                                             //              extended
        "no-unused-labels": "error",
        "no-useless-catch": "error",
        //"no-useless-concat": "warn",                                                                  //              strict
        "no-useless-escape": "error",
        "no-useless-return": "error",
        "no-with": "error",
        //"yoda": ["warn", "never", {"exceptRange": true}],                                             //              strict

        // --------------------------------------------------------------------------------------------------------------------------------
        // variables | https://eslint.org/docs/rules/#variables
        // --------------------------------------------------------------------------------------------------------------------------------
        "no-delete-var": "error",
        "no-label-var": "error",
        //"no-shadow": "error",                                                                         //              extended
        "no-shadow-restricted-names": "error",
        "no-undef": "error",
        "no-undef-init": "error",
        //"no-unused-vars": ["warn", {"args": "none"}],                                                 //              extended
        //"no-use-before-define": "error",                                                              //              extended

        // --------------------------------------------------------------------------------------------------------------------------------
        // stylistic issues | https://eslint.org/docs/rules/#stylistic-issues
        // --------------------------------------------------------------------------------------------------------------------------------
        //"block-spacing": "warn",                                                                      //              strict
        //"comma-dangle": "warn",                                                                       //              extended
        //"comma-spacing": "warn",                                                                      //              extended
        //"comma-style": "warn",                                                                        //              strict
        //"eol-last": "warn",                                                                           //              strict
        //"indent": "warn",                                                                             //              extended
        //"keyword-spacing": "warn"                                                                     //              extended
        "new-parens": "warn",
        //"no-array-constructor": "error",                                                              //              extended
        "no-bitwise": "error",
        "no-lonely-if": "warn",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-assign": "error",
        "no-new-object": "error",
        "no-tabs": "error",
        "no-trailing-spaces": "warn",
        "no-unneeded-ternary": "warn",
        //"no-whitespace-before-property": "warn",                                                      //              strict
        //"operator-assignment": "warn",                                                                //              strict
        //"quotes": "warn",                                                                             //              extended
        //"semi": "error",                                                                              //              extended
        //"space-before-blocks": "warn",                                                                //              strict
        //"space-before-function-paren": ["warn", "never"],                                             //              extended
        //"space-in-parens": "warn",                                                                    //              strict
        //"space-infix-ops": "warn",                                                                    //              extended
        //"space-unary-ops": "warn",                                                                    //              strict
        //"switch-colon-spacing": "warn",                                                               //              strict

        // --------------------------------------------------------------------------------------------------------------------------------
        // es6 | https://eslint.org/docs/rules/#ecmascript-6
        // --------------------------------------------------------------------------------------------------------------------------------
        //"arrow-body-style": "warn",                                                                   //              strict
        //"arrow-parens": ["warn", "as-needed"],                                                        //              strict
        //"arrow-spacing": "warn",                                                                      //              strict
        "constructor-super": "error",
        "no-class-assign": "error",
        "no-const-assign": "error",
        //"no-dupe-class-members": "error", 
        //"no-duplicate-imports": "warn",   
        "no-new-symbol": "error",
        "no-this-before-super": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "prefer-const": "warn",
        "require-yield": "error",
        //"rest-spread-spacing": "warn",                                                                //              strict
        //"template-curly-spacing": "warn",                                                             //              strict
    },
}

module.exports = combinedConfig;
