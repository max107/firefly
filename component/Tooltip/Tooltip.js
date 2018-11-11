import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { Popover, PopoverInteractionKind } from '../Popover';

export class Tooltip extends PureComponent {
  static defaultProps = {
    hoverCloseDelay: 0,
    hoverOpenDelay: 100,
    transitionDuration: 100
  };

  render() {
    const {
      children,
      intent,
      popoverClassName,
      ...restProps
    } = this.props;

    const classes = classNames('b-tooltip', popoverClassName);

    return (
      <Popover
        {...restProps}
        autoFocus={false}
        canEscapeKeyClose={false}
        enforceFocus={false}
        interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
        lazy={true}
        popoverClassName={classes}>
        {children}
      </Popover>
    );
  }
}
