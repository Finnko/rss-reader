import { clearDomNode, makeHtmlElement } from '../util';

const createPost = (post, viewedPosts, i18n) => {
  const li = makeHtmlElement('li', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const postLink = makeHtmlElement('a');
  postLink.className = viewedPosts.has(post.id) ? 'link-secondary fw-normal' : 'fw-bold';
  postLink.href = post.link;
  postLink.dataset.id = post.id;
  postLink.rel = 'noopener noreferrer';
  postLink.target = '_blank';
  postLink.textContent = post.title;

  const postButton = makeHtmlElement('button', 'btn btn-outline-primary btn-sm');
  postButton.type = 'button';
  postButton.dataset.id = post.id;
  postButton.dataset.bsToggle = 'modal';
  postButton.dataset.bsTarget = '#modal';
  postButton.textContent = i18n.t('elements.posts.viewButton');
  li.appendChild(postLink);
  li.appendChild(postButton);
  return li;
};

const createPosts = (watchedState, i18n) => {
  const ul = makeHtmlElement('ul', 'list-group border-0 rounded-0');

  watchedState.posts.forEach((post) => {
    const postLi = createPost(post, watchedState.viewedPosts, i18n);
    ul.appendChild(postLi);
  });

  return ul;
};

const createPostContainer = (watchedState, i18n) => {
  const postUl = createPosts(watchedState, i18n);
  const container = makeHtmlElement('div', 'card border-0');
  const div = makeHtmlElement('div', 'card-body');
  const h2 = makeHtmlElement('h2', 'card-title h4');
  h2.textContent = i18n.t('elements.posts.title');

  div.appendChild(h2);
  container.appendChild(div);
  container.appendChild(postUl);

  return container;
};

const render = (elements, watchedState, i18n) => {
  const posts = createPostContainer(watchedState, i18n);
  clearDomNode(elements.posts);
  elements.posts.appendChild(posts);
};

export default render;
