import onChange from 'on-change';

const render = (state) => {
  const urlInput = document.getElementById('url-input');
  const errorMessage = document.getElementById('error-message');

  // Очистка предыдущих сообщений об ошибках
  errorMessage.textContent = '';

  // Проверка состояния фидов
  if (state.error) {
    urlInput.classList.add('is-invalid');
    errorMessage.textContent = state.error;
  } else {
    urlInput.classList.remove('is-invalid');
  }
};

// eslint-disable-next-line no-unused-vars
const createWatchers = (state) => onChange(state, (path, value) => {
  if (path === 'feeds') {
    render(state);
  } else if (path === 'error') {
    render(state);
  }
});

const initView = (state) => {
  const watchedState = createWatchers(state);

  // Инициализация состояния
  watchedState.feeds = [];
  watchedState.error = null;

  return watchedState;
};

export default initView;
