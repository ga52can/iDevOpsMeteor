import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'reactjs-admin-lte';

import './styles.css';

const getAVGEdnpoints = selectedService => {
  const numberEndpoints = selectedService.reduce((count, act) => {
    if (act.endpoints) return count + act.endpoints.length;
    return count;
  }, 0);
  if (numberEndpoints == 0) return 'no endpoints';
  const sumEndpoints = selectedService.reduce((count, act) => {
    if (act.endpoints)
      return (
        count +
        act.endpoints.reduce(
          (sumend, actEnd) => sumend + actEnd.avg_response_time,
          0,
        )
      );
    return count;
  }, 0);
  return Math.round(sumEndpoints / numberEndpoints);
};

const Summary = ({
  selectedService,
  selectedTargetEnvironment,
  selectedBaseService,
  selectedBaseEnvironment,
  inSync,
}) => {
  let synced = '';
  inSync ? (synced = 'in Sync') : (synced = 'not synced');

  const dependenciesTarget = selectedService.reduce(
    (count, act) => count + act.dependencies.length,
    0,
  );
  const dependenciesBase = selectedBaseService.reduce(
    (count, act) => count + act.dependencies.length,
    0,
  );

  const endpointsTarget = selectedService.reduce((count, act) => {
    if (act.endpoints) return count + act.endpoints.length;
    return count;
  }, 0);
  const endpointsBase = selectedBaseService.reduce((count, act) => {
    if (act.endpoints) return count + act.endpoints.length;
    return count;
  }, 0);

  return (
    <div className="env-table">
      <section className="content-header">
        <h2>Summary</h2>
      </section>
      <section className="content">
        <Box>
          <Box.Body>
            <table className="table">
              <thead>
                <tr>
                  <th>Environment</th>
                  <td>
                    {selectedBaseEnvironment && selectedBaseEnvironment.name}
                  </td>
                  <td>
                    {selectedTargetEnvironment &&
                      selectedTargetEnvironment.name}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Status</th>
                  {
                    <td colSpan="2" className={synced.replace(/ /g, '')}>
                      {' '}
                      {synced}{' '}
                    </td>
                  }
                </tr>
                <tr>
                  <th>Number endpoints</th>
                  <td>{endpointsBase}</td>
                  <td>{endpointsTarget}</td>
                </tr>
                <tr>
                  <th>Number dependencies</th>
                  <td>{dependenciesBase}</td>
                  <td>{dependenciesTarget}</td>
                </tr>
                <tr>
                  <th>Average response time [ms]</th>
                  <td>{getAVGEdnpoints(selectedBaseService)}</td>
                  <td>{getAVGEdnpoints(selectedService)}</td>
                </tr>
              </tbody>
            </table>
          </Box.Body>
        </Box>
      </section>
    </div>
  );
};

Summary.propTypes = {
  selectedService: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dependencies: PropTypes.arrayOf(PropTypes.string).isOptional,
      endpoints: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          avg_response_time: PropTypes.number.isRequired,
        }),
      ).isOptional,
    }),
  ),
  selectedBaseService: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dependencies: PropTypes.arrayOf(PropTypes.string).isOptional,
      endpoints: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          avg_response_time: PropTypes.number.isRequired,
        }),
      ).isOptional,
    }),
  ),
  selectedTargetEnvironment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  }),
  selectedBaseEnvironment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  }),
  inSync: PropTypes.bool,
};

Summary.defaultProps = {
  selectedService: null,
  selectedBaseService: null,
  selectedTargetEnvironment: null,
  selectedBaseEnvironment: null,
  inSync: true,
};

export default Summary;
