import React, { PureComponent } from 'react';
import { Icon } from '../Icon';

export class More extends PureComponent {
  render() {
    return (
      <div className="more">
        <Icon
          icon='MoreHorizontal'
          className='more__icon' />
      </div>
    )
  }
}
