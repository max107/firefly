import React, { Component } from 'react';
import { ThemeContext } from '../Theme';
import { theme } from '../bem';

export class Divider extends Component {
  static contextType = ThemeContext;

  render() {
    return (
      <div className={theme("b-divider", this.context)} />
    );
  }
}
