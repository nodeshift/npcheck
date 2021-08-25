const axios = require('axios');

const cache = new Map();
const clearCache = () => cache.clear();

const fetch = async (url) => {
  // check if we already have the response in cache
  if (cache.has(url)) return cache.get(url).data;

  const response = await axios.get(url);

  // save response in cache for future usage
  cache.set(url, response);
  return response.data;
};

const fetchGithub = async (target, token, override = false) => {
  const github = 'https://api.github.com';
  const url = override ? target : `${github}${target}`;
  // check if we already have the response in cache
  if (cache.has(url)) return cache.get(url).data;

  const options = {
    headers: {
      Authorization: token ? `token ${token}` : ''
    }
  };
  const response = await axios.get(url, options);
  // save response in cache for future usage
  cache.set(url, response);
  return response.data;
};

module.exports = { fetch, fetchGithub, cache, clearCache };
