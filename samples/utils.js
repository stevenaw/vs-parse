'use strict';
const parser = require('../');

const determineNunitRunner = (version) => {
  const semver = parser.parseSemver(version);

  if(parseInt(semver.major, 10) < 3) {
    return `NUnit.Runners.${semver.version}`;
  } else {
    return `NUnit.ConsoleRunner.${semver.version}`;
  }
}

const determineNunitExecutable = (version, arch) => {
  const semver = parser.parseSemver(version);

  if(parseInt(semver.major, 10) < 3) {
    const archFlag = arch === 'X86' ? '-x86' : '';
    return `nunit-console${archFlag}.exe`;
  } else {
    return 'nunit3-console.exe';
  }
}

const determinePackageVersions = (solutionData, packageName) => {
  const result = solutionData.projects.reduce((result, project) => {
    const foundPackage = project.packages && project.packages.find(ref => ref.name === packageName);

    if(foundPackage && result.indexOf(foundPackage.version) === -1) {
      result.push(foundPackage.version);
    }

    return result;
  }, []);

  if(result.length === 1) {
    return result[0];
  } else {
    const message = `Could not find single version. Found ${result.length} versions instead`;
    throw new Error(message);
  }
};

const demoScenarios = {
  demoProjectParse: function (data, description) {
    const nunitVersion = data.references.find(ref => ref.assemblyName === 'nunit.framework').version;
    const runner = determineNunitRunner(nunitVersion);
    const executable = determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  },

  demoPackageParse: function (data, description) {
    const nunitVersion = data.find(ref => ref.name === 'NUnit.ConsoleRunner').version;
    const runner = determineNunitRunner(nunitVersion);
    const executable = determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  },

  demoSolutionParse: function (data, description) {
    const nunitVersion = determinePackageVersions(data, 'NUnit.ConsoleRunner');
    const runner = determineNunitRunner(nunitVersion);
    const executable = determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  }
};

module.exports = {
  determineNunitRunner,
  determineNunitExecutable,
  determinePackageVersions,
  demoScenarios,
};