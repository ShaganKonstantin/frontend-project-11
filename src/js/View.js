import onChange from 'on-change';
import i18next from 'i18next';

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

const renderPosts = (posts, postList) => {
  // eslint-disable-next-line no-param-reassign
  postList.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
    postList.appendChild(li);
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

const initView = (state) => {
  const watchedState = createWatchers(state);
  return watchedState;
};

export default initView;
