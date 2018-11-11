import React, { Component } from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path-value';

export function getErrors(path, errors = []) {
  return objectPath(errors || [], path, []) || [];
}

export class Errors extends Component {
  static propTypes = {
    errors: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  };

  static defaultProps = {
    errors: []
  };

  render() {
    const {
      errors
    } = this.props;

    return (errors || []).map((err, i) => (
      <div className="error" key={i}>{err}</div>
    ));
  }
}
