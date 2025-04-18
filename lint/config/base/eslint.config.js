export default [
    {
        rules: {
            'zeta/xo': 'error',

            // --------------------------------------------------------------------------------------------------------------------------------
            // angular functionality | https://github.com/angular-eslint/angular-eslint#functionality
            // --------------------------------------------------------------------------------------------------------------------------------
            '@angular-eslint/contextual-decorator': 'error',
            '@angular-eslint/contextual-lifecycle': 'error',
            '@angular-eslint/no-lifecycle-call': 'error',
            '@angular-eslint/no-output-native': 'warn',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/directive-class-suffix': 'error',
            '@angular-eslint/no-output-on-prefix': 'warn',
            '@angular-eslint/prefer-output-readonly': 'warn',
            '@angular-eslint/use-pipe-transform-interface': 'error',

            // --------------------------------------------------------------------------------------------------------------------------------
            // typescript supported rules |
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#supported-rules
            // --------------------------------------------------------------------------------------------------------------------------------                                  // recommended  strict
            '@typescript-eslint/await-thenable': 'error',                                                   // recommended
            '@typescript-eslint/ban-ts-comment': 'error',                                                   // recommended
            '@typescript-eslint/no-empty-interface': 'error',                                               // recommended
            '@typescript-eslint/no-extra-non-null-assertion': 'error',                                      // recommended
            '@typescript-eslint/no-for-in-array': 'error',                                                  // recommended
            '@typescript-eslint/no-misused-new': 'error',                                                   // recommended
            '@typescript-eslint/no-misused-promises': 'error',                                              // recommended
            '@typescript-eslint/no-namespace': 'error',                                                     // recommended
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',                              // recommended
            '@typescript-eslint/no-non-null-assertion': 'error',                                            // recommended
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
            '@typescript-eslint/no-unnecessary-qualifier': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',                                     // recommended
            '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
            '@typescript-eslint/no-var-requires': 'error',                                                  // recommended
            '@typescript-eslint/prefer-as-const': 'error',                                                  // recommended
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',                                         // recommended
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/prefer-regexp-exec': 'error',                                               // recommended
            '@typescript-eslint/triple-slash-reference': 'error',                                           // recommended
            '@typescript-eslint/unified-signatures': 'warn',

            // --------------------------------------------------------------------------------------------------------------------------------
            // typescript extension rules |
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#extension-rules
            // --------------------------------------------------------------------------------------------------------------------------------
            '@typescript-eslint/default-param-last': 'error',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/no-array-constructor': 'error',                                             // recommended
            '@typescript-eslint/no-dupe-class-members': 'error',
            'stylistic/no-extra-semi': 'error',                                                    // recommended
            '@typescript-eslint/no-implied-eval': 'error',                                                  // recommended
            '@typescript-eslint/no-redeclare': ['warn', {}],
            '@typescript-eslint/no-shadow': 'error',
            // todo '@typescript-eslint/no-throw-literal': 'error',
            '@typescript-eslint/no-throw-literal': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { 'args': 'none' }],                                // recommended
            '@typescript-eslint/no-use-before-define': 'error',
            'stylistic/quotes': ['warn', 'single'],
            '@typescript-eslint/require-await': 'error',                                                    // recommended
            'stylistic/semi': 'error',

            // --------------------------------------------------------------------------------------------------------------------------------
            // new replacements for deprecated ban-types rule
            // --------------------------------------------------------------------------------------------------------------------------------
            // todo '@typescript-eslint/no-restricted-types': 'error',
            // '@typescript-eslint/no-restricted-types': [
            //     'error',
            //     {
            //         'types': [
            //             'Function',  // Bans the use of the Function type
            //             'object',    // Bans the use of the object type
            //             'Object'     // Bans the use of the Object type
            //         ]
            //     }
            // ],

            // --------------------------------------------------------------------------------------------------------------------------------
            // import rules | https://github.com/import-js/eslint-plugin-import
            // --------------------------------------------------------------------------------------------------------------------------------
            'import/no-duplicates': ['error', { 'considerQueryString': true }],

            // --------------------------------------------------------------------------------------------------------------------------------
            // possible errors | https://eslint.org/docs/rules/#possible-errors
            // --------------------------------------------------------------------------------------------------------------------------------
            'for-direction': 'error',                                                                       // recommended
            'getter-return': 'error',                                                                       // recommended
            'no-async-promise-executor': 'error',                                                           // recommended
            'no-compare-neg-zero': 'error',                                                                 // recommended
            'no-cond-assign': 'error',                                                                      // recommended
            'no-console': ['warn', { 'allow': ['log', 'warn', 'error'] }],
            'no-constant-condition': 'error',                                                               // recommended
            'no-control-regex': 'error',                                                                    // recommended
            'no-debugger': 'error',                                                                         // recommended
            'no-dupe-args': 'error',                                                                        // recommended
            'no-dupe-else-if': 'error',                                                                     // recommended
            'no-dupe-keys': 'error',                                                                        // recommended
            'no-duplicate-case': 'error',                                                                   // recommended
            'no-empty': 'error',                                                                            // recommended
            'no-empty-character-class': 'error',                                                            // recommended
            'no-ex-assign': 'error',                                                                        // recommended
            'no-extra-boolean-cast': 'error',                                                               // recommended
            //'no-extra-semi': 'error',                                                                     //              extended
            'no-func-assign': 'error',                                                                      // recommended
            'no-import-assign': 'error',                                                                    // recommended
            'no-inner-declarations': 'error',                                                               // recommended
            'no-invalid-regexp': 'error',                                                                   // recommended
            'no-irregular-whitespace': 'error',                                                             // recommended
            'no-misleading-character-class': 'error',                                                       // recommended
            'no-obj-calls': 'error',                                                                        // recommended
            'no-prototype-builtins': 'error',                                                               // recommended
            'no-regex-spaces': 'error',                                                                     // recommended
            'no-setter-return': 'error',                                                                    // recommended
            'no-sparse-arrays': 'error',                                                                    // recommended
            'no-unexpected-multiline': 'error',                                                             // recommended
            'no-unreachable': 'error',                                                                      // recommended
            'no-unreachable-loop': 'error',
            'no-unsafe-finally': 'error',                                                                   // recommended
            'no-unsafe-negation': 'error',                                                                  // recommended
            'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
            'use-isnan': 'error',                                                                           // recommended
            'valid-typeof': 'error',

            // --------------------------------------------------------------------------------------------------------------------------------
            // best practices | https://eslint.org/docs/rules/#best-practices
            // --------------------------------------------------------------------------------------------------------------------------------
            'array-callback-return': 'error',
            'block-scoped-var': 'error',
            //'curly': 'error',                                                                             //              strict
            'default-case-last': 'error',
            //'default-param-last': 'error',                                                                //              extended
            //'dot-notation': 'error',                                                                      //              extended
            'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
            'guard-for-in': 'error',
            'no-alert': 'error',
            'no-caller': 'error',
            'no-case-declarations': 'error',                                                                // recommended
            'no-constructor-return': 'error',
            //'no-else-return': ['error', {'allowElseIf': false}],                                          //              strict
            //'no-empty-function': 'error',                                                                 //              extended
            'no-empty-pattern': 'error',                                                                    // recommended
            'no-eval': 'error',
            'no-extra-bind': 'error',
            'no-extra-label': 'error',
            'no-fallthrough': 'warn',                                                                       // recommended
            'no-global-assign': 'error',                                                                    // recommended
            //'no-implied-eval': 'error',                                                                   //              extended
            'no-loop-func': 'error',
            'no-multi-str': 'error',
            'no-new': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-octal': 'error',                                                                            // recommended
            'no-proto': 'error',
            //'no-redeclare': 'warn',                                                                       // recommended  extended
            //'require-await': 'error',                                                                     //              extended
            'no-script-url': 'error',
            'no-self-assign': 'error',                                                                      // recommended
            'no-self-compare': 'error',
            //'no-throw-literal': 'error',                                                                  //              extended
            'no-unmodified-loop-condition': 'error',
            //'no-unused-expressions': 'error',                                                             //              extended
            'no-unused-labels': 'error',                                                                    // recommended
            'no-useless-catch': 'error',                                                                    // recommended
            //'no-useless-concat': 'warn',                                                                  //              strict
            'no-useless-escape': 'error',                                                                   // recommended
            'no-useless-return': 'error',
            'no-with': 'error',                                                                             // recommended
            //'yoda': ['warn', 'never', {'exceptRange': true}], 

            // --------------------------------------------------------------------------------------------------------------------------------
            // variables | https://eslint.org/docs/rules/#variables
            // --------------------------------------------------------------------------------------------------------------------------------
            'no-delete-var': 'error',                                                                       // recommended
            'no-label-var': 'error',
            //'no-shadow': 'error',                                                                         //              extended
            'no-shadow-restricted-names': 'error',                                                          // recommended
            'no-undef': 'error',                                                                            // recommended
            'no-undef-init': 'error',
            //'no-unused-vars': ['warn', {'args': 'none'}],                                                 //              extended
            //'no-use-before-define': 'error',        

            // --------------------------------------------------------------------------------------------------------------------------------
            // stylistic issues | https://eslint.org/docs/rules/#stylistic-issues
            // --------------------------------------------------------------------------------------------------------------------------------
            //'block-spacing': 'warn',                                                                      //              strict
            //'comma-dangle': 'warn',                                                                       //              extended
            //'comma-spacing': 'warn',                                                                      //              extended
            //'comma-style': 'warn',                                                                        //              strict
            //'eol-last': 'warn',                                                                           //              strict
            //'indent': 'warn',                                                                             //              extended
            //'keyword-spacing': 'warn'                                                                     //              extended
            'new-parens': 'warn',
            //'no-array-constructor': 'error',                                                              //              extended
            'no-bitwise': 'error',
            'no-lonely-if': 'warn',
            'no-mixed-spaces-and-tabs': 'error',                                                            // recommended
            'no-multi-assign': 'error',
            'no-new-object': 'error',
            'no-tabs': 'error',
            'no-trailing-spaces': 'warn',
            'no-unneeded-ternary': 'warn',
            //'no-whitespace-before-property': 'warn',                                                      //              strict
            //'operator-assignment': 'warn',                                                                //              strict
            //'quotes': 'warn',                                                                             //              extended
            //'semi': 'error',                                                                              //              extended
            //'space-before-blocks': 'warn',                                                                //              strict
            //'space-before-function-paren': ['warn', 'never'],                                             //              extended
            //'space-in-parens': 'warn',                                                                    //              strict
            //'space-infix-ops': 'warn',                                                                    //              extended
            //'space-unary-ops': 'warn',                                                                    //              strict
            //'switch-colon-spacing': 'warn',    

            // --------------------------------------------------------------------------------------------------------------------------------
            // es6 | https://eslint.org/docs/rules/#ecmascript-6
            // --------------------------------------------------------------------------------------------------------------------------------
            //'arrow-body-style': 'warn',                                                                   //              strict
            //'arrow-parens': ['warn', 'as-needed'],                                                        //              strict
            //'arrow-spacing': 'warn',                                                                      //              strict
            'constructor-super': 'error',                                                                   // recommended
            'no-class-assign': 'error',                                                                     // recommended
            'no-const-assign': 'error',                                                                     // recommended
            //'no-dupe-class-members': 'error',                                                             // recommended  extended
            //'no-duplicate-imports': 'warn',                                                               //              extended
            'no-new-symbol': 'error',                                                                       // recommended
            'no-this-before-super': 'error',                                                                // recommended
            'no-useless-rename': 'error',
            'no-var': 'error',
            'prefer-const': 'warn',
            'require-yield': 'error'                                                                        // recommended
            //'rest-spread-spacing': 'warn',                                                                //              strict
            //'template-curly-spacing': 'warn',   
        },
    }
];