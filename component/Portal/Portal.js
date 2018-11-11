import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { ThemeContext } from '../Theme';

/**
 * This component detaches its contents and re-attaches them to document.body.
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export class Portal extends Component {
  static contextType = ThemeContext;

  state = {
    hasMounted: false
  };

  render() {
    // Only render `children` once this component has mounted in a browser environment, so they are
    // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
    // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
    if (typeof document === 'undefined' || !this.state.hasMounted) {
      return null;
    }

    return createPortal((
      <div className={`theme-${this.context}`}>
        {this.props.children}
      </div>
    ), this.portalElement);
  }

  componentDidMount() {
    this.portalElement = this.createContainerElement();
    document.body.appendChild(this.portalElement);

    this.setState({ hasMounted: true }, this.props.onChildrenMount);
  }

  componentDidUpdate(prevProps) {
    // update className prop on portal DOM element
    if (this.portalElement != null && prevProps.className !== this.props.className) {
      this.portalElement.classList.remove(prevProps.className);
      maybeAddClass(this.portalElement.classList, this.props.className);
    }
  }

  componentWillUnmount() {
    if (this.portalElement != null) {
      this.portalElement.remove();
    }
  }

  createContainerElement() {
    const container = document.createElement('div');
    container.classList.add('b-portal');
    maybeAddClass(container.classList, this.props.className);
    if (this.context != null) {
      maybeAddClass(container.classList, this.context.blueprintPortalClassName);
    }
    return container;
  }
}

function maybeAddClass(classList, className) {
  if (className != null && className !== '') {
    classList.add(...className.split(' '));
  }
}
