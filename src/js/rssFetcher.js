import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`Ошибка сети: ${response.status}`);
    }
    return response.data.contents;
  });

export default fetchRSS;
