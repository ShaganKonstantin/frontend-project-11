import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => response.data.contents)
  .catch((error) => {
    console.error('fetchRSS error:', error);
    if (error.message === 'Network Error') {
      throw new Error('networkError');
    } else if (error.message === 'parseError') {
      throw new Error('parseError');
    } else {
      throw new Error('unknownError');
    }
  });

export default fetchRSS;
