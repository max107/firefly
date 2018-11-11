import React, { PureComponent } from 'react';
import cx from 'classnames';

export class Tab extends PureComponent {
  static defaultProps = {
    disabled: false,
    id: undefined
  };

  // this component is never rendered directly; see Tabs#renderTabPanel()
  /* istanbul ignore next */
  render() {
    const {
      className,
      children
    } = this.props;

    return (
      <div
        className={cx('b-tab__panel', className)}
        role="tablist">
        {children}
      </div>
    );
  }
}
