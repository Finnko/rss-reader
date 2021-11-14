import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import uniqueId from 'lodash/uniqueId';
import differenceBy from 'lodash/differenceBy';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';
import makeRequest from './api/makeRequest';
import parseRssData from './parser';
import errorTypes from './const';
import { transformError } from './util';

const REQUEST_TIME = 5000; // ms

const startPolling = (state) => {
  setTimeout(() => {
    const requests = state.feeds.map(({ url }) => makeRequest(url));

    Promise.all(requests)
      .then((streams) => {
        streams.forEach((stream) => {
          const { feed, posts } = parseRssData(stream);
          const { id: feedId } = state.feeds.find(({ title }) => title === feed.title);
          const diff = differenceBy(posts, state.posts.list, 'link');

          if (diff.length > 0) {
            const normalizedPosts = diff.map((post) => ({
              ...post,
              feedId,
              id: uniqueId(),
            }));

            // eslint-disable-next-line no-param-reassign
            state.posts.list = [...normalizedPosts, ...state.posts.list];
          }
        });
      })
      .finally(() => startPolling(state));
  }, REQUEST_TIME);
};

// const poll = async ({ fn, validate, interval, maxAttempts }) => {
//   let attempts = 0;
//
//   const executePoll = async (resolve, reject) => {
//     const result = await fn();
//     attempts++;
//
//     if (validate(result)) {
//       return resolve(result);
//     } else if (maxAttempts && attempts === maxAttempts) {
//       return reject(new Error('Exceeded max attempts'));
//     } else {
//       setTimeout(executePoll, interval, resolve, reject);
//     }
//   };
//
//   return new Promise(executePoll);
// };

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
    modal: {
      container: document.querySelector('.modal'),
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      footerBtnOpen: document.querySelector('.btn-primary'),
    },
  };

  const state = onChange({
    urls: [],
    posts: {
      list: [],
      viewedPosts: [],
    },
    viewedPosts: [],
    feeds: [],
    form: {
      processState: 'filling',
      message: {},
      errors: {},
      fields: {
        url: '',
      },
    },
    modal: {},
  }, (path, value, prevValue) => render(elements, state, path, value, prevValue));

  startPolling(state);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = elements.form.url.value;
    state.form.processState = 'sending';
    state.form.fields.url = inputValue;

    const feedUrls = state.feeds.map((feed) => feed.url);
    const schema = makeValidationSchema(i18n, feedUrls);

    validateForm(schema, state.form.fields)
      .then(() => {
        state.form.errors = {};
        return makeRequest(state.form.fields.url);
      })
      .then((rssStream) => parseRssData(rssStream))
      .then((parsedRssData) => {
        state.form.processState = 'success';
        state.form.message = '';
        const { feed, posts } = parsedRssData;

        const feedId = uniqueId();
        const normalizedPosts = posts.map((post) => ({
          ...post,
          feedId,
          id: uniqueId(),
        }));

        state.feeds = [{ ...feed, id: feedId, url: state.form.fields.url }, ...state.feeds];
        state.posts.list = [...normalizedPosts, ...state.posts.list];
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
            state.form.errors = transformError(i18n.t('errors.unknown'));
            state.form.valid = false;
        }
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    const { id } = target.dataset;

    if (id) {
      const activePost = state.posts.find((post) => post.id === id);
      state.viewedPosts.push(id);
      state.modal = activePost;
    }
  });
}
