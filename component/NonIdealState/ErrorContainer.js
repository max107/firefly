import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from './NonIdealState';

export class ErrorContainer extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    data: PropTypes.shape({
      error: PropTypes.object
    }).isRequired
  };

  static defaultProps = {
    title: 'Ошибка'
  };

  render() {
    const {
      title,
      data
    } = this.props;

    return (
      <NonIdealState
        title={title}
        text={JSON.stringify(data.error, null, 2)} />
    );
  }
}
