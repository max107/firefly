import cx from 'classnames';
import React, { Children } from 'react';
import { AbstractPureComponent } from '../AbstractPureComponent';
import * as Keys from '../common/keys';
import * as Utils from '../utils/utils';
import { Tab } from './Tab';
import { generateTabPanelId, generateTabTitleId, TabTitle } from './TabTitle';
import { bem } from '../bem';

function isEventKeyCode(e, ...codes) {
  return codes.indexOf(e.which) >= 0;
}

const TAB_SELECTOR = '.b-tab';

export class Tabs extends AbstractPureComponent {
  static defaultProps = {
    animate: true,
    large: false,
    renderActiveTabPanelOnly: true,
    vertical: false
  };

  state = { selectedTabId: this.getInitialSelectedTabId() };

  refHandlers = {
    tablist: tabElement => {
      this.tablistElement = tabElement;
    }
  };

  handleKeyDown = e => {
    const focusedElement = document.activeElement.closest(TAB_SELECTOR);
    // rest of this is potentially expensive and futile, so bail if no tab is focused
    if (focusedElement == null) {
      return;
    }
    // must rely on DOM state because we have no way of mapping `focusedElement` to a JSX.Element
    const enabledTabElements = this.getTabElements().filter(el => el.getAttribute('aria-disabled') === 'false');
    const focusedIndex = enabledTabElements.indexOf(focusedElement);
    const direction = this.getKeyCodeDirection(e);
    if (focusedIndex >= 0 && direction !== undefined) {
      e.preventDefault();

      const {
        length
      } = enabledTabElements;

      // auto-wrapping at 0 and `length`
      const nextFocusedIndex = (focusedIndex + direction + length) % length;
      enabledTabElements[nextFocusedIndex].focus();
    }
  };

  handleKeyPress = e => {
    const targetTabElement = e.target.closest(TAB_SELECTOR);
    if (targetTabElement != null && isEventKeyCode(e, Keys.SPACE, Keys.ENTER)) {
      e.preventDefault();
      targetTabElement.click();
    }
  };

  handleTabClick = (newTabId, event) => {
    const {
      onChange,
      selectedTabId
    } = this.props;

    Utils.safeInvoke(onChange, newTabId, this.state.selectedTabId, event);
    if (selectedTabId === undefined) {
      this.setState({
        selectedTabId: newTabId
      });
    }
  };

  renderTabPanel = tab => {
    const {
      className,
      children,
      id
    } = tab.props;

    return (
      <div
        aria-labelledby={generateTabTitleId(this.props.id, id)}
        aria-hidden={id !== this.state.selectedTabId}
        className={cx('b-tab__panel', className)}
        id={generateTabPanelId(this.props.id, id)}
        key={id}
        role="tabpanel">
        {children}
      </div>
    );
  };

  renderTabTitle = tab => {
    const {
      id
    } = tab.props;

    return (
      <TabTitle
        {...tab.props}
        parentId={this.props.id}
        onClick={this.handleTabClick}
        selected={id === this.state.selectedTabId} />
    );
  };

  render() {
    const {
      indicatorWrapperStyle,
      selectedTabId
    } = this.state;

    const {
      renderActiveTabPanelOnly,
      className,
      animate,
      modifiers,
      large,
      vertical,
      children
    } = this.props;

    const tabTitles = Children.map(
      children,
      child => Utils.isElementOfType(child, Tab) ? this.renderTabTitle(child) : child
    );

    const tabPanels = this.getTabChildren()
      .filter(renderActiveTabPanelOnly ? tab => tab.props.id === selectedTabId : () => true)
      .map(this.renderTabPanel);

    const tabIndicator = animate ? (
      <div className='b-tab__wrapper' style={indicatorWrapperStyle}>
        <div className='b-tab__indicator' />
      </div>
    ) : null;

    const classes = cx('b-tab__tabs', {
      'b-tab__tabs--vertical': vertical
    }, className);

    const tabListClasses = bem('b-tab__list', {
      ...modifiers,
      large
    });

    return (
      <div className={classes}>
        <div
          className={tabListClasses}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          ref={this.refHandlers.tablist}
          role="tablist">
          {tabIndicator}
          {tabTitles}
        </div>
        {tabPanels}
      </div>
    );
  }

  componentDidMount() {
    this.moveSelectionIndicator();
  }

  componentWillReceiveProps({ selectedTabId }) {
    if (selectedTabId !== undefined) {
      // keep state in sync with controlled prop, so state is canonical source of truth
      this.setState({ selectedTabId });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedTabId !== prevState.selectedTabId) {
      this.moveSelectionIndicator();
    } else if (prevState.selectedTabId != null) {
      // comparing React nodes is difficult to do with simple logic, so
      // shallowly compare just their props as a workaround.
      const didChildrenChange = !Utils.arraysEqual(this.getTabChildrenProps(prevProps), this.getTabChildrenProps(), Utils.shallowCompareKeys);
      if (didChildrenChange) {
        this.moveSelectionIndicator();
      }
    }
  }

  getInitialSelectedTabId() {
    // NOTE: providing an unknown ID will hide the selection
    const { defaultSelectedTabId, selectedTabId } = this.props;
    if (selectedTabId !== undefined) {
      return selectedTabId;
    }
    if (defaultSelectedTabId !== undefined) {
      return defaultSelectedTabId;
    }

    // select first tab in absence of user input
    const tabs = this.getTabChildren();
    return tabs.length === 0 ? undefined : tabs[0].props.id;
  }

  getKeyCodeDirection(e) {
    if (isEventKeyCode(e, Keys.ARROW_LEFT, Keys.ARROW_UP)) {
      return -1;
    }
    if (isEventKeyCode(e, Keys.ARROW_RIGHT, Keys.ARROW_DOWN)) {
      return 1;
    }
    return undefined;
  }

  getTabChildrenProps(props = this.props) {
    return this.getTabChildren(props).map(child => child.props);
  }

  /** Filters children to only `<Tab>`s */
  getTabChildren(props = this.props) {
    return React.Children.toArray(props.children).filter(child => {
      return Utils.isElementOfType(child, Tab);
    });
  }

  /** Queries root HTML element for all tabs with optional filter selector */
  getTabElements(subselector = '') {
    if (this.tablistElement == null) {
      return [];
    }
    return Array.from(this.tablistElement.querySelectorAll(TAB_SELECTOR + subselector));
  }

  /**
   * Calculate the new height, width, and position of the tab indicator.
   * Store the CSS values so the transition animation can start.
   */
  moveSelectionIndicator() {
    if (this.tablistElement == null || !this.props.animate) {
      return;
    }

    const tabIdSelector = `${TAB_SELECTOR}[data-tab-id="${this.state.selectedTabId}"]`;
    const selectedTabElement = this.tablistElement.querySelector(tabIdSelector);

    let indicatorWrapperStyle = { display: 'none' };
    if (selectedTabElement != null) {
      const {
        clientHeight,
        clientWidth,
        offsetLeft,
        offsetTop
      } = selectedTabElement;

      indicatorWrapperStyle = {
        height: clientHeight,
        transform: `translateX(${Math.floor(offsetLeft)}px) translateY(${Math.floor(offsetTop)}px)`,
        width: clientWidth
      };
    }
    this.setState({ indicatorWrapperStyle });
  }
}
