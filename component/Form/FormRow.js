import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { bem } from '..';

export class FormRow extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired,
    modifiers: PropTypes.any
  };

  static defaultProps = {
    modifiers: [],
    className: null
  };

  render() {
    const {
      modifiers,
      className,
      children,
      ...rest
    } = this.props;

    return (
      <div className={cx(bem('b-form__row', modifiers), className)} {...rest}>
        {children}
      </div>
    );
  }
}
