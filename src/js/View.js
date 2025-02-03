const createErrorElement = () => {
  const errorElement = document.createElement('div');
  errorElement.classList.add('error-message');
  errorElement.style.color = 'red';
  errorElement.style.display = 'none';
  return errorElement;
};

const clearInput = (input) => {
  // eslint-disable-next-line no-param-reassign
  input.value = '';
  input.focus();
};

export { createErrorElement, clearInput };
