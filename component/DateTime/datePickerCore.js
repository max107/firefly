export const DISABLED_MODIFIER = 'disabled';
export const HOVERED_RANGE_MODIFIER = 'hovered-range';
export const OUTSIDE_MODIFIER = 'outside';
export const SELECTED_MODIFIER = 'selected';
export const SELECTED_RANGE_MODIFIER = 'selected-range';

// modifiers the user can't set because they are used by Blueprint or react-day-picker
export const DISALLOWED_MODIFIERS = [
  DISABLED_MODIFIER,
  HOVERED_RANGE_MODIFIER,
  OUTSIDE_MODIFIER,
  SELECTED_MODIFIER,
  SELECTED_RANGE_MODIFIER
];

export function getDefaultMaxDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear());
  date.setMonth(11 /* DECEMBER */, 31);
  return date;
}

export function getDefaultMinDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 20);
  date.setMonth(0 /* JANUARY */, 1);
  return date;
}

export function combineModifiers(baseModifiers, userModifiers) {
  let modifiers = baseModifiers;
  if (userModifiers != null) {
    modifiers = {};
    for (const key of Object.keys(userModifiers)) {
      if (DISALLOWED_MODIFIERS.indexOf(key) === -1) {
        modifiers[key] = userModifiers[key];
      }
    }
    for (const key of Object.keys(baseModifiers)) {
      modifiers[key] = baseModifiers[key];
    }
  }
  return modifiers;
}
