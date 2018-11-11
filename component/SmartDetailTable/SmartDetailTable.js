import React, { Component } from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path-value';

export class SmartDetailTable extends Component {
  static propTypes = {
    object: PropTypes.object.isRequired,
    mapping: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      key: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
      ])
    })).isRequired
  };

  render() {
    const {
      object,
      mapping
    } = this.props;

    const nodes = mapping.map((item, i) => (
      <tr key={i} className="b-table__tr">
        <th className="b-table__th b-table__th--definition">
          {typeof item.title === 'function' ? item.title(item) : item.title}
        </th>
        <td className="b-table__td">
          {typeof item.value === 'function' ? item.value(object) : objectPath(object, item.value)}
        </td>
      </tr>
    ));

    return (
      <table className="b-table">
        <tbody className="b-table__tbody">
          {nodes}
        </tbody>
      </table>
    );
  }
}
