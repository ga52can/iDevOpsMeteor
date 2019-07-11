import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'reactjs-admin-lte';
import { withRouter } from 'react-router-dom';

import userRoles from '../../userRoles';

const Profile = ({ user, history }) => (
  <div>
    <section className="content-header">
      <h1>Profile</h1>
    </section>
    <section className="content">
      <Box>
        <Box.Body>
          <p>{user.username}</p>
          <p>{userRoles.find(role => role.value === user.profile.role).name}</p>
          <button
            type="button"
            onClick={() => {
              Meteor.logout();
              history.push('/');
            }}
          >
            Logout
          </button>
        </Box.Body>
      </Box>
    </section>
  </div>
);

Profile.propTypes = {
  user: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(Profile);
