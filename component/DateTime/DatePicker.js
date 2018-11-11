import React from 'react';
import { Button } from '..';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as CoreClasses from '../common/classes';
import * as Utils from '../utils/utils';
import classNames from 'classnames';
import ReactDayPicker from 'react-day-picker';
import * as Classes from './common/classes';
import * as DateUtils from './common/dateUtils';
import * as Errors from './common/errors';
import { DatePickerCaption } from './datePickerCaption';
import { getDefaultMaxDate, getDefaultMinDate } from './datePickerCore';
import { ThemeContext } from '../Theme';
import { bem } from '../bem';

export class DatePicker extends AbstractPureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    canClearSelection: true,
    dayPickerProps: {},
    maxDate: getDefaultMaxDate(),
    minDate: getDefaultMinDate(),
    reverseMonthAndYearMenus: false,
    showActionsBar: false
  };

  ignoreNextMonthChange = false;

  disabledDays = (day) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);

  getDisabledDaysModifier = () => {
    const { dayPickerProps: { disabledDays } } = this.props;
    return Array.isArray(disabledDays) ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
  };

  renderCaption = (props) => (React.createElement(DatePickerCaption, Object.assign({}, props, {
    maxDate: this.props.maxDate,
    minDate: this.props.minDate,
    onMonthChange: this.handleMonthSelectChange,
    onYearChange: this.handleYearSelectChange,
    reverseMonthAndYearMenus: this.props.reverseMonthAndYearMenus
  })));

  handleDayClick = (day, modifiers, e) => {
    Utils.safeInvoke(this.props.dayPickerProps.onDayClick, day, modifiers, e);
    let newValue = day;
    if (this.props.canClearSelection && modifiers.selected) {
      newValue = null;
    }

    if (this.props.value === undefined) {
      // component is uncontrolled
      if (!modifiers.disabled) {
        const displayMonth = day.getMonth();
        const displayYear = day.getFullYear();
        const selectedDay = day.getDate();
        this.setState({
          displayMonth,
          displayYear,
          selectedDay,
          value: newValue
        });
      }
    }

    if (!modifiers.disabled) {
      Utils.safeInvoke(this.props.onChange, newValue, true);
      if (this.state.value != null && this.state.value.getMonth() !== day.getMonth()) {
        this.ignoreNextMonthChange = true;
      }
    } else {
      // rerender base component to get around bug where you can navigate past bounds by clicking days
      this.forceUpdate();
    }
  };

  handleMonthChange = (newDate) => {
    const displayMonth = newDate.getMonth();
    const displayYear = newDate.getFullYear();
    let { value } = this.state;

    if (value !== null) {
      value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);

      if (this.ignoreNextMonthChange) {
        this.ignoreNextMonthChange = false;
      } else {
        // if handleDayClick just got run, it means the user selected a date in a new month,
        // so don't run onChange again
        Utils.safeInvoke(this.props.onChange, value, false);
      }
    }

    Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
    this.setStateWithValueIfUncontrolled({ displayMonth, displayYear }, value);
  };

  handleMonthSelectChange = (displayMonth) => {
    let { value } = this.state;

    if (value !== null) {
      value = this.computeValidDateInSpecifiedMonthYear(value.getFullYear(), displayMonth);
      Utils.safeInvoke(this.props.onChange, value, false);
    }

    Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
    this.setStateWithValueIfUncontrolled({ displayMonth }, value);
  };

  handleYearSelectChange = (displayYear) => {
    let { displayMonth, value } = this.state;
    if (value !== null) {
      value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
      Utils.safeInvoke(this.props.onChange, value, false);
      displayMonth = value.getMonth();
    } else {
      const { minDate, maxDate } = this.props;
      const minYear = minDate.getFullYear();
      const maxYear = maxDate.getFullYear();
      const minMonth = minDate.getMonth();
      const maxMonth = maxDate.getMonth();

      if (displayYear === minYear && displayMonth < minMonth) {
        displayMonth = minMonth;
      } else if (displayYear === maxYear && displayMonth > maxMonth) {
        displayMonth = maxMonth;
      }
    }

    Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
    this.setStateWithValueIfUncontrolled({ displayMonth, displayYear }, value);
  };

  handleClearClick = () => {
    if (this.props.value === undefined) {
      this.setState({ value: null });
    }

    Utils.safeInvoke(this.props.onChange, null, true);
  };

  handleTodayClick = () => {
    const value = new Date();
    const displayMonth = value.getMonth();
    const displayYear = value.getFullYear();
    const selectedDay = value.getDate();

    if (this.props.value === undefined) {
      this.setState({ displayMonth, displayYear, selectedDay, value });
    } else {
      this.setState({ displayMonth, displayYear, selectedDay });
    }
    Utils.safeInvoke(this.props.onChange, value, true);
  };

  constructor(props, context) {
    super(props, context);
    let value = null;

    if (props.value !== undefined) {
      value = props.value;
    } else if (props.defaultValue != null) {
      value = props.defaultValue;
    }

    let selectedDay;
    if (value !== null) {
      selectedDay = value.getDate();
    }

    let initialMonth;
    const today = new Date();
    if (props.initialMonth != null) {
      initialMonth = props.initialMonth;
    } else if (value != null) {
      initialMonth = value;
    } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
      initialMonth = today;
    } else {
      initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
    }

    this.state = {
      displayMonth: initialMonth.getMonth(),
      displayYear: initialMonth.getFullYear(),
      selectedDay,
      value
    };
  }

  render() {
    const {
      className,
      dayPickerProps,
      locale,
      localeUtils,
      maxDate,
      minDate,
      modifiers,
      showActionsBar
    } = this.props;

    const {
      displayMonth,
      displayYear
    } = this.state;

    const cls = classNames(bem('b-datepicker', {
      [`theme-${this.context}`]: this.context
    }), className);

    return (
      <div className={cls}>
        <ReactDayPicker
          showOutsideDays={true}
          locale={locale}
          localeUtils={localeUtils}
          modifiers={modifiers}
          {...dayPickerProps}
          canChangeMonth={true}
          captionElement={this.renderCaption}
          disabledDays={this.getDisabledDaysModifier()}
          fromMonth={minDate}
          month={new Date(displayYear, displayMonth)}
          onDayClick={this.handleDayClick}
          onMonthChange={this.handleMonthChange}
          selectedDays={this.state.value}
          toMonth={maxDate} />
        {showActionsBar ? this.renderOptionsBar() : null}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      let { displayMonth, displayYear, selectedDay } = this.state;
      if (nextProps.value != null) {
        displayMonth = nextProps.value.getMonth();
        displayYear = nextProps.value.getFullYear();
        selectedDay = nextProps.value.getDate();
      }
      this.setState({
        displayMonth,
        displayYear,
        selectedDay,
        value: nextProps.value
      });
    }
    super.componentWillReceiveProps(nextProps);
  }

  validateProps(props) {
    const { defaultValue, initialMonth, maxDate, minDate, value } = props;
    if (defaultValue != null && !DateUtils.isDayInRange(defaultValue, [minDate, maxDate])) {
      throw new Error(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
    }
    if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, [minDate, maxDate])) {
      throw new Error(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
    }
    if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
      throw new Error(Errors.DATEPICKER_MAX_DATE_INVALID);
    }
    if (value != null && !DateUtils.isDayInRange(value, [minDate, maxDate])) {
      throw new Error(Errors.DATEPICKER_VALUE_INVALID);
    }
  }

  renderOptionsBar() {
    return (React.createElement('div', { className: Classes.DATEPICKER_FOOTER },
      React.createElement(Button, { className: CoreClasses.MINIMAL, onClick: this.handleTodayClick, text: 'Today' }),
      React.createElement(Button, { className: CoreClasses.MINIMAL, onClick: this.handleClearClick, text: 'Clear' })));
  }

  computeValidDateInSpecifiedMonthYear(displayYear, displayMonth) {
    const { minDate, maxDate } = this.props;
    const maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    let { selectedDay } = this.state;
    if (selectedDay > maxDaysInMonth) {
      selectedDay = maxDaysInMonth;
    }
    // matches the underlying react-day-picker timestamp behavior
    let value = new Date(displayYear, displayMonth, selectedDay, 12);
    if (value < minDate) {
      value = minDate;
    }
    else if (value > maxDate) {
      value = maxDate;
    }
    return value;
  }

  setStateWithValueIfUncontrolled(newState, value) {
    if (this.props.value === undefined) {
      // uncontrolled mode means we track value in state
      newState.value = value;
    }
    return this.setState(newState);
  }
}
