import * as React from 'react';
import classNames from 'classnames';
import { HOTKEYS_HOTKEY_CHILDREN } from '../common/errors';
import { isElementOfType } from '../utils/utils';
import { Hotkey } from './Hotkey';
import { AbstractPureComponent } from '../AbstractPureComponent';

export class Hotkeys extends AbstractPureComponent {
  static defaultProps = {
    tabIndex: 0
  };

  render() {
    const hotkeys = React.Children.map(
      this.props.children,
      child => child.props
    );

    // sort by group label alphabetically, globals first
    hotkeys.sort((a, b) => {
      if (a.global) {
        return b.global ? 0 : -1;
      }
      if (b.global) {
        return 1;
      }
      return a.group.localeCompare(b.group);
    });

    let lastGroup = null;
    const elems = [];
    for (const hotkey of hotkeys) {
      const groupLabel = hotkey.group;
      if (groupLabel !== lastGroup) {
        elems.push((
          <h4 className='heading heading--medium' key={`group-${elems.length}`}>
            {groupLabel}
          </h4>
        ));
        lastGroup = groupLabel;
      }
      elems.push(<Hotkey key={elems.length} {...hotkey} />);
    }
    const rootClasses = classNames('hotkey-column', this.props.className);

    return (
      <div className={rootClasses}>
        {elems}
      </div>
    );
  }

  validateProps(props) {
    React.Children.forEach(props.children, (child) => {
      if (!isElementOfType(child, Hotkey)) {
        throw new Error(HOTKEYS_HOTKEY_CHILDREN);
      }
    });
  }
}
