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
  const ul = makeHtmlElement('li', 'list-group border-0 rounded-0');
  feedsData.forEach((feed) => {
    const feedLi = createFeed(feed);
    ul.appendChild(feedLi);
  });

  return ul;
};

const createFeedContainer = (feedsData) => {
  const feedsUl = createFeeds(feedsData);
  const container = makeHtmlElement('div', 'card border-0');
  container.insertAdjacentHTML('beforeend', (
    `<div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
    </div>`));

  container.appendChild(feedsUl);

  return container;
};

const render = (elements, watchedState) => {
  const feeds = createFeedContainer(watchedState.feeds);
  clearDomNode(elements.feeds);
  elements.feeds.appendChild(feeds);
};

export default render;
