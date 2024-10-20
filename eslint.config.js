//   instructions:
//
// - copy this file directly into the root project folder (next to package.json) and rename it to 'eslint.config.js'.
// - uncomment one of the lines inside the 'extends' object to either enable base or strict linting of the project.

// const strictConfig = require('./projects/xyna/src/app/zeta/lint/config/strict/eslint.config');
// const baseConfig = require('./projects/xyna/src/app/zeta/lint/config/base/eslint.config');

const combinedConfig = {
    // ...strictConfig,
    // ...baseConfig,
};

module.exports = combinedConfig;
