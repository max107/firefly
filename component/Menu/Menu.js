import React, { Component } from 'react';
import classNames from 'classnames';

export class Menu extends Component {
  render() {
    const {
      className,
      children,
      ulRef,
      ...htmlProps
    } = this.props;

    const classes = classNames('b-menu', className);

    return (
      <ul {...htmlProps} className={classes} ref={ulRef}>
        {children}
      </ul>
    );
  }
}
