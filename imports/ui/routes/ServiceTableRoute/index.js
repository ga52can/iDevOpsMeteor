import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Box } from 'reactjs-admin-lte';

import Environments from '../../../api/environments';
import Services from '../../../api/services';
import ServiceTable from '../../components/ServiceTable';
import Heading from '../../components/Heading';

const ServiceTableRoute = ({ environments, services }) => (
  <div>
    <Heading text="Service Table"/>
    <Box>
      <Box.Body>
        <ServiceTable environments={environments} services={services} />
      </Box.Body>
    </Box>
  </div>
);

ServiceTableRoute.propTypes = {
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('services');
  Meteor.subscribe('environments');
  return {
    environments: Environments.find({}).fetch(),
    services: Services.find({}).fetch(),
  };
})(ServiceTableRoute);
