import cx from 'classnames';
import React, { PureComponent } from 'react';
import * as Classes from '../common/classes';
import { Position } from '../common/position';
import { Icon } from '../Icon';
import { Popover, PopoverInteractionKind } from '../Popover';
import { Menu } from './Menu';

const SUBMENU_POPOVER_MODIFIERS = {
  // 20px padding - scrollbar width + a bit
  flip: { boundariesElement: 'viewport', padding: 20 },
  // shift popover up 5px so MenuItems align
  offset: { offset: -5 },
  preventOverflow: { boundariesElement: 'viewport', padding: 20 }
};

// props to ignore when disabled
const DISABLED_PROPS = {
  href: undefined,
  onClick: undefined,
  onMouseDown: undefined,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
  tabIndex: -1
};

export class MenuItem extends PureComponent {
  static defaultProps = {
    disabled: false,
    multiline: false,
    popoverProps: {},
    shouldDismissPopover: true,
    text: '',
    onClick: () => null
  };

  render() {
    const {
      active,
      className,
      children,
      disabled,
      icon,
      labelElement,
      onClick,
      shouldDismissPopover,
      text,
      ...htmlProps
    } = this.props;
    const hasSubmenu = children != null;

    const anchorClasses = cx(
      'b-menu__item',
      {
        'b-menu__item--icon-left': icon && !hasSubmenu,
        'b-menu__item--icon-left-right': icon && hasSubmenu,
        'b-menu__item--icon-right': !icon && hasSubmenu,
        'b-menu__item--active': active,
        'b-menu__item--disabled': disabled,
        // prevent popover from closing when clicking on submenu trigger or disabled item
        [Classes.POPOVER_DISMISS]: shouldDismissPopover && !disabled && !hasSubmenu
      },
      className
    );

    const target = (
      <div onClick={onClick} {...htmlProps} {...(disabled ? DISABLED_PROPS : {})} className={anchorClasses}>
        <Icon icon={icon} />
        <div className='b-menu__text'>
          {text}
        </div>
        {this.maybeRenderLabel(labelElement)}
        {hasSubmenu && <Icon icon="ArrowRight" />}
      </div>
    );

    const liClasses = cx({ [Classes.MENU_SUBMENU]: hasSubmenu });

    return (
      <li className={liClasses}>
        {this.maybeRenderPopover(target, children)}
      </li>
    );
  }

  maybeRenderLabel(labelElement) {
    const {
      label
    } = this.props;

    if (label == null && labelElement == null) {
      return null;
    }

    return (
      <span className='b-menu__label'>
        {label}
        {labelElement}
      </span>
    );
  }

  maybeRenderPopover(target, children) {
    if (children == null) {
      return target;
    }

    const {
      disabled,
      popoverProps
    } = this.props;

    return (
      <Popover
        autoFocus={false}
        captureDismiss={false}
        disabled={disabled}
        enforceFocus={false}
        hoverCloseDelay={0}
        interactionKind={PopoverInteractionKind.HOVER}
        modifiers={SUBMENU_POPOVER_MODIFIERS}
        position={Position.RIGHT_TOP}
        usePortal={false}
        {...popoverProps}
        content={<Menu>{children}</Menu>}
        minimal={true}
        popoverClassName={cx(Classes.MENU_SUBMENU, popoverProps.popoverClassName)}
        target={target}
      />
    );
  }
}
