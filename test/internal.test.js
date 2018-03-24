'use strict';

const assert = require('chai').assert;
const path = require('path');
const fs = require('fs');
const internal = require('../src/internal');

describe('internal', () => {

  describe('#fileExistsSync()', () => {
    it('should return false if file doesn\'t exist', () => {
      const result = internal.fileExistsSync('NOPE');

      assert.isFalse(result);
    });

    it('should return false if path is directory', () => {
      const result = internal.fileExistsSync('./data');

      assert.isFalse(result);
    });
  });

  describe('#getFileContentsOrFailSync()', () => {
    it('should throw error if file doesnt exist', () => {
      assert.throws(() => internal.getFileContentsOrFailSync('NOPE'));
    });


    it('should return contents for various inputs', () => {
      const testFilePath = path.resolve(__dirname, './internal.test.js');
      var testCases =
      [
        // As a path
        {
          input: testFilePath
        },

        // As string-based file contents /w default encoding
        {
          input: fs.readFileSync(testFilePath, { encoding: 'utf-8' })
        },

        // As string-based file contents /w default encoding option
        {
          input: fs.readFileSync(testFilePath, { encoding: 'utf-8' }),
          options: { encoding: 'utf-8' }
        },

        // As a buffer /w default encoding
        {
          input: fs.readFileSync(testFilePath)
        },

        // As a buffer /w specified encoding
        {
          input: fs.readFileSync(testFilePath),
          options: { encoding: 'utf-8' }
        },
      ];


      testCases.forEach(testCase => {
        const result = internal.getFileContentsOrFailSync(testCase.input, testCase.options);
        assert.isString(result);
      });

    });
  });
});