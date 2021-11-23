const transformError = (message) => ({ url: { message } });

const clearDomNode = (domNode) => {
  const nodes = Array.from(domNode.children);
  nodes.forEach((node) => node.remove());
};

const makeHtmlElement = (tag, className = '') => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

export { transformError, clearDomNode, makeHtmlElement };
