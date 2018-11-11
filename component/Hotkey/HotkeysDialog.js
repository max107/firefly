import React from 'react';
import cx from 'classnames';
import { render, unmountComponentAtNode } from 'react-dom';
import { Dialog, DialogBody } from '../Dialog';
import { Hotkey } from './Hotkey';
import { Hotkeys } from './Hotkeys';

/**
 * The delay before showing or hiding the dialog. Should be long enough to
 * allow all registered hotkey listeners to execute first.
 */
const DELAY_IN_MS = 0;

class HotkeysDialog {
  componentProps = {
    globalHotkeysGroup: 'Global hotkeys'
  };

  hotkeysQueue = [];

  isDialogShowing = false;

  show = () => {
    this.isDialogShowing = true;
    this.render();
  };

  hide = () => {
    this.isDialogShowing = false;
    this.render();
  };

  render() {
    if (this.container == null) {
      this.container = this.getContainer();
    }

    render(this.renderComponent(), this.container);
  }

  unmount() {
    if (this.container != null) {
      unmountComponentAtNode(this.container);
      this.container.remove();
      delete this.container;
    }
  }

  /**
   * Because hotkeys can be registered globally and locally and because
   * event ordering cannot be guaranteed, we use this debouncing method to
   * allow all hotkey listeners to fire and add their hotkeys to the dialog.
   *
   * 10msec after the last listener adds their hotkeys, we render the dialog
   * and clear the queue.
   */
  enqueueHotkeysForDisplay(hotkeys) {
    this.hotkeysQueue.push(hotkeys);

    // reset timeout for debounce
    window.clearTimeout(this.showTimeoutToken);
    this.showTimeoutToken = window.setTimeout(this.show, DELAY_IN_MS);
  }

  hideAfterDelay() {
    window.clearTimeout(this.hideTimeoutToken);
    this.hideTimeoutToken = window.setTimeout(this.hide, DELAY_IN_MS);
  }

  isShowing() {
    return this.isDialogShowing;
  }

  getContainer() {
    if (this.container == null) {
      this.container = document.createElement('div');
      this.container.classList.add('portal');
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  renderComponent() {
    return (
      <Dialog
        {...this.componentProps}
        title='Hotkeys'
        className={cx('hotkey__dialog', this.componentProps.className)}
        isOpen={this.isDialogShowing}
        onClose={this.hide}>
        <DialogBody>
          {this.renderHotkeys()}
        </DialogBody>
      </Dialog>
    );
  }

  renderHotkeys() {
    const elements = this.emptyHotkeyQueue().map((hotkey, index) => {
      const isGlobal = hotkey.global === true && hotkey.group == null;
      const group = isGlobal
        ? this.componentProps.globalHotkeysGroup
        : hotkey.group;

      return (
        <Hotkey
          key={index}
          {...hotkey}
          group={group} />
      );
    });

    return (
      <Hotkeys>
        {elements}
      </Hotkeys>
    );
  }

  emptyHotkeyQueue() {
    // flatten then empty the hotkeys queue
    const hotkeys = this.hotkeysQueue.reduce((arr, queued) => arr.concat(queued), []);
    this.hotkeysQueue.length = 0;
    return hotkeys;
  }
}

// singleton instance
const HOTKEYS_DIALOG = new HotkeysDialog();

export function isHotkeysDialogShowing() {
  return HOTKEYS_DIALOG.isShowing();
}

export function setHotkeysDialogProps(props) {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      HOTKEYS_DIALOG.componentProps[key] = props[key];
    }
  }
}

export function showHotkeysDialog(hotkeys) {
  HOTKEYS_DIALOG.enqueueHotkeysForDisplay(hotkeys);
}

export function hideHotkeysDialog() {
  HOTKEYS_DIALOG.hide();
}

/**
 * Use this function instead of `hideHotkeysDialog` if you need to ensure that all hotkey listeners
 * have time to execute with the dialog in a consistent open state. This can avoid flickering the
 * dialog between open and closed states as successive listeners fire.
 */
export function hideHotkeysDialogAfterDelay() {
  HOTKEYS_DIALOG.hideAfterDelay();
}
