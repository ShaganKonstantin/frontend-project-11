import axios from 'axios';

// const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
//   .then((response) => {
//     if (response.status < 200 || response.status >= 300) {
//       throw new Error('networkError');
//     }
//     return response.data.contents;
//   });

const fetchRSS = (url) => {
  // Создаем новый объект URL из предоставленного URL
  const apiUrl = new URL('https://allorigins.hexlet.app/get');

  // Устанавливаем параметры для запроса
  apiUrl.searchParams.set('url', encodeURIComponent(url));
  apiUrl.searchParams.set('disableCache', 'true'); // Добавляем параметр disableCache

  return axios.get(apiUrl.toString())
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        console.error('Сетевая ошибка:', response.status, response.statusText);
        throw new Error('networkError');
      }
      return response.data.contents;
    })
    .catch((error) => {
      console.error('Ошибка fetchRSS:', error);
      throw error;
    });
};

export default fetchRSS;
