import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import MainLayout from './MainLayout';

import ServiceList from './routes/ServiceList';
import ServiceGraph from './routes/ServiceGraphRoute';
import ServiceMatrix from './routes/ServiceMatrix';
import ServiceTableRoute from './routes/ServiceTableRoute';
import Timeseries from './routes/TimeseriesRoute';
import ProfileRoute from './routes/ProfileRoute';
import AlarmRoute from './routes/AlarmRoute';
import AdminRoute from './routes/AdminRoute';

const AuthenticatedApp = ({ user }) => (
  <Router>
    <MainLayout user={user}>
      <Switch>
        <Route
          path="/"
          exact
          render={() => <Redirect to={{ pathname: '/services/graph' }} />}
        />
        <Route path="/profile" render={() => <ProfileRoute user={user} />} />
        <Route path="/services/graph" component={ServiceGraph} />
        <Route path="/services/matrix" component={ServiceMatrix} />
        <Route path="/services/table" component={ServiceTableRoute} />
        <Route path="/services" component={ServiceList} />
        <Route path="/alarms" component={AlarmRoute} />
        <Route path="/timeseries" component={Timeseries} />
        <Route path="/admin" component={AdminRoute} />

        <Route
          path="/login"
          exact
          render={() => <Redirect to={{ pathname: '/' }} />}
        />
        <Route
          path="/register"
          exact
          render={() => <Redirect to={{ pathname: '/' }} />}
        />
      </Switch>
    </MainLayout>
  </Router>
);

AuthenticatedApp.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default AuthenticatedApp;
