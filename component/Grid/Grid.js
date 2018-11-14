import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { GridItem } from './GridItem';
import { bem } from '..';

export class Grid extends Component {
  static propTypes = {
    every: PropTypes.number.isRequired,
    children: PropTypes.any
  };

  render() {
    const {
      every,
      children
    } = this.props;

    const nodes = Children.map(children, (child, key) => (
      <GridItem key={key} every={every}>{child}</GridItem>
    ));

    return (
      <div className={bem('b-grid', `every-${every}`)}>
        {nodes}
      </div>
    )
  }
}