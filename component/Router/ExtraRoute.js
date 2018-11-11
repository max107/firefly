import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

export class ExtraRoute extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    layout: PropTypes.any
  };

  static defaultProps = {
    layout: null
  };

  render() {
    const {
      component: WrapComponent,
      layout: Layout,
      ...rest
    } = this.props;

    const render = props => Layout ? (
      <Layout>
        <WrapComponent {...props} />
      </Layout>
    ) : (
      <WrapComponent {...props} />
    );

    return (
      <Route {...rest} render={render} />
    );
  }
}
