/* eslint-env jest */

const axios = require('axios');
const network = require('../../src/lib/network');

jest.mock('axios');

afterEach(() => {
  network.clearCache();
  jest.clearAllMocks();
});

it('should prepend the url with github api base', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  await network.fetchGithub('/test/test');
  network.clearCache();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('https://api.github.com/test/test', {
    headers: {
      Authorization: ''
    }
  });
});

it('should not prepend the url with github api base when override is true', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  await network.fetchGithub('https://example.test/test/test', null, true);

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('https://example.test/test/test', {
    headers: {
      Authorization: ''
    }
  });
});

it('should pass the auth token to the request header', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  const token = 'gh_123456789123456789';

  await network.fetchGithub('/test/test', token);

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('https://api.github.com/test/test', {
    headers: {
      Authorization: `token ${token}`
    }
  });
});

it('should use the cache on requests with the same target', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  const content1 = await network.fetch('https://example.test/test/test');
  const content2 = await network.fetch('https://example.test/test/test');

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith('https://example.test/test/test');
  expect(content2).toBe(content1);
});

it('should use the cache on Github API requests with the same target', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  const content1 = await network.fetchGithub('/repos/nodeshift/npcheck');
  const content2 = await network.fetchGithub('/repos/nodeshift/npcheck');

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith(
    'https://api.github.com/repos/nodeshift/npcheck',
    { headers: { 'Authorization': '' }}
  );
  expect(content2).toBe(content1);
});

it('should share cache between override and non-override Github API requests', async () => {
  // mocking axios get request
  axios.get.mockImplementation(() => {
    return {
      data: ''
    };
  });

  const content1 = await network.fetchGithub('https://api.github.com/repos/nodeshift/npcheck', null, true);
  const content2 = await network.fetchGithub('/repos/nodeshift/npcheck');

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith(
    'https://api.github.com/repos/nodeshift/npcheck',
    { headers: { 'Authorization': '' }}
  );
  expect(content2).toBe(content1);
});
