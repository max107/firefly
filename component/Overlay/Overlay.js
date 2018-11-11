import classNames from 'classnames';
import React, { Children, cloneElement, PureComponent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { findDOMNode } from 'react-dom';
import * as Keys from '../common/keys';
import { safeInvoke } from '../utils/utils';
import { Portal } from '../Portal';

export class Overlay extends PureComponent {
  static defaultProps = {
    autoFocus: true,
    backdropProps: {},
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    hasBackdrop: true,
    isOpen: false,
    lazy: true,
    transitionDuration: 300,
    transitionName: 'b-overlay',
    usePortal: true
  };
  static openStack = [];
  static getLastOpened = () => Overlay.openStack[Overlay.openStack.length - 1];
  state = {
    hasEverOpened: this.props.isOpen
  };
  refHandlers = {
    container: ref => {
      this.containerElement = findDOMNode(ref);
    }
  };

  maybeRenderChild = child => {
    if (child == null) {
      return null;
    }
    // add a special class to each child element that will automatically set the appropriate
    // CSS position mode under the hood. also, make the container focusable so we can
    // trap focus inside it (via `enforceFocus`).
    const decoratedChild = typeof child === 'object' ? (
      cloneElement(child, {
        className: classNames(child.props.className, 'b-overlay__content'),
        tabIndex: 0
      })
    ) : (
      <span className='b-overlay__content'>{child}</span>
    );

    const {
      onOpening,
      onOpened,
      onClosing,
      onClosed,
      transitionDuration,
      transitionName
    } = this.props;

    return (
      <CSSTransition
        classNames={transitionName}
        onEntering={onOpening}
        onEntered={onOpened}
        onExiting={onClosing}
        onExited={onClosed}
        timeout={transitionDuration}>
        {decoratedChild}
      </CSSTransition>
    );
  };

  handleBackdropMouseDown = e => {
    const {
      backdropProps,
      canOutsideClickClose,
      enforceFocus,
      onClose
    } = this.props;

    if (canOutsideClickClose) {
      safeInvoke(onClose, e);
    }

    if (enforceFocus) {
      // make sure document.activeElement is updated before bringing the focus back
      this.bringFocusInsideOverlay();
    }
    safeInvoke(backdropProps.onMouseDown, e);
  };

  handleDocumentClick = e => {
    const {
      canOutsideClickClose,
      isOpen,
      onClose
    } = this.props;

    const eventTarget = e.target;
    const stackIndex = Overlay.openStack.indexOf(this);
    const isClickInThisOverlayOrDescendant = Overlay.openStack
      .slice(stackIndex)
      .some(({ containerElement: elem }) => {
        // `elem` is the container of backdrop & content, so clicking on that container
        // should not count as being "inside" the overlay.
        return elem && elem.contains(eventTarget) && !elem.isSameNode(eventTarget);
      });

    if (isOpen && canOutsideClickClose && !isClickInThisOverlayOrDescendant) {
      // casting to any because this is a native event
      safeInvoke(onClose, e);
    }
  };

  handleDocumentFocus = e => {
    if (
      this.props.enforceFocus
      && this.containerElement != null
      && !this.containerElement.contains(e.target)
    ) {
      // prevent default focus behavior (sometimes auto-scrolls the page)
      e.preventDefault();
      e.stopImmediatePropagation();
      this.bringFocusInsideOverlay();
    }
  };

  handleKeyDown = e => {
    const {
      canEscapeKeyClose,
      onClose
    } = this.props;

    if (e.which === Keys.ESCAPE && canEscapeKeyClose) {
      safeInvoke(onClose, e);
      // prevent browser-specific escape key behavior (Safari exits fullscreen)
      e.preventDefault();
    }
  };

  render() {
    // oh snap! no reason to render anything at all if we're being truly lazy
    if (this.props.lazy && !this.state.hasEverOpened) {
      return null;
    }

    const {
      children,
      className,
      usePortal,
      isOpen
    } = this.props;

    // TransitionGroup types require single array of children; does not support nested arrays.
    // So we must collapse backdrop and children into one array, and every item must be wrapped in a
    // Transition element (no ReactText allowed).
    const childrenWithTransitions = isOpen ? Children.map(children, this.maybeRenderChild) : [];
    childrenWithTransitions.unshift(this.maybeRenderBackdrop());
    const containerClasses = classNames('b-overlay', {
      'b-overlay--open': isOpen,
      'b-overlay--inline': !usePortal
    }, className);

    const transitionGroup = (
      <TransitionGroup
        appear={true}
        className={containerClasses}
        component="div"
        onKeyDown={this.handleKeyDown}
        ref={this.refHandlers.container}>
        {childrenWithTransitions}
      </TransitionGroup>
    );

    return usePortal ? <Portal>{transitionGroup}</Portal> : transitionGroup;
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.overlayWillOpen();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hasEverOpened: this.state.hasEverOpened || nextProps.isOpen
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.overlayWillClose();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      this.overlayWillOpen();
    }
  }

  componentWillUnmount() {
    this.overlayWillClose();
  }

  /**
   * @public for testing
   * @internal
   */
  bringFocusInsideOverlay() {
    // always delay focus manipulation to just before repaint to prevent scroll jumping
    return requestAnimationFrame(() => {
      // container ref may be undefined between component mounting and Portal rendering
      // activeElement may be undefined in some rare cases in IE
      if (this.containerElement == null || document.activeElement == null || !this.props.isOpen) {
        return;
      }
      const isFocusOutsideModal = !this.containerElement.contains(document.activeElement);
      if (isFocusOutsideModal) {
        // element marked autofocus has higher priority than the other clowns
        const autofocusElement = this.containerElement.querySelector('[autofocus]');
        const wrapperElement = this.containerElement.querySelector('[tabindex]');
        if (autofocusElement != null) {
          autofocusElement.focus();
        }
        else if (wrapperElement != null) {
          wrapperElement.focus();
        }
      }
    });
  }

  maybeRenderBackdrop() {
    const {
      backdropClassName,
      backdropProps,
      hasBackdrop,
      isOpen,
      transitionDuration,
      transitionName
    } = this.props;

    if (hasBackdrop && isOpen) {
      return (
        <CSSTransition classNames={transitionName} key="__backdrop" timeout={transitionDuration}>
          <div
            {...backdropProps}
            className={classNames('b-overlay__backdrop', backdropClassName, backdropProps.className)}
            onMouseDown={this.handleBackdropMouseDown}
            tabIndex={this.props.canOutsideClickClose ? 0 : null}
          />
        </CSSTransition>
      );
    }

    return null;
  }

  overlayWillClose() {
    document.removeEventListener('focus', this.handleDocumentFocus, /* useCapture */ true);
    document.removeEventListener('mousedown', this.handleDocumentClick);
    const { openStack } = Overlay;
    const stackIndex = openStack.indexOf(this);
    if (stackIndex !== -1) {
      openStack.splice(stackIndex, 1);
      if (openStack.length > 0) {
        const lastOpenedOverlay = Overlay.getLastOpened();
        if (lastOpenedOverlay.props.enforceFocus) {
          document.addEventListener('focus', lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
        }
      }
      if (openStack.filter(o => o.props.usePortal && o.props.hasBackdrop).length === 0) {
        document.body.classList.remove('b-overlay--open');
      }
    }
  }

  overlayWillOpen() {
    const { openStack } = Overlay;
    if (openStack.length > 0) {
      document.removeEventListener('focus', Overlay.getLastOpened().handleDocumentFocus, /* useCapture */ true);
    }
    openStack.push(this);
    if (this.props.autoFocus) {
      this.bringFocusInsideOverlay();
    }
    if (this.props.enforceFocus) {
      document.addEventListener('focus', this.handleDocumentFocus, /* useCapture */ true);
    }
    if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
      document.addEventListener('mousedown', this.handleDocumentClick);
    }
    if (this.props.hasBackdrop && this.props.usePortal) {
      // add a class to the body to prevent scrolling of content below the overlay
      document.body.classList.add('b-overlay--open');
    }
  }
}
