import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export class Segment extends PureComponent {
  static propTypes = {
    interactive: PropTypes.bool
  };

  static defaultProps = {
    interactive: false,
    elevation: 1
  };

  render() {
    const {
      elevation,
      interactive,
      className,
      ...rest
    } = this.props;

    const classes = cx('b-segment', {
      'b-segment--interactive': interactive
    }, elevation && `b-segment--elevation-${elevation}`, className);

    return (
      <div className={classes} {...rest} />
    );
  }
}
