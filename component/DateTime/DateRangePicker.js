import { AbstractPureComponent } from '../AbstractPureComponent';
import { Boundary } from '../common/boundary';
import * as Utils from '../utils/utils';
import { Menu, MenuItem } from '..';
import classNames from 'classnames';
import React, { createElement } from 'react';
import ReactDayPicker from 'react-day-picker';
import * as DateClasses from './common/classes';
import * as DateUtils from './common/dateUtils';
import * as Errors from './common/errors';
import { MonthAndYear } from './common/monthAndYear';
import { DatePickerCaption } from './datePickerCaption';
import {
  combineModifiers,
  getDefaultMaxDate,
  getDefaultMinDate,
  HOVERED_RANGE_MODIFIER,
  SELECTED_RANGE_MODIFIER
} from './datePickerCore';
import { DateRangeSelectionStrategy } from './dateRangeSelectionStrategy';

export class DateRangePicker extends AbstractPureComponent {
  constructor(props, context) {
    super(props, context);
    // these will get merged with the user's own
    this.modifiers = {
      [SELECTED_RANGE_MODIFIER]: day => {
        const { value } = this.state;
        return value[0] != null && value[1] != null && DateUtils.isDayInRange(day, value, true);
      },
      [`${SELECTED_RANGE_MODIFIER}-start`]: day => DateUtils.areSameDay(this.state.value[0], day),
      [`${SELECTED_RANGE_MODIFIER}-end`]: day => DateUtils.areSameDay(this.state.value[1], day),
      [HOVERED_RANGE_MODIFIER]: (day) => {
        const { hoverValue, value } = this.state;
        const [selectedStart, selectedEnd] = value;
        if (selectedStart == null && selectedEnd == null) {
          return false;
        }
        if (hoverValue == null || hoverValue[0] == null || hoverValue[1] == null) {
          return false;
        }
        return DateUtils.isDayInRange(day, hoverValue, true);
      },
      [`${HOVERED_RANGE_MODIFIER}-start`]: (day) => {
        const { hoverValue } = this.state;
        if (hoverValue == null || hoverValue[0] == null) {
          return false;
        }
        return DateUtils.areSameDay(hoverValue[0], day);
      },
      [`${HOVERED_RANGE_MODIFIER}-end`]: (day) => {
        const { hoverValue } = this.state;
        if (hoverValue == null || hoverValue[1] == null) {
          return false;
        }
        return DateUtils.areSameDay(hoverValue[1], day);
      }
    };
    this.disabledDays = (day) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);
    this.getDisabledDaysModifier = () => {
      const { dayPickerProps: { disabledDays } } = this.props;
      return disabledDays instanceof Array ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
    };
    this.renderSingleCaption = (captionProps) => (createElement(DatePickerCaption, Object.assign({}, captionProps, {
      maxDate: this.props.maxDate,
      minDate: this.props.minDate,
      onMonthChange: this.handleLeftMonthSelectChange,
      onYearChange: this.handleLeftYearSelectChange,
      reverseMonthAndYearMenus: this.props.reverseMonthAndYearMenus
    })));
    this.renderLeftCaption = (captionProps) => (createElement(DatePickerCaption, Object.assign({}, captionProps, {
      maxDate: DateUtils.getDatePreviousMonth(this.props.maxDate),
      minDate: this.props.minDate,
      onMonthChange: this.handleLeftMonthSelectChange,
      onYearChange: this.handleLeftYearSelectChange,
      reverseMonthAndYearMenus: this.props.reverseMonthAndYearMenus
    })));
    this.renderRightCaption = (captionProps) => (createElement(DatePickerCaption, Object.assign({}, captionProps, {
      maxDate: this.props.maxDate,
      minDate: DateUtils.getDateNextMonth(this.props.minDate),
      onMonthChange: this.handleRightMonthSelectChange,
      onYearChange: this.handleRightYearSelectChange,
      reverseMonthAndYearMenus: this.props.reverseMonthAndYearMenus
    })));
    this.handleDayMouseEnter = (day, modifiers, e) => {
      Utils.safeInvoke(this.props.dayPickerProps.onDayMouseEnter, day, modifiers, e);
      if (modifiers.disabled) {
        return;
      }
      const { dateRange, boundary } = DateRangeSelectionStrategy.getNextState(this.state.value, day, this.props.allowSingleDayRange, this.props.boundaryToModify);
      this.setState({ hoverValue: dateRange });
      Utils.safeInvoke(this.props.onHoverChange, dateRange, day, boundary);
    };
    this.handleDayMouseLeave = (day, modifiers, e) => {
      Utils.safeInvoke(this.props.dayPickerProps.onDayMouseLeave, day, modifiers, e);
      if (modifiers.disabled) {
        return;
      }
      this.setState({ hoverValue: undefined });
      Utils.safeInvoke(this.props.onHoverChange, undefined, day, undefined);
    };
    this.handleDayClick = (day, modifiers, e) => {
      Utils.safeInvoke(this.props.dayPickerProps.onDayClick, day, modifiers, e);
      if (modifiers.disabled) {
        // rerender base component to get around bug where you can navigate past bounds by clicking days
        this.forceUpdate();
        return;
      }
      const nextValue = DateRangeSelectionStrategy.getNextState(this.state.value, day, this.props.allowSingleDayRange, this.props.boundaryToModify).dateRange;
      // update the hovered date range after click to show the newly selected
      // state, at leasts until the mouse moves again
      this.handleDayMouseEnter(day, modifiers, e);
      this.handleNextState(nextValue);
    };
    this.handleLeftMonthChange = (newDate) => {
      const leftView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
      this.updateLeftView(leftView);
    };
    this.handleRightMonthChange = (newDate) => {
      const rightView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
      this.updateRightView(rightView);
    };
    this.handleLeftMonthSelectChange = (leftMonth) => {
      const leftView = new MonthAndYear(leftMonth, this.state.leftView.getYear());
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
      this.updateLeftView(leftView);
    };
    this.handleRightMonthSelectChange = (rightMonth) => {
      const rightView = new MonthAndYear(rightMonth, this.state.rightView.getYear());
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
      this.updateRightView(rightView);
    };
    /*
    * The min / max months are offset by one because we are showing two months.
    * We do a comparison check to see if
    *   a) the proposed [Month, Year] change throws the two calendars out of order
    *   b) the proposed [Month, Year] goes beyond the min / max months
    * and rectify appropriately.
    */
    this.handleLeftYearSelectChange = (leftDisplayYear) => {
      let leftView = new MonthAndYear(this.state.leftView.getMonth(), leftDisplayYear);
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
      const { minDate, maxDate } = this.props;
      const adjustedMaxDate = DateUtils.getDatePreviousMonth(maxDate);
      const minMonthAndYear = new MonthAndYear(minDate.getMonth(), minDate.getFullYear());
      const maxMonthAndYear = new MonthAndYear(adjustedMaxDate.getMonth(), adjustedMaxDate.getFullYear());
      if (leftView.isBefore(minMonthAndYear)) {
        leftView = minMonthAndYear;
      }
      else if (leftView.isAfter(maxMonthAndYear)) {
        leftView = maxMonthAndYear;
      }
      let rightView = this.state.rightView.clone();
      if (!leftView.isBefore(rightView)) {
        rightView = leftView.getNextMonth();
      }
      this.setViews(leftView, rightView);
    };
    this.handleRightYearSelectChange = (rightDisplayYear) => {
      let rightView = new MonthAndYear(this.state.rightView.getMonth(), rightDisplayYear);
      Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
      const { minDate, maxDate } = this.props;
      const adjustedMinDate = DateUtils.getDateNextMonth(minDate);
      const minMonthAndYear = new MonthAndYear(adjustedMinDate.getMonth(), adjustedMinDate.getFullYear());
      const maxMonthAndYear = new MonthAndYear(maxDate.getMonth(), maxDate.getFullYear());
      if (rightView.isBefore(minMonthAndYear)) {
        rightView = minMonthAndYear;
      }
      else if (rightView.isAfter(maxMonthAndYear)) {
        rightView = maxMonthAndYear;
      }
      let leftView = this.state.leftView.clone();
      if (!rightView.isAfter(leftView)) {
        leftView = rightView.getPreviousMonth();
      }
      this.setViews(leftView, rightView);
    };
    let value = [null, null];
    if (props.value != null) {
      value = props.value;
    }
    else if (props.defaultValue != null) {
      value = props.defaultValue;
    }
    let initialMonth;
    const today = new Date();
    if (props.initialMonth != null) {
      initialMonth = props.initialMonth;
    }
    else if (value[0] != null) {
      initialMonth = DateUtils.clone(value[0]);
    }
    else if (value[1] != null) {
      initialMonth = DateUtils.clone(value[1]);
      if (!DateUtils.areSameMonth(initialMonth, props.minDate)) {
        initialMonth.setMonth(initialMonth.getMonth() - 1);
      }
    }
    else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
      initialMonth = today;
    }
    else {
      initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
    }
    // if the initial month is the last month of the picker's
    // allowable range, the react-day-picker library will show
    // the max month on the left and the *min* month on the right.
    // subtracting one avoids that weird, wraparound state (#289).
    const initialMonthEqualsMinMonth = DateUtils.areSameMonth(initialMonth, props.minDate);
    const initalMonthEqualsMaxMonth = DateUtils.areSameMonth(initialMonth, props.maxDate);
    if (!initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
      initialMonth.setMonth(initialMonth.getMonth() - 1);
    }
    // show the selected end date's encompassing month in the right view if
    // the calendars don't have to be contiguous.
    // if left view and right view months are the same, show next month in the right view.
    const leftView = MonthAndYear.fromDate(initialMonth);
    const rightDate = value[1];
    const rightView = !props.contiguousCalendarMonths && rightDate != null && !DateUtils.areSameMonth(initialMonth, rightDate)
      ? MonthAndYear.fromDate(rightDate)
      : leftView.getNextMonth();

    this.state = { leftView, rightView, value, hoverValue: [null, null] };
  }

  get isControlled() {
    return this.props.value != null;
  }

  render() {
    const modifiers = combineModifiers(this.modifiers, this.props.modifiers);

    const {
      className,
      contiguousCalendarMonths,
      dayPickerProps,
      locale,
      localeUtils,
      maxDate,
      minDate
    } = this.props;

    const isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);

    const {
      leftView,
      rightView
    } = this.state;

    const disabledDays = this.getDisabledDaysModifier();

    const dayPickerBaseProps = {
      locale,
      localeUtils,
      modifiers,
      showOutsideDays: true,
      ...dayPickerProps,
      disabledDays,
      onDayClick: this.handleDayClick,
      onDayMouseEnter: this.handleDayMouseEnter,
      onDayMouseLeave: this.handleDayMouseLeave,
      selectedDays: this.state.value
    };

    if (contiguousCalendarMonths || isShowingOneMonth) {
      const classes = classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className, {
        [DateClasses.DATERANGEPICKER_CONTIGUOUS]: contiguousCalendarMonths,
        [DateClasses.DATERANGEPICKER_SINGLE_MONTH]: isShowingOneMonth
      });

      // use the left DayPicker when we only need one
      return (
        <div className={classes}>
          {this.maybeRenderShortcuts()}
          <ReactDayPicker
            {...dayPickerBaseProps}
            captionElement={this.renderSingleCaption}
            fromMonth={minDate}
            month={leftView.getFullDate()}
            numberOfMonths={isShowingOneMonth ? 1 : 2}
            onMonthChange={this.handleLeftMonthChange}
            toMonth={maxDate} />
        </div>
      );
    } else {
      // const rightMonth = contiguousCalendarMonths ? rightView.getFullDate()
      return (
        <div className={classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className)}>
          {this.maybeRenderShortcuts()}
          <ReactDayPicker
            {...dayPickerBaseProps}
            canChangeMonth={true}
            captionElement={this.renderLeftCaption}
            fromMonth={minDate}
            month={leftView.getFullDate()}
            onMonthChange={this.handleLeftMonthChange}
            toMonth={DateUtils.getDatePreviousMonth(maxDate)} />
          <ReactDayPicker
            {...dayPickerBaseProps}
            canChangeMonth={true}
            captionElement={this.renderRightCaption}
            fromMonth={DateUtils.getDateNextMonth(minDate)}
            month={rightView.getFullDate()}
            onMonthChange={this.handleRightMonthChange}
            toMonth={maxDate} />
        </div>
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (!DateUtils.areRangesEqual(this.props.value, nextProps.value)) {
      const nextState = getStateChange(this.props.value, nextProps.value, this.state, nextProps.contiguousCalendarMonths);
      this.setState(nextState);
    }
  }

  validateProps(props) {
    const { defaultValue, initialMonth, maxDate, minDate, boundaryToModify, value } = props;
    const dateRange = [minDate, maxDate];
    if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
      throw new Error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
    }
    if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
      throw new Error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
    }
    if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
      throw new Error(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
    }
    if (value != null && !DateUtils.isDayRangeInRange(value, dateRange)) {
      throw new Error(Errors.DATERANGEPICKER_VALUE_INVALID);
    }
    if (boundaryToModify != null && boundaryToModify !== Boundary.START && boundaryToModify !== Boundary.END) {
      throw new Error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID);
    }
  }

  maybeRenderShortcuts() {
    const propsShortcuts = this.props.shortcuts;
    if (propsShortcuts == null || propsShortcuts === false) {
      return undefined;
    }
    const shortcuts = typeof propsShortcuts === 'boolean'
      ? createDefaultShortcuts(this.props.allowSingleDayRange)
      : propsShortcuts;
    const shortcutElements = shortcuts.map((s, i) => {
      return (createElement(MenuItem, {
        className: 'b-popover-dismiss-override',
        disabled: !this.isShortcutInRange(s.dateRange),
        key: i,
        onClick: this.getShorcutClickHandler(s.dateRange),
        text: s.label
      }));
    });

    return createElement(Menu, { className: DateClasses.DATERANGEPICKER_SHORTCUTS }, shortcutElements);
  }

  getShorcutClickHandler(nextValue) {
    return () => this.handleNextState(nextValue);
  }

  handleNextState(nextValue) {
    const { value } = this.state;
    const nextState = getStateChange(value, nextValue, this.state, this.props.contiguousCalendarMonths);
    if (!this.isControlled) {
      this.setState(nextState);
    }
    Utils.safeInvoke(this.props.onChange, nextValue);
  }

  updateLeftView(leftView) {
    let rightView = this.state.rightView.clone();
    if (!leftView.isBefore(rightView)) {
      rightView = leftView.getNextMonth();
    }
    this.setViews(leftView, rightView);
  }

  updateRightView(rightView) {
    let leftView = this.state.leftView.clone();
    if (!rightView.isAfter(leftView)) {
      leftView = rightView.getPreviousMonth();
    }
    this.setViews(leftView, rightView);
  }

  setViews(leftView, rightView) {
    this.setState({ leftView, rightView });
  }

  isShortcutInRange(shortcutDateRange) {
    return DateUtils.isDayRangeInRange(shortcutDateRange, [this.props.minDate, this.props.maxDate]);
  }
}

DateRangePicker.defaultProps = {
  allowSingleDayRange: false,
  contiguousCalendarMonths: true,
  dayPickerProps: {},
  maxDate: getDefaultMaxDate(),
  minDate: getDefaultMinDate(),
  reverseMonthAndYearMenus: false,
  shortcuts: true
};
DateRangePicker.displayName = `DateRangePicker`;

function getStateChange(value, nextValue, state, contiguousCalendarMonths) {
  let returnVal;
  if (value != null && nextValue == null) {
    returnVal = { value: [null, null] };
  }
  else if (nextValue != null) {
    const [nextValueStart, nextValueEnd] = nextValue;
    let leftView = state.leftView.clone();
    let rightView = state.rightView.clone();
    // Only end date selected.
    // If the newly selected end date isn't in either of the displayed months, then
    //   - set the right DayPicker to the month of the selected end date
    //   - ensure the left DayPicker is before the right, changing if needed
    if (nextValueStart == null && nextValueEnd != null) {
      const nextValueEndMonthAndYear = new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());
      if (!nextValueEndMonthAndYear.isSame(leftView) && !nextValueEndMonthAndYear.isSame(rightView)) {
        rightView = nextValueEndMonthAndYear;
        if (!leftView.isBefore(rightView)) {
          leftView = rightView.getPreviousMonth();
        }
      }
    }
    else if (nextValueStart != null && nextValueEnd == null) {
      // Only start date selected.
      // If the newly selected start date isn't in either of the displayed months, then
      //   - set the left DayPicker to the month of the selected start date
      //   - ensure the right DayPicker is before the left, changing if needed
      const nextValueStartMonthAndYear = new MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());
      if (!nextValueStartMonthAndYear.isSame(leftView) && !nextValueStartMonthAndYear.isSame(rightView)) {
        leftView = nextValueStartMonthAndYear;
        if (!rightView.isAfter(leftView)) {
          rightView = leftView.getNextMonth();
        }
      }
    }
    else if (nextValueStart != null && nextValueEnd != null) {
      // Both start date and end date selected.
      const nextValueStartMonthAndYear = new MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());
      const nextValueEndMonthAndYear = new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());
      // Both start and end date months are identical
      // If the selected month isn't in either of the displayed months, then
      //   - set the left DayPicker to be the selected month
      //   - set the right DayPicker to +1
      if (DateUtils.areSameMonth(nextValueStart, nextValueEnd)) {
        const potentialLeftEqualsNextValueStart = leftView.isSame(nextValueStartMonthAndYear);
        const potentialRightEqualsNextValueStart = rightView.isSame(nextValueStartMonthAndYear);
        if (potentialLeftEqualsNextValueStart || potentialRightEqualsNextValueStart) {
          // do nothing
        }
        else {
          leftView = nextValueStartMonthAndYear;
          rightView = nextValueStartMonthAndYear.getNextMonth();
        }
      }
      else {
        // Different start and end date months, adjust display months.
        if (!leftView.isSame(nextValueStartMonthAndYear)) {
          leftView = nextValueStartMonthAndYear;
          rightView = nextValueStartMonthAndYear.getNextMonth();
        }
        if (contiguousCalendarMonths === false && !rightView.isSame(nextValueEndMonthAndYear)) {
          rightView = nextValueEndMonthAndYear;
        }
      }
    }
    returnVal = {
      leftView,
      rightView,
      value: nextValue
    };
  }
  else {
    returnVal = {};
  }
  return returnVal;
}

function createShortcut(label, dateRange) {
  return { dateRange, label };
}

function createDefaultShortcuts(allowSingleDayRange) {
  const today = new Date();
  const makeDate = (action) => {
    const returnVal = DateUtils.clone(today);
    action(returnVal);
    returnVal.setDate(returnVal.getDate() + 1);
    return returnVal;
  };
  const yesterday = makeDate(d => d.setDate(d.getDate() - 2));
  const oneWeekAgo = makeDate(d => d.setDate(d.getDate() - 7));
  const oneMonthAgo = makeDate(d => d.setMonth(d.getMonth() - 1));
  const threeMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 3));
  const sixMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 6));
  const oneYearAgo = makeDate(d => d.setFullYear(d.getFullYear() - 1));
  const twoYearsAgo = makeDate(d => d.setFullYear(d.getFullYear() - 2));
  const singleDayShortcuts = allowSingleDayRange
    ? [createShortcut('Today', [today, today]), createShortcut('Yesterday', [yesterday, yesterday])]
    : [];
  return [
    ...singleDayShortcuts,
    createShortcut('Past week', [oneWeekAgo, today]),
    createShortcut('Past month', [oneMonthAgo, today]),
    createShortcut('Past 3 months', [threeMonthsAgo, today]),
    createShortcut('Past 6 months', [sixMonthsAgo, today]),
    createShortcut('Past year', [oneYearAgo, today]),
    createShortcut('Past 2 years', [twoYearsAgo, today])
  ];
}
