import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '..';

export class TimelineRecord extends PureComponent {
  static propTypes = {
    iconStyle: PropTypes.object,
    icon: PropTypes.string,
    children: PropTypes.any
  };

  static defaultProps = {
    iconStyle: null,
    children: null,
    icon: 'Hash'
  };

  render() {
    const {
      iconStyle,
      children,
      icon
    } = this.props;

    return (
      <div className="b-timeline__record">
        <div className="b-timeline__badge">
          <Icon
            style={iconStyle}
            className="b-timeline__icon"
            icon={icon} />
        </div>
        {children}
      </div>
    );
  }
}
