const renderOverlay = () => (
  document.body.insertAdjacentHTML('beforeend', '<div class="fade modal-backdrop show"></div>')
);

const openModal = ({ modal }, activePost) => {
  modal.container.style.display = 'block';
  modal.container.classList.add('show');
  modal.title.textContent = activePost.title;
  modal.body.textContent = activePost.description;
  modal.footerBtnOpen.href = activePost.link;
  renderOverlay();
};

const handleProcessState = (elements, watchedState, processState) => {
  switch (processState) {
    case 'closed':
      break;
    case 'opened':
      openModal(elements, watchedState.activePost);
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};


const render = (elements, watchedState, path, value, prevValue) => {
  switch (path) {
    case 'modal.processState':
      handleProcessState(elements, watchedState, value);
      break;
    default:
      break;
  }
};

export default render;
