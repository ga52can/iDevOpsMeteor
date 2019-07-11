import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';

const UnauthenticatedApp = () => (
  <Router>
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )}
      />
      <Route path="/login" component={LoginRoute} />
      <Route path="/register" component={RegisterRoute} />
    </Switch>
  </Router>
);

export default UnauthenticatedApp;
