import { PureComponent } from 'react';
import { isNodeEnv } from './utils/utils';

/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
export class AbstractPureComponent extends PureComponent {
  constructor(props, context) {
    super(props, context);
    // Not bothering to remove entries when their timeouts finish because clearing invalid ID is a no-op
    this.timeoutIds = [];
    /**
     * Clear all known timeouts.
     */
    this.clearTimeouts = () => {
      if (this.timeoutIds.length > 0) {
        for (const timeoutId of this.timeoutIds) {
          window.clearTimeout(timeoutId);
        }
        this.timeoutIds = [];
      }
    };
    if (!isNodeEnv('production')) {
      this.validateProps(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isNodeEnv('production')) {
      this.validateProps(nextProps);
    }
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  /**
   * Set a timeout and remember its ID.
   * All stored timeouts will be cleared when component unmounts.
   * @returns a "cancel" function that will clear timeout when invoked.
   */
  setTimeout(callback, timeout) {
    const handle = window.setTimeout(callback, timeout);
    this.timeoutIds.push(handle);
    return () => window.clearTimeout(handle);
  }

  /**
   * Ensures that the props specified for a component are valid.
   * Implementations should check that props are valid and usually throw an Error if they are not.
   * Implementations should not duplicate checks that the type system already guarantees.
   *
   * This method should be used instead of React's
   * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
   * Like propTypes, these runtime checks run only in development mode.
   */
  validateProps(_) {
    // implement in subclass
  }
}
