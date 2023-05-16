export function createFactory<T>(_class: new (...args) => T): T {
  return new _class();
}
