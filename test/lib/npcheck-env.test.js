/* eslint-env jest */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const {
  createEnvDirectory,
  cleanEnvDirectory
} = require('../../src/lib/npcheck-env');

jest.mock('fs');
jest.mock('child_process');

afterEach(() => {
  jest.clearAllMocks();
});

it('should create an npcheck-env directory', () => {
  // mocking necessary modules
  fs.mkdirSync.mockImplementation(() => {});
  execSync.mockImplementation(() => {});

  const pkg = 'npcheck';
  const envPath = path.resolve(process.cwd(), 'npcheck-env');

  createEnvDirectory(pkg);

  expect(fs.mkdirSync).toHaveBeenCalled();
  expect(fs.mkdirSync).toHaveBeenCalledWith(envPath);
  expect(execSync).toHaveBeenCalled();
});

it('should clean the npcheck-env directory', () => {
  // mocking necessary modules
  fs.rmdirSync.mockImplementation(() => {});
  fs.existsSync.mockImplementation(() => true);

  const envPath = path.resolve(process.cwd(), 'npcheck-env');
  cleanEnvDirectory();

  expect(fs.existsSync).toBeCalled();
  expect(fs.existsSync).toHaveBeenCalledWith(envPath);
  expect(fs.rmdirSync).toHaveBeenCalled();
  expect(fs.rmdirSync).toHaveBeenCalledWith(envPath, { recursive: true });
});

it('should not call fs.rmdirSync if npcheck-env does not exists', () => {
  // mocking necessary modules
  fs.rmdirSync.mockImplementation(() => {});
  fs.existsSync.mockImplementation(() => false);

  const envPath = path.resolve(process.cwd(), 'npcheck-env');
  cleanEnvDirectory();

  expect(fs.existsSync).toBeCalled();
  expect(fs.existsSync).toHaveBeenCalledWith(envPath);
  expect(fs.rmdirSync).toHaveBeenCalledTimes(0);
});
