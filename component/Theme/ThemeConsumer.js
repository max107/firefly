import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './ThemeContext';

export class ThemeConsumer extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => cloneElement(children, { theme })}
      </ThemeContext.Consumer>
    );
  }
}
