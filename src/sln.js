'use strict';

const fs = require('fs');
const path = require('path');
const csproj = require('./csproj');
const helpers = require('./internal');

const parseMinimumVisualStudioVersion = (lineOfText) => {
  const regex = /^MinimumVisualStudioVersion = (\d+(\.\d+){3})/;
  const result = regex.exec(lineOfText);

  return result && result[1];
};

const parseVisualStudioVersion = (lineOfText) => {
  const regex = /^VisualStudioVersion = (\d+(\.\d+){3})/;
  const result = regex.exec(lineOfText);

  return result && result[1];
};

const parseFileFormatVersion = (lineOfText) => {
  const regex = /^Microsoft Visual Studio Solution File, Format Version (\d+\.\d+)/;
  const result = regex.exec(lineOfText);

  return result && result[1];
};

const parseSolutionProject = (lineOfText) => {
  const regex = /^Project\("\{([A-Z0-9]{8}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{12})\}"\) = "([^"]+)", "([^"]+)", "\{([A-Z0-9]{8}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{12})\}"/;
  const result = regex.exec(lineOfText);

  if (result) {
    return {
      id: result[4],
      name: result[2],
      relativePath: result[3],
      projectTypeId: result[1],
    }
  }
};

const parseSolution = (filePath, options) => {
  const providedOptions = options || {};
  const contents = helpers.getFileContentsOrFailSync(filePath);
  const lines = contents.replace(/\r\n/g, '\n').split('\n');

  const returnValue = {
    fileFormatVersion: undefined,
    visualStudioVersion: undefined,
    minimumVisualStudioVersion: undefined,
    projects: []
  };

  for(let i = 0; i < lines.length; i++) {
    const solutionProject = parseSolutionProject(lines[i]);
    if(solutionProject) {
      returnValue.projects.push(solutionProject);
    }

    const fileFormatVersion = parseFileFormatVersion(lines[i]);
    if(fileFormatVersion) {
      returnValue.fileFormatVersion = fileFormatVersion;
    }

    const visualStudioVersion = parseVisualStudioVersion(lines[i]);
    if(visualStudioVersion) {
      returnValue.visualStudioVersion = visualStudioVersion;
    }
    
    const minimumVisualStudioVersion = parseMinimumVisualStudioVersion(lines[i]);
    if(minimumVisualStudioVersion) {
      returnValue.minimumVisualStudioVersion = minimumVisualStudioVersion;
    }
  }

  if(providedOptions.deepParse) {    
    for(let i = 0; i < returnValue.projects.length; i++) {
      const project = returnValue.projects[i];

      if(project && project.relativePath) {
        const slnDir = path.dirname(filePath);
        const projectLocation = path.join(slnDir, project.relativePath);

        if(helpers.fileExistsSync(projectLocation)) {
          const projectData = csproj.parseProject(projectLocation, providedOptions);

          if(projectData) {
            returnValue.projects[i] = Object.assign({}, project, projectData);
          }
        }
      }
    }
  }

  return returnValue;
};

module.exports = {
  parseSolution,
};
