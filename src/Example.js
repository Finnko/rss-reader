// @ts-check

export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.classList.add('work');
    console.log('eha!');
  }
}
