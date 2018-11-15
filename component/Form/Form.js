import { Component } from 'react';
import PropTypes from 'prop-types';
import { normalizeFloat } from 'firefly-util';

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
    if (e) {
      e.preventDefault();
    }

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

  change = (name, type = null) => e => {
    if (null === type) {
      const { form } = this.state;

      if (e instanceof Date) {
        this.setState({
          form: {
            ...form,
            [name]: e
          }
        });
      } else if (e instanceof Object && typeof e.target !== 'undefined') {
        const { target } = e;
        const type = target.getAttribute('type');

        let {
          value
        } = target;

        switch (type) {
          case 'checkbox':
            value = target.checked;
            break;

          case 'file':
            if (target.getAttribute('multiple')) {
              value = target.files;
            } else {
              value = target.files[0];
            }
            break;

          default:
            break;
        }

        this.setState({
          form: {
            ...form,
            [name]: value
          }
        });
      } else if (typeof e.target === 'undefined') {
        this.setState({
          form: {
            ...form,
            [name]: e.value
          }
        });
      }
    } else {
      return this.handleChange(name, type)(e);
    }
  };

  handleChange = (name, type) => e => {
    const { form } = this.state;

    switch (type) {
      case 'wysiwyg':
      case 'ckeditor':
      case 'tinymce':
        this.setState({
          form: {
            ...form,
            [name]: e
          }
        });
        break;

      case 'date-range':
      case 'daterange':
        this.setState({
          form: {
            ...form,
            [name]: e
          }
        });
        break;

      case 'checkbox':
      case 'radio':
        this.setState({
          form: { ...form, [name]: e.target.checked }
        });
        break;

      case 'file':
        this.setState({
          form: {
            ...form,
            [name]: e.target.getAttribute('multiple')
              ? e.target.files
              : e.target.files[0]
          }
        });
        break;

      case 'datetime':
      case 'date':
        this.setState({
          form: { ...form, [name]: e }
        });
        break;

      case 'react-select':
      case 'reactselect':
        this.setState({
          form: { ...form, [name]: e.value }
        });
        break;

      case 'number':
        this.setState({
          form: { ...form, [name]: normalizeFloat(e.target.value) }
        });
        break;

      case 'text':
      case 'textarea':
      case 'email':
      case 'search':
      default:
        this.setState({
          form: { ...form, [name]: e.target.value }
        });
        break;
    }
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
