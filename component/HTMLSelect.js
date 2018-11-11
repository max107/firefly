import classNames from 'classnames';
import React from 'react';
import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from './common/classes';
import { Icon } from './Icon';

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class HTMLSelect extends React.PureComponent {
  render() {
    const {
      className,
      disabled,
      elementRef,
      fill,
      iconProps,
      large,
      minimal,
      options = [],
      ...htmlProps
    } = this.props;

    const classes = classNames(
      HTML_SELECT,
      {
        [DISABLED]: disabled,
        [FILL]: fill,
        [LARGE]: large,
        [MINIMAL]: minimal
      },
      className
    );

    const optionChildren = options.map(option => {
      const props = option === 'object' ? option : { value: option };
      return <option {...props} key={props.value} children={props.label || props.value} />;
    });

    return (
      <div className={classes}>
        <select disabled={disabled} ref={elementRef} {...htmlProps} multiple={false}>
          {optionChildren}
          {htmlProps.children}
        </select>
        <Icon icon="double-caret-vertical" {...iconProps} />
      </div>
    );
  }
}
