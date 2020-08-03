#!/usr/bin/env node
const process = require('process');
const babelRegister = require('@babel/register');

// TODO: enable cache in production mode
process.env.BABEL_DISABLE_CACHE = 1;

const defaultBabelOptions = require('../babel.config');


// babel-register (makes sure that src/* files get babeled upon require)
const babelRegisterOptions = {
  ...defaultBabelOptions,
  sourceMaps: 'inline',
  ignore: [
    // '**/node_modules/**',
    function shouldIgnore(modulePath) {
      let include = modulePath.match(/((@dbux[\\/])|(dbux-.*?))src[\\/]/);
      if (include) {
        // throw new Error('x');
        console.debug(`[dbux-cli] register-self include`, modulePath);
        return false;
      }

      // include = !!modulePath.match(/(node_modules|dist)[\\/]/);
      return true;
    }
  ]
};
babelRegister(babelRegisterOptions);