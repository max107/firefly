/**
 * Measure width in pixels of a string displayed with styles provided by `className`.
 * Should only be used if measuring can't be done with existing DOM elements.
 */
export function measureTextWidth(text, className = '', containerElement = document.body) {
  if (containerElement == null) {
    return 0;
  }
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = text;
  containerElement.appendChild(span);
  const spanWidth = span.offsetWidth;
  span.remove();
  return spanWidth;
}

export function padWithZeroes(str, minLength) {
  if (str.length < minLength) {
    return `${stringRepeat('0', minLength - str.length)}${str}`;
  }
  else {
    return str;
  }
}

function stringRepeat(str, numTimes) {
  return new Array(numTimes + 1).join(str);
}
