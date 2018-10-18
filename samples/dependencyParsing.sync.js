const os = require('os');
const parser = require('../');
const scenarios = require('./dependencyParsing.scenarios');

console.log(os.EOL + 'Dependency Parsing (synchronous)');
console.log(         '---------------------------------')

const nunit2Project = parser.parseProjectSync('./test/data/TestConsoleApplication/TestNUnit2/TestNUnit2.csproj');
scenarios.demoProjectParse(nunit2Project, 'Determine version of NUnit based on project references (NUnit 2):');

const nunit3Project = parser.parseProjectSync('./test/data/TestConsoleApplication/TestNUnit3/TestNUnit3.csproj');
scenarios.demoProjectParse(nunit3Project, 'Determine version of NUnit based on project references (NUnit 3):');

const packages = parser.parsePackagesSync('./test/data/TestConsoleApplication/TestNUnit3/packages.config');
scenarios.demoPackageParse(packages, 'Determine version of NUnit based on project packages:');

const solution = parser.parseSolutionSync('./test/data/TestConsoleApplication/TestConsoleApplication.sln', { deepParse: true });
scenarios.demoSolutionParse(solution, 'Determine version of NUnit based on solution packages:');