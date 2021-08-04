/* eslint-env jest */

const axios = require('axios');
const network = require('../../src/lib/network');

jest.mock('axios');

afterEach(() => {
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

  await network.fetchGithub('https://sample.com/test/test', null, true);
  network.clearCache();

  expect(axios.get).toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledWith('https://sample.com/test/test', {
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
  network.clearCache();

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

  await network.fetchGithub('https://sample.com/test/test');
  await network.fetchGithub('https://sample.com/test/test');

  expect(axios.get).toHaveBeenCalledTimes(1);
});
