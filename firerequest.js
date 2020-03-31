const axios = require("axios");

const getPosts = async url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
};

module.exports = { getPosts };
