import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import initView, { checkForUpdates } from './View.js';
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

const validateUrl = (url) => {
  try {
    urlSchema.validateSync(url);
    watchedState.form.error = null;
    return url;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.log(error.message);
    watchedState.form.error = 'Ссылка должна быть валидным URL';
    return null;
  }
};

const updateInterfaceTexts = () => {
  document.title = i18next.t('title');

  const descriptionElement = document.querySelector('.lead');
  descriptionElement.textContent = i18next.t('description');

  const urlLabelElement = document.querySelector('label[for="url-input"]');
  urlLabelElement.textContent = i18next.t('urlLabel');

  const addButtonElement = document.querySelector('button[type="submit"]');
  addButtonElement.textContent = i18next.t('addButton');
};

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

  const validatedUrl = validateUrl(url);

  if (!validatedUrl) {
    message.textContent = i18next.t(watchedState.form.error);
    message.classList.remove('text-success');
    message.classList.add('text-danger');
    submitButton.disabled = false;
    return;
  }

  fetchRSS(validatedUrl)
    .then((data) => {
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
    })
    .catch((error) => {
      console.error('Error fetching or parsing RSS:', error);
      message.textContent = i18next.t('parseError');
      message.classList.remove('text-success');
      message.classList.add('text-danger');
    })
    .finally(() => {
      submitButton.disabled = false;
    });
};

const init = () => {
  updateInterfaceTexts();
  document.querySelector('.rss-form').addEventListener('submit', handleSubmit);

  setTimeout(() => checkForUpdates(state, watchedState), 5000);
};

init();
