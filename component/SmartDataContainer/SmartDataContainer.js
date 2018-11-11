import React, { cloneElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spinner, SpinnerOverlay, SpinnerType } from '../Spinner';
import { NonIdealState } from '../NonIdealState';

export class SmartDataContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    spinnerType: PropTypes.oneOf([
      SpinnerType.Overlay,
      SpinnerType.Standart
    ]),
    pending: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    data: PropTypes.any,
    error: PropTypes.any
  };

  static defaultProps = {
    spinnerType: SpinnerType.Standart,
    pending: true,
    children: null,
    data: null,
    error: null
  };

  render() {
    const {
      spinnerType,
      pending,
      data,
      error,
      children
    } = this.props;

    if (error) {
      return (
        <NonIdealState
          title={error} />
      );
    }

    if (pending) {
      if (spinnerType === SpinnerType.Overlay) {
        return (
          <SpinnerOverlay show={pending}>
            {cloneElement(children, data)}
          </SpinnerOverlay>
        );
      }

      return (
        <Spinner />
      );
    }

    return cloneElement(children, data);
  }
}
