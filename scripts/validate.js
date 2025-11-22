const showInputError = (form, input, errorMessage) => {
  try {
    const error = form.querySelector(`.${input.id}-error`);
    input.classList.add('popup__input_type_error');
    error.classList.add('popup__error_visible');
    error.textContent = errorMessage;
  } catch (err) {
    console.error(`Произошла ошибка: ${err.message}`);
  }
};

const hideInputError = (form, input) => {
  try {
    const error = form.querySelector(`.${input.id}-error`);
    input.classList.remove('popup__input_type_error');
    error.classList.remove('popup__error_visible');
    error.textContent = '';
  } catch (err) {
    console.error(`Произошла ошибка: ${err.message}`);
  }
};

const isValid = (form, input) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity('');
  }
  if (input.validity.valid) {
    hideInputError(form, input);
  } else {
    showInputError(form, input, input.validationMessage);
  }
};

const setEventListeners = (form) => {
  const inputList = Array.from(form.querySelectorAll('.popup__input'));
  const button = form.querySelector('.popup__button');
  toggleButtonState(inputList, button);
  inputList.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(form, input);
      toggleButtonState(inputList, button);
    });
  });
};

export const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((form) => setEventListeners(form));
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, button) => {
  if (hasInvalidInput(inputList)) {
    button.setAttribute('disabled', 'true');
    button.classList.add('popup__button_disabled');
  } else {
    button.removeAttribute('disabled');
    button.classList.remove('popup__button_disabled');
  }
};

export const clearValidation = (popup) => {
  const errors = popup.querySelectorAll('.popup__error_visible');
  const inputs = popup.querySelectorAll('.popup__input_type_error');
  if (errors.length > 0) {
    errors.forEach((error) => error.classList.remove('popup__error_visible'));
  }
  if (inputs.length > 0) {
    inputs.forEach((input) => input.classList.remove('popup__input_type_error'));
  }
};
