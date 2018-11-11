import { getDateNextMonth, getDatePreviousMonth } from './dateUtils';

export class MonthAndYear {
  constructor(month, year) {
    if (month !== null && year !== null) {
      this.date = new Date(year, month);
    }
    else {
      this.date = new Date();
    }
  }

  static fromDate(date) {
    return date == null ? undefined : new MonthAndYear(date.getMonth(), date.getFullYear());
  }

  clone() {
    return new MonthAndYear(this.getMonth(), this.getYear());
  }

  getFullDate() {
    return this.date;
  }

  getMonth() {
    return this.date.getMonth();
  }

  getYear() {
    return this.date.getFullYear();
  }

  getPreviousMonth() {
    const previousMonthDate = getDatePreviousMonth(this.date);
    return new MonthAndYear(previousMonthDate.getMonth(), previousMonthDate.getFullYear());
  }

  getNextMonth() {
    const nextMonthDate = getDateNextMonth(this.date);
    return new MonthAndYear(nextMonthDate.getMonth(), nextMonthDate.getFullYear());
  }

  isBefore(monthAndYear) {
    return compareMonthAndYear(this, monthAndYear) < 0;
  }

  isAfter(monthAndYear) {
    return compareMonthAndYear(this, monthAndYear) > 0;
  }

  isSame(monthAndYear) {
    return compareMonthAndYear(this, monthAndYear) === 0;
  }
}

// returns negative if left < right
// returns positive if left > right
// returns 0 if left === right
function compareMonthAndYear(firstMonthAndYear, secondMonthAndYear) {
  const firstMonth = firstMonthAndYear.getMonth();
  const firstYear = firstMonthAndYear.getYear();
  const secondMonth = secondMonthAndYear.getMonth();
  const secondYear = secondMonthAndYear.getYear();
  if (firstYear === secondYear) {
    return firstMonth - secondMonth;
  }
  else {
    return firstYear - secondYear;
  }
}
