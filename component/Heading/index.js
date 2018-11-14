import React from 'react';
import cx from 'classnames';
import { bem } from '../bem';

export const H1 = ({ children, modifiers, className, ...rest }) => (
  <h1 className={cx(bem('b-heading', 'xxlarge', modifiers), className)} {...rest}>{children}</h1>
);

export const H2 = ({ children, modifiers, className, ...rest }) => (
  <h2 className={cx(bem('b-heading', 'xlarge', modifiers), className)} {...rest}>{children}</h2>
);

export const H3 = ({ children, modifiers, className, ...rest }) => (
  <h3 className={cx(bem('b-heading', 'large', modifiers), className)} {...rest}>{children}</h3>
);

export const H4 = ({ children, modifiers, className, ...rest }) => (
  <h4 className={cx(bem('b-heading', 'medium', modifiers), className)} {...rest}>{children}</h4>
);

export const H5 = ({ children, modifiers, className, ...rest }) => (
  <h5 className={cx(bem('b-heading', 'small', modifiers), className)} {...rest}>{children}</h5>
);

export const H6 = ({ children, modifiers, className, ...rest }) => (
  <h6 className={cx(bem('b-heading', 'xsmall', modifiers), className)} {...rest}>{children}</h6>
);
