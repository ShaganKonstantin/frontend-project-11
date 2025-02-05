import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import initView from './View.js';
import resources from '../locales/locales.js';

i18next.init({
  lng: 'ru',
  fallBackLng: 'en',
  resources,
});

yup.setLocale({
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'alreadyAdded' }),
  },
  string: {
    url: () => ({ key: 'invalidURL' }),
  },
});

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

const updateInerfaceTexts = () => {
  document.title = i18next.t('title');

  const descriptionElement = document.querySelector('.lead');
  descriptionElement.textContent = i18next.t('description');

  const urlLabelElement = document.querySelector('label[for="url-input"]');
  urlLabelElement.textContent = i18next.t('urlLabel');

  const addButtonElement = document.querySelector('button[type="submit"]');
  addButtonElement.textContent = i18next.t('addButton');
};

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
  updateInerfaceTexts();
  document.querySelector('.rss-form').addEventListener('submit', handleSubmit);
};
init();
