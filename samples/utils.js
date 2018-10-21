const parser = require('../');

const determineNunitRunner = (version) => {
  const semver = parser.parseSemverSync(version);

  if(parseInt(semver.major, 10) < 3) {
    return `NUnit.Runners.${semver.version}`;
  } else {
    return `NUnit.ConsoleRunner.${semver.version}`;
  }
}

const determineNunitExecutable = (version, arch) => {
  const semver = parser.parseSemverSync(version);

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

module.exports = {
  determineNunitRunner,
  determineNunitExecutable,
  determinePackageVersions
};