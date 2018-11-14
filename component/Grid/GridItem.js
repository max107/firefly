import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { bem } from '..';

export class GridItem extends Component {
  static propTypes = {
    every: PropTypes.number.isRequired,
    modifiers: PropTypes.any,
    children: PropTypes.any
  };

  static defaultProps = {
    modifiers: [
      'padding'
    ],
    children: null
  };

  render() {
    const { children, className, every, modifiers } = this.props;

    const base = bem('b-grid__item', `every-${every}`, modifiers);

    return (
      <div className={cx(base, className)}>
        {children}
      </div>
    )
  }
}