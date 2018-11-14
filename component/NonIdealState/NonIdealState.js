import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, H3, bem } from '..';

export class NonIdealState extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    modifiers: PropTypes.any
  };

  static defaultProps = {
    icon: 'X',
    title: null,
    text: null
  };

  render() {
    const {
      title,
      icon,
      text,
      modifiers
    } = this.props;

    return (
      <div className='b-non-ideal-state'>
        <Icon
          className={bem('b-non-ideal-state__icon', modifiers)}
          icon={icon} />
        <H3 className='b-non-ideal-state__heading'>{title}</H3>
        {text && <div className='b-non-ideal-state__text'>
          {text}
        </div>}
      </div>
    );
  }
}
