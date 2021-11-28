/* eslint-disable no-param-reassign */
import { addAttributes, makeHtmlElement } from '../util';
import errorTypes from '../const';

const inputFieldAttrs = {
  id: 'url-input',
  autofocus: true,
  name: 'url',
  'aria-label': 'url',
  required: true,
  autocomplete: 'off',
};

const handleError = (error, i18n) => {
  if (error.name === errorTypes.validation) {
    return i18n.t(`errors.${error.message}`);
  }

  if (error.isAxiosError) {
    return i18n.t('errors.network');
  }

  if (error.name === errorTypes.parse) {
    return i18n.t('errors.rssInvalid');
  }

  return i18n.t('errors.unknown');
};

const createButton = (watchedState, i18n) => {
  const container = makeHtmlElement('div', 'col-auto');
  const button = makeHtmlElement('button', 'h-100 btn btn-lg btn-success px-sm-5');
  button.setAttribute('aria-label', 'add');
  button.disabled = watchedState.form.processState === 'sending';
  button.type = 'submit';
  button.textContent = i18n.t('elements.submitButton');
  container.appendChild(button);

  return container;
};

const createFormContainer = (watchedState, i18n) => {
  const col = makeHtmlElement('div', 'col');
  const container = makeHtmlElement('div', 'form-floating');
  const input = makeHtmlElement('input', 'form-control w-100');
  const label = makeHtmlElement('label');

  addAttributes(input, inputFieldAttrs);
  input.placeholder = i18n.t('elements.input.label');
  input.readOnly = watchedState.form.processState === 'sending';
  label.textContent = i18n.t('elements.input.label');
  label.htmlFor = 'url-input';

  if (watchedState.form.processState === 'error') {
    input.classList.add('is-invalid');
  }

  container.appendChild(input);
  container.appendChild(label);
  col.appendChild(container);

  return { container: col, input };
};

const renderForm = (form, watchedState, i18n) => {
  form.innerHTML = '';
  const row = makeHtmlElement('div', 'row');
  const { container, input } = createFormContainer(watchedState, i18n);
  const button = createButton(watchedState, i18n);

  row.appendChild(container);
  row.appendChild(button);
  form.appendChild(row);

  input.focus();
};

const renderFeedback = (formFeedback, watchedState, i18n) => {
  formFeedback.textContent = '';
  formFeedback.className = 'feedback m-0 position-absolute small';

  if (watchedState.form.processState === 'success') {
    formFeedback.classList.add('text-success');
    formFeedback.textContent = i18n.t('message.successDownload');
  }

  if (watchedState.form.processState === 'error') {
    formFeedback.classList.add('text-danger');
    const error = handleError(watchedState.form.error, i18n);
    formFeedback.textContent = error;
  }
};

const render = ({ form, formFeedback }, watchedState, i18n) => {
  renderForm(form, watchedState, i18n);
  renderFeedback(formFeedback, watchedState, i18n);
};

export default render;
