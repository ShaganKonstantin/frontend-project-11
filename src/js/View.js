import onChange from 'on-change';
import i18next from 'i18next';
import fetchRSS from './rssFetcher.js';
import parseRSS from './rssParser.js';

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

const renderPosts = (posts, postsList, watchedState) => {
  // eslint-disable-next-line no-param-reassign
  postsList.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');

    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.classList.add(watchedState.readPosts.has(post.link) ? 'fw-normal' : 'fw-bold');

    const previewButton = document.createElement('button');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.textContent = 'Просмотр';
    previewButton.dataset.postId = post.link;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';

    li.appendChild(a);
    li.appendChild(previewButton);
    postsList.appendChild(li);
  });
};

const updateUIWithNewPosts = (newPosts, watchedState) => {
  const postsList = document.getElementById('posts-list');
  newPosts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

    const a = document.createElement('a');

    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    // a.classList.add('fw-bold');//новые посты всегда жЫрные
    a.classList.add(watchedState.readPosts.has(post.link) ? 'fw-normal' : 'fw-bold');

    const previewButton = document.createElement('button');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.textContent = 'Просмотр';
    previewButton.dataset.postId = post.link;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';

    li.appendChild(a);
    li.appendChild(previewButton);
    postsList.appendChild(li);
  });
};

const render = (state, watchedState) => {
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
    renderPosts(state.posts, postsList, watchedState);
  }

  // Слушатель для кнопки предпросмотра
  postsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-outline-primary')) {
      const { postId } = event.target.dataset;
      const post = state.posts.find((p) => p.link === postId);

      if (post) {
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body > p');
        const fullArticleLink = document.querySelector('.full-article');

        modalTitle.textContent = post.title;
        modalBody.textContent = post.description;
        fullArticleLink.href = post.link;

        // Отметить пост как прочитанный
        watchedState.readPosts.add(post.link);
        event.target.previousElementSibling.classList.remove('fw-bold');
        event.target.previousElementSibling.classList.add('fw-normal');
      }
    }
  });
};

const createWatchers = (state) => {
  // eslint-disable-next-line no-unused-vars
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds' || path === 'posts' || path === 'form.error') {
      render(state, watchedState);
    }
  });
  return watchedState;
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
          updateUIWithNewPosts(newPosts, watchedState);
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
export { checkForUpdates, updateInterfaceTexts };
