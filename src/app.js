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

  const schema = makeValidationSchema(i18n);

  const state = onChange({
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {
        url: '',
      },
    },
  }, render(elements));

  // Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
  //   fieldElement.addEventListener('input', (e) => {
  //     const { value } = e.target;
  //     state.form.fields[fieldName] = value;
  //     const errors = validate(state.form.fields);
  //     state.form.errors = errors;
  //     state.form.valid = isEmpty(errors);
  //   });
  // });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputValue = elements.form.url.value;

    state.form.processState = 'sending';
    state.form.processError = null;
    state.form.fields.url = inputValue;

    const errors = await validateForm(schema, state.form.fields);
    state.form.errors = errors;
    state.form.valid = isEmpty(errors);

    delay(1000).then(() => {
      state.form.processState = 'sent';
    });

    console.log({state});

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
