import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';
import makeRequest from './api/makeRequest';
import parseRssData from './parser';
import errorTypes from './const';
import transformError from './util';


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
      .then(() => {
        state.urls.push(state.form.fields.url);
        const requests = state.urls.map(makeRequest);

        return Promise.all(requests);
      })
      .then((rssStreams) => {
        state.form.processState = 'sent';

        const { feed, posts } = parseRssData(rssStreams);
        state.posts = state.posts.concat(posts);
        state.feeds = [...state.feeds, feed];
      })
      .catch((err) => {
        state.form.processState = 'error';

        switch (err.name) {
          case errorTypes.validation:
            state.form.errors = keyBy(err.inner, 'path');
            state.form.valid = isEmpty(err);
            break;
          case errorTypes.network:
            state.form.errors = transformError(i18n.t('errors.network'));
            state.form.valid = false;
            break;
          case errorTypes.parse:
            state.form.errors = transformError(i18n.t('errors.rssInvalid'));
            state.form.valid = false;
            break;
          default:
            throw new Error(`Unknown error: ${err}`);
        }
      });
  });
}
