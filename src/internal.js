'use strict';

const fs = require('fs-extra');
const path = require('path');
const isBuffer = require('is-buffer');
const StringDecoder = require('string_decoder').StringDecoder;

const newLine = /\r|\n/g;
const defaultOptions = {
  encoding: 'utf-8'
}

const isVsFileContents = (file) => {
  // Naive way to determine if string is a path or vs proj/sln file
  return (typeof file === 'string' && newLine.test(file));
};

const getFileContentsOrFail = (file, options) => {
  return new Promise((resolve, reject) => {
    if(isVsFileContents(file)) {
      resolve(file);
      return;
    }

    const myOptions = (options && Object.assign({}, options, defaultOptions)) || defaultOptions;

    if (isBuffer(file)) {
      const decoder = new StringDecoder(myOptions.encoding);
      const result = decoder.write(file);
      resolve(result);
      return;
    }

    return fs.readFile(file, myOptions).then(
      result => resolve(result),
      err => reject(err)
    );
  });
}

const getFileContentsOrFailSync = (file, options) => {
  if(isVsFileContents(file)) {
    return file;
  }

  const myOptions = (options && Object.assign({}, options, defaultOptions)) || defaultOptions;

  if (isBuffer(file)) {
    const decoder = new StringDecoder(myOptions.encoding);
    return decoder.write(file);
  }

  try {
    return fs.readFileSync(file, myOptions);
  } catch (e) {
    if (typeof file === 'string' && !fileExists.sync(file)) {
      throw new Error('File not found: ' + file);
    } else {
      throw e;
    }
  }
}

const fileExistsSync = (filePath) => fs.pathExistsSync(filePath);
const fileExists = (filePath) => fs.pathExists(filePath);

module.exports = {
  getFileContentsOrFailSync,
  getFileContentsOrFail,
  fileExistsSync,
  fileExists
};