'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const sln = require('../src/sln');

describe('sln', () => {

  describe('#parseSolution()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => sln.parseSolution('NOPE'));
    });

    it('should read as path when path provided', () => {
      const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when contents provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { encoding: 'utf-8' });
      const solutionData = sln.parseSolution(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    it('should read as file contents when buffer provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln');
      const solutionData = sln.parseSolution(contents);

      assert.exists(solutionData.fileFormatVersion);
    });

    describe('#parseSolution().fileFormatVersion', () => {
      it('should have property "fileFormatVersion"', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.exists(solutionData.fileFormatVersion);
        assert.isString(solutionData.fileFormatVersion);
      });

      it('should parse property "fileFormatVersion" correctly', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.equal(solutionData.fileFormatVersion, '12.00');
      });
    });

    describe('#parseSolution().visualStudioVersion', () => {
      it('should have property "visualStudioVersion"', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.exists(solutionData.visualStudioVersion);
        assert.isString(solutionData.visualStudioVersion);
      });

      it('should parse property "visualStudioVersion" correctly', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.equal(solutionData.visualStudioVersion, '15.0.27004.2009');
      });
    });

    describe('#parseSolution().minimumVisualStudioVersion', () => {
      it('should have property "minimumVisualStudioVersion"', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.exists(solutionData.minimumVisualStudioVersion);
        assert.isString(solutionData.minimumVisualStudioVersion);
      });

      it('should parse property "minimumVisualStudioVersion" correctly', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.equal(solutionData.minimumVisualStudioVersion, '10.0.40219.1');
      });
    });

    describe('#parseSolution().projects', () => {
      it('should have property "projects"', () => {
        const solutionData = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln');

        assert.exists(solutionData.projects);
        assert.isArray(solutionData.projects);
      });

      it('should have expected length', () => {
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

        assert.equal(result.length, 6);

        for(let i=0; i < result.length; i++) {
          assert.isObject(result[i]);
        }
      });

      it('should be array of correct shape', () => {
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

        for(let i=0; i < result.length; i++) {
          assert.isObject(result[i]);

          assert.property(result[i], 'id');
          assert.property(result[i], 'name');
          assert.property(result[i], 'relativePath');
          assert.property(result[i], 'projectTypeId');
        }
      });

      it('should parse supported props as expected', () => {
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

        for(let i=0; i < result.length; i++) {
          assert.isString(result[i].id);
          assert.isString(result[i].name);
          assert.isString(result[i].relativePath);
          assert.isString(result[i].projectTypeId);
        }
      });

      it('should parse sample lib correctly', () => {
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;
        const sampleProject = result[1];

        assert.equal(sampleProject.id, '1580E0CD-6DAA-4328-92F6-2E0B0F0AB7AF');
        assert.equal(sampleProject.name, 'TestNUnit3');
        assert.equal(sampleProject.relativePath, 'TestNUnit3\\TestNUnit3.csproj');
        assert.equal(sampleProject.projectTypeId, 'FAE04EC0-301F-11D3-BF4B-00C04F79EFBC');
      });

      it('should shallow parse by default', () => {
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

        for(let i=0; i < result.length; i++) {
          assert.notProperty(result[i], 'references');
          assert.notProperty(result[i], 'codeFiles');
          assert.notProperty(result[i], 'packages');
        }
      });

      it('should shallow parse when request no deep parse', () => {
        const parseOptions = { deepParse: false };
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln').projects;

        for(let i=0; i < result.length; i++) {
          assert.notProperty(result[i], 'references');
          assert.notProperty(result[i], 'codeFiles');
          assert.notProperty(result[i], 'packages');
        }
      });

      it('should deep parse when requested', () => {
        const parseOptions = { deepParse: true };
        const result = sln.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln', parseOptions).projects;

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
});