import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './ThemeContext';

export class ThemeProvider extends Component {
  static propTypes = {
    theme: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  };

  render() {
    const { theme, children } = this.props;

    return (
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    );
  }
}
