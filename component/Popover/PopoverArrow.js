import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getPosition } from './PopperUtils';

// these paths come from the Core Kit Sketch file
// https://github.com/palantir/blueprint/blob/develop/resources/sketch/Core%20Kit.sketch
const SVG_SHADOW_PATH = 'M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378' +
  '-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z';
const SVG_ARROW_PATH = 'M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005' +
  'c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z';

/** Modifier helper function to compute arrow rotate() transform */
function getArrowAngle(placement) {
  if (placement == null) {
    return 0;
  }
  // can only be top/left/bottom/right - auto is resolved internally
  switch (getPosition(placement)) {
    case 'top':
      return -90;
    case 'left':
      return 180;
    case 'bottom':
      return 90;
    default:
      return 0;
  }
}

export class PopoverArrow extends PureComponent {
  static propTypes = {
    placement: PropTypes.string,
    arrowProps: PropTypes.shape({
      ref: PropTypes.any,
      style: PropTypes.any
    })
  };

  static defaultProps = {
    placement: null
  };

  render() {
    const {
      arrowProps: { ref, style },
      placement
    } = this.props;

    return (
      <div className='b-popover-arrow' ref={ref} style={isNaN(style.left) ? {} : style}>
        <svg className='b-popover-arrow__svg' viewBox="0 0 30 30"
             style={{ transform: `rotate(${getArrowAngle(placement)}deg)` }}>
          <path className='b-popover-arrow__border' d={SVG_SHADOW_PATH} />
          <path className='b-popover-arrow__fill' d={SVG_ARROW_PATH} />
        </svg>
      </div>
    );
  }
}
