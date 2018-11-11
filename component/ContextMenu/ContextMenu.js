import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Classes from '../common/classes';
import { Position } from '../common/position';
import { safeInvoke } from '../utils/utils';
import { Popover } from '../Popover';

const POPPER_MODIFIERS = {
  preventOverflow: { boundariesElement: 'viewport' }
};
const TRANSITION_DURATION = 100;

/* istanbul ignore next */
export class ContextMenu extends AbstractPureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: false,
      menu: null,
      offset: null
    };
    this.cancelContextMenu = (e) => e.preventDefault();
    this.handleBackdropContextMenu = (e) => {
      // React function to remove from the event pool, useful when using a event within a callback
      e.persist();
      e.preventDefault();
      // wait for backdrop to disappear so we can find the "real" element at event coordinates.
      // timeout duration is equivalent to transition duration so we know it's animated out.
      this.setTimeout(() => {
        // retrigger context menu event at the element beneath the backdrop.
        // if it has a `contextmenu` event handler then it'll be invoked.
        // if it doesn't, no native menu will show (at least on OSX) :(
        const newTarget = document.elementFromPoint(e.clientX, e.clientY);
        newTarget.dispatchEvent(new MouseEvent('contextmenu', e));
      }, TRANSITION_DURATION);
    };
    this.handlePopoverInteraction = (nextOpenState) => {
      if (!nextOpenState) {
        // delay the actual hiding till the event queue clears
        // to avoid flicker of opening twice
        requestAnimationFrame(() => this.hide());
      }
    };
  }

  render() {
    // prevent right-clicking in a context menu
    const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
    const popoverClassName = '';

    // HACKHACK: workaround until we have access to Popper#scheduleUpdate().
    // https://github.com/palantir/blueprint/issues/692
    // Generate key based on offset so a new Popover instance is created
    // when offset changes, to force recomputing position.
    const key = this.state.offset == null ? '' : `${this.state.offset.left}x${this.state.offset.top}`;

    // wrap the popover in a positioned div to make sure it is properly
    // offset on the screen.
    return (
      <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} style={this.state.offset}>
        <Popover
          {...this.props}
          backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
          content={content}
          enforceFocus={false}
          key={key}
          hasBackdrop={true}
          isOpen={this.state.isOpen}
          minimal={true}
          modifiers={POPPER_MODIFIERS}
          onInteraction={this.handlePopoverInteraction}
          position={Position.RIGHT_TOP}
          popoverClassName={popoverClassName}
          target={<div />}
          transitionDuration={TRANSITION_DURATION}
        />
      </div>
    );
  }

  show(menu, offset, onClose) {
    this.setState({ isOpen: true, menu, offset, onClose });
  }

  hide() {
    safeInvoke(this.state.onClose);
    this.setState({ isOpen: false, onClose: undefined });
  }
}

let contextMenuElement;
let contextMenu;

/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 */
export function show(menu, offset, onClose) {
  if (contextMenuElement == null) {
    contextMenuElement = document.createElement('div');
    contextMenuElement.classList.add(Classes.CONTEXT_MENU);
    document.body.appendChild(contextMenuElement);
    contextMenu = ReactDOM.render(React.createElement(ContextMenu, { onClosed: remove }), contextMenuElement);
  }
  contextMenu.show(menu, offset, onClose);
}

/** Hide the open context menu. */
export function hide() {
  if (contextMenu != null) {
    contextMenu.hide();
  }
}

/** Return whether a context menu is currently open. */
export function isOpen() {
  return contextMenu != null && contextMenu.state.isOpen;
}

function remove() {
  if (contextMenuElement != null) {
    ReactDOM.unmountComponentAtNode(contextMenuElement);
    contextMenuElement.remove();
    contextMenuElement = null;
    contextMenu = null;
  }
}
