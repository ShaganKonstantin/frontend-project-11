import onChange from 'on-change';
import i18next from 'i18next';
import fetchRSS from './rssFetcher.js';
import parseRSS from '../rssParser.js';

const renderFeeds = (feeds, feedsList) => {
  // eslint-disable-next-line no-param-reassign
  feedsList.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
    feedsList.appendChild(li);
  });
};

const renderPosts = (posts, postsList) => {
  // eslint-disable-next-line no-param-reassign
  postsList.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
    postsList.appendChild(li);
  });
};

const updateUIWithNewPosts = (newPosts) => {
  const postsList = document.getElementById('posts-list');
  newPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
    postsList.appendChild(li);
  });
};

const render = (state) => {
  const urlInput = document.getElementById('url-input');
  const message = document.getElementById('message');
  const feedsList = document.getElementById('feeds-list');
  const postsList = document.getElementById('posts-list');
  const submitButton = document.querySelector('button[type="submit"]');
  // Очистка предыдущих сообщений об ошибках
  message.textContent = '';

  // Проверка состояния фидов
  if (state.form.error) {
    urlInput.classList.add('is-invalid');
    message.textContent = i18next.t(state.form.error);
    message.classList.remove('text-success');
    message.classList.add('text-danger');
    submitButton.disabled = false;
  } else {
    urlInput.classList.remove('is-invalid');
  }

  if (state.feeds.length > 0) {
    renderFeeds(state.feeds, feedsList);
  }

  if (state.posts.length > 0) {
    renderPosts(state.posts, postsList);
  }
};

// eslint-disable-next-line no-unused-vars
const createWatchers = (state) => onChange(state, (path, value) => {
  if (path === 'feeds' || path === 'posts' || path === 'form.error') {
    render(state);
  }
});

const checkForUpdates = (state, watchedState) => {
  state.urls.forEach((url) => {
    fetchRSS(url)
      .then((data) => {
        // eslint-disable-next-line no-unused-vars
        const { feed, posts } = parseRSS(data);

        const newPosts = posts.filter(
          (post) => !state.posts.some((existingPost) => existingPost.link === post.link),
        );
        if (newPosts.length > 0) {
          // eslint-disable-next-line no-param-reassign
          watchedState.posts = [...watchedState.posts, ...newPosts];
          updateUIWithNewPosts(newPosts);
        } else {
          console.log(`No new posts for ${url}`);
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        console.error(`Fetching error for ${url}`);
      });
  });
  setTimeout(() => checkForUpdates(state, watchedState, fetchRSS, parseRSS, i18next), 5000);
};

const initView = (state) => {
  const watchedState = createWatchers(state);
  return watchedState;
};

export default initView;
export { checkForUpdates };
