import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import { createErrorElement, clearInput } from './View.js';

const state = {
  form: {
    isValid: true,
    errors: '',
    url: '',
  },
  urls: [],
};

const watchedState = onChange(state, (path, value) => {
  const input = document.querySelector('#url-input');
  const errorMessage = document.querySelector('.error-message');

  if (path === 'form.errors') {
    if (value) {
      input.classList.add('is-invalid');
      errorMessage.textContent = value;
      errorMessage.style.display = 'block';
    } else {
      input.classList.remove('is-invalid');
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }
  }

  if (path === 'form.isValid' && value) {
    clearInput(input);
  }
});

const schema = yup.object({
  url: yup.string()
    .url('Ссылка должна быть валидным URL')
    .required('Поле обязательно для заполнения')
    .notOneOf(state.urls, 'RSS уже существует'),
});

const handleFormSubmit = (event) => {
  event.preventDefault();
  const input = document.querySelector('#url-input');
  const url = input.value.trim();

  schema.validate({ url })
    .then(() => {
      watchedState.urls.push(url);
      watchedState.form.errors = null;
      watchedState.form.isValid = true;
      clearInput(input);
    })
    .catch((err) => {
      watchedState.form.errors = err.message;// .message создается библиотекой yup
      watchedState.form.isValid = false;
    });
};

const init = () => {
  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', handleFormSubmit);

  const errorElement = createErrorElement();
  form.insertAdjacentElement('afterend', errorElement);
};

init();
