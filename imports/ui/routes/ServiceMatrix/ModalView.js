import React from 'react';
import PropTypes from 'prop-types';

const formatName = name => name.split('-')[2];
const formatDevice = name => name.split('-')[1];
const formatPath = name => `${name.split('/')[2]}/${name.split('/')[3]}`;
const formatImageName = name => name.split('/')[1];

const ModalView = ({
  selectedService,
  selectedTargetEnvironment,
  selectedBaseService,
  selectedBaseEnvironment,
}) =>
  selectedService ? (
    <div className="env-table">
      <h2>{formatName(selectedService.name)}</h2>
      {selectedService && (
        <table className="table">
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>Environments </th>
              <td>{selectedTargetEnvironment.identifier}</td>
              <td>{selectedBaseEnvironment.identifier}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Image name</th>
              <td>{formatImageName(selectedService.dockerImage)}</td>
              <td>
                {selectedBaseService
                  ? formatImageName(selectedBaseService.dockerImage)
                  : `Service is not in ${
                      selectedBaseEnvironment.identifier
                    } env.`}
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Device name</th>
              <td>{formatDevice(selectedService.name)}</td>
              <td>
                {selectedBaseService
                  ? formatDevice(selectedBaseService.name)
                  : ''}
              </td>
            </tr>
            <tr key="name">
              <th style={{ textAlign: 'left', paddingRight: 10 }}>
                Image name
              </th>
              <td>{selectedService.apmData.name}</td>
              <td>
                {selectedBaseService ? selectedBaseService.apmData.name : ''}
              </td>
            </tr>
            <tr key="dependencies">
              <th style={{ textAlign: 'left', paddingRight: 10 }}>
                Dependencies
              </th>
              <td>
                <ul>
                  {selectedService.dependencies
                    .sort((a, b) => (a > b ? 1 : -1))
                    .map(dep => (
                      <li>{formatName(dep)}</li>
                    ))}
                </ul>
              </td>
              <td>
                <ul>
                  {selectedBaseService
                    ? selectedBaseService.dependencies
                      .sort((a, b) => (a > b ? 1 : -1))
                      .map(dep => <li>{formatName(dep)}</li>)
                    : ''}
                </ul>
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', paddingRight: 10 }}>Endpoints</th>
              <td>
                <ul>
                  {selectedService.endpoints &&
                    selectedService.endpoints
                      .sort((a, b) =>
                        a.http_url > b.http_url
                          ? 1
                          : a.http_url == b.http_url
                            ? 0
                            : -1,
                      )
                      .map(end => (
                        <li>{`${end.http_method}:${formatPath(
                          end.http_path,
                        )}`}</li>
                      ))}
                </ul>
              </td>
              <td>
                <ul>
                  {selectedBaseService
                    ? selectedBaseService.endpoints &&
                      selectedBaseService.endpoints
                        .sort((a, b) =>
                          a.http_url > b.http_url
                            ? 1
                            : a.http_url == b.http_url
                              ? 0
                              : -1,
                        )
                        .map(end => (
                          <li>
                            {`${end.http_method}:${formatPath(end.http_path)}`}
                          </li>
                        ))
                    : ''}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  ) : (
    <div>
      <h2>Click on service to view info</h2>
    </div>
  );

ModalView.propTypes = {
  selectedService: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    apmData: PropTypes.shape().isRequired,
  }),
  selectedBaseService: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    apmData: PropTypes.shape().isRequired,
  }),
  selectedTargetEnvironment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  }),
  selectedBaseEnvironment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  }),
};

ModalView.defaultProps = {
  selectedService: null,
  selectedBaseService: null,
  selectedTargetEnvironment: null,
  selectedBaseEnvironment: null,
};

export default ModalView;
