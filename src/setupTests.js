// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom has no IntersectionObserver. This stand-in reports every watched element as visible straight away,
// which is what the reveal / rating animations need to show their final state in tests.
class VisibleIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback([{ isIntersecting: true, intersectionRatio: 1, target }], this);
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

global.IntersectionObserver = VisibleIntersectionObserver;
window.IntersectionObserver = VisibleIntersectionObserver;
