'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const sln = require('../src/sln');

describe('sln', () => {
  describe('#parseSolutionSync()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => sln.parseSolutionSync('NOPE'));
    });

    it('should read as path when path provided', () => {
      const solutionData = sln.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when contents provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { encoding: 'utf-8' });
      const solutionData = sln.parseSolutionSync(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when buffer provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln');
      const solutionData = sln.parseSolutionSync(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should shallow parse when request no deep parse', () => {
      const result = sln.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

      for(let i=0; i < result.length; i++) {
        assert.notProperty(result[i], 'references');
        assert.notProperty(result[i], 'codeFiles');
        assert.notProperty(result[i], 'packages');
      }
    });

    it('should deep parse when requested', () => {
      const parseOptions = { deepParse: true };
      const result = sln.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', parseOptions).projects;

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

    it('should read as path when path provided', async () => {
      const solutionData = await sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when contents provided', async () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { encoding: 'utf-8' });
      const solutionData = await sln.parseSolution(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when buffer provided', async () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln');
      const solutionData = await sln.parseSolution(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should shallow parse when request no deep parse', async () => {
      const data = await sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');
      const result = data.projects;

      for(let i=0; i < result.length; i++) {
        assert.notProperty(result[i], 'references');
        assert.notProperty(result[i], 'codeFiles');
        assert.notProperty(result[i], 'packages');
      }
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

  
  describe('#parseSolution sync/async parity', async () => {
    const syncData = sln.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln');
    const asyncData = await sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

    const testCases = {
      sync: syncData,
      'async': asyncData
    };

    Object.keys(testCases).forEach(key => {
      const solutionData = testCases[key];

      describe(`parsing basic properties as '${key}'`, () => {
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

      describe(`parsing projects as '${key}'`, () => {
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