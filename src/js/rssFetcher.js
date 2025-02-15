import axios from 'axios';

// const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
//   .then((response) => {
//     if (response.status < 200 || response.status >= 300) {
//       throw new Error('networkError');
//     }
//     return response.data.contents;
//   });

const fetchRSS = (url) => {
  const urlWithDisableCache = new URL(url);
  if (!urlWithDisableCache.searchParams.has('disableCache')) {
    urlWithDisableCache.searchParams.append('disableCache', 'true');
  }
  const finalUrl = urlWithDisableCache.toString();

  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(finalUrl)}`)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error('networkError');
      }
      return response.data.contents;
    })
    .catch((error) => {
      console.error('Error fetching RSS:', error);
      throw new Error('networkError');
    });
};

export default fetchRSS;
