import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('parseError');
    }

    if (!response.data.contents || response.data.contents.trim() === '') {
      throw new Error('parseError');
    }

    return response.data.contents;
  })
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
