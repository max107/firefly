import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Part } from './Part';

export class Group extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    values: PropTypes.object,
    loading: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    errors: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  };

  static defaultProps = {
    loading: false,
    errors: [],
    values: {}
  };

  render() {
    const {
      fields,
      errors,
      loading,
      onChange,
      values
    } = this.props;

    return fields.map((field, i) => (
      <Part
        {...field}
        key={i}
        id={field.id || field.name}
        disabled={loading}
        label={field.label || field.name}
        value={values[field.name] || ''}
        errors={errors}
        onChange={onChange(field.name)} />
    ));
  }
}
