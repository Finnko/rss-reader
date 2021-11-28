const clearDomNode = (domNode) => {
  const nodes = Array.from(domNode.children);
  nodes.forEach((node) => node.remove());
};

const makeHtmlElement = (tag, className = '') => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const addAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

export {
  clearDomNode,
  makeHtmlElement,
  addAttributes,
};
