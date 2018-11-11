import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { FormRow } from './FormRow';
import { Label } from './Label';
import { Input } from './Input';
import { Errors, getErrors } from './Errors';

export class Part extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    help: PropTypes.string,
    label: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired
  };

  static defaultProps = {
    required: true,
    component: null,
    help: null,
    input: null
  };

  render() {
    const {
      style,
      name,
      type,
      help,
      label,
      component,
      required,
      onChange,
      errors,
      ...rest
    } = this.props;

    const inputErrors = getErrors(name, errors);

    const labelComponent = (
      <Label
        htmlFor={name}
        required={required}>
        {label}
      </Label>
    );

    const inputComponent = component ? createElement(component, {
      name,
      type,
      id: name,
      onChange,
      modifiers: {
        error: inputErrors.length > 0
      },
      ...rest
    }) : (
      <Input
        type={type}
        name={name}
        modifiers={{ error: inputErrors.length > 0 }}
        id={name}
        onChange={onChange}
        {...rest} />
    );

    return (
      <FormRow style={style}>
        {['radio', 'checkbox'].indexOf(type) === -1 && labelComponent}
        {inputComponent}
        {['radio', 'checkbox'].indexOf(type) > -1 && labelComponent}
        {help && (
          <div className="b-form__help">
            {help}
          </div>
        )}
        <Errors errors={inputErrors} />
      </FormRow>
    );
  }
}
