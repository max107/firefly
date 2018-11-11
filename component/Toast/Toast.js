import React from 'react';
import { AbstractPureComponent } from '../AbstractPureComponent';
import { safeInvoke } from '../utils/utils';
import { bem } from '../bem';

export class Toast extends AbstractPureComponent {
  static defaultProps = {
    className: '',
    message: '',
    timeout: 5000,
    modifiers: []
  };

  handleCloseClick = () => {
    this.triggerDismiss(false);
  };

  startTimeout = () => {
    if (this.props.timeout > 0) {
      this.setTimeout(() => this.triggerDismiss(true), this.props.timeout);
    }
  };

  render() {
    const {
      modifiers,
      message
    } = this.props;

    return (
      <div
        className={bem('toast', modifiers)}
        onBlur={this.startTimeout}
        onFocus={this.clearTimeouts}
        onMouseEnter={this.clearTimeouts}
        onMouseLeave={this.startTimeout}
        onClick={this.handleCloseClick}
        tabIndex={0}>
        <span className='toast__message'>{message}</span>
      </div>
    );
  }

  componentDidMount() {
    this.startTimeout();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeout <= 0 && this.props.timeout > 0) {
      this.startTimeout();
    } else if (prevProps.timeout > 0 && this.props.timeout <= 0) {
      this.clearTimeouts();
    }
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  triggerDismiss(timeoutExpired) {
    safeInvoke(this.props.onDismiss, timeoutExpired);
    this.clearTimeouts();
  }
}
