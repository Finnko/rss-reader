/* eslint-disable no-param-reassign */

import onChange from 'on-change';
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

            state.posts.list = [...normalizedPosts, ...state.posts.list];
          }
        });
      })
      .finally(() => startPolling(state));
  }, REQUEST_TIME);
};

export default function app(i18n) {
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.querySelector('#url-input'),
    },
    formFeedback: document.querySelector('.feedback '),
    submitButton: document.querySelector('button[type="submit"]'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modalContainer: document.querySelector('.modal'),
  };

  const state = onChange({
    posts: {
      list: [],
      viewedPosts: [],
    },
    feeds: [],
    form: {
      processState: 'filling',
      feedback: '',
      errors: {},
    },
    modal: {},
  }, (path) => render(elements, state, path));

  startPolling(state);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    state.form.processState = 'sending';
    state.form.feedback = '';

    const url = formData.get('url');
    const feedUrls = state.feeds.map((feed) => feed.url);
    const schema = makeValidationSchema(i18n, feedUrls);

    validateForm(schema, url)
      .then(() => {
        state.form.errors = {};
        return makeRequest(url);
      })
      .then((rssStream) => parseRssData(rssStream))
      .then((parsedRssData) => {
        state.form.processState = 'success';
        state.form.feedback = i18n.t('message.successDownload');

        const { feed, posts } = parsedRssData;

        const feedId = uniqueId();
        const normalizedPosts = posts.map((post) => ({
          ...post,
          feedId,
          id: uniqueId(),
        }));

        state.feeds = [{ ...feed, id: feedId, url }, ...state.feeds];
        state.posts.list = [...normalizedPosts, ...state.posts.list];
      })
      .catch((err) => {
        state.form.processState = 'error';

        switch (err.name) {
          case errorTypes.validation:
            state.form.errors = keyBy(err.inner, 'path');
            break;
          case errorTypes.network:
            state.form.errors = transformError(i18n.t('errors.network'));
            break;
          case errorTypes.parse:
            state.form.errors = transformError(i18n.t('errors.rssInvalid'));
            break;
          default:
            state.form.errors = transformError(i18n.t('errors.unknown'));
        }
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    const { id } = target.dataset;

    if (id) {
      const activePost = state.posts.list.find((post) => post.id === id);
      state.posts.viewedPosts.push(id);
      state.modal = activePost;
    }
  });
}
