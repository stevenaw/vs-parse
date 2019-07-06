'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const csproj = require('../src/csproj');

describe('csproj', () => {
  describe('#parseProjectSync()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => csproj.parseProjectSync('NOPE'));
    });

    it('should read as path when path provided', () => {
      const projectData = csproj.parseProjectSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });

    it('should read as file contents when contents provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj', { encoding: 'utf-8' });
      const projectData = csproj.parseProjectSync(contents);

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });

    it('should read as file contents when buffer provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');
      const projectData = csproj.parseProjectSync(contents);

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });
  });

  describe('#parseProject()', () => {
    it('should should reject promise if file doesnt exist', () => {
      const promise = csproj.parseProject('NOPE');
      
      return promise.catch(error => assert.isTrue(true));
    });

    it('should read as path when path provided', () => {
      const promise = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');
      
      return promise.then(result => {
        assert.exists(result.references);
        assert.isArray(result.references);
        assert.isAbove(result.references.length, 0);
      });
    });

    it('should read as file contents when contents provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj', { encoding: 'utf-8' });
      const promise = csproj.parseProject(contents);

      return promise.then(result => {
        assert.exists(result.references);
        assert.isArray(result.references);
        assert.isAbove(result.references.length, 0);
      });
    });

    it('should read as file contents when buffer provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');
      const promise = csproj.parseProject(contents);

      return promise.then(result => {
        assert.exists(result.references);
        assert.isArray(result.references);
        assert.isAbove(result.references.length, 0);
      });
    });
  });

  describe('#parseProject sync/async parity', () => {
    const fileName = './test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj';
    const syncData = csproj.parseProjectSync(fileName);

    return csproj.parseProject(fileName).then(asyncData => {
      const testCases = {
        sync: syncData,
        'async': asyncData
      };

      Object.keys(testCases).forEach(key => {
        const projectData = testCases[key];

        describe(`parsing basic properties as '${key}'`, () => {
          it('should have property "references"', () => {
            assert.exists(projectData.references);
            assert.isArray(projectData.references);
          });

          it('should be array of correct shape', () => {
            const result = projectData.references;

            for(let i=0; i < result.length; i++) {
              assert.isObject(result[i]);

              assert.property(result[i], 'assemblyName');
              assert.property(result[i], 'version');
              assert.property(result[i], 'culture');
              assert.property(result[i], 'processorArchitecture');
              assert.property(result[i], 'publicKeyToken');
              assert.property(result[i], 'hintPath');
            }
          });

          it('should parse required props as expected', () => {
            const result = projectData.references;

            for(let i=0; i < result.length; i++) {
              assert.isString(result[i].assemblyName);
            }
          });

          it('should parse optional props as expected', () => {
            const result = projectData.references;
            const targetReference = result[2];

            assert.isString(targetReference.version);
            assert.isString(targetReference.culture);
            assert.isString(targetReference.processorArchitecture);
            assert.isString(targetReference.publicKeyToken);
            assert.isString(targetReference.hintPath);
          });

          it('should parse sample lib reference correctly', () => {
            const targetReference = projectData.references[2];
            const expectedHintPath = path.join('..', 'packages', 'NUnit.3.7.1', 'lib', 'net45', 'nunit.framework.dll');

            assert.equal(targetReference.assemblyName, 'nunit.framework');
            assert.equal(targetReference.version, '3.7.1.0');
            assert.equal(targetReference.culture, 'neutral');
            assert.equal(targetReference.processorArchitecture, 'MSIL');
            assert.equal(targetReference.publicKeyToken, '2638cd05610744eb');
            assert.equal(targetReference.hintPath, expectedHintPath);
          });

          it('should parse sample lib code file correctly', () => {
            const target = projectData.codeFiles[1];
            const expectedFilePath = path.join('Properties', 'AssemblyInfo.cs');

            assert.equal(target.fileName, expectedFilePath);
          });
        });
      });
    });
  });


  describe('#parsePackagesSync()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => csproj.parseProjectSync('NOPE'));
    });
  });
  
  describe('#parsePackages()', () => {
    it('should should reject promise if file doesnt exist', () => {
      const promise = csproj.parsePackages('NOPE');
      return promise.catch(error => assert.isTrue(true));
    });
  });

  describe('#parsePackages sync/async parity', () => {
    const fileName = './test/data/TestConsoleApplication/TestNUnit3/packages.config';
    const syncData = csproj.parsePackagesSync(fileName);

    return csproj.parsePackages(fileName).then(asyncData => {

      const testCases = {
        sync: syncData,
        'async': asyncData
      };

      Object.keys(testCases).forEach(key => {
        const packageData = testCases[key];

        describe(`parsing basic properties as '${key}'`, () => {
          it('should return array', () => {
            assert.isArray(packageData);
          });

          it('should have expected length', () => {
            assert.equal(packageData.length, 10);

            for(let i=0; i < packageData.length; i++) {
              assert.isObject(packageData[i]);
            }
          });

          it('should be array of correct shape', () => {
            for(let i=0; i < packageData.length; i++) {
              assert.isObject(packageData[i]);

              assert.property(packageData[i], 'name');
              assert.property(packageData[i], 'version');
              assert.property(packageData[i], 'targetFramework');
            }
          });

          it('should parse supported props as expected', () => {
            for(let i=0; i < packageData.length; i++) {
              assert.isString(packageData[i].name);
              assert.isString(packageData[i].version);
              assert.isString(packageData[i].targetFramework);
            }
          });

          it('should parse sample lib correctly', () => {
            const nunitConsoleRunner = packageData[4];

            assert.equal(nunitConsoleRunner.name, 'NUnit.ConsoleRunner');
            assert.equal(nunitConsoleRunner.version, '3.7.0');
            assert.equal(nunitConsoleRunner.targetFramework, 'net452');
          });
        });
      });
    });
  });
});