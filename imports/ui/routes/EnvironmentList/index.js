import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import { Box } from 'reactjs-admin-lte';

import Services from '../../../api/services';
import StatusIndicator from '../../components/StatusIndicator';
import './styles.css';

const renderEnvironments = (environments, renderEnvironment, header = false) =>
  environments
    .sort((a, b) => a.order - b.order)
    .map(environment =>
      header ? (
        <th key={environment._id}>{renderEnvironment(environment)}</th>
      ) : (
        <td key={environment._id}>{renderEnvironment(environment)}</td>
      ),
    );

const filterServices = (environment, services) =>
  services.filter(service => service.environment === environment._id);

const aggregateStatus = (environment, services) =>
  services
    .filter(service => service.environment === environment._id)
    .reduce(
      (previous, service) =>
        previous && !['healthy', 'running'].includes(service.status)
          ? previous
          : service.status,
      '?',
    );

const aggregateHealth = (environment, services) =>
  services
    .filter(service => service.environment === environment._id)
    .reduce(
      (previous, service) =>
        previous && service.health !== 'healthy' ? previous : service.health,
      '?',
    );

const renderCpuUsage = cpuPercent => `${(cpuPercent * 100).toFixed(2)} %`;
const renderMemoryUsage = memoryPercent => `${(memoryPercent * 100).toFixed(2)} %`;

const aggregateMemoryUsage = (environment, services) => {
  const memoryUsages = filterServices(environment, services).map(
    service => (
      typeof service.apmData.memoryStats !== 'undefined' ? service.apmData.memoryStats.usage / service.apmData.memoryStats.limit : 0),
  );

  const maxMemoryUsage = Math.max(...memoryUsages);
  const minMemoryUsage = Math.min(...memoryUsages);

  const avgMemoryUsage = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;

  return `${renderMemoryUsage(avgMemoryUsage)} (Min: ${renderMemoryUsage(
    minMemoryUsage,
  )}, Max: ${renderMemoryUsage(maxMemoryUsage)})`;
};

const aggregateCpuUsage = (environment, services) => {
  const cpuUsages = filterServices(environment, services).map(
    service => (typeof service.apmData !== 'undefined' ? service.apmData.cpuPercent : 0),
  );

  const maxCpuUsage = Math.max(...cpuUsages);
  const minCpuUsage = Math.min(...cpuUsages);

  const avgCpuUsage = cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length;

  return `${renderCpuUsage(avgCpuUsage)} (Min: ${renderCpuUsage(
    minCpuUsage,
  )}, Max: ${renderCpuUsage(maxCpuUsage)})`;
};

const aggregateServiceResponseTimes = service => {
  const responseTimes = (service.endpoints || []).map(
    endpoint => endpoint.avg_response_time,
  );

  return responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
};

const aggregateResponseTimes = services => {
  const averageServiceResponseTimes = services
    .map(aggregateServiceResponseTimes)
    .filter(rt => rt > 0);

  if (averageServiceResponseTimes.length < 1) {
    return 0;
  }

  const averageResponseTime =
    averageServiceResponseTimes.reduce((a, b) => a + b, 0) /
    averageServiceResponseTimes.length;
  const minResponseTime = Math.min(...averageServiceResponseTimes);
  const maxResponseTime = Math.max(...averageServiceResponseTimes);

  return `${averageResponseTime.toFixed(1)} ms (Min: ${minResponseTime.toFixed(
    1,
  )} ms, Max: ${maxResponseTime.toFixed(1)} ms)`;
};

const EnvironmentList = ({ environments, services }) => (
  <div className="env-table">
    <Box>
      <Box.Body>
        <table className="table">
          <thead>
            <tr>
              <th>Environment</th>
              {renderEnvironments(
                environments,
                environment => environment.name,
                true,
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>IP</th>
              {renderEnvironments(environments, environment => environment.ip)}
            </tr>
            <tr>
              <th>Status</th>
              {renderEnvironments(environments, environment => (
                <StatusIndicator
                  status={aggregateStatus(environment, services)}
                />
              ))}
            </tr>
{/*            <tr>
              <th>Health</th>
              {renderEnvironments(environments, environment => (
                <StatusIndicator
                  status={aggregateHealth(environment, services)}
                />
              ))}
            </tr>*/}
            <tr>
              <th>Services</th>
              {renderEnvironments(
                environments,
                environment => filterServices(environment, services).length,
              )}
            </tr>
            <tr>
              <th>Instances</th>
              {renderEnvironments(
                environments,
                environment => filterServices(environment, services).length,
              )}
            </tr>
            <tr>
              <th>CPU</th>
              {renderEnvironments(environments, environment =>
                aggregateCpuUsage(environment, services),
              )}
            </tr>
            <tr>
              <th>Memory</th>
              {renderEnvironments(environments, environment =>
                aggregateMemoryUsage(environment, services),
              )}
            </tr>
            <tr>
              <th>Response times</th>
              {renderEnvironments(environments, environment =>
                aggregateResponseTimes(filterServices(environment, services)),
              )}
            </tr>
          </tbody>
        </table>
      </Box.Body>
    </Box>
  </div>
);

EnvironmentList.propTypes = {
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
  return {
    services: Services.find({}).fetch(),
  };
})(EnvironmentList);
