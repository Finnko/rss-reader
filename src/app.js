import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function app(i18n) {
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.querySelector('#url-input'),
    },
    fieldsError: {
      url: document.querySelector('.feedback '),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const state = onChange({
    urls: [],
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {
        url: '',
      },
    },
  }, (path, value, prevValue) => render(elements, state, path, value, prevValue));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = elements.form.url.value;

    state.form.processState = 'sending';
    state.form.processError = null;
    state.form.fields.url = inputValue;

    const schema = makeValidationSchema(i18n, state);
    validateForm(schema, state.form.fields).then((result) => {
      if (isEmpty(result)) {
        state.urls.push(state.form.fields.url);
      }
      state.form.errors = result;
      state.form.valid = isEmpty(result);
    });

    delay(1000).then(() => {
      state.form.processState = 'sent';
    });

    // try {
    //   await axios.post(routes.usersPath());
    //   state.form.processState = 'sent';
    // } catch (err) {
    //   state.form.processState = 'error';
    //   state.form.processError = errorMessages.network.error;
    //   throw err;
    // }
  });
}
