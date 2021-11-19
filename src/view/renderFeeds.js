import { clearDomNode } from '../util';

const createFeed = (feed) => (`
  <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.desc}</p>
  </li>
`);

const createFeeds = (feedsData) => {
  const feeds = feedsData.map(createFeed);

  return (`
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${feeds.join('\n')}
      </ul>
    </div>
  `);
};

const render = (elements, watchedState) => {
  const feedsMarkup = createFeeds(watchedState.feeds);
  clearDomNode(elements.feeds);
  elements.feeds.insertAdjacentHTML('beforeend', feedsMarkup);
};

export default render;
