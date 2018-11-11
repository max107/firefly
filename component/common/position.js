export const Position = {
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  LEFT: 'left',
  LEFT_BOTTOM: 'left-bottom',
  LEFT_TOP: 'left-top',
  RIGHT: 'right',
  RIGHT_BOTTOM: 'right-bottom',
  RIGHT_TOP: 'right-top',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
};

export function isPositionHorizontal(position) {
  /* istanbul ignore next */
  return (position === Position.TOP ||
    position === Position.TOP_LEFT ||
    position === Position.TOP_RIGHT ||
    position === Position.BOTTOM ||
    position === Position.BOTTOM_LEFT ||
    position === Position.BOTTOM_RIGHT);
}

export function isPositionVertical(position) {
  /* istanbul ignore next */
  return (position === Position.LEFT ||
    position === Position.LEFT_TOP ||
    position === Position.LEFT_BOTTOM ||
    position === Position.RIGHT ||
    position === Position.RIGHT_TOP ||
    position === Position.RIGHT_BOTTOM);
}
