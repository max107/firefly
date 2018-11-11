import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { bem } from '../bem';

export class Label extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    required: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    required: false
  };

  render() {
    const {
      className,
      required,
      children,
      ...rest
    } = this.props;

    return (
      <label className={cx(bem('b-label', className))} {...rest}>
        {children} {required && <span className="b-label__asterisk">*</span>}
      </label>
    );
  }
}
