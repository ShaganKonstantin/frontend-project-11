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

// ПОПРОБОВАТЬ
// import axios from 'axios';

// const fetchRSS = (url) => {
//   return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
//     .then((response) => {
//       // Проверка на ошибки HTTP
//       if (response.status >= 400) {
//         if (response.status >= 500) {
//           throw new Error('serverError'); // Ошибка сервера
//         } else {
//           throw new Error('httpError'); // Другие HTTP ошибки
//         }
//       }

//       // Проверка содержимого ответа
//       if (!response.data.contents || response.data.contents.trim() === '') {
//         throw new Error('parseError'); // Если содержимое пустое или некорректное
//       }

//       return response.data.contents; // Возвращаем содержимое для парсинга
//     })
//     .catch((error) => {
//       // Проверка на ошибки сети
//       if (error.code === 'ERR_NETWORK') {
//         console.error('Сетевая ошибка:', error);
//         throw new Error('networkError'); // Сетевая ошибка
//       }

//       console.error('Ошибка запроса:', error);
//       throw error; // Проброс других ошибок
//     });
// };

// export default fetchRSS;

// ЭТО В ХЭНДЛЕР
// .catch((error) => {
//   const message = document.getElementById('message');
//   if (error.message === 'networkError') {
//     message.textContent = i18next.t('networkError'); // Сообщение об ошибке сети
//     message.classList.remove('text-success');
//     message.classList.add('text-danger');
//   } else if (error.message === 'serverError') {
//     message.textContent = i18next.t('serverError'); // Сообщение об ошибке сервера
//     message.classList.remove('text-success');
//     message.classList.add('text-danger');
//   } else if (error.message === 'httpError') {
//     message.textContent = i18next.t('httpError'); // Сообщение об общей HTTP ошибке
//     message.classList.remove('text-success');
//     message.classList.add('text-danger');
//   } else if (error.message === 'parseError') {
//     message.textContent = i18next.t('parseError'); // Сообщение о невалидном RSS
//     message.classList.remove('text-success');
//     message.classList.add('text-danger');
//   } else {
//     message.textContent = i18next.t('unknownError'); // Сообщение о неизвестной ошибке
//     message.classList.remove('text-success');
//     message.classList.add('text-danger');
//   }
// });
