import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { bem } from '../bem';
import objectPath from 'object-path-value';
import { NonIdealState } from '../NonIdealState';

export class Table extends Component {
  static propTypes = {
    modifiers: PropTypes.array,
    renderColumns: PropTypes.array,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        tdStyle: PropTypes.object,
        style: PropTypes.object,
        title: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.node,
          PropTypes.object,
          PropTypes.func
        ]).isRequired,
        value: PropTypes.func
      })
    ).isRequired,
    className: PropTypes.string,
    data: PropTypes.array
  };

  static defaultProps = {
    className: '',
    modifiers: [
      'single',
      'transparent'
    ],
    renderColumns: [],
    data: []
  };

  render() {
    const {
      className,
      modifiers,
      renderColumns,
      columns,
      data
    } = this.props;

    const header = [];
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];

      if (renderColumns.length > 0 && renderColumns.indexOf(col.column) === -1) {
        continue;
      }

      header.push((
        <th
          className={cx(bem('table__th', modifiers), col.className)}
          style={col.style || {}}
          key={i}>
          {col.title}
        </th>
      ));
    }

    const body = data.map((item, t) => {
      const nodes = [];
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        if (renderColumns.length > 0 && renderColumns.indexOf(col.column) === -1) {
          continue;
        }

        nodes.push((
          <td
            style={col.tdStyle || {}}
            className={bem('table__td', modifiers)}
            key={`${i}-${t}`}>
            {col.value ? col.value(item) : objectPath(item, col.column)}
          </td>
        ));
      }

      return (
        <tr className="table__tr" key={t}>
          {nodes}
        </tr>
      );
    });

    if (data.length === 0) {
      return (
        <NonIdealState title='Записи отсутствуют' />
      );
    }

    return (
      <div className="table__wrapper">
        <table className={cx('table', className)}>
          <thead className="table__thead">
            <tr className="table__tr">
              {header}
            </tr>
          </thead>
          <tbody className="table__tbody">
            {body}
          </tbody>
        </table>
      </div>
    );
  }
}
