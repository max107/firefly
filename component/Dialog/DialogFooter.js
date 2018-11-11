import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '../Theme';
import { theme } from '../bem';

export class DialogFooter extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    children: PropTypes.any
  };

  static defaultProps = {
    children: null
  };

  render() {
    const {
      children
    } = this.props;

    return (
      <div className={theme("b-dialog__footer", this.context)}>
        {children}
      </div>
    )
  }
}
