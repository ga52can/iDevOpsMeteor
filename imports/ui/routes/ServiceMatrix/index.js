import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Row, Col } from 'react-bootstrap';
import Modal from 'react-responsive-modal';
import { Box } from 'reactjs-admin-lte';

import ModalView from './ModalView';
import Summary from './summary';
import EndpointsDiagram from './EndpointsDiagram';
import EndpointsDiagramSummary from './EndpointsSummaryDiagram';

import Services from '../../../api/services';
import Environments from '../../../api/environments';
import EnvironmentPicker from '../../components/EnvironmentPicker';
import './styles.css';
import Heading from '../../components/Heading';

class ServiceMatrix extends Component {
  state = {
    selectedBaseEnvironment: undefined,
    selectedTargetEnvironment: undefined,
    selectedServiceID: undefined,
    showModal: false,
    showModalResponse: false,
    inSync: true,
  };

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { environments } = nextProps;
    const { selectedBaseEnvironment } = this.state;
    const { selectedTargetEnvironment } = this.state;

    if (!selectedBaseEnvironment && environments.length > 0) {
      const defaultEnvironment = environments[0]._id;
      this.setState({ selectedBaseEnvironment: defaultEnvironment });
    }
    if (!selectedTargetEnvironment && environments.length > 0) {
      const defaultEnvironment = environments[0]._id;
      this.setState({ selectedTargetEnvironment: defaultEnvironment });
    }
  }

  changeBaseEnvironment = evt => {
    this.setState({ selectedBaseEnvironment: evt.target.value, inSync: true });
  };

  changeTargetEnvironment = evt => {
    this.setState({
      selectedTargetEnvironment: evt.target.value,
      inSync: true,
    });
  };

  updateModalView = service => {
    this.setState({
      selectedServiceID: service,
    });
    this.handleToggleModal();
  };

  updateModalViewResponse = service => {
    this.setState({
      selectedServiceID: service,
    });
    this.handleToggleModalResponse();
  };

  shortenServiceName = serviceName => serviceName.split('-')[2];

  pickColor = (service, service2, filteredBaseServices) => {
    const { inSync } = this.state;
    const connected = service.dependencies.includes(service2.name);
    const baseService1 = filteredBaseServices.find(
      filterService =>
        this.shortenServiceName(filterService.name) ===
        this.shortenServiceName(service.name),
    );
    const baseService2 = filteredBaseServices.find(
      filterService =>
        this.shortenServiceName(filterService.name) ===
        this.shortenServiceName(service2.name),
    );
    if (connected) {
      if (!baseService1 || !baseService2) {
        if (inSync) {
          this.setState({ inSync: false });
        }
        return 'missingService';
      }
      return 'connected';
    }
    if (baseService1 && baseService2) {
      const connectedBase = baseService1.dependencies.includes(
        baseService2.name,
      );
      if (connectedBase) {
        if (connected) {
          return 'connected';
        }
        if (inSync) {
          this.setState({ inSync: false });
        }
        return 'missingInTarget';
      }
    }
    return '';
  };

  handleToggleModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  handleToggleModalResponse = () => {
    const { showModalResponse } = this.state;
    this.setState({ showModalResponse: !showModalResponse });
  };

  render() {
    const { environments, services } = this.props;
    const { selectedBaseEnvironment } = this.state;
    const { selectedTargetEnvironment } = this.state;
    const { selectedServiceID } = this.state;
    const { showModal } = this.state;
    const { inSync } = this.state;
    const { showModalResponse } = this.state;

    const filteredBaseServices = services.filter(
      service => service.environment === selectedBaseEnvironment,
    );
    const filteredTargetServices = services.filter(
      service => service.environment === selectedTargetEnvironment,
    );
    const selectedBaseEnvironmentValues = Environments.findOne({
      _id: selectedBaseEnvironment,
    });
    const selectedTargetEnvironmentValues = Environments.findOne({
      _id: selectedTargetEnvironment,
    });

    let selectedService;
    let selectedBaseService;
    if (selectedServiceID) {
      selectedService = services.find(
        service => service._id === selectedServiceID,
      );
    } else {
      selectedService = services[0];
    }
    selectedBaseService = filteredBaseServices.find(
      service =>
        service.name.split('-')[2] === selectedService.name.split('-')[2],
    );

    return (
      <div id="service-matrix">
        <Heading text="Service Matrix" />
        <Grid>
          <Row>
            <Col md={3}>
              <EnvironmentPicker
                onChange={this.changeTargetEnvironment}
                environments={environments}
                value={selectedTargetEnvironment}
                title="Shown environment"
              />
            </Col>

            <Col md={3}>
              <EnvironmentPicker
                onChange={this.changeBaseEnvironment}
                environments={environments}
                value={selectedBaseEnvironment}
                title="Baseline environment"
              />
            </Col>
          </Row>
          <Row>
            <Box>
              <Box.Body>
                <Col md={6}>
                  <table className="service-matrix">
                    <thead>
                      <tr className="tr-first">
                        <th className="first" />
                        {filteredTargetServices.map(service => (
                          <th
                            key={service._id}
                            className="header"
                            onClick={() => {
                              this.updateModalView(service._id);
                            }}
                          >
                            <div>{this.shortenServiceName(service.name)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTargetServices.map(service => (
                        <tr key={service._id}>
                          <th
                            onClick={() => {
                              this.updateModalView(service._id);
                            }}
                          >
                            {this.shortenServiceName(service.name)}
                          </th>
                          {filteredTargetServices.map(service2 => (
                            <td
                              key={service2._id}
                              className={this.pickColor(
                                service,
                                service2,
                                filteredBaseServices,
                              )}
                              onClick={() => {
                                this.updateModalViewResponse(service._id);
                              }}
                            />
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <th>Dependency from</th>
                        <th colSpan={filteredTargetServices.length}>
                          Dependency to
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <table width="800" className="service-matrix">
                    <tbody>
                      <tr>
                        <th className="text-right"> Dependency synchron</th>
                        <td className="connected" />
                        <th className="text-right">
                          Service is missing in baseline environment
                        </th>
                        <td className="missingService" />
                        <th className="text-right">
                          Dependency only in shown environment
                        </th>
                        <td className="depOnlyTarget" />
                        <th className="text-right">
                          Dependency only in baseline environment
                        </th>
                        <td className="depOnlyBase" />
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Box.Body>
            </Box>
          </Row>
        </Grid>
        <Summary
          selectedService={filteredTargetServices}
          selectedTargetEnvironment={selectedTargetEnvironmentValues}
          selectedBaseService={filteredBaseServices}
          selectedBaseEnvironment={selectedBaseEnvironmentValues}
          inSync={inSync}
        />
        <EndpointsDiagramSummary
          selectedService={filteredTargetServices}
          selectedBaseService={filteredBaseServices}
        />
        <Modal
          open={showModalResponse}
          onClose={this.handleToggleModalResponse}
          center
        >
          <EndpointsDiagram
            selectedService={selectedService}
            selectedBaseService={selectedBaseService}
          />
        </Modal>
        <Modal
          open={showModal}
          onClose={this.handleToggleModal}
          max
          className="big-modal"
          max-width="1000px"
        >
          <ModalView
            selectedService={selectedService}
            selectedTargetEnvironment={selectedTargetEnvironmentValues}
            selectedBaseService={selectedBaseService}
            selectedBaseEnvironment={selectedBaseEnvironmentValues}
          />
        </Modal>
      </div>
    );
  }
}

ServiceMatrix.propTypes = {
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
  Meteor.subscribe('environments');
  Meteor.subscribe('services');
  return {
    environments: Environments.find({}).fetch(),
    services: Services.find({}).fetch(),
  };
})(ServiceMatrix);
