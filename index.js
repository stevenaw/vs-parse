'use strict';

const lib = require('./src/lib.js');
const project = require('./src/csproj.js');
const sln = require('./src/sln.js');

module.exports = {
  parseSemver: lib.parseSemver,
  parsePackages: project.parsePackages,
  parseProject: project.parseProject,
  parseSolution: sln.parseSolution,
  parsePackagesSync: project.parsePackagesSync,
  parseProjectSync: project.parseProjectSync,
  parseSolutionSync: sln.parseSolutionSync,
};