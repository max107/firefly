import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bem } from '../bem';
import { ThemeContext } from '../Theme';
import { theme } from '../bem';

export class DialogBody extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    modifiers: PropTypes.any,
    children: PropTypes.any
  };

  static defaultProps = {
    children: null,
    modifiers: null
  };

  render() {
    const {
      modifiers,
      children
    } = this.props;

    return (
      <div className={bem(theme('b-dialog__body', this.context), modifiers)}>
        {children}
      </div>
    );
  }
}
