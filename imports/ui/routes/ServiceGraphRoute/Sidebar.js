import React from 'react';
import PropTypes from 'prop-types';

const formatName = name => name.split('-')[2];

const Sidebar = ({ selectedService }) =>
  selectedService ? (
    <div>
      <h2>{formatName(selectedService.name)}</h2>
      {selectedService && (
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <td>{selectedService._id}</td>
            </tr>
            <tr key="name">
              <th style={{ textAlign: 'left', paddingRight: 10 }}>
                Image name
              </th>
              <td>{selectedService.apmData.name}</td>
            </tr>
            <tr key="lastRead">
              <th style={{ textAlign: 'left', paddingRight: 10 }}>
                Last data read
              </th>
              <td>{selectedService.apmData.read}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  ) : (
    <div>
      <h2>Click on node to view info</h2>
    </div>
  );

Sidebar.propTypes = {
  selectedService: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    apmData: PropTypes.shape().isRequired,
  }),
};

Sidebar.defaultProps = {
  selectedService: null,
};

export default Sidebar;
