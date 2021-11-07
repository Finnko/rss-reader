const render = ({ modal }, watchedState, path, value) => {
  modal.title.textContent = value.title;
  modal.body.textContent = value.description;
  modal.footerBtnOpen.href = value.link;
};

export default render;
