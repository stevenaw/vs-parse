'use strict';

const os = require('os');
const parser = require('../');
const utils = require('./utils');

console.log(os.EOL + 'Dependency Parsing (asynchronous)');
console.log(         '---------------------------------')

parser.parseProject('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj')
.then(nunit2Project => {
  utils.demoScenarios.demoProjectParse(nunit2Project, 'Determine version of NUnit based on project references (NUnit 2):');
});

parser.parseProject('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj')
.then(nunit3Project => {
  utils.demoScenarios.demoProjectParse(nunit3Project, 'Determine version of NUnit based on project references (NUnit 3):');
});

parser.parsePackages('./test/data/TestConsoleApplication/TestNUnit3/packages.config')
.then(packages => {
  utils.demoScenarios.demoPackageParse(packages, 'Determine version of NUnit based on project packages:');
});

parser.parseSolution('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { deepParse: true })
.then(solution => {
  utils.demoScenarios.demoSolutionParse(solution, 'Determine version of NUnit based on solution packages:');
});
