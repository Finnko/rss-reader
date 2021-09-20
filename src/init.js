// @ts-check

import Example from './Example.js';

export default () => {
  const element = document.getElementById('app');
  const obj = new Example(element);
  obj.init();
};
