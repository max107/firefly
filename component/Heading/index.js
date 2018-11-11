import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bem } from '../bem';

class Heading extends PureComponent {
  static propTypes = {
    modifiers: PropTypes.any,
    children: PropTypes.any,
    size: PropTypes.string
  };

  static defaultProps = {
    size: null,
    modifiers: null,
    children: null
  };

  render() {
    const {
      modifiers,
      children,
      size
    } = this.props;

    return (
      <h1 className={bem('b-heading', size, modifiers)}>
        {children}
      </h1>
    );
  }
}

export const H1 = ({ children, ...rest }) => (
  <Heading size='xxlarge' {...rest}>{children}</Heading>
);

export const H2 = ({ children, ...rest }) => (
  <Heading size='xlarge' {...rest}>{children}</Heading>
);

export const H3 = ({ children, ...rest }) => (
  <Heading size='large' {...rest}>{children}</Heading>
);

export const H4 = ({ children, ...rest }) => (
  <Heading size='medium' {...rest}>{children}</Heading>
);

export const H5 = ({ children, ...rest }) => (
  <Heading size='small' {...rest}>{children}</Heading>
);

export const H6 = ({ children, ...rest }) => (
  <Heading size='xsmall' {...rest}>{children}</Heading>
);
