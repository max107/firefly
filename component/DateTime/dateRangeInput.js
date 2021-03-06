import classNames from 'classnames';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import { AbstractPureComponent } from '../AbstractPureComponent';
import { Boundary } from '../common/boundary';
import {
  Classes,
  InputGroup,
  Intent,
  Keys,
  Popover,
  Position,
  Utils
} from '..';
import { isDateValid, isDayInRange } from './common/dateUtils';
import * as Errors from './common/errors';
import { getFormattedDateString } from './dateFormat';
import { getDefaultMaxDate, getDefaultMinDate } from './datePickerCore';
import { DateRangePicker } from './dateRangePicker';

export class DateRangeInput extends AbstractPureComponent {
  static defaultProps = {
    allowSingleDayRange: false,
    closeOnSelection: true,
    contiguousCalendarMonths: true,
    dayPickerProps: {},
    disabled: false,
    endInputProps: {},
    invalidDateMessage: 'Invalid date',
    maxDate: getDefaultMaxDate(),
    minDate: getDefaultMinDate(),
    outOfRangeMessage: 'Out of range',
    overlappingDatesMessage: 'Overlapping dates',
    popoverProps: {},
    selectAllOnFocus: false,
    shortcuts: true,
    startInputProps: {}
  };
  refHandlers = {
    endInputRef: (ref) => {
      this.endInputRef = ref;
      Utils.safeInvoke(this.props.endInputProps.inputRef, ref);
    },
    startInputRef: (ref) => {
      this.startInputRef = ref;
      Utils.safeInvoke(this.props.startInputProps.inputRef, ref);
    }
  };
  renderInputGroup = (boundary) => {
    const inputProps = this.getInputProps(boundary);
    const handleInputEvent = boundary === Boundary.START ? this.handleStartInputEvent : this.handleEndInputEvent;
    return (React.createElement(InputGroup, Object.assign({ autoComplete: 'off' }, inputProps, {
      disabled: this.props.disabled,
      intent: this.isInputInErrorState(boundary) ? Intent.DANGER : inputProps.intent,
      inputRef: this.getInputRef(boundary),
      onBlur: handleInputEvent,
      onChange: handleInputEvent,
      onClick: handleInputEvent,
      onFocus: handleInputEvent,
      onKeyDown: handleInputEvent,
      onMouseDown: handleInputEvent,
      placeholder: this.getInputPlaceholderString(boundary),
      value: this.getInputDisplayString(boundary)
    })));
  };
  // ===========================
  handleDateRangePickerChange = (selectedRange, didSubmitWithEnter = false) => {
    // ignore mouse events in the date-range picker if the popover is animating closed.
    if (!this.state.isOpen) {
      return;
    }

    const [
      selectedStart,
      selectedEnd
    ] = selectedRange;

    let isOpen = true;
    let isStartInputFocused;
    let isEndInputFocused;
    let startHoverString;
    let endHoverString;

    if (selectedStart == null) {
      // focus the start field by default or if only an end date is specified
      isStartInputFocused = true;
      isEndInputFocused = false;
      // for clarity, hide the hover string until the mouse moves over a different date
      startHoverString = null;
    } else if (selectedEnd == null) {
      // focus the end field if a start date is specified
      isStartInputFocused = false;
      isEndInputFocused = true;
      endHoverString = null;
    } else if (this.props.closeOnSelection) {
      isOpen = false;
      isStartInputFocused = false;
      // if we submit via click or Tab, the focus will have moved already.
      // it we submit with Enter, the focus won't have moved, and setting
      // the flag to false won't have an effect anyway, so leave it true.
      isEndInputFocused = didSubmitWithEnter ? true : false;
    } else if (this.state.lastFocusedField === Boundary.START) {
      // keep the start field focused
      isStartInputFocused = true;
      isEndInputFocused = false;
    } else {
      // keep the end field focused
      isStartInputFocused = false;
      isEndInputFocused = true;
    }

    const baseStateChange = {
      endHoverString,
      endInputString: this.formatDate(selectedEnd),
      isEndInputFocused,
      isOpen,
      isStartInputFocused,
      startHoverString,
      startInputString: this.formatDate(selectedStart),
      wasLastFocusChangeDueToHover: false
    };
    if (this.isControlled()) {
      this.setState(baseStateChange);
    } else {
      this.setState(Object.assign({}, baseStateChange, { selectedEnd, selectedStart }));
    }
    Utils.safeInvoke(this.props.onChange, selectedRange);
  };
  // Callbacks - DateRangePicker
  handleDateRangePickerHoverChange = (hoveredRange, _hoveredDay, hoveredBoundary) => {
    // ignore mouse events in the date-range picker if the popover is animating closed.
    if (!this.state.isOpen) {
      return;
    }

    if (hoveredRange == null) {
      // undo whatever focus changes we made while hovering over various calendar dates
      const isEndInputFocused = this.state.boundaryToModify === Boundary.END;
      this.setState({
        endHoverString: null,
        isEndInputFocused,
        isStartInputFocused: !isEndInputFocused,
        lastFocusedField: this.state.boundaryToModify,
        startHoverString: null
      });
    } else {
      const [hoveredStart, hoveredEnd] = hoveredRange;
      const isStartInputFocused = hoveredBoundary != null ? hoveredBoundary === Boundary.START : this.state.isStartInputFocused;
      const isEndInputFocused = hoveredBoundary != null ? hoveredBoundary === Boundary.END : this.state.isEndInputFocused;
      this.setState({
        endHoverString: this.formatDate(hoveredEnd),
        isEndInputFocused,
        isStartInputFocused,
        lastFocusedField: isStartInputFocused ? Boundary.START : Boundary.END,
        shouldSelectAfterUpdate: this.props.selectAllOnFocus,
        startHoverString: this.formatDate(hoveredStart),
        wasLastFocusChangeDueToHover: true
      });
    }
  };
  // instantiate these two functions once so we don't have to for each callback on each render.
  handleStartInputEvent = (e) => {
    this.handleInputEvent(e, Boundary.START);
  };

  // Callbacks - Input
  // =================
  handleEndInputEvent = (e) => {
    this.handleInputEvent(e, Boundary.END);
  };
  handleInputEvent = (e, boundary) => {
    switch (e.type) {
      case 'blur':
        this.handleInputBlur(e, boundary);
        break;
      case 'change':
        this.handleInputChange(e, boundary);
        break;
      case 'click':
        this.handleInputClick(e);
        break;
      case 'focus':
        this.handleInputFocus(e, boundary);
        break;
      case 'keydown':
        this.handleInputKeyDown(e);
        break;
      case 'mousedown':
        this.handleInputMouseDown();
        break;
      default:
        break;
    }
    const inputProps = this.getInputProps(boundary);
    const callbackFn = this.getInputGroupCallbackForEvent(e, inputProps);
    Utils.safeInvoke(callbackFn, e);
  };
  // - if focused in end field, Shift+Tab moves focus to start field
  handleInputKeyDown = (e) => {
    const isTabPressed = e.which === Keys.TAB;
    const isEnterPressed = e.which === Keys.ENTER;
    const isShiftPressed = e.shiftKey;
    const { selectedStart, selectedEnd } = this.state;
    // order of JS events is our enemy here. when tabbing between fields,
    // this handler will fire in the middle of a focus exchange when no
    // field is currently focused. we work around this by referring to the
    // most recently focused field, rather than the currently focused field.
    const wasStartFieldFocused = this.state.lastFocusedField === Boundary.START;
    const wasEndFieldFocused = this.state.lastFocusedField === Boundary.END;

    // move focus to the other field
    if (isTabPressed) {
      let isEndInputFocused;
      let isStartInputFocused;
      let isOpen = true;

      if (wasStartFieldFocused && !isShiftPressed) {
        isStartInputFocused = false;
        isEndInputFocused = true;
        // prevent the default focus-change behavior to avoid race conditions;
        // we'll handle the focus change ourselves in componentDidUpdate.
        e.preventDefault();
      } else if (wasEndFieldFocused && isShiftPressed) {
        isStartInputFocused = true;
        isEndInputFocused = false;
        e.preventDefault();
      } else {
        // don't prevent default here, otherwise Tab won't do anything.
        isStartInputFocused = false;
        isEndInputFocused = false;
        isOpen = false;
      }
      this.setState({
        isEndInputFocused,
        isOpen,
        isStartInputFocused,
        wasLastFocusChangeDueToHover: false
      });
    } else if (wasStartFieldFocused && isEnterPressed) {
      const nextStartDate = this.parseDate(this.state.startInputString);
      this.handleDateRangePickerChange([nextStartDate, selectedEnd], true);
    } else if (wasEndFieldFocused && isEnterPressed) {
      const nextEndDate = this.parseDate(this.state.endInputString);
      this.handleDateRangePickerChange([selectedStart, nextEndDate], true);
    } else {
      // let the default keystroke happen without side effects
      return;
    }
  };

  // add a keydown listener to persistently change focus when tabbing:
  // - if focused in start field, Tab moves focus to end field
  handleInputMouseDown = () => {
    // clicking in the field constitutes an explicit focus change. we update
    // the flag on "mousedown" instead of on "click", because it needs to be
    // set before onFocus is called ("click" triggers after "focus").
    this.setState({ wasLastFocusChangeDueToHover: false });
  };
  handleInputClick = (e) => {
    // unless we stop propagation on this event, a click within an input
    // will close the popover almost as soon as it opens.
    e.stopPropagation();
  };
  handleInputFocus = (_e, boundary) => {
    const {
      keys,
      values
    } = this.getStateKeysAndValuesForBoundary(boundary);

    const inputString = getFormattedDateString(values.selectedValue, this.props, true);
    // change the boundary only if the user explicitly focused in the field.
    // focus changes from hovering don't count; they're just temporary.
    const boundaryToModify = this.state.wasLastFocusChangeDueToHover ? this.state.boundaryToModify : boundary;

    this.setState({
      [keys.inputString]: inputString,
      [keys.isInputFocused]: true,
      boundaryToModify,
      isOpen: true,
      lastFocusedField: boundary,
      shouldSelectAfterUpdate: this.props.selectAllOnFocus,
      wasLastFocusChangeDueToHover: false
    });
  };
  handleInputBlur = (_e, boundary) => {
    const { keys, values } = this.getStateKeysAndValuesForBoundary(boundary);
    const maybeNextDate = this.parseDate(values.inputString);
    const isValueControlled = this.isControlled();
    let nextState = {
      [keys.isInputFocused]: false,
      shouldSelectAfterUpdate: false
    };

    if (this.isInputEmpty(values.inputString)) {
      if (isValueControlled) {
        nextState = Object.assign({}, nextState, { [keys.inputString]: getFormattedDateString(values.controlledValue, this.props) });
      }
      else {
        nextState = Object.assign({}, nextState, { [keys.inputString]: null, [keys.selectedValue]: null });
      }
    } else if (!this.isNextDateRangeValid(maybeNextDate, boundary)) {
      if (!isValueControlled) {
        nextState = Object.assign({}, nextState, { [keys.inputString]: null, [keys.selectedValue]: maybeNextDate });
      }
      Utils.safeInvoke(this.props.onError, this.getDateRangeForCallback(maybeNextDate, boundary));
    }
    this.setState(nextState);
  };
  handleInputChange = (e, boundary) => {
    const inputString = e.target.value;
    const { keys } = this.getStateKeysAndValuesForBoundary(boundary);
    const maybeNextDate = this.parseDate(inputString);
    const isValueControlled = this.isControlled();
    let nextState = {
      shouldSelectAfterUpdate: false
    };

    if (inputString.length === 0) {
      // this case will be relevant when we start showing the hovered range in the input
      // fields. goal is to show an empty field for clarity until the mouse moves over a
      // different date.
      const baseState = Object.assign({}, nextState, { [keys.inputString]: '' });
      if (isValueControlled) {
        nextState = baseState;
      } else {
        nextState = Object.assign({}, baseState, { [keys.selectedValue]: null });
      }
      Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(null, boundary));
    }
    else if (this.isDateValidAndInRange(maybeNextDate)) {
      // note that error cases that depend on both fields (e.g. overlapping dates) should fall
      // through into this block so that the UI can update immediately, possibly with an error
      // message on the other field.
      // also, clear the hover string to ensure the most recent keystroke appears.
      const baseState = Object.assign({}, nextState, { [keys.hoverString]: null, [keys.inputString]: inputString });

      if (isValueControlled) {
        nextState = baseState;
      } else {
        nextState = Object.assign({}, baseState, { [keys.selectedValue]: maybeNextDate });
      }

      if (this.isNextDateRangeValid(maybeNextDate, boundary)) {
        Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(maybeNextDate, boundary));
      }
    } else {
      // again, clear the hover string to ensure the most recent keystroke appears
      nextState = Object.assign({}, nextState, { [keys.inputString]: inputString, [keys.hoverString]: null });
    }
    this.setState(nextState);
  };
  // ===================
  handlePopoverClose = () => {
    this.setState({ isOpen: false });
    Utils.safeInvoke(this.props.popoverProps.onClose);
  };

  // Callbacks - Popover
  getInitialRange = (props = this.props) => {
    const { defaultValue, value } = props;

    if (value != null) {
      return value;
    } else if (defaultValue != null) {
      return defaultValue;
    } else {
      return [null, null];
    }
  };
  getSelectedRange = () => {
    let selectedStart;
    let selectedEnd;

    if (this.isControlled()) {
      [selectedStart, selectedEnd] = this.props.value;
    } else {
      selectedStart = this.state.selectedStart;
      selectedEnd = this.state.selectedEnd;
    }

    // this helper function checks if the provided boundary date *would* overlap the selected
    // other boundary date. providing the already-selected start date simply tells us if we're
    // currently in an overlapping state.
    const doBoundaryDatesOverlap = this.doBoundaryDatesOverlap(selectedStart, Boundary.START);
    const dateRange = [selectedStart, doBoundaryDatesOverlap ? undefined : selectedEnd];
    return dateRange.map((selectedBound) => {
      return this.isDateValidAndInRange(selectedBound) ? selectedBound : undefined;
    });
  };
  getInputGroupCallbackForEvent = (e, inputProps) => {
    // use explicit switch cases to ensure callback function names remain grep-able in the codebase.
    switch (e.type) {
      case 'blur':
        return inputProps.onBlur;
      case 'change':
        return inputProps.onChange;
      case 'click':
        return inputProps.onClick;
      case 'focus':
        return inputProps.onFocus;
      case 'keydown':
        return inputProps.onKeyDown;
      case 'mousedown':
        return inputProps.onMouseDown;
      default:
        return undefined;
    }
  };
  getInputDisplayString = (boundary) => {
    const {
      values
    } = this.getStateKeysAndValuesForBoundary(boundary);

    const {
      isInputFocused,
      inputString,
      selectedValue,
      hoverString
    } = values;

    if (hoverString != null) {
      return hoverString;
    } else if (isInputFocused) {
      return inputString == null ? '' : inputString;
    } else if (selectedValue == null) {
      return '';
    } else if (this.doesEndBoundaryOverlapStartBoundary(selectedValue, boundary)) {
      return this.props.overlappingDatesMessage;
    } else {
      return getFormattedDateString(selectedValue, this.props);
    }
  };
  getInputPlaceholderString = (boundary) => {
    const isStartBoundary = boundary === Boundary.START;
    const isEndBoundary = boundary === Boundary.END;
    const inputProps = this.getInputProps(boundary);
    const { isInputFocused } = this.getStateKeysAndValuesForBoundary(boundary).values;
    // use the custom placeholder text for the input, if providied
    if (inputProps.placeholder != null) {
      return inputProps.placeholder;
    } else if (isStartBoundary) {
      return isInputFocused ? this.state.formattedMinDateString : 'Start date';
    } else if (isEndBoundary) {
      return isInputFocused ? this.state.formattedMaxDateString : 'End date';
    } else {
      return '';
    }
  };
  getInputProps = (boundary) => {
    return boundary === Boundary.START ? this.props.startInputProps : this.props.endInputProps;
  };
  getInputRef = (boundary) => {
    return boundary === Boundary.START ? this.refHandlers.startInputRef : this.refHandlers.endInputRef;
  };
  getStateKeysAndValuesForBoundary = (boundary) => {
    const controlledRange = this.props.value;

    if (boundary === Boundary.START) {
      return {
        keys: {
          hoverString: 'startHoverString',
          inputString: 'startInputString',
          isInputFocused: 'isStartInputFocused',
          selectedValue: 'selectedStart'
        },
        values: {
          controlledValue: controlledRange != null ? controlledRange[0] : undefined,
          hoverString: this.state.startHoverString,
          inputString: this.state.startInputString,
          isInputFocused: this.state.isStartInputFocused,
          selectedValue: this.state.selectedStart
        }
      };
    } else {
      return {
        keys: {
          hoverString: 'endHoverString',
          inputString: 'endInputString',
          isInputFocused: 'isEndInputFocused',
          selectedValue: 'selectedEnd'
        },
        values: {
          controlledValue: controlledRange != null ? controlledRange[1] : undefined,
          hoverString: this.state.endHoverString,
          inputString: this.state.endInputString,
          isInputFocused: this.state.isEndInputFocused,
          selectedValue: this.state.selectedEnd
        }
      };
    }
  };
  getDateRangeForCallback = (currDate, currBoundary) => {
    const otherBoundary = this.getOtherBoundary(currBoundary);
    const otherDate = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;
    return currBoundary === Boundary.START ? [currDate, otherDate] : [otherDate, currDate];
  };
  getOtherBoundary = (boundary) => {
    return boundary === Boundary.START ? Boundary.END : Boundary.START;
  };
  doBoundaryDatesOverlap = (date, boundary) => {
    const { allowSingleDayRange } = this.props;
    const otherBoundary = this.getOtherBoundary(boundary);
    const otherBoundaryDate = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;
    if (date == null || otherBoundaryDate == null) {
      return false;
    }
    if (boundary === Boundary.START) {
      const isAfter = DayPicker.DateUtils.isDayAfter(date, otherBoundaryDate);
      return isAfter || (!allowSingleDayRange && DayPicker.DateUtils.isSameDay(date, otherBoundaryDate));
    }
    else {
      const isBefore = DayPicker.DateUtils.isDayBefore(date, otherBoundaryDate);
      return isBefore || (!allowSingleDayRange && DayPicker.DateUtils.isSameDay(date, otherBoundaryDate));
    }
  };
  /**
   * Returns true if the provided boundary is an END boundary overlapping the
   * selected start date. (If the boundaries overlap, we consider the END
   * boundary to be erroneous.)
   */
  doesEndBoundaryOverlapStartBoundary = (boundaryDate, boundary) => {
    return boundary === Boundary.START ? false : this.doBoundaryDatesOverlap(boundaryDate, boundary);
  };
  isControlled = () => this.props.value !== undefined;
  isInputEmpty = (inputString) => inputString == null || inputString.length === 0;
  isInputInErrorState = (boundary) => {
    const values = this.getStateKeysAndValuesForBoundary(boundary).values;
    const { isInputFocused, hoverString, inputString, selectedValue } = values;
    if (hoverString != null || this.isInputEmpty(inputString)) {
      // don't show an error state while we're hovering over a valid date.
      return false;
    }
    const boundaryValue = isInputFocused ? this.parseDate(inputString) : selectedValue;
    return (boundaryValue != null &&
      (!this.isDateValidAndInRange(boundaryValue) ||
        this.doesEndBoundaryOverlapStartBoundary(boundaryValue, boundary)));
  };
  isDateValidAndInRange = (date) => {
    return isDateValid(date) && isDayInRange(date, [this.props.minDate, this.props.maxDate]);
  };

  constructor(props, context) {
    super(props, context);
    this.reset(props);
  }

  /**
   * Public method intended for unit testing only. Do not use in feature work!
   */
  reset(props = this.props) {
    const [selectedStart, selectedEnd] = this.getInitialRange();
    this.state = {
      formattedMaxDateString: this.getFormattedMinMaxDateString(props, 'maxDate'),
      formattedMinDateString: this.getFormattedMinMaxDateString(props, 'minDate'),
      isOpen: false,
      selectedEnd,
      selectedStart
    };
  }

  componentDidUpdate() {
    const { isStartInputFocused, isEndInputFocused, shouldSelectAfterUpdate } = this.state;
    const shouldFocusStartInput = this.shouldFocusInputRef(isStartInputFocused, this.startInputRef);
    const shouldFocusEndInput = this.shouldFocusInputRef(isEndInputFocused, this.endInputRef);
    if (shouldFocusStartInput) {
      this.startInputRef.focus();
    }
    else if (shouldFocusEndInput) {
      this.endInputRef.focus();
    }
    if (isStartInputFocused && shouldSelectAfterUpdate) {
      this.startInputRef.select();
    }
    else if (isEndInputFocused && shouldSelectAfterUpdate) {
      this.endInputRef.select();
    }
  }

  render() {
    const {
      popoverProps = {}
    } = this.props;

    const popoverContent = (
      <DateRangePicker
        {...this.props}
        boundaryToModify={this.state.boundaryToModify}
        onChange={this.handleDateRangePickerChange}
        onHoverChange={this.handleDateRangePickerHoverChange}
        value={this.getSelectedRange()} />
    );

    const popoverClassName = classNames(popoverProps.className, this.props.className);

    // allow custom props for the popover and each input group, but pass them in an order that
    // guarantees only some props are overridable.
    return (
      <Popover
        isOpen={this.state.isOpen}
        position={Position.BOTTOM_LEFT}
        {...this.props.popoverProps}
        autoFocus={false}
        className={popoverClassName}
        content={popoverContent}
        enforceFocus={false}
        onClose={this.handlePopoverClose}>
        <div className={Classes.CONTROL_GROUP}>
          {this.renderInputGroup(Boundary.START)}
          {this.renderInputGroup(Boundary.END)}
        </div>
      </Popover>
    );
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    let nextState = {};
    if (nextProps.value !== this.props.value) {
      const [selectedStart, selectedEnd] = this.getInitialRange(nextProps);
      nextState = Object.assign({}, nextState, { selectedStart, selectedEnd });
    }
    // cache the formatted date strings to avoid computing on each render.
    if (nextProps.minDate !== this.props.minDate) {
      const formattedMinDateString = this.getFormattedMinMaxDateString(nextProps, 'minDate');
      nextState = Object.assign({}, nextState, { formattedMinDateString });
    }
    if (nextProps.maxDate !== this.props.maxDate) {
      const formattedMaxDateString = this.getFormattedMinMaxDateString(nextProps, 'maxDate');
      nextState = Object.assign({}, nextState, { formattedMaxDateString });
    }
    this.setState(nextState);
  }

  validateProps(props) {
    if (props.value === null) {
      throw new Error(Errors.DATERANGEINPUT_NULL_VALUE);
    }
  }

  // Helpers
  // =======
  shouldFocusInputRef(isFocused, inputRef) {
    return isFocused && inputRef !== undefined && document.activeElement !== inputRef;
  }

  isNextDateRangeValid(nextDate, boundary) {
    return this.isDateValidAndInRange(nextDate) && !this.doBoundaryDatesOverlap(nextDate, boundary);
  }

  // this is a slightly kludgy function, but it saves us a good amount of repeated code between
  // the constructor and componentWillReceiveProps.
  getFormattedMinMaxDateString(props, propName) {
    const date = props[propName];
    const defaultDate = DateRangeInput.defaultProps[propName];
    // default values are applied only if a prop is strictly `undefined`
    // See: https://facebook.github.io/react/docs/react-component.html#defaultprops
    return getFormattedDateString(date === undefined ? defaultDate : date, this.props);
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
    if (!this.isDateValidAndInRange(date)) {
      return '';
    }
    const { locale, formatDate } = this.props;
    return formatDate(date, locale);
  }
}
