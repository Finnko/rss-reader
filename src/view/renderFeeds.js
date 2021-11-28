import { clearDomNode, makeHtmlElement } from '../util';

const createFeed = (feed) => {
  const li = makeHtmlElement('li', 'list-group-item border-0 border-end-0');
  const h3 = makeHtmlElement('h3', 'h6 m-0');
  const p = makeHtmlElement('p', 'm-0 small text-black-50');

  h3.textContent = feed.title;
  p.textContent = feed.desc;
  li.appendChild(h3);
  li.appendChild(p);

  return li;
};

const createFeeds = (feedsData) => {
  const ul = makeHtmlElement('ul', 'list-group border-0 rounded-0');
  feedsData.forEach((feed) => {
    const feedLi = createFeed(feed);
    ul.appendChild(feedLi);
  });

  return ul;
};

const createFeedContainer = (feedsData, i18n) => {
  const feedsUl = createFeeds(feedsData);
  const container = makeHtmlElement('div', 'card border-0');
  const div = makeHtmlElement('div', 'card-body');
  const h2 = makeHtmlElement('h2', 'card-title h4');
  h2.textContent = i18n.t('elements.feeds.title');

  div.appendChild(h2);
  container.appendChild(div);
  container.appendChild(feedsUl);

  return container;
};

const render = (elements, watchedState, i18n) => {
  const feeds = createFeedContainer(watchedState.feeds, i18n);
  clearDomNode(elements.feeds);
  elements.feeds.appendChild(feeds);
};

export default render;
