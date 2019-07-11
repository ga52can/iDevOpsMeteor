import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { Box } from 'reactjs-admin-lte';
import { Link, withRouter } from 'react-router-dom';

import Alarms from '/imports/api/alarms';

const options = [
  { name: 'Response time', value: 'response-time' },
  { name: 'CPU', value: 'cpu' },
  { name: 'Memory', value: 'memory' },
];

const operatorOptions = [
  { name: '>', value: '>' },
  { name: '<', value: '<' },
  { name: '>=', value: '>=' },
  { name: '<=', value: '<=' },
];

class AlarmCreate extends React.Component {
  state = {
    name: '',
    reference: '',
    operator: '',
    threshold: '',
    environment: '',
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { name, reference, operator, threshold } = this.state;
    Alarms.insert({ name, reference, operator, threshold });
  };

  render() {
    const { environments } = this.props;
    const { name, reference, operator, threshold, environment } = this.state;
    return (
      <Row>
        <Col xs={12} md={12}>
          <Box>
            <Box.Header>
              <Box.Title>Create alarm</Box.Title>
            </Box.Header>
            <Box.Body>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    onChange={evt => this.setState({ name: evt.target.value })}
                    value={name}
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={evt =>
                      this.setState({ environment: evt.target.value })
                    }
                    value={environment}
                  >
                    <option>Select reference environment</option>
                    {environments.map(option => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={evt =>
                      this.setState({ reference: evt.target.value })
                    }
                    value={reference}
                  >
                    <option>Select reference value</option>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={evt =>
                      this.setState({ operator: evt.target.value })
                    }
                    value={operator}
                  >
                    <option>Select comparison operator</option>
                    {operatorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="threshold"
                    className="form-control"
                    placeholder="Threshold"
                    onChange={evt =>
                      this.setState({ threshold: evt.target.value })
                    }
                    value={threshold}
                  />
                </div>
                <Link to="/alarms">
                  <Button className="btn btn-flat">Cancel</Button>
                </Link>{' '}
                <Button type="submit" className="btn btn-primary btn-flat">
                  Create
                </Button>
              </form>
            </Box.Body>
          </Box>
        </Col>
      </Row>
    );
  }
}

AlarmCreate.propTypes = {
  environments: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default withRouter(AlarmCreate);
