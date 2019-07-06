# Change Log

## [1.2.0](https://github.com/stevenaw/vs-parse/compare/v1.2.0...v1.2.1) (2019-07-05)
- Improve error message when a file can't be found

## [1.2.0](https://github.com/stevenaw/vs-parse/compare/v1.1.0...v1.2.0) (2019-06-26)
- Added option `dirRoot` to allow manual specification of solution/project when parsing from buffer

## [1.1.0](https://github.com/stevenaw/vs-parse/compare/v1.0.3...v1.1.0) (2019-06-01)
- Added `originalString` property on version object
- Override `toString()` on version object to return `version` property
- Fix crash when parsing invalid project file by throwing descriptive error

## [1.0.3](https://github.com/stevenaw/vs-parse/compare/v1.0.2...v1.0.3) (2019-05-04)
- Added CI testing for Node 6, 8, 10, 12
- Updated test frameworks

## [1.0.2](https://github.com/stevenaw/vs-parse/compare/v1.0.1...v1.0.2) (2018-11-04)
- Fix relative path generation of project references from solution file on Linux

## [1.0.1](https://github.com/stevenaw/vs-parse/compare/v1.0.0...v1.0.1) (2018-11-04)
- Update keywords metadata for npm package

## 1.0.0 (2018-10-21)
- First major release