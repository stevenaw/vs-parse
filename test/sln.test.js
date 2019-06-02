'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const sln = require('../src/sln');

const generateTestCases = async () => {
  

  return result;
};

describe('sln', () => {
  const inputCases = {
    'path': './test/data/TestConsoleApplication/TestConsoleApplication.sln',
    contentsBuffer: fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln'),
    contentsSting: fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { encoding: 'utf-8' }),
  };

  Object.keys(inputCases).forEach(async (inputFormat) => {
    const inputData = inputCases[inputFormat];
    const ioCases = {
      sync: sln.parseSolutionSync(inputData),
      'async': await sln.parseSolution(inputData)
    };

    Object.keys(ioCases).forEach(ioMethod => {
      const solutionData = ioCases[ioMethod];


      describe(`#parseSolution() input format '${inputFormat}' as '${ioMethod}' `, () => {
        describe('parsing basic properties', () => {
          it('should have property "fileFormatVersion"', () => {
            assert.exists(solutionData.fileFormatVersion);
            assert.isString(solutionData.fileFormatVersion);
          });

          it('should parse property "fileFormatVersion" correctly', () => {
            assert.equal(solutionData.fileFormatVersion, '12.00');
          });

          it('should have property "visualStudioVersion"', () => {
            assert.exists(solutionData.visualStudioVersion);
            assert.isString(solutionData.visualStudioVersion);
          });

          it('should parse property "visualStudioVersion" correctly', () => {
            assert.equal(solutionData.visualStudioVersion, '15.0.27004.2009');
          });

          it('should have property "minimumVisualStudioVersion"', () => {
            assert.exists(solutionData.minimumVisualStudioVersion);
            assert.isString(solutionData.minimumVisualStudioVersion);
          });

          it('should parse property "minimumVisualStudioVersion" correctly', () => {
            assert.equal(solutionData.minimumVisualStudioVersion, '10.0.40219.1');
          });
        });

        describe('parsing projects', () => {
          it('should have property "projects"', () => {
            assert.exists(solutionData.projects);
            assert.isArray(solutionData.projects);
          });

          it('should have expected length', () => {
            const projects = solutionData.projects;
            assert.equal(projects.length, 6);

            for(let i=0; i < projects.length; i++) {
              assert.isObject(projects[i]);
            }
          });

          it('should be array of correct shape', () => {
            const projects = solutionData.projects;

            for(let i=0; i < projects.length; i++) {
              assert.isObject(projects[i]);

              assert.property(projects[i], 'id');
              assert.property(projects[i], 'name');
              assert.property(projects[i], 'relativePath');
              assert.property(projects[i], 'projectTypeId');
            }
          });

          it('should parse supported props as expected', () => {
            const projects = solutionData.projects;

            for(let i=0; i < projects.length; i++) {
              assert.isString(projects[i].id);
              assert.isString(projects[i].name);
              assert.isString(projects[i].relativePath);
              assert.isString(projects[i].projectTypeId);
            }
          });

          it('should parse sample lib correctly', () => {
            const projects = solutionData.projects;
            const sampleProject = projects[1];
            const expectedPath = path.join('TestNUnit3', 'TestNUnit3.csproj');

            assert.equal(sampleProject.id, '1580E0CD-6DAA-4328-92F6-2E0B0F0AB7AF');
            assert.equal(sampleProject.name, 'TestNUnit3');
            assert.equal(sampleProject.relativePath, expectedPath);
            assert.equal(sampleProject.projectTypeId, 'FAE04EC0-301F-11D3-BF4B-00C04F79EFBC');
          });

          it('should shallow parse by default', () => {
            const projects = solutionData.projects;
            
            for(let i=0; i < projects.length; i++) {
              assert.notProperty(projects[i], 'references');
              assert.notProperty(projects[i], 'codeFiles');
              assert.notProperty(projects[i], 'packages');
            }
          });
        });
      });
    });
  });


  describe('#parseSolutionSync()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => sln.parseSolutionSync('NOPE'));
    });

    it('should deep parse when requested', async () => {
      const parseOptions = { deepParse: true };
      const data = await sln.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', parseOptions);
      const result = data.projects;

      for(let i=0; i < result.length; i++) {
        if(result[i].name !== 'SolutionItems' && result[i].name !== 'nuget') {
          assert.property(result[i], 'references');
          assert.property(result[i], 'codeFiles');
          assert.property(result[i], 'packages');
        }
      }
    });
  });


  describe('#parseSolution()', () => {
    it('should should throw error if file doesnt exist', () => {
      const promise = sln.parseSolution('NOPE');
      
      return promise.catch(error => assert.isTrue(true));
    });

    it('should deep parse when requested', async () => {
      const parseOptions = { deepParse: true };
      const data = await sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln', parseOptions);
      const result = data.projects;

      for(let i=0; i < result.length; i++) {
        if(result[i].name !== 'SolutionItems' && result[i].name !== 'nuget') {
          assert.property(result[i], 'references');
          assert.property(result[i], 'codeFiles');
          assert.property(result[i], 'packages');
        }
      }
    });
  });
});