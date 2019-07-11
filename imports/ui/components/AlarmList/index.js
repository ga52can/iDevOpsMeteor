import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { Box } from 'reactjs-admin-lte';
import { Link } from 'react-router-dom';

const AlarmList = ({ alarms }) => (
  <div>
    <Row>
      <Col md={12}>
        <Link to="/alarms/create">
          <Button>Create alarm</Button>
        </Link>
        <br />
        <br />
      </Col>
    </Row>
    <Row>
      {alarms.map(alarm => (
        <Col xs={12} md={4} key={alarm._id}>
          <Box>
            <Box.Header>
              <Box.Title>{alarm.name}</Box.Title>
            </Box.Header>
            <Box.Body>
              {alarm.reference} {alarm.operator} {alarm.threshold}
            </Box.Body>
          </Box>
        </Col>
      ))}
    </Row>
  </div>
);

AlarmList.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

export default AlarmList;
