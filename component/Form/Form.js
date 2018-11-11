import { Component } from 'react';
import PropTypes from 'prop-types';

export class Form extends Component {
  static propTypes = {
    callback: PropTypes.func,
    errors: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    form: PropTypes.object,
    onError: PropTypes.func,
    onSuccess: PropTypes.func
  };

  static defaultProps = {
    form: {},
    errors: [],
    callback: () => Promise.resolve(),
    onSuccess: () => null,
    onError: () => null
  };

  state = {
    form: {},
    errors: {}
  };

  submit = e => {
    e.preventDefault();

    const {
      onError,
      onSuccess,
      callback
    } = this.props;

    const {
      form
    } = this.state;

    callback(this.prepare(form)).then(response => {
      if (onSuccess) {
        onSuccess({ response, form });
      }
    }).catch(data => {
      if (data.error && data.error.response && data.error.response.status === 400) {
        this.setState({
          errors: data.error.response.data.errors
        }, () => {
          if (onError) {
            onError(data);
          }
        });
      } else if (onError) {
        onError(data);
      }
    });
  };

  getValueFromEvent = e => {
    // obj.nativeEvent
    if (typeof e.target === 'undefined') {
      return e;
    }

    const { target } = e;

    const type = target.getAttribute('type');
    switch (type) {
      case 'radio':
      case 'checkbox':
        return target.checked;

      case 'file':
        return target.getAttribute('multiple') ? target.files : target.files[0];

      default:
        return target.value;
    }
  };

  change = name => e => {
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [name]: this.getValueFromEvent(e)
      }
    });
  };

  componentDidMount() {
    this.setState({
      form: this.props.form
    });
  }

  componentWillUnmount() {
    this.setState({
      errors: []
    });
  }

  prepare(form) {
    return form;
  }
}
