import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class ErrorsSummary extends PureComponent {
  static propTypes = {
    errors: PropTypes.object
  };

  static defaultProps = {
    errors: {}
  };

  render() {
    const { errors } = this.props;

    if (Object.keys(errors).length === 0) {
      return null;
    }

    const nodes = Object.values(errors).map((errs, t) => errs.map((err, i) => (
      <div key={`${t} + ${i}`} className="b-error">
        {err}
      </div>
    )));

    return (
      <div className='b-errors-summary'>
        {nodes}
      </div>
    );
  }
}
