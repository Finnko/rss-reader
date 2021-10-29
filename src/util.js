const transformError = (message) => ({ url: { message } });

const clearDomNode = (domNode) => {
  const nodes = Array.from(domNode.children);
  nodes.forEach((node) => node.remove());
};

export { transformError, clearDomNode };
