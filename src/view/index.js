import renderForm from './renderForm';
import renderPosts from './renderPosts';
import renderFeeds from './renderFeeds';
import renderModal from './renderModal';

const render = (elements, watchedState, path, i18n) => {
  if (path.includes('form')) {
    renderForm(elements, watchedState, i18n);
    return;
  }

  if (path.includes('posts')) {
    renderPosts(elements, watchedState);
    return;
  }

  if (path.includes('feeds')) {
    renderFeeds(elements, watchedState);
    return;
  }

  if (path.includes('modal')) {
    renderModal(elements, watchedState);
  }
};

export default render;
