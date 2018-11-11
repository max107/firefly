import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { clamp } from '../utils/utils';
import { SpinnerSize } from './SpinnerSize';
import { bem } from '../bem';

// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
const SPINNER_TRACK = 'M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89';

// unitless total length of SVG path, to which stroke-dash* properties are relative.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
// this value is the result of `<path d={SPINNER_TRACK} />.getTotalLength()`
// and works in all browsers:

const PATH_LENGTH = 280;
const STROKE_WIDTH = 8;
const MIN_STROKE_WIDTH = 16;

/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export class Spinner extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    size: PropTypes.number,
    modifiers: PropTypes.any
  };

  static defaultProps = {
    value: null,
    modifiers: [],
    size: SpinnerSize.MEDIUM
  };

  render() {
    const {
      size,
      modifiers,
      value
    } = this.props;

    const strokeWidth = Math.min(MIN_STROKE_WIDTH, STROKE_WIDTH);
    const strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1));

    return (
      <svg
        className={bem('b-spinner', modifiers)}
        height={size}
        width={size}
        viewBox="0 0 100 100"
        strokeWidth={strokeWidth}>
        <path className={bem('b-spinner__track', modifiers)} d={SPINNER_TRACK} />
        <path
          className={bem('b-spinner__head', modifiers)}
          d={SPINNER_TRACK}
          pathLength={PATH_LENGTH}
          strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
          strokeDashoffset={strokeOffset} />
      </svg>
    );
  }
}
