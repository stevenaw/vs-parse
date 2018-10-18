const utils = require('./utils');

const demoScenarios = {
  demoProjectParse: function (data, description) {
    const nunitVersion = data.references.find(ref => ref.assemblyName === 'nunit.framework').version;
    const runner = utils.determineNunitRunner(nunitVersion);
    const executable = utils.determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  },

  demoPackageParse: function (data, description) {
    const nunitVersion = data.find(ref => ref.name === 'NUnit.ConsoleRunner').version;
    const runner = utils.determineNunitRunner(nunitVersion);
    const executable = utils.determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  },

  demoSolutionParse: function (data, description) {
    const nunitVersion = utils.determinePackageVersions(data, 'NUnit.ConsoleRunner');
    const runner = utils.determineNunitRunner(nunitVersion);
    const executable = utils.determineNunitExecutable(nunitVersion);

    console.log(description);
    console.log(`${runner}\\tools\\${executable}\r\n`);
  }
};

module.exports = demoScenarios;