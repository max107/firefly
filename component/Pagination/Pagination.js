import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { range } from './utils';
import { Page } from './Page';
import { ThemeContext } from '../Theme';
import { theme } from '../bem';

export class Pagination extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func,
    total: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageSizes: PropTypes.array,
    page: PropTypes.number.isRequired,
    show: PropTypes.number,
    scrollToTop: PropTypes.bool
  };

  static defaultProps = {
    show: 3,
    scrollToTop: true,
    onPageSizeChange: () => null,
    pageSizes: [10, 25, 50, 100]
  };

  onPageChange = page => {
    if (page === this.props.page) {
      return;
    }

    const {
      scrollToTop,
      onPageChange
    } = this.props;
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }

    onPageChange(page);
  };

  onPageSizeChange = e => {
    const {
      scrollToTop,
      onPageSizeChange
    } = this.props;
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }

    onPageSizeChange(e.target.value);
  };

  renderPageSize() {
    const {
      onPageSizeChange,
      pageSizes
    } = this.props;

    if (!onPageSizeChange) {
      return null;
    }

    const sizeNodes = pageSizes.map((num, i) => (
      <option value={num} key={i}>
        {num}
      </option>
    ));

    return (
      <div className={theme("b-pagination__size", this.context)}>
        <select
          className="b-input b-input--select"
          onChange={this.onPageSizeChange}>
          {sizeNodes}
        </select>
      </div>
    );
  }

  render() {
    const {
      page,
      total,
      show,
      pageCount
    } = this.props;

    if (!pageCount) {
      return null;
    }

    const delta = page - show;
    const from = delta < 1 ? 1 : delta;
    const to = pageCount <= page + show ? pageCount + 1 : page + show + 1;

    const nodes = range(from, to).map((p, i) => (
      <Page
        onClick={this.onPageChange}
        page={p}
        isCurrent={p === page}
        key={i} />
    ));

    return (
      <div className={theme("b-pagination", this.context)}>
        <div className={theme("b-pagination__list", this.context)}>
          {page - show > 1 && <Page onClick={this.onPageChange} page={1} />}
          {page - show > 2 && <Page page='...' />}
          {nodes}
          {pageCount - (page + show) > 1 && <Page page='...' />}
          {pageCount - (page + show) >= 1 && <Page onClick={this.onPageChange} page={pageCount} />}
        </div>
        <div className="b-pagination__total">Всего: {total}</div>
        {this.renderPageSize()}
      </div>
    );
  }
}
