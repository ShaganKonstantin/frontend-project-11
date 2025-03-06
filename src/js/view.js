/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';

const renderFeeds = (feeds, feedsList) => {
  feedsList.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
    feedsList.appendChild(li);
  });
};

const renderPosts = (posts, postsList, watchedState) => {
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
    previewButton.textContent = i18next.t('preview');
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
  console.log('Message element:', message);
  const feedsList = document.getElementById('feeds-list');
  const postsList = document.getElementById('posts-list');
  const submitButton = document.querySelector('button[type="submit"]');

  if (state.message) {
    message.textContent = i18next.t(state.message);
    message.classList.toggle('text-success', state.message === 'success');
    message.classList.toggle('text-danger', state.message !== 'success');
  } else {
    message.textContent = '';
    message.classList.remove('text-success', 'text-danger');
  }

  if (state.message === 'success') {
    urlInput.value = '';
    urlInput.focus();
  }

  if (state.form.error) {
    urlInput.classList.add('is-invalid');
    if (state.form.error === 'alreadyAdded') {
      message.textContent = i18next.t('alreadyAdded');
    } else if (state.form.error === 'invalidURL') {
      message.textContent = i18next.t('invalidURL');
    } else if (state.form.error === 'parseError') {
      message.textContent = i18next.t('parseError');
    } else if (state.form.error === 'networkError') {
      message.textContent = i18next.t('networkError');
    }
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

        watchedState.readPosts.add(post.link);
        event.target.previousElementSibling.classList.remove('fw-bold');
        event.target.previousElementSibling.classList.add('fw-normal');
      }
    }
  });
};

const createWatchers = (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds' || path === 'posts' || path === 'form.error' || path === 'message') {
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

const initView = (state) => {
  const watchedState = createWatchers(state);
  return watchedState;
};

export default initView;
export { updateInterfaceTexts };
