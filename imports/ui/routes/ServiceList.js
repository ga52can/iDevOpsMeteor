import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { Box } from 'reactjs-admin-lte';

import Services from '../../api/services';
import StatusIndicator from '../components/StatusIndicator';

const ServiceList = ({ services }) => (
  <div>
    <section className="content-header">
      <h1>Services</h1>
    </section>
    <section className="content">
      <Box>
        <Box.Body>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Dependencies</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>
                    <StatusIndicator status={service.status} />
                  </td>
                  <td>{service.dependencies.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box.Body>
      </Box>
    </section>
  </div>
);

ServiceList.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withTracker(() => ({
  services: Services.find({}).fetch(),
}))(ServiceList);
