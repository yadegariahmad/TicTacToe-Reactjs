import React, { Suspense, lazy, Fragment } from 'react';
import
{
  withRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import requireAuth from './components/authentication';
import PageLoader from './components/pageLoader';

const waitFor = Tag => props => <Tag {...props} />;
const Auth = lazy(() => import('./containers/Auth/auth'));
const Game = lazy(() => import('./containers/Game/game'));

const Routes = ({ location }) => (
  <Fragment>
    <Suspense fallback={<PageLoader />}>
      <Switch location={location}>
        <Route path="/Auth" component={waitFor(Auth)} />
        <Route path="/Game" component={waitFor(requireAuth(Game))} />
        <Redirect to="/Auth" />
      </Switch>
    </Suspense>
  </Fragment>
);

Routes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Routes);
