import classNames from 'classnames';
import React, { PureComponent } from 'react';

export class TabTitle extends PureComponent {
  handleClick = (e) => this.props.onClick(this.props.id, e);

  render() {
    const {
      disabled,
      id,
      parentId,
      selected
    } = this.props;

    return (
      <div
        aria-controls={generateTabPanelId(parentId, id)}
        aria-disabled={disabled}
        aria-expanded={selected}
        aria-selected={selected}
        className={classNames('b-tab', this.props.className)}
        data-tab-id={id}
        id={generateTabTitleId(parentId, id)}
        onClick={disabled ? undefined : this.handleClick}
        role="tab"
        tabIndex={disabled ? undefined : 0}>
        {this.props.title}
      </div>
    );
  }
}

export function generateTabPanelId(parentId, tabId) {
  return `b-tab-panel_${parentId}_${tabId}`;
}

export function generateTabTitleId(parentId, tabId) {
  return `b-tab-title_${parentId}_${tabId}`;
}
