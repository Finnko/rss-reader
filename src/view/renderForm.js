/* eslint-disable no-param-reassign */
import has from 'lodash/has';

const handleProcessState = ({ submitButton, fields }, processState) => {
  switch (processState) {
    case 'success':
      submitButton.disabled = false;
      fields.url.value = '';
      fields.url.focus();
      break;
    case 'error':
      submitButton.disabled = false;
      break;
    case 'sending':
      submitButton.disabled = true;
      break;
    case 'filling':
      submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderErrors = (elements, errors, prevErrors) => {
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName];
    const fieldHadError = has(prevErrors, fieldName);
    const fieldHasError = has(errors, fieldName);

    if (!fieldHadError && !fieldHasError) {
      return;
    }

    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid');
      elements.fieldsError[fieldName].textContent = '';
      return;
    }

    if (fieldHadError && fieldHasError) {
      elements.fieldsError[fieldName].textContent = error.message;
      return;
    }

    fieldElement.classList.add('is-invalid');
    elements.fieldsError[fieldName].textContent = error.message;
  });
};

const render = (elements, watchedState, path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;
    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;
    default:
      break;
  }
};

export default render;
