import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export class Transition extends Component {
  timer = undefined;

  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    delay: PropTypes.number,
    transition: PropTypes.string
  };

  static defaultProps = {
    delay: 0,
    style: {},
    className: '',
    transition: 'fade-enter'
  };

  state = {
    cls: ''
  };

  componentDidMount() {
    const {
      transition
    } = this.props;

    this.timer = setTimeout(() => { // TODO really need that fix?
      this.setState({
        cls: `${transition}-active`
      });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const {
      transition,
      children,
      className,
      style,
      delay,
      ...rest
    } = this.props;

    return (
      <div
        {...rest}
        style={{ ...style, transitionDelay: `${delay}s` }}
        className={cx(className, transition, this.state.cls)}>
        {children}
      </div>
    );
  }
}
