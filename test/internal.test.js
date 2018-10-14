'use strict';

const assert = require('chai').assert;
const path = require('path');
const fs = require('fs');
const internal = require('../src/internal');

describe('internal', () => {

  describe('#getFileContentsOrFailSync()', () => {
    it('should throw error if file doesnt exist', () => {
      assert.throws(() => internal.getFileContentsOrFailSync('NOPE'));
    });


    it('should return contents for various inputs', () => {
      const testCases = getFileContentsTestCases();
      testCases.forEach(testCase => {
        const result = internal.getFileContentsOrFailSync(testCase.input, testCase.options);
        assert.isString(result);
      });

    });
  });

  describe('#getFileContentsOrFail()', () => {
    it('should reject promise if file doesnt exist', () => {
      const promise = internal.getFileContentsOrFail('NOPE');
      return promise.catch(error => assert.isTrue(true));
    });


    it('should return contents for various inputs', () => {
      const testCases = getFileContentsTestCases();
      const results = testCases.forEach(testCase => {
        it('should return contents for various inputs', () => {
          const promise = internal.getFileContentsOrFail(testCase.input, testCase.options);
          return promise.then(result => assert.isString(result));
        });
      });
    });
  });
});

const getFileContentsTestCases = () => {
  const testFilePath = path.resolve(__dirname, './internal.test.js');
  return [
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
}