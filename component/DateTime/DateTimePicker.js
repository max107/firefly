import classNames from 'classnames';
import React from 'react';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Utils from '../utils/utils';
import * as DateUtils from './common/dateUtils';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { bem } from '../bem';
import { ThemeContext } from '../Theme';

export class DateTimePicker extends AbstractPureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    canClearSelection: true,
    defaultValue: new Date()
  };

  constructor(props, context) {
    super(props, context);
    this.handleDateChange = (dateValue, isUserChange) => {
      if (this.props.value === undefined) {
        this.setState({ dateValue });
      }
      const value = DateUtils.getDateTime(dateValue, this.state.timeValue);
      Utils.safeInvoke(this.props.onChange, value, isUserChange);
    };
    this.handleTimeChange = (timeValue) => {
      if (this.props.value === undefined) {
        this.setState({ timeValue });
      }
      const value = DateUtils.getDateTime(this.state.dateValue, timeValue);
      Utils.safeInvoke(this.props.onChange, value, true);
    };
    const initialValue = this.props.value !== undefined ? this.props.value : this.props.defaultValue;
    this.state = {
      dateValue: initialValue,
      timeValue: initialValue
    };
  }

  render() {
    const value = DateUtils.getDateTime(this.state.dateValue, this.state.timeValue);

    const cls = classNames(bem('b-datetimepicker', {
      [`theme-${this.context}`]: this.context
    }), this.props.className);

    return (
      <div className={cls}>
        <DatePicker
          {...this.props.datePickerProps}
          canClearSelection={this.props.canClearSelection}
          onChange={this.handleDateChange}
          value={value} />
        <TimePicker
          {...this.props.timePickerProps}
          onChange={this.handleTimeChange}
          value={value} />
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value === nextProps.value) {
      return;
    }

    if (nextProps.value != null) {
      this.setState({
        dateValue: nextProps.value,
        timeValue: nextProps.value
      });
    } else {
      // clear only the date to remove the selected-date style in the calendar
      this.setState({ dateValue: null });
    }
  }
}
