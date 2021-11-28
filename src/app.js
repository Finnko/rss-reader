/* eslint-disable no-param-reassign */

import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId';
import differenceBy from 'lodash/differenceBy';
import render from './view';
import { makeValidationSchema, validateForm } from './validation';
import makeRequest from './api/makeRequest';
import parseRssData from './parser';

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
    formFeedback: document.querySelector('.feedback'),
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
      error: null,
    },
    modal: {},
  }, (path) => render(elements, state, path, i18n));

  startPolling(state);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    state.form.processState = 'sending';

    const url = formData.get('url').trim();
    const feedUrls = state.feeds.map((feed) => feed.url);
    const schema = makeValidationSchema(i18n, feedUrls);

    validateForm(schema, url)
      .then(() => makeRequest(url))
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

        state.feeds = [{ ...feed, id: feedId, url }, ...state.feeds];
        state.posts.list = [...normalizedPosts, ...state.posts.list];
      })
      .catch((err) => {
        state.form.error = err;
        state.form.processState = 'error';
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
