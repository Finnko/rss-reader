import renderForm from './renderForm';

const render = (elements, watchedState, path, value, prevValue) => {
  if (path.includes('form')) {
    renderForm(elements, watchedState, path, value, prevValue);
    return;
  }
};

export default render;
