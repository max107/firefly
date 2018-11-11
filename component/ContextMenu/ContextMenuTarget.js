import * as React from 'react';
import { CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT, CONTEXTMENU_WARN_DECORATOR_NO_METHOD } from '../common/errors';
import { getDisplayName, isFunction, safeInvoke } from '../utils/utils';
import { ContextMenu } from './ContextMenu';

export function ContextMenuTarget(WrappedComponent) {
  if (!isFunction(WrappedComponent.prototype.renderContextMenu)) {
    console.warn(CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
  }

  const _a = class ContextMenuTargetClass extends WrappedComponent {
    render() {
      const element = super.render();
      if (element == null) {
        // always return `element` in case caller is distinguishing between `null` and `undefined`
        return element;
      }
      if (!React.isValidElement(element)) {
        console.warn(CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
        return element;
      }
      const oldOnContextMenu = element.props.onContextMenu;
      const onContextMenu = (e) => {
        // support nested menus (inner menu target would have called preventDefault())
        if (e.defaultPrevented) {
          return;
        }
        if (isFunction(this.renderContextMenu)) {
          const menu = this.renderContextMenu(e);
          if (menu != null) {
            e.preventDefault();
            ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, this.onContextMenuClose);
          }
        }
        safeInvoke(oldOnContextMenu, e);
      };
      return React.cloneElement(element, { onContextMenu });
    }
  };
  _a.displayName = `ContextMenuTarget(${getDisplayName(WrappedComponent)})`;
  return _a
}
