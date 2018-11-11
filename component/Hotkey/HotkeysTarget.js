import React from 'react';
import { HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT, HOTKEYS_WARN_DECORATOR_NO_METHOD } from '../common/errors';
import { getDisplayName, isFunction, safeInvoke } from '../utils/utils';
import { HotkeyScope, HotkeysEvents } from './HotkeysEvents';

export function HotkeysTarget(WrappedComponent) {
  if (!isFunction(WrappedComponent.prototype.renderHotkeys)) {
    console.warn(HOTKEYS_WARN_DECORATOR_NO_METHOD);
  }

  return class HotkeysTargetClass extends WrappedComponent {
    static displayName = `HotkeysTarget(${getDisplayName(WrappedComponent)})`;

    componentWillMount() {
      if (super.componentWillMount != null) {
        super.componentWillMount();
      }
      this.localHotkeysEvents = new HotkeysEvents(HotkeyScope.LOCAL);
      this.globalHotkeysEvents = new HotkeysEvents(HotkeyScope.GLOBAL);
    }

    componentDidMount() {
      if (super.componentDidMount != null) {
        super.componentDidMount();
      }
      // attach global key event listeners
      document.addEventListener('keydown', this.globalHotkeysEvents.handleKeyDown);
      document.addEventListener('keyup', this.globalHotkeysEvents.handleKeyUp);
    }

    componentWillUnmount() {
      if (super.componentWillUnmount != null) {
        super.componentWillUnmount();
      }
      document.removeEventListener('keydown', this.globalHotkeysEvents.handleKeyDown);
      document.removeEventListener('keyup', this.globalHotkeysEvents.handleKeyUp);
      this.globalHotkeysEvents.clear();
      this.localHotkeysEvents.clear();
    }

    render() {
      const element = super.render();

      if (element == null) {
        // always return `element` in case caller is distinguishing between `null` and `undefined`
        return element;
      }

      if (!React.isValidElement(element)) {
        console.warn(HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
        return element;
      }

      if (isFunction(this.renderHotkeys)) {
        const hotkeys = this.renderHotkeys();
        this.localHotkeysEvents.setHotkeys(hotkeys.props);
        this.globalHotkeysEvents.setHotkeys(hotkeys.props);

        if (this.localHotkeysEvents.count() > 0) {
          const tabIndex = hotkeys.props.tabIndex === undefined ? 0 : hotkeys.props.tabIndex;

          const { keyDown: existingKeyDown, keyUp: existingKeyUp } = element.props;
          const onKeyDown = (e) => {
            this.localHotkeysEvents.handleKeyDown(e.nativeEvent);
            safeInvoke(existingKeyDown, e);
          };

          const onKeyUp = (e) => {
            this.localHotkeysEvents.handleKeyUp(e.nativeEvent);
            safeInvoke(existingKeyUp, e);
          };
          return React.cloneElement(element, { tabIndex, onKeyDown, onKeyUp });
        }
      }
      return element;
    }
  };
}
