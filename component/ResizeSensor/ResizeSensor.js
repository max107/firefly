import { Children, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import { safeInvoke } from '../utils/utils';

export class ResizeSensor extends PureComponent {
  element = null;
  observer = new ResizeObserver(entries => safeInvoke(this.props.onResize, entries));

  render() {
    // pass-through render of single child
    return Children.only(this.props.children);
  }

  componentDidMount() {
    // using findDOMNode for two reasons:
    // 1. cloning to insert a ref is unwieldy and not performant.
    // 2. ensure that we get an actual DOM node for observing.
    this.observeElement(findDOMNode(this));
  }

  componentDidUpdate(prevProps) {
    this.observeElement(findDOMNode(this), this.props.observeParents !== prevProps.observeParents);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  /**
   * Observe the given element, if defined and different from the currently
   * observed element. Pass `force` argument to skip element checks and always
   * re-observe.
   */
  observeElement(element, force = false) {
    if (element == null) {
      // stop everything if not defined
      this.observer.disconnect();
      return;
    }

    if (element === this.element && !force) {
      // quit if given same element -- nothing to update (unless forced)
      return;
    } else {
      // clear observer list if new element
      this.observer.disconnect();
      // remember element reference for next time
      this.element = element;
    }
    // observer callback is invoked immediately when observing new elements
    this.observer.observe(element);
    if (this.props.observeParents) {
      let parent = element.parentElement;
      while (parent != null) {
        this.observer.observe(parent);
        parent = parent.parentElement;
      }
    }
  }
}
