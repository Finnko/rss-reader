import { clearDomNode } from '../util';

const renderPost = (post, { viewedPosts }) => {
  const linkClass = viewedPosts.includes(post.id) ? 'link-secondary' : 'fw-bold';
  return (`
   <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
     <a
       href=${post.link}
       class=${linkClass}
       data-id=${post.id}
       target="_blank"
       rel="noopener noreferrer"
     >
      ${post.title}
     </a>
     <button 
       type="button"
       class="btn btn-outline-primary btn-sm"
       data-id=${post.id}
       data-bs-toggle="modal"
       data-bs-target="#modal"
     >
       Просмотр
     </button>
   </li>
`);
};

const renderPosts = (watchedState) => {
  const posts = watchedState.posts.list.map((item) => renderPost(item, watchedState.posts));

  return (`
    <div class="card border-0">
       <div class="card-body">
          <h2 class="card-title h4">Посты</h2>
       </div>
       <ul class="list-group border-0 rounded-0">
        ${posts.join('\n')}
       </ul>
    </div>
  `);
};

const render = (elements, watchedState) => {
  const postsMarkup = renderPosts(watchedState);
  clearDomNode(elements.posts);
  elements.posts.insertAdjacentHTML('beforeend', postsMarkup);
};

export default render;
