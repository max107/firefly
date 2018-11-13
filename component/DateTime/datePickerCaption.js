import * as BlueprintUtils from 'firefly/component/utils/utils';
import * as React from 'react';
import * as Classes from './common/classes';
import * as Utils from './common/utils';

export class DatePickerCaption extends React.PureComponent {
  state = {
    monthWidth: 0
  };

  containerRefHandler = (r) => (this.containerElement = r);

  handleMonthSelectChange = (e) => {
    const month = parseInt(e.target.value, 10);
    BlueprintUtils.safeInvoke(this.props.onMonthChange, month);
  };

  handleYearSelectChange = (e) => {
    const year = parseInt(e.target.value, 10);
    BlueprintUtils.safeInvoke(this.props.onYearChange, year);
  };

  render() {
    const {
      date,
      locale,
      localeUtils,
      minDate,
      maxDate
    } = this.props;

    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    const displayMonth = date.getMonth();
    const displayYear = date.getFullYear();

    // build the list of available months, limiting based on minDate and maxDate as necessary
    const months = localeUtils.getMonths(locale);
    const startMonth = displayYear === minYear ? minDate.getMonth() : 0;
    const endMonth = displayYear === maxYear ? maxDate.getMonth() + 1 : undefined;
    const monthOptionElements = months
      .map((name, i) => {
        return (
          <option key={i} value={i.toString()}>
            {name}
          </option>
        );
      })
      .slice(startMonth, endMonth);

    const years = [minYear];
    for (let year = minYear + 1; year <= maxYear; ++year) {
      years.push(year);
    }
    const yearOptionElements = years.map((year, i) => {
      return (
        <option key={i} value={year.toString()}>
          {year}
        </option>
      );
    });
    // allow out-of-bounds years but disable the option. this handles the Dec 2016 case in #391.
    if (displayYear > maxYear) {
      yearOptionElements.push(
        <option key="next" disabled={true} value={displayYear.toString()}>
          {displayYear}
        </option>
      );
    }

    this.displayedMonthText = months[displayMonth];

    const monthSelect = (
      <select
        key="month"
        className='b-input b-input--select'
        onChange={this.handleMonthSelectChange}
        value={displayMonth.toString()}>
        {monthOptionElements}
      </select>
    );
    const yearSelect = (
      <select
        key="year"
        className='b-input b-input--select'
        onChange={this.handleYearSelectChange}
        value={displayYear.toString()}>
        {yearOptionElements}
      </select>
    );

    const orderedSelects = this.props.reverseMonthAndYearMenus
      ? [yearSelect, monthSelect]
      : [monthSelect, yearSelect];

    return (
      <div className={Classes.DATEPICKER_CAPTION} ref={this.containerRefHandler}>
        {orderedSelects}
      </div>
    );
  }

  componentDidMount() {
    requestAnimationFrame(() => this.positionArrows());
  }

  componentDidUpdate() {
    this.positionArrows();
  }

  positionArrows() {
    // measure width of text as rendered inside our container element.
    const monthWidth = Utils.measureTextWidth(this.displayedMonthText, Classes.DATEPICKER_CAPTION_MEASURE, this.containerElement);
    this.setState({ monthWidth });
  }
}
