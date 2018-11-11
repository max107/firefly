import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { H1 } from '../Heading';
import { Icon } from '../Icon';
import { bem } from '../bem';

export class NonIdealState extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    modifiers: PropTypes.any
  };

  static defaultProps = {
    icon: 'Target',
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
      <div className='non-ideal-state'>
        <Icon
          className={bem(cx('non-ideal-state__icon'), modifiers)}
          icon={icon} />

        <H1>{title}</H1>
        {text && <div className='non-ideal-state__text'>
          {text}
        </div>}
      </div>
    );
  }
}
