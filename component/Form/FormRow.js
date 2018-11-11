import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export class FormRow extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const {
      className,
      children,
      ...rest
    } = this.props;

    return (
      <div className={cx('b-form__row', className)} {...rest}>
        {children}
      </div>
    );
  }
}
