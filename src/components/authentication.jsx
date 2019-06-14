import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export default function requireAuth(Component)
{
  class AuthenticatedComponent extends React.Component
  {
    state = {
      isLoggedIn: false,
    }

    componentDidMount()
    {
      this.checkAuth();
    }

    checkAuth()
    {
      const token = localStorage.getItem('token');

      if (!token)
      {
        const { history } = this.props;
        history.push('/Auth');
      } else
      {
        this.setState({ isLoggedIn: true });
      }
    }

    render()
    {
      const { isLoggedIn } = this.state;
      return isLoggedIn
        ? <Component {...this.props} />
        : null;
    }
  }

  AuthenticatedComponent.propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  return withRouter(AuthenticatedComponent);
}
