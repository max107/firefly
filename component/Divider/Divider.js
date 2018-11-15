import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bem } from '../bem';

export class Divider extends Component {
  static propTypes = {
    modifiers: PropTypes.any
  };

  static defaultProps = {
    modifiers: []
  };

  render() {
    const {
      modifiers
    } = this.props;

    return (
      <div className={bem('b-divider', modifiers)} />
    );
  }
}
