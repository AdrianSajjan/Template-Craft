export function createFactory<T, R extends any[]>(_class: new (...args: R) => T, ...args: R): T {
  return new _class(...args);
}

export function toFixed(value: number, decimal = 2) {
  return +value.toFixed(decimal);
}

export function toPreservedFixed(value: number, decimal = 2) {
  const expression = createFactory(RegExp, "^-?\\d+(?:.\\d{0," + decimal + "})?");
  const result = value.toString().match(expression);
  return !result || !result.length ? value : +result.at(0)!;
}
