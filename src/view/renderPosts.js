import { clearDomNode, makeHtmlElement } from '../util';

const createPost = (post, { viewedPosts }) => {
  const li = makeHtmlElement('li', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const postLink = makeHtmlElement('a');
  postLink.className = viewedPosts.includes(post.id) ? 'link-secondary fw-normal' : 'fw-bold';
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
  postButton.textContent = 'Просмотр';
  li.appendChild(postLink);
  li.appendChild(postButton);
  return li;
};

const createPosts = (watchedState) => {
  const ul = makeHtmlElement('ul', 'list-group border-0 rounded-0');

  watchedState.posts.list.forEach((post) => {
    const postLi = createPost(post, watchedState.posts);
    ul.appendChild(postLi);
  });

  return ul;
};

const createPostContainer = (watchedState) => {
  const postUl = createPosts(watchedState);
  const container = makeHtmlElement('div', 'card border-0');
  container.insertAdjacentHTML('beforeend', (
    `<div class="card-body">
        <h2 class="card-title h4">Посты</h2>
     </div>`));

  container.appendChild(postUl);

  return container;
};

const render = (elements, watchedState) => {
  const posts = createPostContainer(watchedState);
  clearDomNode(elements.posts);
  elements.posts.appendChild(posts);
};

export default render;
