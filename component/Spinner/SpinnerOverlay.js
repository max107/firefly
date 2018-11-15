import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bem } from '../bem';
import { Spinner } from './Spinner';

export class SpinnerOverlay extends Component {
  static propTypes = {
    children: PropTypes.any,
    show: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ])
  };

  static defaultProps = {
    children: null,
    show: false
  };

  render() {
    const {
      children,
      show
    } = this.props;

    return (
      <div className={bem('b-spinner-overlay', { show })}>
        {children}
        {Boolean(show) && <Spinner modifiers='overlay' />}
      </div>
    );
  }
}
