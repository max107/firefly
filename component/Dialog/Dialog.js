import cx from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Overlay } from '../Overlay';
import { Icon } from '../Icon';
import { bem } from '../bem';

export class Dialog extends PureComponent {
  static propTypes = {
    modifiers: PropTypes.any
  };

  static defaultProps = {
    modifiers: [],
    icon: null,
    title: null,
    onClose: () => null,
    isCloseButtonShown: true,
    canOutsideClickClose: true,
    isOpen: false
  };

  maybeRenderCloseButton() {
    const {
      isCloseButtonShown,
      onClose,
      modifiers
    } = this.props;

    // show close button if prop is undefined or null
    // this gives us a behavior as if the default value were `true`
    if (isCloseButtonShown !== false) {
      return (
        <button
          aria-label="Close"
          className={bem('b-dialog__close', modifiers)}
          onClick={onClose}
          type="button">
          <Icon icon={'X'} />
        </button>
      );
    }

    return null;
  }

  maybeRenderHeader() {
    const {
      title,
      modifiers
    } = this.props;

    return (
      <div className={bem('b-dialog__header', modifiers)}>
        <div className={bem('b-dialog__title', modifiers)}>
          {title}
        </div>
        {this.maybeRenderCloseButton()}
      </div>
    );
  }

  render() {
    const {
      modifiers
    } = this.props;

    return (
      <Overlay {...this.props} className='b-overlay--scroll' hasBackdrop={true}>
        <div className={bem('b-dialog__container', modifiers)}>
          <div className={cx(bem('b-dialog__dialog', modifiers), this.props.className)}>
            {this.maybeRenderHeader()}
            {this.props.children}
          </div>
        </div>
      </Overlay>
    );
  }
}
