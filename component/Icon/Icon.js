import { cloneElement, createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as Icons from 'react-feather';

export class Icon extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.any
  };

  static defaultProps = {
    className: undefined,
    icon: null
  };

  render() {
    const {
      icon,
      className,
      ...rest
    } = this.props;

    const params = {
      className: className || 'icon'
    };

    if (icon) {
      if (typeof icon === 'string') {
        if (typeof Icons[icon] === 'undefined') {
          return null;
        }

        return createElement(Icons[icon], { ...params, ...rest });
      }

      return cloneElement(icon, { ...params, ...rest });
    }

    return null;
  }
}
