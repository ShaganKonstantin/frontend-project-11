import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('networkError');
    }
    return response.data.contents;
  });

export default fetchRSS;
