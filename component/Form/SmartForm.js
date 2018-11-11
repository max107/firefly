import React from 'react';
import PropTypes from 'prop-types';
import { Form } from './Form';
import { FormRow } from './FormRow';
import { Group } from './Group';
import { Button, ButtonType } from '../Button';

export class SmartForm extends Form {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    callback: PropTypes.func,
    errors: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    submitText: PropTypes.string,
    form: PropTypes.object,
    onError: PropTypes.func,
    onSuccess: PropTypes.func
  };

  static defaultProps = {
    submitText: 'Сохранить'
  };

  render() {
    const {
      fields,
      errors,
      submitText,
      loading
    } = this.props;

    const {
      form
    } = this.state;

    return (
      <form onSubmit={this.submit}>
        <Group
          loading={loading}
          errors={errors}
          fields={fields}
          values={form}
          onChange={this.change} />

        <FormRow>
          <Button
            state={loading ? ButtonType.LOADING : null}
            type="submit">
            {submitText}
          </Button>
        </FormRow>
      </form>
    );
  }
}
