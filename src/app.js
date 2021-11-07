import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import uniqueId from 'lodash/uniqueId';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';
import makeRequest from './api/makeRequest';
import parseRssData from './parser';
import errorTypes from './const';
import { transformError } from './util';

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
    posts: [],
    viewedPosts: [],
    feeds: [],
    form: {
      processState: 'filling',
      messages: {},
      errors: {},
      fields: {
        url: '',
      },
    },
    modal: {},
  }, (path, value, prevValue) => render(elements, state, path, value, prevValue));

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
        const { feed, posts } = parsedRssData;

        const feedId = uniqueId();
        const normalizedPosts = posts.map((post) => ({
          ...post,
          feedId,
          id: uniqueId(),
        }));

        state.feeds = [{ ...feed, id: feedId, url: state.form.fields.url }, ...state.feeds];
        state.posts = [...normalizedPosts, ...state.posts];
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
