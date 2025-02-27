import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import i18next from 'i18next';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import initView, { updateInterfaceTexts } from './view.js';
import resources from '../locales/locales.js';
import fetchRSS from './rssFetcher.js';
import parseRSS from './rssParser.js';

const initI18next = () => i18next.init({
  lng: 'ru',
  fallbackLng: 'en',
  resources,
});

// Инициализация yup
const initYup = () => {
  yup.setLocale({
    mixed: {
      required: () => ({ key: 'required' }),
      notOneOf: () => ({ key: 'alreadyAdded' }),
    },
    string: {
      url: () => ({ key: 'invalidURL' }),
    },
  });
};

// Инициализация приложения
const initApp = () => {
  initI18next()
    .then(() => {
      initYup();

      const state = {
        form: {
          error: null,
        },
        feeds: [],
        posts: [],
        urls: [],
        readPosts: new Set(),
        message: null,
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
          watchedState.form.error = i18next.t('invalidURL');
          return null;
        });

      const addFeed = (feed, posts) => {
        watchedState.feeds = [...watchedState.feeds, feed];
        watchedState.posts = [...watchedState.posts, ...posts];
      };

      const handleSubmit = (event) => {
        event.preventDefault();
        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();
        const submitButton = document.querySelector('button[type="submit"]');

        submitButton.disabled = true;

        watchedState.form.error = null;
        state.message = null;

        if (state.urls.includes(url)) {
          watchedState.form.error = 'alreadyAdded';
          submitButton.disabled = false;
          return;
        }

        validateUrl(url)
          .then((validatedUrl) => {
            if (validatedUrl) {
              return fetchRSS(validatedUrl);
            }
            throw new Error('invalidURL');
          })
          .then((data) => parseRSS(data))
          .then(({ feed, posts }) => {
            addFeed(feed, posts);
            state.urls.push(url);

            urlInput.value = '';
            urlInput.focus();

            watchedState.message = 'success';
            setTimeout(() => {
              watchedState.message = null;
            }, 5000);
          })
          .catch((error) => {
            state.message = error.message;
            watchedState.form.error = error.message;
          })
          .finally(() => {
            submitButton.disabled = false;
          });
      };

      // Функция для периодического обновления постов
      const checkForUpdates = () => {
        state.urls.forEach((url) => {
          fetchRSS(url)
            .then((data) => {
              const { posts } = parseRSS(data);

              const newPosts = posts.filter(
                (post) => !state.posts.some((existingPost) => existingPost.link === post.link),
              );

              if (newPosts.length > 0) {
                watchedState.posts = [...state.posts, ...newPosts];
              } else {
                console.log(`No new posts for ${url}`);
              }
            })
            .catch(() => {
              console.error(`Fetching error for ${url}`);
            });
        });
        setTimeout(checkForUpdates, 5000);
      };

      const init = () => {
        updateInterfaceTexts();
        document.querySelector('.rss-form').addEventListener('submit', handleSubmit);

        setTimeout(checkForUpdates, 5000);
      };

      init();
    })
    .catch((error) => {
      console.error('Ошибка инициализации i18next:', error);
    });
};

// Запуск приложения
initApp();
