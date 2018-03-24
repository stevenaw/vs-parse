'use strict';

const assert = require('chai').assert;
const lib = require('../src/lib');

describe('lib', () => {

  describe('#parseSemver()', () => {
    const testCases = [
      {input: null, output: null},
      {input: undefined, output: null},
      {input: '', output: null},
      {input: ' ', output: null},
      {input: 'null', output: null},
      {input: '1.2', output: null},
      {input: '1.2.3.4', output: '1.2.3'},
      {input: '1.2.3', output: '1.2.3'},
      {input: '1.2.0', output: '1.2.0'},
      {input: '1.0.0', output: '1.0.0'}
    ];

    for(let i=0; i < testCases.length; i++) {
      const testCase = testCases[i];

      it(`should parse '${testCase.input}' as '${testCase.output}'`, () => {
        const actualOutput = lib.parseSemver(testCase.input);

        if(actualOutput) {
          assert.isObject(actualOutput);
          assert.equal(actualOutput.version, testCase.output);
        } else {
          assert.equal(actualOutput, testCase.output);
        }
      });
    }
  });
});