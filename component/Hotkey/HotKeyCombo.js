import React from 'react';
import classNames from 'classnames';
import { normalizeKeyCombo } from './HotkeyParser';
import { Icon } from '../Icon';

const KeyIcons = {
  alt: 'key-option',
  cmd: 'key-command',
  ctrl: 'key-control',
  delete: 'key-delete',
  down: 'arrow-down',
  enter: 'key-enter',
  left: 'arrow-left',
  meta: 'key-command',
  right: 'arrow-right',
  shift: 'key-shift',
  up: 'arrow-up'
};

export class HotKeyCombo extends React.Component {
  renderMinimalKey = (key, index) => {
    const icon = KeyIcons[key];
    return icon == null ? key : <Icon icon={icon} key={`key-${index}`} />;
  };

  renderKey = (key, index) => {
    const icon = KeyIcons[key];

    return icon == null ? (
      <kbd className='b-key' key={`key-${index}`}>
        {key}
      </kbd>
    ) : (
      <kbd className={classNames('b-key', 'b-modifier-key')} key={`key-${index}`}>
        {icon} {key}
      </kbd>
    );
  };

  render() {
    const { className, combo, minimal } = this.props;
    const keys = normalizeKeyCombo(combo)
      .map(key => (key.length === 1 ? key.toUpperCase() : key))
      .map(minimal ? this.renderMinimalKey : this.renderKey);
    return <span className={classNames('b-key-combo', className)}>{keys}</span>;
  }
}
