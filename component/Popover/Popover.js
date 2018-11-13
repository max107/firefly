import classNames from 'classnames';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Errors from '../common/errors';
import * as Utils from '../utils/utils';
import { Overlay } from '../Overlay';
import { ResizeSensor } from '../ResizeSensor';
import { Tooltip } from '../Tooltip';
import { PopoverArrow } from './PopoverArrow';
import { positionToPlacement } from './PopoverMigrationUtils';
import { arrowOffsetModifier, getTransformOrigin } from './PopperUtils';
import { bem } from '../bem';

export const PopoverInteractionKind = {
  CLICK: 'click',
  CLICK_TARGET_ONLY: 'click-target',
  HOVER: 'hover',
  HOVER_TARGET_ONLY: 'hover-target'
};

export class Popover extends AbstractPureComponent {
  // a flag that indicates whether the target previously lost focus to another
  // now that mouseleave is triggered when you cross the gap between the two.
  isMouseInTargetOrPopover = false;

  // element on the same page.
  lostFocusOnSamePage = true;

  // a flag that lets us detect mouse movement between the target and popover,
  static defaultProps = {
    modifiers: [],
    popperModifiers: {},
    popoverClassName: '',
    captureDismiss: false,
    defaultIsOpen: false,
    disabled: false,
    hasBackdrop: false,
    hoverCloseDelay: 300,
    hoverOpenDelay: 150,
    interactionKind: PopoverInteractionKind.CLICK,
    minimal: false,
    openOnTargetFocus: true,
    position: 'auto',
    targetTagName: 'span',
    transitionDuration: 300,
    usePortal: true,
    wrapperTagName: 'span'
  };

  state = {
    isOpen: this.getIsOpen(this.props),
    transformOrigin: ''
  };

  renderPopover = popperProps => {
    const { usePortal, interactionKind } = this.props;
    const { transformOrigin } = this.state;
    // Need to update our reference to this on every render as it will change.
    this.popperScheduleUpdate = popperProps.scheduleUpdate;
    const popoverHandlers = {
      // always check popover clicks for dismiss class
      onClick: this.handlePopoverClick
    };

    if (interactionKind === PopoverInteractionKind.HOVER || (!usePortal && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)) {
      popoverHandlers.onMouseEnter = this.handleMouseEnter;
      popoverHandlers.onMouseLeave = this.handleMouseLeave;
    }
    const popoverContentClasses = bem('b-popover__content', this.props.modifiers);

    return (
      <div className='transition-container' ref={popperProps.ref} style={popperProps.style}>
        <ResizeSensor onResize={this.handlePopoverResize}>
          <div className={'b-popover'} style={{ transformOrigin }} {...popoverHandlers}>
            {this.isArrowEnabled() && (
              <PopoverArrow arrowProps={popperProps.arrowProps} placement={popperProps.placement} />
            )}
            <div className={popoverContentClasses}>
              {this.understandChildren().content}
            </div>
          </div>
        </ResizeSensor>
      </div>
    );
  };

  refHandlers = {
    popover: ref => {
      this.popoverElement = ref;
      Utils.safeInvoke(this.props.popoverRef, ref);
    },
    target: ref => (this.targetElement = ref)
  };

  renderTarget = referenceProps => {
    const { targetClassName, targetTagName: TagName } = this.props;
    const { isOpen } = this.state;
    const isHoverInteractionKind = this.isHoverInteractionKind();
    const targetProps = isHoverInteractionKind
      ? {
        // HOVER handlers
        onBlur: this.handleTargetBlur,
        onFocus: this.handleTargetFocus,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave
      }
      : {
        // CLICK needs only one handler
        onClick: this.handleTargetClick
      };
    targetProps.className = classNames('b-popover__target', { 'b-popover--open': isOpen }, targetClassName);
    targetProps.ref = referenceProps.ref;
    const rawTarget = Utils.ensureElement(this.understandChildren().target);
    const { tabIndex = 0 } = rawTarget.props;
    const clonedTarget = React.cloneElement(rawTarget, {
      className: classNames(rawTarget.props.className, {
        'b-popover__target--active': isOpen && !isHoverInteractionKind
      }),
      // force disable single Tooltip child when popover is open (BLUEPRINT-552)
      disabled: isOpen && Utils.isElementOfType(rawTarget, Tooltip) ? true : rawTarget.props.disabled,
      tabIndex: this.props.openOnTargetFocus && isHoverInteractionKind ? tabIndex : undefined
    });

    return (
      <ResizeSensor onResize={this.handlePopoverResize}>
        <TagName {...targetProps}>{clonedTarget}</TagName>
      </ResizeSensor>
    );
  };

  handleTargetFocus = e => {
    if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
      if (e.relatedTarget == null && !this.lostFocusOnSamePage) {
        // ignore this focus event -- the target was already focused but the page itself
        // lost focus (e.g. due to switching tabs).
        return;
      }
      this.handleMouseEnter(e);
    }
  };

  handleTargetBlur = e => {
    if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
      // if the next element to receive focus is within the popover, we'll want to leave the
      // popover open.
      if (!this.isElementInPopover(e.relatedTarget)) {
        this.handleMouseLeave(e);
      }
    }
    this.lostFocusOnSamePage = e.relatedTarget != null;
  };

  handleMouseEnter = e => {
    this.isMouseInTargetOrPopover = true;
    // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
    // trigger the mouse leave event, as hovering over the popover shouldn't count.
    if (!this.props.usePortal
      && this.isElementInPopover(e.target)
      && this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY
      && !this.props.openOnTargetFocus) {
      this.handleMouseLeave(e);
    } else if (!this.props.disabled) {
      // only begin opening popover when it is enabled
      this.setOpenState(true, e, this.props.hoverOpenDelay);
    }
  };

  handleMouseLeave = e => {
    this.isMouseInTargetOrPopover = false;
    // wait until the event queue is flushed, because we want to leave the
    // popover open if the mouse entered the popover immediately after
    // leaving the target (or vice versa).
    this.setTimeout(() => {
      if (this.isMouseInTargetOrPopover) {
        return;
      }
      // user-configurable closing delay is helpful when moving mouse from target to popover
      this.setOpenState(false, e, this.props.hoverCloseDelay);
    });
  };

  handlePopoverClick = e => {
    const eventTarget = e.target;
    // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
    const dismissElement = eventTarget.closest('.b-popover-dismiss, .b-popover-dismiss-override');
    const shouldDismiss = dismissElement != null && dismissElement.classList.contains('b-popover-dismiss');
    const isDisabled = eventTarget.closest(':disabled, .b-popover__disabled') != null;
    if (shouldDismiss && !isDisabled && !e.isDefaultPrevented()) {
      this.setOpenState(false, e);
      if (this.props.captureDismiss) {
        e.preventDefault();
      }
    }
  };

  handlePopoverResize = () => Utils.safeInvoke(this.popperScheduleUpdate);

  handleOverlayClose = e => {
    const eventTarget = e.target;
    // if click was in target, target event listener will handle things, so don't close
    if (!Utils.elementIsOrContains(this.targetElement, eventTarget) || e.nativeEvent instanceof KeyboardEvent) {
      this.setOpenState(false, e);
    }
  };

  handleTargetClick = e => {
    // ensure click did not originate from within inline popover before closing
    if (!this.props.disabled && !this.isElementInPopover(e.target)) {
      if (this.props.isOpen == null) {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
      } else {
        this.setOpenState(!this.props.isOpen, e);
      }
    }
  };

  /** Popper modifier that updates React state (for style properties) based on latest data. */
  updatePopoverState = data => {
    // always set string; let shouldComponentUpdate determine if update is necessary
    this.setState({ transformOrigin: getTransformOrigin(data) });
    return data;
  };

  close() {
    this.setOpenState(false);
  }

  open() {
    this.setOpenState(true);
  }

  render() {
    // rename wrapper tag to begin with uppercase letter so it's recognized
    // as JSX component instead of intrinsic element. but because of its
    // type, tsc actually recognizes that it is _any_ intrinsic element, so
    // it can typecheck the HTML props!!
    const {
      className,
      disabled,
      popperModifiers,
      wrapperTagName: WrapperTagName
    } = this.props;

    const { isOpen } = this.state;

    const isContentEmpty = Utils.ensureElement(this.understandChildren().content) == null;
    // need to do this check in render(), because `isOpen` is derived from
    // state, and state can't necessarily be accessed in validateProps.
    if (isContentEmpty && !disabled && isOpen !== false && !Utils.isNodeEnv('production')) {
      console.warn(Errors.POPOVER_WARN_EMPTY_CONTENT);
    }
    const allModifiers = {
      ...popperModifiers,
      arrowOffset: {
        enabled: this.isArrowEnabled(),
        fn: arrowOffsetModifier,
        order: 510 // arrow is 500
      },
      updatePopoverState: {
        enabled: true,
        fn: this.updatePopoverState,
        order: 900
      }
    };

    return (
      <Manager>
        <WrapperTagName className={classNames('b-popover__wrapper', className)}>
          <Reference innerRef={this.refHandlers.target}>
            {this.renderTarget}
          </Reference>
          <Overlay
            autoFocus={this.props.autoFocus}
            backdropClassName='b-popover__backdrop'
            backdropProps={this.props.backdropProps}
            canEscapeKeyClose={this.props.canEscapeKeyClose}
            canOutsideClickClose={this.props.interactionKind === PopoverInteractionKind.CLICK}
            className={this.props.portalClassName}
            enforceFocus={this.props.enforceFocus}
            hasBackdrop={this.props.hasBackdrop}
            isOpen={isOpen && !isContentEmpty}
            onClose={this.handleOverlayClose}
            onClosed={this.props.onClosed}
            onClosing={this.props.onClosing}
            onOpened={this.props.onOpened}
            onOpening={this.props.onOpening}
            transitionDuration={this.props.transitionDuration}
            transitionName='b-popover'
            usePortal={this.props.usePortal}>
            <Popper
              innerRef={this.refHandlers.popover}
              placement={positionToPlacement(this.props.position)}
              modifiers={allModifiers}>
              {this.renderPopover}
            </Popper>
          </Overlay>
        </WrapperTagName>
      </Manager>
    );
  }

  componentWillReceiveProps(nextProps) {
    const nextIsOpen = this.getIsOpen(nextProps);
    if (nextProps.isOpen != null && nextIsOpen !== this.state.isOpen) {
      this.setOpenState(nextIsOpen);
      // tricky: setOpenState calls setState only if this.props.isOpen is
      // not controlled, so we need to invoke setState manually here.
      this.setState({ isOpen: nextIsOpen });
    } else if (this.state.isOpen && nextProps.isOpen == null && nextProps.disabled) {
      // special case: close an uncontrolled popover when disabled is set to true
      this.setOpenState(false);
    }
  }

  validateProps(props) {
    if (props.isOpen == null && props.onInteraction != null) {
      console.warn(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
    }
    if (props.hasBackdrop && !props.usePortal) {
      console.warn(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE);
    }
    if (props.hasBackdrop && props.interactionKind !== PopoverInteractionKind.CLICK) {
      throw new Error(Errors.POPOVER_HAS_BACKDROP_INTERACTION);
    }
    const childrenCount = React.Children.count(props.children);
    const hasContentProp = props.content !== undefined;
    const hasTargetProp = props.target !== undefined;
    if (childrenCount === 0 && !hasTargetProp) {
      throw new Error(Errors.POPOVER_REQUIRES_TARGET);
    }
    if (childrenCount > 2) {
      console.warn(Errors.POPOVER_WARN_TOO_MANY_CHILDREN);
    }
    if (childrenCount > 0 && hasTargetProp) {
      console.warn(Errors.POPOVER_WARN_DOUBLE_TARGET);
    }
    if (childrenCount === 2 && hasContentProp) {
      console.warn(Errors.POPOVER_WARN_DOUBLE_CONTENT);
    }
  }

  // content and target can be specified as props or as children. this method
  // normalizes the two approaches, preferring child over prop.
  understandChildren() {
    const { children, content: contentProp, target: targetProp } = this.props;
    // #validateProps asserts that 1 <= children.length <= 2 so content is optional
    const [targetChild, contentChild] = React.Children.toArray(children);
    return {
      content: contentChild == null ? contentProp : contentChild,
      target: targetChild == null ? targetProp : targetChild
    };
  }

  getIsOpen(props) {
    // disabled popovers should never be allowed to open.
    if (props.disabled) {
      return false;
    }

    if (props.isOpen != null) {
      return props.isOpen;
    }

    return props.defaultIsOpen;
  }

  // a wrapper around setState({isOpen}) that will call props.onInteraction instead when in controlled mode.
  // starts a timeout to delay changing the state if a non-zero duration is provided.
  setOpenState(isOpen, e, timeout) {
    // cancel any existing timeout because we have new state
    Utils.safeInvoke(this.cancelOpenTimeout);
    if (timeout > 0) {
      this.cancelOpenTimeout = this.setTimeout(() => this.setOpenState(isOpen, e), timeout);
    } else {
      if (this.props.isOpen == null) {
        this.setState({ isOpen });
      } else {
        Utils.safeInvoke(this.props.onInteraction, isOpen, e);
      }
      if (!isOpen) {
        Utils.safeInvoke(this.props.onClose, e);
      }
    }
  }

  isArrowEnabled() {
    const { minimal, popperModifiers: { arrow } } = this.props;
    // omitting `arrow` from `popperModifiers` uses Popper default, which does show an arrow.
    return !minimal && (arrow == null || arrow.enabled);
  }

  isElementInPopover(element) {
    return this.popoverElement != null && this.popoverElement.contains(element);
  }

  isHoverInteractionKind() {
    return (this.props.interactionKind === PopoverInteractionKind.HOVER
      || this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY);
  }
}
