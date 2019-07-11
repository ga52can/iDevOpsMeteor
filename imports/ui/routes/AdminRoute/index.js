import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Box } from 'reactjs-admin-lte';

const callPollDockerStats = () => Meteor.call('pollDockerStats');

const Admin = () => (
  <div>
    <section className="content-header">
      <h1>Admin</h1>
    </section>
    <section className="content">
      <Box>
        <Box.Body>
          <button
            className="btn btn-default"
            type="button"
            onClick={() => callPollDockerStats()}
          >
            Poll docker stats
          </button>
        </Box.Body>
      </Box>
    </section>
  </div>
);

export default Admin;
