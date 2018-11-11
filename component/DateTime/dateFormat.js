import { isDateValid, isDayInRange } from './common/dateUtils';

export function getFormattedDateString(date, props, ignoreRange = false) {
  if (date == null) {
    return '';
  } else if (!isDateValid(date)) {
    return props.invalidDateMessage;
  } else if (ignoreRange || isDayInRange(date, [props.minDate, props.maxDate])) {
    return props.formatDate(date, props.locale);
  } else {
    return props.outOfRangeMessage;
  }
}
