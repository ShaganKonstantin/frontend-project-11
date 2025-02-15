import axios from 'axios';

// const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
//   .then((response) => {
//     if (response.status < 200 || response.status >= 300) {
//       throw new Error('networkError');
//     }
//     return response.data.contents;
//   });

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status < 200 || response.status >= 300) {
      console.error('Network error:', response.status, response.statusText);
      throw new Error('networkError');
    }
    return response.data.contents;
  })
  .catch((error) => {
    console.error('fetchRSS error:', error);
    throw error;
  });

export default fetchRSS;
