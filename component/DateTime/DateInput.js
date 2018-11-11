import classNames from 'classnames';
import * as React from 'react';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Utils from '../utils/utils';
import * as Keys from '../common/keys';
import { Popover } from '..';
import * as Classes from './common/classes';
import { isDateValid, isDayInRange } from './common/dateUtils';
import { getFormattedDateString } from './dateFormat';
import { DatePicker } from './DatePicker';
import { getDefaultMaxDate, getDefaultMinDate } from './datePickerCore';
import { DateTimePicker } from './DateTimePicker';
import { ThemeContext } from '../Theme';

export class DateInput extends AbstractPureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    closeOnSelection: true,
    dayPickerProps: {},
    disabled: false,
    invalidDateMessage: 'Invalid date',
    maxDate: getDefaultMaxDate(),
    minDate: getDefaultMinDate(),
    outOfRangeMessage: 'Out of range',
    reverseMonthAndYearMenus: false,
    timePickerProps: {}
  };
  inputEl = null;
  popoverContentEl = null;
  lastElementInPopover = null;
  refHandlers = {
    input: (el) => {
      this.inputEl = el;
    },
    popoverContent: (el) => {
      this.popoverContentEl = el;
    }
  };

  state = {
    isInputFocused: false,
    isOpen: false,
    value: this.props.value !== undefined ? this.props.value : this.props.defaultValue,
    valueString: null
  };

  handleClosePopover = (e) => {
    const { popoverProps = {} } = this.props;
    Utils.safeInvoke(popoverProps.onClose, e);
    this.setState({ isOpen: false });
  };

  handleDateChange = (newDate, isUserChange, didSubmitWithEnter = false) => {
    const {
      closeOnSelection,
      onChange,
      value
    } = this.props;

    const prevDate = this.state.value;

    // this change handler was triggered by a change in month, day, or (if
    // enabled) time. for UX purposes, we want to close the popover only if
    // the user explicitly clicked a day within the current month.
    const isOpen = !isUserChange || !closeOnSelection || (prevDate != null && (this.hasMonthChanged(prevDate, newDate) || this.hasTimeChanged(prevDate, newDate)));

    // if selecting a date via click or Tab, the input will already be
    // blurred by now, so sync isInputFocused to false. if selecting via
    // Enter, setting isInputFocused to false won't do anything by itself,
    // plus we want the field to retain focus anyway.
    // (note: spelling out the ternary explicitly reads more clearly.)
    const isInputFocused = didSubmitWithEnter;

    if (value === undefined) {
      const valueString = getFormattedDateString(newDate, this.props);
      this.setState({
        isInputFocused,
        isOpen,
        value: newDate,
        valueString
      }, () => {
        Utils.safeInvoke(onChange, newDate, isUserChange);
      });
    } else {
      this.setState({
        isInputFocused,
        isOpen
      }, () => {
        Utils.safeInvoke(onChange, newDate, isUserChange);
      });
    }
  };

  handleInputFocus = (e) => {
    const valueString = this.state.value == null ? '' : this.formatDate(this.state.value);
    this.setState({ isInputFocused: true, isOpen: true, valueString });
    this.safeInvokeInputProp('onFocus', e);
  };

  handleInputClick = (e) => {
    // stop propagation to the Popover's internal handleTargetClick handler;
    // otherwise, the popover will flicker closed as soon as it opens.
    e.stopPropagation();
    this.safeInvokeInputProp('onClick', e);
  };

  handleInputChange = (e) => {
    const {
      value,
      onChange
    } = this.props;

    const valueString = e.target.value;
    const newValue = this.parseDate(valueString);
    if (isDateValid(newValue) && this.isDateInRange(newValue)) {
      if (value === undefined) {
        this.setState({ value: newValue, valueString });
      } else {
        this.setState({ valueString });
      }
      Utils.safeInvoke(onChange, newValue, true);
    } else {
      if (valueString.length === 0) {
        Utils.safeInvoke(onChange, null, true);
      }
      this.setState({ valueString });
    }
    this.safeInvokeInputProp('onChange', e);
  };

  handleInputBlur = (e) => {
    const { valueString } = this.state;
    const date = this.parseDate(valueString);
    if (valueString.length > 0 &&
      valueString !== getFormattedDateString(this.state.value, this.props) &&
      (!isDateValid(date) || !this.isDateInRange(date))) {
      if (this.props.value === undefined) {
        this.setState({ isInputFocused: false, value: date, valueString: null });
      }
      else {
        this.setState({ isInputFocused: false });
      }
      if (isNaN(date.valueOf())) {
        Utils.safeInvoke(this.props.onError, new Date(undefined));
      }
      else if (!this.isDateInRange(date)) {
        Utils.safeInvoke(this.props.onError, date);
      }
      else {
        Utils.safeInvoke(this.props.onChange, date, true);
      }
    } else {
      if (valueString.length === 0) {
        this.setState({ isInputFocused: false, value: null, valueString: null });
      }
      else {
        this.setState({ isInputFocused: false });
      }
    }
    this.registerPopoverBlurHandler();
    this.safeInvokeInputProp('onBlur', e);
  };

  handleInputKeyDown = (e) => {
    if (e.which === Keys.ENTER) {
      const nextDate = this.parseDate(this.state.valueString);
      this.handleDateChange(nextDate, true, true);
    }
    else if (e.which === Keys.TAB && e.shiftKey) {
      // close the popover if focus will move to the previous element on
      // the page. tabbing forward should *not* close the popover, because
      // focus will be moving into the popover itself.
      this.setState({ isOpen: false });
    }
    else if (e.which === Keys.ESCAPE) {
      this.setState({ isOpen: false });
      this.inputEl.blur();
    }
    this.safeInvokeInputProp('onKeyDown', e);
  };

  // focus DOM event listener (not React event)
  handlePopoverBlur = (e) => {
    const relatedTarget = e.relatedTarget;
    if (relatedTarget == null || !this.popoverContentEl.contains(relatedTarget)) {
      this.handleClosePopover();
    }
    else if (relatedTarget != null) {
      this.unregisterPopoverBlurHandler();
      this.lastElementInPopover = relatedTarget;
      this.lastElementInPopover.addEventListener('blur', this.handlePopoverBlur);
    }
  };

  registerPopoverBlurHandler = () => {
    if (this.popoverContentEl != null) {
      // If current activeElement exists inside popover content, a month
      // change has triggered and this element should be lastTabbableElement
      let lastTabbableElement = this.popoverContentEl.contains(document.activeElement)
        ? document.activeElement
        : undefined;
      // Popover contents are well structured, but the selector will need
      // to be updated if more focusable components are added in the future
      if (lastTabbableElement == null) {
        const tabbableElements = this.popoverContentEl.querySelectorAll('input, [tabindex]:not([tabindex=\'-1\'])');
        const numOfElements = tabbableElements.length;
        if (numOfElements > 0) {
          // Keep track of the last focusable element in popover and add
          // a blur handler, so that when:
          // * user tabs to the next element, popover closes
          // * focus moves to element within popover, popover stays open
          lastTabbableElement = tabbableElements[numOfElements - 1];
        }
      }
      this.unregisterPopoverBlurHandler();
      this.lastElementInPopover = lastTabbableElement;
      this.lastElementInPopover.addEventListener('blur', this.handlePopoverBlur);
    }
  };

  unregisterPopoverBlurHandler = () => {
    if (this.lastElementInPopover != null) {
      this.lastElementInPopover.removeEventListener('blur', this.handlePopoverBlur);
    }
  };

  componentWillUnmount() {
    super.componentWillUnmount();
    this.unregisterPopoverBlurHandler();
  }

  render() {
    const {
      value,
      valueString
    } = this.state;
    const dateString = this.state.isInputFocused ? valueString : getFormattedDateString(value, this.props);
    const dateValue = isDateValid(value) ? value : null;

    const dayPickerProps = {
      ...this.props.dayPickerProps,
      // dom elements for the updated month is not available when
      // onMonthChange is called. setTimeout is necessary to wait
      // for the updated month to be rendered
      onMonthChange: (month) => {
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, month);
        this.setTimeout(this.registerPopoverBlurHandler);
      }
    };

    const popoverContent = this.props.timePrecision === undefined ? (
      <DatePicker
        {...this.props}
        dayPickerProps={dayPickerProps}
        onChange={this.handleDateChange}
        value={dateValue} />
    ) : (
      <DateTimePicker
        canClearSelection={this.props.canClearSelection}
        onChange={this.handleDateChange}
        value={value}
        datePickerProps={this.props}
        timePickerProps={{ ...this.props.timePickerProps, precision: this.props.timePrecision }} />
    );

    const wrappedPopoverContent = (
      <div ref={this.refHandlers.popoverContent}>
        {popoverContent}
      </div>
    );
    // assign default empty object here to prevent mutation
    const {
      popoverProps = {}
    } = this.props;

    const inputProps = this.getInputPropsWithDefaults();
    // const isErrorState = value != null && (!isDateValid(value) || !this.isDateInRange(value));

    return (
      <Popover
        modifiers='minimal'
        isOpen={this.state.isOpen && !this.props.disabled}
        {...popoverProps}
        autoFocus={false}
        className={classNames(popoverProps.className, this.props.className)}
        content={wrappedPopoverContent}
        enforceFocus={false}
        onClose={this.handleClosePopover}
        popoverClassName={classNames(Classes.DATEINPUT_POPOVER, popoverProps.popoverClassName)}>
        <input
          className='b-input'
          autoComplete="off"
          placeholder={this.props.placeholder}
          {...inputProps}
          disabled={this.props.disabled}
          onBlur={this.handleInputBlur}
          onChange={this.handleInputChange}
          onClick={this.handleInputClick}
          onFocus={this.handleInputFocus}
          onKeyDown={this.handleInputKeyDown}
          type="text"
          value={dateString} />
      </Popover>
    );
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getInputPropsWithDefaults() {
    const { inputProps = {} } = this.props;

    if (Utils.isFunction(inputProps.inputRef)) {
      return {
        ...inputProps,
        inputRef: el => {
          this.refHandlers.input(el);
          inputProps.inputRef(el);
        }
      };
    }

    return {
      ...inputProps,
      inputRef: this.refHandlers.input
    };
  }

  isDateInRange(value) {
    return isDayInRange(value, [this.props.minDate, this.props.maxDate]);
  }

  hasMonthChanged(prevDate, nextDate) {
    return (prevDate == null) !== (nextDate == null) || nextDate.getMonth() !== prevDate.getMonth();
  }

  hasTimeChanged(prevDate, nextDate) {
    if (this.props.timePrecision == null) {
      return false;
    }

    return ((prevDate == null) !== (nextDate == null) ||
      nextDate.getHours() !== prevDate.getHours() ||
      nextDate.getMinutes() !== prevDate.getMinutes() ||
      nextDate.getSeconds() !== prevDate.getSeconds() ||
      nextDate.getMilliseconds() !== prevDate.getMilliseconds());
  }

  /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
  safeInvokeInputProp(name, e) {
    const { inputProps = {} } = this.props;
    Utils.safeInvoke(inputProps[name], e);
  }

  parseDate(dateString) {
    if (dateString === this.props.outOfRangeMessage || dateString === this.props.invalidDateMessage) {
      return null;
    }
    const { locale, parseDate } = this.props;
    const newDate = parseDate(dateString, locale);
    return newDate === false ? new Date(undefined) : newDate;
  }

  formatDate(date) {
    if (!isDateValid(date) || !this.isDateInRange(date)) {
      return '';
    }
    const { locale, formatDate } = this.props;
    return formatDate(date, locale);
  }
}
