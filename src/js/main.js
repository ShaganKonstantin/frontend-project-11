import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import initView, { checkForUpdates, updateInterfaceTexts } from './View.js';
import resources from '../locales/locales.js';
import fetchRSS from './rssFetcher.js';
import parseRSS from './rssParser.js';

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

const state = {
  form: {
    error: null,
  },
  feeds: [],
  posts: [],
  urls: [],
  readPosts: new Set(),
};

const watchedState = initView(state);

const urlSchema = yup.string().url().required();

const validateUrl = (url) => urlSchema
  .validate(url)
  .then(() => {
    watchedState.form.error = null;
    return url;
  })
  .catch(() => {
    watchedState.form.error = 'Ссылка должна быть валидным URL';
    return null;
  });

const addFeed = (feed, posts) => {
  watchedState.feeds = [...watchedState.feeds, feed];
  watchedState.posts = [...watchedState.posts, ...posts];// Плоский массив
};

const handleSubmit = (event) => {
  event.preventDefault();
  const urlInput = document.getElementById('url-input');
  const url = urlInput.value;
  const submitButton = document.querySelector('button[type="submit"]');
  const message = document.getElementById('message');

  submitButton.disabled = true;

  if (state.urls.includes(url)) {
    watchedState.form.error = i18next.t('alreadyAdded');
    message.classList.remove('text-success');
    message.classList.add('text-danger');
    submitButton.disabled = false;
    return;
  }

  validateUrl(url).then((validatedUrl) => {
    if (!validatedUrl) {
      message.textContent = i18next.t(watchedState.form.error);
      message.classList.remove('text-success');
      message.classList.add('text-danger');
      submitButton.disabled = false;
      return;
    }

    fetchRSS(validatedUrl).then((data) => {
      const { feed, posts } = parseRSS(data);
      addFeed(feed, posts);
      state.urls.push(validatedUrl);
      urlInput.value = '';
      urlInput.focus();

      message.textContent = i18next.t('success');
      message.classList.remove('text-danger');
      message.classList.add('text-success');

      setTimeout(() => {
        message.textContent = '';
        message.classList.remove('text-success');
      }, 5000);
    });
  })
    .catch((error) => {
      console.error('Error during URL validation:', error);
      message.textContent = i18next.t('parseError');
      message.classList.remove('text-success');
      message.classList.add('text-danger');
    })
    .finally(() => {
      submitButton.disabled = false; // Разблокируем кнопку в любом случае
    });
};

const init = () => {
  updateInterfaceTexts();
  document.querySelector('.rss-form').addEventListener('submit', handleSubmit);

  setTimeout(() => checkForUpdates(state, watchedState), 5000);
};

init();
