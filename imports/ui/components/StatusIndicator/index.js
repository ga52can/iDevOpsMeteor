import React from 'react';
import PropTypes from 'prop-types';

const mapStatusToTextcolor = status => {
  if (status === 'running' || status === 'healthy') {
    return 'text-green';
  }
  return '';
};

const StatusIndicator = ({ status }) => (
  <span className={mapStatusToTextcolor(status)}>{status}</span>
);

StatusIndicator.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusIndicator;
