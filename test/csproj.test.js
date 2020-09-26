'use strict';

const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const csproj = require('../src/csproj');
const helpers = require('../src/internal');

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

    it('should return empty packages array from csproj when missing', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj', { encoding: 'utf-8' });
      const promise = csproj.parseProject(contents);

      return promise.then(result => {
        assert.exists(result.packages);
        assert.isArray(result.packages);
        assert.strictEqual(result.packages.length, 0);
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
    const testProjects = [ 'TestNUnit3', 'TestNUnit2', 'TestConsoleApplication', 'TestConsoleLib', 'TestPackageReference' ];

    const projectPromises = testProjects.map(projectName => {
      const fileName = `./test/data/TestConsoleApplication/${projectName}/${projectName}.csproj`;
      const syncData = csproj.parseProjectSync(fileName);
      const expectedData = fs.readJsonSync(`./test/expected/${projectName}.json`);

      return csproj.parseProject(fileName).then(asyncData => {
        const testCases = {
          sync: syncData,
          'async': asyncData
        };

        Object.keys(testCases).forEach(key => {
          const projectData = testCases[key];

          describe(`parsing basic reference properties as '${key}' for '${projectName}'`, () => {
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
              const targetReference = projectData.references.find(ref => ref.assemblyName === 'System');

              assert.isNull(targetReference.version);
              assert.isNull(targetReference.culture);
              assert.isNull(targetReference.processorArchitecture);
              assert.isNull(targetReference.publicKeyToken);
              assert.isNull(targetReference.hintPath);
            });

            describe('comparing parsed data to json', () => {
              it('should parse expected number of assembly references', () => {
                assert.equal(projectData.references.length, expectedData.references.length);
              });

              it('should match expected property values when parsed', () => {
                const propNames = [
                  'assemblyName',
                  'version',
                  'culture',
                  'processorArchitecture',
                  'publicKeyToken',
                  'hintPath'
                ];

                for(let i=0; i < projectData.references.length; i++) {
                  for(let j=0; j < propNames.length; j++) {
                    const propName = propNames[j];
                    const actualValue = projectData.references[i][propName];
                    let expectedValue = expectedData.references[i][propName];

                    if (expectedValue && propName === 'hintPath')
                      expectedValue = helpers.normalizePath(expectedValue);

                    assert.strictEqual(actualValue, expectedValue);
                  }
                }
              });
            });
          });

          describe(`parsing basic file properties as '${key}'`, () => {
            it('should parse expected number of code files', () => {
              assert.equal(projectData.codeFiles.length, expectedData.codeFiles.length);
            });

            it('should parse code files correctly', () => {
              for(let i=0; i < projectData.codeFiles.length; i++) {
                const actualValue = projectData.codeFiles[i].fileName;
                const expectedValue = helpers.normalizePath(expectedData.codeFiles[i].fileName);

                assert.strictEqual(actualValue, expectedValue);
              }
            });
          });
        });
      });
    });

    return Promise.all(projectPromises);
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
    const testProjects = [ 'TestNUnit3' ];

    const projectPromises = testProjects.map(projectName => {
      const fileName = `./test/data/TestConsoleApplication/${projectName}/packages.config`;
      const expectedData = fs.readJsonSync(`./test/expected/${projectName}.json`);
      const syncData = csproj.parsePackagesSync(fileName);

      return csproj.parsePackages(fileName).then(asyncData => {

        const testCases = {
          sync: syncData,
          'async': asyncData
        };

        Object.keys(testCases).forEach(key => {
          const packageData = testCases[key];

          describe(`parsing basic package properties as '${key}'`, () => {
            it('should return array', () => {
              assert.isArray(packageData);
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

            describe('comparing parsed data to json', () => {
              it('should parse expected number of packages', () => {
                assert.equal(packageData.length, packageData.length);
              });

              it('should match expected property values when parsed', () => {
                const propNames = [
                  'name',
                  'version',
                  'targetFramework'
                ];

                for(let i=0; i < packageData.length; i++) {
                  for(let j=0; j < propNames.length; j++) {
                    const propName = propNames[j];
                    assert.strictEqual(packageData[i][propName], expectedData.packages[i][propName]);
                  }
                }
              });
            });
          });
        });
      });
    });

    return Promise.all(projectPromises);
  });
});
