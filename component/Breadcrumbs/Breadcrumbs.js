import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { OverflowList } from '../OverflowList';
import { Popover } from '../Popover';
import { Menu, MenuItem } from '../Menu';

export class Breadcrumbs extends PureComponent {
  static propTypes = {
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string,
      icon: PropTypes.string,
      text: PropTypes.string
    })).isRequired
  };

  renderOverflow = (items) => {
    const menuItems = items.slice().reverse().map((item, index) => (
      <MenuItem {...item} key={index} />
    ));

    return [
      (
        <div key='overflow' className='b-breadcrumb__more'>
          <Popover position={'bottom-left'}>
            <Icon icon='MoreHorizontal' />
            <Menu>{menuItems}</Menu>
          </Popover>
        </div>
      ),
      (
        <div key='overflow-symbol' className='b-breadcrumb__symbol'>
          <Icon icon='ChevronRight' />
        </div>
      )
    ];
  };

  renderBreadcrumb = (props, index) => {
    const icon = props.icon && (
      <Icon
        className='b-breadcrumb__icon'
        icon={props.icon} />
    );

    return [
      (
        <div
          className={cx('b-breadcrumb__item', { 'b-breadcrumb__item--last': !props.to })}
          key={index}>
          {props.to ? (
            <Link className='b-breadcrumb__link' key={index} to={props.to}>
              {icon}
              <span className="b-breadcrumb__text">{props.text}</span>
            </Link>
          ) : (
            <span className="b-breadcrumb__link b-breadcrumb__link--inactive">
              {icon}
              <span className="b-breadcrumb__text">{props.text}</span>
            </span>
          )}
        </div>
      ),
      props.to ? (
        <div key={`${index}-symbol`} className='b-breadcrumb__symbol'>
          <Icon icon='ChevronRight' />
        </div>
      ) : null
    ];
  };

  render() {
    const {
      breadcrumbs
    } = this.props;

    return (
      <div className="b-breadcrumb">
        <OverflowList
          collapseFrom='start'
          items={breadcrumbs}
          overflowRenderer={this.renderOverflow}
          visibleItemRenderer={this.renderBreadcrumb} />
      </div>
    );
  }
}
