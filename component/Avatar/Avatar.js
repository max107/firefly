import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import gravatar from 'firefly-gravatar';

export class Avatar extends PureComponent {
  static propTypes = {
    email: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: null
  };

  render() {
    const {
      email,
      className,
      ...rest
    } = this.props;

    return (
      <img
        alt={email}
        className={cx('b-avatar', className)}
        src={gravatar(email)}
        {...rest} />
    );
  }
}
