const axios = require('axios');

const fetchGithub = async (target, token, override = false) => {
  const github = 'https://api.github.com';
  const url = override ? target : `${github}${target}`;
  const options = {
    headers: {
      Authorization: token || ''
    }
  };
  const response = await axios.get(url, options);
  return response.data;
};

module.exports = { fetchGithub };
