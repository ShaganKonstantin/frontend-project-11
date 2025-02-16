// import axios from 'axios';

// const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
//   .then((response) => {
//     console.log('Full response:', response);
//     if (response.status < 200 || response.status >= 300) {
//       console.error('Network error:', response.status, response.statusText);
//       throw new Error('networkError');
//     }

//     if (!response.data.contents) {
//       throw new Error('parseError'); // Если нет содержимого, выбрасываем ошибку
//     }
//     return response.data.contents;
//   })
//   .catch((error) => {
//     console.error('fetchRSS error:', error);
//     throw error;
//   });

// export default fetchRSS;
import axios from 'axios';

const fetchRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('networkError');
    }

    // Проверяем содержимое ответа
    if (!response.data.contents || response.data.contents.trim() === '') {
      throw new Error('parseError'); // Если содержимое пустое или некорректное
    }

    return response.data.contents;
  })
  .catch((error) => {
    console.error('fetchRSS error:', error);
    throw error;
  });

export default fetchRSS;
