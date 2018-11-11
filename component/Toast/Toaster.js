import classNames from 'classnames';
import * as React from 'react';
import { render } from 'react-dom';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Classes from '../common/classes';
import { TOASTER_CREATE_NULL, TOASTER_WARN_INLINE } from '../common/errors';
import { ESCAPE } from '../common/keys';
import { Position } from '../common/position';
import { isNodeEnv, safeInvoke } from '../utils/utils';
import { Overlay } from '../Overlay';
import { Toast } from './Toast';

export class Toaster extends AbstractPureComponent {
  static defaultProps = {
    autoFocus: false,
    canEscapeKeyClear: true,
    position: Position.TOP_RIGHT,
    usePortal: true
  };

  state = {
    toasts: []
  };

  // auto-incrementing identifier for un-keyed toasts
  toastId = 0;

  getDismissHandler = (toast) => (timeoutExpired) => {
    this.dismiss(toast.key, timeoutExpired);
  };

  handleClose = (e) => {
    // NOTE that `e` isn't always a KeyboardEvent but that's the only type we care about
    if (e.which === ESCAPE) {
      this.clear();
    }
  };

  /**
   * Create a new `Toaster` instance that can be shared around your application.
   * The `Toaster` will be rendered into a new element appended to the given container.
   */
  static create(props, container = document.body) {
    if (props != null && props.usePortal != null && !isNodeEnv('production')) {
      console.warn(TOASTER_WARN_INLINE);
    }
    const containerElement = document.createElement('div');
    container.appendChild(containerElement);
    const toaster = render((
      <Toaster usePortal={false} />
    ), containerElement);
    if (toaster == null) {
      throw new Error(TOASTER_CREATE_NULL);
    }
    return toaster;
  }

  show(props, key) {
    const options = this.createToastOptions(props, key);
    if (key === undefined || this.isNewToastKey(key)) {
      this.setState(prevState => ({
        toasts: [options, ...prevState.toasts]
      }));
    } else {
      this.setState(prevState => ({
        toasts: prevState.toasts.map(t => (t.key === key ? options : t))
      }));
    }
    return options.key;
  }

  dismiss(key, timeoutExpired = false) {
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(t => {
        const matchesKey = t.key === key;
        if (matchesKey) {
          safeInvoke(t.onDismiss, timeoutExpired);
        }
        return !matchesKey;
      })
    }));
  }

  clear() {
    this.state.toasts.map(t => safeInvoke(t.onDismiss, false));
    this.setState({ toasts: [] });
  }

  getToasts() {
    return this.state.toasts;
  }

  render() {
    // $pt-transition-duration * 3 + $pt-transition-duration / 2
    const classes = classNames(Classes.TOAST_CONTAINER, this.getPositionClasses(), this.props.className);

    return (
      <Overlay
        autoFocus={this.props.autoFocus}
        canEscapeKeyClose={this.props.canEscapeKeyClear}
        canOutsideClickClose={false}
        className={classes}
        enforceFocus={false}
        hasBackdrop={false}
        isOpen={this.state.toasts.length > 0 || this.props.children != null}
        onClose={this.handleClose}
        transitionDuration={350}
        transitionName={Classes.TOAST}
        usePortal={this.props.usePortal}>
        {this.state.toasts.map(this.renderToast, this)}
        {this.props.children}
      </Overlay>
    );
  }

  isNewToastKey(key) {
    return this.state.toasts.every(toast => toast.key !== key);
  }

  renderToast(toast) {
    return <Toast {...toast} onDismiss={this.getDismissHandler(toast)} />;
  }

  createToastOptions(props, key = `toast-${this.toastId += 1}`) {
    // clone the object before adding the key prop to avoid leaking the mutation
    return Object.assign({}, props, { key });
  }

  getPositionClasses() {
    const positions = this.props.position.split('-');
    // NOTE that there is no -center class because that's the default style
    return positions.map(p => `${Classes.TOAST_CONTAINER}-${p.toLowerCase()}`);
  }
}
