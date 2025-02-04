import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import * as yup from 'yup';
import initView from './View.js';

const state = initView({});

const urlSchema = yup.string().url().required();

const validateUrl = (url) => urlSchema.isValid(url).then((isValid) => {
  if (!isValid) {
    state.error = 'Некорректный URL';
    return Promise.reject();
  }

  if (state.feeds.includes(url)) {
    state.error = 'Этот URL уже добавлен';
    return Promise.reject();
  }

  state.error = null; // Сброс ошибки
  return Promise.resolve(url);
});

const addFeed = (url) => {
  state.feeds.push(url);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const urlInput = document.getElementById('url-input');

  validateUrl(urlInput.value)
    .then((url) => {
      addFeed(url);
      urlInput.value = '';
      urlInput.focus();
    })
    .catch(() => {
      // Ошибка уже обработана в validateUrl
    });
};

const init = () => {
  document.querySelector('.rss-form').addEventListener('submit', handleSubmit);
};
init();
