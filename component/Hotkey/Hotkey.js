import classNames from 'classnames';
import * as React from 'react';
import { AbstractPureComponent } from '../AbstractPureComponent';
import { HotKeyCombo } from './HotKeyCombo';

export class Hotkey extends AbstractPureComponent {
  static defaultProps = {
    allowInInput: false,
    disabled: false,
    global: false,
    preventDefault: false,
    stopPropagation: false
  };

  render() {
    const {
      label,
      className,
      ...spreadableProps
    } = this.props;

    const rootClasses = classNames('hotkey', className);

    return (
      <div className={rootClasses}>
        <div className={'hotkey-label'}>{label}</div>
        <HotKeyCombo {...spreadableProps} />
      </div>
    );
  }

  validateProps(props) {
    if (props.global !== true && props.group == null) {
      throw new Error('non-global <Hotkey>s must define a group');
    }
  }
}
