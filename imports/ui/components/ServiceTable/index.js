import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { groupServicesByName, constructResponseTimes } from './utils';
import { nestedFilterMethod } from './filters';

const ServiceTable = ({ environments, services }) => (
  <ReactTable
    data={groupServicesByName(environments, services)}
    filterable
    collapseOnSortingChange={false}
    columns={[
      {
        Header: 'Environment',
        id: 'environment',
        accessor: d => d.environment.name,
        PivotValue: ({ value }) => value,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        filterMethod: nestedFilterMethod,
        aggregate: vals => (new Set(vals).size === 1 ? vals[0] : 'mixed'),
      },
      {
        Header: 'Health',
        accessor: 'health',
        filterMethod: nestedFilterMethod,
        aggregate: vals => (new Set(vals).size === 1 ? vals[0] : 'mixed'),
      },
      {
        Header: 'Dependencies',
        id: 'dependencies',
        accessor: d => d.dependencies.length,
      },
      {
        Header: 'Instances',
        id: 'instances',
        accessor: () => 1,
      },
      {
        Header: 'Docker image',
        accessor: 'dockerImage',
      },
      {
        Header: 'Memory',
        id: 'apmData.memoryStats',
        accessor: d => {
          if (d.apmData && Object.keys(d.apmData).length > 0) {
            return `${(
              (d.apmData.memoryStats.usage / d.apmData.memoryStats.limit) *
              100
            ).toFixed(2)} %`;
          }
          return 'No data';
        },
        aggregate: vals => {
          const numbers = vals.map(e => parseFloat(e));
          const average =
            numbers.reduce((sum, e) => sum + e, 0) / numbers.length;
          return `Ø ${average.toFixed(2)} %`;
        },
        filterable: false,
      },
      {
        Header: 'CPU',
        id: 'apmData.cpuPercent',
        accessor: d => `${(d.apmData.cpuPercent * 100).toFixed(2)} %`,
        aggregate: vals => {
          const numbers = vals.map(e => parseFloat(e));
          const average =
            numbers.reduce((sum, e) => sum + e, 0) / numbers.length;
          return `Ø ${average.toFixed(2)} %`;
        },
        filterable: false,
      },
      {
        Header: 'Response time',
        id: 'responseTime',
        accessor: d => {
          const r = constructResponseTimes(services, d);
          return r === 0 ? 'No endpoint' : `${r.toFixed(2)} ms`;
        },
        filterable: false,
      },
    ]}
    defaultPageSize={10}
    pivotBy={['environment']}
    className="-striped -highlight"
  />
);

ServiceTable.propTypes = {
  services: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  environments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ServiceTable;
