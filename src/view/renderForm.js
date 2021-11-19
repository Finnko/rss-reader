/* eslint-disable no-param-reassign */
import has from 'lodash/has';

const handleProcessState = ({ submitButton, fields }, processState) => {
  switch (processState) {
    case 'success':
      submitButton.disabled = false;
      fields.url.disabled = false;
      fields.url.value = '';
      fields.url.focus();
      break;
    case 'error':
      submitButton.disabled = false;
      fields.url.disabled = false;
      break;
    case 'sending':
      submitButton.disabled = true;
      fields.url.disabled = true;
      break;
    case 'filling':
      submitButton.disabled = false;
      fields.url.disabled = false;
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderFeedback = ({ formFeedback }, value) => {
  formFeedback.classList.remove('text-danger', 'text-success');
  formFeedback.classList.add('text-success');
  formFeedback.textContent = value;
};

const renderErrors = (elements, errors, prevErrors) => {
  elements.formFeedback.classList.remove('text-danger', 'text-success');
  elements.formFeedback.classList.add('text-danger');

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName];
    const fieldHadError = has(prevErrors, fieldName);
    const fieldHasError = has(errors, fieldName);

    if (!fieldHadError && !fieldHasError) {
      return;
    }

    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid');
      elements.formFeedback.textContent = '';
      return;
    }

    if (fieldHadError && fieldHasError) {
      elements.formFeedback.textContent = error.message;
      return;
    }

    fieldElement.classList.add('is-invalid');
    elements.formFeedback.classList.add('text-danger');
    elements.formFeedback.textContent = error.message;
  });
};

const render = (elements, watchedState, path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;
    case 'form.feedback':
      renderFeedback(elements, value);
      break;
    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;
    default:
      break;
  }
};

export default render;
