import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => response.data.contents)
  .catch((error) => {
    if (error.message === 'Network Error') {
      throw new Error('networkError');
    }
  });

export default fetchRSS;
