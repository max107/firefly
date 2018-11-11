import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { Boundary } from '../common/boundary';
import { OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED } from '../common/errors';
import { ResizeSensor } from '../ResizeSensor';

export class OverflowList extends PureComponent {
  static defaultProps = {
    collapseFrom: Boundary.START,
    minVisibleItems: 0
  };
  /** A cache containing the widths of all elements being observed to detect growing/shrinking */
  previousWidths = new Map();
  spacer = null;
  state = {
    overflow: [],
    visible: this.props.items
  };
  resize = entries => {
    // if any parent is growing, assume we have more room than before
    const growing = entries.some(entry => {
      const previousWidth = this.previousWidths.get(entry.target) || 0;
      return entry.contentRect.width > previousWidth;
    });

    this.repartition(growing);
    entries.forEach(entry => this.previousWidths.set(entry.target, entry.contentRect.width));
  };

  static ofType() {
    return OverflowList;
  }

  componentDidMount() {
    this.repartition(false);
  }

  componentWillReceiveProps(nextProps) {
    const {
      collapseFrom,
      items,
      minVisibleItems,
      observeParents,
      overflowRenderer,
      visibleItemRenderer
    } = this.props;

    if (observeParents !== nextProps.observeParents) {
      console.warn(OVERFLOW_LIST_OBSERVE_PARENTS_CHANGED);
    }

    if (collapseFrom !== nextProps.collapseFrom ||
      items !== nextProps.items ||
      minVisibleItems !== nextProps.minVisibleItems ||
      overflowRenderer !== nextProps.overflowRenderer ||
      visibleItemRenderer !== nextProps.visibleItemRenderer) {
      // reset visible state if the above props change.
      this.setState({
        overflow: [],
        visible: nextProps.items
      });
    }
  }

  componentDidUpdate() {
    this.repartition(false);
  }

  render() {
    const {
      className,
      collapseFrom,
      observeParents,
      style,
      visibleItemRenderer
    } = this.props;

    const overflow = this.maybeRenderOverflow();

    return (
      <ResizeSensor onResize={this.resize} observeParents={observeParents}>
        <div className={classNames('b-overflow-list', className)} style={style}>
          {collapseFrom === Boundary.START ? overflow : null}
          {this.state.visible.map(visibleItemRenderer)}
          {collapseFrom === Boundary.END ? overflow : null}
          <div className={'b-overflow-list-spacer'} ref={ref => (this.spacer = ref)} />
        </div>
      </ResizeSensor>
    );
  }

  maybeRenderOverflow() {
    const {
      overflow
    } = this.state;

    if (overflow.length === 0) {
      return null;
    }

    return this.props.overflowRenderer(overflow);
  }

  repartition(growing) {
    if (this.spacer == null) {
      return;
    }

    if (growing) {
      this.setState({
        overflow: [],
        visible: this.props.items
      });
    } else if (this.spacer.getBoundingClientRect().width < 1) {
      // spacer has flex-shrink and width 1px so if it's any smaller then we know to shrink
      this.setState(state => {
        if (state.visible.length <= this.props.minVisibleItems) {
          return null;
        }
        const collapseFromStart = this.props.collapseFrom === Boundary.START;
        const visible = state.visible.slice();
        const next = collapseFromStart ? visible.shift() : visible.pop();
        if (next === undefined) {
          return null;
        }

        const overflow = collapseFromStart ? [...state.overflow, next] : [next, ...state.overflow];

        return {
          overflow,
          visible
        };
      });
    }
  }
}
