import cx from 'classnames';

export function bem(base, ...mods) {
  const result = [];
  for (let i = 0; i < mods.length; i++) {
    const modifiers = cx(mods[i])
      .split(' ')
      .filter(n => n)
      .map(modifier => `${base}--${modifier}`);
    result.push(cx(base, modifiers));
  }

  return result.join(' ');
}

export function theme(base, theme) {
  return bem(base, {
    [`theme-${theme}`]: theme
  });
}

export default bem;
