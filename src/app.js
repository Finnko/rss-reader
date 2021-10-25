import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';
import makeRequest from './api/makeRequest';
import parseRssData from './parser';


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
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = onChange({
    urls: [],
    posts: [],
    feeds: [],
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

    validateForm(schema, state.form.fields)
      .then((result) => {
        state.form.errors = result;
        state.form.valid = isEmpty(result);
      })
      .then(() => {
        if (!state.form.valid) {
          state.form.processState = 'sent';
          return Promise.reject(new Error('Form is not valid'));
        }

        state.urls.push(state.form.fields.url);
        const requests = state.urls.map(makeRequest);

        return Promise.all(requests);
      })
      .then((info) => {
        state.form.processState = 'sent';
        const { feed, posts } = parseRssData(info);
        state.posts = state.posts.concat(posts);
        state.feeds = [...state.feeds, feed];
      })
      .catch((err) => {
        // обработка общая?
      });
  });
}
