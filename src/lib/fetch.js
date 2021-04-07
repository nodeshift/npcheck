const axios = require('axios');

const cache = new Map();

const fetchGithub = async (target, token, override = false) => {
  // check if we already have the response in cache
  if (cache.has(target)) return cache.get(target);

  const github = 'https://api.github.com';
  const url = override ? target : `${github}${target}`;
  const options = {
    headers: {
      Authorization: token ? `token ${token}` : ''
    }
  };
  const response = await axios.get(url, options);
  // save response in cache for future usage
  cache.set(target, response);
  return response.data;
};

module.exports = { fetchGithub };
