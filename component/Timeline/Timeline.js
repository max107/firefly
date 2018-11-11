import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Timeline extends PureComponent {
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
      <div className='b-timeline'>
        {children}
      </div>
    );
  }
}
