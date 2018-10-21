# vs-parse

Node-based parser of Visual Studio projects/solutions.

## Modules
All functions come in synchronous and asynchronous versions. Synchronous versions are suffixed with "Sync".
Asynchronous versions return a promise which resolves to the same value as the synchronous version of a function.

### parseSolution
### parseSolutionSync
Solution file parser

```js
const parseSolution = (file, options = {}) => Promise.resolve({})
const parseSolutionSync = (file, options = {}) => {}
```

#### Examples

From a path

```js
const parser = require('vs-parse');
const solutionData = await parser.parseSolution('HelloWorld.sln');
```

From a string

```js
const parser = require('vs-parse');
const fs = require('fs');

const contents = fs.readFileSync('HelloWorld.sln', { encoding: 'utf-8' });
const solutionData = await parser.parseSolution(contents);
```

From a buffer

```js
const parser = require('vs-parse');
const fs = require('fs');

const buffer = fs.readFileSync('HelloWorld.sln');
const solutionData = await parser.parseSolution(buffer);
```

#### Sample Output

```js
const parser = require('vs-parse');
const solutionData = await parser.parseSolution('HelloWorld.sln');

console.log(solutionData);
/*
  Outputs:

  {
    fileFormatVersion: '12.00',
    visualStudioVersion: '15.0.27004.2009',
    minimumVisualStudioVersion: '10.0.40219.1',
    projects: [
      {
        id: '1580E0CD-6DAA-4328-92F6-2E0B0F0AB7AF',
        name: 'TestNUnit3',
        path: 'TestNUnit3\\TestNUnit3.csproj',
        projectTypeId: 'FAE04EC0-301F-11D3-BF4B-00C04F79EFBC'
      }
    ]
  }
*/
```

A full parse of a solution and all its dependencies can be done by passing the [`deepParse` option](#deep-parse). This will force the parser to enumerate and parse all dependent projects (as well as their dependencies). See [parseProject()](#parseproject) for details.

Example:
```js
const parser = require('vs-parse');
const solutionData = await parser.parseSolution('HelloWorld.sln' { deepParse: true });

console.log(solutionData);
/*
  Outputs:

  {
    fileFormatVersion: '12.00',
    visualStudioVersion: '15.0.27004.2009',
    minimumVisualStudioVersion: '10.0.40219.1',
    projects: [
      {
        id: '1580E0CD-6DAA-4328-92F6-2E0B0F0AB7AF',
        name: 'TestNUnit3',
        path: 'TestNUnit3\\TestNUnit3.csproj',
        projectTypeId: 'FAE04EC0-301F-11D3-BF4B-00C04F79EFBC',
        codeFiles: [
          {
            fileName: 'MyFile.cs'
          }
        ],
        packages: [
          {
            name: 'NUnit',
            version: '3.7.1',
            targetFramework: 'net452'  
          }
        ],
        references: [
          {
            assemblyName: 'nunit.framework',
            culture: 'neutral',
            hintPath: '..\packages\NUnit.3.7.1\lib\net45\nunit.framework.dll',
            processorArchitecture: 'MSIL',
            publicKeyToken: 'b035f5f7f11d50a3a',
            version: '3.7.1.0'
          }
        ]
      }
    ]
  }
*/
```

### parseProject
### parseProjectSync
Parses a project file.

```js
const parseProject = (file, options = {}) => Promise.resolve({})
const parseProjectSync = (file, options = {}) => {}
```

#### Examples

From a path

```js
const parser = require('vs-parse');
const projectData = await parser.parseProject('./TestNUnit3/TestNUnit3.csproj');
```

From a string

```js
const parser = require('vs-parse');
const fs = require('fs');

const contents = fs.readFileSync('./TestNUnit3/TestNUnit3.csproj', { encoding: 'utf-8' });
const projectData = await parser.parseProject(contents);
```

From a buffer

```js
const parser = require('vs-parse');
const fs = require('fs');

const buffer = fs.readFileSync('./TestNUnit3/TestNUnit3.csproj');
const projectData = await parser.parseProject(buffer);
```

#### Sample Output

Example:
```js
const parser = require('vs-parse');
const projectData = await parser.parseProject('./TestNUnit3/TestNUnit3.csproj');

console.log(projectData);
/*
  Outputs:

  {
    codeFiles: [
      {
        fileName: 'Class1.cs'
      }
    ],
    references: [
      {
        assemblyName: 'nunit.framework',
        culture: 'neutral',
        hintPath: '..\packages\NUnit.3.7.1\lib\net45\nunit.framework.dll',
        processorArchitecture: 'MSIL',
        publicKeyToken: 'b035f5f7f11d50a3a',
        version: '3.7.1.0'
      }
    ]
  }
*/
```

A full parse of a project and all its dependencies can be done by passing the [`deepParse` option](#deep-parse). This will force the parser to enumerate and parse all packages.

Example:
```js
const parser = require('vs-parse');
const projectData = await parser.parseProject('./TestNUnit3/TestNUnit3.csproj', { deepParse: true });

console.log(projectData);
/*
  Outputs:

  {
    codeFiles: [
      {
        fileName: 'Class1.cs'
      }
    ],
    packages: [
      {
        name: 'NUnit',
        version: '3.7.1',
        targetFramework: 'net452'  
      }
    ],
    references: [
      {
        assemblyName: 'nunit.framework',
        culture: 'neutral',
        hintPath: '..\packages\NUnit.3.7.1\lib\net45\nunit.framework.dll',
        processorArchitecture: 'MSIL',
        publicKeyToken: 'b035f5f7f11d50a3a',
        version: '3.7.1.0'
      }
    ]
  }
*/
```

### parsePackages
### parsePackagesSync
Parses a nuget package file.

```js
const parsePackages = (file, options = {}) => Promise.resolve({})
const parsePackagesSync = (file, options = {}) => {}
```

#### Examples
```js
const parser = require('vs-parse');
const packages = await parser.parsePackages('./packages.config');

console.log(packages);
/*
  Outputs:

  [
    {
      name: 'NUnit',
      version: '3.7.1',
      targetFramework: 'net452'  
    }
  ]
*/
```

### parseSemverSync
A very simple semver parser. Mostly a wrapper over standardized tools, with support for .NET-specific assembly versioning.

```js
const parser = require('vs-parse');

const versionString = '1.2.3.4';
const versionInfo = parser.parseSemverSync(versionString);

console.log(versionInfo);
/*
 Outputs:

 {
    major: '1',
    minor: '2',
    patch: '3',
    version: '1.2.3'
  }
*/
```

## Module Parser Options
An `options` object can be passed to a parsing function to customize its behaviour.

#### Deep Parse
`deepParse` - Specifying `true` will also read and parse all dependencies. Defaults to `false`.

Example: A solution is dependent on its projects, while a project is dependent on its packages.
