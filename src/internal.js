'use strict';

const fs = require('fs');
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
    const input = fs.readFileSync(file, myOptions);
    return input;
  } catch (e) {
    if (typeof file === 'string' && !fileExists.sync(file)) {
      throw new Error('File not found: ' + file);
    } else {
      throw e;
    }
  }
}

const fileExistsSync = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}

module.exports = {
  getFileContentsOrFailSync,
  fileExistsSync
};