import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DateRangePicker, DateInput } from '../DateTime';
import bem from '../bem';

export class Input extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    options: PropTypes.oneOfType([
      PropTypes.arrayOf([
        PropTypes.shape({
          label: PropTypes.any,
          value: PropTypes.any
        })
      ]),
      PropTypes.any
    ]),
    className: PropTypes.string
  };

  static defaultProps = {
    type: 'text',
    options: [],
    className: ''
  };

  render() {
    const {
      options,
      type,
      className,
      name,
      modifiers,
      ...rest
    } = this.props;

    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          className={cx(bem('b-input', { textarea: true, ...modifiers }), className)}
          {...rest} />
      );
    }

    if (type === 'radio' || type === 'checkbox') {
      return (
        <input
          name={name}
          className={cx(bem('b-input', { choice: true, ...modifiers }), className)}
          type={type}
          checked={rest.value === '1' || rest.value === true || rest.value === 'true'}
          {...rest} />
      );
    }

    if (type === 'select') {
      const nodes = options.map((item, i) => (
        <option value={item.value} key={i}>
          {item.label}
        </option>
      ));

      return (
        <select
          name={name}
          className={cx(bem('b-input', { select: true, ...modifiers }), className)}
          {...rest}>
          {nodes}
        </select>
      );
    }

    if (type === 'datetime') {
      return (
        <DateInput
          parseDate={dateStr => Date.parse(dateStr)}
          formatDate={date => date.toISOString()}
          name={name}
          {...rest} />
      );
    }

    if (type === 'daterange') {
      return (
        <DateRangePicker
          name={name}
          {...rest} />
      );
    }

    return (
      <input
        name={name}
        className={cx(bem('b-input', modifiers), className)}
        type={type}
        {...rest} />
    );
  }
}
