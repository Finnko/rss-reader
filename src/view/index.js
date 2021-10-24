import renderForm from './renderForm';
import renderPosts from './renderPosts';

const render = (elements, watchedState, path, value, prevValue) => {
  console.log({path})
  if (path.includes('form')) {
    renderForm(elements, watchedState, path, value, prevValue);
    return;
  }

  if (path.includes('posts')) {
    renderPosts(elements, watchedState, path, value, prevValue);
    return;
  }
};

export default render;
