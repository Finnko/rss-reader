/* eslint-disable no-param-reassign */
const render = ({ modalContainer }, watchedState) => {
  console.log('work render modal');
  modalContainer.querySelector('.modal-title').textContent = watchedState.modal.title;
  modalContainer.querySelector('.modal-body').textContent = watchedState.modal.description;
  modalContainer.querySelector('.btn-primary').href = watchedState.modal.link;
};

export default render;
