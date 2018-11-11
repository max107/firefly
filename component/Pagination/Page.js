import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bem, theme } from '../bem';
import { safeInvoke } from '../utils/utils';
import { ThemeContext } from '../Theme';

export class Page extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    page: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    isCurrent: PropTypes.bool
  };

  static defaultProps = {
    isCurrent: false,
    onClick: () => null
  };

  static contextType = ThemeContext;

  onPageClick = e => {
    e.preventDefault();
    const {
      page,
      onClick
    } = this.props;
    safeInvoke(onClick, page);
  };

  render() {
    const {
      isCurrent,
      page
    } = this.props;

    const cls = theme(bem('b-pagination__link', { current: isCurrent }), this.context);

    return (
      <button
        onClick={this.onPageClick}
        className={cls}>
        {page}
      </button>
    );
  }
}
