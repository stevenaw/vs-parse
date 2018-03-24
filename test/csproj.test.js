'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const csproj = require('../src/csproj');

describe('csproj', () => {

  describe('#parseProject()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => csproj.parseProject('NOPE'));
    });

    it('should read as path when path provided', () => {
      const projectData = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });

    it('should read as file contents when contents provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj', { encoding: 'utf-8' });
      const projectData = csproj.parseProject(contents);

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });

    it('should read as file contents when buffer provided', () => {
      const contents = fs.readFileSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');
      const projectData = csproj.parseProject(contents);

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
      assert.isAbove(projectData.references.length, 0);
    });

    it('should have property "references"', () => {
      const projectData = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');

      assert.exists(projectData.references);
      assert.isArray(projectData.references);
    });

    it('should be array of correct shape', () => {
      const result = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj').references;

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
      const result = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj').references;

      for(let i=0; i < result.length; i++) {
        assert.isString(result[i].assemblyName);
      }
    });

    it('should parse optional props as expected', () => {
      const result = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj').references;
      const targetReference = result[2];

      assert.isString(targetReference.version);
      assert.isString(targetReference.culture);
      assert.isString(targetReference.processorArchitecture);
      assert.isString(targetReference.publicKeyToken);
      assert.isString(targetReference.hintPath);
    });

    it('should parse sample lib correctly', () => {
      const result = csproj.parseProject('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj').references;
      const targetReference = result[2];

      assert.equal(targetReference.assemblyName, 'nunit.framework');
      assert.equal(targetReference.version, '3.7.1.0');
      assert.equal(targetReference.culture, 'neutral');
      assert.equal(targetReference.processorArchitecture, 'MSIL');
      assert.equal(targetReference.publicKeyToken, '2638cd05610744eb');
      assert.equal(targetReference.hintPath, '..\\packages\\NUnit.3.7.1\\lib\\net45\\nunit.framework.dll');
    });
  });

  describe('#parsePackages()', () => {
    it('should should throw error if file doesnt exist', () => {
      assert.throws(() => csproj.parsePackages('NOPE'));
    });

    it('should return array', () => {
      const result = csproj.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config');

      assert.isArray(result);
    });

    it('should have expected length', () => {
      const result = csproj.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config');

      assert.equal(result.length, 10);

      for(let i=0; i < result.length; i++) {
        assert.isObject(result[i]);
      }
    });

    it('should be array of correct shape', () => {
      const result = csproj.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config');

      for(let i=0; i < result.length; i++) {
        assert.isObject(result[i]);

        assert.property(result[i], 'name');
        assert.property(result[i], 'version');
        assert.property(result[i], 'targetFramework');
      }
    });

    it('should parse supported props as expected', () => {
      const result = csproj.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config');

      for(let i=0; i < result.length; i++) {
        assert.isString(result[i].name);
        assert.isString(result[i].version);
        assert.isString(result[i].targetFramework);
      }
    });

    it('should parse sample lib correctly', () => {
      const result = csproj.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config');

      const nunitConsoleRunner = result[4];

      assert.equal(nunitConsoleRunner.name, 'NUnit.ConsoleRunner');
      assert.equal(nunitConsoleRunner.version, '3.7.0');
      assert.equal(nunitConsoleRunner.targetFramework, 'net452');
    });
  });

});