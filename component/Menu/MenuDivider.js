import classNames from 'classnames';
import React, { Component } from 'react';

export class MenuDivider extends Component {
  render() {
    const {
      className,
      title
    } = this.props;

    if (title == null) {
      // simple divider
      return <li className={classNames('b-menu__divider', className)} />;
    }

    return (
      <li className={classNames('b-menu__header', className)}>
        <h6>{title}</h6>
      </li>
    );
  }
}
