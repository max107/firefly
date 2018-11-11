import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from './Spinner';
import { bem } from '../bem';

export class SpinnerGlobal extends PureComponent {
  static propTypes = {
    show: PropTypes.bool
  };

  static defaultProps = {
    show: true
  };

  render() {
    const {
      show
    } = this.props;

    return (
      <div className={bem('spinner__global', { show })}>
        {show && <Spinner modifiers='white' />}
      </div>
    );
  }
}
