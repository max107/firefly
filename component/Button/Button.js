import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bem } from '../bem';
import { ButtonType } from './ButtonType';
import { Spinner, SpinnerSize } from '../Spinner';

export class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    state: PropTypes.oneOf([
      null,
      ButtonType.LOADING
    ]),
    modifiers: PropTypes.any,
    to: PropTypes.string
  };

  static defaultProps = {
    state: null,
    modifiers: [],
    className: null,
    children: null,
    to: null
  };

  render() {
    const {
      to,
      children,
      className,
      modifiers,
      state,
      ...rest
    } = this.props;

    const isLoading = state === ButtonType.LOADING;

    const base = bem('b-button', modifiers);
    const cls = bem(base, isLoading ? 'loading' : null);

    const content = isLoading ? (
      <Spinner modifiers='white' size={SpinnerSize.SMALL} />
    ) : children;

    if (to) {
      return (
        <Link
          className={cx(cls, className)}
          to={to}
          {...rest}>
          {content}
        </Link>
      );
    }

    return (
      <button
        className={cx(cls, className)}
        {...rest}>
        {content}
      </button>
    );
  }
}
