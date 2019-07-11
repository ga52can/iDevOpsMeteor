import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';

const App = ({ user }) => {
  if (user === 'loading') {
    return <div>Loading</div>;
  }
  if (user) {
    return <AuthenticatedApp user={user} />;
  }
  return <UnauthenticatedApp />;
};

App.propTypes = {
  user: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
};

App.defaultProps = {
  user: 'loading',
};

export default createContainer(
  () => ({
    user: Meteor.user(),
  }),
  App,
);
